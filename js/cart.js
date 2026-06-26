import { storage } from "./storage.js";
import { $, money, toast } from "./utils.js";
let items = [],
  products = [];
const save = () => storage.set("cart", items);
const count = () => items.reduce((s, i) => s + i.qty, 0);
export function initCart(allProducts) {
  products = allProducts;
  items = storage.get("cart", []);
  render();
  $("[data-cart-button]").addEventListener("click", openCart);
  $("[data-cart-close]").addEventListener("click", closeCart);
  $("[data-cart-drawer]").addEventListener("click", (e) => {
    if (e.target.matches("[data-cart-drawer]")) closeCart();
    const action = e.target.dataset.action,
      id = e.target.dataset.id;
    if (action) updateQty(id, action === "inc" ? 1 : -1);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCart();
  });
}
export function addToCart(id) {
  const found = items.find((i) => i.id === id);
  found ? found.qty++ : items.push({ id, qty: 1 });
  save();
  render();
  toast("Added to your CoffeeLux cart");
}
function updateQty(id, delta) {
  const item = items.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) items = items.filter((i) => i.id !== id);
  save();
  render();
}
function render() {
  const badge = $("[data-cart-count]"),
    box = $("[data-cart-items]"),
    subtotal = $("[data-cart-subtotal]");
  if (!badge || !box) return;
  badge.textContent = count();
  let total = 0;
  box.innerHTML = items.length
    ? ""
    : "<p>Your cart is waiting for something delicious.</p>";
  items.forEach((line) => {
    const p = products.find((x) => x.id === line.id);
    if (!p) return;
    total += p.price * line.qty;
    box.insertAdjacentHTML(
      "beforeend",
      `<article class="cart-line"><img src="${p.image}" alt="${p.title}" loading="lazy"><div><strong>${p.title}</strong><small>${money(p.price)}</small><div class="qty"><button data-action="dec" data-id="${p.id}" aria-label="Decrease ${p.title}">−</button><span>${line.qty}</span><button data-action="inc" data-id="${p.id}" aria-label="Increase ${p.title}">+</button></div></div><strong>${money(p.price * line.qty)}</strong></article>`,
    );
  });
  subtotal.textContent = money(total);
}
function openCart() {
  $("[data-cart-drawer]").classList.add("is-open");
  $("[data-cart-drawer]").setAttribute("aria-hidden", "false");
}
function closeCart() {
  $("[data-cart-drawer]").classList.remove("is-open");
  $("[data-cart-drawer]").setAttribute("aria-hidden", "true");
}
