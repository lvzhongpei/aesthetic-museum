/**
 * 颜色工具 —— 纯 JS 十六进制 / HSL 互转。
 * 不用 THREE.Color 做这件事，因为 three 的颜色管理会把 sRGB 与线性空间来回换，
 * 而这里要做的是「按色相重新合成一个色」的算术，用直觉的 sRGB 空间更不容易搞错。
 */

export function hexToRgb(hex) {
  const n = parseInt(String(hex).replace('#', ''), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgbToHex(r, g, b) {
  const c = (v) => Math.max(0, Math.min(255, Math.round(v)));
  return `#${((1 << 24) + (c(r) << 16) + (c(g) << 8) + c(b)).toString(16).slice(1)}`;
}

export function hexToHsl(hex) {
  const { r: R, g: G, b: B } = hexToRgb(hex);
  const r = R / 255;
  const g = G / 255;
  const b = B / 255;
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  const l = (mx + mn) / 2;
  let h = 0;
  let s = 0;
  if (mx !== mn) {
    const d = mx - mn;
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    if (mx === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (mx === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return { h, s, l };
}

export function hslToHex(h, s, l) {
  const hue = ((h % 1) + 1) % 1;
  const sat = Math.max(0, Math.min(1, s));
  const lig = Math.max(0, Math.min(1, l));
  const f = (n) => {
    const k = (n + hue * 12) % 12;
    const a = sat * Math.min(lig, 1 - lig);
    const v = lig - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return v * 255;
  };
  return rgbToHex(f(0), f(8), f(4));
}

/** 只要色相，饱和度与明度重设 —— 重建整套暗场色板的主力工具 */
export function rehue(hex, { s = null, l = null } = {}) {
  const c = hexToHsl(hex);
  return hslToHex(c.h, s == null ? c.s : s, l == null ? c.l : l);
}

/** 相对亮度，用来判断一个色是深是浅 */
export function luminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const f = (v) => {
    const n = v / 255;
    return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

export function isDark(hex, threshold = 0.42) {
  return luminance(hex) < threshold;
}

/** 按系数压暗 / 提亮 */
export function scale(hex, k) {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r * k, g * k, b * k);
}

/** 线性插值混色，t=0 取 a，t=1 取 b */
export function mix(a, b, t) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex(A.r + (B.r - A.r) * t, A.g + (B.g - A.g) * t, A.b + (B.b - A.b) * t);
}

export default { hexToRgb, rgbToHex, hexToHsl, hslToHex, rehue, luminance, isDark, scale, mix };
