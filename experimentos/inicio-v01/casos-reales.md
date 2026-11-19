# Casos documentales del Inicio — implementación y QA local

Fecha: 18 de noviembre de 2026. Sin commit, push ni despliegue. Aprobación visual
de escritorio pendiente. La composición móvil aprobada se conserva.

## Fuente y correspondencia

Se han leído las cinco páginas de `IMPACTOS EXITO MEDIA BRANDING.pdf`: portada,
Dunkin, ISSIMA, Flying Fish y cierre. El original de Downloads y la copia de
`recursos/originales/` son idénticos: SHA-256
`94f6d694876bfab7e06cbf55d0033c60608da13b6dcee2adcdfb9ea290cacba6`.

| Caso / registro aprobado | Página | Declaración atribuida a | Fotografía original | Mayor WebP |
|---|---|---|---|---|
| Dunkin / CASE-DUNKIN | 2 | Gilma Mejía · Dunkin | 1720 × 1290, objeto 157 | 90 614 bytes |
| ISSIMA / CASE-ISSIMA | 3 | 4am Saatchi & Saatchi · Agencia | 1642 × 1256, objeto 173 | 156 780 bytes |
| Flying Fish / CASE-FLYING-FISH | 4 | Eco Publicidad | 1164 × 1488, objeto 188 | 157 992 bytes |

Las descripciones y extractos proceden del registro de casos aprobado en
`content.json` y ARQ-P09 de `docs/arq.html`. Los párrafos completos se transcriben
literalmente del PDF en `project-cases.json`, normalizando únicamente saltos de
maquetación y Unicode NFC. Se conservan todas las palabras y signos; los extractos
destacados son substrings literales del testimonio correspondiente. Se utiliza
el nombre aprobado Dunkin, sin trasladar la errata «Dunkin Dounuts» del encabezado
del PDF. No se inventa un cargo para Gilma Mejía ni se confunde la autoría del PDF
con la de las declaraciones.

Hay tres fotografías nativas PNG preservadas con sus perfiles ICC y once WebP
responsive (869 430 bytes en total, aproximadamente 849 KiB). No hay stock ni IA.
No se recorta ni amplía ninguna fotografía. El inventario exhaustivo y las huellas
están en `project-images.json`; el procedimiento reproducible, junto a los PNG
en `source-images/projects/README.md`.

## Experiencia implementada

Los tres enlaces de 03 / PROYECTOS y el catálogo «Ver proyectos» abren las fichas
reales en el diálogo nativo existente. Se conservan sus URLs `?vista=proyecto-*`,
historial, cierre y navegación. No se implementan nuevas páginas ARQ-P09 ni se
alteran las rutas futuras `/portafolio/.../`.

Cada ficha contiene fotografía, descripción aprobada, extracto literal,
atribución y un `details/summary` nativo con el testimonio completo. Empieza
contraído y se abre/cierra con teclado. No se muestran rutas internas, nombres
del PDF ni avisos de fotografías pendientes. Los controles usan los SVG
existentes; no se reintroducen flechas Unicode.

El contenido se genera en HTML y hay un respaldo `noscript` con los tres casos y
anclas nativas. Con JavaScript activo, los templates inertes cargan únicamente
las fotos del caso o catálogo abierto. Se reservan dimensiones, se usan `srcset`,
`sizes`, `loading=lazy` y `decoding=async`.

### Refinamiento de escritorio solicitado durante la revisión

Aplicado solo a partir de 1001 px: retícula 60/40, título dentro de la columna
editorial, fotografía completa y control «Leer testimonio completo» con el SVG
de flecha existente. El retrato de Flying Fish se contiene dentro de su columna,
sin forzarlo a una proporción horizontal.

El presupuesto vertical depende de `100dvh`, márgenes y barra de cierre reales.
La columna de lectura usa `contain:size` para que abrir el testimonio no cambie
la posición ni el tamaño del modal; solo tiene scroll cuando el contenido supera
su espacio. Una altura mínima limitada por el viewport evita un lector demasiado
bajo en tablet horizontal. El botón de cierre queda fuera de esa columna.

