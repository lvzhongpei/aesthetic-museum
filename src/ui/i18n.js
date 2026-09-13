/**
 * i18n —— 一层独立字典，而不是在文案里塞双语。
 * 藏品文案的双语存在 data/exhibits.js 里（形如 { zh, en }），
 * 这里只负责：语言状态、UI 词汇表、以及把 { zh, en } 对象解出来的 tr()。
 */

const STORAGE_KEY = 'am.lang';

const DICT = {
  zh: {
    'museum.name': '审美风格博物馆',
    'museum.sub': '跨媒介视觉流派档案',
    'museum.subEn': 'A MUSEUM OF AESTHETIC STYLES',
    'nav.index': '索引',
    'nav.about': '关于',
    'hint.drag': '环绕',
    'hint.swipe': '切换藏品',
    'hint.wheel': '推拉',
    'hint.click': '展开',
    'hint.arrows': '切换',
    'hint.esc': '退出展区',
    'boot.loading': '正在布置展厅…',
    'boot.building': '正在生成藏品画面…',
    'boot.ready': '入场',
    'boot.entering': '正在入场…',
    'room.prompt': '点击展开藏品',
    'sheet.source': '源流派',
    'sheet.rules': '视觉规则',
    'sheet.failure': '失效条件',
    'sheet.translation': '数字化转译',
    'sheet.timeline': '编年史',
    'sheet.works': '典型案例',
    'sheet.story': '一段轶事',
    'sheet.tokens': '可复制 token',
    'sheet.palette': '色板',
    'sheet.figures': '代表人物',
    'sheet.period': '年代',
    'sheet.origin': '地域',
    'sheet.medium': '媒介',
    'sheet.demo': '转译后的界面',
    'sheet.copy': '复制',
    'sheet.copied': '已复制',
    'sheet.copyAll': '复制全部 token',
    'sheet.prev': '上一件',
    'sheet.next': '下一件',
    'sheet.close': '关闭',
    'sheet.hint': '← → 切换藏品 · Esc 返回展厅',
    'index.title': '藏品索引',
    'index.note': '按年代顺序陈列，共 12 件',
    'about.title': '关于本馆',
    'about.body':
      '这座博物馆收藏跨媒介的视觉流派，而不是某个时代的流行配色。每件藏品拆成两层：它作为建筑、平面、产品或影像原本是什么；以及把它翻译成一块界面之后，会得到什么。所有画面由程序生成，不含任何第三方图片，可安全复制与再分发。',
    'about.credit': '十二件藏品 · 全部视觉资产程序生成 · MIT 许可',
    'about.method': '关于转译方法',
    'about.methodBody':
      '「数字化转译」不是把流派配色套到一个卡片上，而是找出该流派赖以成立的那条约束，再检验它在发光屏幕上是否还成立。多数流派会在这里暴露自己的失效条件——那恰恰是每件藏品最值得读的一段。',
    'err.webgl': '当前浏览器无法启动 3D 展厅，已切换到图鉴模式。',
    'mode.fallback': '图鉴模式',
    'perf.low': '已按设备性能降低渲染精度',
  },
  en: {
    'museum.name': 'A Museum of Aesthetic Styles',
    'museum.sub': 'An Archive of Cross-Media Visual Movements',
    'museum.subEn': '审美风格博物馆',
    'nav.index': 'INDEX',
    'nav.about': 'ABOUT',
    'hint.drag': 'orbit',
    'hint.swipe': 'change exhibit',
    'hint.wheel': 'zoom',
    'hint.click': 'open',
    'hint.arrows': 'change',
    'hint.esc': 'leave room',
    'boot.loading': 'Preparing the galleries…',
    'boot.building': 'Generating exhibit plates…',
    'boot.ready': 'Enter',
    'boot.entering': 'Entering…',
    'room.prompt': 'Click to open the exhibit',
    'sheet.source': 'The Source',
    'sheet.rules': 'Visual Rules',
    'sheet.failure': 'Where It Breaks',
    'sheet.translation': 'Digital Translation',
    'sheet.timeline': 'Chronology',
    'sheet.works': 'Canonical Works',
    'sheet.story': 'An Anecdote',
    'sheet.tokens': 'Copyable Tokens',
    'sheet.palette': 'Palette',
    'sheet.figures': 'Key Figures',
    'sheet.period': 'Period',
    'sheet.origin': 'Origin',
    'sheet.medium': 'Medium',
    'sheet.demo': 'The Translated Interface',
    'sheet.copy': 'Copy',
    'sheet.copied': 'Copied',
    'sheet.copyAll': 'Copy all tokens',
    'sheet.prev': 'Previous',
    'sheet.next': 'Next',
    'sheet.close': 'Close',
    'sheet.hint': '↓ ↑ change exhibit · Esc back to gallery',
    'index.title': 'Exhibit Index',
    'index.note': 'Chronological, twelve exhibits',
    'about.title': 'About',
    'about.body':
      'This museum collects cross-media visual movements rather than the fashionable palettes of any one decade. Each exhibit is dissected on two levels: what it was as architecture, graphic design, product or moving image; and what it becomes when translated into a piece of interface. Every image is generated procedurally with no third-party assets, so the whole archive can be copied and redistributed safely.',
    'about.credit': 'Twelve exhibits · all visual assets generated in code · MIT licensed',
    'about.method': 'On the Method of Translation',
    'about.methodBody':
      '“Digital translation” is not dropping a movement’s palette onto a card. It means finding the single constraint the movement was built on and testing whether it still holds on an emissive screen. Most movements expose their own failure conditions here — which is, precisely, the most useful paragraph in each exhibit.',
    'err.webgl': 'This browser cannot start the 3D gallery. Switched to catalogue mode.',
    'mode.fallback': 'Catalogue mode',
    'perf.low': 'Render quality reduced for this device',
  },
};

let lang = detect();

function detect() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'zh' || saved === 'en') return saved;
  } catch (e) {
    /* localStorage 不可用时静默降级 */
  }
  const nav = (navigator.language || 'zh').toLowerCase();
  return nav.startsWith('zh') ? 'zh' : 'en';
}

const listeners = new Set();

export function getLang() {
  return lang;
}

export function setLang(next) {
  if (next !== 'zh' && next !== 'en') return;
  if (next === lang) return;
  lang = next;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (e) {
    /* ignore */
  }
  applyStatic();
  listeners.forEach((fn) => fn(lang));
}

export function toggleLang() {
  setLang(lang === 'zh' ? 'en' : 'zh');
}

export function onLangChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** UI 词汇表查询 */
export function t(key) {
  return (DICT[lang] && DICT[lang][key]) || (DICT.zh[key] ?? key);
}

/** 把 { zh, en } 形式的藏品字段解成当前语言的字符串 */
export function tr(value) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  return value[lang] ?? value.zh ?? '';
}

/** 把形如 { zh: '...', en: '...' } 的字段渲染进 [data-i18n] 节点 */
export function applyStatic(root = document) {
  document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
  document.documentElement.setAttribute('data-lang', lang);
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
}

export default { getLang, setLang, toggleLang, onLangChange, t, tr, applyStatic };
