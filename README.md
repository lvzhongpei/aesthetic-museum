# 审美风格博物馆 · A Museum of Aesthetic Styles

十二件跨媒介视觉流派的数字化档案。每一件藏品拆成两层：

- **源流派** —— 它作为建筑、平面、产品、影像或时装原本是什么，规则是什么，在什么条件下会失效。
- **数字化转译** —— 把它翻译成一块真实的界面（真 DOM / 真 CSS，不是截图），并给出可复制的设计 token。

> 「数字化转译」不是把流派配色套到一个卡片上，而是找出该流派赖以成立的那条约束，
> 再检验它在发光屏幕上是否还成立。多数流派会在这里暴露自己的失效条件——
> 那恰恰是每件藏品最值得读的一段。

线上地址：<https://lvzhongpei.github.io/aesthetic-museum/>

---

## 藏品清单

| # | 流派 | 主媒介 | 年代 |
|---|---|---|---|
| 01 | 包豪斯 Bauhaus | 建筑 · 平面 · 产品 | 1919–1933 |
| 02 | 风格派 De Stijl | 绘画 · 建筑 · 家具 | 1917–1931 |
| 03 | 装饰艺术 Art Deco | 建筑 · 时尚 · 平面 | 1920s–1930s |
| 04 | 瑞士国际主义 Swiss International Style | 平面 · 字体 · 标识 | 1950s–1960s |
| 05 | 世纪中叶现代 Mid-Century Modern | 产品 · 室内 · 平面 | 1945–1969 |
| 06 | 粗野主义 Brutalism | 建筑 · 公共设施 | 1950s–1970s |
| 07 | 侘寂 Wabi-Sabi | 茶道 · 陶艺 · 室内 | 15 世纪至今 |
| 08 | 浮世绘 Ukiyo-e | 木刻版画 · 出版 | 17–19 世纪 |
| 09 | 波普艺术 Pop Art | 平面 · 艺术 · 广告 | 1955–1970 |
| 10 | 孟菲斯 Memphis | 产品 · 平面 · 室内 | 1981–1988 |
| 11 | 北欧极简 Nordic Minimalism | 室内 · 产品 · 平面 | 1930s 至今 |
| 12 | 千禧 / 蒸汽波 Y2K / Vaporwave | 数字界面 · 时尚 · 影像 | 1995–2005 |

---

## 空间与交互

展厅是一圈环形展墙，观众站在环心，展品沿外墙向内排列。
馆体是一间收得很暗的展室：抛光石材地面几乎能照出人影，展品自己是画面里唯一的光源。

| 操作 | 结果 |
|---|---|
| 横向滑动 | **一次滑动 = 切换一件藏品**（拖多远都只走一格），松手后镜头缓动停稳 |
| 滚轮 / 双指 | 走近或退远；推近到一定程度自动进入展位 |
| 点击展品 | 展开藏品面板 |
| `←` `→` | 切换藏品 |
| `Enter` / `Space` | 展开 / 收起藏品面板 |
| `Esc` | 退出展位，回到环形展厅 |
| 右侧导览轨 | 十二个刻度，当前展位展开并亮起强调色 |

**氛围切换**：每进入一间展室，环境光、主光、轮廓光、地面、墙面与雾气的色相一起插值，
中段整体压暗一次走「门廊」过渡，后期调色同时收紧暗角、放大色散——
观感上像穿过门洞再进下一间，而不是被瞬移过去。切区不重建场景。

**全效果栈**（桌面端全开，移动端自动降级）：

- 泛光辉光：发光体带着光晕，顶部灯带与展框下的 LED 细线被晕开
- 地面真实反射：`Reflector` 做一次镜像场景渲染，展品在石材上有倒影
- 浮尘粒子：900 颗被光打亮的微粒在空气里缓慢上浮
- 电影调色：暗角、胶片颗粒、径向色散、轻微提对比
- 入场推进：从高处落下、缓缓停在展线高度，同时曝光从 0.28 抬到 1.0
- 切区过渡：镜头向前推一点点 + 调色脉冲

**深链**：`#/bauhaus`、`#/ukiyoe` 等可直接打开某一件藏品。

**移动端降级**：低性能设备自动关闭阴影、关闭反射、降低像素比与粒子数量；
若浏览器无法启动 WebGL，整体退回纯 DOM 图鉴模式，藏品与文档一条不少。


---

