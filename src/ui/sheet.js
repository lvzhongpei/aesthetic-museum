import { t, tr, getLang } from './i18n.js';
import { renderDemo } from '../exhibits/frames.js';

/**
 * 藏品详情面板。
 * 结构固定：转译界面 → 源流派 → 规则 → 失效条件 → 转译说明 → 色板 → token。
 * 顺序是有意的——先给结果，再给依据。
 */

const TOKEN_KEYS = [
  ['display', 'display-font'],
  ['body', 'body-font'],
  ['mono', 'mono-font'],
  ['radius', 'radius'],
  ['border', 'border'],
  ['shadow', 'shadow'],
  ['space', 'space-scale'],
  ['leading', 'line-height'],
  ['tracking', 'letter-spacing'],
  ['weight', 'font-weight'],
];

const esc = (s) =>
  String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function tokenBlock(ex) {
  const lines = [`/* ${ex.name.zh} / ${ex.name.en} — ${ex.period} */`, ':root {'];
  lines.push(`  --accent: ${ex.swatches[0].hex};`);
  ex.swatches.forEach((s, i) => {
    lines.push(`  --palette-${i + 1}: ${s.hex}; /* ${s.zh} */`);
  });
  TOKEN_KEYS.forEach(([key, name]) => {
    if (ex.tokens[key]) lines.push(`  --${name}: ${ex.tokens[key]};`);
  });
  lines.push('}');
  return lines.join('\n');
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e2) {
      return false;
    }
  }
}

