import * as THREE from 'three';

/**
 * 馆体 —— 环形的空间与照明。
 * 观众站在环心，展品沿环形外墙向内排列，所以"环绕"是转身，"推拉"是走近。
 */

export const RING_RADIUS = 12.2;
export const WALL_HEIGHT = 9;

export function detectTier() {
  const ua = navigator.userAgent || '';
  const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua) || (coarse && window.innerWidth < 900);
  const cores = navigator.hardwareConcurrency || 4;
  const lowMem = (navigator.deviceMemory || 8) <= 4;
  const low = mobile || cores <= 4 || lowMem;
  return {
    mobile,
    low,
    dpr: low ? Math.min(window.devicePixelRatio || 1, 1.5) : Math.min(window.devicePixelRatio || 1, 2),
    shadows: !low,
    antialias: !low,
    shadowMap: low ? 512 : 2048,
    pixelBudget: low ? 1_400_000 : 3_600_000,
  };
}

export function createStage(canvas, tier) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: tier.antialias,
    alpha: false,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(tier.dpr);
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;
  if (tier.shadows) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#E8E6E1');
  // 雾只用来交代纵深：近平面推到墙外，否则站在环心的观众看什么都是灰的
  scene.fog = new THREE.Fog('#E8E6E1', RING_RADIUS + 2.5, RING_RADIUS * 3.1);

  const camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 0.1, 120);
  camera.position.set(0, 1.7, 2.4);

  /* ── 光 ── */
  // 环境光压低、主光提高：房间才有明暗落差，否则十二个展区看起来都是一块平光布。
  const hemi = new THREE.HemisphereLight('#FFFFFF', '#C9C4BA', 0.62);
  scene.add(hemi);

  const key = new THREE.DirectionalLight('#FFFFFF', 1.15);
  key.position.set(3.5, 12, 4.5);
  if (tier.shadows) {
    key.castShadow = true;
    key.shadow.mapSize.set(tier.shadowMap, tier.shadowMap);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 46;
    const s = RING_RADIUS + 4;
    key.shadow.camera.left = -s;
    key.shadow.camera.right = s;
    key.shadow.camera.top = s;
    key.shadow.camera.bottom = -s;
    key.shadow.bias = -0.0009;
    key.shadow.normalBias = 0.03;
  }
  scene.add(key);

  // 背侧补光：让环的远端不至于掉进全黑，但不参与投影
  const rim = new THREE.DirectionalLight('#FFFFFF', 0.3);
  rim.position.set(-6, 7, -6);
  scene.add(rim);

  // 聚焦展品时才会点亮的一盏射灯
  const spot = new THREE.SpotLight('#FFFFFF', 0, 16, Math.PI * 0.16, 0.62, 1.4);
  spot.position.set(0, 4.4, 0);
  spot.target.position.set(0, 1.4, 0);
  if (tier.shadows) {
    spot.castShadow = true;
    spot.shadow.mapSize.set(tier.shadowMap, tier.shadowMap);
    spot.shadow.bias = -0.001;
    spot.shadow.normalBias = 0.04;
  }
  scene.add(spot);
  scene.add(spot.target);

  // 环心一层极弱的补光，避免观众正下方全黑
  const fill = new THREE.PointLight('#FFFFFF', 0.5, 9, 1.6);
  fill.position.set(0, 1.2, 0);
  scene.add(fill);

  /* ── 地面 ── */
  const floorMat = new THREE.MeshStandardMaterial({
    color: '#E4E1DA',
    roughness: 0.74,
    metalness: 0.03,
  });
  const floor = new THREE.Mesh(new THREE.CircleGeometry(RING_RADIUS + 1.6, 128), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = tier.shadows;
  scene.add(floor);

  /* ── 环心地面标识（一枚极輕的圆环，暗示"你正站在馆中"） ── */
  const discMat = new THREE.MeshBasicMaterial({
    color: '#FFFFFF',
    transparent: true,
    opacity: 0.16,
    depthWrite: false,
  });
  const disc = new THREE.Mesh(new THREE.RingGeometry(1.5, 1.56, 96), discMat);
  disc.rotation.x = -Math.PI / 2;
  disc.position.y = 0.01;
  scene.add(disc);

  /* ── 环形外墙 ── */
  const wallMat = new THREE.MeshStandardMaterial({
    color: '#EFEDE8',
    roughness: 0.94,
    metalness: 0,
    side: THREE.BackSide,
  });
  const wall = new THREE.Mesh(
    new THREE.CylinderGeometry(RING_RADIUS + 1.5, RING_RADIUS + 1.5, WALL_HEIGHT, 128, 1, true),
    wallMat,
  );
  wall.position.y = WALL_HEIGHT / 2 - 1.4;
  wall.receiveShadow = tier.shadows;
  scene.add(wall);

  /* ── 天花 ── */
  const ceilMat = new THREE.MeshStandardMaterial({ color: '#D9D6CF', roughness: 1, metalness: 0 });
  const ceiling = new THREE.Mesh(
    new THREE.RingGeometry(0, RING_RADIUS + 1.5, 128),
    ceilMat,
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = WALL_HEIGHT - 1.4;
  scene.add(ceiling);

  /* ── 建筑收口 ──
     墙与地、墙与顶的两条交界线。少了这两条线，空间在任何配色下都会糊成一团。 */
  const trimMat = new THREE.MeshStandardMaterial({
    color: '#A7A39A',
    roughness: 0.85,
    metalness: 0,
    side: THREE.BackSide,
  });
  const skirt = new THREE.Mesh(
    new THREE.CylinderGeometry(RING_RADIUS + 1.47, RING_RADIUS + 1.47, 0.24, 128, 1, true),
    trimMat,
  );
  skirt.position.y = 0.12;
  scene.add(skirt);

  const coveMat = new THREE.MeshStandardMaterial({
    color: '#C4C0B7',
    roughness: 1,
    metalness: 0,
    side: THREE.BackSide,
  });
  const cove = new THREE.Mesh(
    new THREE.CylinderGeometry(RING_RADIUS + 1.49, RING_RADIUS + 1.49, 0.1, 128, 1, true),
    coveMat,
  );
  cove.position.y = WALL_HEIGHT - 1.45;
  scene.add(cove);

  /* ── 顶部灯带：每个展位一盏，用发光小块暗示（不参与光照，省性能） ── */
  const stripMat = new THREE.MeshBasicMaterial({ color: '#FFFFFF' });
  const strips = new THREE.Group();
  for (let i = 0; i < 12; i += 1) {
    const a = (i / 12) * Math.PI * 2;
    const bar = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.06, 0.16), stripMat);
    bar.position.set(Math.sin(a) * (RING_RADIUS - 1.1), WALL_HEIGHT - 1.75, Math.cos(a) * (RING_RADIUS - 1.1));
    bar.rotation.y = a;
    strips.add(bar);
  }
  scene.add(strips);

  return {
    renderer,
    scene,
    camera,
    lights: { hemi, key, spot, fill },
    mats: {
      floor: floorMat,
      wall: wallMat,
      ceiling: ceilMat,
      disc: discMat,
      strip: stripMat,
      trim: trimMat,
      cove: coveMat,
    },
    resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(tier.dpr, Math.sqrt(tier.pixelBudget / (w * h)));
      renderer.setPixelRatio(Math.max(0.75, dpr));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    },
  };
}
