import * as THREE from 'three';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';

/**
 * 馆体 —— 暗场电影感的环形展厅。
 *
 * 空间的读法：一间收得很暗的展室，抛光石材地面几乎能照出人影，
 * 展品自己是画面里唯一的光源。所谓"高级感"其实只来自三件事——
 * 明暗落差足够大、地面的反射足够真、发光体有光晕。
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
    dpr: low ? Math.min(window.devicePixelRatio || 1, 1.6) : Math.min(window.devicePixelRatio || 1, 2),
    shadows: !low,
    antialias: !low,
    reflection: !low,
    shadowMap: low ? 512 : 2048,
    pixelBudget: low ? 1_400_000 : 3_800_000,
  };
}

/** 顶暗、腰亮、脚更暗的竖向渐变 —— 真实展厅靠这条曲线立住体积 */
function makeWallGradient() {
  const c = document.createElement('canvas');
  c.width = 4;
  c.height = 256;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0.0, 'rgb(30,30,36)');
  g.addColorStop(0.18, 'rgb(154,154,166)');
  g.addColorStop(0.54, 'rgb(255,255,255)');
  g.addColorStop(0.86, 'rgb(98,98,108)');
  g.addColorStop(1.0, 'rgb(26,26,30)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 4, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  return tex;
}

