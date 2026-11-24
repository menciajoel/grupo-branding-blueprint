# Inventario de imágenes — Media Branding

## Estado vigente · 24-11-2026

**Una imagen generada activa, en dos apariciones:** Retail principal y Retail detalle. Ambas usan el mismo original `concepto-retail`, con sus leyendas conceptuales. La sustitución requiere una fotografía verificable de las locaciones comerciales de Media Branding; no se atribuyen a esta división las fotografías de activaciones de Linkbranding ni los exhibidores de Media Printing.

| Espacio actualizado | Recurso real activo | Procedencia |
| --- | --- | --- |
| Cobertura | R085 | Canva, p.28 |
| Galería · Secuencial | R077 | Canva, p.24; secuencia de soportes, sin atribución a Six |
| Galería · Paradero | R083 | Canva, p.27; sin atribución a Fútbol |
| Galería · Unipolar | R078 | Canva, p.25; sin atribución a Powerade |
| Galería · Valla | R097 | Canva, p.33 |
| Galería · Puente | R081 | Canva, p.26 |
| Cierre comercial | R095 | Canva, p.32; valla iluminada de Coca-Cola |

Los conceptos sustituidos se conservan en disco como historial y ya no se renderizan. Las fotografías reales aprobadas se conservan. JSON y maestros registran los recursos actuales, sus originales recuperados, páginas, hashes, alt, tamaños y recetas. Informe de la revisión: `../output/sustitucion-real-final-2026-11-24/informe.md`.

## Registro histórico · 17–18-11-2026

**Los apartados siguientes documentan el estado original y sus decisiones; no describen el inventario activo después de la sustitución del 24-11-2026.**


Fecha: 17-11-2026. Uso autorizado para la presentación navegable local. Los conceptos no documentan campañas ejecutadas; la fotografía de Issima sí procede del documento original identificado abajo.

## Visualizaciones generadas provisionales

Rótulo visible obligatorio en cada recurso: **Visualización conceptual · Imagen provisional**. Siete originales generados activos, en ocho apariciones: principal y detalle de Retail, cierre y cinco imágenes del mosaico de Proyectos. La ampliación de Proyectos del 18-11-2026 incorpora cinco originales nuevos. Los otros dos conceptos anteriores se conservan en disco, fuera de la presentación. No se amplió la resolución de los originales.

| Recurso | Ubicación | Original / variantes WebP | Sustitución antes del sitio definitivo |
| --- | --- | --- | --- |
| concepto-retail | COPY-P04-S04 / Retail, foto principal | 1122 × 1402; concepto-retail-640.webp, concepto-retail-1120.webp | Fotografía autorizada y verificable del soporte o instalación correspondiente; no asignar esta imagen a un cliente. |
| concepto-exterior | Retirado de la presentación; archivo anterior conservado | 1536 × 1024; concepto-exterior-800.webp, concepto-exterior-1536.webp | Sin uso actual. Proyectos muestra la fotografía documental de Issima. |
| concepto-retail-detalle | COPY-P04-S04 / Retail, foto secundaria | Mismo original y variantes de concepto-retail; recorte CSS sobre el exhibidor | Se sustituye junto a la principal; no representa otro entorno ni otro proyecto. |
| concepto-comercial | Retirado de la presentación; archivo anterior conservado | 1536 × 1024; concepto-comercial-640.webp, concepto-comercial-1200.webp | Sin uso actual. |
| concepto-cierre | COPY-P04-S12 / cierre comercial, fotografía de fondo | 1672 × 941; concepto-cierre-640.webp, concepto-cierre-1200.webp, concepto-cierre-1672.webp | Fotografía autorizada y verificable del soporte o instalación correspondiente; no asignar esta imagen a un cliente. |

Las variantes están en `media-branding/assets/media/`. Se redimensionaron con Lanczos y se codificaron a WebP. `srcset`, `sizes`, dimensiones y carga diferida están presentes. El encuadre del cierre cambia en móvil; no se ejecuta zoom en ese formato.

## Originales, prompts y trazabilidad

### concepto-retail

- Original: `output/completa-2026-11-17/concepto-retail-original.png`
- Prompt exacto: `output/completa-2026-11-17/concepto-retail-prompt.txt`
- SHA-256 del original: `988fc07b9e13cab640d726757fcd285766fba83fc6ca03c5a40719a2620ce94a`
- Alt y condición de sustitución registrados en `media.json`.

### concepto-exterior

- Original: `output/completa-2026-11-17/concepto-exterior-original.png`
- Prompt exacto: `output/completa-2026-11-17/concepto-exterior-prompt.txt`
- SHA-256 del original: `724925a9bdf1559ec33ee7212bfa16c4cab74e7b220281e8ff816e2d6e907722`
- Alt y condición de sustitución registrados en `media.json`.

### concepto-comercial

- Original: `output/completa-2026-11-17/concepto-comercial-original.png`
- Prompt exacto: `output/completa-2026-11-17/concepto-comercial-prompt.txt`
- SHA-256 del original: `559e039829b39d83cd59a2b210057096accedbc5cf4d6c896725b15e8e6445c8`
- Alt y condición de sustitución registrados en `media.json`.

### concepto-cierre

- Original: `output/cierre-2026-11-17/concepto-cierre-original.png`
- Prompt exacto: `output/cierre-2026-11-17/concepto-cierre-prompt.txt`
- SHA-256 del original: `7b8042f834f5f8931c8d1a36b3ecf34904cdf17e3e89061f2d4145cbe9257300`
- Alt y condición de sustitución registrados en `media.json`.

