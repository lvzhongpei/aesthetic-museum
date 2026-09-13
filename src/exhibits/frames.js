/**
 * 数字化转译 —— 每件藏品渲染成一块真实的界面（真 DOM / 真 CSS）。
 * 不是截图，不是配图。你可以直接在上面框选文字、复制 token。
 *
 * 每个 demo 只回答一个问题：如果这个流派来做这块界面，它会怎么做决定？
 * 文案与界面语言同步，切到英文时整块 specimen 一起切换——否则它就成了配图。
 */

const S = {
  zh: {
    bhHead: 'STATUS / 状态',
    bhA: '已完成',
    bhAp: '颜色只标注类别，不承担层级。',
    bhB: '进行中',
    bhBp: '层级由字号、留白与一条 1px 线完成。',
    bhC: '待处理',
    bhCp: '关掉颜色只看灰度，结构依然成立。',
    bhBtn: '继续',

    dsMeals: '本月供餐',
    dsUnit: '份',
    dsInc: '食安事故',
    dsCanteen: '在营食堂',
    dsRice: '米耗',

    adKicker: 'MEMBERSHIP · 1930',
    adName: '吕 中 培',
    adSub: '永久会员 / PERMANENT',

    swKicker: '栏目标题 / SECTION 04',
    swTitleA: '网格不是用来对齐的，',
    swTitleB: '是用来做决定的',
    swB1: '先有栏数与基线，再有内容。任何元素的位置都能被网格解释——如果解释不了，说明它不该在那儿。',
    swB2: '层级只用字号与字重表达，不靠颜色、不靠装饰线、不靠阴影。',
    swQ: '能不能指出版面上最重要的那一个元素？指不出来，网格就只是装饰。',

    mcSpec: '模压胶合板 · 皮革 · 铝',
    mcTax: '含税',
    mcBtn: '加入清单',

    brTitle: '食安事故天数',
    brEn: 'DAYS SINCE INCIDENT',
    brRow1: '在营食堂',
    brRow2: '在线探头',
    brRow3: '离线',
    brBarA: 'CONTROL',

    wsDate: '二〇二六年 · 九月十三日 / 雨',
    wsLine: '今天没有做完的事，明天还在那里。',
    wsSig: '— 记于 06:12',

    ukKicker: '神奈川沖浪裏 · 1831',
    ukTitle: '把视线从主体移开',
    ukText: '主体被画面边缘切断，取景像镜头，而不像画框。',
    ukSeal: '印',

    paKicker: 'SEASONAL · 限量',
    paWord: '现在',
    paSub: '重复本身就是信息量',
    paBtn: '查看',

    meKicker: 'NOW PLAYING',
    meTitle: 'Colour Wins',
    meArtist: 'Sottsass & the Milano Kids',

    noHead: '本周',
    noMeta: '3 完成 / 2 待办',
    noT1: '核对九月食谱营养配比',
    noT2: '与后厨确认探头点位',
    noT3: '归档八月食安记录',
    noT4: '起草第四季度培训计划',
    noT5: '更新资格证书补贴细则',
    noFoot: '低对比只留给分隔线，正文守住 7:1。',

    yyChip: 'MEDIA · 2001',
    yyTrack: 'Vaporwave Suite No.4',
  },
  en: {
    bhHead: 'STATUS',
    bhA: 'Shipped',
    bhAp: 'Colour labels the category; it never carries hierarchy.',
    bhB: 'In progress',
    bhBp: 'Hierarchy is done by scale, void and one 1px rule.',
    bhC: 'Queued',
    bhCp: 'Switch to greyscale and the structure still holds.',
    bhBtn: 'Continue',

    dsMeals: 'Meals served',
    dsUnit: '',
    dsInc: 'Safety incidents',
    dsCanteen: 'Live canteens',
    dsRice: 'Rice used',

    adKicker: 'MEMBERSHIP · 1930',
    adName: 'LÜ ZHONGPEI',
    adSub: '永久会员 / PERMANENT',

    swKicker: 'SECTION 04',
    swTitleA: 'A grid is not for aligning.',
    swTitleB: 'It is for deciding.',
    swB1: 'Column count and baseline come first; content comes second. Every element’s position can be explained by the grid — if it cannot, it does not belong there.',
    swB2: 'Hierarchy is expressed only through size and weight, never colour, rules or shadow.',
    swQ: 'Can you point to the single most important element on the page? If not, the grid is ornament.',

    mcSpec: 'Moulded plywood · Leather · Aluminium',
    mcTax: 'incl. tax',
    mcBtn: 'Add to list',

    brTitle: 'Days since incident',
    brEn: 'DAYS SINCE INCIDENT',
    brRow1: 'Live canteens',
    brRow2: 'Sensors online',
    brRow3: 'Offline',
    brBarA: 'CONTROL',

    wsDate: '13 SEPT 2026 / RAIN',
    wsLine: 'What is unfinished today is still there tomorrow.',
    wsSig: '— logged 06:12',

    ukKicker: 'The Great Wave off Kanagawa · 1831',
    ukTitle: 'Move the eye off the subject',
    ukText: 'The subject is sliced by the frame edge; the crop behaves like a camera, not a frame.',
    ukSeal: '印',

    paKicker: 'SEASONAL · limited',
    paWord: 'NOW',
    paSub: 'Repetition is the message',
    paBtn: 'View',

    meKicker: 'NOW PLAYING',
    meTitle: 'Colour Wins',
    meArtist: 'Sottsass & the Milano Kids',

    noHead: 'This week',
    noMeta: '3 done / 2 open',
    noT1: 'Check September menu nutrition ratios',
    noT2: 'Confirm sensor points with the kitchen',
    noT3: 'Archive August safety records',
    noT4: 'Draft the Q4 training plan',
    noT5: 'Update the certification subsidy rules',
    noFoot: 'Low contrast is spent on dividers; body text holds 7:1.',

    yyChip: 'MEDIA · 2001',
    yyTrack: 'Vaporwave Suite No.4',
  },
};

