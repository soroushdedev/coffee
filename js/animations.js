import { $, $$ } from "./utils.js";
export function initAnimations() {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (window.gsap && !reduce) {
    gsap.from(
      ".hero__logo,.eyebrow,h1,.hero__tagline,.hero__actions,.contact-icons",
      { opacity: 0, y: 24, duration: 0.9, stagger: 0.08, ease: "power3.out" },
    );
    gsap.from(".section__head", {
      opacity: 0,
      y: 30,
      duration: 0.8,
      scrollTrigger: false,
    });
  }
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.animate(
            [
              { opacity: 0, transform: "translateY(24px)" },
              { opacity: 1, transform: "none" },
            ],
            {
              duration: 650,
              easing: "cubic-bezier(.22,1,.36,1)",
              fill: "both",
            },
          );
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.12 },
  );
  $$(".gallery__item,.menu-card").forEach((el) => io.observe(el));
  let y = 0;
  function follow() {
    y += (scrollY - y) * 0.08;
    const c = $("[data-cart-button]");
    if (c) c.style.transform = `translateY(${Math.sin(y / 140) * 5}px)`;
    requestAnimationFrame(follow);
  }
  follow();
}
export function progress() {
  const bar = $("[data-scroll-progress]");
  addEventListener(
    "scroll",
    () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = `${h ? (scrollY / h) * 100 : 0}%`;
    },
    { passive: true },
  );
}
export function activeTopNav() {
  const links = $$(".topbar__links a");
  const obs = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((a) =>
            a.classList.toggle("is-active", a.hash === `#${e.target.id}`),
          );
        }
      }),
    { rootMargin: "-45% 0px -45% 0px" },
  );
  ["gallery", "menu", "footer"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) obs.observe(el);
  });
}
