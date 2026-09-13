/**
 * 展品画面 · 全部由 Canvas2D 程序生成，不含任何第三方图片。
 * 每件藏品的画面不是"该流派的作品截图"，而是用该流派自己的构成规则
 * 现画出来的一幅版式 —— 所以它可无限缩放、体积极小、且版权干净。
 */

export const PLATE_W = 640;
export const PLATE_H = 820;
export const LABEL_W = 512;
export const LABEL_H = 112;

/* ────────────────────────── 通用工具 ────────────────────────── */

function paper(ctx, w, h, base, fiber = 0.05) {
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);
  const n = Math.floor((w * h) / 260);
  for (let i = 0; i < n; i += 1) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    ctx.fillStyle = Math.random() > 0.5
      ? `rgba(0,0,0,${fiber * Math.random()})`
      : `rgba(255,255,255,${fiber * Math.random()})`;
    ctx.fillRect(x, y, 1.4, 1.4);
  }
}

function grain(ctx, w, h, amount = 0.06) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 255 * amount;
    d[i] += n;
    d[i + 1] += n;
    d[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}

function rect(ctx, x, y, w, h, fill, stroke, lw = 1) {
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, w, h);
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lw;
    ctx.strokeRect(x + lw / 2, y + lw / 2, w - lw, h - lw);
  }
}

function circle(ctx, cx, cy, r, fill, stroke, lw = 1) {
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lw;
    ctx.stroke();
  }
}

function line(ctx, x1, y1, x2, y2, color, lw = 1) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.stroke();
}

/* ────────────────────────── 十二件画面 ────────────────────────── */