En móvil se conservan el título superior, texto del control, fotografía,
tipografía, espaciado y scroll del diálogo aprobados. Comparación DOM antes y
después de los tres casos en 320 × 568 y 390 × 844: todas las medidas, posiciones,
tamaños de fuente y textos visibles coinciden exactamente. No se añaden listeners
de resize ni nuevas animaciones para este refinamiento.

### Investigación de la franja negra

La zona negra superior de la foto de Dunkin es el cielo nocturno de la imagen
incrustada original, no maquetación del PDF. Antes del refinamiento, figura e
imagen compartían exactamente el mismo rectángulo; los elementos `preview-path`
y `preview-note` estaban ocultos, con rectángulo 0 × 0. No se encontró una máscara
ni un título vacío que generase esa zona. Se elimina el fondo de relleno de la
figura en escritorio y se reorganiza el título; se conserva el cielo documental.
Eliminarlo requeriría recortar la fotografía y no se ha hecho.

## Protección

Punto previo: etiqueta local `casos-reales-antes-20261118`, sobre
`d88251a2b6e3739e9a6d08b188ea53e9f01968fe`. Como había cambios sin commit, también
se conservan `antes-casos-reales.tar.gz`, `cambios-locales-previos.patch` y
`proteccion.json` en `output/casos-reales-2026-11-18/`. Antes del refinamiento de
escritorio se guardaron `antes-refinamiento-desktop.tar.gz` y su inventario SHA.

Las correcciones previas de focus e iconos SVG permanecen intactas. No se cambian
`docs/arq.html`, `content.json`, `styles.css`, las otras cuatro páginas, los SVG,
las fotografías previas ni los archivos cinematográficos y de cierre aprobados.
En `motion.js` solo se añade un evento síncrono al renderizador existente del
diálogo; las timelines y ScrollTriggers se conservan byte por byte.

## Validación

| Comprobación | Resultado / evidencia |
|---|---|
| Fidelidad documental | `verify_projects.py --pdf`: identidad del PDF, cinco páginas, todos los párrafos literales, arrays de píxeles/ICC nativos exactos y once variantes proporcionales verificadas. |
| Copy y áreas protegidas | `verify.py` de Inicio y `shared/inicio/verify.py`: 46 bloques aprobados exactos; geometrías, documentos, estilos del hero y animaciones protegidas sin cambios. |
| Chromium responsive | Tres casos en 768 × 1024 y 390 × 844; además 320 × 568, 375 × 667, 430 × 932, 600 × 900, 1024 × 768, 1200 × 800, 1920 × 1080 y 844 × 390: sin desbordamiento horizontal. |
| Refinamiento desktop | Tres casos contraídos/expandidos en 1024 × 768, 1200 × 600, 1280 × 720, 1366 × 768, 1440 × 900 y 1920 × 1080. Sin scroll exterior del modal ni cambios de posición/altura al expandir. Revisión adicional final en 1001 × 700, 1024 × 768 y 1280 × 720. |
| Teclado / foco | Tab y Enter/espacio sobre summary; Escape y botón de cierre; retorno al activador en Chromium; foco visible conservado. Catálogo → caso → Atrás vuelve al catálogo. |
| Lectura | Testimonios completos expandibles; cierre siempre accesible. Móvil permite llegar al último párrafo mediante scroll del diálogo. En escritorio solo desborda la columna lectora. |
| Movimiento reducido | Emulación efectiva de `prefers-reduced-motion:reduce` en Chromium, contenido y detalles operativos, capa cinematográfica desactivada como corresponde. No se incorporan animaciones nuevas. |
| Cinemática | Adelante: progreso 0.6000 y escala 0.928; inverso: progreso 0 y escala 1. Archivos `shared/inicio/cinematic.*` intactos. |
| Safari macOS | Tres casos abiertos, testimonios contraídos/expandidos, Tab/espacio, Escape y cierre comprobados sobre el paquete estático abierto como archivo. Flying Fish también revisado en Responsive Design Mode, 768 × 1024 y 1024 × 768. |
| Límite Safari | La navegación HTTP de la ventana reservada regresó a `about:blank` o no salió del archivo, incluso por enlace local; no se observó petición al servidor. No se atribuye este comportamiento al código sin evidencia. La carga HTTP en Safari y los dispositivos iOS/iPadOS físicos quedan pendientes. No se declara compatibilidad completa. |
| HTTP local | Tres URLs y once WebP devuelven 200 en `192.168.68.120:4190`. |
| JavaScript / recursos | Comprobación sintáctica de `projects.js` y `motion.js`; sin excepción JS observada en Chromium. Se registró la petición automática heredada a `/favicon.ico` con 404, sin afectar los SVG de favicon declarados ni las fotografías. |
| GitHub Pages | Construcción estática y verificación de dependencias bajo `/grupo-branding-blueprint`; originales, scripts Python y evidencias QA fuera del paquete de producción. No desplegado. |
| SEO | Texto semántico, imágenes con alt factual y dimensiones, casos presentes en HTML de respaldo. Se conserva el `noindex` del prototipo y no se presentan los diálogos como páginas SEO independientes terminadas. |

