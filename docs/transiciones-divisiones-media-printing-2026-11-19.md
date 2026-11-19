# Divisiones cinematográficas e identidad Media Printing

19-11-2026 · Implementación local · Pendiente de aprobación visual.

No se creó ningún commit ni se hizo push o despliegue. Se conserva la rama `codex/navegacion-divisiones` y la base `f1b6678a8b84c441ab4357fa37776387298a0149`. La navegación interactiva del Inicio del trabajo anterior permanece integrada y sin descartar.

## Revisión local

- [Comparativa con el efecto aprobado de Inicio](http://192.168.68.120:4192/comparativa.html): cuatro escenas en el mismo viewport, con formatos desktop/móvil y progresos 35 %, 60 % y 100 %.
- [Media Branding · Retail → Vallas y formatos](http://192.168.68.120:4190/media-branding/#retail).
- [Linkbranding · Eventos → Activaciones](http://192.168.68.120:4190/linkbranding/#eventos).
- [Media Printing · Rotulación → Proyectos](http://192.168.68.120:4190/media-print/#rotulacion-y-desarrollos).
- [Contacto contextual de Media Printing](http://192.168.68.120:4190/contacto/?origen=media-print).

Los enlaces con ancla abren la sección saliente para recorrer el relevo hacia abajo. Los mismos servidores responden en `127.0.0.1`. Se mantienen activos 4190 (sitio compilado) y 4192 (solo comparativa y sus capturas). GitHub Pages permanece sin cambios.

## Correspondencia exacta de los relevos

| Página | Plano posterior | Plano delantero | Tratamiento |
| --- | --- | --- | --- |
| Media Branding | `#retail`, 03 / RETAIL Y PUNTO DE VENTA | `#vallas-y-formatos-publicitarios`, 04 / VALLAS Y FORMATOS PUBLICITARIOS | Un contenedor sin espaciado alrededor de las dos secciones existentes. |
| Linkbranding | `#eventos`, 03 / EVENTOS CORPORATIVOS Y EXPERIENCIALES | `.participation-group`, cuyo primer capítulo es `#activaciones`, 04 / ACTIVACIONES DE MARCA | El grupo editorial existente sigue conteniendo Activaciones, Staffing, Street marketing y su fotografía compartida; no se rompe su cuadrícula. Solo el relevo de entrada al grupo recibe el efecto. |
| Media Printing | `#rotulacion-y-desarrollos`, 03 / ROTULACIÓN Y DESARROLLOS ESPECIALES | `#proyectos`, 04 / PROYECTOS | Un contenedor sin espaciado alrededor de los dos bloques existentes. |

No se modifican textos, fotografías ni las composiciones de esos capítulos. No se aplicó el efecto a otros relevos.

## Reutilización e integración

`shared/inicio/cinematic.js` y `.css` son la referencia aprobada y conservan sus bytes. `shared/divisions/cinematic.py` genera una adaptación común para las tres divisiones a partir de esos recursos. Se sustituyen los selectores de planos, el selector del header y el ID del trigger. La timeline conserva sus parámetros: escala desktop 1 → .88, móvil 1 → .94, desplazamiento −8/−4 px, oscurecimiento .20/.12, scrub reversible y entrada exclusivamente por flujo nativo.

La adaptación añade dos medidas de integración, sin reconstruir el efecto:

1. `refreshPriority:-1` mide el relevo después del pin existente del hero. El hero adaptativo reconstruye su pin al terminar de cargar fuentes/imágenes; sin esa prioridad, en 390×844 se observó un inicio de 2013 px frente a los 2654 px reales. La sección se escalaba antes de suspenderse. Tras la corrección, el inicio es 2654 px y la posición sticky reconstruida es −112 px, exactamente el recorte ya leído.
2. `cinematic-resize.js` conserva únicamente el progreso activo del relevo durante cambios de viewport. Espera las nuevas medidas y restaura la lectura; no añade timelines, triggers ni pins. Cualquier wheel, toque, pulsación o clic real cancela la restauración. No interviene durante el scroll normal ni fuera del relevo.

Los fondos opacos necesarios se toman de los fondos existentes de cada página. Se preservan el fondo claro de Retail, el fondo de Formatos y el verde del grupo de participación. No se añaden blur, tarjetas, elementos gráficos, pantallas ni alturas artificiales.

## Corrección de identidad

El nombre público es **Media Printing**. Las carpetas, `/media-print/`, parámetros `servicio`/`origen`, clases, IDs y archivos conservan sus identificadores.

Se corrigieron **47 apariciones revisadas en 12 fuentes**, además de regenerar sus HTML, registros y datos derivados. No se reemplazó indiscriminadamente el texto «media print»: `@media print` es una regla CSS de impresión y sigue intacta. No se tocaron los SVG oficiales.

| Fuente revisada | Sustituciones de nombre |
| --- | ---: |
| `docs/arq.html` | 18 |
| `experimentos/inicio-v01/content.json` | 4 |
| `media-print/content.json` | 3 |
| `contacto/build.py` | 3 |
| `contacto/contact.js` | 2 |
| `experimentos/contacto-inteligente/build.py` | 3 |
| `experimentos/contacto-inteligente/contact.js` | 2 |
| `shared/divisions/render.py` | 2 |
| `README.md` | 5 |
| `media-print/README.md` | 1 |
| `contacto/README.md` | 1 |
| `experimentos/contacto-inteligente/README.md` | 3 |

El [registro detallado](media-printing-name-corrections-2026-11-19.json) contiene líneas originales/finales y hashes de las fuentes. `afterIdentityOnlySha256` identifica el paso de denominación; `finalSha256` incluye también la integración técnica donde corresponde.

En Inicio se actualizan nombres, CTA, enlaces alternativos, nombres accesibles de las piezas, encabezados de división y datos de destinos. En Media Printing: título, descripción SEO, párrafo de presentación, alt, ARIA, navegación e identificación de cierre. En Linkbranding: identidad y enlaces de la empresa hermana. En Contacto: categoría, contexto de origen, retorno, progreso, pestaña/panel y mensajes generados por JavaScript. Los metadatos y datos embebidos existentes se comprueban sin añadir contenido comercial.

Joel autorizó expresamente corregir también únicamente el nombre en `docs/arq.html`. Los verificadores restauran esa denominación para contrastar el hash histórico completo: todo el resto de ARQ-02/COPY-03 conserva sus bytes, textos, IDs y rutas. El resto de bloques editoriales sigue contrastado contra COPY-03.

## QA de navegador

Chrome macOS mediante viewport responsive. No se presentan estas pruebas como realizadas en hardware físico.

| Viewport | Resultado en las tres divisiones |
| --- | --- |
| 1440×900 y 1920×1080 | Suspensión, márgenes visibles, entrada por delante, escala final .88 y reversión a 1. |
| 768×1024 y 1024×768 | Misma suspensión y escala .88, ambas orientaciones sin overflow horizontal. |
| 390×844 y 320×568 | Suspensión real, escala final .94 y reversión, contenido en flujo vertical. |
| 844×390 | Adaptación móvil horizontal .94, sin exigir otro pin ni una altura artificial. |

Se comprueban muestras estables en .35 y .75, salida completa y regreso hacia 0, combinando desplazamientos grandes y pequeños. El plano entrante está por delante en la zona de intersección, comprobado también mediante hit testing. La posición del plano posterior, descontando escala, origen y traslación, coincide con su top sticky dentro de un margen de 2 px.

Resize encadenado: 1440×900 → 768×1024 → 390×844 → 1024×768 → 1440×900. Las tres empresas conservan el punto .35 con desviación inferior a .001 de progreso. Un gesto nuevo durante resize avanza normalmente y cancela la restauración.

Prueba real de la consulta CSS `prefers-reduced-motion` mediante DevTools Rendering: en las tres páginas se elimina la suspensión/escala, el hero informa `reduced` y el contenido permanece disponible. La emulación se restauró a «No emulation» y DevTools se cerró. La preferencia del sistema no cambió.

Controles comprobados: galería de Media Printing (avance a 2/3); Formatos de Media Branding, incluidos Puentes → Banderines con ArrowDown y foco visible de 2 px; Contacto con origen `media-print`, retorno «Volver a Media Printing», pestaña seleccionada y contactos compartidos oficiales; menús, enlaces y nombres accesibles existentes. No se envió ningún formulario.

Las cinco páginas no muestran el nombre antiguo en su texto ni en alt/ARIA. Contacto de Media Printing también se revisó a 320×568, sin overflow horizontal. No existe ninguna referencia comercial antigua en los HTML/JS/JSON/CSS del paquete local; las reglas CSS de impresión se excluyen correctamente de esa búsqueda.

### Alturas antes/después

Comparación con la copia de recuperación anterior a este trabajo, en idéntico viewport. Todas las secciones conservan también sus alturas individuales.

| Página | Desktop 1440×900 | Móvil 390×844 |
| --- | --- | --- |
| Media Branding | 8671 → 8671 px | 7822 → 7822 px |
| Linkbranding | 7689 → 7689 px | 6876 → 6876 px |
| Media Printing | 5868 → 5868 px | 5680 → 5680 px |

Solo se conservan los pins originales del hero: uno en los tamaños donde cabe la coreografía y cero en las variantes que ya usaban flujo. El nuevo stack no pertenece a un pin ni crea espaciadores.

## Compilación, conservación y recursos

- Compilaciones sin prefijo y con `/grupo-branding-blueprint`: correctas.
- 150 recursos estáticos con HTTP 200; SHA-256 idéntico al manifiesto de la compilación local.
- Verificadores de contenido, identidades, tres pares exactos, rutas, Contacto y sintaxis JavaScript: correctos.
- Consola capturada de sitio/comparativa: cero advertencias o errores.
- Hero, máscaras, estilos originales, galerías, iconos, focus, Contacto y recursos gráficos protegidos comprobados contra el inventario inicial. En `contact.js` solo cambia el nombre; el resto de su código es idéntico.
- Inicio conserva las animaciones cinematográficas/editoriales aprobadas y la navegación interactiva local previa. El nombre cambia; su geometría y motion no.
- Recuperación: etiqueta local `recuperacion/transiciones-identidad-20261119`, archivo `antes-transiciones-identidad.tar.gz`, inventario de 290 archivos y parche previo en `output/cinematic-divisions-2026-11-19/`. Incluye la navegación local que aún no tenía commit.

Las pruebas anteriores a corregir la medición y la continuidad se conservan separadas para trazabilidad; no se utilizan como QA final. Las capturas comparativas finales tienen dimensiones idénticas: 1440×900 y 390×844.

## Archivos modificados en esta intervención

- `README.md`
- `contacto/README.md`
- `contacto/assets/contact-data.json`
- `contacto/build.py`
- `contacto/contact.js`
- `contacto/index.html`
- `docs/arq.html`
- `docs/media-printing-name-corrections-2026-11-19.json`
- `experimentos/contacto-inteligente/README.md`
- `experimentos/contacto-inteligente/assets/contact-data.json`
- `experimentos/contacto-inteligente/build.py`
- `experimentos/contacto-inteligente/contact.js`
- `experimentos/contacto-inteligente/index.html`
- `experimentos/inicio-v01/content.json`
- `experimentos/inicio-v01/index.html`
- `experimentos/inicio-v01/verify.py`
- `linkbranding/index.html`
- `media-branding/build.py`
- `media-branding/index.html`
- `media-branding/template.html`
- `media-print/README.md`
- `media-print/content.json`
- `media-print/editorial-trace.json`
- `media-print/index.html`
- `shared/divisions/cinematic-resize.js`
- `shared/divisions/cinematic.css`
- `shared/divisions/cinematic.js`
- `shared/divisions/cinematic.py`
- `shared/divisions/render.py`
- `shared/divisions/verify.py`
- `shared/divisions/verify_cinematic.py`
- `shared/inicio/verify.py`
- `tools/verify_identity.py`

Además permanecen los archivos modificados de navegación que ya existían al comenzar; no se descartaron ni se hizo commit de ellos.

## Pendientes reales

- Safari macOS pendiente: se respetó la instrucción de utilizar Chrome y dejar Safari libre para el otro agente.
- Pruebas físicas iOS/iPadOS/Android y gestos táctiles en hardware pendientes. Se validó viewport y scroll nativo emulado, sin afirmar pruebas físicas.
- Aprobación visual pendiente. GitHub Pages sigue sirviendo la versión publicada anterior.
- Contacto y Newsletter siguen sin backend real, y los recursos conceptuales mantienen sus identificaciones existentes. No se modificaron esos alcances.

Las evidencias están en `output/cinematic-divisions-2026-11-19/`: comparativas desktop/móvil, imágenes por página/progreso, `chromium-qa.json`, `reference-original.json`, `layout-before-after.json`, `http-resources-qa.json`, consola y registros de compilación. Ninguna captura o informe de QA forma parte del paquete estático de producción.