const chip = (c) => `<i class="d-chip" style="--c:${c}"></i>`;

const PAINTERS = {
  /* 01 包豪斯 · 三状态功能卡 */
  cards: (p, s) => `
    <div class="demo demo--bauhaus">
      <div class="bh-head">
        <span class="bh-head__no">01</span>
        <span class="bh-head__rule"></span>
        <span class="bh-head__label">${s.bhHead}</span>
      </div>
      <div class="bh-cards">
        <article class="bh-card bh-card--a">
          <span class="bh-card__tag">A</span>
          <h4>${s.bhA}</h4>
          <p>${s.bhAp}</p>
        </article>
        <article class="bh-card bh-card--b">
          <span class="bh-card__tag">B</span>
          <h4>${s.bhB}</h4>
          <p>${s.bhBp}</p>
        </article>
        <article class="bh-card bh-card--c">
          <span class="bh-card__tag">C</span>
          <h4>${s.bhC}</h4>
          <p>${s.bhCp}</p>
        </article>
      </div>
      <div class="bh-foot">
        <button class="bh-btn" type="button">${s.bhBtn}</button>
        <span class="bh-meta">3 / 12 · 08:40</span>
      </div>
    </div>`,

  /* 02 风格派 · 悬殊块面仪表盘 */
  'grid-dashboard': (p, s) => `
    <div class="demo demo--destijl">
      <div class="ds-grid">
        <div class="ds-cell ds-cell--main">
          <span class="ds-k">${s.dsMeals}</span>
          <strong>184,260</strong>
          <span class="ds-u">${s.dsUnit}</span>
        </div>
        <div class="ds-cell ds-cell--r"><span class="ds-k">${s.dsInc}</span><strong>0</strong></div>
        <div class="ds-cell ds-cell--y"><span class="ds-k">${s.dsCanteen}</span><strong>37</strong></div>
        <div class="ds-cell ds-cell--b"><span class="ds-k">${s.dsRice}</span><strong>21.4</strong><span class="ds-u">t</span></div>
        <div class="ds-cell ds-cell--strip">
          <span class="ds-k">01</span><span class="ds-k">02</span><span class="ds-k">03</span>
        </div>
      </div>
    </div>`,

  /* 03 装饰艺术 · 会员卡 */
  invitation: (p, s) => `
    <div class="demo demo--artdeco">
      <div class="ad-card">
        <div class="ad-rays" aria-hidden="true"></div>
        <div class="ad-inner">
          <div class="ad-crown" aria-hidden="true">
            <i></i><i></i><i></i><i></i><i></i>
          </div>
          <p class="ad-kicker">${s.adKicker}</p>
          <h3>${s.adName}</h3>
          <p class="ad-rule"></p>
          <p class="ad-sub">${s.adSub}</p>
          <div class="ad-foot">
            <span>Nº 0134</span>
            <span>VALID ∞</span>
          </div>
        </div>
      </div>
    </div>`,

  /* 04 瑞士国际主义 · 编辑型长文 */
  editorial: (p, s) => `
    <div class="demo demo--swiss">
      <div class="sw-grid">
        <p class="sw-kicker">${s.swKicker}</p>
        <h3 class="sw-title">${s.swTitleA}<br />${s.swTitleB}</h3>
        <div class="sw-body">
          <p>${s.swB1}</p>
          <p>${s.swB2}</p>
        </div>
        <blockquote class="sw-quote">${s.swQ}</blockquote>
        <p class="sw-note"><em>Josef Müller-Brockmann</em> · Neue Grafik, 1958</p>
      </div>
    </div>`,

  /* 05 世纪中叶现代 · 产品卡 */
  'product-card': (p, s) => `
    <div class="demo demo--midcentury">
      <div class="mc-card">
        <div class="mc-shot">
          <div class="mc-orb"></div>
          <div class="mc-legs" aria-hidden="true"><i></i><i></i></div>
        </div>
        <div class="mc-info">
          <h4>Lounge Chair 670</h4>
          <p class="mc-spec">${s.mcSpec}</p>
          <div class="mc-price"><strong>¥ 8,640</strong><span>${s.mcTax}</span></div>
          <button class="mc-btn" type="button">${s.mcBtn}</button>
          <p class="mc-dots" aria-hidden="true">
            <i></i><i></i><i></i><i></i><i></i><i></i>
          </p>
        </div>
      </div>
    </div>`,

  /* 06 粗野主义 · 基础设施看板 */
  'infra-dashboard': (p, s) => `
    <div class="demo demo--brutalism">
      <div class="br-panel">
        <div class="br-bar"><span>${s.brBarA}</span><span>09:41</span></div>
        <div class="br-big">
          <strong>0</strong>
          <span>${s.brTitle}<br /><em>${s.brEn}</em></span>
        </div>
        <div class="br-rows">
          <div class="br-row"><span>${s.brRow1}</span><b>37</b></div>
          <div class="br-row"><span>${s.brRow2}</span><b>412</b></div>
          <div class="br-row br-row--alert"><span>${s.brRow3}</span><b>2</b></div>
        </div>
        <div class="br-tick" aria-hidden="true"></div>
      </div>
    </div>`,

  /* 07 侘寂 · 冥想记录 */
  'quiet-log': (p, s) => `
    <div class="demo demo--wabisabi">
      <div class="ws-page">
        <p class="ws-date">${s.wsDate}</p>
        <svg class="ws-enso" viewBox="0 0 200 200" aria-hidden="true">
          <path d="M100 22 C 148 22 176 58 176 102 C 176 148 142 180 98 180 C 54 180 24 150 25 106 C 26 70 52 42 88 32" />
          <circle cx="86" cy="30" r="3.1" fill="#3A3733" opacity=".72" />
        </svg>
        <p class="ws-line">${s.wsLine}</p>
        <p class="ws-sig">${s.wsSig}</p>
      </div>
    </div>`,

  /* 08 浮世绘 · 平涂内容卡 */
  'print-card': (p, s) => `
    <div class="demo demo--ukiyoe">
      <div class="uk-card">
        <div class="uk-scene" aria-hidden="true">
          <span class="uk-sky"></span>
          <span class="uk-sky2"></span>
          <span class="uk-mtn"></span>
          <span class="uk-wave uk-wave--a"></span>
          <span class="uk-wave uk-wave--b"></span>
          <span class="uk-foam a"></span><span class="uk-foam b"></span><span class="uk-foam c"></span>
        </div>
        <div class="uk-body">
          <p class="uk-kicker">${s.ukKicker}</p>
          <h4>${s.ukTitle}</h4>
          <p class="uk-text">${s.ukText}</p>
          <p class="uk-seal">${s.ukSeal}</p>
        </div>
      </div>
    </div>`,

  /* 09 波普 · 活动横幅 */
  'promo-banner': (p, s) => `
    <div class="demo demo--popart">
      <div class="pa-banner">
        <div class="pa-dots" aria-hidden="true"></div>
        <p class="pa-kicker">${s.paKicker}</p>
        <h3 class="pa-title">
          <span>${s.paWord}</span><span>${s.paWord}</span><span>${s.paWord}</span>
        </h3>
        <p class="pa-sub">${s.paSub}</p>
        <div class="pa-row">
          <span class="pa-badge">-50%</span>
          <button class="pa-btn" type="button">${s.paBtn}</button>
        </div>
      </div>
    </div>`,

  /* 10 孟菲斯 · 音乐播放器 */
  'music-player': (p, s) => `
    <div class="demo demo--memphis">
      <div class="me-player">
        <div class="me-disc">
          <span class="me-disc__dot"></span>
          <span class="me-disc__note">♪</span>
        </div>
        <div class="me-zig" aria-hidden="true"></div>
        <div class="me-body">
          <p class="me-kicker">${s.meKicker}</p>
          <h4>${s.meTitle}</h4>
          <p class="me-artist">${s.meArtist}</p>
          <div class="me-bar"><i></i></div>
          <div class="me-times"><span>1:12</span><span>3:48</span></div>
          <div class="me-ctrls">
            <button class="me-btn" type="button" aria-label="prev">◀◀</button>
            <button class="me-btn me-btn--play" type="button" aria-label="play">▶</button>
            <button class="me-btn" type="button" aria-label="next">▶▶</button>
          </div>
        </div>
      </div>
    </div>`,

  /* 11 北欧极简 · 任务清单 */
  'task-list': (p, s) => `
    <div class="demo demo--nordic">
      <div class="no-sheet">
        <div class="no-head">
          <h4>${s.noHead}</h4>
          <span>${s.noMeta}</span>
        </div>
        <ul class="no-list">
          <li class="is-done"><span class="no-mark"></span><span class="no-t">${s.noT1}</span></li>
          <li class="is-done"><span class="no-mark"></span><span class="no-t">${s.noT2}</span></li>
          <li class="is-done"><span class="no-mark"></span><span class="no-t">${s.noT3}</span></li>
          <li><span class="no-mark"></span><span class="no-t">${s.noT4}</span></li>
          <li><span class="no-mark"></span><span class="no-t">${s.noT5}</span></li>
        </ul>
        <p class="no-foot">${s.noFoot}</p>
      </div>
    </div>`,

  /* 12 千禧 / 蒸汽波 · 媒体播放器 */
  'media-player': (p, s) => `
    <div class="demo demo--y2k">
      <div class="yy-player">
        <div class="yy-grid" aria-hidden="true"></div>
        <div class="yy-top">
          <span class="yy-px" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span>
          <span class="yy-chip">${s.yyChip}</span>
        </div>
        <div class="yy-orb"></div>
        <div class="yy-scrim">
          <p class="yy-track">${s.yyTrack}</p>
          <p class="yy-time">00:04:12 / 00:07:30</p>
        </div>
        <div class="yy-bar" aria-hidden="true">
          <i style="width:56%"></i>
        </div>
        <div class="yy-ctrls">
          <button class="yy-btn" type="button" aria-label="prev">◀</button>
          <button class="yy-btn yy-btn--go" type="button" aria-label="play">▶</button>
          <button class="yy-btn" type="button" aria-label="next">▶</button>
        </div>
      </div>
    </div>`,
};

export function renderDemo(ex, lang = 'zh') {
  const fn = PAINTERS[ex.demo];
  if (!fn) return '';
  return fn(ex, S[lang] || S.zh);
}

export default renderDemo;
