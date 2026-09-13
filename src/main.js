import './styles/base.css';
import './styles/sheet.css';
import './styles/exhibits.css';

import * as THREE from 'three';
import { EXHIBITS, MUSEUM } from './data/exhibits.js';
import { detectTier, createStage } from './core/stage.js';
import { buildGallery } from './core/gallery.js';
import { createAtmosphere, atmosphereFrom } from './core/atmosphere.js';
import { createControls } from './core/controls.js';
import { createPost } from './core/post.js';
import { createDust } from './core/dust.js';
import { hslToHex, hexToHsl } from './core/color.js';
import { createHud } from './ui/hud.js';
import { createSheet } from './ui/sheet.js';
import { t, getLang, onLangChange, applyStatic } from './ui/i18n.js';
import { paintPlate } from './core/plates.js';

const $ = (id) => document.getElementById(id);
const TOTAL = EXHIBITS.length;
const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─────────── 载入屏 ─────────── */

const boot = $('boot');
const bootFill = $('bootFill');
const bootStatus = $('bootStatus');

function progress(p, key) {
  bootFill.style.width = `${Math.round(p * 100)}%`;
  if (key) bootStatus.textContent = t(key);
}

function bootDone() {
  progress(1, 'boot.ready');
  setTimeout(() => boot.classList.add('is-done'), 420);
}

/* ─────────── WebGL 兜底 ─────────── */

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) {
    return false;
  }
}

/** 无法启动 3D 时退回纯 DOM 图鉴 —— 展品与文档一条不少，只是没有空间。 */
function catalogueFallback() {
  boot.classList.add('is-done');
  $('stage').style.display = 'none';
  document.documentElement.style.setProperty('--hud-op', '1');
  const app = $('app');

  const wrap = document.createElement('div');
  wrap.className = 'catalogue';
  wrap.innerHTML = `
    <header class="catalogue__head">
      <h1>${MUSEUM.name[getLang()]}</h1>
      <p>${t('err.webgl')}</p>
    </header>
    <div class="catalogue__grid" id="catGrid"></div>`;
  app.appendChild(wrap);

  const grid = wrap.querySelector('#catGrid');
  EXHIBITS.forEach((ex, i) => {
    const c = document.createElement('button');
    c.type = 'button';
    c.className = 'catalogue__card';
    const url = paintPlate(ex.id).toDataURL('image/jpeg', 0.82);
    c.innerHTML = `
      <img src="${url}" alt="${ex.name.en}" />
      <span class="catalogue__no">${ex.no}</span>
      <span class="catalogue__name">${ex.name[getLang()]}<em>${ex.name.en}</em></span>
      <span class="catalogue__sw">${ex.swatches
        .slice(0, 5)
        .map((s) => `<i style="background:${s.hex}"></i>`)
        .join('')}</span>`;
    c.addEventListener('click', () => sheet.open(ex, i, TOTAL));
    grid.appendChild(c);
  });

  const style = document.createElement('style');
  style.textContent = `
    .catalogue{position:absolute;inset:0;overflow-y:auto;background:#0b0b0d;color:#f1f0eb;padding:80px clamp(18px,5vw,64px);z-index:4}
    .catalogue__head h1{font-family:var(--f-serif);font-size:24px;margin:0 0 8px;font-weight:500;letter-spacing:.2em}
    .catalogue__head p{font-size:13px;opacity:.55;margin:0 0 34px}
    .catalogue__grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:22px}
    .catalogue__card{border:none;background:none;padding:0;cursor:pointer;text-align:left;font-family:inherit;color:inherit}
    .catalogue__card img{width:100%;display:block;border:1px solid rgba(241,240,235,.16);border-radius:3px;transition:transform .5s cubic-bezier(.3,.7,0,1), box-shadow .5s}
    .catalogue__card:hover img{transform:translateY(-5px);box-shadow:0 18px 40px rgba(0,0,0,.6)}
    .catalogue__no{display:block;font-family:var(--f-mono);font-size:10px;opacity:.4;margin:10px 0 3px}
    .catalogue__name{display:block;font-size:14px;font-weight:500}
    .catalogue__name em{display:block;font-style:normal;font-size:10.5px;letter-spacing:.1em;opacity:.4;margin-top:2px}
    .catalogue__sw{display:flex;gap:2px;margin-top:7px}
    .catalogue__sw i{width:14px;height:5px;border-radius:1px}`;
  document.head.appendChild(style);

  const sheet = createSheet({
    el: $('sheet'),
    inner: $('sheetInner'),
    closeBtn: $('sheetClose'),
    onClose: () => {},
    onPrev: () => {},
    onNext: () => {},
  });
  $('langToggle')?.addEventListener('click', () => setTimeout(() => window.location.reload(), 60));
}