### Evidencia visual

Las capturas y datos están en `../../output/casos-reales-2026-11-18/`:

| Caso | Antes (1440 × 900) | Después (1440 × 900) | Móvil aprobado | Tablet |
|---|---|---|---|---|
| Dunkin | `dunkin-desktop.jpg` | `dunkin-desktop-after.jpg` | `dunkin-mobile-after-refinement.jpg` | `dunkin-tablet.jpg` |
| ISSIMA | `issima-desktop.jpg` | `issima-desktop-after.jpg` | `issima-mobile-after-refinement.jpg` | `issima-tablet.jpg` |
| Flying Fish | `flying-fish-desktop.jpg` | `flying-fish-desktop-after.jpg` | `flying-fish-mobile-after-refinement.jpg` | `flying-fish-tablet.jpg` |

Expandidos: `*-desktop-expanded-after.jpg`; Safari: `safari-*.png`. Métricas:
`chromium-responsive.json`, `desktop-refinement-qa.json`, `desktop-height-final.json`,
`mobile-before-refinement.json`, `mobile-after-refinement.json`, `cinematic-qa.json`.

## Archivos de esta intervención

- Modificados: `build.py`, `template.html`, `index.html` y una línea de `motion.js`
  dentro de Inicio; `shared/inicio/verify.py` delimita la excepción documental sin
  relajar la protección restante; `tools/build_site.py` ejecuta la nueva validación.
- Añadidos en Inicio: `project_views.py`, `projects.css`, `projects.js`,
  `project-cases.json`, `project-images.json`, `extract_project_photos.py`,
  `verify_projects.py`, esta documentación, tres PNG fuente y once WebP.
- El refinamiento desktop modifica solo `project_views.py`, `projects.css` y el
  HTML generado. No cambia JavaScript, fotografías ni textos testimoniales.
- No se elimina ningún archivo existente ni punto de recuperación. Las pruebas
  y capturas se guardan fuera del paquete publicable.

## Pendientes documentales reales fuera del alcance

En Inicio solo se registran estos tres casos, ahora documentados. El PDF no aporta
evidencia fotográfica para Secuencial Six, Paraderos Fútbol o Unipolar Powerade
de Media Branding, ni para bancas de estadio, stand Nescafé Ice, Maggi y latas
Pepsi de Media Print. Se conservan sus menciones aprobadas y la distinción de
recursos conceptuales existente; no se asignan estas tres fotografías a otros
proyectos. Permanecen pendientes las páginas independientes ARQ-P09 y la
validación física iOS/iPadOS. Flying Fish mantiene la suavidad de su fuente.

Vista previa local: `http://192.168.68.120:4190/experimentos/inicio-v01/`, con
`?vista=proyecto-dunkin`, `?vista=proyecto-issima` o `?vista=proyecto-flying-fish`.
Servidor local activo; no se ha publicado ninguna de estas modificaciones.
# Actualización local posterior

El refinamiento solicitado sobre la versión `6780fe6` se documenta en
[proyectos-refinamiento-final-qa.md](proyectos-refinamiento-final-qa.md): isotipo
multicolor de Media Branding, testimonio íntegro por defecto en escritorio y
corrección del encabezado durante la lectura móvil. Las comprobaciones siguientes
se conservan como registro histórico de la primera implementación aprobada.
