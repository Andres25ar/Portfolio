# MEMORY.md

Memoria persistente de la sesión. Leer al inicio de cada tarea en este repo; actualizar tras cada decisión, error o descubrimiento relevante. Mantener como índice corto: solo hechos verificados y no obvios (el detalle completo vive en el código o en `AGENTS.md`).

## Comandos y verificación

- Servir en local: `python3 -m http.server 8000` (o `npx serve`). No hay build, lint, typecheck ni tests: la verificación es cargar la página y revisar el cambio en el navegador.

## Convenciones confirmadas

- Commit messages con formato `Type: descripción` (`Add:`, `PERF:`, `refactor:`).
- Textos visibles y comentarios en español (`lang="es"`).
- Casi toda edición de contenido (proyectos, skills, certificados) es solo HTML en `index.html`.
- **Efecto de tecleo (hero h2):** implementado dividiendo el texto en spans con `visibility:hidden` — NO vaciar el h2 y teclear encima, provoca reflow (el h2 cambia de 1 a 2 líneas entre breakpoints). Cursor = clase `.cursor` movida de span en span + `::after` con `▌` y `@keyframes blink`. **Es un loop:** inicia a los 1100 ms (espera al fade-in del hero de 0.8 s), teclea ~2.6 s, pausa 7.5 s con cursor parpadeando, se ocultan los spans y repite indefinidamente (la función `startTyping` es recursiva). Respeta `prefers-reduced-motion` (loop no arranca). Si se edita el texto del h2, funciona igual (lee `textContent` al vuelo).
- **Categorías de skills:** son bloques `.skill-dropdown` duplicados a mano en `index.html` — el JS las detecta solas vía `querySelectorAll('.skill-dropdown')`, no requiere tocar `script.js`. Verificación rápida: `grep -c 'skill-dropdown"' index.html` debe coincidir con el número de botones visibles.

## Decisiones arquitectónicas

- Sitio estático sin dependencias ni toolchain a propósito: no introducir `package.json`, bundlers ni frameworks salvo petición explícita.
- Toda la lógica JS vive en un único handler `DOMContentLoaded` en `script.js` (no dividir en módulos sin necesidad).

## Historial de depuración y errores conocidos

- **Carrusel infinito:** si al agregar/quitar certificados el loop "salta", es porque los dos `.carousel-group` dejaron de ser copias exactas — la animación depende de `translateX(-50%)`. Corregir editando ambos grupos. (8 certificados × 2 grupos = 16 slides desde que se agregó certificado08.)
- **Secciones invisibles:** causado por la clase `hidden` sin que el IntersectionObserver agregue `show` (JS no ejecutado o error previo en `script.js`). Un error al inicio del handler `DOMContentLOADED` deja *toda* la página sin animaciones, menú ni formulario.
- **Favicon roto (conocido, pendiente):** el `<link rel="icon">` apunta a `assets/iconweb.svg` pero el archivo real es `assets/icon-web.svg`. Si se toca, corregir hacia el nombre real.

## Pendientes / notas abiertas

- El proyecto 6 (E-Commerce) enlaza al repo de ProductivityHabitsTlgBot (`script.js`/`index.html` línea del card) — posible copy-paste pendiente de confirmar con el dueño.
