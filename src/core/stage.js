import * as THREE from 'three';

/**
 * 馆体 —— 垂直展塔。
 *
 * 空间读法：一条竖直的窄长空间，正面一堵高墙，展品沿这堵墙垂直排列。
 * 观众沿垂直轴升降，始终正视当前展品，头顶与脚下的墙无限延伸进雾里。
 *
 * 为什么不是环形：环形展厅半径 12.2 米时 12 件各占 30°，放到 30 件每件只剩 12°，
 * 帧宽 2.92 米会直接互相重叠。竖向堆叠是唯一能扩到 30 件以上、
 * 同时让「手势 / 画面运动 / 右侧标尺」三者同向的形态。
 *
 * 坐标约定：展品挂在 x = +WALL_X 的平面上（法线指向 -X），
 * 第 01 件在 y = 0，件号越大 y 越小（往下走）。
 */

export const WALL_X = 4.6; // 展墙
export const BACK_X = -7.6; // 背墙
export const SIDE_Z = 5.4; // 两侧墙（走廊因此是窄长的）
export const BAY = 5.0; // 每个展位的垂直节距
const CAP_MARGIN = 3.2; // 塔顶／塔底封口相对首末展品的余量

export function towerSpan(count) {
  const top = CAP_MARGIN;
  const bottom = -(count - 1) * BAY - CAP_MARGIN;
  return { top, bottom, height: top - bottom };
}

export const slotY = (i) => -i * BAY;

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
    dpr: low ? Math.min(window.devicePixelRatio || 1, 1.6) : Math.min(window.devicePixelRatio || 1, 2),
    shadows: !low,
    antialias: !low,
    reflection: !low,
    shadowMap: low ? 512 : 2048,
    pixelBudget: low ? 1_400_000 : 3_800_000,
  };
}

/**
 * 洗墙光梯度：每个展位一个循环 —— 紧贴灯槽处最亮，向下衰减。
 * 纹理按展位重复，于是"一层层往下"这件事在视觉上被反复确认，
 * 人在升降时才有参照物可依。
 */
function makeWallGradient() {
  const c = document.createElement('canvas');
  c.width = 4;
  c.height = 512;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0.0, 'rgb(18,18,22)');
  g.addColorStop(0.1, 'rgb(232,232,240)');
  g.addColorStop(0.34, 'rgb(150,150,162)');
  g.addColorStop(0.72, 'rgb(64,64,72)');
  g.addColorStop(1.0, 'rgb(20,20,24)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 4, 512);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/** 程序生成环境贴图：金属边框靠它才有真实的反射层次 */
function makeEnvironment(renderer) {
  const envScene = new THREE.Scene();
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: {
      uTop: { value: new THREE.Color('#55555f') },
      uMid: { value: new THREE.Color('#14141a') },
      uBottom: { value: new THREE.Color('#050506') },
      uBand: { value: new THREE.Color('#c4c4d0') },
    },
    vertexShader: /* glsl */ `
      varying vec3 vP;
      void main() {
        vP = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec3 vP;
      uniform vec3 uTop, uMid, uBottom, uBand;
      void main() {
        float h = normalize(vP).y;
        vec3 c = mix(uBottom, uMid, smoothstep(-0.9, 0.05, h));
        c = mix(c, uTop, smoothstep(0.05, 0.95, h));
        c += uBand * smoothstep(0.68, 0.92, h) * 0.9;
        gl_FragColor = vec4(c, 1.0);
      }
    `,
  });
  envScene.add(new THREE.Mesh(new THREE.SphereGeometry(60, 32, 24), mat));
  const pmrem = new THREE.PMREMGenerator(renderer);
  const rt = pmrem.fromScene(envScene, 0.02);
  pmrem.dispose();
  return rt.texture;
}

