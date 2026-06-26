import { $, $$, getJSON, smoothLinks, ripple } from "./utils.js";
import { renderMenu } from "./menu.js";
import { initCart } from "./cart.js";
import { initAnimations, progress, activeTopNav } from "./animations.js";
async function boot() {
  try {
    const [config, menu] = await Promise.all([
      getJSON("data/config.json"),
      getJSON("data/menu.json"),
    ]);
    applyConfig(config);
    renderGallery(config.galleryImages);
    renderMenu(menu);
    initCart(menu.items);
    smoothLinks();
    ripple();
    progress();
    activeTopNav();
    initLightbox();
    initAnimations();
  } catch (err) {
    console.error(err);
    document.body.insertAdjacentHTML(
      "afterbegin",
      '<p class="toast is-visible">CoffeeLux could not load content.</p>',
    );
  } finally {
    setTimeout(
      () => document.querySelector("[data-loader]")?.classList.add("is-hidden"),
      450,
    );
  }
}
function applyConfig(c) {
  document.documentElement.style.setProperty("--primary", c.primaryColor);
  $$("[data-cafe-name]").forEach((e) => (e.textContent = c.cafeName));
  $$("[data-logo]").forEach((e) => {
    e.src = c.logo;
  });
  $$("[data-tagline]").forEach((e) => (e.textContent = c.tagline));
  $("[data-hero-image]").src = c.heroImage;
  $("[data-address]").textContent = c.address;
  const hours = $("[data-hours]");
  hours.innerHTML = c.workingHours.map((h) => `<li>${h}</li>`).join("");
  $$("[data-phone-link]").forEach((a) => {
    a.href = c.phoneUrl;
    a.textContent = a.textContent.trim() || c.phone;
  });
  $$("[data-instagram-link]").forEach((a) => {
    a.href = c.instagramUrl;
    a.textContent = a.textContent.trim() || c.instagram;
    a.target = "_blank";
    a.rel = "noopener";
  });
  $$("[data-map-link]").forEach((a) => {
    a.href = c.googleMapsUrl;
    a.target = "_blank";
    a.rel = "noopener";
  });
  $("[data-year]").textContent = new Date().getFullYear();
}
function renderGallery(images) {
  const grid = $("[data-gallery-grid]");
  grid.innerHTML = images
    .map(
      (img, i) =>
        `<button class="gallery__item" data-lightbox-src="${img.src}" data-lightbox-alt="${img.alt}"><img src="${img.src}" alt="${img.alt}" loading="${i < 2 ? "eager" : "lazy"}" decoding="async"></button>`,
    )
    .join("");
}
function initLightbox() {
  const lb = $("[data-lightbox]"),
    img = $("[data-lightbox-img]");
  $("[data-gallery-grid]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-lightbox-src]");
    if (!b) return;
    img.src = b.dataset.lightboxSrc;
    img.alt = b.dataset.lightboxAlt;
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
  });
  $("[data-lightbox-close]").addEventListener("click", close);
  lb.addEventListener("click", (e) => {
    if (e.target === lb) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
  function close() {
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
  }
}
boot();
