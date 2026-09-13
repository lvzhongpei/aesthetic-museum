import './styles/base.css';
import './styles/sheet.css';
import './styles/exhibits.css';

import * as THREE from 'three';
import { EXHIBITS, MUSEUM } from './data/exhibits.js';
import { detectTier, createStage, RING_RADIUS } from './core/stage.js';
import { buildGallery, PLATE_Y } from './core/gallery.js';
import { createAtmosphere, atmosphereFrom } from './core/atmosphere.js';
import { createControls } from './core/controls.js';
import { createHud } from './ui/hud.js';
import { createSheet } from './ui/sheet.js';
import { t, getLang, onLangChange, applyStatic } from './ui/i18n.js';
import { paintPlate } from './core/plates.js';

const $ = (id) => document.getElementById(id);
const TOTAL = EXHIBITS.length;
const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ───────────────────────── 载入屏 ───────────────────────── */

const boot = $('boot');
const bootFill = $('bootFill');
const bootStatus = $('bootStatus');

function progress(p, key) {
  bootFill.style.width = `${Math.round(p * 100)}%`;
  if (key) bootStatus.textContent = t(key);
}

function bootDone() {
  progress(1, 'boot.ready');
  setTimeout(() => boot.classList.add('is-done'), 320);
}

/* ───────────────────────── WebGL 兜底 ───────────────────────── */

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext('webgl2') || c.getContext('webgl'))
    );
  } catch (e) {
    return false;
  }
}

/** 无法启动 3D 时，退回纯 DOM 图鉴——展品与文档一条不少，只是没有空间。 */
function catalogueFallback() {
  boot.classList.add('is-done');
  const canvas = $('stage');
  canvas.style.display = 'none';
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
  const cards = EXHIBITS.map((ex, i) => {
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
    return c;
  });
  cards.forEach((c) => grid.appendChild(c));

  const style = document.createElement('style');
  style.textContent = `
    .catalogue{position:absolute;inset:0;overflow-y:auto;background:#F4F4F2;color:#16161A;padding:80px clamp(18px,5vw,64px) 80px;z-index:4}
    .catalogue__head h1{font-size:24px;margin:0 0 8px;font-weight:600}
    .catalogue__head p{font-size:13px;opacity:.6;margin:0 0 34px}
    .catalogue__grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:22px}
    .catalogue__card{border:none;background:none;padding:0;cursor:pointer;text-align:left;font-family:inherit;color:inherit}
    .catalogue__card img{width:100%;display:block;border:1px solid rgba(22,22,26,.14);border-radius:3px;transition:transform .4s cubic-bezier(.3,.7,0,1)}
    .catalogue__card:hover img{transform:translateY(-4px)}
    .catalogue__no{display:block;font-family:var(--f-mono);font-size:10px;opacity:.45;margin:10px 0 3px}
    .catalogue__name{display:block;font-size:14px;font-weight:500}
    .catalogue__name em{display:block;font-style:normal;font-size:10.5px;letter-spacing:.1em;opacity:.45;margin-top:2px}
    .catalogue__sw{display:flex;gap:2px;margin-top:7px}
    .catalogue__sw i{width:14px;height:5px;border-radius:1px}`;
  document.head.appendChild(style);

  // 图鉴模式下仍然开放详情面板
  const sheet = createSheet({
    el: $('sheet'),
    inner: $('sheetInner'),
    closeBtn: $('sheetClose'),
    onClose: () => {},
    onPrev: () => {},
    onNext: () => {},
  });
  $('langToggle')?.addEventListener('click', () => {
    setTimeout(() => window.location.reload(), 60);
  });
}

/* ───────────────────────── 主流程 ───────────────────────── */

