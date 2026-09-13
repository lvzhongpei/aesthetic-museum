import * as THREE from 'three';
import { WALL_X, BAY, slotY } from './stage.js';

/**
 * 垂直升降 —— 一次滑动，切换一件。
 *
 * 空间模型：观众面对塔内那堵高墙，沿垂直轴升降。视线始终正对墙面，
 * 所以手指上滑 = 塔往下走一格 = 看到下面那一件。这和手机上滑列表完全一致：
 * 内容跟着手指走。
 *
 * 关于「手势与标尺是否同号」——在跟手拖动里这两者必然反向
 * （视口朝手指的反方向移动，所有手机列表都如此）。
 * 能做而且已经做到的是让它们**同轴**：都是竖向。这正是这次改造要修的问题。
 */

/** 相机到墙的距离（米） */
const DIST = { overview: 9.6, focus: 5.9 };
const DIST_MIN = 3.8;
const DIST_MAX = 14.5;

/** 相机相对当前展品的抬升与注视点偏移 —— 略微俯视，让展签一起进画面 */
const CAM = {
  overview: { lift: 1.6, aim: -0.12 },
  focus: { lift: 0.95, aim: -0.05 },
};

const INTRO = { dist: 15.5, lift: 11, seconds: 2.8 };

/** 拖拽多少像素才算「滑了一下」 */
const SWIPE = 46;
/** 跟手预览幅度，占一个展位节距的比例 —— 只给手感，不让画面真的滑过头 */
const DRAG_LEAN = 0.26;

const damp = (cur, target, lambda, dt) => cur + (target - cur) * (1 - Math.exp(-lambda * dt));
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function createControls(camera, opts = {}) {
  const count = opts.count || 12;
  const canvas = opts.canvas;

  const state = {
    index: 0,
    mode: 'overview',
    dragging: false,
    y: 0,
    yTarget: 0,
    dist: DIST.overview,
    distTarget: DIST.overview,
    lift: CAM.overview.lift,
    liftTarget: CAM.overview.lift,
    goal: CAM.overview.aim,
    goalTarget: CAM.overview.aim,
    /** 跟手预览：会很快饱和的额外位移 */
    lean: 0,
    /** 换件时的一次轻微推进 */
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

  function applyMode() {
    const c = state.mode === 'focus' ? CAM.focus : CAM.overview;
    state.liftTarget = c.lift;
    state.goalTarget = c.aim;
    state.distTarget = state.mode === 'focus' ? DIST.focus : DIST.overview;
    state.yTarget = slotY(state.index) + c.lift;
  }

  function step(delta) {
    const next = state.index + delta;
    if (next < 0 || next >= count) {
      // 塔有顶有底，到端头就停住，不循环 —— 循环是环形展厅才需要的
      state.push = 0.55;
      return;
    }
    state.index = next;
    state.yTarget = slotY(next) + state.liftTarget;
    state.push = 1;
    emit();
  }

  function goto(i, immediate = false) {
    const idx = Math.max(0, Math.min(count - 1, Math.round(i)));
    state.index = idx;
    state.yTarget = slotY(idx) + state.liftTarget;
    if (immediate) {
      state.y = state.yTarget;
      state.dist = state.distTarget;
      state.lift = state.liftTarget;
      state.goal = state.goalTarget;
      introT = 1;
      introDone = true;
    }
    emit();
  }

  function setFocus(on) {
    const want = !!on;
    if (want === (state.mode === 'focus')) return;
    state.mode = want ? 'focus' : 'overview';
    applyMode();
    state.yTarget = slotY(state.index) + state.liftTarget;
    state.push = 1;
    emit();
  }

  /* ── 指针 ── */

  const active = new Map();
  let pointerId = null;
  let startX = 0;
  let startY = 0;
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
      moved = 0;
      downTime = performance.now();
    } else if (active.size === 2) {
      const pts = [...active.values()];
      pinchStart = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      state.dragging = false;
      state.lean = 0;
    }
  }

  function onPointerMove(e) {
    if (!active.has(e.pointerId)) return;
    active.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (active.size === 2) {
      const pts = [...active.values()];
      const d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      if (pinchStart > 0) {
        state.distTarget = THREE.MathUtils.clamp(
          state.distTarget + (pinchStart - d) * 0.02,
          DIST_MIN,
          DIST_MAX,
        );
      }
      pinchStart = d;
      return;
    }

    if (!state.dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    moved = Math.max(moved, Math.hypot(dx, dy));

    // 跟手预览：手指上移（dy<0）→ 相机往下走一格 → 下一件进入画面。
    // 幅度随拖拽距离迅速饱和，所以画面上永远不会真的滑过头。
    const norm = THREE.MathUtils.clamp(dy / (SWIPE * 2.6), -1, 1);
    state.lean = norm * BAY * DRAG_LEAN;
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
    state.lean = 0;

    if (isClick) {
      const rect = canvas.getBoundingClientRect();
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      pickCbs.forEach((fn) => fn(ndc, e));
      return;
    }

    // 一次滑动 = 一件。手指上滑前进，无论拖多远都只走一格。
    if (Math.abs(dy) >= SWIPE && Math.abs(dy) > Math.abs(dx)) {
      step(dy < 0 ? 1 : -1);
    } else if (Math.abs(dx) > SWIPE * 1.5 && state.mode === 'focus') {
      setFocus(false);
    }
  }

  function onWheel(e) {
    e.preventDefault();
    state.distTarget = THREE.MathUtils.clamp(
      state.distTarget + e.deltaY * 0.0045,
      DIST_MIN,
      DIST_MAX,
    );
    if (state.mode !== 'focus' && state.distTarget < 4.9) setFocus(true);
    else if (state.mode === 'focus' && state.distTarget > 7.8) setFocus(false);
  }

  function onKey(e) {
    if (e.key === 'ArrowDown') {
      step(1);
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      step(-1);
      e.preventDefault();
    } else if (e.key === 'PageDown') {
      step(1);
      e.preventDefault();
    } else if (e.key === 'PageUp') {
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

  const aim = new THREE.Vector3();

  function update(dt) {
    if (!introDone) {
      // 入场进度只能前进：外部若传入异常 dt（负值 / 巨大值）也不会把它推回去
      introT = Math.max(0, Math.min(1, introT + dt / INTRO.seconds));
      const e = easeOutCubic(introT);
      state.dist = THREE.MathUtils.lerp(INTRO.dist, DIST.overview, e);
      state.y = slotY(0) + THREE.MathUtils.lerp(INTRO.lift, CAM.overview.lift, e);
      state.lift = CAM.overview.lift;
      state.goal = CAM.overview.aim;
      state.distTarget = DIST.overview;
      state.yTarget = slotY(0) + CAM.overview.lift;
      state.intro = introT;
      if (introT >= 1) {
        introDone = true;
        emit(true);
      }
    } else {
      state.dist = damp(state.dist, state.distTarget, 3.4, dt);
      state.lift = damp(state.lift, state.liftTarget, 4.0, dt);
      state.goal = damp(state.goal, state.goalTarget, 4.0, dt);
      state.y = damp(state.y, state.yTarget, 3.6, dt);
    }

    state.push = damp(state.push, 0, 3.0, dt);

    const yNow = state.y + state.lean + state.push * 0.75;
    camera.position.set(WALL_X - state.dist, yNow, 0);
    // 注视点固定在展墙上，随时间平滑跟随；不叠加 lean，否则拖动时画面会反向甩
    aim.set(WALL_X, state.y - state.lift + state.goal + state.push * 0.75, 0);
    camera.lookAt(aim);
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
