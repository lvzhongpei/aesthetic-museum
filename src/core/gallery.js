import * as THREE from 'three';
import { paintPlate, paintLabel, PLATE_W, PLATE_H, LABEL_W, LABEL_H } from './plates.js';
import { WALL_X, slotY } from './stage.js';
import { luminance } from './color.js';

/** 展品画面在塔里的实际尺寸（米） */
export const PLATE_WORLD_W = 2.66;
const PLATE_WORLD_H = PLATE_WORLD_W * (PLATE_H / PLATE_W);
const LABEL_WORLD_W = 1.95;
const LABEL_WORLD_H = LABEL_WORLD_W * (LABEL_H / LABEL_W);

/** 展位内的竖向偏移：灯槽在上、展签在下 —— 两者都要在正视图里看得见 */
export const COVE_DY = 2.18;
export const LABEL_DY = -2.02;

/** 椭圆柔光晕：展框背后的一团光，交给泛光晕开 */
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

export async function buildGallery(scene, exhibits, lang, renderer, tier, onProgress) {
  const group = new THREE.Group();
  scene.add(group);

  const maxAniso = renderer.capabilities.getMaxAnisotropy
    ? Math.min(8, renderer.capabilities.getMaxAnisotropy())
    : 1;

  const haloTex = makeHaloTexture();
  const items = [];
  const frame = () => new Promise((r) => setTimeout(r, 0));

  for (let i = 0; i < exhibits.length; i += 1) {
    const ex = exhibits[i];
    const node = new THREE.Group();
    node.position.set(WALL_X, slotY(i), 0);
    // 平面默认法线 +Z；绕 y 转 -90° 后局部 +Z 指向世界 -X，正对塔内
    node.rotation.y = -Math.PI / 2;
    group.add(node);

    const accent = new THREE.Color(ex.swatches[0].hex);
    // 色板整体明度：越亮的流派光晕越收，否则会和洗墙光糊成一片
    const avgLum = ex.swatches.reduce((s, c) => s + luminance(c.hex), 0) / ex.swatches.length;
    const haloScale = 1 - Math.min(1, Math.max(0, (avgLum - 0.1) / 0.6)) * 0.62;

    /* 光晕：紧贴墙面，藏在展框背后 */
    const haloMat = new THREE.MeshBasicMaterial({
      map: haloTex,
      color: accent,
      transparent: true,
      opacity: 0.62 * haloScale,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const halo = new THREE.Mesh(
      new THREE.PlaneGeometry(PLATE_WORLD_W * 1.8, PLATE_WORLD_H * 1.34),
      haloMat,
    );
    halo.position.set(0, 0, 0.05);
    halo.renderOrder = -1;
    node.add(halo);

    /* 金属边框 */
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
    metal.position.set(0, 0, 0.2);
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
    art.position.set(0, 0, 0.305);
    art.userData.exhibitId = ex.id;
    art.userData.pickable = 'art';
    node.add(art);

    /* 展框下沿的发光细线 */
    const ledMat = new THREE.MeshBasicMaterial({
      color: accent,
      toneMapped: false,
      transparent: true,
      opacity: 0.6,
    });
    const led = new THREE.Mesh(new THREE.BoxGeometry(PLATE_WORLD_W * 0.3, 0.014, 0.02), ledMat);
    led.position.set(0, -PLATE_WORLD_H / 2 - 0.05, 0.32);
    node.add(led);

    /* 展签：挂在展框正下方 */
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
    label.position.set(0, LABEL_DY, 0.09);
    label.userData.exhibitId = ex.id;
    label.userData.pickable = 'label';
    node.add(label);

    const labelPlate = new THREE.Mesh(
      new THREE.BoxGeometry(LABEL_WORLD_W + 0.1, LABEL_WORLD_H + 0.08, 0.05),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#17171b'),
        roughness: 0.35,
        metalness: 0.8,
        envMapIntensity: 1.4,
      }),
    );
    labelPlate.position.set(0, LABEL_DY, 0.045);
    labelPlate.castShadow = tier.shadows;
    labelPlate.userData.exhibitId = ex.id;
    labelPlate.userData.pickable = 'frame';
    node.add(labelPlate);

    /* 灯槽：展位上沿的一道发光带，泛光会把它晕开。
       它同时是「我在升降」最重要的视觉参照——一层层从画面里滑过去。 */
    const coveMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#ffffff'),
      toneMapped: false,
    });
    const cove = new THREE.Mesh(new THREE.BoxGeometry(PLATE_WORLD_W * 1.16, 0.085, 0.05), coveMat);
    cove.position.set(0, COVE_DY, 0.03);
    node.add(cove);

    items.push({
      ex,
      index: i,
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
      cove,
      coveMat,
      plateTex,
      accent,
      emissiveBase: 0.38,
      labelBase: 0.32,
      haloBase: 0.62 * haloScale,
      y: slotY(i),
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
