# AGENTS.md

**Al inicio de cada tarea:** leer `MEMORY.md` — contiene preferencias, decisiones, errores conocidos y pendientes que deben aplicarse. Actualizarlo cuando se descubra algo nuevo (bug, convención, decisión).

Personal portfolio site (Andrés Arancibia). Plain static site: `index.html` + `style.css` + `script.js` + `assets/`. No package manager, no build step, no tests, no CI, no framework.

## Run locally

Any static server works, e.g.:

```sh
python3 -m http.server 8000
# or: npx serve
```

Open `http://localhost:8000`. Verify changes by loading the page — there is nothing to compile or test.

## Structure

- All content, markup, and section IDs (`#inicio`, `#sobre-mi`, `#proyectos`, `#contacto`) live in `index.html`. Most edits (text, projects, skills, certificates) are HTML-only.
- `script.js` runs everything inside a single `DOMContentLoaded` handler: mobile menu, scroll-reveal, certificate carousel + modal, skill dropdowns, and the contact form.
- `assets/` holds images, the CV PDF (`assets/CVAnd26DevUnsa.pdf`), and per-project media under `assets/projects/project-NN/`.

## Non-obvious conventions

- **Infinite carousel requires duplicates.** `.carousel-track` holds two identical `.carousel-group` blocks; the CSS animates to `translateX(-50%)`, relying on them being exact copies. If you add/remove a certificate image, edit *both* groups or the loop visibly jumps. Modal nav indexes over *all* `.slide img`, so duplicates are included.
- **Scroll-reveal:** sections need the `hidden` class in HTML; JS adds `show` via IntersectionObserver. A new section missing `hidden` appears immediately (fine), but `hidden` without JS running leaves it invisible — if you test with JS disabled or broken, sections won't show.
- **Contact form** sends via EmailJS: public key is initialized inline at the bottom of `index.html`, and service/template IDs are hardcoded in `script.js` (`emailjs.sendForm(...)`). Swapping accounts means editing both files.
- **Asset filenames** are literal and some contain spaces (e.g. `Captura de pantalla_20260924_115232.png`); keep references byte-for-byte. Note the favicon inconsistency: `assets/icon-web.svg` exists, but the `<link rel="icon">` points to `assets/iconweb.svg` (broken) — fix in the direction of the real file name if touched.
- UI copy and code comments are in **Spanish** (`lang="es"`). Match that when editing visible text or comments.

## Git

- Commit messages follow `Type: description` (`Add:`, `PERF:`, `refactor:`). Remote is GitHub (`Andres25ar/Portfolio`).
