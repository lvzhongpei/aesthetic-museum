import * as THREE from 'three';
import { RING_RADIUS } from './stage.js';
import { PLATE_Y } from './gallery.js';

/**
 * 轨道视角 —— 一次滑动，切换一件。
 *
 * 空间模型：观众站在环形展墙内部，视线始终沿半径向外。
 * 但横向拖拽不再是"自由旋转"——那会让人滑过头，也会让画面一直在动。
 * 现在的规则是：一次拖拽 = 走一个展位，松手后镜头自行缓动停稳。
 * 于是展厅是静的，只有"换间"这一个动作。
 */

const OVERVIEW = { d: 2.25, y: 3.05 };
const FOCUS = { d: 5.95, y: 2.95 };
const INTRO = { d0: 0.55, y0: 6.5 };
const D_MIN = 0;
const D_MAX = RING_RADIUS - 4.4;
const Y_MIN = 1.5;
const Y_MAX = 4.3;

/** 拖拽多少像素才算"滑了一下" */
const SWIPE = 46;
/** 拖拽时的跟手幅度上限（占一个展位间距的比例），只给手感，不让相机真的转开 */
const DRAG_LEAN = 0.22;
const INTRO_SECONDS = 2.7;

const damp = (cur, target, lambda, dt) => cur + (target - cur) * (1 - Math.exp(-lambda * dt));
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function createControls(camera, opts = {}) {
  const count = opts.count || 12;
  const spacing = (Math.PI * 2) / count;
  const canvas = opts.canvas;

  const state = {
    index: 0,
    mode: 'overview',
    dragging: false,
    azimuth: 0,
    azimuthTarget: 0,
    /** 拖拽中的视觉偏移（弧度），松手归零 */
    dragLean: 0,
    d: OVERVIEW.d,
    dTarget: OVERVIEW.d,
    y: OVERVIEW.y,
    yTarget: OVERVIEW.y,
    /** 切换展位时的一次轻微推进，制造"走过门洞"的体感 */
    push: 0,
    intro: 0,
  };

  let introDone = false;
  let introT = 0;

  const changeCbs = new Set();
  const pickCbs = new Set();
  let prevSig = '__init__';

  function emit(force = false) {
    const sig = `${state.index}|${state.mode}`;
    if (!force && sig === prevSig) return;
    prevSig = sig;
    changeCbs.forEach((fn) =>
      fn({ index: state.index, focus: state.mode === 'focus' ? state.index : null }),
    );
  }

  const azFor = (i) => i * spacing;

  function step(delta) {
    const next = (((state.index + delta) % count) + count) % count;
    if (next === state.index) return;
    state.index = next;
    state.azimuthTarget = azFor(next);
    state.push = 1;
    emit();
  }

  function goto(i, immediate = false) {
    const idx = ((Math.round(i) % count) + count) % count;
    state.index = idx;
    state.azimuthTarget = azFor(idx);
    if (immediate) {
      state.azimuth = state.azimuthTarget;
      state.d = state.dTarget;
      state.y = state.yTarget;
      introT = 1;
      introDone = true;
    }
    emit();
  }

  function setFocus(on) {
    const want = !!on;
    if (want === (state.mode === 'focus')) return;
    state.mode = want ? 'focus' : 'overview';
    state.dTarget = want ? FOCUS.d : OVERVIEW.d;
    state.yTarget = want ? FOCUS.y : OVERVIEW.y;
    state.push = 1;
    emit();
  }

  /* ── 指针 ── */

  const active = new Map();
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let startYv = 0;
  let moved = 0;
  let downTime = 0;
  let pinchStart = 0;
  const ndc = new THREE.Vector2();

  function onPointerDown(e) {
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch (err) {
      /* 部分环境不支持指针捕获，忽略 */
    }
    active.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (active.size === 1) {
      state.dragging = true;
      pointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      startYv = state.yTarget;
      moved = 0;
      downTime = performance.now();
    } else if (active.size === 2) {
      const pts = [...active.values()];
      pinchStart = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      state.dragging = false;
      state.dragLean = 0;
    }
  }

  function onPointerMove(e) {
    if (!active.has(e.pointerId)) return;
    active.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (active.size === 2) {
      const pts = [...active.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      if (pinchStart > 0) {
        state.dTarget = THREE.MathUtils.clamp(
          state.dTarget + (pinchStart - dist) * 0.022,
          D_MIN,
          D_MAX,
        );
      }
      pinchStart = dist;
      return;
    }

    if (!state.dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    moved = Math.max(moved, Math.hypot(dx, dy));

    // 跟手：只给极小一段偏移，并随拖拽距离迅速饱和。
    // 手感还在，相机却永远不会滑过头。
    const norm = THREE.MathUtils.clamp(dx / (SWIPE * 2.6), -1, 1);
    state.dragLean = -norm * spacing * DRAG_LEAN;
    state.yTarget = THREE.MathUtils.clamp(startYv + dy * 0.006, Y_MIN, Y_MAX);
  }

  function onPointerUp(e) {
    active.delete(e.pointerId);
    if (active.size < 2) pinchStart = 0;
    if (e.pointerId !== pointerId) return;
    state.dragging = false;
    pointerId = null;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const isClick = moved < 7 && performance.now() - downTime < 460;
    state.dragLean = 0;

    if (isClick) {
      const rect = canvas.getBoundingClientRect();
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      pickCbs.forEach((fn) => fn(ndc, e));
      return;
    }

    // 一次滑动 = 一件。无论拖多远，都只走一格。
    if (Math.abs(dx) >= SWIPE) {
      step(dx < 0 ? 1 : -1);
    } else if (Math.abs(dy) > SWIPE * 1.5 && state.mode === 'focus') {
      setFocus(false);
    }
  }

  function onWheel(e) {
    e.preventDefault();
    state.dTarget = THREE.MathUtils.clamp(state.dTarget + e.deltaY * 0.0042, D_MIN, D_MAX);
    if (state.mode !== 'focus' && state.dTarget > 4.4) setFocus(true);
    else if (state.mode === 'focus' && state.dTarget < 2.8) setFocus(false);
  }

  function onKey(e) {
    if (e.key === 'ArrowRight') {
      step(1);
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      step(-1);
      e.preventDefault();
    } else if (e.key === 'Escape') {
      setFocus(false);
    } else if (e.key === 'Enter' || e.key === ' ') {
      setFocus(!(state.mode === 'focus'));
      e.preventDefault();
    }
  }

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);
  canvas.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKey);

  /* ── 每帧 ── */

  const outward = new THREE.Vector3();
  const lookAt = new THREE.Vector3();

  function update(dt) {
    if (!introDone) {
      introT = Math.min(1, introT + dt / INTRO_SECONDS);
      const e = easeOutCubic(introT);
      state.d = THREE.MathUtils.lerp(INTRO.d0, OVERVIEW.d, e);
      state.y = THREE.MathUtils.lerp(INTRO.y0, OVERVIEW.y, e);
      state.dTarget = OVERVIEW.d;
      state.yTarget = OVERVIEW.y;
      state.intro = introT;
      if (introT >= 1) {
        introDone = true;
        emit(true);
      }
    } else {
      state.d = damp(state.d, state.dTarget, 3.4, dt);
      state.y = damp(state.y, state.yTarget, 4.2, dt);
    }

    const lambda = state.mode === 'focus' ? 4.6 : 3.5;
    state.azimuth = damp(state.azimuth, state.azimuthTarget, lambda, dt);
    state.push = damp(state.push, 0, 3.0, dt);

    const a = state.azimuth + state.dragLean;
    // 换间时向前推一点点，像走过门洞时脚步的那一下
    const dEff = state.d + state.push * 0.85;

    outward.set(Math.sin(a), 0, Math.cos(a));
    camera.position.set(outward.x * dEff, state.y, outward.z * dEff);
    lookAt.set(outward.x * RING_RADIUS, PLATE_Y, outward.z * RING_RADIUS);
    camera.lookAt(lookAt);
  }

  return {
    state,
    update,
    step,
    goto,
    setFocus,
    get introDone() {
      return introDone;
    },
    /** 入场进度，交给外部做曝光与 HUD 的淡入 */
    get reveal() {
      return introDone ? 1 : easeInOutCubic(introT);
    },
    onChange(fn) {
      changeCbs.add(fn);
      return () => changeCbs.delete(fn);
    },
    onPick(fn) {
      pickCbs.add(fn);
      return () => pickCbs.delete(fn);
    },
    dispose() {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
    },
  };
}
