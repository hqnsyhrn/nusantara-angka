// Nusantara Angka — hash-routed statistics atlas. All data lives in data.js, so the
// site never touches the network.
//
//   #/            overview
//   #/economy     economy
//   #/people      people & society
//   #/provinces   provinces
//   #/timeline    timeline
//   #/about       about the data
//
// window.__shotReady flips true once a page is on screen, so a screenshot
// script knows when to capture.

import { META } from './data.js';
import { shell, overview, economy, people, provinces, timeline, about, missing } from './views.js';

const app = document.getElementById('app');

const ROUTES = {
  '#/': { title: `${META.siteName} — statistics of ${META.country}`, key: 'overview', view: overview },
  '#/economy': { title: `Economy | ${META.siteName}`, key: 'economy', view: economy },
  '#/people': { title: `People & society | ${META.siteName}`, key: 'people', view: people },
  '#/provinces': { title: `Provinces | ${META.siteName}`, key: 'provinces', view: provinces },
  '#/timeline': { title: `Timeline | ${META.siteName}`, key: 'timeline', view: timeline },
  '#/about': { title: `About the data | ${META.siteName}`, key: 'about', view: about },
};

// Tooltip follows chart elements tagged with data-tip.
function attachTooltip() {
  const tip = document.getElementById('tip');
  document.querySelectorAll('[data-tip]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      tip.textContent = el.getAttribute('data-tip');
      tip.style.opacity = '1';
      tip.style.left = Math.min(e.clientX + 12, window.innerWidth - 160) + 'px';
      tip.style.top = (e.clientY + 14) + 'px';
    });
    el.addEventListener('mouseleave', () => { tip.style.opacity = '0'; });
  });
}

// Light/dark theme, remembered in localStorage; respects the OS preference first.
function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme = saved || (prefersDark ? 'dark' : 'light');
  document.getElementById('themeBtn').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('theme', next);
  });
}

function render() {
  window.__shotReady = false;
  const base = location.hash.split('?')[0] || '#/';
  const route = ROUTES[base] || { title: 'Not found', key: '', view: missing };
  document.title = route.title;
  app.innerHTML = shell(route.key, route.view());
  window.scrollTo(0, 0);
  initTheme();
  attachTooltip();
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
render();
