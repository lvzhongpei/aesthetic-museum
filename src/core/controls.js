import * as THREE from 'three';
import { RING_RADIUS } from './stage.js';
import { PLATE_Y } from './gallery.js';

/**
 * 轨道视角。
 *
 * 空间模型：观众站在环形展墙内部，视线始终沿半径向外，
 * 所以「横向拖拽 = 沿墙走」「推拉 = 走近展品」。没有自由飞行，
 * 因此不可能迷路，也不可能穿墙。
 */

const SPACING = (Math.PI * 2) / 12;

const OVERVIEW = { d: 2.0, y: 3.05 };
const FOCUS = { d: 6.5, y: 2.9 };
const D_MIN = 0;
const D_MAX = RING_RADIUS - 4.4;
const Y_MIN = 1.4;
const Y_MAX = 4.2;
const IDLE_DELAY = 15;
const IDLE_SPEED = 0.022;

const damp = (cur, target, lambda, dt) => cur + (target - cur) * (1 - Math.exp(-lambda * dt));

export function createControls(camera, opts = {}) {
  const count = opts.count || 12;
  const spacing = (Math.PI * 2) / count;

  const state = {
    azimuth: 0,
    azimuthTarget: 0,
    d: OVERVIEW.d,
    dTarget: OVERVIEW.d,
    y: OVERVIEW.y,
    yTarget: OVERVIEW.y,
    mode: 'overview',
    focusIndex: null,
    dragging: false,
    lastInput: performance.now(),
    allowIdle: true,
  };

  const pickCbs = new Set();
  const focusCbs = new Set();

  const canvas = opts.canvas;
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let startAz = 0;
  let startYv = 0;
  let moved = 0;
  let downTime = 0;
  let pinchStart = 0;
  const active = new Map();

  const ndc = new THREE.Vector2();

  function idle() {
    state.lastInput = performance.now();
  }

  function nearestIndex(a) {
    let idx = Math.round(a / spacing);
    return ((idx % count) + count) % count;
  }

  function setFocus(index, immediate = false) {
    if (index == null) {
      state.mode = 'overview';
      state.focusIndex = null;
      state.dTarget = OVERVIEW.d;
      state.yTarget = OVERVIEW.y;
    } else {
      const i = ((index % count) + count) % count;
      state.mode = 'focus';
      state.focusIndex = i;
      const a = i * spacing;
      // 选择最接近当前朝向的等价角度，避免绕远路
      state.azimuthTarget = a + Math.round((state.azimuth - a) / (Math.PI * 2)) * Math.PI * 2;
      state.dTarget = FOCUS.d;
      state.yTarget = FOCUS.y;
    }
    if (immediate) {
      state.azimuth = state.azimuthTarget;
      state.d = state.dTarget;
      state.y = state.yTarget;
    }
    focusCbs.forEach((fn) => fn(state.focusIndex));
  }

  function step(delta) {
    const next = (state.focusIndex == null ? 0 : state.focusIndex + delta + count) % count;
    setFocus(next);
  }

  function emitFocusIfChanged() {
    if (state.mode !== 'focus') return;
    const i = nearestIndex(state.azimuthTarget);
    if (i !== state.focusIndex) {
      state.focusIndex = i;
      focusCbs.forEach((fn) => fn(i));
    }
  }

  /* ── 指针 ── */

  function onPointerDown(e) {
    canvas.setPointerCapture?.(e.pointerId);
    active.set(e.pointerId, { x: e.clientX, y: e.clientY });
    idle();
    if (active.size === 1) {
      state.dragging = true;
      pointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      startAz = state.azimuthTarget;
      startYv = state.yTarget;
      moved = 0;
      downTime = performance.now();
    } else if (active.size === 2) {
      const pts = [...active.values()];
      pinchStart = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      state.dragging = false;
    }
  }

  function onPointerMove(e) {
    if (!active.has(e.pointerId)) return;
    active.set(e.pointerId, { x: e.clientX, y: e.clientY });
    idle();

    if (active.size === 2) {
      const pts = [...active.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      if (pinchStart > 0) {
        const k = (pinchStart - dist) * 0.022;
        state.dTarget = THREE.MathUtils.clamp(state.dTarget + k, D_MIN, D_MAX);
      }
      pinchStart = dist;
      return;
    }

    if (!state.dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    moved = Math.max(moved, Math.hypot(dx, dy));
    const perPx = (Math.PI / window.innerWidth) * 1.9;
    state.azimuthTarget = startAz - dx * perPx;
    state.yTarget = THREE.MathUtils.clamp(startYv + dy * 0.006, Y_MIN, Y_MAX);
    if (state.mode === 'focus') emitFocusIfChanged();
  }

  function onPointerUp(e) {
    active.delete(e.pointerId);
    if (active.size < 2) pinchStart = 0;
    if (e.pointerId !== pointerId) return;
    state.dragging = false;
    pointerId = null;

    const isClick = moved < 7 && performance.now() - downTime < 460;
    if (isClick) {
      const rect = canvas.getBoundingClientRect();
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      pickCbs.forEach((fn) => fn(ndc, e));
    } else if (state.mode === 'focus') {
      // 松手后吸附到最近的展位，像沿着展墙走了一步
      const i = nearestIndex(state.azimuthTarget);
      const a = Math.round(state.azimuthTarget / spacing) * spacing;
      state.azimuthTarget = a;
      if (i !== state.focusIndex) {
        state.focusIndex = i;
        focusCbs.forEach((fn) => fn(i));
      }
    }
  }

  function onWheel(e) {
    e.preventDefault();
    idle();
    state.dTarget = THREE.MathUtils.clamp(state.dTarget + e.deltaY * 0.0042, D_MIN, D_MAX);
    if (state.mode !== 'focus' && state.dTarget > 4.2) {
      // 推近到一定程度就自动进入最近的展位，不必先点
      const i = nearestIndex(state.azimuthTarget);
      setFocus(i);
    } else if (state.mode === 'focus' && state.dTarget < 2.6) {
      setFocus(null);
    }
  }

  function onKey(e) {
    if (e.key === 'ArrowRight') {
      idle();
      if (state.mode === 'focus') step(1);
      else {
        state.azimuthTarget += spacing;
      }
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      idle();
      if (state.mode === 'focus') step(-1);
      else {
        state.azimuthTarget -= spacing;
      }
      e.preventDefault();
    } else if (e.key === 'Escape') {
      setFocus(null);
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
    const nowMs = performance.now();
    const idleFor = (nowMs - state.lastInput) / 1000;
    if (state.mode === 'overview' && !state.dragging && state.allowIdle && idleFor > IDLE_DELAY) {
      state.azimuthTarget += IDLE_SPEED * dt;
    }

    state.azimuth = damp(state.azimuth, state.azimuthTarget, 7.5, dt);
    state.d = damp(state.d, state.dTarget, 4.2, dt);
    state.y = damp(state.y, state.yTarget, 5.0, dt);

    const a = state.azimuth;
    outward.set(Math.sin(a), 0, Math.cos(a));
    camera.position.set(outward.x * state.d, state.y, outward.z * state.d);
    lookAt.set(outward.x * RING_RADIUS, PLATE_Y, outward.z * RING_RADIUS);
    camera.lookAt(lookAt);
  }

  return {
    state,
    update,
    setFocus,
    step,
    nearestIndex,
    onPick(fn) {
      pickCbs.add(fn);
      return () => pickCbs.delete(fn);
    },
    onFocus(fn) {
      focusCbs.add(fn);
      return () => focusCbs.delete(fn);
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
