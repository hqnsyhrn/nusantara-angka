// charts.js — small hand-rolled SVG chart helpers. Every renderer returns an SVG
// string; interactivity (tooltips) is attached by main.js after insertion.

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function niceMax(v) {
  const pow = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * pow;
}

// Vertical bar chart. bars: {label, value, alt?}. null values are skipped.
export function barChart(bars, { width = 560, height = 240, unit = '' } = {}) {
  const pts = bars.filter((b) => b.value !== null && b.value !== undefined);
  if (!pts.length) return '<p class="panel-src">No data.</p>';
  const padL = 44, padB = 30, padT = 14, padR = 8;
  const max = niceMax(Math.max(...pts.map((p) => Math.abs(p.value))) * 1.12);
  const iw = width - padL - padR, ih = height - padT - padB;
  const bw = Math.min(46, iw / pts.length * 0.62);
  const y = (v) => padT + ih - (v / max) * ih;
  let out = `<svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="bar chart">`;
  for (let g = 0; g <= 4; g++) {
    const gv = (max / 4) * g;
    out += `<line class="chart-grid" x1="${padL}" x2="${width - padR}" y1="${y(gv)}" y2="${y(gv)}"/>`
         + `<text class="chart-label" x="${padL - 6}" y="${y(gv) + 4}" text-anchor="end">${gv % 1 ? gv.toFixed(1) : gv}</text>`;
  }
  const step = iw / pts.length;
  pts.forEach((p, i) => {
    const cx = padL + step * i + step / 2;
    const top = Math.min(y(p.value), y(0));
    const h = Math.abs(y(p.value) - y(0));
    out += `<rect class="chart-bar${p.alt ? ' alt' : ''}" x="${cx - bw / 2}" y="${top}" width="${bw}" height="${Math.max(1, h)}" rx="3"`
         + ` data-tip="${esc(p.label)}: ${p.value}${unit}"/>`;
    out += `<text class="chart-label" x="${cx}" y="${height - padB + 16}" text-anchor="middle">${esc(p.label)}</text>`;
    if (pts.length <= 12) {
      const below = p.value < 0; // negative bars: label under the bar so it clears the axis
      out += `<text class="chart-value" x="${cx}" y="${below ? top + h + 14 : top - 5}" text-anchor="middle">${p.value}</text>`;
    }
  });
  out += `<line class="chart-axis" x1="${padL}" x2="${width - padR}" y1="${y(0)}" y2="${y(0)}"/>`;
  return out + '</svg>';
}

// Line chart with dots. points: {label, value}. Skips nulls; draws between existing points.
export function lineChart(points, { width = 560, height = 240, unit = '' } = {}) {
  const pts = points.filter((p) => p.value !== null && p.value !== undefined);
  if (!pts.length) return '<p class="panel-src">No data.</p>';
  const padL = 44, padB = 30, padT = 14, padR = 10;
  const max = niceMax(Math.max(...pts.map((p) => p.value)) * 1.1);
  const min = Math.min(0, Math.min(...pts.map((p) => p.value)));
  const iw = width - padL - padR, ih = height - padT - padB;
  const x = (i) => padL + (iw * i) / Math.max(1, pts.length - 1);
  const y = (v) => padT + ih - ((v - min) / (max - min)) * ih;
  let out = `<svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="line chart">`;
  for (let g = 0; g <= 4; g++) {
    const gv = min + ((max - min) / 4) * g;
    out += `<line class="chart-grid" x1="${padL}" x2="${width - padR}" y1="${y(gv)}" y2="${y(gv)}"/>`
         + `<text class="chart-label" x="${padL - 6}" y="${y(gv) + 4}" text-anchor="end">${gv % 1 ? gv.toFixed(1) : Math.round(gv)}</text>`;
  }
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p.value)}`).join(' ');
  out += `<path class="chart-line" d="${path}"/>`;
  pts.forEach((p, i) => {
    out += `<circle class="chart-dot" cx="${x(i)}" cy="${y(p.value)}" r="4" data-tip="${esc(p.label)}: ${p.value}${unit}"/>`;
    if (i % Math.ceil(pts.length / 9) === 0 || i === pts.length - 1) {
      out += `<text class="chart-label" x="${x(i)}" y="${height - padB + 16}" text-anchor="middle">${esc(p.label)}</text>`;
    }
  });
  return out + '</svg>';
}

// Donut chart. slices: {label, value}. Returns svg + legend html.
export function donutChart(slices, { size = 220 } = {}) {
  const palette = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', '#5a7fa8', '#9c5a96', '#6a8a3a', '#c2754a', '#707a8a'];
  const total = slices.reduce((s, x) => s + x.value, 0);
  const r = size / 2 - 6, c = size / 2;
  const stroke = 34;
  const circ = 2 * Math.PI * (r - stroke / 2);
  let offset = 0;
  let rings = '';
  slices.forEach((s, i) => {
    const frac = s.value / total;
    const dash = `${frac * circ} ${circ - frac * circ}`;
    rings += `<circle cx="${c}" cy="${c}" r="${r - stroke / 2}" fill="none" stroke="${palette[i % palette.length]}"`
           + ` stroke-width="${stroke}" stroke-dasharray="${dash}" stroke-dashoffset="${-offset * circ}"`
           + ` transform="rotate(-90 ${c} ${c})" data-tip="${esc(s.label)}: ${s.value}%"/>`;
    offset += frac;
  });
  const legend = slices.map((s, i) =>
    `<span><span class="swatch" style="background:${palette[i % palette.length]}"></span>${esc(s.label)} (${s.value}%)</span>`).join('');
  return { svg: `<svg class="chart" viewBox="0 0 ${size} ${size}" style="max-width:${size}px" role="img" aria-label="donut chart">${rings}</svg>`, legend };
}

// Horizontal bars for comparisons (provinces, trade partners). rows: {label, value, sub}.
export function hBars(rows, { width = 560, rowH = 30, unit = '', max: fixedMax } = {}) {
  const max = fixedMax ?? Math.max(...rows.map((r) => r.value)) * 1.08;
  const padL = 150, padR = 70;
  const height = rows.length * rowH + 12;
  let out = `<svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="horizontal bars">`;
  rows.forEach((r, i) => {
    const y = 6 + i * rowH;
    const bw = ((width - padL - padR) * r.value) / max;
    out += `<text class="chart-label" x="${padL - 8}" y="${y + rowH / 2 - 4}" text-anchor="end">${esc(r.label)}</text>`
         + `<rect class="chart-bar${i % 2 ? ' alt' : ''}" x="${padL}" y="${y}" width="${Math.max(2, bw)}" height="${rowH - 10}" rx="4" data-tip="${esc(r.label)}: ${r.value}${unit}${r.sub ? ' · ' + esc(r.sub) : ''}"/>`
         + `<text class="chart-value" x="${padL + bw + 6}" y="${y + rowH / 2 - 4}">${r.value}${unit}</text>`;
  });
  return out + '</svg>';
}
