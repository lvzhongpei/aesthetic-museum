import * as THREE from 'three';
import { hexToHsl, hslToHex, luminance } from './color.js';

/**
 * 展区氛围 —— 暗场版（垂直展塔）。
 *
 * 12 件藏品共享同一座塔：暗色石材墙面、镜面墙裙、黑顶封口。
 * 切件时所有色彩只驱动五样东西：墙的自发光洗墙光、顶/底封口、墙裙反光、
 * 主光色、射灯色。这是真实美术馆夜场的做法 ——「空间不变，光变」。
 */

const LERP_KEYS = ['wall', 'cap', 'base', 'key', 'rim', 'spot', 'accent', 'fog', 'text'];

export function atmosphereFrom(ex) {
  const a = ex.atmosphere || {};
  const sw = ex.swatches.map((s) => s.hex);
  const accent = a.accent || sw[0];
  const seed = a.ambient || sw[4] || sw[3] || accent;

  const hSeed = hexToHsl(seed).h;
  const hAcc = hexToHsl(accent).h;
  const avg = sw.reduce((s, c) => s + luminance(c), 0) / sw.length;
  // 整体明度决定"空气浓度"；高调流派（北欧、侘寂）墙会亮一档
  const air = Math.max(0, Math.min(1, (avg - 0.08) / 0.62));
  const wallL = 0.115 + air * 0.06;
  const baseL = 0.085 + air * 0.05;

  return {
    wall: hslToHex(hSeed, 0.15, wallL),
    cap: hslToHex(hSeed, 0.18, 0.07),
    base: hslToHex(hSeed, 0.1, baseL),
    key: hslToHex(hAcc, 0.09, 0.94),
    rim: hslToHex(hAcc, 0.7, 0.56),
    spot: hslToHex(hAcc, 0.08, 0.98),
    fog: hslToHex(hSeed, 0.26, 0.06),
    accent,
    text: '#F1F0EB',
  };
}

function toSet(src) {
  const out = {};
  LERP_KEYS.forEach((k) => {
    out[k] = new THREE.Color(src[k]);
  });
  return out;
}

export function createAtmosphere(stage, initial) {
  const from = toSet(initial);
  const to = toSet(initial);
  const now = toSet(initial);
  let t = 1;
  let duration = 0.9;
  let dim = 0;
  let doorway = 1;
  let accentHex = initial.accent;
  let textHex = initial.text;

  function snapshot() {
    LERP_KEYS.forEach((k) => from[k].copy(now[k]));
  }

  function set(next, opts = {}) {
    const { immediate = false, doorway: door = true } = opts;
    if (immediate) {
      LERP_KEYS.forEach((k) => {
        from[k].set(next[k]);
        to[k].set(next[k]);
        now[k].set(next[k]);
      });
      t = 1;
      dim = 0;
    } else {
      snapshot();
      LERP_KEYS.forEach((k) => to[k].set(next[k]));
      t = 0;
      doorway = door ? 1 : 0;
    }
    accentHex = next.accent;
    textHex = next.text;
    apply();
  }

  function apply() {
    const { lights, mats, scene } = stage;

    lights.hemi.color.copy(now.fog);
    lights.key.color.copy(now.key);
    lights.rim.color.copy(now.rim);
    lights.spot.color.copy(now.spot);

    if (scene.fog) scene.fog.color.copy(now.fog);

    if (mats.wall) {
      mats.wall.color.copy(now.wall);
      if (mats.wall.emissive) mats.wall.emissive.copy(now.wall).multiplyScalar(1.25);
    }
    if (mats.side && mats.side.emissive) mats.side.emissive.copy(now.fog).multiplyScalar(0.9);
    if (mats.back && mats.back.emissive) mats.back.emissive.copy(now.fog).multiplyScalar(0.7);
    if (mats.cap) {
      mats.cap.color.copy(now.cap);
      if (mats.cap.emissive) mats.cap.emissive.copy(now.cap).multiplyScalar(1.1);
    }
    if (mats.base) {
      mats.base.color.copy(now.base);
    }
  }

  function update(dt) {
    if (t < 1) {
      t = Math.min(1, t + dt / duration);
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      LERP_KEYS.forEach((k) => {
        now[k].copy(from[k]).lerp(to[k], e);
      });
      dim = Math.sin(t * Math.PI) * 0.18 * doorway;
    } else if (dim !== 0) {
      dim = 0;
    }
    return dim;
  }

  apply();

  return {
    set,
    update,
    get dim() {
      return dim;
    },
    get transition() {
      return t < 1 ? Math.sin(t * Math.PI) * doorway : 0;
    },
    get transitioning() {
      return t < 1;
    },
    get accent() {
      return accentHex;
    },
    get accentColor() {
      return now.accent;
    },
    get text() {
      return textHex;
    },
    get current() {
      return now;
    },
  };
}

export default createAtmosphere;