export function createStage(canvas, tier, count) {
  const span = towerSpan(count);
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: tier.antialias,
    alpha: false,
    powerPreference: 'high-performance',
    stencil: false,
    // 保留绘制缓冲：展品画面因此可以被右键保存、被截图工具捕获。
    // 本站的核心就是"看展品"，拿不走画面等于白看。
    preserveDrawingBuffer: true,
  });
  renderer.setPixelRatio(tier.dpr);
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;
  if (tier.shadows) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  const scene = new THREE.Scene();
  const bg = new THREE.Color('#06060a');
  scene.background = bg;
  // 雾按到墙的距离标定：塔向上向下都无限延伸，远端必须溶掉
  scene.fog = new THREE.Fog(bg, 10.5, 36);

  const envMap = makeEnvironment(renderer);
  scene.environment = envMap;

  const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 140);
  camera.position.set(WALL_X - 10, 0, 0);

  /* ── 光 ── */
  const hemi = new THREE.HemisphereLight('#9a9aa8', '#0a0a0e', 0.72);
  scene.add(hemi);

  const key = new THREE.DirectionalLight('#ffffff', 0.8);
  key.position.set(2, 14, 6);
  key.target.position.set(WALL_X, 0, 0);
  if (tier.shadows) {
    key.castShadow = true;
    key.shadow.mapSize.set(tier.shadowMap, tier.shadowMap);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 60;
    const s = 14;
    key.shadow.camera.left = -s;
    key.shadow.camera.right = s;
    key.shadow.camera.top = s;
    key.shadow.camera.bottom = -s;
    key.shadow.bias = -0.001;
    key.shadow.normalBias = 0.04;
  }
  scene.add(key);
  scene.add(key.target);

  const rim = new THREE.DirectionalLight('#ffffff', 1.2);
  rim.position.set(-6, 4, -7);
  scene.add(rim);

  const spot = new THREE.SpotLight('#ffffff', 0, 22, Math.PI * 0.15, 0.55, 1.5);
  spot.position.set(WALL_X - 1.8, 0, 0);
  spot.target.position.set(WALL_X, 0, 0);
  if (tier.shadows) {
    spot.castShadow = true;
    spot.shadow.mapSize.set(tier.shadowMap, tier.shadowMap);
    spot.shadow.bias = -0.0012;
    spot.shadow.normalBias = 0.04;
  }
  scene.add(spot);
  scene.add(spot.target);

  /* ── 展墙：竖向洗墙梯度按展位重复 ── */
  const gradTex = makeWallGradient();
  gradTex.repeat.set(1, count);

  const wallMat = new THREE.MeshStandardMaterial({
    color: '#141418',
    map: gradTex,
    emissive: new THREE.Color('#1a1a20'),
    emissiveMap: gradTex,
    emissiveIntensity: 1.25,
    roughness: 0.92,
    metalness: 0.04,
    envMapIntensity: 0.35,
  });
  const wallH = span.height + 14;
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(SIDE_Z * 2, wallH), wallMat);
  wall.rotation.y = -Math.PI / 2;
  wall.position.set(WALL_X, (span.top + span.bottom) / 2, 0);
  wall.receiveShadow = tier.shadows;
  scene.add(wall);

  /* ── 两侧墙与背墙 ──
     侧墙的平面默认就躺在 XY 平面、法线 +Z，宽度沿 X —— 这正是侧墙要的样子，
     所以它不能用 rotation.y 去转：转 90° 会把它立成一道横切走廊的板子，
     正好挡在观众与展墙之间，整座塔就全黑了。背墙才需要转 90°（法线要沿 X）。 */
  const sideMat = new THREE.MeshStandardMaterial({
    color: '#0d0d11',
    emissive: new THREE.Color('#0f0f14'),
    emissiveIntensity: 0.9,
    roughness: 0.95,
    metalness: 0.05,
    side: THREE.DoubleSide,
    envMapIntensity: 0.2,
  });
  [-SIDE_Z, SIDE_Z].forEach((z) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(WALL_X - BACK_X, wallH), sideMat);
    m.position.set((WALL_X + BACK_X) / 2, (span.top + span.bottom) / 2, z);
    scene.add(m);
  });

  const backMat = new THREE.MeshStandardMaterial({
    color: '#08080b',
    emissive: new THREE.Color('#0a0a0e'),
    emissiveIntensity: 0.8,
    roughness: 1,
    metalness: 0,
    side: THREE.DoubleSide,
  });
  const back = new THREE.Mesh(new THREE.PlaneGeometry(SIDE_Z * 2, wallH), backMat);
  back.position.set(BACK_X, (span.top + span.bottom) / 2, 0);
  back.rotation.y = Math.PI / 2;
  scene.add(back);

  /* ── 抛光墙裙 ──
     塔里没有大面积地面可以反射（硬塞一块会变成突兀的镜子），
     所以竖向节奏交给墙裙：每个展位底下一道镜面不锈钢细带，
     随升降从画面里滑过，是"我在往上／往下走"最关键的那个参照物。 */
  const baseMat = new THREE.MeshStandardMaterial({
    color: '#2e2e36',
    roughness: 0.16,
    metalness: 0.96,
    envMapIntensity: 2.2,
  });
  const baseBand = new THREE.Group();
  for (let i = 0; i < count; i += 1) {
    const dy = -i * BAY - 2.72;
    const bar = new THREE.Mesh(new THREE.BoxGeometry(SIDE_Z * 2, 0.13, 0.07), baseMat);
    bar.position.set(0, dy, 0.035);
    baseBand.add(bar);
  }
  const bandHolder = new THREE.Group();
  bandHolder.rotation.y = -Math.PI / 2;
  bandHolder.position.set(WALL_X, 0, 0);
  bandHolder.add(baseBand);
  scene.add(bandHolder);

  /* ── 塔顶与塔底封口：走到第一件／最后一件时才看得见 ── */
  const capMat = new THREE.MeshStandardMaterial({
    color: '#0a0a0d',
    emissive: new THREE.Color('#0c0c10'),
    emissiveIntensity: 0.7,
    roughness: 1,
    metalness: 0,
    side: THREE.DoubleSide,
  });
  [span.top, span.bottom].forEach((y) => {
    const cap = new THREE.Mesh(new THREE.PlaneGeometry(SIDE_Z * 2, WALL_X - BACK_X), capMat);
    cap.rotation.x = Math.PI / 2;
    cap.position.set((WALL_X + BACK_X) / 2, y, 0);
    scene.add(cap);
  });

  return {
    renderer,
    scene,
    camera,
    envMap,
    span,
    lights: { hemi, key, rim, spot },
    mats: {
      wall: wallMat,
      side: sideMat,
      back: backMat,
      cap: capMat,
      base: baseMat,
    },
    /** 主光与射灯跟随相机高度，否则升降会跑出阴影相机范围 */
    follow(y) {
      key.position.set(2, y + 14, 6);
      key.target.position.set(WALL_X, y, 0);
      key.target.updateMatrixWorld();
    },
    resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(tier.dpr, Math.sqrt(tier.pixelBudget / Math.max(1, w * h)));
      renderer.setPixelRatio(Math.max(0.75, dpr));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    },
  };
}
