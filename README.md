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

| 操作 | 结果 |
|---|---|
| 横向拖拽 | 沿展墙走 |
| 滚轮 / 双指 | 走近或退远；推近到一定程度自动进入展位 |
| 点击展品 | 展开藏品面板 |
| `←` `→` | 切换展区 |
| `Esc` | 退出展区，回到环形展厅 |
| 索引抽屉 | 按年代跳转 |

**氛围切换**：每进入一个展区，环境光、主光、地面、墙面与雾气一起插值到该流派的色彩里。
过渡走一段 600ms 的「门廊」——色彩插值的中间点整体压暗一次，观感上像穿过门洞再进下一个展厅，
而不是被瞬移过去。切区只改环境光色、地面材质与展墙留白比三项，不重建场景。

**深链**：`#/bauhaus`、`#/ukiyoe` 等可直接打开某一件藏品。

**移动端降级**：低性能设备自动关闭阴影与抗锯齿、降低像素比与阴影贴图分辨率；
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
安装依赖 → 构建 → 上传 `dist` → 发布到 GitHub Pages。

工作流里的 `actions/configure-pages` 带 `enablement: true`，
首次运行会自动在仓库设置中启用 Pages（Sources = GitHub Actions），无需手动操作。

---

## 目录结构

```
src/
├── data/exhibits.js        12 件藏品的双语档案（史料 / 规则 / 失效条件 / token）
├── core/
│   ├── stage.js            渲染器、场景、环形空间与照明、性能分级
│   ├── gallery.js          环形展墙排布、展框、展签、地面柔光池
│   ├── plates.js           12 件展品画面的程序生成（Canvas2D，无外部素材）
│   ├── atmosphere.js       展区氛围插值 + 门廊过渡
│   └── controls.js         轨道视角、拾取、键盘、触摸
├── exhibits/frames.js      12 块「数字化转译」界面的真 DOM 结构
├── ui/
│   ├── i18n.js             语言状态与 UI 词汇表
│   ├── hud.js              展区标识、索引抽屉、进度
│   └── sheet.js            藏品详情面板
└── styles/
    ├── base.css            馆体基础与 HUD
    ├── sheet.css           藏品面板
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
