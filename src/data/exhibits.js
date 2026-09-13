/**
 * 审美风格博物馆 · 藏品档案
 * ------------------------------------------------------------------
 * 十二件跨媒介视觉流派。每一件分两层：
 *   source / rules / failure —— 源流派：史料、规则、失效条件
 *   translation / tokens / demo —— 数字化转译：把该流派翻译成一块界面
 *
 * 所有视觉资产由程序生成，不含任何第三方图片，仓库可安全公开。
 * 每条文案均为中英双语文档，由 i18n 层按当前语言取用。
 */

export const MUSEUM = {
  name: { zh: '审美风格博物馆', en: 'A Museum of Aesthetic Styles' },
  sub: { zh: '跨媒介视觉流派档案', en: 'An Archive of Cross-Media Visual Movements' },
  subEn: { zh: 'A MUSEUM OF AESTHETIC STYLES', en: '审美风格博物馆' },
  intro: {
    zh: '十二件藏品，来自建筑、平面、产品、时尚与数字界面。每一件都拆成两层：它原本是什么，以及它被翻译成一块界面之后是什么样。',
    en: 'Twelve exhibits drawn from architecture, graphic design, product, fashion and digital interfaces. Each is dissected on two levels: what it was, and what it becomes when translated into a piece of interface.',
  },
};

