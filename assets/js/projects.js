const AUTO_URL = 'data/projects.auto.json';
const FALLBACK_URL = 'data/projects.json';

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  }).format(date);
};

const fetchJson = async (url) => {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error('Fetch failed');
  return response.json();
};

const normalizeProject = (item) => {
  const topics = Array.isArray(item.topics) ? item.topics : (item.tags || []);
  return {
    title: item.title || item.name || 'Untitled',
    description: item.description || 'No description yet.',
    repo: item.github || item.html_url || '',
    demo: item.demo || item.homepage || '',
    language: item.language || '',
    updated: item.updated || item.pushed_at || '',
    topics,
    status: item.status || '',
    featured: Boolean(item.featured)
  };
};

const loadProjectsData = async () => {
  try {
    const auto = await fetchJson(AUTO_URL);
    if (Array.isArray(auto) && auto.length) return auto.map(normalizeProject);
  } catch {
    // fall through
  }
  const fallback = await fetchJson(FALLBACK_URL);
  return Array.isArray(fallback) ? fallback.map(normalizeProject) : [];
};

const projectCard = (project) => {
  const tags = [...(project.topics || [])];
  if (project.language) tags.unshift(project.language);
  return `
    <article class="card reveal" data-language="${project.language}" data-tags="${(project.topics || []).join(',')}" data-status="${project.status}">
      <div class="section-header">
        <div>
          <h3>${project.title}</h3>
          ${project.status ? `<span class="status-badge ${project.status}">${project.status.toUpperCase()}</span>` : ''}
        </div>
        ${project.updated ? `<span class="muted">Updated ${formatDate(project.updated)}</span>` : ''}
      </div>
      <p class="muted">${project.description}</p>
      <div class="tag-row">
        ${tags.map((tag) => `<span class="chip">${tag}</span>`).join('')}
      </div>
      <div class="card-actions">
        ${project.repo ? `<a class="button ghost" href="${project.repo}" target="_blank" rel="noopener">Repo</a>` : ''}
        ${project.demo ? `<a class="button secondary" href="${project.demo}" target="_blank" rel="noopener">Demo</a>` : ''}
      </div>
    </article>
  `;
};

const renderProjects = (projects, targetId, limit = null) => {
  const container = document.getElementById(targetId);
  if (!container) return;
  const list = limit ? projects.slice(0, limit) : projects;
  container.innerHTML = list.map(projectCard).join('');
  container.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
};

const applyFilters = (projects, filters) => {
  return projects.filter((project) => {
    const matchesLang = !filters.languages.length || filters.languages.includes(project.language);
    const matchesTag = !filters.tags.length || (project.topics || []).some((t) => filters.tags.includes(t));
    const matchesStatus = !filters.statuses.length || (project.status && filters.statuses.includes(project.status));
    return matchesLang && matchesTag && matchesStatus;
  });
};

const readFiltersFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    languages: params.get('lang') ? params.get('lang').split(',').filter(Boolean) : [],
    tags: params.get('tag') ? params.get('tag').split(',').filter(Boolean) : [],
    statuses: params.get('status') ? params.get('status').split(',').filter(Boolean) : []
  };
};

const writeFiltersToUrl = (filters) => {
  const params = new URLSearchParams();
  if (filters.languages.length) params.set('lang', filters.languages.join(','));
  if (filters.tags.length) params.set('tag', filters.tags.join(','));
  if (filters.statuses.length) params.set('status', filters.statuses.join(','));
  const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
  window.history.replaceState({}, '', newUrl);
};

const collectActiveFilters = (wrap, attr) => {
  return [...wrap.querySelectorAll(`.chip.is-active[${attr}]`)].map((chip) => chip.getAttribute(attr));
};

const setupFilters = (projects) => {
  const langWrap = document.getElementById('project-languages');
  const tagWrap = document.getElementById('project-tags');
  const statusWrap = document.getElementById('project-status');
  const clearBtns = document.querySelectorAll('[data-clear-filters]');
  const emptyState = document.getElementById('projects-empty');
  const listWrap = document.getElementById('projects');
  if (!langWrap || !tagWrap || !listWrap) return;

  const languages = [...new Set(projects.map((p) => p.language).filter(Boolean))].sort();
  const tags = [...new Set(projects.flatMap((p) => p.topics || []))].sort();
  const statuses = [...new Set(projects.map((p) => p.status).filter(Boolean))].sort();

  langWrap.innerHTML = languages.map((lang) => `<button class="chip" data-lang="${lang}">${lang}</button>`).join('');
  tagWrap.innerHTML = tags.map((tag) => `<button class="chip" data-tag="${tag}">${tag}</button>`).join('');
  if (statusWrap) {
    statusWrap.innerHTML = statuses.map((status) => `<button class="chip" data-status="${status}">${status.toUpperCase()}</button>`).join('');
  }

  const apply = () => {
    const filters = {
      languages: collectActiveFilters(langWrap, 'data-lang'),
      tags: collectActiveFilters(tagWrap, 'data-tag'),
      statuses: statusWrap ? collectActiveFilters(statusWrap, 'data-status') : []
    };
    const filtered = applyFilters(projects, filters);
    renderProjects(filtered, 'projects');
    writeFiltersToUrl(filters);
    if (emptyState) emptyState.style.display = filtered.length ? 'none' : 'block';
  };

  const addToggle = (wrap, attr) => {
    wrap.querySelectorAll(`[${attr}]`).forEach((chip) => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('is-active');
        apply();
      });
    });
  };

  addToggle(langWrap, 'data-lang');
  addToggle(tagWrap, 'data-tag');
  if (statusWrap) addToggle(statusWrap, 'data-status');

  clearBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.chip.is-active').forEach((chip) => chip.classList.remove('is-active'));
      apply();
    });
  });

  const fromUrl = readFiltersFromUrl();
  fromUrl.languages.forEach((value) => langWrap.querySelector(`[data-lang="${value}"]`)?.classList.add('is-active'));
  fromUrl.tags.forEach((value) => tagWrap.querySelector(`[data-tag="${value}"]`)?.classList.add('is-active'));
  if (statusWrap) fromUrl.statuses.forEach((value) => statusWrap.querySelector(`[data-status="${value}"]`)?.classList.add('is-active'));

  apply();
};

const initProjects = async () => {
  const data = await loadProjectsData();
  if (!data.length) return;

  data.sort((a, b) => (b.updated || '').localeCompare(a.updated || ''));

  const featured = data.filter((p) => p.featured);
  const featuredList = featured.length ? featured : data;

  renderProjects(featuredList, 'featured-projects', 6);
  setupFilters(data);
};

initProjects();
