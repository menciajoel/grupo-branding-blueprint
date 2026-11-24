# Media Printing — desarrollo local

Desde la raíz del repositorio:

```sh
python3 -B media-print/build.py
python3 -B shared/divisions/verify.py
python3 -B tools/build_site.py
python3 -m http.server 4175 --bind 127.0.0.1 --directory _site
```

Si 4175 ya está ocupado, conservar el servidor de revisión existente. La URL es `http://127.0.0.1:4175/media-print/`. El servidor de red del proyecto en 4174 sirve solo `_site/`.

- Contenido: `content.json`, copia trazable de COPY-P06. Cambiarlo requiere autorización editorial y actualizar la fuente aprobada; el verificador detecta diferencias.
- Imágenes: `media.json` y `assets/media/`. Sustituir los WebP en los anchos registrados en `media.json` (640, 960 y hasta 1600) por fotografías autorizadas, con sus dimensiones, encuadre, alt y procedencia. Las etiquetas conceptuales solo deben retirarse cuando el recurso deje de ser conceptual.
- Composición protegida: `design.json`, `theme.css`, `../shared/divisions/render.py`, `sections.css`.
- Movimiento protegido: `../shared/divisions/hero.js`, `sections.js`. La versión aprobada de Media Branding permanece inmutable. Las fuentes, vendor GSAP, iconos y galería se consumen en lectura desde las rutas existentes.
- Regenerar ambas divisiones después de cambiar un archivo compartido. `tools/build_site.py` valida que los HTML registrados sean reproducibles.
- Para probar el prefijo de Pages sin publicar: `python3 -B tools/build_site.py --base-path /grupo-branding-blueprint`. Volver a ejecutar sin prefijo antes de revisar en el servidor LAN en la raíz.

La publicación general del prototipo fue autorizada el 18-11-2026. Ver el README raíz para colaboración y despliegue. Los informes y capturas de QA permanecen locales, excluidos del repositorio y del paquete estático. No se implementa CMS ni un stack definitivo; los recursos conceptuales de `media.json` deben revisarse antes del sitio comercial definitivo.

## Sustitución fotográfica local · 24-11-2026

Cinco espacios usan ahora fotografías del cliente del tramo de Media Printing en Canva: R102 (hero y su transformación), R108 (espacios y exhibición), R106 (branding/ambientación de la galería), R100 (desarrollos a medida de la misma galería) y R105 (cierre). `media.json` conserva procedencia, página, alt, tamaños y encuadre; `projects.json` conserva los tres elementos y sus etiquetas aprobadas. Los originales exactos y sus hashes están en `source-images/canva/`, fuera del paquete público.

Se conserva `print-vehiculo` como imagen conceptual en Rotulación y en el segundo elemento de la galería: no hay una fotografía vehicular inequívoca en el tramo propio de Media Printing. R041/R042 pertenecen a «Innovaciones» de Linkbranding y no prueban una producción vehicular de Media Printing. No se reasignaron entre divisiones. Los demás recursos conceptuales anteriores permanecen como recuperación, fuera de los espacios actualizados. Revisión visual local pendiente de aprobación; no se ha publicado.

## Estado fotográfico vigente · 24-11-2026

El hero y su transformación utilizan **R102**, exhibición New Era del tramo de Media Printing (página 37). Sustituye definitivamente al taller generado de esta revisión. Su original recuperado mide 1280×960; el maestro reencuadrado conserva 1280×695 píxeles efectivos. No se inventa detalle ni se amplía el archivo: el límite de resolución se documenta para solicitar el original de cámara posteriormente.

R108 permanece en Espacios y exhibición. La galería conserva sus tres entradas: **R101** (Branding y ambientación), **print-vehiculo** (conceptual, pendiente confirmado) y **R100** (Desarrollos a medida). El cierre utiliza **R103**, exhibición comercial de la página 37, evitando repetir el hero. Los originales y las versiones anteriores permanecen intactos. Las recetas y hashes están en `media.json`; los maestros están en `source-images/curated/`.

**Pendiente específico:** fotografía confirmada de rotulación vehicular para COPY-P06-S04 y para la segunda entrada de la galería. El usuario confirmó el 24-11-2026 que no se puede atribuir R041/R042 a Media Printing; no se utilizan para sustituir ese concepto. Es la única imagen generada que permanece visible en Media Printing, en esas dos apariciones, ambas rotuladas como conceptuales.

La máscara alfa de `shared/divisions/sections.css` conserva el desvanecimiento del hero sin modificar dimensiones, GSAP ni coreografía. Revisión local, sin commit, push ni publicación. Informe consolidado: `../output/sustitucion-real-final-2026-11-24/informe.md`.

## Publicación autorizada · 24-11-2026

La selección y los ajustes locales anteriores quedan aprobados para integrar en `main` y publicar el prototipo. El estado vigente, las fuentes versionadas, el QA y los pendientes confirmados se documentan en [publicación fotográfica](../docs/publicacion-fotografica-2026-11-24.md). Los informes locales previos registran estados históricos, no una restricción vigente de publicación.
