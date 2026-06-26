import { $, money } from "./utils.js";
import { addToCart } from "./cart.js";
export function renderMenu(data) {
  const nav = $("[data-category-nav]"),
    root = $("[data-menu-content]");
  nav.innerHTML = "";
  root.innerHTML = "";
  data.categories.forEach((cat) => {
    nav.insertAdjacentHTML("beforeend", `<a href="#${cat.id}">${cat.name}</a>`);
    const items = data.items.filter((i) => i.category === cat.id);
    root.insertAdjacentHTML(
      "beforeend",
      `<section class="menu-category" id="${cat.id}" aria-labelledby="${cat.id}-title"><h3 id="${cat.id}-title">${cat.name}</h3><div class="menu-grid">${items.map((item) => card(item)).join("")}</div></section>`,
    );
  });
  root.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add-cart]");
    if (btn) addToCart(btn.dataset.addCart);
  });
  observeCategories();
}
function card(item) {
  return `<article class="menu-card"><img src="${item.image}" alt="${item.title}" loading="lazy" decoding="async"><div class="menu-card__body"><h4>${item.title}</h4><p>${item.description}</p><div class="menu-card__meta"><span class="price">${money(item.price)}</span><button class="btn btn--primary ripple" data-add-cart="${item.id}">Add to Cart</button></div></div></article>`;
}
function observeCategories() {
  const links = [...document.querySelectorAll("[data-category-nav] a")];
  const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((a) => a.classList.remove("is-active"));
          map.get(entry.target.id)?.classList.add("is-active");
        }
      });
    },
    { rootMargin: "-35% 0px -55% 0px" },
  );
  document.querySelectorAll(".menu-category").forEach((s) => io.observe(s));
  links[0]?.classList.add("is-active");
}
