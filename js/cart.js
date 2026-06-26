import { storage } from "./storage.js";
import { $, money, toast } from "./utils.js";
let items = [],
  products = [];
const save = () => storage.set("cart", items);
const count = () => items.reduce((s, i) => s + i.qty, 0);
const emit = () => document.dispatchEvent(new CustomEvent("cart:updated"));
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
export function getQuantity(id) {
  return items.find((i) => i.id === id)?.qty || 0;
}
export function addToCart(id) {
  updateQty(id, 1, true);
}
export function changeCartQuantity(id, delta) {
  updateQty(id, delta, false);
}
function updateQty(id, delta, notify = false) {
  const found = items.find((i) => i.id === id);
  if (found) found.qty += delta;
  else if (delta > 0) items.push({ id, qty: delta });
  items = items.filter((i) => i.qty > 0);
  save();
  render();
  emit();
  if (notify && delta > 0) toast("Added to your CoffeeLux cart");
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
