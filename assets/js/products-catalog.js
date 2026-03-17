const detectSitePrefix = () => {
  const marker = "/products/";
  const pathname = window.location.pathname;
  const index = pathname.indexOf(marker);
  if (index < 0) return "";
  return pathname.slice(0, index);
};

const SITE_PREFIX = detectSitePrefix();

const prefixRootPath = (value) => {
  if (!value) return value;
  if (value.startsWith("/")) {
    return `${SITE_PREFIX}${value}`;
  }
  return value;
};

const normalizeUrl = (value, fallback) => {
  const url = value || fallback;
  if (!url) return "";
  if (/^(https?:)?\/\//i.test(url) || url.startsWith("mailto:") || url.startsWith("tel:") || url.startsWith("#")) {
    return url;
  }
  return prefixRootPath(url);
};

const CATALOG_URL = normalizeUrl("/products/catalog.json", "./catalog.json");

const fallbackProducts = [
  {
    slug: "aistoryteller",
    title: "AIStoryTeller | Local story desk",
    blurb: "A local browser-based story workbench that keeps scenes, world state, voice, and visual prompting in one prototype surface.",
    image: "/products/aistoryteller/assets/aistoryteller-preview.svg",
    url: "/products/aistoryteller/",
    support_url: "/support/aistoryteller/",
    platforms: "Browser UI for a local Python runtime; macOS is explicitly documented."
  },
  {
    slug: "barbell-easy-calculator",
    title: "Barbell Easy Calculator | Symmetric Plate Loading",
    blurb: "A mobile-first barbell utility that computes symmetric plate loading with exact and nearest options.",
    image: "/products/barbell-easy-calculator/assets/loadboard.svg",
    url: "/products/barbell-easy-calculator/",
    support_url: "/support/barbell-easy-calculator/",
    platforms: "iOS and Android"
  },
  {
    slug: "carpentry-companion",
    title: "Carpentry Companion (AU)",
    blurb: "Offline-first carpentry calculators, lessons, jobs, and reference workflows for Australian tradespeople.",
    image: "/products/carpentry-companion/assets/screenshots/iphone/iphone-01.png",
    url: "/products/carpentry-companion/",
    support_url: "/products/carpentry-companion/support/",
    platforms: "iPhone, iPad, Mac"
  },
  {
    slug: "daily-journal",
    title: "Daily Journal | Local-first guided journaling",
    blurb: "A local-first guided journal with prompts, moods, calendar recall, and JSON backup.",
    image: "/products/daily-journal/assets/daily-journal-preview.svg",
    url: "/products/daily-journal/",
    support_url: "/support/daily-journal/",
    platforms: "Web / PWA / iOS wrapper / Android wrapper"
  },
  {
    slug: "fitnesscoach",
    title: "FitnessCoach: Deterministic Training and Recovery Surface",
    blurb: "A safety-first training planner that adapts workouts with deterministic rules instead of generated advice.",
    image: "/products/fitnesscoach/assets/fitnesscoach-preview.png",
    url: "/products/fitnesscoach/",
    support_url: "/support/fitnesscoach/",
    platforms: "iPhone-first via Capacitor, iPad adaptive layouts, Android-ready shared codebase"
  },
  {
    slug: "horoscope-app",
    title: "Horoscope App",
    blurb: "A calm horoscope reader built for short daily check-ins, themed moods, and native-ready packaging.",
    image: "/products/horoscope-app/assets/catalog-poster.svg",
    url: "/products/horoscope-app/",
    support_url: "/support/horoscope-app/",
    platforms: "Web, iOS shell, Android shell"
  },
  {
    slug: "hydrate",
    title: "Hydrate | Bottle-first water tracking",
    blurb: "A bottle-first hydration tracker with local history, streaks, and collectible color palettes.",
    image: "/products/hydrate/assets/hydrate-catalog.svg",
    url: "/products/hydrate/",
    support_url: "/support/hydrate/",
    platforms: "Web PWA, iOS developer build"
  },
  {
    slug: "launchpack-web-studio",
    title: "LaunchPack Web Studio",
    blurb: "An async launch desk for productized website work, with intake, templates, and handover in one repo.",
    image: "/products/launchpack-web-studio/assets/catalog-cover.svg",
    url: "/products/launchpack-web-studio/",
    support_url: "/support/launchpack-web-studio/",
    platforms: "Web"
  },
  {
    slug: "listen-library",
    title: "Listen Library",
    blurb: "A premium digital library system that blends storefront discovery with structured personal collections.",
    image: "/products/listen-library/assets/icon.png",
    url: "/products/listen-library/",
    support_url: "/support/listen-library/",
    platforms: "Web, iOS, Android"
  },
  {
    slug: "social-post-helper",
    title: "Social Post Helper | Metadata-first social drafting",
    blurb: "A local-first web app that turns media metadata and manual context into editable social drafts without AI.",
    image: "/products/social-post-helper/assets/social-post-helper-sheet.svg",
    url: "/products/social-post-helper/",
    support_url: "/support/social-post-helper/",
    platforms: "Web"
  },
  {
    slug: "tuxborn-wiki",
    title: "Tuxborn Wiki | Field Atlas Export",
    blurb: "A maintained navigation layer for installing, understanding, and completing content in the Tuxborn modpack.",
    image: "/products/tuxborn-wiki/assets/tuxborn-atlas-preview.svg",
    url: "/products/tuxborn-wiki/",
    support_url: "/support/tuxborn-wiki/",
    platforms: "Web reference"
  },
  {
    slug: "word-search-atlas",
    title: "Word Search Atlas",
    blurb: "A travel-themed word search built around globe routes, local progress, and quiet offline play.",
    image: "/products/word-search-atlas/assets/atlas-preview.svg",
    url: "/products/word-search-atlas/",
    support_url: "/support/word-search-atlas/",
    platforms: "Web, iPhone, iPad"
  }
];

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

