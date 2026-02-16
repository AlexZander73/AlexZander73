const BLOG_FEED_URL = "https://BLOGDOMAIN/feed.xml";
const BLOG_HOME_URL = "https://BLOGDOMAIN/";
const CACHE_KEY = 'latestBlogPost';
const CACHE_TTL = 15 * 60 * 1000;

const latestContainer = document.getElementById('latest-blog');

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

const toText = (html) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent?.trim() || '';
};

const renderSkeleton = () => {
  if (!latestContainer) return;
  latestContainer.innerHTML = `
    <div class="latest-post">
      <div class="skeleton" style="width: 40%"></div>
      <div class="skeleton" style="width: 75%"></div>
      <div class="skeleton" style="width: 60%"></div>
    </div>
  `;
};

const renderLatest = (data) => {
  if (!latestContainer) return;
  latestContainer.innerHTML = `
    <div class="latest-post">
      <p class="eyebrow">Latest from the blog</p>
      <h3><a class="text-link" href="${data.link}" target="_blank" rel="noopener">${data.title}</a></h3>
      <p class="muted">${data.date}</p>
      ${data.excerpt ? `<p>${data.excerpt}</p>` : ''}
      <div class="card-actions">
        <a class="button secondary" href="${data.link}" target="_blank" rel="noopener">Read latest</a>
        <a class="button ghost" href="${BLOG_HOME_URL}" target="_blank" rel="noopener">Read the blog</a>
      </div>
    </div>
  `;
};

const renderFallback = () => {
  if (!latestContainer) return;
  latestContainer.innerHTML = `
    <div class="latest-post">
      <p class="eyebrow">Latest from the blog</p>
      <p class="muted">The feed is taking a nap. You can still visit the blog directly.</p>
      <a class="button ghost" href="${BLOG_HOME_URL}" target="_blank" rel="noopener">Visit the blog</a>
    </div>
  `;
};

const parseFeed = (xmlText) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, 'text/xml');
  const item = xml.querySelector('item') || xml.querySelector('entry');
  if (!item) return null;

  const title = item.querySelector('title')?.textContent?.trim() || 'Untitled post';

  let link = '';
  const rssLink = item.querySelector('link');
  if (rssLink) link = rssLink.textContent?.trim() || '';
  const atomLink = item.querySelector('link[rel="alternate"]') || item.querySelector('link[href]');
  if (atomLink?.getAttribute('href')) link = atomLink.getAttribute('href');

  const date = item.querySelector('pubDate')?.textContent ||
    item.querySelector('updated')?.textContent ||
    item.querySelector('published')?.textContent || '';

  const excerptRaw = item.querySelector('description')?.textContent || item.querySelector('summary')?.textContent || '';
  const excerpt = toText(excerptRaw).slice(0, 180);

  return { title, link, date: formatDate(date), excerpt };
};

const getCached = () => {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    if (Date.now() - parsed.timestamp > CACHE_TTL) return null;
    return parsed.data;
  } catch {
    return null;
  }
};

const setCached = (data) => {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
  } catch {
    // ignore
  }
};

const loadLatest = async () => {
  if (!latestContainer) return;
  const cached = getCached();
  if (cached) {
    renderLatest(cached);
    return;
  }

  renderSkeleton();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`${BLOG_FEED_URL}?v=${Date.now()}`, {
      cache: 'no-store',
      signal: controller.signal
    });
    clearTimeout(timeout);
    const text = await response.text();
    const parsed = parseFeed(text);
    if (!parsed || !parsed.link) {
      renderFallback();
      return;
    }
    setCached(parsed);
    renderLatest(parsed);
  } catch (err) {
    renderFallback();
  }
};

loadLatest();
