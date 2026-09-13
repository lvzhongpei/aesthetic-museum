import * as THREE from 'three';
import { RING_RADIUS, WALL_HEIGHT } from './stage.js';

/**
 * 浮尘 —— 空间里那些被光打亮的微小颗粒。
 * 它不承担任何叙事，但它让"空气"变成一种可见的物质，
 * 也让聚光灯有了体积感。这是暗场里最便宜、回报最高的一笔。
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

export function createDust(scene, tier) {
  const count = tier.low ? 240 : 900;
  const R = RING_RADIUS - 1.2;
  const H = WALL_HEIGHT - 1.8;

  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count * 3); // 相位、速度、幅度
  const base = new Float32Array(count * 2); // 初始 xz 半径与角度

  for (let i = 0; i < count; i += 1) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * R;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    const y = Math.random() * H;
    pos[i * 3] = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = z;
    seed[i * 3] = Math.random() * Math.PI * 2;
    seed[i * 3 + 1] = 0.035 + Math.random() * 0.075;
    seed[i * 3 + 2] = 0.15 + Math.random() * 0.55;
    base[i * 2] = r;
    base[i * 2 + 1] = a;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

  const mat = new THREE.PointsMaterial({
    map: makeSprite(),
    color: new THREE.Color('#ffffff'),
    size: tier.low ? 0.055 : 0.034,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.2,
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
      for (let i = 0; i < count; i += 1) {
        const i3 = i * 3;
        arr[i3 + 1] += seed[i3 + 1] * dt * intensity;
        if (arr[i3 + 1] > H) arr[i3 + 1] -= H;
        // 缓慢的横向呼吸，避免颗粒像被冻结住
        const ph = seed[i3] + t * 0.12;
        const amp = seed[i3 + 2];
        arr[i3] = Math.cos(base[i * 2 + 1]) * base[i * 2] + Math.sin(ph) * amp;
        arr[i3 + 2] = Math.sin(base[i * 2 + 1]) * base[i * 2] + Math.cos(ph * 0.83) * amp;
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