const loadProducts = async () => {
  try {
    const response = await fetch(`${CATALOG_URL}?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error("Catalog fetch failed");
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) return fallbackProducts;
    return data;
  } catch {
    return fallbackProducts;
  }
};

const renderProducts = (products) => {
  const grid = document.getElementById("products-grid");
  const empty = document.getElementById("products-empty");
  if (!grid || !empty) return;

  if (!products.length) {
    empty.hidden = false;
    return;
  }

  empty.hidden = true;
  grid.innerHTML = products.map((product) => {
    const title = escapeHtml(product.title || product.slug || "Product");
    const blurb = escapeHtml(product.blurb || "Product details coming soon.");
    const image = normalizeUrl(product.image, "/assets/img/og-default.svg");
    const url = normalizeUrl(product.url, `/products/${product.slug}/`);
    const supportUrl = normalizeUrl(product.support_url, `${url}support/`);

    let platformsText = "";
    if (Array.isArray(product.platforms)) {
      platformsText = product.platforms.join(", ");
    } else if (typeof product.platforms === "string") {
      platformsText = product.platforms;
    }

    const platforms = platformsText ? `<p class="meta">${escapeHtml(platformsText)}</p>` : "";
    const supportButton = supportUrl ? `<a class="btn" href="${supportUrl}">Support</a>` : "";

    return `
      <article class="card">
        <img class="thumb" src="${image}" alt="${title} artwork" loading="lazy" />
        <div class="body">
          <h2>${title}</h2>
          <p>${blurb}</p>
          ${platforms}
          <div class="actions">
            <a class="btn btn-primary" href="${url}">View Product</a>
            ${supportButton}
          </div>
        </div>
      </article>
    `;
  }).join("");
};

const initProductsCatalog = async () => {
  const products = await loadProducts();
  renderProducts(products);
};

initProductsCatalog();
