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

const projectCard = (project) => `
  <article class="card reveal" data-status="${project.status}" data-tags="${project.tags.join(',')}">
    <div class="section-header">
      <h3>${project.title}</h3>
      <span class="status-badge ${project.status}">${project.status.toUpperCase()}</span>
    </div>
    <p class="muted">${project.description}</p>
    <div class="tag-row">${project.tags.map((tag) => `<span class="chip">${tag}</span>`).join(' ')}</div>
    <div class="card-actions">
      ${project.github ? `<a class="button ghost" href="${project.github}" target="_blank" rel="noopener">GitHub</a>` : ''}
      ${project.demo ? `<a class="button ghost" href="${project.demo}" target="_blank" rel="noopener">Demo</a>` : ''}
      ${project.writeup ? `<a class="button ghost" href="${project.writeup}" target="_blank" rel="noopener">Write-up</a>` : ''}
    </div>
  </article>
`;

const loadProjects = async () => {
  const featured = document.getElementById('featured-projects');
  const grid = document.getElementById('projects');
  if (!featured && !grid) return;

  try {
    const response = await fetch('/data/projects.json', { cache: 'no-store' });
    const data = await response.json();
    if (featured) {
      const items = data.filter((p) => p.featured).slice(0, 3);
      featured.innerHTML = items.map(projectCard).join('');
    }
    if (grid) {
      grid.innerHTML = data.map(projectCard).join('');
      buildFilters(data);
    }
  } catch (err) {
    if (featured) featured.innerHTML = '<p class="muted">Projects are loading. Try again later.</p>';
  }
};

const buildFilters = (projects) => {
  const tagWrap = document.getElementById('project-tags');
  const statusWrap = document.getElementById('project-status');
  const clearBtns = document.querySelectorAll('[data-clear-filters]');
  if (!tagWrap || !statusWrap) return;

  const tags = new Set();
  projects.forEach((project) => project.tags.forEach((tag) => tags.add(tag)));
  tagWrap.innerHTML = [...tags]
    .sort()
    .map((tag) => `<button class="chip" data-tag="${tag}">${tag}</button>`)
    .join('');

  const state = readFiltersFromUrl();
  applyFilterState(state);

  const updateFilters = () => {
    const activeStatus = [...statusWrap.querySelectorAll('.chip.is-active')].map((el) => el.dataset.status);
    const activeTags = [...tagWrap.querySelectorAll('.chip.is-active')].map((el) => el.dataset.tag);
    filterProjects(activeStatus, activeTags);
    writeFiltersToUrl(activeStatus, activeTags);
    updateEmptyState();
  };

  statusWrap.querySelectorAll('[data-status]').forEach((chip) => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('is-active');
      updateFilters();
    });
  });

  tagWrap.querySelectorAll('[data-tag]').forEach((chip) => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('is-active');
      updateFilters();
    });
  });

  clearBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      statusWrap.querySelectorAll('.chip').forEach((chip) => chip.classList.remove('is-active'));
      tagWrap.querySelectorAll('.chip').forEach((chip) => chip.classList.remove('is-active'));
      updateFilters();
    });
  });

  updateFilters();
};

const filterProjects = (statuses, tags) => {
  const cards = document.querySelectorAll('#projects .card');
  cards.forEach((card) => {
    const cardStatus = card.dataset.status;
    const cardTags = card.dataset.tags.split(',');
    const matchesStatus = statuses.length === 0 || statuses.includes(cardStatus);
    const matchesTag = tags.length === 0 || tags.some((tag) => cardTags.includes(tag));
    card.style.display = matchesStatus && matchesTag ? 'block' : 'none';
  });
};

const readFiltersFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const status = params.get('status');
  const tags = params.get('tag');
  return {
    status: status ? status.split(',').filter(Boolean) : [],
    tags: tags ? tags.split(',').filter(Boolean) : []
  };
};

const writeFiltersToUrl = (statuses, tags) => {
  const params = new URLSearchParams();
  if (statuses.length) params.set('status', statuses.join(','));
  if (tags.length) params.set('tag', tags.join(','));
  const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
  window.history.replaceState({}, '', newUrl);
};

const applyFilterState = (state) => {
  const tagWrap = document.getElementById('project-tags');
  const statusWrap = document.getElementById('project-status');
  if (!tagWrap || !statusWrap) return;

  state.status.forEach((status) => {
    const chip = statusWrap.querySelector(`[data-status="${status}"]`);
    if (chip) chip.classList.add('is-active');
  });

  state.tags.forEach((tag) => {
    const chip = tagWrap.querySelector(`[data-tag="${tag}"]`);
    if (chip) chip.classList.add('is-active');
  });
};

const updateEmptyState = () => {
  const cards = [...document.querySelectorAll('#projects .card')];
  const empty = document.getElementById('projects-empty');
  if (!empty) return;
  const visible = cards.some((card) => card.style.display !== 'none');
  empty.style.display = visible ? 'none' : 'block';
};

setYear();
themeToggle();
pageTransitions();
revealOnScroll();
loadProjects();