/* ─────────── 主流程 ─────────── */

async function main() {
  if (!hasWebGL()) {
    catalogueFallback();
    return;
  }

  const tier = detectTier();
  progress(0.05, 'boot.loading');

  // 兜底：14 秒后无论如何撤掉载入屏
  setTimeout(() => {
    if (!boot.classList.contains('is-done')) {
      console.warn('[museum] boot watchdog: 首帧未在预期时间内完成，强制开馆');
      bootDone();
    }
  }, 14000);

  // 字体先就位 —— 否则程序生成的展品画面会用错字体
  try {
    await Promise.race([
      Promise.all([
        document.fonts.load('700 32px Inter'),
        document.fonts.load('400 17px Inter'),
        document.fonts.load('600 34px "Noto Serif SC"'),
        document.fonts.load('400 17px "Noto Sans SC"'),
        document.fonts.load('500 22px "DM Mono"'),
      ]),
      new Promise((r) => setTimeout(r, 3000)),
    ]);
  } catch (e) {
    /* 不阻断 */
  }
  progress(0.12, 'boot.building');

  const canvas = $('stage');
  const stage = createStage(canvas, tier, TOTAL);
  const { scene, camera, renderer, lights } = stage;

  const gallery = await buildGallery(
    scene,
    EXHIBITS,
    getLang(),
    renderer,
    tier,
    (done, total) => progress(0.12 + (done / total) * 0.68, 'boot.building'),
  );

  const items = gallery.items;
  const indexById = new Map(EXHIBITS.map((e, i) => [e.id, i]));

  const dust = createDust(scene, tier, TOTAL);
  const post = createPost(renderer, scene, camera, tier);
  const atmosphere = createAtmosphere(stage, atmosphereFrom(EXHIBITS[0]));
  const controls = createControls(camera, { count: TOTAL, canvas });

  /* ── HUD 与面板 ── */

  const hud = createHud({
    exhibits: EXHIBITS,
    onSelect: (i) => controls.goto(i),
  });

  const sheet = createSheet({
    el: $('sheet'),
    inner: $('sheetInner'),
    closeBtn: $('sheetClose'),
    onClose: () => controls.setFocus(false),
    onPrev: () => controls.step(-1),
    onNext: () => controls.step(1),
  });

  /* ── 拾取 ── */

  const raycaster = new THREE.Raycaster();
  const pickables = items.flatMap((it) => [it.art, it.label, it.metal, it.labelPlate]);
  let spotTarget = 0;
  let spotNow = 0;

  controls.onPick((ndc) => {
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(pickables, false);
    if (hits.length) {
      const idx = indexById.get(hits[0].object.userData.exhibitId);
      if (idx != null) {
        if (idx !== controls.state.index) controls.goto(idx);
        controls.setFocus(true);
        return;
      }
    }
    // 点空处：展开当前这一件
    controls.setFocus(true);
  });

  /* ── 展位变化 ── */

  function hashFor(i) {
    return `#/${EXHIBITS[i].id}`;
  }

  controls.onChange(({ index, focus }) => {
    hud.setActive(index);
    const ex = EXHIBITS[index];
    const at = atmosphereFrom(ex);
    atmosphere.set(at, { doorway: true });
    dust.setColor(at.accent);
    spotTarget = focus != null ? 1.85 : 0;

    if (focus != null) {
      if (!sheet.isOpen() || !sheet.exhibit || sheet.exhibit.id !== ex.id) {
        sheet.open(ex, index, TOTAL);
      }
      const h = hashFor(index);
      if (location.hash !== h) history.replaceState(null, '', h);
    } else if (sheet.isOpen()) {
      sheet.close();
      if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    }
    applyViewOffset();
  });

  /* ── 语言切换 ── */

  onLangChange(() => {
    gallery.refreshLabels(getLang());
    sheet.refresh();
  });

  /* 观众一旦操作，底部导览提示就退场 */
  const markTouched = () => {
    document.body.dataset.touched = '1';
  };
  window.addEventListener('pointerdown', markTouched, { once: true });
  window.addEventListener('keydown', markTouched, { once: true });
  window.addEventListener('wheel', markTouched, { once: true, passive: true });

  /* ── 尺寸 ── */

  function relayout() {
    stage.resize();
    post.resize();
    applyViewOffset();
  }
  window.addEventListener('resize', relayout);
  window.addEventListener('orientationchange', () => setTimeout(relayout, 240));

  /**
   * 展板展开时把 3D 画面让出 —— 桌面让出右半边，移动把画面上推。
   */
  function applyViewOffset() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (!sheet.isOpen()) {
      camera.clearViewOffset();
    } else if (w > 900) {
      const frac = Math.min(0.56, 800 / w);
      camera.setViewOffset(w, h, frac * w * 0.5, 0, w, h);
    } else {
      camera.setViewOffset(w, h, 0, h * 0.2, w, h);
    }
    camera.updateProjectionMatrix();
  }

  /* ── 每帧 ── */

  const root = document.documentElement;
  let lastInk = '';
  const focusAmt = items.map(() => 0);
  let prev = performance.now();
  let spotY = 0;

  function syncCss() {
    const c = atmosphere.current;
    const ink = `#${c.text.getHexString()}`;
    root.style.setProperty('--am-accent', `#${c.accent.getHexString()}`);
    if (ink === lastInk) return;
    lastInk = ink;
    root.style.setProperty('--am-ink', ink);
    root.style.setProperty('--am-paper', `#${c.fog.getHexString()}`);
    root.style.setProperty('--am-board-ink', hslToHex(0, 0, 0.09));
    const { h } = hexToHsl(`#${c.fog.getHexString()}`);
    root.style.setProperty('--am-board', hslToHex(h, 0.1, 0.955));
  }

  root.style.setProperty('--am-ink', atmosphere.text);
  root.style.setProperty('--am-paper', atmosphereFrom(EXHIBITS[0]).fog);
  root.style.setProperty('--am-accent', atmosphere.accent);
  root.style.setProperty('--am-board', '#f4f4f2');
  root.style.setProperty('--am-board-ink', '#16161a');

  function loop(now) {
    // dt 必须夹在 [0, 0.05]：
    // 首帧的 rAF 时间戳可能早于上一行取样到的 performance.now()，
    // 得到负 dt 会把入场进度往回推 —— 相机反向飞走、曝光变成负数、整屏全黑。
    const dt = Math.max(0, Math.min(0.05, (now - prev) / 1000));
    prev = now;

    controls.update(REDUCED ? Math.min(dt, 0.008) : dt);
    const camY = controls.state.y + controls.state.lean;
    stage.follow(camY);

    const reveal = controls.reveal;
    root.style.setProperty('--hud-op', String(reveal));
    renderer.toneMappingExposure = 0.28 + reveal * 0.72;

    const dim = atmosphere.update(dt);
    root.style.setProperty('--veil', String(dim));
    post.setTransition(atmosphere.transition, atmosphere.accent);
    syncCss();

    // 射灯跟随相机在墙上的注视高度，避免换件时射灯脱节
    spotY = damp(spotY, controls.state.y - controls.state.lift + controls.state.goal, 4.5, dt);
    lights.spot.position.y = spotY;
    lights.spot.target.updateMatrixWorld();
    spotNow += (spotTarget - spotNow) * (1 - Math.exp(-4.2 * dt));
    lights.spot.intensity = spotNow;

    // 被聚焦的展框：自发光 + 走向相机（local +z = 朝塔内）
    const focusIdx = controls.state.mode === 'focus' ? controls.state.index : -1;
    for (let i = 0; i < items.length; i += 1) {
      const target = i === focusIdx ? 1 : 0;
      const drift = (target - focusAmt[i]) * (1 - Math.exp(-6 * dt));
      if (Math.abs(drift) > 0.0006 || target !== focusAmt[i] && (target === 1 || focusAmt[i] > 0.001)) {
        focusAmt[i] += drift;
        const it = items[i];
        it.art.position.z = 0.305 + focusAmt[i] * 0.05;
        it.artMat.emissiveIntensity = it.emissiveBase * (1 + focusAmt[i] * 0.4);
        it.labelMat.emissiveIntensity = it.labelBase * (1 + focusAmt[i] * 0.4);
        it.haloMat.opacity = it.haloBase * (1 + focusAmt[i] * 0.62);
      }
    }

    dust.update(dt, controls.state.mode === 'focus' ? 0.7 : 1);
    post.render(dt);
    requestAnimationFrame(loop);
  }

  // damp 工具必须在 loop 之前已声明
  function damp(cur, target, lambda, dt) {
    return cur + (target - cur) * (1 - Math.exp(-lambda * dt));
  }

  renderer.render(scene, camera);
  progress(0.94, 'boot.entering');
  prev = performance.now();
  requestAnimationFrame(loop);
  setTimeout(bootDone, 460);

  /* ── 深链 ── */

  function applyHash() {
    const m = /^#\/([a-z0-9-]+)$/i.exec(location.hash || '');
    if (!m) return;
    const idx = indexById.get(m[1]);
    if (idx != null) {
      controls.goto(idx, true);
      controls.setFocus(true);
    }
  }
  window.addEventListener('hashchange', applyHash);
  applyHash();
}

applyStatic();
main().catch((err) => {
  console.error('[museum] failed to start', err);
  if (bootStatus) bootStatus.textContent = String(err && err.message ? err.message : err);
});
