export const $ = (s, c = document) => c.querySelector(s);
export const $$ = (s, c = document) => [...c.querySelectorAll(s)];
export const money = (v) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    v,
  );
export async function getJSON(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error(`Unable to load ${path}`);
  return r.json();
}
export function smoothLinks() {
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const el = $(a.getAttribute("href"));
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}
export function ripple() {
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".ripple");
    if (!b) return;
    const r = b.getBoundingClientRect(),
      s = Math.max(r.width, r.height),
      c = document.createElement("span");
    c.className = "ripple-circle";
    c.style.width = c.style.height = `${s}px`;
    c.style.left = `${e.clientX - r.left - s / 2}px`;
    c.style.top = `${e.clientY - r.top - s / 2}px`;
    b.append(c);
    setTimeout(() => c.remove(), 700);
  });
}
export function toast(msg) {
  const t = $("[data-toast]");
  t.textContent = msg;
  t.classList.add("is-visible");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove("is-visible"), 2200);
}