## 本地运行

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # 产物输出到 dist/
npm run preview    # 预览构建产物
```

生产构建的 `base` 是 `/aesthetic-museum/`（GitHub Pages 项目站点路径），
`dev` / `preview` 保持根路径，避免开发时路径错乱。

---

## 部署

推送 `main` 分支即触发 `.github/workflows/deploy.yml`：
安装依赖 → 构建 → 配置 Pages → 上传 `dist` → 发布。

线上地址：<https://lvzhongpei.github.io/aesthetic-museum/>

### 迁移到新仓库时的唯一一处手动步骤

工作流里的 `actions/configure-pages` 带了 `enablement: true`，**但这一步救不了全新仓库**：
创建 Pages 站点需要仓库管理员权限，而工作流默认的 `GITHUB_TOKEN` 没有这个权限，
所以在一个刚建好、Pages 从未启用过的仓库上第一次跑，会卡在 `Configure Pages` 报 403
（`Build` 其实是通过的）。

**先用 PAT 启用一次**：

```bash
curl -X POST \
  -H "Authorization: token <你的 PAT，需 repo 权限>" \
  -H "Accept: application/vnd.github+json" \
  -d '{"build_type":"workflow"}' \
  https://api.github.com/repos/<owner>/<repo>/pages
```

或者直接在仓库 **Settings → Pages → Source** 选 **GitHub Actions** 保存一次。
启用之后，`enablement: true` 就退化成幂等空操作，之后每次推送都能正常跑完。

> 顺带一条：classic PAT 想推送 `.github/workflows/` 下的文件，除了 `repo`
> 还需要 `workflow` 权限；否则 GitHub 会单独拒收这个文件。

---

## 目录结构

```
src/
├── data/
│   ├── exhibits.js         12 件藏品的主档案（主张/源流派/规则/失效条件/转译/token）
│   └── dossier/            研究档案（编年史/典型案例/代表人物/轶事），按 A·B·C 分卷
│       ├── a.js            01–04 二十世纪初的欧洲与风格派
│       ├── b.js            05–08 战后与东亚
│       ├── c.js            09–12 消费时代与数字时代
│       └── index.js        合并与按 id 查询
├── core/
│   ├── stage.js            渲染器、环形暗场空间、环境贴图、照明、性能分级
│   ├── gallery.js          环形展墙、金属展框、灯箱画面、光晕、地面光池
│   ├── plates.js           12 件展品画面的程序生成（Canvas2D，无外部素材）
│   ├── post.js             后处理链：泛光 → 色调映射 → 电影调色
│   ├── dust.js             浮尘粒子
│   ├── atmosphere.js       展区氛围插值 + 门廊过渡（由色板推导整间展室的光色）
│   ├── controls.js         轨道视角：一次滑动切一件、拾取、键盘、触摸、入场推进
│   └── color.js            HSL 互转与色板重算
├── exhibits/frames.js      12 块「数字化转译」界面的真 DOM 结构
├── ui/
│   ├── i18n.js             语言状态与 UI 词汇表
│   ├── hud.js              展区标识、右侧导览轨、索引抽屉
│   └── sheet.js            藏品面板
└── styles/
    ├── base.css            馆体基础、HUD、导览轨、载入屏
    ├── sheet.css           藏品面板与图录式排版
    └── exhibits.css        12 块转译界面的样式
```

---

## 关于素材与版权

**全部视觉资产由代码生成，仓库不含任何第三方图片。**

- 展品画面：`src/core/plates.js` 中的 12 个 Canvas2D 绘制函数，
  按各流派自己的构成规则现画，可无限缩放、体积极小。
- 转译界面：真 DOM + CSS，无位图。
- 背景纹理（纸纤维、网点、颗粒）：CSS 渐变与内联 SVG 滤镜。
- 网页字体通过 Google Fonts 引入（Inter / Noto Sans SC / Noto Serif SC / DM Mono，均为 SIL OFL）。

因此整个仓库可以自由复制、修改与再分发。

**代码许可**：MIT（见 `LICENSE`）。
藏品文案为原创撰写，欢迎引用，注明出处即可。

---

## English

Twelve cross-media visual movements, archived on two levels: what each movement was as
architecture, graphic design, product or moving image — and what it becomes when translated
into a piece of interface.

The translation is not a palette applied to a card. It means finding the single constraint
the movement was built on and testing whether it still holds on an emissive screen. Most
movements expose their own failure conditions here, which is the most useful paragraph in
each exhibit.

The gallery is a ring of twelve walls. You stand at the centre; exhibits face inward.
Drag to walk the wall, scroll to approach, click to open an exhibit, `←` `→` to change room,
`Esc` to step back. Entering a room interpolates ambient light, key light, floor, wall and
fog into that movement's colour — through a 600 ms "portico" dip, so it reads as walking
through a doorway rather than being teleported.

Bilingual (中文 / English). Low-end devices drop shadows and pixel ratio automatically;
browsers without WebGL fall back to a pure DOM catalogue with every exhibit intact.

MIT licensed. All imagery is generated in code — no third-party assets.
