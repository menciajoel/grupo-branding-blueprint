# Proyectos — refinamiento final local

Fecha: 18 de noviembre de 2026. Base de producción: `6780fe6783c6944443318098f0d87476d5096190`. Refinamiento aprobado por Joel para publicación integral. Se conserva aquí la evidencia de la revisión local previa; el cierre consta en [el registro de publicación](../../docs/publicacion-integral-final-2026-11-18.md).

## Alcance

Se ajustan únicamente las fichas de Dunkin, ISSIMA y Flying Fish en el Inicio. Permanecen intactos el contenido documental, los testimonios, las atribuciones, los originales y derivados fotográficos, ARQ-02/COPY-03, el hero, las animaciones cinematográficas, la navegación, las correcciones globales de focus y los iconos SVG existentes.

Punto de recuperación: etiqueta local `recuperacion/proyectos-refinamiento-final-20261118` sobre el commit de producción. La copia completa y las huellas de los 262 archivos de partida se conservan en `output/proyectos-refinamiento-final-2026-11-18/antes-refinamiento.tar.gz` y `proteccion.json`.

## Causas comprobadas

1. **Franja superior:** el encabezado `sticky` estaba dentro del mismo diálogo desplazable que la fotografía. Su posición quedaba 20 px por debajo del borde interior del modal, debido al padding. Con `scrollTop=200` en 390×844, la barra empezaba en y=33 y el diálogo en y=12; la imagen se pintaba en el hueco superior. No era una franja incluida en la fotografía ni un recurso defectuoso. La captura `dunkin-mobile-franja-before.jpg` reproduce el problema.
2. **Reapertura:** poner `scrollTop=0` antes de `showModal()` no reiniciaba de forma fiable un área sin caja de layout mientras el diálogo estaba cerrado. La prueba de Flying Fish conservó 146 px de scroll. El reinicio ahora se completa en una microtarea, después de la apertura síncrona que ya realiza el controlador aprobado. No se mueve la página, no se añaden timers ni se modifica `motion.js`.

## Cambios

- Se sustituye la etiqueta diminuta de Media Branding por `contacto/assets/media-branding-isotipo.svg`, existente en el proyecto. Es una extracción de nodos originales del SVG oficial multicolor entregado por Joel, con procedencia verificada. Se utiliza a 40 px de ancho y altura proporcional, con alt «Media Branding». No se cambia ningún SVG ni se aplica recoloreado CSS.
- Escritorio, desde 1001 px: el testimonio completo queda abierto al renderizar, sin el control «Leer testimonio completo». Conserva la cita destacada, atribución, descripción, nombre y fotografía en el sistema 60/40 anterior. La columna de información mantiene su presupuesto de altura y permite scroll cuando lo necesita.
- Tablet y móvil: se conserva inicialmente el testimonio compacto por la extensión de las tres cartas. El contenido íntegro permanece disponible mediante el disclosure nativo. El encabezado y el nombre del proyecto quedan fuera del área de lectura desplazable; fotografía y contenido recorren esa área sin pasar por encima del encabezado. No se recorta ni se transforma la fotografía para resolver la franja.
- Las áreas desplazables son accesibles por teclado. El estado compacto elegido se conserva al alternar entre orientaciones/layouts; cada nueva apertura comienza desde arriba.
- El HTML de respaldo contiene el testimonio abierto para lectura sin JavaScript. El comportamiento compacto se aplica de forma síncrona antes de mostrar el diálogo cuando JavaScript está disponible.

## Archivos

| Archivo | Intervención |
| --- | --- |
| `project_views.py` | Testimonio abierto en el HTML y retirada del texto de acción exclusivo de escritorio. |
| `projects.js` | Isotipo oficial, adaptación de lectura por viewport, un listener de media query y reinicio de los contenedores tras la apertura. Se conserva el controlador de navegación/apertura/cierre existente. |
| `projects.css` | Tamaño del isotipo, lectura completa de escritorio y separación del encabezado respecto al scroller compacto. |
| `index.html` | Regeneración desde las fuentes. |
| `verify_projects.py` | Verifica el nuevo requisito de testimonio completo por defecto sin retirar las comprobaciones documentales y fotográficas anteriores. |
| `casos-reales.md` y este informe | Enlace a la evolución local y evidencia de QA. |

## QA

