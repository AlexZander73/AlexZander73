const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const setYear = () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
};

const themeToggle = () => {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;
  const stored = localStorage.getItem('theme');
  if (stored) {
    document.documentElement.setAttribute('data-theme', stored);
  } else {
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', systemDark ? 'dark' : 'light');
  }

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    const icon = toggle.querySelector('.theme-icon');
    if (icon && !prefersReducedMotion) {
      icon.style.transform = 'rotate(20deg)';
      setTimeout(() => { icon.style.transform = ''; }, 160);
    }
  });
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
