# CoffeeLux

CoffeeLux is a production-ready, mobile-first coffee shop website template built with semantic HTML5, modular CSS3, vanilla JavaScript, and lightweight GSAP-enhanced animations.

## Features

- Responsive premium coffee shop UI
- Config-driven cafe details from `data/config.json`
- Dynamic menu rendering from `data/menu.json`
- Gallery lightbox with lazy-loaded images
- LocalStorage-powered floating cart drawer
- Scroll progress bar and active section highlighting
- Accessible keyboard navigation and semantic markup
- No Bootstrap, Tailwind, React, jQuery, or build step required

## Structure

```text
CoffeeLux/
├── README.md
├── index.html
├── 404.html
├── css/
│   ├── variables.css
│   ├── style.css
│   └── responsive.css
├── js/
│   ├── app.js
│   ├── menu.js
│   ├── cart.js
│   ├── animations.js
│   ├── storage.js
│   └── utils.js
├── data/
│   ├── config.json
│   └── menu.json
├── assets/
│   └── images/
│       ├── gallery/
│       ├── menu/
│       ├── hero/
│       ├── icons/
│       └── logo/
└── fonts/
```

## Run Locally

Because the project loads JSON with `fetch`, serve it with a local web server:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Customization

- Update cafe content, colors, hero image, gallery images, and contact links in `data/config.json`.
- Update categories and menu products in `data/menu.json`.
- Replace SVG placeholder images in `assets/images/` with optimized WebP/JPEG files if desired, then update JSON paths.

## Performance Notes

- Images use native lazy loading and async decoding.
- JavaScript is split into ES modules.
- Animations respect `prefers-reduced-motion`.
- CSS variables centralize colors, spacing, shadows, and radii.