export const EXHIBITS = [
  /* ─────────────────────────── 01 包豪斯 ─────────────────────────── */
  {
    id: 'bauhaus',
    no: '01',
    name: { zh: '包豪斯', en: 'Bauhaus' },
    medium: { zh: '建筑 · 平面 · 产品', en: 'Architecture · Graphic · Product' },
    period: '1919–1933',
    origin: { zh: '德国 魏玛 → 德绍 → 柏林', en: 'Weimar → Dessau → Berlin, Germany' },
    figures: ['Walter Gropius', 'Herbert Bayer', 'Marianne Brandt', 'Josef Albers'],
    tagline: {
      zh: '把艺术从手艺人的手里拿出来，放进工业的模具。',
      en: 'Art lifted out of the craftsman’s hand and set into an industrial mould.',
    },
    source: {
      zh: '1919 年格罗皮乌斯把魏玛的美术学院与工艺美术学校合并，成立国立包豪斯。它要培养的不是画家，而是能同时面对钢材、玻璃、印刷机和批量生产的人。伊顿与莫霍利-纳吉主持的基础课（Vorkurs）教的是材料、对比和构成，不是风格。1923 年展览上的号角屋把所有主张压成一栋房子：方体、白墙、无装饰、功能分区。1933 年在政治压力下关闭，师生把方法带去了芝加哥、特拉维夫和乌尔姆——它输掉了德国，却赢下了整个现代主义。',
      en: 'In 1919 Gropius merged the Weimar art academy with its school of applied arts to found the Staatliches Bauhaus. Its aim was not to produce painters but people able to face steel, glass, the printing press and mass production at once. The Vorkurs, run by Itten and later Moholy-Nagy, taught materials, contrast and composition rather than a style. The 1923 exhibition’s Haus am Horn compressed every claim into one building: cubic, white, unornamented, functionally zoned. Closed under political pressure in 1933, its students carried the method to Chicago, Tel Aviv and Ulm — it lost Germany and won modernism.',
    },
    rules: [
      {
        zh: '几何优先。只允许矩形、正圆、直线与 90°/30° 角构成的形，装饰性曲线系统性出局。',
        en: 'Geometry first. Only rectangles, true circles, straight lines and 90°/30° angles — decorative curves are systematically excluded.',
      },
      {
        zh: '三原色节制。红、黄、蓝只作功能标记（区分板块与状态），不铺开当背景；且必须由黑或米白压住。',
        en: 'Primary colours in ration. Red, yellow and blue mark function — they separate zones and states — never flood a background, and always sit against black or off-white.',
      },
      {
        zh: '无衬线，倾向小写。拜尔主张放弃大写字母；节奏靠字重与字号对比制造，而非切换字体家族。',
        en: 'Sans-serif, leaning lowercase. Bayer argued for dropping capitals altogether; rhythm comes from weight and scale contrast, not from switching type families.',
      },
      {
        zh: '非中心构成。版式按视觉重量而非对称轴排布，元素之间用明确的空白分隔——空白是结构件，不是剩余空间。',
        en: 'Off-centre composition. Layout follows visual weight, not a mirror axis, and elements are separated by deliberate void — whitespace is a structural member, not leftover space.',
      },
    ],
    failure: {
      zh: '包豪斯在屏幕上最容易崩掉的地方就是三原色。三原色在印刷品里是油墨，在屏幕上却是纯度高到发光的色块；一旦被铺成大面积背景，整块界面会像一块警告牌。判断标准很简单：关掉颜色只看灰度，如果层级仍然成立，颜色只是强化；如果灰度下结构消失，说明颜色已经在替结构干活了。',
      en: 'Where Bauhaus breaks on screen is the primaries. In print they are ink; on screen they are high-chroma emitters. Spread across a large background they make the whole interface read as a warning sign. The test is simple: switch to greyscale. If the hierarchy survives, colour is reinforcement. If the structure vanishes, colour has started doing the structure’s job.',
    },
    translation: {
      zh: '翻译到界面，包豪斯给出的不是一套配色，而是一条戒律：每个元素必须能说明自己为什么在这里。演示里三张卡片承担三种状态，颜色只标注类别、不承担层级；层级由字号、留白和一条 1px 黑线完成。这和当代 design token 的思路同源——颜色是语义变量，不是装饰。',
      en: 'Translated into interface, Bauhaus delivers not a palette but an injunction: every element must be able to justify its presence. In the demo three cards carry three states; colour labels category and never carries hierarchy. Hierarchy is done by scale, void and a single 1px black rule — the same instinct behind today’s design tokens, where colour is a semantic variable, not decoration.',
    },
    swatches: [
      { hex: '#E03B2A', zh: '包豪斯红', en: 'Bauhaus Red' },
      { hex: '#F2C200', zh: '信号黄', en: 'Signal Yellow' },
      { hex: '#1B4CA1', zh: '普鲁士蓝', en: 'Prussian Blue' },
      { hex: '#141414', zh: '墨黑', en: 'Ink Black' },
      { hex: '#F2EFE6', zh: '石膏米白', en: 'Plaster Off-White' },
    ],
    tokens: {
      display: 'Archivo / Inter 800', body: 'Inter 400', mono: 'DM Mono 400',
      radius: '0px', border: '1px solid #141414', shadow: 'none',
      space: '8 / 16 / 24 / 40', leading: '1.15', tracking: '-0.01em',
      weight: '800 / 400', note: { zh: '零圆角、零阴影，边界一律用线', en: 'Zero radius, zero shadow — all edges are lines' },
    },
    atmosphere: { ambient: '#F2EFE6', key: '#FFFFFF', floor: '#E4DFD2', wall: '#EDE8DC', fog: '#DCD6C7', accent: '#E03B2A', text: '#141414' },
    demo: 'cards',
  },

  /* ─────────────────────────── 02 风格派 ─────────────────────────── */
  {
    id: 'destijl',
    no: '02',
    name: { zh: '风格派', en: 'De Stijl' },
    medium: { zh: '绘画 · 建筑 · 家具', en: 'Painting · Architecture · Furniture' },
    period: '1917–1931',
    origin: { zh: '荷兰 莱顿 / 阿姆斯特丹', en: 'Leiden / Amsterdam, Netherlands' },
    figures: ['Theo van Doesburg', 'Piet Mondrian', 'Gerrit Rietveld', 'Bart van der Leck'],
    tagline: {
      zh: '把世界化简到直线、直角和三块颜色，然后宣布这就是普遍性。',
      en: 'Reduce the world to straight lines, right angles and three colours — then call it universality.',
    },
    source: {
      zh: '1917 年范·杜斯堡在莱顿创办《De Stijl》杂志，同年蒙德里安画出第一批只剩直线与三原色的构成。他们要的不是抽象，是普遍：既然战争由民族与个人主义制造，那么艺术就该取消个人笔触，退回最中性的形式语法。里特维尔德 1917 年的红蓝椅把二维构成直接装成了家具，1924 年的施罗德住宅则把墙做成可滑动的板——空间第一次可以被"打开"，而不是被砌死。1931 年范·杜斯堡去世，团体解散；但那份网格被包豪斯接手，一路传到了瑞士国际主义。',
      en: 'In 1917 Van Doesburg founded the journal De Stijl in Leiden; the same year Mondrian painted his first compositions reduced to straight lines and primaries. They wanted not abstraction but universality: if war was manufactured by nationalism and individualism, art should cancel the personal gesture and retreat to the most neutral grammar of form. Rietveld’s Red and Blue Chair of 1917 built a two-dimensional composition directly into furniture, and the Schröder House of 1924 turned walls into sliding panels — space could, for the first time, be opened rather than walled shut. Van Doesburg died in 1931 and the group dissolved, but the grid passed to the Bauhaus and from there to Swiss International Style.',
    },
    rules: [
      {
        zh: '黑线先行。所有色块都被黑色直线封边，线条是主结构，颜色是被线框住的填充物。',
        en: 'Black lines first. Every colour plane is edged by straight black lines; the line is the primary structure and colour is the fill enclosed by it.',
      },
      {
        zh: '三色加中性。红、蓝、黄严格限量，其余全部交给白、灰、黑——颜色数量比颜色本身更受控制。',
        en: 'Three colours plus neutrals. Red, blue and yellow are strictly rationed; everything else goes to white, grey and black. The count of colours is policed more tightly than the colours themselves.',
      },
      {
        zh: '不对称平衡。矩形尺寸互相悬殊，靠位置与重量取得平衡，永不居中、永不对称。',
        en: 'Asymmetric balance. Rectangles vary wildly in size and balance through position and weight — never centred, never symmetrical.',
      },
      {
        zh: '平面性。拒绝透视、拒绝纵深、拒绝渐变，深度只能靠叠压与线宽暗示。',
        en: 'Flatness. No perspective, no depth, no gradient — depth may only be hinted by overlap and line weight.',
      },
    ],
    failure: {
      zh: '风格派在界面上失效的方式很典型：一旦网格线开始承担"分隔"以外的职责，整套语言就退化成一张方格纸。常见错误是把黑线加到每个单元格上，让界面看起来像电子表格。风格派的关键是线的密度有节奏——它只在结构必要处出现，把画面切成几个悬殊的块面。若一个界面里每个元素都有边框，那是表格，不是风格派。',
      en: 'De Stijl fails on interface in a typical way: the moment the grid lines take on duties beyond division, the whole language degrades into graph paper. The common error is drawing black lines around every cell until the interface reads as a spreadsheet. The point is rhythmic line density — lines appear only where structure demands, cutting the plane into a few wildly unequal blocks. If every element has a border, that is a table, not De Stijl.',
    },
    translation: {
      zh: '翻译到界面，风格派直接给出了仪表盘的原型：不靠圆角卡片和阴影分区，而是用一根黑线和悬殊的块面比例来划分信息等级。演示里最大的一块给主指标，其余按重要性依次缩小——尺寸差即优先级差，不需要颜色参与。这是被扁平化设计继承得最彻底的一条遗产。',
      en: 'Translated into interface, De Stijl hands over a prototype for the dashboard: zoning by a single black rule and wildly unequal block ratios instead of rounded cards and shadows. In the demo the largest block carries the primary metric and the rest shrink in order of importance — difference in size is difference in priority, with no colour needed. This is the part of its legacy flat design absorbed most completely.',
    },
    swatches: [
      { hex: '#D62828', zh: '构成红', en: 'Composition Red' },
      { hex: '#193A80', zh: '深钴蓝', en: 'Deep Cobalt' },
      { hex: '#F4C20D', zh: '原色黄', en: 'Primary Yellow' },
      { hex: '#101010', zh: '线黑', en: 'Line Black' },
      { hex: '#F7F7F4', zh: '墙白', en: 'Wall White' },
    ],
    tokens: {
      display: 'Archivo 800', body: 'Inter 400', mono: 'DM Mono 500',
      radius: '0px', border: '2px solid #101010', shadow: 'none',
      space: '2 / 4 / 10 / 22（网格模数）', leading: '1.1', tracking: '0.02em（小字大写）',
      weight: '800 / 400', note: { zh: '模块间只用线分隔，间距取 2 的倍数的窄值', en: 'Modules divided by line only; spacing kept narrow and even' },
    },
    atmosphere: { ambient: '#F7F7F4', key: '#FFFFFF', floor: '#E8E8E4', wall: '#F2F2EF', fog: '#D8D8D4', accent: '#D62828', text: '#101010' },
    demo: 'grid-dashboard',
  },

  /* ─────────────────────────── 03 装饰艺术 ─────────────────────────── */
  {
    id: 'artdeco',
    no: '03',
    name: { zh: '装饰艺术', en: 'Art Deco' },
    medium: { zh: '建筑 · 时尚 · 平面', en: 'Architecture · Fashion · Graphic' },
    period: '1920s–1930s',
    origin: { zh: '法国 巴黎 → 美国 纽约', en: 'Paris, France → New York, USA' },
    figures: ['Émile-Jacques Ruhlmann', 'William Van Alen', 'Erté', 'A. M. Cassandre'],
    tagline: {
      zh: '机器时代的美，用奢华的几何把速度镀成金色。',
      en: 'Beauty for the machine age: gilding speed in luxurious geometry.',
    },
    source: {
      zh: '1925 年巴黎国际现代装饰与工业艺术博览会给这个风格定了名。它和包豪斯同年起步，却走向完全相反的方向：包豪斯认为装饰是罪，装饰艺术认为装饰就是目的。它从埃及图坦卡蒙墓（1922 年开启）和非洲织物里取来阶梯形、扇形与放射线，再用象牙、乌木、鲨鱼皮和铬合金把它们包起来。克莱斯勒大厦 1930 年的尖顶与洛克菲勒中心的镀金浮雕是它的纪念碑，卡桑德拉的海报用几何重塑了广告字。1930 年代后期，这份奢华在战争与经济萧条里熄灭——它是消费主义的第一次盛大自我表达。',
      en: 'The 1925 Paris Exposition Internationale des Arts Décoratifs et Industriels Modernes gave the movement its name. It began the same year as the Bauhaus and headed the opposite way: where Bauhaus called ornament a crime, Art Deco called it the point. It took stepped forms, fans and sunbursts from Tutankhamun’s tomb (opened in 1922) and from African textiles, then wrapped them in ivory, ebony, sharkskin and chrome. The Chrysler Building’s 1930 spire and the gilded reliefs of Rockefeller Center are its monuments; Cassandre’s posters rebuilt advertising lettering out of geometry. In the late 1930s that luxury was extinguished by depression and war — it was consumerism’s first grand self-portrait.',
    },
    rules: [
      {
        zh: '阶梯与放射。构图围绕中轴左右对称，形体上收成阶梯（ziggurat），或从中心放射出扇形与日射线。',
        en: 'Steps and rays. Composition is mirrored about a central axis, then either retreats into a ziggurat or radiates fans and sunbursts from the centre.',
      },
      {
        zh: '金属压深色。金色、铬银只作线条与镶边，底板必须压到墨绿、深黑或酒红这类高深度色。',
        en: 'Metal over depth. Gold and chrome are confined to lines and inlay; grounds are pressed down to bottle green, deep black or burgundy.',
      },
      {
        zh: '几何化的自然。花、叶、兽、水波全部被矩形化、阶梯化，自然的曲线被强制转成机械折线。',
        en: 'Geometricised nature. Flowers, leaves, beasts and waves are all rectangularised and stepped — natural curves forcibly converted into mechanical polylines.',
      },
      {
        zh: '材料暗示奢华。即便在二维平面里，也要靠高光、镶边与厚度感暗示木、象牙、漆与金属。',
        en: 'Materials signal luxury. Even in two dimensions, highlight, inlay and implied thickness hint at wood, ivory, lacquer and metal.',
      },
    ],
    failure: {
      zh: '装饰艺术上界面最容易变成"假奢华"：金色字压在深色底上，如果字号不够大、字重不够轻，会立刻像廉价 KTV 菜单。金是负空间色，它需要大面积深色与足够的留白才显得贵。另一条红线是对称——装饰艺术的所有力量来自严格的中轴，一旦挪动一个元素破坏对称，整套秩序立刻瓦解，看上去就只是"放歪了"。',
      en: 'On interface, Art Deco most easily becomes fake luxury: gold type on a dark ground reads as a cheap karaoke menu the moment the size is too small or the weight too heavy. Gold is a negative-space colour — it needs large dark fields and real void to feel expensive. The other red line is symmetry. All of its force comes from a strict central axis, and nudging one element off it collapses the order at once; it no longer looks composed, merely misaligned.',
    },
    translation: {
      zh: '翻译到界面，装饰艺术适合承载"仪式感"型的界面：邀请、会员卡、订阅确认、纪念页。演示选择了一张会员卡——中轴对称、上收阶梯、金线描边、字体拉开字距并转大写。它的反面教材是所有现代输入型界面：装饰艺术无法处理 20 个等权的表单字段，因为它只在有明确中心的地方才成立。',
      en: 'Translated into interface, Art Deco suits ceremonial screens: invitations, membership cards, subscription confirmations, commemorative pages. The demo takes a membership card — mirrored axis, stepped crown, gold hairline border, letterspaced capitals. Its counterexample is any modern data-entry screen: Art Deco cannot handle twenty equally weighted form fields, because it only holds where there is an unambiguous centre.',
    },
    swatches: [
      { hex: '#C8A44D', zh: '黄铜金', en: 'Brass Gold' },
      { hex: '#14342B', zh: '墨绿漆', en: 'Lacquer Green' },
      { hex: '#EFE9DA', zh: '象牙', en: 'Ivory' },
      { hex: '#0E0E0E', zh: '漆黑', en: 'Lacquer Black' },
      { hex: '#8C6A3F', zh: '氧化铜', en: 'Oxidised Bronze' },
    ],
    tokens: {
      display: 'Didot / Noto Serif SC 700', body: 'Inter 300', mono: 'DM Mono 400',
      radius: '0px（直角）', border: '1px solid #C8A44D', shadow: '0 18px 44px rgba(0,0,0,.55)',
      space: '6 / 14 / 26 / 48', leading: '1.05（标题）/ 1.7（正文）', tracking: '0.28em（大写标题）',
      weight: '700 / 300', note: { zh: '标题一律转大写并大幅拉开字距', en: 'Headings are capitalised and widely letterspaced' },
    },
    atmosphere: { ambient: '#14342B', key: '#E8D8A8', floor: '#0E2620', wall: '#14342B', fog: '#0A1F1A', accent: '#C8A44D', text: '#EFE9DA' },
    demo: 'invitation',
  },

  /* ─────────────────────────── 04 瑞士国际主义 ─────────────────────────── */
  {
    id: 'swiss',
    no: '04',
    name: { zh: '瑞士国际主义', en: 'Swiss International Style' },
    medium: { zh: '平面 · 字体 · 标识', en: 'Graphic · Typography · Signage' },
    period: '1950s–1960s',
    origin: { zh: '瑞士 苏黎世 / 巴塞尔', en: 'Zürich / Basel, Switzerland' },
    figures: ['Josef Müller-Brockmann', 'Armin Hofmann', 'Max Bill', 'Emil Ruder'],
    tagline: {
      zh: '排版不是表达，是运输。让信息以最短路径抵达。',
      en: 'Typography is not expression, it is transport. Get information across by the shortest route.',
    },
    source: {
      zh: '战后瑞士的平面设计师把构成主义的网格、包豪斯的无衬线和新字体的客观性拧成了一套方法。1957 年 Helvetica 在哈斯铸字厂问世，1958 年 Müller-Brockmann 创办《Neue Grafik》，方法被系统化：数学网格定版，非对称排版制造张力，大写与字重替代表情，照片取代插画，留白被当作信息的呼吸空间而非填充物。它被称为"国际主义"正因为它宣称自己无国界、无个性、可通用——把设计师的主观从运输链上摘掉。苏黎世与巴塞尔的学校把它变成课程，随后它成了全世界交通标识、企业手册与政府文件的默认语言，也成了被反叛最多的那一套。',
      en: 'Post-war Swiss designers welded constructivist grids, Bauhaus sans-serifs and the objectivity of the New Typography into one method. Helvetica appeared at Haas in 1957; Müller-Brockmann founded Neue Grafik in 1958 and the method was systematised: a mathematical grid determines the page, asymmetric composition creates tension, capitals and weight replace expression, photography replaces illustration, and whitespace is treated as the information’s breathing room rather than filler. It was called International precisely because it claimed to be borderless, impersonal and universal — removing the designer’s subjectivity from the transport chain. The schools of Zürich and Basel turned it into a curriculum, and it went on to become the default language of transport signage, corporate manuals and government documents worldwide — and the most rebelled-against system of them all.',
    },
    rules: [
      {
        zh: '网格是前提。先有栏数与基线网格，再有内容；任何元素的位置都能被网格解释。',
        en: 'The grid comes first. Column count and baseline grid exist before content, and every element’s position can be explained by the grid.',
      },
      {
        zh: '左对齐、单栏边。文本靠左硬对齐形成一条视觉竖线，右端任其参差，禁止居中与两端对齐。',
        en: 'Flush left, ragged right. Text forms one hard vertical edge on the left and is left ragged on the right; centring and justification are forbidden.',
      },
      {
        zh: '字号即层级。层级只用字号与字重表达，不靠颜色、不靠装饰线、不靠阴影。',
        en: 'Scale is hierarchy. Hierarchy is expressed only through size and weight — never colour, rules or shadow.',
      },
      {
        zh: '主动留白。留白按比例配置，是版面的一部分；一个元素周围的空白量决定它的重要程度。',
        en: 'Whitespace is active. Void is proportioned and belongs to the layout; the amount of emptiness around an element determines its importance.',
      },
    ],
    failure: {
      zh: '瑞士风格在界面上几乎是"默认设置"，所以它失效时也没人察觉：当网格被用来对齐而非用来思考，界面会变得正确但空洞。典型的崩坏是无限延伸的卡片列表——每张卡都严格对齐，但没有一栏承担比其他栏更重的信息，网格式的均匀消解了优先级。瑞士风格的检验方法只有一条：能不能指出版面上最重要的那一个元素？指不出来，网格就只是装饰。',
      en: 'Swiss style is nearly the default setting for interfaces, which is why its failures go unnoticed: when the grid is used to align rather than to think, the result is correct and empty. The classic collapse is the endless card list — every card rigorously aligned, no column carrying more weight than any other, grid regularity dissolving priority. Swiss style admits exactly one test: can you point to the single most important element on the page? If you cannot, the grid is ornament.',
    },
    translation: {
      zh: '翻译到界面，演示做了一篇编辑型长文——标题跨七栏、引文只占三栏、正文严格左对齐，层级全靠字号阶差完成，没有一条分隔线、没有一块底色。这套语言在屏幕上最大的问题是它与响应式布局的天然冲突：网格的数学美感依赖宽度稳定，一旦容器从 1440 缩到 375，栏数必须重排，左对齐的硬边也随之断裂。',
      en: 'Translated into interface, the demo takes an editorial long-read: a headline spanning seven columns, a pull-quote holding only three, body copy strictly flush left, hierarchy carried entirely by scale steps with no rules and no fills. Its biggest problem on screen is a natural conflict with responsive layout: the grid’s mathematical beauty depends on stable width, and once the container shrinks from 1440 to 375 the column count must be reflowed and the hard left edge breaks with it.',
    },
    swatches: [
      { hex: '#E4002B', zh: '瑞士红', en: 'Swiss Red' },
      { hex: '#111111', zh: '排版黑', en: 'Typographic Black' },
      { hex: '#FFFFFF', zh: '纸白', en: 'Paper White' },
      { hex: '#8A8A8A', zh: '次级灰', en: 'Secondary Grey' },
      { hex: '#E6E6E6', zh: '冷灰', en: 'Cool Grey' },
    ],
    tokens: {
      display: 'Helvetica Now / Inter 700', body: 'Inter 400', mono: 'DM Mono 400',
      radius: '0px', border: 'none（仅用空白与字号分层）', shadow: 'none',
      space: '基线网格 8px，栏间隔 24px', leading: '1.45（正文）/ 0.95（大标题）', tracking: '-0.02em（大字号需收紧）',
      weight: '700 / 400 / 500', note: { zh: '红只用于强调一个词或一条重点，占比不超过 5%', en: 'Red marks one word or one fact — never more than 5% of the surface' },
    },
    atmosphere: { ambient: '#FFFFFF', key: '#FFFFFF', floor: '#F0F0F0', wall: '#FAFAFA', fog: '#E2E2E2', accent: '#E4002B', text: '#111111' },
    demo: 'editorial',
  },

  /* ─────────────────────────── 05 世纪中叶现代 ─────────────────────────── */
  {
    id: 'midcentury',
    no: '05',
    name: { zh: '世纪中叶现代', en: 'Mid-Century Modern' },
    medium: { zh: '产品 · 室内 · 平面', en: 'Product · Interior · Graphic' },
    period: '1945–1969',
    origin: { zh: '美国 加州 → 北欧', en: 'California, USA → Scandinavia' },
    figures: ['Charles & Ray Eames', 'George Nelson', 'Arne Jacobsen', 'Eero Saarinen'],
    tagline: {
      zh: '战后乐观主义：让工业产品长出人体的弧度。',
      en: 'Post-war optimism: letting industrial products take on the curve of the body.',
    },
    source: {
      zh: '二战结束后，胶合板、玻璃纤维和注塑技术从军用转向民用，一批设计师开始用工业材料做"能抱住的"东西。伊姆斯夫妇在 1946 年把战时用于夹板的腿部固定技术做成模压胶合板椅，1956 年的躺椅把三块曲面拼成一张休息椅；纳尔逊做挂钟与棉花糖沙发，雅各布森做蛋椅与蚂蚁椅。它与瑞士风格的理性不同：同样信任工业，但拒绝把人体当直角处理。视觉上它给出的是有机曲线配几何骨架——细锥形腿、椭圆形台面、芥末黄与柚木棕，加上一种自觉的"轻"。这在 1960 年代末被波普与孟菲斯的戏谑顶替，但在 2000 年后又被重新发明成"高级感"的代名词。',
      en: 'After 1945 plywood, fibreglass and injection moulding turned from military to civilian use, and a generation of designers began making things you could hold with industrial materials. In 1946 the Eameses turned a wartime plywood leg splint technique into the moulded plywood chair; their 1956 lounge chair joined three curved shells into one seat. Nelson made clocks and the Marshmallow sofa, Jacobsen the Egg and the Ant. Unlike the Swiss rationalists it trusted industry just as much but refused to treat the body as a right angle. Visually it delivers organic curves on a geometric skeleton — tapered spindle legs, oval tabletops, mustard yellow and teak brown, plus a self-aware lightness. Pop and Memphis replaced its wit in the late 1960s, and after 2000 it was reinvented as a synonym for taste.',
    },
    rules: [
      {
        zh: '有机曲线 + 几何骨架。形体圆润，但支撑结构是细而明确的长直线（锥形腿、悬臂）。',
        en: 'Organic curve on a geometric skeleton. Forms are rounded, but the supporting structure is a fine, explicit straight line — a tapered leg, a cantilever.',
      },
      {
        zh: '暖色木质调。柚木棕、芥末黄、砖红、松绿构成主色，配米白而非纯白压底。',
        en: 'Warm timber palette. Teak brown, mustard, brick red and pine green lead, grounded on off-white rather than pure white.',
      },
      {
        zh: '视觉上的轻。厚重功能被转译成细线与悬浮感；物件与地面之间必须留出可见的空隙。',
        en: 'Visual lightness. Heavy function is translated into fine lines and a sense of float; a visible gap must remain between object and floor.',
      },
      {
        zh: '克制的图案。原子点、飞镖形与不规则有机形状可作点缀，但面积严格受限。',
        en: 'Restrained pattern. Atomic dots, boomerangs and irregular organic shapes are allowed as accents, strictly limited in area.',
      },
    ],
    failure: {
      zh: '世纪中叶现代在界面上最常见的失效，是曲线被用成了纯装饰：大量圆角、大号柔和阴影、椭圆按钮堆在一起，界面立刻变成"没有重心的甜腻"。这套语言的力量来自一个具体的张力——有机形体被一个瘦而精确的骨架撑住。在界面里，那个骨架就是严格的网格与细到 1px 的分隔，一旦把它去掉，只剩曲线，风格就没了。另一条硬边界：它和纯黑背景不兼容，暖木色需要纸一样的浅底。',
      en: 'The usual interface failure of Mid-Century Modern is curve used as pure decoration: soft radii, generous blurry shadows and oval buttons pile up until the screen goes saccharine and loses its centre of gravity. Its strength comes from one specific tension — organic form held by a thin, exact skeleton. On interface that skeleton is a strict grid and a 1px divider, and removing it leaves only curves, which is to say no style at all. One hard boundary: it does not survive a pure black ground — warm timber wants a paper-like light base.',
    },
    translation: {
      zh: '翻译到界面，演示做了一张产品卡：主图区用椭圆与圆角承载产品形体，价格与规格压在一条 1px 细线和一列锥形间距上。曲线负责亲近，直线负责可信——这两件事同时发生，才是世纪中叶现代。这也是当代"高级消费品"界面的默认语法，只是多数实现只抄了圆角，没抄骨架。',
      en: 'Translated into interface, the demo builds a product card: an elliptical, rounded image field carries the object, while price and spec sit on a single 1px rule and a column of tapered spacing. The curve earns intimacy, the line earns trust — and only where both happen at once is it Mid-Century Modern. This is also the default grammar of contemporary premium-consumer interfaces, except most implementations copy the radii and skip the skeleton.',
    },
    swatches: [
      { hex: '#D89A3E', zh: '芥末黄', en: 'Mustard' },
      { hex: '#7A4A24', zh: '柚木棕', en: 'Teak' },
      { hex: '#3E6B5A', zh: '松绿', en: 'Pine Green' },
      { hex: '#C05B3E', zh: '砖红', en: 'Brick Red' },
      { hex: '#F0EAE0', zh: '亚麻米白', en: 'Linen Off-White' },
    ],
    tokens: {
      display: 'Poppins 600 / Noto Sans SC 500', body: 'Inter 400', mono: 'DM Mono 400',
      radius: '14px（卡片）/ 999px（胶囊按钮与椭圆）', border: '1px solid rgba(122,74,36,.18)',
      shadow: '0 10px 26px rgba(122,74,36,.14)', space: '10 / 20 / 36 / 60', leading: '1.6', tracking: '0.01em',
      weight: '600 / 400', note: { zh: '阴影必须暖、必须浅，冷灰阴影会立刻毁掉木质调', en: 'Shadows must be warm and shallow — a cool grey shadow kills the timber palette instantly' },
    },
    atmosphere: { ambient: '#F0EAE0', key: '#FFF6E6', floor: '#DCCBAE', wall: '#EFE4D2', fog: '#D8C6A8', accent: '#D89A3E', text: '#4A3320' },
    demo: 'product-card',
  },

  /* ─────────────────────────── 06 粗野主义 ─────────────────────────── */
  {
    id: 'brutalism',
    no: '06',
    name: { zh: '粗野主义', en: 'Brutalism' },
    medium: { zh: '建筑 · 公共设施', en: 'Architecture · Civic Infrastructure' },
    period: '1950s–1970s',
    origin: { zh: '英国 → 法国 / 日本 / 南美', en: 'UK → France / Japan / South America' },
    figures: ['Alison & Peter Smithson', 'Le Corbusier', 'Paul Rudolph', 'Kenzo Tange'],
    tagline: {
      zh: 'béton brut：让材料露出它本来的样子，包括它的重。',
      en: 'Béton brut: let the material show what it is, including its weight.',
    },
    source: {
      zh: '词源是法语的 béton brut——裸混凝土，勒·柯布西耶 1952 年马赛公寓留下的木模板印痕给这个词定了形。史密斯夫妇与英国战后一代用它回应福利国家的建设任务：医院、大学、住宅、市政厅，用最少的工序、最直接的体量把公共资源摆到街上。它不修饰，理由是修饰需要劳动力，而劳动力是稀缺的。粗野主义在 1970 年代中期的经济危机中被贴上"冷漠、反人"的标签，一批建筑被拆除，直到 2010 年代照片社交媒体把它重新变成了审美对象——这一次它被消费，而不是被居住。',
      en: 'The etymology is the French béton brut — raw concrete — fixed in form by the timber formwork marks left on Le Corbusier’s Unité d’habitation in Marseille, 1952. The Smithsons and the post-war British generation used it to answer the welfare state’s building programme: hospitals, universities, housing, town halls, delivered with the fewest operations and the most direct mass, putting public resources out on the street. It refused finish because finish costs labour, and labour was scarce. In the mid-1970s economic crisis it was labelled cold and inhuman, buildings were demolished, and only in the 2010s did photography and social media turn it into an aesthetic object — consumed this time rather than inhabited.',
    },
    rules: [
      {
        zh: '裸露材料。不做面层，混凝土、钢、玻璃一律保持出厂状态，构造痕迹（模板缝、螺栓孔）必须可见。',
        en: 'Exposed material. No cladding: concrete, steel and glass stay as they left the factory, and construction marks — formwork seams, bolt holes — remain visible.',
      },
      {
        zh: '体量即形式。造型由内部功能直接推出，方块叠方块，装饰被彻底剔除。',
        en: 'Mass is form. Shape is extruded directly from internal function, block on block, with ornament entirely removed.',
      },
      {
        zh: '沉重与压迫。重力必须被表达：构件粗、悬挑深、阴影重、边界硬。',
        en: 'Weight and pressure. Gravity must be expressed: thick members, deep cantilevers, heavy shadow, hard edges.',
      },
      {
        zh: '尺度失配。行人尺度与结构尺度故意错开，让人意识到自己是站在一个系统里而不是一间屋子里。',
        en: 'Scale mismatch. Human scale and structural scale are deliberately offset, so you register standing inside a system rather than a room.',
      },
    ],
    failure: {
      zh: '粗野主义是唯一一个"越粗越错"的流派——在真实的混凝土里，粗是诚实的；在屏幕上，粗一旦失去材质就变成粗暴。常见崩坏是把黑边框加粗、字重拉满、背景压黑，以为这就是粗野，实际得到的是一个 1990 年代的论坛皮肤。它成立的前提是：质感和重量必须同时在场，而屏幕上唯一能制造重量的是光影——斜向硬阴影和一点颗粒。只有粗线条、没有材质梯度，就是硬的穷。',
      en: 'Brutalism is the one movement where coarser is always wronger. In real concrete, coarseness is honesty; on screen, coarse without material becomes merely crude. The familiar collapse is heavy black borders, maxed-out weights and a black ground in the belief that this is brutalism — producing a 1990s forum skin instead. Its precondition is that texture and weight appear together, and the only thing that can make weight on screen is light: a hard angled shadow and a trace of grain. Heavy strokes with no material gradient are just poverty of means.',
    },
    translation: {
      zh: '翻译到界面，演示做了一块基础设施型数据看板：粗边框、无圆角、无留白修饰、数字极大，靠一块斜向硬阴影和轻微颗粒承担"沉重"。这也是"新粗野主义"网页的源头语法——但那条路线丢掉了材质层，所以看起来更像是复古而不是粗野。真正的分界在光影：有斜硬影的是建筑，没有的只是粗线框图。',
      en: 'Translated into interface, the demo builds an infrastructure dashboard: heavy borders, no radii, no cosmetic whitespace, oversized numerals, with weight carried by a single hard angled shadow and a faint grain. This is the source grammar of neo-brutalist web design — except that lineage dropped the material layer, which is why it reads as retro rather than brutal. The real dividing line is light: with a hard angled shadow it is architecture; without one it is a thick-line wireframe.',
    },
    swatches: [
      { hex: '#9A9A93', zh: '裸露混凝土', en: 'Raw Concrete' },
      { hex: '#4A4A46', zh: '深灰', en: 'Deep Grey' },
      { hex: '#7A4032', zh: '锈红', en: 'Rust Red' },
      { hex: '#DCDCD6', zh: '天光白', en: 'Daylight White' },
      { hex: '#1C1C1A', zh: '沥青黑', en: 'Asphalt Black' },
    ],
    tokens: {
      display: 'Archivo Black / Inter 900', body: 'Inter 400', mono: 'DM Mono 500',
      radius: '0px', border: '3px solid #1C1C1A', shadow: '8px 8px 0 #1C1C1A（硬影，无模糊）',
      space: '4 / 12 / 28 / 54', leading: '1.05', tracking: '-0.03em（超大数字）',
      weight: '900 / 400', note: { zh: '阴影必须是偏移硬影，模糊=失败；加 3% 颗粒制造材质', en: 'Shadow must be a hard offset; blur means failure. Add 3% grain for material' },
    },
    atmosphere: { ambient: '#C9C9C3', key: '#F2F2EC', floor: '#8E8E88', wall: '#A8A8A1', fog: '#7E7E78', accent: '#7A4032', text: '#1C1C1A' },
    demo: 'infra-dashboard',
  },

  /* ─────────────────────────── 07 侘寂 ─────────────────────────── */
  {
    id: 'wabisabi',
    no: '07',
    name: { zh: '侘寂', en: 'Wabi-Sabi' },
    medium: { zh: '茶道 · 陶艺 · 室内', en: 'Tea · Ceramics · Interior' },
    period: '15 世纪至今',
    origin: { zh: '日本 京都', en: 'Kyoto, Japan' },
    figures: ['千利休', 'Sen no Rikyū', '柳宗悦', 'Yanagi Sōetsu'],
    tagline: {
      zh: '美不在完满，在事物正在变化这件事本身。',
      en: 'Beauty lies not in completion but in the fact that a thing is changing.',
    },
    source: {
      zh: '侘与寂分别指向两种经验：侘是简朴里的不足与孤寂，寂是时间留下的褪色、磨损与锈迹。千利休在 16 世纪把这套感受装进茶道——茶室缩到四叠半、土墙不刷、器物取粗陶与竹子，抹掉一切用来炫耀技艺的东西。它的美学前提与西方完全相反：西方要求形式战胜时间（把破损当缺陷修补），侘寂要求时间战胜形式（把破损当作品的一部分，用金缮把裂痕描出来）。柳宗悦在 20 世纪把它带进民艺运动，指出无名匠人日用器物的"无心之美"比署名作品更接近这条美学。',
      en: 'Wabi and sabi name two experiences: wabi is the poverty and solitude inside simplicity, sabi is the fading, wear and rust that time leaves behind. Sen no Rikyū packed this sensibility into the tea ceremony in the sixteenth century — the room reduced to four and a half mats, earthen walls unplastered, utensils in coarse ceramic and bamboo, everything that displayed skill erased. Its aesthetic premise is the exact inverse of the West’s: Western aesthetics want form to defeat time (damage is a defect to be repaired), while wabi-sabi wants time to defeat form (damage belongs to the work — kintsugi draws the crack in gold). In the twentieth century Yanagi Sōetsu carried it into the Mingei movement, arguing that the guileless beauty of anonymous daily objects sits closer to this aesthetic than any signed work.',
    },
    rules: [
      {
        zh: '不完美优先。对称、光洁、崭新是缺点；微小的不对称、指纹、釉裂与磨损是价值的来源。',
        en: 'Imperfection first. Symmetry, gloss and newness are defects; slight asymmetry, a thumbprint, a crawled glaze, a worn edge are where value lives.',
      },
      {
        zh: '材料说方言。土、麻、竹、和纸、生漆各自保留自己的质地，不做统一处理。',
        en: 'Materials speak their own dialect. Earth, hemp, bamboo, washi and raw lacquer each keep their own texture rather than being unified.',
      },
      {
        zh: '素色加一点朱。整体压到低饱和的土、灰、米，只允许极小面积的一点红或金作呼吸孔。',
        en: 'Muted ground, one vermilion breath. The whole field is pressed down to low-saturation earth, grey and rice tones, admitting only a very small area of red or gold.',
      },
      {
        zh: '大量留白与慢。空白必须远多于实体，信息密度低到能被注视，而不是被扫读。',
        en: 'Vast void and slowness. Emptiness must far exceed matter, with information density low enough to be looked at rather than scanned.',
      },
    ],
    failure: {
      zh: '侘寂在数字媒介里有一个结构性困境：它的价值来自"独一无二"，而屏幕的本性是"可以无限复制"。所以任何试图用程序模拟"随机磨损"的做法都注定会露馅——观众会看出这是参数生成的，不是时间造成的。可行的路径是把不完美交给真实的变量：真实的渲染字体、用户自己产生的数据、随时间变化的痕迹。另一条底线是留白，一旦为了塞信息压缩留白，侘寂的全部意义就蒸发了，剩下的只是低饱和度的配色方案。',
      en: 'Wabi-sabi has a structural difficulty in digital media: its value comes from uniqueness, while the screen’s nature is infinite reproduction. Any attempt to simulate random wear procedurally will therefore betray itself — the viewer can tell that this is generated by a parameter, not caused by time. The workable path is to hand imperfection to real variables: a genuinely rendering typeface, the user’s own data, marks that change with time. The other floor is void; compress the emptiness to fit more information and the entire meaning evaporates, leaving a low-saturation colour scheme.',
    },
    translation: {
      zh: '翻译到界面，演示做了一页冥想记录：背景是一层极慢的纸纤维噪点（真实随时间漂移），内容只有一枚时间戳、一句短句和一条手绘感的弧线，留白占版面七成以上。这里的关键决定是放弃了所有"卡片"概念——卡片是容器思维，而侘寂要求内容直接落在材料上。',
      en: 'Translated into interface, the demo builds a meditation log: a very slow paper-fibre grain drifting on a real time axis as ground, and on top of it only a timestamp, one short line and a hand-drawn arc, with void covering more than seventy percent of the surface. The key decision here was abandoning the concept of the card entirely — a card is container thinking, and wabi-sabi requires content to rest directly on the material.',
    },
    swatches: [
      { hex: '#B6A48C', zh: '素土', en: 'Bare Earth' },
      { hex: '#8A927E', zh: '苔灰绿', en: 'Moss Grey-Green' },
      { hex: '#3A3733', zh: '炭', en: 'Charcoal' },
      { hex: '#E8E2D5', zh: '和纸米', en: 'Washi Rice' },
      { hex: '#A94A32', zh: '朱', en: 'Vermilion' },
    ],
    tokens: {
      display: 'Noto Serif SC 300 / Cormorant 300', body: 'Noto Sans SC 300', mono: 'DM Mono 300',
      radius: '2–4px（近直角的柔化）', border: '1px solid rgba(58,55,51,.12)', shadow: '0 2px 14px rgba(58,55,51,.06)',
      space: '24 / 48 / 88 / 160', leading: '2.0（正文极松）', tracking: '0.12em',
      weight: '300 / 300', note: { zh: '行高必须异常松；禁止任何纯黑与纯白', en: 'Line-height must be unusually loose; pure black and pure white are banned' },
    },
    atmosphere: { ambient: '#E8E2D5', key: '#F5F0E6', floor: '#C9BFA9', wall: '#DED6C5', fog: '#CFC5B0', accent: '#A94A32', text: '#3A3733' },
    demo: 'quiet-log',
  },

  /* ─────────────────────────── 08 浮世绘 ─────────────────────────── */
  {
    id: 'ukiyoe',
    no: '08',
    name: { zh: '浮世绘', en: 'Ukiyo-e' },
    medium: { zh: '木刻版画 · 出版', en: 'Woodblock Print · Publishing' },
    period: '17–19 世纪（江户）',
    origin: { zh: '日本 江户（今东京）', en: 'Edo (Tokyo), Japan' },
    figures: ['葛饰北斋 Hokusai', '歌川广重 Hiroshige', '喜多川歌麿 Utamaro', '菱川师宣 Moronobu'],
    tagline: {
      zh: '浮世：把会消失的东西印成可以流通的商品。',
      en: 'Ukiyo, the floating world: printing what will vanish into something you can circulate.',
    },
    source: {
      zh: '浮世绘是江户商业出版的产物，不是宫廷艺术。菱川师宣把插图从文本里拆成独立单张，明和年间铃木春信引入多色套印（锦绘），从此一张版画要刻十几块版、套印十几次。它的生产方式决定了它的语言：分工（绘师、雕师、摺师）、成本压力（版数有限、纸张有限）、流通需求（要能在街边卖）——于是构图被压到极简、颜色被压到几个大块、轮廓线被压到极硬，墨线成为套印对齐的骨架。北斋 1831 年的《神奈川冲浪里》用普鲁士蓝画出了一个把富士山压到画面角落的瞬间，广重则用同样的手法处理雨、雪、月与驿站。1867 年巴黎世博会后它大量流入欧洲，直接改写了印象派与凡·高的构图。',
      en: 'Ukiyo-e was a product of Edo’s commercial publishing, not of court patronage. Hishikawa Moronobu detached the illustration from the text into a single sheet, and in the Meiwa era Suzuki Harunobu introduced full-colour printing (nishiki-e), after which one print required a dozen carved blocks and as many passes. Its means of production determined its language: division of labour (designer, carver, printer), cost pressure (limited blocks, limited paper) and the need to be sold on the street — so composition was compressed to the minimum, colour to a few large planes, contours to a hard line, and the ink keyline became the registration skeleton. Hokusai’s Great Wave off Kanagawa of 1831 used Prussian blue to catch the instant in which Fuji is pushed into a corner of the frame; Hiroshige applied the same means to rain, snow, moon and post stations. After the 1867 Paris Exposition it flooded into Europe and rewrote composition for the Impressionists and for Van Gogh.',
    },
    rules: [
      {
        zh: '轮廓线是一切的骨架。所有形体先由一条粗细稳定的线锁住，颜色只能在线内平涂。',
        en: 'The contour is the skeleton of everything. Every form is locked by a line of even weight, and colour may only be flat-filled inside it.',
      },
      {
        zh: '平涂，无渐变。光、影、体块由色块的硬边交界处理，不用过渡。',
        en: 'Flat fill, no gradient. Light, shadow and volume are handled by the hard boundary between colour planes, never by transition.',
      },
      {
        zh: '非对称裁切。主体偏置、被画面边缘切断，取景像镜头，而不像画框。',
        en: 'Asymmetric cropping. The subject is offset and sliced by the frame edge; framing behaves like a camera, not a picture frame.',
      },
      {
        zh: '普鲁士蓝主导。景与天由深浅不同的蓝分层，暖色（朱、芥子、黄）只落在需要被看见的主体上。',
        en: 'Prussian blue leads. Distance and sky are layered in blues of differing depth, while warm tones — vermilion, mustard, yellow — fall only on what must be seen.',
      },
    ],
    failure: {
      zh: '浮世绘的问题出在"平涂"这件事的字面翻译上：在版画里，平涂是印刷工艺的诚实结果；在屏幕上照搬大面积纯色，会得到一片没有呼吸的色墙。它不是不能做，而是必须重新引入版画里本来就有的东西——纸的纤维、套印的轻微错位、墨线的渗化。这些痕迹一旦全部抹掉，剩下的只是"扁平插画"，与浮世绘无关。第二处陷阱是轮廓线：版画里的线是被约束的，如果网上把每张卡片都描一圈黑边，会立刻退化成儿童绘本。',
      en: 'Ukiyo-e’s difficulty lies in taking flat fill literally. In a woodblock print, flatness is the honest result of the printing process; reproducing large areas of pure colour on screen yields a colour wall with no breath in it. It can be done, but the things the print already contained must be reintroduced — paper fibre, the slight misregistration between passes, the bleed of the ink keyline. Erase all those marks and what remains is flat illustration with no relation to ukiyo-e. The second trap is the contour: in a print the line is disciplined, and outlining every card on the web collapses the style instantly into a children’s book.',
    },
    translation: {
      zh: '翻译到界面，演示做了一张内容卡：一张被裁掉的景（上蓝下暖）、一条硬轮廓线锁住主体、标题压在留白区外沿，朱红只出现在一个状态标记上。数字转译时我做了一个取舍——保留了套印错位的极轻微偏移（0.6px），因为这正是"印刷品"与"矢量图"的唯一区别。',
      en: 'Translated into interface, the demo builds a content card: a cropped scene with cool blue above and warmth below, one hard contour locking the subject, the title resting on the outer edge of the void, and vermilion appearing on a single status marker. In translating it I made one concession — keeping a very slight misregistration of 0.6px — because that is precisely the only thing separating a printed object from a vector graphic.',
    },
    swatches: [
      { hex: '#1F3A6E', zh: '普鲁士蓝', en: 'Prussian Blue' },
      { hex: '#D64A32', zh: '朱红', en: 'Vermilion' },
      { hex: '#E3B23C', zh: '芥子黄', en: 'Mustard' },
      { hex: '#23201C', zh: '墨', en: 'Sumi Ink' },
      { hex: '#F1E8D6', zh: '和纸', en: 'Washi' },
    ],
    tokens: {
      display: 'Noto Serif SC 600', body: 'Noto Sans SC 400', mono: 'DM Mono 400',
      radius: '2px（模拟纸张切边）', border: '2px solid #23201C', shadow: '0 6px 18px rgba(35,32,28,.18)',
      space: '8 / 18 / 34 / 64', leading: '1.5', tracking: '0.06em',
      weight: '600 / 400', note: { zh: '色块之间禁止渐变；允许 0.6px 套印偏移模拟印刷', en: 'No gradients between colour planes; a 0.6px misregistration is allowed' },
    },
    atmosphere: { ambient: '#F1E8D6', key: '#FFF4DC', floor: '#D6C7A8', wall: '#E9DCC2', fog: '#C9B693', accent: '#1F3A6E', text: '#23201C' },
    demo: 'print-card',
  },

  /* ─────────────────────────── 09 波普艺术 ─────────────────────────── */
  {
    id: 'popart',
    no: '09',
    name: { zh: '波普艺术', en: 'Pop Art' },
    medium: { zh: '平面 · 艺术 · 广告', en: 'Graphic · Art · Advertising' },
    period: '1955–1970',
    origin: { zh: '英国 伦敦 → 美国 纽约', en: 'London, UK → New York, USA' },
    figures: ['Richard Hamilton', 'Andy Warhol', 'Roy Lichtenstein', 'Claes Oldenburg'],
    tagline: {
      zh: '把广告的手法拿回艺术，然后发现两者本来就是一回事。',
      en: 'Take advertising’s methods back into art — then discover that they were always the same thing.',
    },
    source: {
      zh: '1956 年汉密尔顿在《这就是明天》展览上贴出《究竟是什么让今天的家庭如此不同、如此吸引人？》，画面里全是杂志剪下来的沙发、电视、健美男与吸尘器——标题本身就是广告语。美国一侧，沃霍尔从 1962 年开始用丝网印刷重复金宝汤罐头与玛丽莲·梦露，把"名人"和"商品"放进同一条生产线；利希滕斯坦直接把漫画分镜放大到画布，把印刷网点一块块画出来；奥登伯格把汉堡和马桶做成巨型软雕塑。它的方法论是挪用而非创造：消费社会的图像已经足够有力，艺术家的工作是把它移一下位置。它在 1970 年代被观念艺术判定为"只是讽刺"，但今天所有品牌视觉都还在使用它发明的那套语法。',
      en: 'In 1956 Hamilton pasted Just what is it that makes today’s homes so different, so appealing? into the This Is Tomorrow exhibition — a room assembled from cut-out sofas, a television, a bodybuilder and a vacuum cleaner, with the title written as ad copy. In the United States, from 1962 Warhol screenprinted Campbell’s soup cans and Marilyn Monroe in repetition, putting celebrity and commodity onto the same production line; Lichtenstein enlarged comic panels onto canvas and hand-painted the halftone dots; Oldenburg made hamburgers and toilets into oversized soft sculpture. Its method was appropriation rather than creation: consumer imagery was already powerful enough, and the artist’s job was to move it. Conceptual art dismissed it in the 1970s as mere irony, yet every brand identity today still uses the grammar it invented.',
    },
    rules: [
      {
        zh: '网点即质感。印刷网点被放大成可见纹理，成为画面的底层材料而不是印刷缺陷。',
        en: 'Halftone as texture. The printing dot is enlarged into visible texture — a base material of the image rather than a defect of reproduction.',
      },
      {
        zh: '高饱和、硬边。颜色取到印刷可达的极限，块面之间只有硬交界，没有过渡。',
        en: 'High saturation, hard edges. Colour is pushed to the limit of what print allows, and planes meet only at hard boundaries.',
      },
      {
        zh: '重复即内容。同一图像被复制、排列、套色替换，复制行为本身构成作品的意义。',
        en: 'Repetition is content. One image is duplicated, arrayed and recoloured; the act of reproduction becomes the meaning of the work.',
      },
      {
        zh: '黑轮廓 + 一次性阴影。形体由粗黑线封闭，阴影被简化成一块纯黑，不作渐变。',
        en: 'Black contour, single shadow. Forms are closed by a heavy black line and shadow is reduced to one flat black shape without gradient.',
      },
    ],
    failure: {
      zh: '波普在界面上立刻会变成"廉价促销"，这是它最诚实的失败方式——因为它本来就是促销的语言。它成立的条件是隔一层：当画面明确地知道自己是一张广告，波普是批评；当画面以为自己是在真诚沟通，波普就只是吵。判断方法看饱和度占比：如果高饱和面积超过画面的三分之一，观众读到的是"打折"，而不是"评论"。',
      en: 'On interface, Pop Art turns instantly into cheap promotion, which is its most honest way of failing, because promotion is the language it came from. It holds only with one layer of distance: when the surface knows it is an advertisement, Pop is critique; when the surface believes it is speaking sincerely, Pop is simply noise. A practical test is the share of high saturation — past a third of the surface, the viewer reads a sale, not a comment.',
    },
    translation: {
      zh: '翻译到界面，演示做了一条活动横幅：网点底纹、撞色块面、粗黑轮廓、一次性硬影，一个词被重复三次且每次换色——重复本身就是信息量，不需要再加描述。这条语法现在被电商完整继承，区别只在于：波普用它来指出"消费是你的处境"，电商用它来说"快买"。同一套像素，两种意图。',
      en: 'Translated into interface, the demo builds a campaign banner: halftone ground, clashing colour planes, heavy black contours, a single hard shadow, and one word repeated three times in three different colours — repetition is the message, so no further description is needed. E-commerce inherited this grammar whole; the only difference is that Pop used it to say consumption is your condition, while e-commerce uses it to say buy now. Identical pixels, two intentions.',
    },
    swatches: [
      { hex: '#FF2D87', zh: '荧光品红', en: 'Fluorescent Magenta' },
      { hex: '#FFE500', zh: '亮黄', en: 'Bright Yellow' },
      { hex: '#00B4D8', zh: '青', en: 'Cyan' },
      { hex: '#111111', zh: '轮廓黑', en: 'Contour Black' },
      { hex: '#FFFFFF', zh: '纸白', en: 'Paper White' },
    ],
    tokens: {
      display: 'Archivo Black / Inter 900（全大写）', body: 'Inter 500', mono: 'DM Mono 500',
      radius: '0px', border: '4px solid #111111', shadow: '6px 6px 0 #111111',
      space: '4 / 10 / 22 / 40', leading: '0.92（大标题）', tracking: '-0.02em',
      weight: '900 / 500', note: { zh: '高饱和面积不超过三分之一；网点密度 6px', en: 'Keep high-saturation area under one third; halftone pitch at 6px' },
    },
    atmosphere: { ambient: '#FFF7D6', key: '#FFFFFF', floor: '#F2D96B', wall: '#FFEFA8', fog: '#F0CE55', accent: '#FF2D87', text: '#111111' },
    demo: 'promo-banner',
  },

  /* ─────────────────────────── 10 孟菲斯 ─────────────────────────── */
  {
    id: 'memphis',
    no: '10',
    name: { zh: '孟菲斯', en: 'Memphis' },
    medium: { zh: '产品 · 平面 · 室内', en: 'Product · Graphic · Interior' },
    period: '1981–1988',
    origin: { zh: '意大利 米兰', en: 'Milan, Italy' },
    figures: ['Ettore Sottsass', 'Nathalie Du Pasquier', 'Martine Bedin', 'Michele De Lucchi'],
    tagline: {
      zh: '对"好品味"的集体造反，用塑料和撞色把它拆掉。',
      en: 'A collective revolt against good taste, dismantled with plastic and clashing colour.',
    },
    source: {
      zh: '1981 年 12 月，索特萨斯和一群二十多岁的设计师在米兰聚会，放了一张鲍勃·迪伦的《Stuck Inside of Mobile with the Memphis Blues Again》，团体因此得名。同年第一场展览展出一批"不合语法"的家具：红黄蓝撞色的书架、带彩色圆点的梳妆台、像玩具一样的水壶。它针对的正是瑞士国际主义与世纪中叶现代立下的那套克制法则——他们认为那套法则已经把设计变成了一种规训。孟菲斯只用当时最廉价的材料（塑料贴面、层压板），故意违反功能与结构逻辑，把装饰堂而皇之地摆回来。1988 年索特萨斯解散团体，孟菲斯只活了七年，但它的语法在 2000 年代被时装与界面捡走，成了"有趣"的快捷键。',
      en: 'In December 1981 Sottsass and a group of designers in their twenties met in Milan and played Bob Dylan’s Stuck Inside of Mobile with the Memphis Blues Again — the group took its name from the song. That year the first exhibition showed furniture that broke the grammar: bookcases in clashing red, yellow and blue, a dressing table with coloured dots, kettles shaped like toys. Its target was precisely the restraint codified by Swiss International Style and Mid-Century Modern, which they saw as having turned design into discipline. Memphis used the cheapest materials then available — plastic laminate, chipboard — deliberately violated functional and structural logic, and put ornament brazenly back. Sottsass dissolved the group in 1988; Memphis lived seven years, and fashion and interface design picked up its grammar in the 2000s as a shortcut for fun.',
    },
    rules: [
      {
        zh: '撞色优先。颜色不考虑和谐，只考虑对立；相邻色块必须制造冲突。',
        en: 'Clash over harmony. Colour is chosen for opposition, not agreement; adjacent planes must conflict.',
      },
      {
        zh: '几何与图案混用。波点、波浪、棋盘格、锯齿与基本几何被随机并置，密度可以失衡。',
        en: 'Geometry mixed with pattern. Dots, waves, chequerboards, zigzags and basic shapes are juxtaposed at random, and density may be unbalanced.',
      },
      {
        zh: '材质感廉价。可见的塑料感、层压板的亮面、亚克力高光是被承认的，不需要掩饰。',
        en: 'Cheapness acknowledged. A visible plastic feel, the sheen of laminate and the gloss of acrylic are admitted rather than disguised.',
      },
      {
        zh: '不稳定的构成。物体故意看起来站不稳、放不平、装不上，用来挑衅功能主义。',
        en: 'Unstable composition. Objects deliberately look unable to stand, sit flat or fit together, taunting functionalism.',
      },
    ],
    failure: {
      zh: '孟菲斯是十二件藏品里最容易做丑的一件，因为它要求的是"精确的失衡"——每一次冲突都是被选定的，不是随机的。最常见的崩坏是把撞色理解成"多来几种颜色"，结果得到一堆亮度相近、饱和度相近的色块互相抵消，观感变成儿童教室。它成立的硬条件有三条：一是色块必须有明确的面积等级（大、中、小），二是必须有一个中性色（黑或白）当隔离带，三是每个装饰几何必须能被指认出它的作用。三条缺一条，孟菲斯就只是乱。',
      en: 'Memphis is the easiest of the twelve to make ugly, because what it requires is precise imbalance — every conflict is chosen, none is random. The usual collapse is reading clash as simply more colours, which produces a set of planes at similar lightness and saturation that cancel one another out until the screen looks like a primary-school classroom. It holds under three hard conditions: the planes must have a clear size hierarchy, there must be one neutral acting as a buffer, and each decorative shape must be identifiable as doing a job. Miss one and Memphis is just mess.',
    },
    translation: {
      zh: '翻译到界面，演示做了一块音乐播放器：珊瑚红的唱片区、薄荷绿的控制区、一波锯齿分隔带，黑白两色严格充当隔离与承重——每一块颜色都能说出它为什么在那儿。转译时我做了一个防守动作：把撞色限制在三个色相、把最跳的柠檬黄只留给"播放"这一个动作，避免整块界面因为抢占注意力而失焦。',
      en: 'Translated into interface, the demo builds a music player: a coral record field, a mint control field and one zigzag divider, with black and white strictly serving as buffer and load-bearing structure, so every colour can say why it is there. In translating I made one defensive move: clash was confined to three hues and the loudest lemon yellow reserved for the single act of play, so the screen does not lose focus by competing for attention with itself.',
    },
    swatches: [
      { hex: '#FF6F61', zh: '珊瑚', en: 'Coral' },
      { hex: '#7ED9C3', zh: '薄荷', en: 'Mint' },
      { hex: '#FFD23F', zh: '柠檬', en: 'Lemon' },
      { hex: '#4B4E9B', zh: '蓝紫', en: 'Indigo' },
      { hex: '#161616', zh: '隔离黑', en: 'Buffer Black' },
    ],
    tokens: {
      display: 'Poppins 700 / Archivo 800', body: 'Inter 500', mono: 'DM Mono 500',
      radius: '18px（几何图形保持纯圆/纯方）', border: '3px solid #161616',
      shadow: '5px 5px 0 rgba(22,22,22,.9)',
      space: '6 / 14 / 30 / 52', leading: '1.15', tracking: '0.01em',
      weight: '700 / 500', note: { zh: '色相不超过三个；黑白必须占版面 20% 以上作隔离', en: 'No more than three hues; black and white must take over 20% of the layout as buffer' },
    },
    atmosphere: { ambient: '#F6F1E4', key: '#FFFFFF', floor: '#EBD9C8', wall: '#F2E6DA', fog: '#DFC7B4', accent: '#FF6F61', text: '#161616' },
    demo: 'music-player',
  },

  /* ─────────────────────────── 11 北欧极简 ─────────────────────────── */
  {
    id: 'nordic',
    no: '11',
    name: { zh: '北欧极简', en: 'Nordic Minimalism' },
    medium: { zh: '室内 · 产品 · 平面', en: 'Interior · Product · Graphic' },
    period: '1930s 至今',
    origin: { zh: '丹麦 / 瑞典 / 芬兰', en: 'Denmark / Sweden / Finland' },
    figures: ['Alvar Aalto', 'Arne Jacobsen', 'Hans Wegner', 'Finn Juhl'],
    tagline: {
      zh: '因为天光不够，所以把每一样多余的东西拿走。',
      en: 'Because there is never enough daylight, remove everything that is not needed.',
    },
    source: {
      zh: '北欧极简的起点是地理与气候，不是哲学。北纬 55° 以上冬季日照常常不足六小时，室内因此需要最大化的漫射光：浅色墙面、浅木地板、窗帘只留纱，窗户尽可能大。阿尔托在 1930 年代用弯曲桦木把功能主义从直角里解放出来，指出人才是原型；雅各布森与韦格纳把家具减到只剩必要的构件，一条椅子能拆成四根腿和一块座面。1950 年代它被出口成"斯堪的纳维亚设计"，与"hygge"这个概念一起打包——重点从来不是"少"，而是"每一样留下的东西都必须能被天天使用"。这一点常被误读成冷淡的极简，其实它的目标是温。',
      en: 'Nordic minimalism begins with geography and climate, not philosophy. Above the fifty-fifth parallel winter daylight often falls short of six hours, so interiors must maximise diffuse light: pale walls, light timber floors, gauze-only curtains, windows as large as possible. In the 1930s Aalto used bent birch to free functionalism from the right angle, insisting the human being was the prototype; Jacobsen and Wegner reduced furniture to its necessary members, a chair coming apart into four legs and a seat. In the 1950s it was exported as Scandinavian Design and packaged with the notion of hygge — the point was never less, but that everything left standing must be usable every day. This is frequently misread as a cold minimalism, when its goal is warmth.',
    },
    rules: [
      {
        zh: '浅底、漫射。底色必须是低对比的浅色，所有分隔用极轻的灰或极浅的阴影完成。',
        en: 'Pale ground, diffuse light. The base must be a low-contrast light tone, and all separation is done with the faintest grey or the shallowest shadow.',
      },
      {
        zh: '浅木与雾色。主色取浅木、雾灰、鼠尾草、炭蓝，饱和度一律压低，禁止纯黑与纯白。',
        en: 'Light timber and mist. Leads are light wood, mist grey, sage and slate; saturation stays low and pure black and pure white are banned.',
      },
      {
        zh: '自然曲线在细节。整体由直线与圆角构成，只在把手、椅背、边缘处出现一次柔和的弧。',
        en: 'Nature as a detail curve. The whole is built from straight lines and radii, with one soft arc appearing only at a handle, a chair back, an edge.',
      },
      {
        zh: '功能可被指认。不允许纯装饰元素；每个物件的存在都要能说出它在解决什么问题。',
        en: 'Function must be nameable. No purely decorative elements — every object must be able to state the problem it solves.',
      },
    ],
    failure: {
      zh: '北欧极简在屏幕上最大的风险是"消失"：因为对比度被刻意压低，界面很容易在户外光或低质量显示器上变得不可读。这是它真实的代价——低对比在纸和木头上没问题，在发光的屏幕上会直接掉进可访问性红线。可行的折中是保留"低对比的观感"但守住"可读的对比值"：正文对比度不低于 7:1，把压缩掉的对比放在装饰层与分隔线上，而不放在承载信息的文字上。',
      en: 'On screen Nordic minimalism’s chief risk is disappearing: because contrast is deliberately suppressed, the interface easily becomes unreadable outdoors or on a poor display. That is its real cost — low contrast is fine on paper and timber, but on an emissive screen it walks straight into accessibility failure. The workable compromise is to keep the low-contrast impression while holding a readable contrast value: body text no lower than 7:1, with the suppressed contrast spent on decoration and dividers rather than on text that carries information.',
    },
    translation: {
      zh: '翻译到界面，演示做了一页任务清单：底色是暖白，分隔只用 1px 的 rgba 灰线，完成态用一个极轻的鼠尾草色块而非删除线，右侧留一条 88px 的呼吸边。这里最关键的一个决定是行高——我用了 2.4，比常规大得多，因为它承担了这套语言里"留白"的全部职责。',
      en: 'Translated into interface, the demo builds a task list: a warm-white ground, separation only by a 1px rgba grey rule, completion marked by a very light sage fill rather than a strikethrough, and an 88px breathing margin on the right. The single most important decision here was line-height — I used 2.4, far larger than convention, because it carries the entire duty of void in this language.',
    },
    swatches: [
      { hex: '#FAF9F6', zh: '暖白', en: 'Warm White' },
      { hex: '#D9C4A9', zh: '浅木', en: 'Pale Timber' },
      { hex: '#C9CCC8', zh: '雾灰', en: 'Mist Grey' },
      { hex: '#46545E', zh: '炭蓝', en: 'Slate Blue' },
      { hex: '#A3B3A1', zh: '鼠尾草', en: 'Sage' },
    ],
    tokens: {
      display: 'Inter 500 / Noto Sans SC 400', body: 'Inter 400', mono: 'DM Mono 300',
      radius: '10px', border: '1px solid rgba(70,84,94,.12)', shadow: '0 1px 3px rgba(70,84,94,.07)',
      space: '10 / 22 / 44 / 88', leading: '2.4（正文）/ 1.15（标题）', tracking: '0.005em',
      weight: '500 / 400', note: { zh: '正文对比度守住 7:1；低对比只用在分隔线与装饰上', en: 'Hold body contrast at 7:1; spend low contrast on dividers and decoration only' },
    },
    atmosphere: { ambient: '#FAF9F6', key: '#FFFFFF', floor: '#E6DFD3', wall: '#F4F2ED', fog: '#E0DCD3', accent: '#A3B3A1', text: '#46545E' },
    demo: 'task-list',
  },

  /* ─────────────────────────── 12 千禧 / 蒸汽波 ─────────────────────────── */
  {
    id: 'y2k',
    no: '12',
    name: { zh: '千禧 / 蒸汽波', en: 'Y2K / Vaporwave' },
    medium: { zh: '数字界面 · 时尚 · 影像', en: 'Digital Interface · Fashion · Moving Image' },
    period: '1995–2005（2010s 复兴）',
    origin: { zh: '全球 · 网络原生', en: 'Global · Born online' },
    figures: ['Apple Aqua 团队', 'Ken Kutaragi / PS2', 'Vaporwave 匿名作者群', 'Daniel Arsham'],
    tagline: {
      zh: '技术乐观主义的最后一批图像：铬、渐变、透明塑料与无限未来。',
      en: 'Technological optimism’s last images: chrome, gradient, translucent plastic and an infinite future.',
    },
    source: {
      zh: '千禧审美是真实技术条件的产物：1998 年 iMac G3 的半透明糖果色外壳、2000 年苹果 Aqua 界面里那种能挤出水的高光按钮、家用电器的银色真空镀膜、索尼 PS2 的蓝色激光盘。那几年"铬"和"渐变"不是风格选择，而是渲染能力的展示——金属反射与半透明材质首次能在消费级设备上实时跑出来。2001 年后扁平化把它全部判为过时，直到 2015 年前后蒸汽波从网络深处把它捞出来：慢放的城市流行乐、霓虹网格、日文汉字、希腊雕塑、Windows 95 窗口、无限延伸的粉色地平线。蒸汽波和当年的千禧不同，它不是乐观，而是对乐观的悼念——它把未来主义当作已经失效的文物来展示。',
      en: 'Y2K aesthetics were produced by real technical conditions: the translucent candy shells of the 1998 iMac G3, the glossy Aqua buttons of 2000 that looked as if they could be squeezed for water, vacuum-metallised appliance housings, the blue laser disc of the PlayStation 2. In those years chrome and gradient were not stylistic choices but demonstrations of rendering capability — metallic reflection and translucency had just become real-time on consumer hardware. After 2001 flat design ruled it all obsolete, until around 2015 vaporwave dredged it out of the network’s depths: slowed-down corporate pop, neon grids, kanji, Greek busts, Windows 95 windows, a pink horizon extending without end. Vaporwave differs from the original Y2K in that it is not optimism but mourning for optimism — it displays futurism as an artefact that has already stopped working.',
    },
    rules: [
      {
        zh: '铬与渐变必须可见。颜色之间不允许停留，任何一块颜色都要有方向性的明暗推移。',
        en: 'Chrome and gradient must be visible. Colour may not sit still: every surface needs a directional shift from highlight to shadow.',
      },
      {
        zh: '透明与高光。半透明塑料、玻璃感高光、镜面反射是这套语言的材质底色。',
        en: 'Translucency and specular. Translucent plastic, glassy highlight and mirror reflection form the material base of the language.',
      },
      {
        zh: '网格纵深。地平线加透视网格是它的空间图式，透视点必须在画面之外，制造无限感。',
        en: 'Grid perspective. A horizon with a perspiring grid is its spatial schema, and the vanishing point must lie outside the frame to create infinity.',
      },
      {
        zh: '错置的符号。日文、希腊雕像、老窗口、像素字体被并置，制造文化时间轴的错位。',
        en: 'Displaced symbols. Kanji, Greek statuary, legacy windows and pixel type are juxtaposed to misalign the cultural timeline.',
      },
    ],
    failure: {
      zh: '千禧审美在屏幕上有一个非常具体的崩坏点：铬渐变会吃掉对比度。银白文字压在银白渐变上，视觉上很"未来"，实际对比度只有 1.6:1，谁读谁疼。第二处陷阱是它的自我指涉——当年的千禧是真诚相信未来的，今天的复刻一旦带上怀旧的微笑，立刻降级成表情包。要让它成立的唯一办法是保留那份真诚的天真：不要加讽刺，直接把渐变做完、把网格画到消失点、把高光打足。',
      en: 'Y2K has one very specific screen failure: chrome gradients eat contrast. Silver type on a silver gradient looks futuristic and has a contrast ratio of about 1.6:1, and reading it hurts. The second trap is self-reference — the original Y2K sincerely believed in the future, so any revival wearing a nostalgic smirk degrades at once into a meme. The only way it holds is to keep the sincerity: no irony, just finish the gradient, carry the grid to its vanishing point, and light the specular fully.',
    },
    translation: {
      zh: '翻译到界面，演示做了一块媒体播放器：铬合金旋钮、青紫双向渐变、透视网格地平线、像素风时间码，所有文字压在一层 45% 暗底上以保证可读——这是我在这件藏品里唯一一次为了防止失效而动的手脚，我把它明确标出来。当年用不起这层暗底，是因为那时的显示器亮度不够；今天我们的屏幕太亮，反而必须把它加回去。',
      en: 'Translated into interface, the demo builds a media player: chrome knobs, a cyan-to-violet bidirectional gradient, a perspective grid horizon, pixel timecode, and every piece of type laid on a 45% dark scrim for legibility — the one intervention I made in this exhibit to prevent its known failure, and I am flagging it explicitly. The original era could not afford that scrim because displays were not bright enough; our screens are now so bright that it has to be put back.',
    },
    swatches: [
      { hex: '#C9D6E8', zh: '铬银', en: 'Chrome' },
      { hex: '#6EF1E6', zh: '荧光青', en: 'Aqua' },
      { hex: '#F06EE0', zh: '品红', en: 'Magenta' },
      { hex: '#1B0B3B', zh: '深紫', en: 'Deep Violet' },
      { hex: '#FFFFFF', zh: '高光白', en: 'Specular White' },
    ],
    tokens: {
      display: 'Inter 700 / 像素字体 8-bit', body: 'Inter 500', mono: 'DM Mono 500',
      radius: '12px（胶囊 999px）', border: '1px solid rgba(255,255,255,.55)',
      shadow: '0 0 24px rgba(110,241,230,.45), inset 0 1px 0 rgba(255,255,255,.8)',
      space: '8 / 18 / 36 / 64', leading: '1.25', tracking: '0.04em',
      weight: '700 / 500', note: { zh: '渐变上的文字必须加暗底；渐变角度 135°，明暗跨度不超过 3 档', en: 'Type on gradient needs a dark scrim; gradient at 135° with no more than three steps' },
    },
    atmosphere: { ambient: '#1B0B3B', key: '#6EF1E6', floor: '#2A1150', wall: '#200D46', fog: '#12062A', accent: '#F06EE0', text: '#EAF2FF' },
    demo: 'media-player',
  },
];

export const byId = (id) => EXHIBITS.find((e) => e.id === id);

/* 索引列表用的短年代标记。
   period 字段是给人读的完整表述，这个是给列表右列对齐用的，
   两者不该互相迁就——所以分开写。 */
const SPANS = {
  bauhaus: '1919–1933',
  destijl: '1917–1931',
  artdeco: '1925–1939',
  swiss: '1950–1968',
  midcentury: '1945–1969',
  brutalism: '1952–1976',
  wabisabi: '15C →',
  ukiyoe: '1700–1868',
  popart: '1956–1970',
  memphis: '1981–1988',
  nordic: '1930 →',
  y2k: '1995–2005',
};

EXHIBITS.forEach((e) => {
  e.span = SPANS[e.id] || e.period;
});

export default EXHIBITS;
