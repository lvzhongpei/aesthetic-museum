import * as THREE from 'three';

/**
 * 展区氛围 —— 每进入一个展区，环境光、主光、地面、墙面、雾气与强调色
 * 一起插值到该流派的色彩里。这不是"换皮肤"，是换房间。
 *
 * 过渡走一段"门廊"：色彩插值的中间点整体压暗一次，
 * 观感上像是穿过一道门洞再进入下一个展厅，而不是被瞬移过去。
 */

const LERP_KEYS = ['ambient', 'ground', 'key', 'floor', 'wall', 'ceiling', 'fog', 'accent', 'strip', 'text'];

function toSet(src) {
  const out = {};
  LERP_KEYS.forEach((k) => {
    out[k] = new THREE.Color(src[k]);
  });
  return out;
}

/** 把流派色板推出一套环境色，缺项时从已有项推导，避免每件藏品都要手写全部字段 */
export function atmosphereFrom(ex) {
  const a = ex.atmosphere || {};
  const sw = ex.swatches.map((s) => s.hex);
  const wall = a.wall || a.ambient || '#EEEEEE';
  return {
    ambient: a.ambient || '#F2F2F2',
    ground: a.floor || sw[4] || '#DDDDDD',
    key: a.key || '#FFFFFF',
    floor: a.floor || '#E4E4E4',
    wall,
    // 天花比墙暗一档、收口比墙暗两档：这两级明度差是空间能被读出来的唯一依据
    ceiling: a.ceiling || shade(wall, 0.9),
    fog: a.fog || wall || '#E4E4E4',
    accent: a.accent || sw[0],
    strip: a.key || '#FFFFFF',
    text: a.text || '#111111',
  };
}

/** 按系数压暗一个十六进制色 */
function shade(hex, k) {
  const n = parseInt(String(hex).replace('#', ''), 16);
  const c = (v) => Math.max(0, Math.min(255, Math.round(v * k)));
  const r = c((n >> 16) & 255);
  const g = c((n >> 8) & 255);
  const b = c(n & 255);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function createAtmosphere(stage, initial) {
  const from = toSet(initial);
  const to = toSet(initial);
  const now = toSet(initial);
  let t = 1;
  let duration = 0.78;
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
    const { lights, mats, scene } = stage;
    lights.hemi.color.copy(now.ambient);
    lights.hemi.groundColor.copy(now.ground);
    lights.key.color.copy(now.key);
    lights.fill.color.copy(now.accent);
    lights.spot.color.copy(now.key);

    scene.background.copy(now.fog);
    scene.fog.color.copy(now.fog);

    mats.floor.color.copy(now.floor);
    mats.wall.color.copy(now.wall);
    mats.ceiling.color.copy(now.ceiling);
    mats.disc.color.copy(now.accent);
    mats.strip.color.copy(now.strip);
    if (mats.trim) {
      mats.trim.color.copy(now.wall).multiplyScalar(0.52);
      mats.cove.color.copy(now.ceiling).multiplyScalar(0.86);
    }
  }

  function update(dt) {
    if (t < 1) {
      t = Math.min(1, t + dt / duration);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // easeInOutQuad
      LERP_KEYS.forEach((k) => {
        tmp.copy(from[k]);
        tmp.lerp(to[k], e);
        now[k].copy(tmp);
      });
      // 门廊压暗：中段最暗，两端归零
      dim = Math.sin(t * Math.PI) * 0.34 * doorway;
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
    get transitioning() {
      return t < 1;
    },
    get accent() {
      return accentHex;
    },
    get text() {
      return textHex;
    },
    get current() {
      return now;
    },
  };
}
