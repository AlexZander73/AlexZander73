const CATALOG_URL = "/products/catalog.json";

const fallbackProducts = [
  {
    slug: "carpentry-companion",
    title: "Carpentry Companion (AU)",
    blurb: "Offline-first carpentry study and planning app with calculators, job workflows, and export tools.",
    image: "/products/carpentry-companion/assets/hero.svg",
    url: "/products/carpentry-companion/",
    support_url: "/products/carpentry-companion/support/",
    platforms: "iPhone, iPad, Mac"
  }
];

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
    const title = product.title || product.slug;
    const blurb = product.blurb || "Product details coming soon.";
    const image = product.image || "/assets/img/og-default.svg";
    const url = product.url || `/products/${product.slug}/`;
    const supportUrl = product.support_url || `${url}support/`;
    const platforms = product.platforms ? `<p class="meta">${product.platforms}</p>` : "";
    return `
      <article class="card">
        <img class="thumb" src="${image}" alt="${title} artwork" loading="lazy" />
        <div class="body">
          <h2>${title}</h2>
          <p>${blurb}</p>
          ${platforms}
          <div class="actions">
            <a class="btn btn-primary" href="${url}">View Product</a>
            <a class="btn" href="${supportUrl}">Support</a>
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