/** 程序生成的环境贴图：金属与石材靠它才有真实的反射层次 */
function makeEnvironment(renderer) {
  const envScene = new THREE.Scene();
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: {
      uTop: { value: new THREE.Color('#4a4a56') },
      uMid: { value: new THREE.Color('#141419') },
      uBottom: { value: new THREE.Color('#050506') },
      uBand: { value: new THREE.Color('#b9b9c6') },
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
        c += uBand * smoothstep(0.70, 0.94, h) * 0.85;
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

export function createStage(canvas, tier) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: tier.antialias,
    alpha: false,
    powerPreference: 'high-performance',
    stencil: false,
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
  const bg = new THREE.Color('#07070a');
  scene.background = bg;
  scene.fog = new THREE.Fog(bg, RING_RADIUS * 0.72, RING_RADIUS * 2.9);

  const envMap = makeEnvironment(renderer);
  scene.environment = envMap;

  const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 140);
  camera.position.set(0, 3.2, 3);

  /* ── 光 ──
     暗场的规则：主光只负责"勾形"，画面真正的亮度来自展品自己。 */
  const hemi = new THREE.HemisphereLight('#9a9aa8', '#101014', 0.78);
  scene.add(hemi);

  const key = new THREE.DirectionalLight('#ffffff', 0.85);
  key.position.set(4, 13, 5);
  if (tier.shadows) {
    key.castShadow = true;
    key.shadow.mapSize.set(tier.shadowMap, tier.shadowMap);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 48;
    const s = RING_RADIUS + 4;
    key.shadow.camera.left = -s;
    key.shadow.camera.right = s;
    key.shadow.camera.top = s;
    key.shadow.camera.bottom = -s;
    key.shadow.bias = -0.0009;
    key.shadow.normalBias = 0.035;
  }
  scene.add(key);

  // 轮廓光：从环的另一侧打回来，用展区的强调色，专门勾展框的边
  const rim = new THREE.DirectionalLight('#ffffff', 1.35);
  rim.position.set(-7, 6.5, -7);
  scene.add(rim);

  // 聚焦展品的射灯
  const spot = new THREE.SpotLight('#ffffff', 0, 19, Math.PI * 0.15, 0.55, 1.5);
  spot.position.set(0, 6.1, 0);
  spot.target.position.set(0, 3, 0);
  if (tier.shadows) {
    spot.castShadow = true;
    spot.shadow.mapSize.set(tier.shadowMap, tier.shadowMap);
    spot.shadow.bias = -0.0012;
    spot.shadow.normalBias = 0.04;
  }
  scene.add(spot);
  scene.add(spot.target);

  // 环心一点点提亮，避免观众脚下全黑
  const fill = new THREE.PointLight('#ffffff', 0.55, 10, 1.8);
  fill.position.set(0, 1.6, 0);
  scene.add(fill);

  /* ── 地面 ──
     真的反射（Reflector）打底，上面压一层半透明石材。
     反射是"贵"最直接的来源，所以只在桌面端开。 */
  let mirror = null;
  if (tier.reflection) {
    mirror = new Reflector(new THREE.CircleGeometry(RING_RADIUS + 1.7, 128), {
      clipBias: 0.0035,
      textureWidth: 1024,
      textureHeight: 1024,
      color: 0x3a3a42,
    });
    mirror.rotation.x = -Math.PI / 2;
    mirror.position.y = 0.001;
    scene.add(mirror);
  }

  const stoneMat = new THREE.MeshStandardMaterial({
    color: '#101014',
    emissive: new THREE.Color('#0f0f13'),
    emissiveIntensity: 0.34,
    roughness: 0.62,
    metalness: 0.25,
    envMapIntensity: 0.7,
    transparent: tier.reflection,
    opacity: tier.reflection ? 0.66 : 1,
    depthWrite: !tier.reflection,
  });
  const stone = new THREE.Mesh(new THREE.CircleGeometry(RING_RADIUS + 1.7, 128), stoneMat);
  stone.rotation.x = -Math.PI / 2;
  stone.position.y = 0.004;
  stone.receiveShadow = tier.shadows;
  stone.renderOrder = 2;
  scene.add(stone);

  /* ── 环形外墙与天花 ── */
  const gradTex = makeWallGradient();
  const wallMat = new THREE.MeshStandardMaterial({
    color: '#141418',
    map: gradTex,
    emissive: new THREE.Color('#1a1a20'),
    emissiveMap: gradTex,
    emissiveIntensity: 0.85,
    roughness: 0.92,
    metalness: 0.05,
    side: THREE.BackSide,
    envMapIntensity: 0.35,
  });
  const wall = new THREE.Mesh(
    new THREE.CylinderGeometry(RING_RADIUS + 1.5, RING_RADIUS + 1.5, WALL_HEIGHT, 128, 1, true),
    wallMat,
  );
  wall.position.y = WALL_HEIGHT / 2 - 1.4;
  wall.receiveShadow = tier.shadows;
  scene.add(wall);

  const ceilMat = new THREE.MeshStandardMaterial({
    color: '#0c0c10',
    emissive: new THREE.Color('#0e0e12'),
    emissiveIntensity: 0.6,
    roughness: 1,
    metalness: 0,
    side: THREE.BackSide,
  });
  const ceiling = new THREE.Mesh(
    new THREE.CylinderGeometry(RING_RADIUS + 1.5, RING_RADIUS + 1.5, 0.4, 128, 1, true),
    ceilMat,
  );
  ceiling.position.y = WALL_HEIGHT - 1.4;
  scene.add(ceiling);

  const capMat = new THREE.MeshStandardMaterial({ color: '#08080b', emissive: new THREE.Color('#0b0b0f'), emissiveIntensity: 0.6, roughness: 1, metalness: 0 });
  const cap = new THREE.Mesh(new THREE.CircleGeometry(RING_RADIUS + 1.5, 128), capMat);
  cap.rotation.x = Math.PI / 2;
  cap.position.y = WALL_HEIGHT - 1.42;
  scene.add(cap);

  /* 墙脚收口：暗场里这条线比亮场更重要，空间全靠它被读出来 */
  const trimMat = new THREE.MeshStandardMaterial({
    color: '#050506',
    roughness: 0.5,
    metalness: 0.55,
    side: THREE.BackSide,
    envMapIntensity: 1.2,
  });
  const skirt = new THREE.Mesh(
    new THREE.CylinderGeometry(RING_RADIUS + 1.47, RING_RADIUS + 1.47, 0.26, 128, 1, true),
    trimMat,
  );
  skirt.position.y = 0.13;
  scene.add(skirt);

  /* ── 顶部灯带：真正发光的小块，泛光会把它们晕开 ── */
  const stripMat = new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false });
  const strips = new THREE.Group();
  for (let i = 0; i < 12; i += 1) {
    const a = (i / 12) * Math.PI * 2;
    const bar = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.05, 0.14), stripMat);
    bar.position.set(
      Math.sin(a) * (RING_RADIUS - 1.2),
      5.95,
      Math.cos(a) * (RING_RADIUS - 1.2),
    );
    bar.rotation.y = a;
    strips.add(bar);
  }
  scene.add(strips);

  /* ── 环心标识：一枚极细的发光圆环，暗示"你正站在馆中" ── */
  const discMat = new THREE.MeshBasicMaterial({
    color: '#ffffff',
    transparent: true,
    opacity: 0.34,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });
  const disc = new THREE.Mesh(new THREE.RingGeometry(1.46, 1.5, 128), discMat);
  disc.rotation.x = -Math.PI / 2;
  disc.position.y = 0.012;
  scene.add(disc);

  return {
    renderer,
    scene,
    camera,
    envMap,
    lights: { hemi, key, rim, spot, fill },
    mats: {
      floor: stoneMat,
      wall: wallMat,
      ceiling: ceilMat,
      cap: capMat,
      disc: discMat,
      strip: stripMat,
      trim: trimMat,
    },
    mirror,
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
