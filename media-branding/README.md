# Media Branding — presentación local

Página ARQ-P04 / COPY-P04 y destino demostrativo ARQ-P08 / COPY-P08. Se conserva la dirección de arte y las animaciones aprobadas. Aprobación creativa recibida el 18-11-2026, incluida la galería de Proyectos. Guía de colaboración y despliegue: `../README.md`.

Desde la raíz del proyecto:

```sh
python3 -B media-branding/build.py
python3 -B contacto/build.py
python3 -B media-branding/verify.py
python3 -B -m http.server 4173 --bind 127.0.0.1
```

Abrir [Media Branding](http://127.0.0.1:4173/media-branding/) y [Contacto](http://127.0.0.1:4173/contacto/). HTML/CSS/JS estáticos, sin instalación ni backend. Para rutas portables, navegación entre páginas y GitHub Pages, usar `python3 -B tools/build_site.py` desde la raíz y servir `_site/`; ver el README general.

## Actualización de Proyectos — 18-11-2026

Mosaico navegable de seis fotografías: Issima documental más cinco conceptos identificados. Cinco imágenes en desktop, tres en tablet, carrusel nativo con snap en móvil. Flechas circulares, teclado, gestos y movimiento reducido; sin autoplay ni nuevo pin. Datos: `projects.json`; presentación: `projects_render.py`, `projects.css`, `projects.js`. Se elimina exclusivamente la entrada de la fotografía única anterior.

QA vigente: `proyectos-qa.md` y `design-qa.md`. Capturas: `output/proyectos-2026-11-18/capturas.html`. Recuperación: `media-branding-antes-mosaico-proyectos` → árbol `0c797a48eff269dbce96310ac6fc9c12298fe8ef`. Las evidencias de QA permanecen locales; no se publican en Pages.

## Contenido y presentación

- `content.json`: conserva las nueve secciones y los 26 bloques originales de COPY-P04. Solo cambia el estado de navegación de Contacto.
- `presentation-copy.json`: propuesta de Predios autorizada por el director, separada de COPY-03. Mantiene el nombre Predios privados y Terrenos · Edificios · Contacto directo; sustituye la introducción y los marcadores. Sin teléfono inventado.
- `editorial-trace.json`: registra los 26 IDs originales y la disposición de cada bloque. 22 originales se muestran literalmente; cuatro se retiran de la interfaz por autorización de presentación. Los cuatro textos demostrativos se identifican por separado.
- `media.json`: procedencia, encuadres, hashes y variantes. Proyectos incorpora la foto documental de Issima del PDF original; no atribuye esa imagen a Six, Fútbol o Powerade.
- `build.py` / `template.html` / `components.py`: generan estructura, imágenes y enlaces; contenido separado de presentación.
- `tokens.css` / `brand-palette.json`: identidad cromática conservada; SVG oficiales intactos.
- `motion.js`: únicamente se retiró el interceptor del antiguo aviso de Contacto. La secuencia desde `const reduce =` permanece idéntica al punto de recuperación.
- `chapters.js`: conserva el resto de entradas, formatos, cierre y responsive; solo se elimina la entrada de la antigua fotografía única de Proyectos, sustituida por el controlador acotado de la nueva galería.
- `chapters.css`: ajustes acotados a acción de Predios, recorte del detalle de Retail y proporción documental de Issima.
- `../contacto/`: 23 bloques de COPY-P08, campos explorables, envío desactivado. Sin destinatario operativo, almacenamiento, endpoint ni mensaje de envío simulado.

## Recorrido

Hero → Qué resolvemos → Publicidad exterior → Retail → Vallas y formatos → Cobertura → Proyectos → Predios privados → Acción comercial. El orden S13 antes de S12 sigue la fuente aprobada.

Los cuatro accesos generales abren `/contacto/`. Proponer mi espacio abre `/contacto/#predios-privados`; `predios@example.com` es texto demostrativo sin enlace. Grupo Branding conserva la conexión con `../experimentos/inicio-v01/`. No se modificó Inicio ni se añadieron enlaces rotos a Portafolio.

Los formatos conservan clic, teclado, Home/End y flechas. Las animaciones se mantienen, incluidas las máscaras por líneas del cierre, su entrada autónoma y el zoom de fotografía solo fuera de móvil. Movimiento reducido presenta el contenido sin esas animaciones.

## Imágenes y pendientes

Ocho originales documentales/reales activos y siete originales generados activos, estos últimos en ocho apariciones: Retail principal/detalle, cierre y cinco en Proyectos. Las ocho mantienen **Visualización conceptual · Imagen provisional**. Se generaron cinco fotografías para la nueva galería; los dos conceptos anteriores retirados no se borraron.

Inventario y procedencia: `inventario-imagenes.md`. Cambios, hallazgos resueltos y decisiones pendientes: `informe-presentacion.md`. QA vigente y evidencia: `design-qa.md`, `output/presentacion-2026-11-17/`.

Pendientes definitivos: evidencia visual de Six, Fútbol y Powerade; fotografía real Retail o aprobación para uso definitivo del concepto; derechos para el sitio comercial definitivo; correo/contacto real de Predios; operación real del formulario. Newsletter permanece pendiente transversal fuera de esta intervención. No se inventan disponibilidad, cifras ni resultados.

## Recuperación

HEAD: `0549555ec3f0de294e201b35fa548c0051e823aa`. Etiqueta **media-branding-antes-presentacion**, árbol **7c2818c76625c1e115557a941f8fe8f683c91b64**. Incluye el trabajo local no ignorado anterior, sin crear commit ni modificar el índice normal. Se conservaron las etiquetas anteriores.

Copias de los archivos de implementación y manifiesto SHA-256 de 327 archivos previos en `output/presentacion-2026-11-17/`. No restaurar destructivamente sobre trabajo local. Los recursos y evidencias ignorados siguen en disco.

## Estado fotográfico vigente · 24-11-2026

Se conservan las fotografías reales aprobadas: hero VU018, puente PTE04, soportes del inventario y Banderines Issima del PDF. Cobertura mantiene R085, página 28 de la presentación del cliente, como contexto urbano sin afirmar disponibilidad.

La galería sustituye las cinco imágenes generadas por fotografías documentales: **R077** (Secuencial, p.24), **R083** (Paradero, p.27), **R078** (Unipolar, p.25), **R097** (Valla, p.33) y **R081** (Puente, p.26). Las etiquetas funcionales no atribuyen estas fotografías a Six, Fútbol o Powerade. El cierre utiliza **R095**, valla iluminada de Coca-Cola, p.32; el ID técnico heredado `concepto-cierre` se conserva para no cambiar el componente, pero su recurso activo ya es documental.

**Pendiente específico:** Retail y punto de venta conserva una imagen conceptual en dos encuadres. No se encontró evidencia adecuada de las locaciones de Media Branding; las activaciones de Linkbranding y los exhibidores de Media Printing no se reasignan a esta división. Las dos apariciones mantienen la identificación conceptual visible.

Los bloques editoriales, tipografías, etiquetas funcionales, controles y movimiento no cambian. `media.json` registra procedencia, tamaños, alt, maestros y recetas convencionales; los originales permanecen intactos. Informe consolidado: `../output/sustitucion-real-final-2026-11-24/informe.md`. Revisión local, sin publicación.

## Publicación autorizada · 24-11-2026

La selección y los ajustes locales anteriores quedan aprobados para integrar en `main` y publicar el prototipo. El estado vigente, las fuentes versionadas, el QA y los pendientes confirmados se documentan en [publicación fotográfica](../docs/publicacion-fotografica-2026-11-24.md). Los informes locales previos registran estados históricos, no una restricción vigente de publicación.
