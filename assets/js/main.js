const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const THEME_KEY = 'theme';
const PALETTE_KEY = 'palette';
const DEFAULT_PALETTE = 'graphite';
const PALETTE_OPTIONS = [
  { value: 'earthy', label: 'Earthy Luxe' },
  { value: 'coastal', label: 'Coastal Air' },
  { value: 'graphite', label: 'Graphite Quiet' }
];

const storage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // ignore storage write failures
    }
  }
};

const setYear = () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
};

const isValidTheme = (value) => value === 'light' || value === 'dark';
const isValidPalette = (value) => PALETTE_OPTIONS.some((item) => item.value === value);

const getInitialTheme = () => {
  const storedTheme = storage.get(THEME_KEY);
  if (isValidTheme(storedTheme)) return storedTheme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getInitialPalette = () => {
  const storedPalette = storage.get(PALETTE_KEY);
  if (isValidPalette(storedPalette)) return storedPalette;
  return DEFAULT_PALETTE;
};

const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
};

const applyPalette = (palette) => {
  document.documentElement.setAttribute('data-palette', palette);
};

const updateThemeToggleLabel = (toggle, theme) => {
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  toggle.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
  toggle.setAttribute('title', `Switch to ${nextTheme} mode`);
};

const ensureThemeControls = (toggle, currentPalette) => {
  const nav = toggle.closest('.nav') || toggle.parentElement;
  if (!nav) return { select: null };

  let controls = nav.querySelector('.theme-controls');
  if (!controls) {
    controls = document.createElement('div');
    controls.className = 'theme-controls';
    nav.insertBefore(controls, toggle);
    controls.appendChild(toggle);
  } else if (!controls.contains(toggle)) {
    controls.appendChild(toggle);
  }

  let select = controls.querySelector('#theme-palette');
  if (!select) {
    const label = document.createElement('label');
    label.className = 'sr-only';
    label.setAttribute('for', 'theme-palette');
    label.textContent = 'Color palette';

    select = document.createElement('select');
    select.id = 'theme-palette';
    select.className = 'theme-select';
    select.setAttribute('aria-label', 'Color palette');

    PALETTE_OPTIONS.forEach((option) => {
      const optionEl = document.createElement('option');
      optionEl.value = option.value;
      optionEl.textContent = option.label;
      select.appendChild(optionEl);
    });

    controls.appendChild(label);
    controls.appendChild(select);
  }

  select.value = currentPalette;
  return { select };
};

const themeToggle = () => {
  const toggle = document.getElementById('theme-toggle');
  const theme = getInitialTheme();
  const palette = getInitialPalette();

  applyTheme(theme);
  applyPalette(palette);

  if (!toggle) return;

  updateThemeToggleLabel(toggle, theme);
  const { select } = ensureThemeControls(toggle, palette);

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    storage.set(THEME_KEY, next);
    updateThemeToggleLabel(toggle, next);

    const icon = toggle.querySelector('.theme-icon');
    if (icon && !prefersReducedMotion) {
      icon.style.transform = 'rotate(20deg)';
      setTimeout(() => {
        icon.style.transform = '';
      }, 160);
    }
  });

  if (select) {
    select.addEventListener('change', () => {
      const nextPalette = isValidPalette(select.value) ? select.value : DEFAULT_PALETTE;
      applyPalette(nextPalette);
      storage.set(PALETTE_KEY, nextPalette);
    });
  }
};

const addLoadingBar = () => {
  if (prefersReducedMotion) return null;
  let bar = document.querySelector('.loading-bar');
  if (bar) return bar;
  bar = document.createElement('div');
  bar.className = 'loading-bar';
  document.body.appendChild(bar);
  return bar;
};

const pageTransitions = () => {
  if (prefersReducedMotion) return;
  document.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    const isExternal = link.origin && link.origin !== window.location.origin;
    const isBlank = link.target === '_blank';
    const isHash = href.startsWith('#');
    if (isExternal || isBlank || isHash) return;
    event.preventDefault();
    document.body.classList.add('fade-out');
    const bar = addLoadingBar();
    if (bar) bar.classList.add('is-active');
    setTimeout(() => {
      window.location.href = href;
    }, 190);
  });
};

const revealOnScroll = () => {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  if (prefersReducedMotion) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach((item) => observer.observe(item));
};

setYear();
themeToggle();
pageTransitions();
revealOnScroll();
