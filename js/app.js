import { $, $$, getJSON, smoothLinks, ripple } from "./utils.js";
import { renderMenu } from "./menu.js";
import { initCart } from "./cart.js";
import { initAnimations, progress, activeTopNav } from "./animations.js";
const icons = {
  phone:
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.11 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.32 1.77.59 2.61a2 2 0 0 1-.45 2.11L8 9.69a16 16 0 0 0 6.31 6.31l1.25-1.25a2 2 0 0 1 2.11-.45c.84.27 1.71.47 2.61.59A2 2 0 0 1 22 16.92Z"/></svg>',
  instagram:
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z"/><path d="M17.5 6.5h.01"/></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 10c0 4.99-5.53 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.53 20.19 4 14.99 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
};
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
    a.innerHTML = a.closest(".contact-icons") ? icons.phone : c.phone;
  });
  $$("[data-instagram-link]").forEach((a) => {
    a.href = c.instagramUrl;
    a.innerHTML = a.closest(".contact-icons") ? icons.instagram : c.instagram;
    a.target = "_blank";
    a.rel = "noopener";
  });
  $$("[data-map-link]").forEach((a) => {
    a.href = c.googleMapsUrl;
    if (a.closest(".contact-icons")) a.innerHTML = icons.map;
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
        `<button class="gallery__item" data-gallery-index="${i}" data-lightbox-src="${img.src}" data-lightbox-alt="${img.alt}" data-dominant="${img.dominantColor || "#d89a43"}"><img src="${img.src}" alt="${img.alt}" loading="${i < 2 ? "eager" : "lazy"}" decoding="async" crossorigin="anonymous"></button>`,
    )
    .join("");
}
function initLightbox() {
  const lb = $("[data-lightbox]"),
    img = $("[data-lightbox-img]"),
    ambient = $("[data-gallery-ambient]");
  $("[data-gallery-grid]").addEventListener("click", async (e) => {
    const button = e.target.closest("[data-lightbox-src]");
    if (!button) return;
    const featured = $(".gallery__item:nth-child(4)");
    if (featured && button !== featured) swapGalleryImages(button, featured);
    const color = await dominantColor(button);
    glow(ambient, color);
  });
  $("[data-gallery-grid]").addEventListener("dblclick", (e) => {
    const button = e.target.closest("[data-lightbox-src]");
    if (!button) return;
    img.src = button.dataset.lightboxSrc;
    img.alt = button.dataset.lightboxAlt;
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
function swapGalleryImages(a, b) {
  const ai = a.querySelector("img"),
    bi = b.querySelector("img"),
    aData = {
      src: a.dataset.lightboxSrc,
      alt: a.dataset.lightboxAlt,
      color: a.dataset.dominant,
    },
    bData = {
      src: b.dataset.lightboxSrc,
      alt: b.dataset.lightboxAlt,
      color: b.dataset.dominant,
    };
  const animate = window.gsap
    ? (el) =>
        gsap.fromTo(
          el,
          { opacity: 0.45, scale: 1.025 },
          { opacity: 1, scale: 1, duration: 0.45, ease: "power2.out" },
        )
    : () => {};
  Object.assign(a.dataset, {
    lightboxSrc: bData.src,
    lightboxAlt: bData.alt,
    dominant: bData.color,
  });
  Object.assign(b.dataset, {
    lightboxSrc: aData.src,
    lightboxAlt: aData.alt,
    dominant: aData.color,
  });
  ai.src = bData.src;
  ai.alt = bData.alt;
  bi.src = aData.src;
  bi.alt = aData.alt;
  animate(ai);
  animate(bi);
}
async function dominantColor(button) {
  const image = button.querySelector("img");
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    canvas.width = canvas.height = 1;
    ctx.drawImage(image, 0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return `rgb(${r}, ${g}, ${b})`;
  } catch {
    return button.dataset.dominant || "#d89a43";
  }
}
function glow(el, color) {
  if (!el) return;
  el.style.background = `radial-gradient(circle, ${color}33, transparent 62%)`;
  if (window.gsap)
    gsap.fromTo(
      el,
      { opacity: 0.34, scale: 0.92 },
      { opacity: 0, scale: 1.08, duration: 2.2, ease: "power2.out" },
    );
}
boot();
