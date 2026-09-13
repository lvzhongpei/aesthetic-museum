import { t, tr, getLang, toggleLang, onLangChange, applyStatic } from './i18n.js';

const esc = (s) =>
  String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * 馆体 HUD：展区标识、索引抽屉、进度、语言切换。
 * 这里不做任何炫技——导航层的克制是让展品能被看的前提。
 */

export function createHud({ exhibits, onSelect }) {
  const el = {
    roomNo: document.getElementById('roomNo'),
    roomName: document.getElementById('roomName'),
    roomMeta: document.getElementById('roomMeta'),
    progressFill: document.getElementById('progressFill'),
    progressTotal: document.getElementById('progressTotal'),
    langToggle: document.getElementById('langToggle'),
    indexToggle: document.getElementById('indexToggle'),
    indexDrawer: document.getElementById('indexDrawer'),
    indexClose: document.getElementById('indexClose'),
    indexScrim: document.getElementById('indexScrim'),
    indexList: document.getElementById('indexList'),
    rail: document.getElementById('rail'),
  };

  let active = 0;

  el.progressTotal.textContent = String(exhibits.length).padStart(2, '0');

  /** 右侧导览轨：十二个刻度。刻度是导航，不是装饰。 */
  function buildRail() {
    el.rail.innerHTML = exhibits
      .map(
        (ex, i) => `
        <button class="rail__tick${i === active ? ' is-on' : ''}" type="button"
                data-rail="${i}" aria-label="${esc(ex.name.en)}" title="${esc(ex.name.zh)} / ${esc(ex.name.en)}">
          <span class="rail__no">${esc(ex.no)}</span>
          <span class="rail__bar"></span>
        </button>`,
      )
      .join('');
    el.rail.querySelectorAll('[data-rail]').forEach((btn) => {
      btn.addEventListener('click', () => onSelect(Number(btn.getAttribute('data-rail'))));
    });
  }

  function buildIndex() {
    const lang = getLang();
    el.indexList.innerHTML = exhibits
      .map(
        (ex, i) => `
        <li>
          <button class="index__item${i === active ? ' is-active' : ''}" type="button" data-i="${i}">
            <span class="index__no">${esc(ex.no)}</span>
            <span class="index__name">
              ${esc(ex.name[lang])}
              <em>${esc(ex.name.en)}</em>
              <span class="index__sw">
                ${ex.swatches.slice(0, 5).map((s) => `<i style="background:${esc(s.hex)}"></i>`).join('')}
              </span>
            </span>
            <span class="index__year">${esc(ex.span)}</span>
          </button>
        </li>`,
      )
      .join('');

    el.indexList.querySelectorAll('[data-i]').forEach((btn) => {
      btn.addEventListener('click', () => {
        closeIndex();
        onSelect(Number(btn.getAttribute('data-i')));
      });
    });
  }

  function setActive(i) {
    active = i;
    const lang = getLang();
    const ex = exhibits[i];
    el.roomNo.textContent = ex.no;
    el.roomName.textContent = ex.name[lang];
    el.roomMeta.textContent = `${tr(ex.medium)} · ${ex.period}`;
    el.progressFill.style.width = `${((i + 1) / exhibits.length) * 100}%`;
    el.indexList.querySelectorAll('[data-i]').forEach((btn) => {
      btn.classList.toggle('is-active', Number(btn.getAttribute('data-i')) === i);
    });
    el.rail.querySelectorAll('[data-rail]').forEach((btn) => {
      btn.classList.toggle('is-on', Number(btn.getAttribute('data-rail')) === i);
    });
  }

  function openIndex() {
    el.indexDrawer.setAttribute('aria-hidden', 'false');
    el.indexScrim.classList.add('is-on');
    el.indexToggle.setAttribute('aria-expanded', 'true');
  }

  function closeIndex() {
    el.indexDrawer.setAttribute('aria-hidden', 'true');
    el.indexScrim.classList.remove('is-on');
    el.indexToggle.setAttribute('aria-expanded', 'false');
  }

  el.indexToggle.addEventListener('click', () => {
    if (el.indexDrawer.getAttribute('aria-hidden') === 'false') closeIndex();
    else openIndex();
  });
  el.indexClose.addEventListener('click', closeIndex);
  el.indexScrim.addEventListener('click', closeIndex);
  el.langToggle.addEventListener('click', () => toggleLang());

  onLangChange(() => {
    applyStatic();
    buildIndex();
    buildRail();
    setActive(active);
  });

  applyStatic();
  buildIndex();
  buildRail();
  setActive(0);

  return { setActive, openIndex, closeIndex, buildIndex, buildRail };
}

export default createHud;