export function createSheet({ el, inner, closeBtn, onClose, onPrev, onNext }) {
  let current = null;
  let index = 0;
  let total = 0;

  function header(ex) {
    const lang = getLang();
    // 副名永远给出「另一种语言」的叫法，中英对照才有意义
    const alt = lang === 'zh' ? ex.name.en : ex.name.zh;
    return `
      <header class="sh-head">
        <div class="sh-head__no">${esc(ex.no)} / ${String(total).padStart(2, '0')}</div>
        <h1 class="sh-head__name">
          ${esc(ex.name[lang])}
          <span>${esc(alt)}</span>
        </h1>
        <p class="sh-head__tag">${esc(tr(ex.tagline))}</p>
      </header>
      <dl class="sh-facts">
        <div class="sh-fact"><dt>${esc(t('sheet.period'))}</dt><dd>${esc(ex.period)}</dd></div>
        <div class="sh-fact"><dt>${esc(t('sheet.origin'))}</dt><dd>${esc(tr(ex.origin))}</dd></div>
        <div class="sh-fact"><dt>${esc(t('sheet.medium'))}</dt><dd>${esc(tr(ex.medium))}</dd></div>
      </dl>`;
  }

  function tokensTable(ex) {
    const rows = TOKEN_KEYS.filter(([k]) => ex.tokens[k])
      .map(
        ([k, name]) =>
          `<tr><th>${esc(name)}</th><td>${esc(ex.tokens[k])}</td></tr>`,
      )
      .join('');
    const note = ex.tokens.note
      ? `<tr><th>note</th><td>${esc(tr(ex.tokens.note))}</td></tr>`
      : '';
    return `<table class="sh-tokens"><tbody>${rows}${note}</tbody></table>
      <button class="sh-copyall" type="button" data-copy-all>${esc(t('sheet.copyAll'))}</button>`;
  }

  function swatches(ex) {
    return ex.swatches
      .map(
        (s) => `
        <button class="sh-sw" type="button" data-hex="${esc(s.hex)}" title="${esc(s.hex)}">
          <span class="sh-sw__chip" style="background:${esc(s.hex)}"></span>
          <span class="sh-sw__meta">
            <span class="sh-sw__hex">${esc(s.hex.toUpperCase())}</span>
            <span class="sh-sw__name">${esc(tr(s))}</span>
          </span>
        </button>`,
      )
      .join('');
  }

  function markup(ex) {
    return `
      ${header(ex)}
      <section class="sh-sec sh-sec--demo">
        <h2>${esc(t('sheet.demo'))}</h2>
        <div class="sh-demo">${renderDemo(ex, getLang())}</div>
      </section>
      <section class="sh-sec sh-sec--source">
        <h2>${esc(t('sheet.source'))}</h2>
        <p class="sh-p">${esc(tr(ex.source))}</p>
      </section>
      <section class="sh-sec">
        <h2>${esc(t('sheet.rules'))}</h2>
        <ol class="sh-rules">
          ${ex.rules.map((r) => `<li>${esc(tr(r))}</li>`).join('')}
        </ol>
      </section>
      <section class="sh-sec sh-sec--warn">
        <h2>${esc(t('sheet.failure'))}</h2>
        <p class="sh-p">${esc(tr(ex.failure))}</p>
      </section>
      <section class="sh-sec">
        <h2>${esc(t('sheet.translation'))}</h2>
        <p class="sh-p">${esc(tr(ex.translation))}</p>
      </section>
      <section class="sh-sec">
        <h2>${esc(t('sheet.palette'))}</h2>
        <div class="sh-swatches">${swatches(ex)}</div>
      </section>
      <section class="sh-sec">
        <h2>${esc(t('sheet.tokens'))}</h2>
        ${tokensTable(ex)}
      </section>
      <section class="sh-sec">
        <h2>${esc(t('sheet.figures'))}</h2>
        <div class="sh-chips">
          ${ex.figures.map((f) => `<span class="sh-chip">${esc(f)}</span>`).join('')}
        </div>
      </section>
      <nav class="sh-nav">
        <button class="sh-nav__btn" type="button" data-prev>← ${esc(t('sheet.prev'))}</button>
        <span class="sh-nav__hint">${esc(t('sheet.hint'))}</span>
        <button class="sh-nav__btn" type="button" data-next>${esc(t('sheet.next'))} →</button>
      </nav>`;
  }

  async function flash(btn, label) {
    const prev = btn.textContent;
    btn.textContent = label;
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = prev;
      btn.disabled = false;
    }, 1300);
  }

  function bind(ex) {
    inner.querySelectorAll('[data-hex]').forEach((b) => {
      b.addEventListener('click', async () => {
        const ok = await copy(b.getAttribute('data-hex'));
        if (ok) flash(b, t('sheet.copied'));
      });
    });
    const all = inner.querySelector('[data-copy-all]');
    if (all) {
      all.addEventListener('click', async () => {
        const ok = await copy(tokenBlock(ex));
        if (ok) flash(all, t('sheet.copied'));
      });
    }
    const prev = inner.querySelector('[data-prev]');
    const next = inner.querySelector('[data-next]');
    if (prev) prev.addEventListener('click', () => onPrev && onPrev());
    if (next) next.addEventListener('click', () => onNext && onNext());
  }

  function render(ex, i, n) {
    current = ex;
    index = i;
    total = n;
    inner.scrollTop = 0;
    inner.innerHTML = markup(ex);
    bind(ex);
  }

  function open(ex, i, n) {
    render(ex, i, n);
    el.setAttribute('aria-hidden', 'false');
    document.body.setAttribute('data-focus', '1');
  }

  function close() {
    el.setAttribute('aria-hidden', 'true');
    document.body.removeAttribute('data-focus');
    current = null;
    if (onClose) onClose();
  }

  function isOpen() {
    return el.getAttribute('aria-hidden') === 'false';
  }

  /** 语言切换：只重绘内容，不改变开关状态与滚动位置之外的东西 */
  function refresh() {
    if (!current) return;
    const keep = inner.scrollTop;
    inner.innerHTML = markup(current);
    bind(current);
    inner.scrollTop = keep;
  }

  closeBtn.addEventListener('click', close);

  return {
    open,
    close,
    isOpen,
    refresh,
    get exhibit() {
      return current;
    },
    get index() {
      return index;
    },
    get total() {
      return total;
    },
    tokenBlock,
  };
}

export default createSheet;