| Prueba | Resultado |
| --- | --- |
| Chromium, tres casos en 1440×900 | Testimonio completo visible sin interacción adicional. Solo la columna informativa hace scroll; fotografía y rectángulo del modal permanecen idénticos antes/después. Desplazamientos de lectura comprobados: Dunkin 229,5 px; ISSIMA 622 px; Flying Fish 411 px. |
| Chromium, tres casos en 768×1024 y 390×844 | Isotipo cargado, encabezado limpio, expansión y lectura disponibles, cierre accesible. El diálogo exterior permanece en scroll 0; se desplaza el área de contenido. No se pinta fotografía en el espacio superior de la barra. |
| Reapertura y teclado | Enter, Escape, Tab y lectura por teclado comprobados. Tras leer hasta el final y cerrar, las posiciones de página permanecen exactamente en 4108, 4233 y 4358 px, respectivamente. Las tres reaperturas devuelven scroll interno 0 y estado compacto inicial. |
| Cambios de orientación | 390×844 → 1024×768 → 390×844: escritorio abre el texto completo; al regresar se restaura el estado compacto o expandido previamente elegido en móvil. |
| Anchos/alturas adicionales | 320×568, 375×667, 430×932, 844×390, 900×700, 1001×700, 1024×768, 1200×600 y 1920×1080. Cierre dentro del viewport, sin desbordamiento horizontal; fotografías con `object-fit: contain`. |
| Safari macOS, escritorio | Tres casos abiertos, isotipo multicolor, testimonio completo sin disclosure, lectura independiente por teclado y cierre con Escape comprobados sobre el paquete estático local. |
| Safari macOS, Responsive Design Mode | Tres casos en 390×844 y 768×1024. Encabezado limpio, estado compacto e isotipo correctos; en móvil se expandieron y desplazaron las cartas sin franja sobre el encabezado. |
| Fidelidad documental | `verify_projects.py --pdf`: hash del PDF, cinco páginas, todos los párrafos, píxeles nativos y perfiles ICC exactos. Once variantes WebP proporcionales con sus hashes originales. |
| Compilación | Verificadores existentes de copy, identidades, navegación, geometrías y animaciones protegidas correctos; comprobación sintáctica de `projects.js` correcta. |
| Consola Chromium | Sin advertencias ni errores capturados en la pestaña de pruebas. No se realizó una auditoría de consola de Safari. |

Las comprobaciones visuales corresponden al contenido local. No se ha publicado el refinamiento.

## Límites reales

- Safari HTTP: la navegación de la ventana reservada a la dirección local volvió a `about:blank`. Por eso la validación de Safari se realizó abriendo `_site/experimentos/inicio-v01/index.html` como archivo, con los mismos HTML, CSS, JS y recursos. No se declara comprobada la navegación HTTP en Safari.
- Responsive Design Mode de Safari macOS y la emulación de viewport de Chromium no sustituyen pruebas físicas en iOS/iPadOS; continúan pendientes.
- En tablet y móvil la extensión de los testimonios requiere scroll dentro del área de lectura cuando se expanden. El contenido sigue accesible y el cierre permanece fuera de ella.

## Evidencia y vista previa

Carpeta: `output/proyectos-refinamiento-final-2026-11-18/`.

- `comparativas.html`: nueve comparativas antes/después de los tres casos en escritorio, tablet y móvil, más el defecto superior reproducido y corregido en el mismo viewport.
- `dunkin-mobile-franja-before.jpg` / `dunkin-mobile-franja-after.jpg`: scroll de 200 px, 390×844.
- `*-desktop-after.jpg`, `*-tablet-after.jpg`, `*-mobile-after.jpg` y sus variantes de lectura.
- `safari-*-after.jpg` / `safari-*-reading.jpg`: evidencias de Safari macOS.
- `antes-qa.json`, `despues-qa.json`, `responsive-qa.json`, `resize-estados-qa.json`, `reapertura-focus-qa-final.json`, `scroll-columna-desktop-qa.json`, `safari-qa.json` e `integridad-final.json`.

Servidor local conservado:

- Dunkin: `http://192.168.68.120:4190/experimentos/inicio-v01/?vista=proyecto-dunkin`
- ISSIMA: `http://192.168.68.120:4190/experimentos/inicio-v01/?vista=proyecto-issima`
- Flying Fish: `http://192.168.68.120:4190/experimentos/inicio-v01/?vista=proyecto-flying-fish`

Las URL requieren la misma red local y el equipo anfitrión activo.
