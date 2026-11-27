// views.js — HTML for every page. Pure functions from data to markup; main.js
// attaches interactivity after insertion.

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

import { META, SERIES, PROVINCES, SECTORS, TRADE, MILESTONES } from './data.js';
import { barChart, lineChart, donutChart, hBars } from './charts.js';

const NAV = [
  { hash: '#/', label: 'Overview', key: 'overview' },
  { hash: '#/economy', label: 'Economy', key: 'economy' },
  { hash: '#/people', label: 'People & society', key: 'people' },
  { hash: '#/provinces', label: 'Provinces', key: 'provinces' },
  { hash: '#/timeline', label: 'Timeline', key: 'timeline' },
  { hash: '#/about', label: 'About the data', key: 'about' },
];

// Sidebar + chrome shared by every page.
export function shell(active, inner) {
  const nav = NAV.map((n) =>
    `<a href="${n.hash}" class="${n.key === active ? 'active' : ''}">${n.label}</a>`).join('');
  return `
  <div class="layout">
    <aside class="sidebar">
      <a class="brand" href="#/">${META.siteName}</a>
      <span class="brand-sub">Statistics of ${META.country}</span>
      <nav>${nav}</nav>
      <div class="tools">
        <button id="themeBtn" type="button">🌓 Toggle theme</button>
      </div>
    </aside>
    <main class="content" id="page">${inner}</main>
  </div>
  <div id="tip"></div>`;
}

function statCard(num, lbl, src) {
  return `<div class="card"><div class="num">${num}</div><div class="lbl">${lbl}</div><div class="src">${esc(src)}</div></div>`;
}

function seriesPanel(key, chartKind = 'line') {
  const s = SERIES[key];
  const pts = s.years.map((y, i) => ({ label: String(y), value: s.values[i] }));
  const chart = chartKind === 'bar'
    ? barChart(pts, { unit: ' ' + s.unit })
    : lineChart(pts, { unit: ' ' + s.unit });
  const last = s.values.at(-1);
  const lastYear = s.years.at(-1);
  return `
  <div class="panel">
    <div class="panel-head">
      <span class="panel-title">${esc(s.title)}</span>
      <span class="panel-src">${esc(s.source)} · ${last} ${esc(s.unit)} (${lastYear})</span>
    </div>
    <div class="chart-wrap">${chart}</div>
  </div>`;
}

// #/ — Overview
export function overview() {
  const s = SERIES;
  const cards = [
    statCard(META.population2024, 'People (2024, projection)', 'BPS'),
    statCard('$' + (META.gdp2024 * 1000).toFixed(0) + ' B', 'GDP nominal 2024', 'BPS / World Bank'),
    statCard('$' + META.gdpPerCapita2024, 'GDP per person', 'World Bank'),
    statCard(s.poverty.values.at(-1) + '%', 'Living in poverty', 'BPS Susenas'),
    statCard(s.lifeExpectancy.values.at(-1) + ' yr', 'Life expectancy', 'BPS census'),
    statCard(s.internetUsers.values.at(-1) + '%', 'Online', 'APJII'),
    statCard(META.areaKm2.toLocaleString('en'), 'km² land area', 'BPS'),
    statCard(META.provinces, 'Provinces', 'BPS'),
  ].join('');
  return `
  <h1>${META.country} in numbers</h1>
  <p class="subtitle">${META.motto}. A pocket atlas of the official statistics, from the 1990s to 2024.</p>
  <div class="cards">${cards}</div>
  <h2>Growth recovered, poverty down</h2>
  ${seriesPanel('gdpGrowth', 'bar')}
  <h2>People and connection</h2>
  ${seriesPanel('population')}
  ${seriesPanel('internetUsers')}
  `;
}

// #/economy — Economy
export function economy() {
  const donut = donutChart(SECTORS);
  const tradeBars = hBars(TRADE.map((t) => ({ label: t.partner, value: t.share })), { unit: '%' });
  return `
  <h1>Economy</h1>
  <p class="subtitle">National accounts, prices and trade. A $1.4 trillion economy, the largest in Southeast Asia.</p>
  ${seriesPanel('gdpGrowth', 'bar')}
  ${seriesPanel('inflation')}
  <div class="panel">
    <div class="panel-head">
      <span class="panel-title">Structure of GDP, 2023</span>
      <span class="panel-src">BPS national accounts · share of gross value added</span>
    </div>
    <div class="chart-wrap">${donut.svg}</div>
    <div class="legend">${donut.legend}</div>
  </div>
  <div class="panel">
    <div class="panel-head">
      <span class="panel-title">Largest goods trade partners, 2023</span>
      <span class="panel-src">BPS international trade statistics · % of total trade</span>
    </div>
    <div class="chart-wrap">${tradeBars}</div>
  </div>`;
}

