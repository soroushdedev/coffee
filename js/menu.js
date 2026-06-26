import { $, money } from "./utils.js";
import { addToCart, changeCartQuantity, getQuantity } from "./cart.js";
let menuData;
export function renderMenu(data) {
  menuData = data;
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
    const quantityButton = e.target.closest("[data-qty-action]");
    const addButton = e.target.closest("[data-add-cart]");
    if (quantityButton || addButton) e.stopPropagation();
    if (addButton) addToCart(addButton.dataset.addCart);
    if (quantityButton) {
      changeCartQuantity(
        quantityButton.dataset.id,
        quantityButton.dataset.qtyAction === "inc" ? 1 : -1,
      );
    }
    const card = e.target.closest(".menu-card");
    if (card && !quantityButton && !addButton) toggleCard(card);
  });
  root.addEventListener("keydown", (e) => {
    if (!["Enter", " "].includes(e.key)) return;
    const card = e.target.closest(".menu-card");
    if (!card) return;
    e.preventDefault();
    toggleCard(card);
  });
  document.addEventListener("cart:updated", syncMenuQuantities);
  observeCategories();
  syncMenuQuantities();
}
function card(item) {
  return `<article class="menu-card" tabindex="0" aria-expanded="false" data-menu-card="${item.id}"><div class="menu-card__body"><h4>${item.title}</h4><div class="menu-card__meta"><span class="price">${money(item.price)}</span><span data-cart-control="${item.id}"></span></div><div class="menu-card__details"><p>${item.description}</p><span class="ingredients">${item.ingredients}</span></div></div><img src="${item.image}" alt="${item.title}" loading="lazy" decoding="async"></article>`;
}
function toggleCard(card) {
  const active = card.classList.toggle("is-active");
  card.setAttribute("aria-expanded", String(active));
}
function syncMenuQuantities() {
  if (!menuData) return;
  menuData.items.forEach((item) => {
    const control = document.querySelector(`[data-cart-control="${item.id}"]`);
    if (!control) return;
    const qty = getQuantity(item.id);
    control.innerHTML = qty
      ? `<span class="qty-control"><button data-qty-action="dec" data-id="${item.id}" aria-label="Remove one ${item.title}">−</button><span>${qty}</span><button data-qty-action="inc" data-id="${item.id}" aria-label="Add one ${item.title}">+</button></span>`
      : `<button class="btn btn--primary ripple" data-add-cart="${item.id}">Add</button>`;
  });
}
function observeCategories() {
  const links = [...document.querySelectorAll("[data-category-nav] a")];
  const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((a) => a.classList.remove("is-active"));
          const active = map.get(entry.target.id);
          active?.classList.add("is-active");
          active?.scrollIntoView({
            inline: "center",
            block: "nearest",
            behavior: "smooth",
          });
        }
      });
    },
    { rootMargin: "-35% 0px -55% 0px" },
  );
  document.querySelectorAll(".menu-category").forEach((s) => io.observe(s));
  links[0]?.classList.add("is-active");
}
