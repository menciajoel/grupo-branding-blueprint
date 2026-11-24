# Linkbranding — desarrollo local

Desde la raíz del repositorio:

```sh
python3 -B linkbranding/build.py
python3 -B shared/divisions/verify.py
python3 -B tools/build_site.py
python3 -m http.server 4175 --bind 127.0.0.1 --directory _site
```

Si 4175 ya está ocupado, conservar el servidor de revisión existente. La URL es `http://127.0.0.1:4175/linkbranding/`. El servidor de red del proyecto en 4174 sirve solo `_site/`.

- Contenido: `content.json`, copia trazable de COPY-P05. Cambiarlo requiere autorización editorial y actualizar la fuente aprobada; el verificador detecta diferencias.
- Imágenes: `media.json` y `assets/media/`. Sustituir los WebP en los anchos registrados en `media.json` (640, 960 y hasta 1600) por fotografías autorizadas, con sus dimensiones, encuadre, alt y procedencia. Las etiquetas conceptuales solo deben retirarse cuando el recurso deje de ser conceptual.
- Composición protegida: `design.json`, `theme.css`, `../shared/divisions/render.py`, `sections.css`.
- Movimiento protegido: `../shared/divisions/hero.js`, `sections.js`. La versión aprobada de Media Branding permanece inmutable. Las fuentes, vendor GSAP, iconos y galería se consumen en lectura desde las rutas existentes.
- Regenerar ambas divisiones después de cambiar un archivo compartido. `tools/build_site.py` valida que los HTML registrados sean reproducibles.
- Para probar el prefijo de Pages sin publicar: `python3 -B tools/build_site.py --base-path /grupo-branding-blueprint`. Volver a ejecutar sin prefijo antes de revisar en el servidor LAN en la raíz.

La publicación general del prototipo fue autorizada el 18-11-2026. Ver el README raíz para colaboración y despliegue. Los informes y capturas de QA permanecen locales, excluidos del repositorio y del paquete estático. No se implementa CMS ni un stack definitivo; los recursos conceptuales de `media.json` deben revisarse antes del sitio comercial definitivo.

## Sustitución fotográfica local · 24-11-2026

Los cinco espacios fotográficos usan ahora recursos del cliente recuperados de Canva: R026 (hero y su transformación), R043 (diseño de activaciones), R018 (eventos), R031 (activaciones/staffing/street marketing) y R054 (cierre). `design.json` selecciona los recursos sin cambiar las composiciones; `media.json` registra procedencia, página, alt, variantes WebP y encuadres. Los originales exactos y sus hashes están en `source-images/canva/` y no se incluyen en el paquete público.

La reserva `frameAspectRatio` de R031 mantiene la altura del bloque compartido al sustituir una toma horizontal por otra vertical; `object-fit: cover` conserva las proporciones de la fotografía. Los tamaños responsive del hero consideran la superficie completa que utiliza su máscara, sin alterar GSAP. Los recursos conceptuales anteriores se conservan para recuperación y ya no aparecen en esta página. Revisión visual local pendiente de aprobación; esta sustitución no se ha publicado.

## Refinamiento fotográfico posterior · 24-11-2026

La revisión estética conserva R026/R043 y sustituye R018 por R014 (eventos), R031 por R027 (activaciones/staffing) y R054 por R064 (cierre, caso UNO GAMING de la página 19). La procedencia se confirma por el tramo original de Linkbranding; las fotografías de stands de ese tramo no se atribuyen automáticamente a Media Printing. `processedDimensions`, `processedOriginal` y `postproduction` registran los maestros y las recetas convencionales. Los originales y recursos de la sustitución anterior permanecen recuperables. `shared/divisions/sections.css` funde el borde con una máscara alfa y prefijo WebKit; los controladores de movimiento no cambian. Aprobación visual de esta revisión pendiente; sin publicación.

## Publicación autorizada · 24-11-2026

La selección y los ajustes locales anteriores quedan aprobados para integrar en `main` y publicar el prototipo. El estado vigente, las fuentes versionadas, el QA y los pendientes confirmados se documentan en [publicación fotográfica](../docs/publicacion-fotografica-2026-11-24.md). Los informes locales previos registran estados históricos, no una restricción vigente de publicación.