// #/people — People & society
export function people() {
  return `
  <h1>People &amp; society</h1>
  <p class="subtitle">Demography, welfare, education and access to services.</p>
  ${seriesPanel('population')}
  ${seriesPanel('poverty', 'bar')}
  ${seriesPanel('lifeExpectancy')}
  ${seriesPanel('literacy')}
  ${seriesPanel('unemployment', 'bar')}
  ${seriesPanel('electricity')}`;
}

// #/provinces — Provinces
export function provinces() {
  const byPop = hBars([...PROVINCES].sort((a, b) => b.population - a.population)
    .map((p) => ({ label: p.name, value: p.population, sub: p.capital !== '—' ? 'capital ' + p.capital : 'capital city' })),
    { unit: ' M' });
  const byGdp = hBars([...PROVINCES].sort((a, b) => b.gdpPerCapita - a.gdpPerCapita)
    .map((p) => ({ label: p.name, value: p.gdpPerCapita })), { unit: ' M IDR' });
  const rows = [...PROVINCES].sort((a, b) => b.population - a.population).map((p) => `
    <tr>
      <td>${esc(p.name)}</td>
      <td>${esc(p.capital)}</td>
      <td>${esc(p.island)}</td>
      <td class="num">${p.population}</td>
      <td class="num">${p.poverty}%</td>
      <td class="num">${p.gdpPerCapita}</td>
    </tr>`).join('');
  return `
  <h1>Provinces</h1>
  <p class="subtitle">The eight most populous provinces of ${META.provinces}. Figures are 2023 projections.</p>
  <div class="panel">
    <div class="panel-head"><span class="panel-title">Population by province</span>
    <span class="panel-src">BPS · million people, 2023</span></div>
    <div class="chart-wrap">${byPop}</div>
  </div>
  <div class="panel">
    <div class="panel-head"><span class="panel-title">Economic output per person</span>
    <span class="panel-src">BPS regional accounts · million rupiah, 2023</span></div>
    <div class="chart-wrap">${byGdp}</div>
  </div>
  <div class="panel">
    <div class="panel-head"><span class="panel-title">Province table</span></div>
    <table>
      <thead><tr><th>Province</th><th>Capital</th><th>Island</th><th class="num">People (M)</th><th class="num">Poverty</th><th class="num">GDP/cap</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>`;
}

// #/timeline — Timeline
export function timeline() {
  const items = MILESTONES.map((m) =>
    `<li><span class="year">${m.year}</span><span>${esc(m.text)}</span></li>`).join('');
  return `
  <h1>Timeline</h1>
  <p class="subtitle">Moments that shaped the numbers in this atlas.</p>
  <div class="panel"><ul class="timeline">${items}</ul></div>`;
}

// #/about — About the data
export function about() {
  const rows = Object.values(SERIES).map((s) => `
    <tr><td>${esc(s.title)}</td><td>${esc(s.unit)}</td><td>${esc(s.source)}</td>
    <td class="num">${s.years[0]}–${s.years.at(-1)}</td><td class="num">${s.values.filter((v) => v !== null).length}</td></tr>`).join('');
  return `
  <h1>About the data</h1>
  <p class="subtitle">Where every figure comes from, and how to read this atlas.</p>
  <div class="panel">
    <p><b>Nusantara Angka</b> bundles official statistics so they can be browsed offline:
    the whole site is static files, makes no network request, and works on a phone or a desktop.
    Figures are rounded for display; the authoritative numbers live with the sources below.</p>
    <p>Series sometimes skip years: the survey calendar, not the trend, decides which years exist.
    Charts draw through the years a source published.</p>
    <table>
      <thead><tr><th>Series</th><th>Unit</th><th>Source</th><th class="num">Span</th><th class="num">Points</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="margin-top:14px">This site is an independent educational summary. It is not affiliated with BPS,
    the World Bank or any other agency, and reproduces no agency branding.</p>
  </div>`;
}

// Unknown route.
export function missing() {
  return `
  <h1>Page not found</h1>
  <p class="subtitle">There is nothing at this address.</p>
  <p><a href="#/">Back to the overview</a>.</p>`;
}
