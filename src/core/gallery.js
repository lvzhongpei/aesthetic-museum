import * as THREE from 'three';
import { paintPlate, paintLabel, PLATE_W, PLATE_H, LABEL_W, LABEL_H } from './plates.js';
import { RING_RADIUS } from './stage.js';

export const PLATE_WORLD_W = 2.92;
const PLATE_WORLD_H = PLATE_WORLD_W * (PLATE_H / PLATE_W);
const LABEL_WORLD_W = PLATE_WORLD_W;
const LABEL_WORLD_H = LABEL_WORLD_W * (LABEL_H / LABEL_W);

/* 竖向排布（单位：米）。展框下沿必须离开地面，否则展签会被地板吃掉。
   展框 1.13 → 4.87，展签 0.23 → 0.87，两者留 0.26 的呼吸。 */
export const PLATE_Y = 3.0;
export const LABEL_Y = 0.55;

/** 椭圆柔光晕：展框背后的一团光，交给泛光把它晕开 */
function makeHaloTexture() {
  const W = 256;
  const H = 320;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d');
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.scale(1, H / W);
  const g = ctx.createRadialGradient(0, 0, 2, 0, 0, W / 2);
  g.addColorStop(0, 'rgba(255,255,255,0.62)');
  g.addColorStop(0.34, 'rgba(255,255,255,0.26)');
  g.addColorStop(0.68, 'rgba(255,255,255,0.07)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, W / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** 地面柔光池：展品在抛光地面上投下的一小片光 */
function makePoolTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(128, 128, 4, 128, 128, 126);
  g.addColorStop(0, 'rgba(255,255,255,0.86)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.3)');
  g.addColorStop(0.78, 'rgba(255,255,255,0.07)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export async function buildGallery(scene, exhibits, lang, renderer, tier, onProgress) {
  const group = new THREE.Group();
  scene.add(group);

  const maxAniso = renderer.capabilities.getMaxAnisotropy
    ? Math.min(8, renderer.capabilities.getMaxAnisotropy())
    : 1;

  const haloTex = makeHaloTexture();
  const poolTex = makePoolTexture();
  const items = [];
  const frame = () => new Promise((r) => setTimeout(r, 0));

  for (let i = 0; i < exhibits.length; i += 1) {
    const ex = exhibits[i];
    const angle = (i / exhibits.length) * Math.PI * 2;
    const node = new THREE.Group();
    node.position.set(Math.sin(angle) * RING_RADIUS, 0, Math.cos(angle) * RING_RADIUS);
    node.rotation.y = angle + Math.PI;
    group.add(node);

    const accent = new THREE.Color(ex.swatches[0].hex);

    /* 光晕：展框背后的那团光。放在最里层、最先画。 */
    const haloMat = new THREE.MeshBasicMaterial({
      map: haloTex,
      color: accent,
      transparent: true,
      opacity: 0.62,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const halo = new THREE.Mesh(
      new THREE.PlaneGeometry(PLATE_WORLD_W * 1.85, PLATE_WORLD_H * 1.5),
      haloMat,
    );
    halo.position.set(0, PLATE_Y, -0.34);
    halo.renderOrder = -1;
    node.add(halo);

    /* 金属边框：阳极氧化铝的质感，靠环境贴图才有反射层次 */
    const frameMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#3a3a43'),
      roughness: 0.19,
      metalness: 0.95,
      envMapIntensity: 2.4,
    });
    const metal = new THREE.Mesh(
      new THREE.BoxGeometry(PLATE_WORLD_W + 0.2, PLATE_WORLD_H + 0.2, 0.2),
      frameMat,
    );
    metal.position.set(0, PLATE_Y, -0.11);
    metal.castShadow = tier.shadows;
    metal.receiveShadow = tier.shadows;
    metal.userData.exhibitId = ex.id;
    metal.userData.pickable = 'frame';
    node.add(metal);

    /* 展品画面：暗场里它是一块自发光灯箱 */
    const plateCanvas = paintPlate(ex.id);
    const plateTex = new THREE.CanvasTexture(plateCanvas);
    plateTex.colorSpace = THREE.SRGBColorSpace;
    plateTex.anisotropy = maxAniso;
    const artMat = new THREE.MeshStandardMaterial({
      map: plateTex,
      emissiveMap: plateTex,
      emissive: new THREE.Color('#FFFFFF'),
      emissiveIntensity: 0.38,
      roughness: 0.86,
      metalness: 0,
    });
    const art = new THREE.Mesh(new THREE.PlaneGeometry(PLATE_WORLD_W, PLATE_WORLD_H), artMat);
    art.position.set(0, PLATE_Y, 0.005);
    art.userData.exhibitId = ex.id;
    art.userData.pickable = 'art';
    node.add(art);

    /* 展框下沿的一道发光细线：像博物馆里那条藏在画框下的 LED，最点睛的一笔 */
    const ledMat = new THREE.MeshBasicMaterial({
      color: accent,
      toneMapped: false,
      transparent: true,
      opacity: 0.6,
    });
    const led = new THREE.Mesh(new THREE.BoxGeometry(PLATE_WORLD_W * 0.3, 0.014, 0.02), ledMat);
    led.position.set(0, PLATE_Y - PLATE_WORLD_H / 2 - 0.045, 0.02);
    node.add(led);

    /* 展签 */
    const labelCanvas = paintLabel(ex, lang);
    const labelTex = new THREE.CanvasTexture(labelCanvas);
    labelTex.colorSpace = THREE.SRGBColorSpace;
    labelTex.anisotropy = maxAniso;
    const labelMat = new THREE.MeshStandardMaterial({
      map: labelTex,
      emissiveMap: labelTex,
      emissive: new THREE.Color('#FFFFFF'),
      emissiveIntensity: 0.32,
      roughness: 0.9,
      metalness: 0,
    });
    const label = new THREE.Mesh(new THREE.PlaneGeometry(LABEL_WORLD_W, LABEL_WORLD_H), labelMat);
    label.position.set(0, LABEL_Y, 0.005);
    label.userData.exhibitId = ex.id;
    label.userData.pickable = 'label';
    node.add(label);

    const labelPlate = new THREE.Mesh(
      new THREE.BoxGeometry(LABEL_WORLD_W + 0.12, LABEL_WORLD_H + 0.1, 0.05),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#17171b'),
        roughness: 0.35,
        metalness: 0.8,
        envMapIntensity: 1.4,
      }),
    );
    labelPlate.position.set(0, LABEL_Y, -0.04);
    labelPlate.castShadow = tier.shadows;
    labelPlate.userData.exhibitId = ex.id;
    labelPlate.userData.pickable = 'frame';
    node.add(labelPlate);

    /* 地面光池 */
    const poolMat = new THREE.MeshBasicMaterial({
      map: poolTex,
      color: accent,
      transparent: true,
      opacity: 0.1,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const pool = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 7.2), poolMat);
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(
      Math.sin(angle) * (RING_RADIUS - 1.9),
      0.014,
      Math.cos(angle) * (RING_RADIUS - 1.9),
    );
    scene.add(pool);

    items.push({
      ex,
      index: i,
      angle,
      node,
      art,
      artMat,
      halo,
      haloMat,
      led,
      ledMat,
      metal,
      frameMat,
      label,
      labelMat,
      labelTex,
      labelPlate,
      pool,
      poolMat,
      plateTex,
      accent,
    });

    if (onProgress) onProgress(i + 1, exhibits.length);
    // 让出主线程，好让载入进度真的动起来
    await frame();
  }

  /** 语言切换后重绘所有展签 */
  function refreshLabels(newLang) {
    items.forEach((it) => {
      paintLabel(it.ex, newLang, it.labelTex.image);
      it.labelTex.needsUpdate = true;
    });
  }

  return { group, items, refreshLabels };
}