## Fotografías reales conservadas

| Catálogo | Uso | Fuente del proyecto |
| --- | --- | --- |
| VU-025 | Hero y Qué resolvemos | recursos/Unipolares/VU1C-18 copia.jpg |
| PTE-007 | exterior-puente | recursos/Puentes/PTE-04 copia.jpg |
| VU-035 | exterior-unipolar | recursos/Unipolares/VU3C-01 copia.jpg |
| PTE-025 | formato-puentes | recursos/Puentes/PTE-12.jpg |
| BD-009 | formato-banderines | recursos/Banderines dobles/BD1C-07 copia.jpg |
| MV-003 | formato-minivallas | recursos/Minivallas/MV-02 copia.jpg |
| VU-003 | cobertura-ciudad | recursos/Unipolares/VU1C-02 copia.jpg |
| Banderines Issima | COPY-P04-S11 / Proyectos | recursos/originales/IMPACTOS EXITO MEDIA BRANDING.pdf, página 3, objeto de imagen 173 |

Los originales reales permanecen intactos. Los derivados se prepararon en sRGB y WebP. La existencia de una fotografía en el proyecto no verifica disponibilidad comercial actual de la ubicación ni derechos para una publicación pública.

## Evidencia que sigue faltando

- Fotografías documentales verificables de secuencial Six, paraderos Fútbol y unipolar Powerade. Se conserva la referencia textual aprobada, sin asignarles la foto de Issima ni inventar campañas. No se muestran mensajes técnicos de falta de fotografías.
- Instalaciones reales de retail. Las dos apariciones actuales son la misma visualización conceptual identificada, con encuadres distintos.
- Reemplazar o aprobar explícitamente el recurso conceptual de cierre antes del sitio definitivo.
- No se asigna una imagen de otro soporte a ningún proyecto citado. No se inventaron datos, resultados ni testimonios.

## Extracción documental de Issima — intervención de presentación

- Se revisaron las cinco páginas del PDF encontrado en `/Users/joelmencia/Downloads/IMPACTOS EXITO MEDIA BRANDING.pdf`. Copia local intacta en `recursos/originales/IMPACTOS EXITO MEDIA BRANDING.pdf`.
- SHA-256 PDF: `94f6d694876bfab7e06cbf55d0033c60608da13b6dcee2adcdfb9ea290cacba6`. Página 3: identifica ISSIMA y contiene la fotografía de los tres banderines. Objeto 173.
- Extracción original sin redibujar: `output/presentacion-2026-11-17/issima-000.png`, **1642 × 1256**. SHA-256 `75010eece8a850bc8d716804335359ad1bcc483924177b60a2753038b0410f59`.
- Variantes sRGB/WebP: `assets/media/proyecto-issima-720.webp`, `proyecto-issima-1200.webp`, `proyecto-issima-1642.webp`; sin ampliación. El marco conserva la proporción del original.
- Leyenda visible: **Banderines Issima**, derivada de COPY-P04-S11-B02. No se incorporan resultados, testimonios, otros clientes ni nuevos datos del PDF.
- El documento no contiene evidencia de Six, Fútbol o Powerade. La búsqueda local tampoco localizó evidencia verificable para esos tres casos. La existencia del original no sustituye la confirmación de derechos de publicación por el cliente.

## Mosaico de Proyectos — 18-11-2026

Galería de seis fotografías. Se mantiene Issima documental y se incorporan cinco visualizaciones generadas con `image_gen` integrado. No se encontró correspondencia documental de Six, Fútbol ni Powerade entre los 195 originales revisados. Sus menciones aprobadas se conservan sin atribuirles fotografías conceptuales.

| Recurso / etiqueta | Tipo | Original y derivados | Uso |
| --- | --- | --- | --- |
| proyecto-issima / Banderines Issima | Documental | Original y WebP anteriores, sin cambios | Posición 01; puede convertirse en protagonista o secundaria. |
| proyectos-secuencial / Secuencial | Conceptual | 1536×1024; WebP 640/960/1536 | Posición 02, entorno urbano al anochecer. |
| proyectos-paradero / Paradero | Conceptual | 1536×1024; WebP 640/960/1536 | Posición 03, estructura diurna de acero y vidrio. |
| proyectos-unipolar / Unipolar | Conceptual | 1536×1024; WebP 640/960/1536 | Posición 04, cielo diurno y estructura de apoyo único. |
| proyectos-valla / Valla | Conceptual | 1536×1024; WebP 640/960/1536 | Posición 05, soporte sobre muro y luz cálida. |
| proyectos-puente / Puente | Conceptual | 1536×1024; WebP 640/960/1536 | Posición 06, puente peatonal con franja azul. |

Originales, prompts exactos y hashes en `output/proyectos-2026-11-18/`, con sufijos `-original.png`, `-prompt.txt` y `-procedencia.json`. Manifestación consumida: `media.json`; orden y etiquetas: `projects.json`. Quince derivados nuevos en `assets/media/`, sin upscale ni cambios a imágenes previas. Los cinco conceptos no tienen marcas de clientes ni se presentan como campañas ejecutadas y conservan la leyenda **Visualización conceptual · Imagen provisional** en cualquier posición de la galería. Requieren sustitución o aprobación expresa para el sitio definitivo.
