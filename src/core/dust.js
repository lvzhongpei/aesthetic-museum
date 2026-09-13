import * as THREE from 'three';
import { WALL_X, BACK_X, SIDE_Z, towerSpan } from './stage.js';

/**
 * 浮尘 —— 走廊里被光打亮的微小颗粒。
 *
 * 塔内没有大面积地面可以承接光柱，"空间体积感"全靠这三件事：
 *   1. 墙裙的反射
 *   2. 墙洗光的梯度
 *   3. 光柱里慢慢上浮的浮尘
 *
 * 第三件事最便宜，但缺少它整个空间立刻塌成平面。
 */

function makeSprite() {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.28, 'rgba(255,255,255,0.55)');
  g.addColorStop(0.62, 'rgba(255,255,255,0.12)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createDust(scene, tier, count = 12) {
  const N = tier.low ? 260 : 1000;
  const span = towerSpan(count);

  // 走廊的纵深与宽度，加上边缘缓冲，避开与墙面的"硬撞"
  const xMin = BACK_X + 0.6;
  const xMax = WALL_X - 0.6;
  const zMax = SIDE_Z - 0.6;
  const yMin = span.bottom - 1.2;
  const yMax = span.top + 1.2;
  const H = yMax - yMin;

  const pos = new Float32Array(N * 3);
  const seed = new Float32Array(N * 3); // 相位 / 上浮速度 / 横向幅度
  const base = new Float32Array(N * 2); // 初始 xz 与轻微的横向相位

  for (let i = 0; i < N; i += 1) {
    // 走廊截面是窄长方形，前后占满，左右只取走廊宽度的一部分
    const x = xMin + Math.random() * (xMax - xMin);
    const z = (Math.random() * 2 - 1) * zMax * 0.85;
    const y = yMin + Math.random() * H;
    pos[i * 3] = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = z;
    seed[i * 3] = Math.random() * Math.PI * 2;
    seed[i * 3 + 1] = 0.04 + Math.random() * 0.08; // y 方向上浮
    seed[i * 3 + 2] = 0.08 + Math.random() * 0.22; // 横向呼吸幅度
    base[i * 2] = x;
    base[i * 2 + 1] = z;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

  const mat = new THREE.PointsMaterial({
    map: makeSprite(),
    color: new THREE.Color('#ffffff'),
    size: tier.low ? 0.05 : 0.032,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  scene.add(points);

  const attr = geo.getAttribute('position');
  let t = 0;

  return {
    points,
    update(dt, intensity = 1) {
      t += dt;
      const arr = attr.array;
      for (let i = 0; i < N; i += 1) {
        const i3 = i * 3;
        // 主轴：缓慢上浮。出顶就绕回底，绕过观者的视野顶底循环。
        arr[i3 + 1] += seed[i3 + 1] * dt * intensity;
        if (arr[i3 + 1] > yMax) arr[i3 + 1] -= H;
        // 横向呼吸：用各自的相位与基础位置，缓慢摇晃
        const ph = seed[i3] + t * 0.1;
        const amp = seed[i3 + 2];
        arr[i3] = base[i * 2] + Math.sin(ph) * amp * 0.3;
        arr[i3 + 2] = base[i * 2 + 1] + Math.cos(ph * 0.83) * amp;
      }
      attr.needsUpdate = true;
    },
    setColor(hex) {
      mat.color.set(hex);
    },
    setOpacity(v) {
      mat.opacity = v;
    },
  };
}

export default createDust;
