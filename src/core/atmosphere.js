import * as THREE from 'three';
import { hexToHsl, hslToHex, luminance } from './color.js';

/**
 * 展区氛围 —— 暗场版。
 *
 * 十二间展室共用同一套暗场建筑（深石材地面、黑顶、抛光反射），
 * 差异全部来自「色相 + 光色 + 发光边的颜色」。
 * 这不是偷懒：真实的暗场美术馆正是这样做的——空间不变，光变。
 * 每切一间，观众感到的是"空气变了颜色"，而不是"换了个网站"。
 */

const LERP_KEYS = [
  'ambient',
  'ground',
  'key',
  'rim',
  'floor',
  'wall',
  'ceiling',
  'fog',
  'accent',
  'strip',
  'text',
];

/**
 * 从流派色板推出一套暗场色板。只用三个输入：
 *   强调色（取色板第一色）、色相种子（取环境色或末位色）、整套色板的整体明度。
 * 整体明度决定这间展室的「空气浓度」——高调的流派（北欧、侘寂）房间会亮一档。
 */
export function atmosphereFrom(ex) {
  const a = ex.atmosphere || {};
  const sw = ex.swatches.map((s) => s.hex);
  const accent = a.accent || sw[0];
  const seed = a.ambient || sw[4] || sw[3] || accent;

  const hSeed = hexToHsl(seed).h;
  const hAcc = hexToHsl(accent).h;

  const avg = sw.reduce((s, c) => s + luminance(c), 0) / sw.length;
  const air = Math.max(0, Math.min(1, (avg - 0.08) / 0.62));
  const wallL = 0.15 + air * 0.062;
  const floorL = 0.095 + air * 0.05;

  return {
    ambient: hslToHex(hSeed, 0.28, 0.095 + air * 0.05),
    ground: hslToHex(hSeed, 0.22, 0.04),
    key: hslToHex(hAcc, 0.09, 0.94),
    rim: hslToHex(hAcc, 0.7, 0.56),
    floor: hslToHex(hSeed, 0.16, floorL),
    wall: hslToHex(hSeed, 0.15, wallL),
    ceiling: hslToHex(hSeed, 0.18, 0.07),
    fog: hslToHex(hSeed, 0.26, 0.055),
    accent,
    strip: hslToHex(hAcc, 0.05, 0.96),
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

  const tmp = new THREE.Color();

  function snapshot() {
    LERP_KEYS.forEach((k) => {
      from[k].copy(now[k]);
    });
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
    const { lights, mats, scene, mirror } = stage;
    lights.hemi.color.copy(now.ambient);
    lights.hemi.groundColor.copy(now.ground);
    lights.key.color.copy(now.key);
    lights.rim.color.copy(now.rim);
    lights.fill.color.copy(now.accent);
    lights.spot.color.copy(now.key);

    scene.background.copy(now.fog);
    scene.fog.color.copy(now.fog);

    mats.floor.color.copy(now.floor);
    mats.wall.color.copy(now.wall);
    mats.ceiling.color.copy(now.ceiling);
    if (mats.cap) mats.cap.color.copy(now.ceiling);

    // 洗墙光：环形内墙靠平行光照不到（几何上的必然），
    // 所以墙面亮度由自发光梯度承担 —— 这也正是真实展厅的做法。
    if (mats.wall.emissive) mats.wall.emissive.copy(now.wall).multiplyScalar(1.3);
    if (mats.floor.emissive) mats.floor.emissive.copy(now.floor).multiplyScalar(0.9);
    if (mats.ceiling.emissive) mats.ceiling.emissive.copy(now.ceiling).multiplyScalar(1.2);
    if (mats.cap && mats.cap.emissive) mats.cap.emissive.copy(now.ceiling).multiplyScalar(1.2);
    mats.disc.color.copy(now.accent);
    mats.strip.color.copy(now.strip);
    mats.trim.color.copy(now.fog).multiplyScalar(0.6);

    // 反射镜面跟着染色，倒影才不会和房间脱节
    if (mirror && mirror.material && mirror.material.uniforms && mirror.material.uniforms.color) {
      mirror.material.uniforms.color.value.copy(now.floor).multiplyScalar(3.8);
    }
  }

  function update(dt) {
    if (t < 1) {
      t = Math.min(1, t + dt / duration);
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; // easeInOutCubic
      LERP_KEYS.forEach((k) => {
        tmp.copy(from[k]);
        tmp.lerp(to[k], e);
        now[k].copy(tmp);
      });
      // 门廊压暗；暗场里幅度必须收小，否则中段会黑成一片
      dim = Math.sin(t * Math.PI) * 0.2 * doorway;
      apply();
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
    /** 0→1→0 的过渡脉冲，交给后期调色做暗角收紧与色散放大 */
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
