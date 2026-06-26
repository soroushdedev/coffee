import { $, $$ } from "./utils.js";
export function initAnimations() {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  runHeroIntro(reduce);
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.animate(
            [
              { opacity: 0, transform: "translateY(18px)" },
              { opacity: 1, transform: "none" },
            ],
            {
              duration: 700,
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
function runHeroIntro(reduce) {
  const bg = $(".hero__bg"),
    overlay = $(".hero__overlay"),
    title = $(".hero h1"),
    tagline = $(".hero__tagline"),
    buttons = $$(".hero__actions .btn"),
    icons = $$(".contact-icons a"),
    scroll = $(".scroll-indicator"),
    eyebrow = $(".hero .eyebrow");
  if (reduce || !window.gsap) {
    [overlay, eyebrow, title, tagline, scroll, ...buttons, ...icons].forEach(
      (el) => {
        if (el) el.style.opacity = 1;
      },
    );
    return;
  }
  gsap.set(bg, { scale: 1 });
  gsap.set(overlay, { opacity: 0 });
  gsap.set([eyebrow, title, tagline, scroll, ...buttons, ...icons], {
    opacity: 0,
  });
  const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
  tl.to(bg, { scale: 1.075, duration: 0.6 }, 0.3)
    .to(overlay, { opacity: 1, duration: 0.6 }, 0.3)
    .fromTo(eyebrow, { y: 8 }, { y: 0, opacity: 1, duration: 0.5 }, 0.9)
    .fromTo(title, { y: 8 }, { y: 0, opacity: 1, duration: 0.5 }, 0.96)
    .fromTo(tagline, { y: 8 }, { y: 0, opacity: 1, duration: 0.5 }, 1.02)
    .fromTo(
      buttons,
      { y: 12 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.06 },
      1.08,
    )
    .fromTo(
      icons,
      { x: 12 },
      { x: 0, opacity: 1, duration: 0.45, stagger: 0.06 },
      1.14,
    )
    .to(scroll, { opacity: 1, duration: 0.35 }, 1.18);
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
