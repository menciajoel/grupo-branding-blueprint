# Revisión fotográfica aprobada · 24-11-2026

Joel autoriza integrar todos los cambios aprobados en `main`, hacer push y desplegar el prototipo en GitHub Pages. La base auditada es `457157a211a79b8449082319960abad7361449b0`; el remoto no contiene commits nuevos al comenzar. No se cambian los dominios comerciales.

## Selección vigente

Las fotografías proceden del material del cliente recuperado del visor de [Canva](https://www.canva.com/design/DAG_54Q9H3A/1-KYGrgc1f6MKhoSjA82zg/view), con página y SHA-256 registrados. Se conserva la distinción entre divisiones por el tramo de la presentación y el contenido visible.

| División | Espacio | Recurso / página |
| --- | --- | --- |
| Linkbranding | Hero y Qué resolvemos | R026 / 10 |
| Linkbranding | Diseño de activaciones | R043 / 14 |
| Linkbranding | Eventos | R014 / 7 |
| Linkbranding | Activaciones y staffing | R027 / 10 |
| Linkbranding | Cierre | R064 / 19 |
| Media Printing | Hero y Qué hacemos | R102 / 37 |
| Media Printing | Espacios y exhibición | R108 / 39 |
| Media Printing | Galería: Branding y ambientación | R101 / 36 |
| Media Printing | Galería: Desarrollos a medida | R100 / 36 |
| Media Printing | Cierre | R103 / 37 |
| Media Branding | Cobertura | R085 / 28 |
| Media Branding | Galería: Secuencial | R077 / 24 |
| Media Branding | Galería: Paradero | R083 / 27 |
| Media Branding | Galería: Unipolar | R078 / 25 |
| Media Branding | Galería: Valla | R097 / 33 |
| Media Branding | Galería: Puente | R081 / 26 |
| Media Branding | Cierre | R095 / 32 |

Media Branding conserva las siete fotografías reales anteriores: hero VU018, publicidad exterior PTE04 y VU3C01, tres formatos del inventario y Banderines Issima extraídos del PDF oficial. Los ajustes convencionales aprobados reencuadran el hero y PTE04 sin alterar los originales.

Resultado activo: **24 fotografías reales únicas y dos conceptuales únicas**, estas últimas en cuatro apariciones. Los cinco espacios de Linkbranding son documentales. El taller generado de Media Printing deja de mostrarse; el hero utiliza la exhibición real New Era R102.

## Pendientes aceptados

- **Media Printing, rotulación vehicular:** un concepto en COPY-P06-S04 y en la segunda entrada de la galería. El usuario confirmó que no está acreditada la autoría de Media Printing en R041/R042, correspondientes a Innovaciones de Linkbranding; no se reasignan a esta división.
- **Media Branding, Retail:** una imagen conceptual en principal y detalle. Falta evidencia adecuada de las locaciones comerciales de esta división; las activaciones de Linkbranding y exhibidores de Media Printing no la sustituyen.
- Ambos conceptos conservan «Visualización conceptual · Imagen provisional». Las cinco nuevas fotos de la galería de Media Branding describen formatos; no se presentan como evidencia de Six, Fútbol o Powerade, cuyas fotografías específicas siguen pendientes.
- R102 tiene un original recuperado de 1280×960 y un recorte de 1280×695. Se conserva como hero real aprobado; a tamaños grandes se percibe su límite de detalle. No se inventó resolución. Solicitar el original de cámara es una mejora futura.
- Contacto y Newsletter siguen sin backend. Esta publicación no modifica su lógica ni simula envíos.
- Safari nativo y pruebas físicas iOS/iPadOS/Android permanecen pendientes. WebKit automatizado no equivale a esas pruebas.

## Fuentes editables y paquete público

Los originales exactos recuperados se versionan en `linkbranding/source-images/canva/`, `media-print/source-images/canva/` y `media-branding/source-images/canva/`. Cada carpeta documenta página, estado y hash. Los maestros convencionales están en `source-images/curated/`; se conservan también las selecciones anteriores como referencia técnica.

`media.json` registra procedencia, dimensiones originales y procesadas, receta, prefijo, tamaños web, alt y posición. La posproducción utiliza conversión ICC a sRGB cuando procede, reencuadre, correcciones tonales pequeñas y enfoque moderado. Sin IA, relleno, clonación, cambios a marcas/productos ni ampliación de archivos.

Los derivados WebP se incluyen en `assets/media/`. El empaquetador sigue publicando solo las dependencias referenciadas: no expone originales, maestros PNG, JSON, Python, capturas, vídeos, catálogos internos ni recuperaciones. La compilación habitual sigue requiriendo únicamente Git y Python; no necesita los archivos locales de `output/` ni `recursos/`.

## Cambios técnicos acotados

- Manifiestos de imágenes, selección en `design.json` y galerías en `projects.json`.
- Los renderizadores consumen `filePrefix`, `processedDimensions` y tamaños responsive del recurso. La reserva de proporción del bloque de participación de Linkbranding conserva su altura al usar fotografía vertical.
- Máscara alfa en el borde fotográfico de Linkbranding/Media Printing con prefijo WebKit. GSAP conserva el control exclusivo de `clip-path`.
- Encuadres de Media Branding en `chapters.css`: soporte del hero completo en escritorio y posición del nuevo fondo móvil de cierre.
- HTML generado reproducible y documentación actualizada. No se modifican archivos JavaScript, Inicio, Contacto, ARQ-02/COPY-03, identidades, navegación, tipografías ni parámetros cinematográficos.

## Evidencia previa a publicación

La revisión local aprobada verifica 110 originales recuperados intactos, incluidas 94 fotografías, y los 17 recursos documentales seleccionados. Chrome y WebKit automatizado prueban las tres divisiones en 1440×900, 768×1024 y 390×844, sin errores JavaScript, imágenes rotas, recursos fallidos ni desbordamientos.

Se comprueban cambios reales de máscara del hero y su reversibilidad, galerías completas con vuelta al inicio y movimiento reducido. Los relevos conservan escala .88 desktop/tablet y .94 móvil, regreso a 1 y un único pin original de hero. Las alturas de página, secciones y contenedores coinciden en Chrome con la revisión previa en los tres tamaños. Chrome añade 320×568 y 1920×1080, y WebKit revisa el encuadre final del paradero.

La publicación vuelve a compilar, comprobar sintaxis JavaScript y recorrer las cinco páginas. El cierre exige workflow exitoso, `deployment.json.sourceCommit` igual al commit publicado y verificación directa de páginas, navegación, fotografías y recursos públicos. El hash definitivo queda en Git y en el manifiesto servido por Pages; la evidencia de despliegue y las capturas se conservan localmente en `output/publicacion-2026-11-24/` y `output/playwright/publicacion-2026-11-24/`.

## Protección

Antes de integrar se conserva una recuperación local verificada de 437 archivos, con SHA-256 y estado Git. No se descartan cambios, originales, documentación, experimentos ni puntos de recuperación. La integración se realiza en `main` sin force push ni reescritura de historial. La recuperación no se incorpora al artefacto público.