const PAINTERS = {
  /* 01 包豪斯：三元素构成 + 功能分区线 */
  bauhaus(ctx, w, h) {
    paper(ctx, w, h, '#F2EFE6', 0.06);
    const R = '#E03B2A';
    const Y = '#F2C200';
    const B = '#1B4CA1';
    const K = '#141414';
    // 结构线
    line(ctx, w * 0.06, h * 0.055, w * 0.94, h * 0.055, K, 1.4);
    line(ctx, w * 0.06, h * 0.055, w * 0.06, h * 0.94, K, 1.4);
    // 红方块
    rect(ctx, w * 0.14, h * 0.12, w * 0.40, h * 0.24, R, K, 1.2);
    // 黄圆
    circle(ctx, w * 0.68, h * 0.28, w * 0.17, Y, K, 1.2);
    // 蓝矩形
    rect(ctx, w * 0.14, h * 0.43, w * 0.60, h * 0.17, B, K, 1.2);
    // 黑色配重条
    rect(ctx, w * 0.68, h * 0.12, w * 0.20, h * 0.035, K);
    // 底部层级条（宽窄代表层级）
    rect(ctx, w * 0.14, h * 0.68, w * 0.62, h * 0.018, K);
    rect(ctx, w * 0.14, h * 0.72, w * 0.40, h * 0.012, K);
    rect(ctx, w * 0.14, h * 0.752, w * 0.24, h * 0.008, K);
    // 30° 斜线
    ctx.save();
    ctx.translate(w * 0.14, h * 0.86);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w * 0.5, -h * 0.055);
    ctx.strokeStyle = R;
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.restore();
    grain(ctx, w, h, 0.03);
  },

  /* 02 风格派：悬殊块面的网格 */
  destijl(ctx, w, h) {
    ctx.fillStyle = '#F7F7F4';
    ctx.fillRect(0, 0, w, h);
    const K = '#101010';
    const X = [0, 0.10, 0.34, 0.62, 1];
    const Y = [0, 0.16, 0.42, 0.70, 1];
    const fills = {
      '0,0': '#F7F7F4', '1,0': '#D62828', '2,0': '#F7F7F4',
      '0,1': '#193A80', '1,1': '#F7F7F4', '2,1': '#F4C20D',
      '0,2': '#F7F7F4', '1,2': '#D62828', '2,2': '#193A80',
    };
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        const x = X[i] * w;
        const y = Y[j] * h;
        const cw = (X[i + 1] - X[i]) * w;
        const ch = (Y[j + 1] - Y[j]) * h;
        ctx.fillStyle = fills[`${i},${j}`] || '#F7F7F4';
        ctx.fillRect(x, y, cw, ch);
      }
    }
    // 黑色主结构线（外框 + 内部），线宽按位置递增
    X.forEach((x, i) => line(ctx, x * w, 0, x * w, h, K, i === 0 || i === 4 ? 9 : 7));
    Y.forEach((y, j) => line(ctx, 0, y * h, w, y * h, K, j === 0 || j === 4 ? 9 : 7));
    grain(ctx, w, h, 0.03);
  },

  /* 03 装饰艺术：中心对称阶梯 + 放射 */
  artdeco(ctx, w, h) {
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#1B4034');
    bg.addColorStop(1, '#0E2620');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    const gold = ctx.createLinearGradient(0, 0, w, h);
    gold.addColorStop(0, '#8C6A3F');
    gold.addColorStop(0.42, '#E8D8A8');
    gold.addColorStop(1, '#A8853F');
    const G = '#C8A44D';
    const cx = w / 2;
    // 外框金线
    ctx.strokeStyle = gold;
    ctx.lineWidth = 2;
    ctx.strokeRect(w * 0.045, h * 0.035, w * 0.91, h * 0.93);
    ctx.lineWidth = 1;
    ctx.strokeRect(w * 0.075, h * 0.058, w * 0.85, h * 0.884);
    // 放射线
    ctx.save();
    ctx.translate(cx, h * 0.30);
    for (let i = -9; i <= 9; i += 1) {
      const a = (i / 9) * (Math.PI * 0.42) - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * h * 0.045, Math.sin(a) * h * 0.045);
      ctx.lineTo(Math.cos(a) * h * 0.30, Math.sin(a) * h * 0.30);
      ctx.strokeStyle = 'rgba(200,164,77,.5)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();
    circle(ctx, cx, h * 0.30, h * 0.042, gold);
    // 阶梯（ziggurat）
    const steps = 6;
    for (let i = 0; i < steps; i += 1) {
      const t = i / steps;
      const bw = w * (0.60 - t * 0.42);
      const bh = h * 0.036;
      const y = h * 0.44 + i * bh * 1.02;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(200,164,77,.20)' : 'rgba(200,164,77,.09)';
      ctx.fillRect(cx - bw / 2, y, bw, bh);
      ctx.strokeStyle = gold;
      ctx.lineWidth = 1;
      ctx.strokeRect(cx - bw / 2, y, bw, bh);
    }
    // 底部双线
    line(ctx, w * 0.18, h * 0.82, w * 0.82, h * 0.82, gold, 1.6);
    line(ctx, w * 0.28, h * 0.855, w * 0.72, h * 0.855, gold, 1);
    // 角落扇形
    [[0.10, 0.90], [0.90, 0.90]].forEach(([px, py]) => {
      ctx.save();
      ctx.translate(px * w, py * h);
      for (let i = 0; i <= 4; i += 1) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const a = -Math.PI + (i / 4) * Math.PI * 0.5;
        ctx.lineTo(Math.cos(a) * w * 0.09, Math.sin(a) * w * 0.09);
        ctx.strokeStyle = 'rgba(200,164,77,.45)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();
    });
  },

  /* 04 瑞士国际主义：非对称网格 + 单一强调 */
  swiss(ctx, w, h) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);
    // 红圆
    circle(ctx, w * 0.52, h * 0.345, w * 0.275, '#E4002B');
    // 顶部细规线
    line(ctx, w * 0.08, h * 0.075, w * 0.92, h * 0.075, '#111111', 1.6);
    // 黑色层级条（左对齐硬边，宽窄即层级）
    rect(ctx, w * 0.08, h * 0.60, w * 0.62, h * 0.026, '#111111');
    rect(ctx, w * 0.08, h * 0.645, w * 0.44, h * 0.019, '#111111');
    rect(ctx, w * 0.08, h * 0.683, w * 0.70, h * 0.012, '#8A8A8A');
    rect(ctx, w * 0.08, h * 0.706, w * 0.58, h * 0.009, '#8A8A8A');
    // 右侧小字块（灰）
    for (let i = 0; i < 5; i += 1) {
      rect(ctx, w * 0.66, h * 0.605 + i * h * 0.024, w * 0.26, h * 0.007, '#C9C9C9');
    }
    // 底部基线网格示意
    ctx.strokeStyle = 'rgba(17,17,17,.10)';
    ctx.lineWidth = 1;
    for (let y = h * 0.60; y < h * 0.92; y += h * 0.024) {
      line(ctx, w * 0.08, y, w * 0.92, y, 'rgba(17,17,17,.10)', 1);
    }
    line(ctx, w * 0.08, h * 0.90, w * 0.92, h * 0.90, '#111111', 1.6);
  },

  /* 05 世纪中叶现代：有机曲线 + 细骨架 */
  midcentury(ctx, w, h) {
    paper(ctx, w, h, '#F0EAE0', 0.05);
    const TEAK = '#7A4A24';
    const MUST = '#D89A3E';
    const PINE = '#3E6B5A';
    const BRICK = '#C05B3E';
    // 椭圆主体
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.30, w * 0.30, h * 0.155, 0, 0, Math.PI * 2);
    ctx.fillStyle = MUST;
    ctx.fill();
    ctx.restore();
    // 细骨架（锥形腿）
    ctx.beginPath();
    ctx.moveTo(w * 0.30, h * 0.44);
    ctx.lineTo(w * 0.335, h * 0.44);
    ctx.lineTo(w * 0.285, h * 0.66);
    ctx.lineTo(w * 0.275, h * 0.66);
    ctx.closePath();
    ctx.fillStyle = TEAK;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(w * 0.66, h * 0.44);
    ctx.lineTo(w * 0.70, h * 0.44);
    ctx.lineTo(w * 0.71, h * 0.66);
    ctx.lineTo(w * 0.70, h * 0.66);
    ctx.closePath();
    ctx.fill();
    // 悬臂横杆
    line(ctx, w * 0.24, h * 0.455, w * 0.76, h * 0.455, TEAK, 3);
    // 松绿弧形
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.56, w * 0.22, Math.PI * 1.05, Math.PI * 1.95);
    ctx.strokeStyle = PINE;
    ctx.lineWidth = 9;
    ctx.stroke();
    // 原子点
    for (let i = 0; i < 7; i += 1) {
      const a = (i / 7) * Math.PI * 2;
      circle(ctx, w * 0.5 + Math.cos(a) * w * 0.16, h * 0.72 + Math.sin(a) * h * 0.045, 4.5, i % 2 ? BRICK : TEAK);
    }
    // 底部信息条（细线，制造"轻"）
    line(ctx, w * 0.14, h * 0.86, w * 0.86, h * 0.86, 'rgba(122,74,36,.28)', 1);
    rect(ctx, w * 0.14, h * 0.885, w * 0.30, h * 0.011, TEAK);
    rect(ctx, w * 0.14, h * 0.906, w * 0.18, h * 0.008, 'rgba(122,74,36,.45)');
  },

  /* 06 粗野主义：体量 + 硬影 + 颗粒 */
  brutalism(ctx, w, h) {
    ctx.fillStyle = '#9A9A93';
    ctx.fillRect(0, 0, w, h);
    const K = '#1C1C1A';
    // 硬影
    ctx.fillStyle = 'rgba(28,28,26,.34)';
    ctx.beginPath();
    ctx.moveTo(w * 0.20, h * 0.22);
    ctx.lineTo(w * 0.30, h * 0.28);
    ctx.lineTo(w * 0.30, h * 0.86);
    ctx.lineTo(w * 0.20, h * 0.92);
    ctx.closePath();
    ctx.fill();
    // 主块
    rect(ctx, w * 0.20, h * 0.22, w * 0.44, h * 0.64, '#DCDCD6', K, 3);
    // 竖鳍
    for (let i = 0; i < 5; i += 1) {
      rect(ctx, w * (0.235 + i * 0.082), h * 0.28, w * 0.040, h * 0.50, '#B4B4AD', K, 2);
    }
    // 锈红块
    rect(ctx, w * 0.66, h * 0.36, w * 0.18, h * 0.26, '#7A4032', K, 3);
    // 悬挑板
    rect(ctx, w * 0.14, h * 0.14, w * 0.72, h * 0.055, '#8E8E88', K, 3);
    // 螺栓孔
    for (let i = 0; i < 6; i += 1) {
      circle(ctx, w * (0.18 + i * 0.128), h * 0.168, 3.4, K);
    }
    // 底部重线
    rect(ctx, w * 0.14, h * 0.905, w * 0.72, h * 0.022, K);
    grain(ctx, w, h, 0.10);
  },

  /* 07 侘寂：一笔 + 巨量留白 */
  wabisabi(ctx, w, h) {
    paper(ctx, w, h, '#E8E2D5', 0.09);
    const CX = w * 0.5;
    const CY = h * 0.40;
    const R = w * 0.30;
    // 手绘感的圆（一笔，线宽有起落，留缺口）
    const start = -Math.PI * 0.30;
    const end = Math.PI * 1.86;
    const steps = 320;
    for (let i = 0; i < steps; i += 1) {
      const t = i / (steps - 1);
      const a = start + (end - start) * t;
      const jitter = 1 + Math.sin(t * Math.PI) * 0.035 + (Math.random() - 0.5) * 0.012;
      const pause = 1 - Math.abs(t - 0.5) * 0.35;
      const x = CX + Math.cos(a) * R * jitter;
      const y = CY + Math.sin(a) * R * jitter + Math.sin(t * Math.PI * 0.5) * 5;
      const lw = 5.5 * (0.5 + pause * 0.9);
      ctx.beginPath();
      ctx.arc(x, y, lw / 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(58,55,51,${0.52 + Math.random() * 0.32})`;
      ctx.fill();
    }
    // 一点朱
    circle(ctx, w * 0.80, h * 0.145, w * 0.026, '#A94A32');
    // 极軽的落款线
    line(ctx, w * 0.72, h * 0.82, w * 0.86, h * 0.82, 'rgba(58,55,51,.22)', 1);
    grain(ctx, w, h, 0.05);
  },

  /* 08 浮世绘：平涂分层 + 硬轮廓 + 套印偏移 */
  ukiyoe(ctx, w, h) {
    paper(ctx, w, h, '#F1E8D6', 0.06);
    const BLUE_D = '#16305C';
    const BLUE = '#1F3A6E';
    const BLUE_L = '#4A6B9E';
    const OCHRE = '#E3B23C';
    const INK = '#23201C';
    const RED = '#D64A32';
    // 上下色带（平涂）
    rect(ctx, 0, 0, w, h * 0.46, BLUE);
    rect(ctx, 0, h * 0.20, w, h * 0.10, '#2A4A80');
    rect(ctx, 0, h * 0.46, w, h * 0.13, '#C9B693');
    rect(ctx, 0, h * 0.59, w, h * 0.41, OCHRE);
    // 波（三层，硬轮廓）
    function wave(yOff, amp, col, lw) {
      ctx.beginPath();
      ctx.moveTo(-10, h * 0.46 + yOff);
      for (let x = -10; x <= w + 10; x += 8) {
        const t = x / w;
        const y = h * 0.46 + yOff
          + Math.sin(t * Math.PI * 3.1) * amp
          - Math.sin(t * Math.PI * 5.4) * amp * 0.34;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w + 10, h * 0.60);
      ctx.lineTo(-10, h * 0.60);
      ctx.closePath();
      ctx.fillStyle = col;
      ctx.fill();
      ctx.strokeStyle = INK;
      ctx.lineWidth = lw;
      ctx.stroke();
    }
    wave(-h * 0.03, h * 0.030, BLUE_L, 3);
    wave(h * 0.035, h * 0.026, '#8FA8C6', 3);
    // 浪花（硬轮廓的小圆）
    for (let i = 0; i < 5; i += 1) {
      circle(ctx, w * (0.16 + i * 0.16), h * 0.455, w * 0.032, '#F1E8D6', INK, 2.6);
    }
    // 远山
    ctx.beginPath();
    ctx.moveTo(w * 0.58, h * 0.38);
    ctx.lineTo(w * 0.76, h * 0.16);
    ctx.lineTo(w * 0.94, h * 0.38);
    ctx.closePath();
    ctx.fillStyle = '#16305C';
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.stroke();
    // 朱印
    rect(ctx, w * 0.80, h * 0.76, w * 0.10, h * 0.078, RED);
    rect(ctx, w * 0.82, h * 0.775, w * 0.024, h * 0.024, '#F1E8D6');
    rect(ctx, w * 0.855, h * 0.805, w * 0.024, h * 0.024, '#F1E8D6');
    // 落线
    line(ctx, w * 0.10, h * 0.90, w * 0.58, h * 0.90, INK, 2.6);
    grain(ctx, w, h, 0.05);
  },

  /* 09 波普：网点 + 粗轮廓 + 重复 */
  popart(ctx, w, h) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);
    // 网点底
    const pitch = 11;
    for (let y = 0; y < h; y += pitch) {
      for (let x = 0; x < w; x += pitch) {
        circle(ctx, x + pitch / 2, y + pitch / 2, 2.6, 'rgba(255,45,135,.85)');
      }
    }
    // 黄色块
    rect(ctx, w * 0.08, h * 0.10, w * 0.84, h * 0.30, '#FFE500', '#111111', 5);
    // 重复三次的形（换色）
    const cols = ['#FF2D87', '#00B4D8', '#111111'];
    for (let i = 0; i < 3; i += 1) {
      const cx = w * (0.28 + i * 0.22);
      const cy = h * (0.30 + i * 0.02);
      ctx.beginPath();
      ctx.moveTo(cx, cy - h * 0.10);
      ctx.bezierCurveTo(cx + w * 0.14, cy - h * 0.06, cx + w * 0.10, cy + h * 0.06, cx, cy + h * 0.10);
      ctx.bezierCurveTo(cx - w * 0.10, cy + h * 0.06, cx - w * 0.14, cy - h * 0.06, cx, cy - h * 0.10);
      ctx.closePath();
      ctx.fillStyle = cols[i];
      ctx.fill();
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = 5;
      ctx.stroke();
    }
    // 一次性硬影
    rect(ctx, w * 0.08, h * 0.60, w * 0.62, h * 0.20, '#FF2D87', '#111111', 5);
    ctx.fillStyle = 'rgba(17,17,17,.999)';
    ctx.fillRect(w * 0.08 + 7, h * 0.60 + 7, w * 0.62, h * 0.20);
    ctx.fillStyle = '#FFE500';
    ctx.fillRect(w * 0.08, h * 0.60, w * 0.62, h * 0.20);
    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 5;
    ctx.strokeRect(w * 0.08, h * 0.60, w * 0.62, h * 0.20);
    rect(ctx, w * 0.74, h * 0.62, w * 0.18, h * 0.16, '#00B4D8', '#111111', 5);
    // 底部粗条
    rect(ctx, w * 0.08, h * 0.88, w * 0.84, h * 0.028, '#111111');
  },

  /* 10 孟菲斯：撞色 + 反叛几何 */
  memphis(ctx, w, h) {
    ctx.fillStyle = '#FF6F61';
    ctx.fillRect(0, 0, w, h);
    // 薄荷大块（面积最大，承担"大"这一档）
    rect(ctx, 0, h * 0.62, w, h * 0.38, '#7ED9C3');
    // 蓝紫梯形
    ctx.beginPath();
    ctx.moveTo(w * 0.10, h * 0.14);
    ctx.lineTo(w * 0.52, h * 0.14);
    ctx.lineTo(w * 0.42, h * 0.44);
    ctx.lineTo(w * 0.06, h * 0.44);
    ctx.closePath();
    ctx.fillStyle = '#4B4E9B';
    ctx.fill();
    ctx.strokeStyle = '#161616';
    ctx.lineWidth = 4;
    ctx.stroke();
    // 柠檬波形
    ctx.beginPath();
    ctx.moveTo(w * 0.58, h * 0.40);
    for (let i = 0; i <= 40; i += 1) {
      const t = i / 40;
      ctx.lineTo(w * 0.58 + t * w * 0.36, h * 0.40 + Math.sin(t * Math.PI * 4) * h * 0.035);
    }
    ctx.strokeStyle = '#FFD23F';
    ctx.lineWidth = 11;
    ctx.lineCap = 'round';
    ctx.stroke();
    // 锯齿分隔带
    ctx.beginPath();
    const zy = h * 0.545;
    const zh = h * 0.035;
    ctx.moveTo(0, zy);
    for (let x = 0; x <= w; x += w * 0.055) {
      ctx.lineTo(x + w * 0.0275, zy + zh);
      ctx.lineTo(x + w * 0.055, zy);
    }
    ctx.lineTo(w, zy - zh);
    ctx.lineTo(0, zy - zh);
    ctx.closePath();
    ctx.fillStyle = '#161616';
    ctx.fill();
    // 波点
    for (let i = 0; i < 4; i += 1) {
      circle(ctx, w * (0.16 + i * 0.10), h * 0.70, w * 0.030, '#FFD23F', '#161616', 3.4);
    }
    // 黑色蚯蚓线
    ctx.beginPath();
    ctx.moveTo(w * 0.42, h * 0.90);
    ctx.bezierCurveTo(w * 0.56, h * 0.80, w * 0.68, h * 0.98, w * 0.86, h * 0.86);
    ctx.strokeStyle = '#161616';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.stroke();
    // 柠檬圆
    circle(ctx, w * 0.80, h * 0.24, w * 0.10, '#FFD23F', '#161616', 4);
  },

  /* 11 北欧极简：浅底 + 一次柔弧 */
  nordic(ctx, w, h) {
    paper(ctx, w, h, '#FAF9F6', 0.03);
    // 浅木横带
    rect(ctx, 0, h * 0.52, w, h * 0.16, '#EDE4D6');
    rect(ctx, 0, h * 0.52, w, 2, 'rgba(217,196,169,.9)');
    rect(ctx, 0, h * 0.68 - 2, w, 2, 'rgba(217,196,169,.9)');
    // 鼠尾草柔形
    ctx.beginPath();
    ctx.ellipse(w * 0.36, h * 0.32, w * 0.19, h * 0.115, -0.22, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(163,179,161,.85)';
    ctx.fill();
    // 唯一一次自然弧（细节）
    ctx.beginPath();
    ctx.arc(w * 0.42, h * 0.34, w * 0.30, Math.PI * 0.10, Math.PI * 0.62);
    ctx.strokeStyle = '#D9C4A9';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.stroke();
    // 炭蓝细条
    rect(ctx, w * 0.10, h * 0.78, w * 0.26, h * 0.010, '#46545E');
    rect(ctx, w * 0.10, h * 0.815, w * 0.52, h * 0.007, 'rgba(70,84,94,.30)');
    rect(ctx, w * 0.10, h * 0.840, w * 0.40, h * 0.007, 'rgba(70,84,94,.22)');
    rect(ctx, w * 0.10, h * 0.865, w * 0.58, h * 0.007, 'rgba(70,84,94,.16)');
    // 极轻分隔线
    line(ctx, w * 0.10, h * 0.94, w * 0.90, h * 0.94, 'rgba(70,84,94,.12)', 1);
  },

  /* 12 千禧 / 蒸汽波：铬 + 透视网格 + 霓虹 */
  y2k(ctx, w, h) {
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#1B0B3B');
    bg.addColorStop(0.55, '#2A1150');
    bg.addColorStop(1, '#3B1568');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    // 霓虹地平线
    const hor = h * 0.56;
    // 透视网格
    ctx.save();
    ctx.strokeStyle = 'rgba(110,241,230,.55)';
    ctx.lineWidth = 1.2;
    for (let i = -14; i <= 14; i += 1) {
      ctx.beginPath();
      ctx.moveTo(w / 2 + i * 12, hor);
      ctx.lineTo(w / 2 + i * w * 0.22, h + 10);
      ctx.stroke();
    }
    for (let i = 1; i <= 12; i += 1) {
      const t = i / 12;
      const y = hor + Math.pow(t, 2.1) * (h - hor);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.strokeStyle = `rgba(110,241,230,${0.55 * (1 - t * 0.72)})`;
      ctx.stroke();
    }
    ctx.restore();
    // 地平线光带
    const glow = ctx.createLinearGradient(0, hor - 26, 0, hor + 26);
    glow.addColorStop(0, 'rgba(240,110,224,0)');
    glow.addColorStop(0.5, 'rgba(240,110,224,.85)');
    glow.addColorStop(1, 'rgba(240,110,224,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, hor - 26, w, 52);
    // 铬球
    const cg = ctx.createRadialGradient(w * 0.63, h * 0.28, w * 0.01, w * 0.68, h * 0.33, w * 0.20);
    cg.addColorStop(0, '#FFFFFF');
    cg.addColorStop(0.22, '#C9D6E8');
    cg.addColorStop(0.52, '#6E7A95');
    cg.addColorStop(0.78, '#2E2A4C');
    cg.addColorStop(1, '#C9D6E8');
    circle(ctx, w * 0.66, h * 0.31, w * 0.165, cg);
    circle(ctx, w * 0.66, h * 0.31, w * 0.165, null, 'rgba(255,255,255,.55)', 1.6);
    // 铬横条（媒体控件）
    const bar = ctx.createLinearGradient(0, h * 0.80, 0, h * 0.90);
    bar.addColorStop(0, '#FFFFFF');
    bar.addColorStop(0.35, '#C9D6E8');
    bar.addColorStop(0.55, '#7E8BA6');
    bar.addColorStop(0.75, '#C9D6E8');
    bar.addColorStop(1, '#5A6478');
    rect(ctx, w * 0.16, h * 0.80, w * 0.68, h * 0.10, bar, 'rgba(255,255,255,.6)', 1.6);
    // 像素时间码格
    for (let i = 0; i < 14; i += 1) {
      const on = i < 8;
      rect(ctx, w * 0.20 + i * w * 0.022, h * 0.835, w * 0.014,
        h * (0.012 + (i % 3) * 0.008),
        on ? '#6EF1E6' : 'rgba(255,255,255,.18)');
    }
    // 顶部像素标题条
    for (let i = 0; i < 11; i += 1) {
      rect(ctx, w * 0.16 + i * w * 0.030, h * 0.115, w * 0.020, h * 0.016,
        i % 3 === 0 ? '#F06EE0' : 'rgba(255,255,255,.72)');
    }
    // 高光斜纹
    ctx.save();
    ctx.globalAlpha = 0.16;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(w * 0.42, 0);
    ctx.lineTo(0, h * 0.30);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },
};

export function paintPlate(id, canvas) {
  const c = canvas || document.createElement('canvas');
  c.width = PLATE_W;
  c.height = PLATE_H;
  const ctx = c.getContext('2d');
  const fn = PAINTERS[id] || PAINTERS.bauhaus;
  fn(ctx, PLATE_W, PLATE_H);
  return c;
}

/**
 * 展签：馆体统一排印，不跟随展区风格。
 * 理由——真实的博物馆里，标签牌是馆方制式，不是艺术家做的。
 */
export function paintLabel(ex, lang, canvas) {
  const c = canvas || document.createElement('canvas');
  c.width = LABEL_W;
  c.height = LABEL_H;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, LABEL_W, LABEL_H);

  const plate = '#F4F4F2';
  const ink = '#16161A';
  const sub = 'rgba(22,22,26,.55)';

  ctx.fillStyle = plate;
  ctx.fillRect(0, 0, LABEL_W, LABEL_H);
  ctx.fillStyle = 'rgba(22,22,26,.10)';
  ctx.fillRect(0, LABEL_H - 2, LABEL_W, 2);

  const name = ex.name[lang] || ex.name.zh;
  const medium = ex.medium[lang] || ex.medium.zh;

  // 序号
  ctx.fillStyle = sub;
  ctx.font = '500 22px "DM Mono", ui-monospace, monospace';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(ex.no, 26, 40);

  // 名称
  ctx.fillStyle = ink;
  const cjk = /[\u4e00-\u9fff]/.test(name);
  ctx.font = cjk
    ? '600 34px "Noto Serif SC", "Noto Sans SC", serif'
    : '700 32px Inter, "Helvetica Neue", Arial, sans-serif';
  ctx.fillText(name, 26, 78);

  // 媒介 + 年代
  ctx.fillStyle = sub;
  ctx.font = '400 17px Inter, "Noto Sans SC", sans-serif';
  ctx.fillText(`${medium}  ·  ${ex.period}`, 26, 100);
  ctx.fillStyle = ink;
  ctx.fillRect(26, 90, 44, 2);

  return c;
}

export default { paintPlate, paintLabel, PLATE_W, PLATE_H, LABEL_W, LABEL_H };
