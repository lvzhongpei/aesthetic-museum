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

/** 一次性生成的柔光池纹理，供所有展位的地面光斑复用 */
function makePoolTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(128, 128, 6, 128, 128, 126);
  g.addColorStop(0, 'rgba(255,255,255,0.92)');
  g.addColorStop(0.42, 'rgba(255,255,255,0.34)');
  g.addColorStop(0.78, 'rgba(255,255,255,0.08)');
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
    ? Math.min(4, renderer.capabilities.getMaxAnisotropy())
    : 1;

  const poolTex = makePoolTexture();
  const items = [];
  // 用 setTimeout 而不是 requestAnimationFrame 让出主线程：
  // rAF 只在页面真正开始绘制后才触发，一旦首帧被任何东西挡住，这里就会死等。
  const frame = () => new Promise((r) => setTimeout(r, 0));

  for (let i = 0; i < exhibits.length; i += 1) {
    const ex = exhibits[i];
    const angle = (i / exhibits.length) * Math.PI * 2;
    const node = new THREE.Group();
    node.position.set(Math.sin(angle) * RING_RADIUS, 0, Math.cos(angle) * RING_RADIUS);
    node.rotation.y = angle + Math.PI;
    group.add(node);

    // 展框背板（画框）
    const backerMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(ex.swatches[3] ? ex.swatches[3].hex : '#222222'),
      roughness: 0.62,
      metalness: 0.08,
      emissive: new THREE.Color('#000000'),
      emissiveIntensity: 0,
    });
    const backer = new THREE.Mesh(
      new THREE.BoxGeometry(PLATE_WORLD_W + 0.26, PLATE_WORLD_H + 0.26, 0.22),
      backerMat,
    );
    backer.position.set(0, PLATE_Y, -0.13);
    backer.castShadow = tier.shadows;
    backer.receiveShadow = tier.shadows;
    backer.userData.exhibitId = ex.id;
    backer.userData.pickable = 'frame';
    node.add(backer);

    // 展品画面
    const plateCanvas = paintPlate(ex.id);
    const plateTex = new THREE.CanvasTexture(plateCanvas);
    plateTex.colorSpace = THREE.SRGBColorSpace;
    plateTex.anisotropy = maxAniso;
    const artMat = new THREE.MeshStandardMaterial({
      map: plateTex,
      emissiveMap: plateTex,
      emissive: new THREE.Color('#FFFFFF'),
      emissiveIntensity: 0.34,
      roughness: 0.95,
      metalness: 0,
    });
    const art = new THREE.Mesh(new THREE.PlaneGeometry(PLATE_WORLD_W, PLATE_WORLD_H), artMat);
    art.position.set(0, PLATE_Y, 0.005);
    art.userData.exhibitId = ex.id;
    art.userData.pickable = 'art';
    node.add(art);

    // 展签
    const labelCanvas = paintLabel(ex, lang);
    const labelTex = new THREE.CanvasTexture(labelCanvas);
    labelTex.colorSpace = THREE.SRGBColorSpace;
    labelTex.anisotropy = maxAniso;
    const labelMat = new THREE.MeshStandardMaterial({
      map: labelTex,
      emissiveMap: labelTex,
      emissive: new THREE.Color('#FFFFFF'),
      emissiveIntensity: 0.42,
      roughness: 0.9,
      metalness: 0,
    });
    const label = new THREE.Mesh(new THREE.PlaneGeometry(LABEL_WORLD_W, LABEL_WORLD_H), labelMat);
    label.position.set(0, LABEL_Y, 0.005);
    label.userData.exhibitId = ex.id;
    label.userData.pickable = 'label';
    node.add(label);

    const labelPlate = new THREE.Mesh(
      new THREE.BoxGeometry(LABEL_WORLD_W + 0.14, LABEL_WORLD_H + 0.12, 0.06),
      new THREE.MeshStandardMaterial({ color: '#EDEDEA', roughness: 0.8, metalness: 0 }),
    );
    labelPlate.position.set(0, LABEL_Y, -0.04);
    labelPlate.castShadow = tier.shadows;
    labelPlate.userData.exhibitId = ex.id;
    labelPlate.userData.pickable = 'frame';
    node.add(labelPlate);

    // 地面柔光池
    const poolMat = new THREE.MeshBasicMaterial({
      map: poolTex,
      color: new THREE.Color(ex.swatches[0].hex),
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const pool = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 6.4), poolMat);
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(Math.sin(angle) * (RING_RADIUS - 1.9), 0.012, Math.cos(angle) * (RING_RADIUS - 1.9));
    group.add(pool);

    items.push({
      ex,
      index: i,
      angle,
      node,
      art,
      artMat,
      label,
      labelMat,
      labelTex,
      backer,
      backerMat,
      pool,
      poolMat,
      plateTex,
      accent: new THREE.Color(ex.swatches[0].hex),
      dark: new THREE.Color(ex.swatches[3] ? ex.swatches[3].hex : '#222222'),
    });

    if (onProgress) onProgress(i + 1, exhibits.length);
    // 让出主线程，好让载入进度真的动起来
    await frame();
  }

  /** 语言切换后重绘所有展签 */
  function refreshLabels(newLang) {
    items.forEach((it) => {
      const canvas = paintLabel(it.ex, newLang, it.labelTex.image);
      it.labelTex.needsUpdate = true;
      void canvas;
    });
  }

  return { group, items, refreshLabels };
}