async function main() {
  if (!hasWebGL()) {
    catalogueFallback();
    return;
  }

  const tier = detectTier();
  progress(0.05, 'boot.loading');

  // 兜底：无论发生什么，12 秒后一定要撤掉载入屏，绝不让观众停在黑屏上
  setTimeout(() => {
    if (!boot.classList.contains('is-done')) {
      console.warn('[museum] boot watchdog: 首帧未在预期时间内完成，强制开馆');
      bootDone();
    }
  }, 12000);

  // 字体先就位，否则程序生成的展品画面会用错字体
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
    /* 字体没到就用系统字体，不阻断开馆 */
  }
  progress(0.12, 'boot.building');

  const canvas = $('stage');
  const stage = createStage(canvas, tier);
  const { scene, camera, renderer, lights, mats } = stage;

  const gallery = await buildGallery(
    scene,
    EXHIBITS,
    getLang(),
    renderer,
    tier,
    (done, total) => progress(0.12 + (done / total) * 0.7, 'boot.building'),
  );

  const items = gallery.items;
  const indexById = new Map(EXHIBITS.map((e, i) => [e.id, i]));

  const atmosphere = createAtmosphere(stage, atmosphereFrom(EXHIBITS[0]));
  const controls = createControls(camera, { count: TOTAL, canvas });
  controls.state.allowIdle = !REDUCED;

  /* ── HUD 与面板 ── */

  const hud = createHud({
    exhibits: EXHIBITS,
    onSelect: (i) => controls.setFocus(i),
  });

  const sheet = createSheet({
    el: $('sheet'),
    inner: $('sheetInner'),
    closeBtn: $('sheetClose'),
    onClose: () => controls.setFocus(null),
    onPrev: () => controls.step(-1),
    onNext: () => controls.step(1),
  });

  /* ── 拾取 ── */

  const raycaster = new THREE.Raycaster();
  const pickables = items.flatMap((it) => [it.art, it.label, it.backer]);

  controls.onPick((ndc) => {
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(pickables, false);
    if (!hits.length) return;
    const id = hits[0].object.userData.exhibitId;
    const idx = indexById.get(id);
    if (idx == null) return;
    controls.setFocus(idx);
    if (!sheet.isOpen() || (sheet.exhibit && sheet.exhibit.id !== id)) {
      sheet.open(EXHIBITS[idx], idx, TOTAL);
    }
  });

  /* ── 聚焦变化：换氛围、换射灯、换面板 ── */

  let spotTarget = 0;
  let lastOverviewIdx = 0;

  function placeSpot(index) {
    if (index == null) {
      spotTarget = 0;
      return;
    }
    const a = (index / TOTAL) * Math.PI * 2;
    const x = Math.sin(a) * (RING_RADIUS - 1.7);
    const z = Math.cos(a) * (RING_RADIUS - 1.7);
    lights.spot.position.set(x, 6.1, z);
    lights.spot.target.position.set(x, PLATE_Y, z);
    lights.spot.target.updateMatrixWorld();
    spotTarget = tier.shadows ? 1.5 : 0.9;
  }

  function hashFor(i) {
    return `#/${EXHIBITS[i].id}`;
  }

  controls.onFocus((i) => {
    if (i == null) {
      if (sheet.isOpen()) sheet.close();
      placeSpot(null);
      const near = controls.nearestIndex(controls.state.azimuth);
      lastOverviewIdx = near;
      hud.setActive(near);
      atmosphere.set(atmosphereFrom(EXHIBITS[near]), { doorway: false });
      if (location.hash) history.replaceState(null, '', location.pathname + location.search);
      applyViewOffset();
      return;
    }
    hud.setActive(i);
    placeSpot(i);
    atmosphere.set(atmosphereFrom(EXHIBITS[i]), { doorway: true });
    if (!sheet.isOpen() || !sheet.exhibit || sheet.exhibit.id !== EXHIBITS[i].id) {
      sheet.open(EXHIBITS[i], i, TOTAL);
    }
    const h = hashFor(i);
    if (location.hash !== h) history.replaceState(null, '', h);
    applyViewOffset();
  });

  /* ── 语言切换 ── */

  onLangChange(() => {
    gallery.refreshLabels(getLang());
    sheet.refresh();
  });

  /* 观众一旦开始操作，底部导览提示就退场 */
  const markTouched = () => {
    document.body.dataset.touched = '1';
  };
  window.addEventListener('pointerdown', markTouched, { once: true });
  window.addEventListener('keydown', markTouched, { once: true });
  window.addEventListener('wheel', markTouched, { once: true, passive: true });

  /* ── 尺寸 ── */

  function relayout() {
    stage.resize();
    applyViewOffset();
  }
  window.addEventListener('resize', relayout);
  window.addEventListener('orientationchange', () => setTimeout(relayout, 240));

  /**
   * 面板展开时，把 3D 画面让出面板占用的位置——
   * 桌面端让出右半边，移动端把画面整体上推，好让展品在抽屉上方露出上半截。
   *
   * setViewOffset 的 x/y 都是「视窗左上角在更大视锥里的位置」，向右向下为正，
   * 所以 x 为正 = 相机瞄向右侧 = 画面左移；y 为正 = 相机瞄向下方 = 画面上移。
   */
  function applyViewOffset() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (!sheet.isOpen()) {
      camera.clearViewOffset();
    } else if (w > 860) {
      const frac = Math.min(0.56, 780 / w);
      camera.setViewOffset(w, h, frac * w * 0.5, 0, w, h);
    } else {
      camera.setViewOffset(w, h, 0, h * 0.2, w, h);
    }
    camera.updateProjectionMatrix();
  }

  /* ── 每帧 ── */

  const root = document.documentElement;
  let lastInk = '';
  let focusAmt = items.map(() => 0);
  let spotNow = 0;
  let prev = performance.now();

  /* 展板色：从展区环境色里只借一点色相，明度锁死在浅纸面。
     这样即便展区是深绿或深紫，藏品面板依然是一块能看清颜色的浅板。 */
  function hexToHsl(hex) {
    const n = parseInt(hex.slice(1), 16);
    const r = ((n >> 16) & 255) / 255;
    const g = ((n >> 8) & 255) / 255;
    const b = (n & 255) / 255;
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

  function hslToHex(h, s, l) {
    const f = (n) => {
      const k = (n + h * 12) % 12;
      const a = s * Math.min(l, 1 - l);
      const v = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
      return Math.round(Math.max(0, Math.min(1, v)) * 255);
    };
    return `#${((1 << 24) + (f(0) << 16) + (f(8) << 8) + f(4)).toString(16).slice(1)}`;
  }

  function syncCss() {
    const c = atmosphere.current;
    const ink = `#${c.text.getHexString()}`;
    if (ink === lastInk) return;
    lastInk = ink;

    root.style.setProperty('--am-ink', ink);
    root.style.setProperty('--am-paper', `#${c.ambient.getHexString()}`);
    root.style.setProperty('--am-accent', `#${c.accent.getHexString()}`);
    root.style.setProperty('--am-board-ink', hslToHex(0, 0, 0.09));

    const { h } = hexToHsl(`#${c.ambient.getHexString()}`);
    root.style.setProperty('--am-board', hslToHex(h, 0.1, 0.955));
  }

  // 初始把 CSS 变量设一次，避免首帧闪成默认墨色
  root.style.setProperty('--am-ink', atmosphere.text);
  root.style.setProperty('--am-paper', atmosphereFrom(EXHIBITS[0]).ambient);
  root.style.setProperty('--am-accent', atmosphere.accent);

  function loop(now) {
    const dt = Math.min(0.05, (now - prev) / 1000);
    prev = now;

    controls.update(dt);

    // 待机自转 + 总览时氛围跟着最近的展位漂移
    if (controls.state.mode === 'overview' && !REDUCED) {
      const near = controls.nearestIndex(controls.state.azimuth);
      if (near !== lastOverviewIdx) {
        lastOverviewIdx = near;
        hud.setActive(near);
        atmosphere.set(atmosphereFrom(EXHIBITS[near]), { doorway: false });
      }
    }

    const dim = atmosphere.update(dt);
    root.style.setProperty('--veil', String(dim));
    syncCss();

    // 射灯强度淡入淡出
    spotNow += (spotTarget - spotNow) * (1 - Math.exp(-4.5 * dt));
    lights.spot.intensity = spotNow;

    // 被聚焦的展框浮起一点、并亮起自身强调色
    const focusIdx = controls.state.focusIndex;
    for (let i = 0; i < items.length; i += 1) {
      const target = i === focusIdx ? 1 : 0;
      if (Math.abs(focusAmt[i] - target) > 0.001) {
        focusAmt[i] += (target - focusAmt[i]) * (1 - Math.exp(-6 * dt));
        const it = items[i];
        it.art.position.z = 0.005 + focusAmt[i] * 0.05;
        it.artMat.emissiveIntensity = 0.34 + focusAmt[i] * 0.24;
        it.labelMat.emissiveIntensity = 0.42 + focusAmt[i] * 0.22;
        it.poolMat.opacity = 0.16 + focusAmt[i] * 0.2;
        it.backerMat.emissive.copy(it.accent);
        it.backerMat.emissiveIntensity = focusAmt[i] * 0.16;
      }
    }

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }

  // 首帧渲染完成后再撤载入屏
  renderer.render(scene, camera);
  progress(0.94);
  prev = performance.now();
  requestAnimationFrame(loop);
  setTimeout(bootDone, 420);

  /* ── 深链：/…#/bauhaus ── */

  function applyHash() {
    const m = /^#\/([a-z0-9-]+)$/i.exec(location.hash || '');
    if (!m) return;
    const idx = indexById.get(m[1]);
    if (idx != null) {
      controls.setFocus(idx, true);
      atmosphere.set(atmosphereFrom(EXHIBITS[idx]), { immediate: false, doorway: true });
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
