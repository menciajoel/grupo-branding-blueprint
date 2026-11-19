# Navegación interactiva de Divisiones — revisión local

Fecha: 19-11-2026. Estado: implementado localmente; pendiente de aprobación visual. Sin commit, push ni despliegue. Rama `codex/navegacion-divisiones`; base publicada `f1b6678a8b84c441ab4357fa37776387298a0149`.

## Vista previa

- Recorrido desde el hero: http://192.168.68.120:4190/experimentos/inicio-v01/
- Convergencia directa: http://192.168.68.120:4190/experimentos/inicio-v01/#explorar-divisiones
- En este equipo: http://127.0.0.1:4190/experimentos/inicio-v01/

El servidor de 4190 sirve `_site/`, compilado sin prefijo. La fuente existente en 4173 permanece disponible. GitHub Pages conserva la versión anterior.

## Implementación

- «Conoce nuestras divisiones» usa un ancla real y el scroll nativo hacia el tramo B de la secuencia existente. Desktop: reloj .505 de 1.72; composición de flujo: .04 de 1.26. No abre una ficha de destino. La carga directa del fragmento espera `load` y fuentes para no competir con la restauración nativa del navegador.
- Cada polígono oficial y su fotografía están envueltos por un enlace SVG nativo. No se agregan polígonos, máscaras, geometrías ni superficies rectangulares superpuestas. El acierto del puntero depende del polígono pintado; el contenido fotográfico no captura eventos por separado.
- Izquierda: Media Branding; superior derecha: Linkbranding; inferior: Media Print. Los tres nombres son ahora enlaces HTML alternativos a las mismas páginas reales. Sus destinos relativos también conservan el prefijo del repositorio en Pages.
- Piezas y nombres comparten el mismo controlador de hover/foco, el mismo revelado de color y las mismas conexiones. La retirada del puntero recupera el estado neutral cuando no hay foco de teclado. Un clic, Enter o activación táctil nativa sigue el enlace; no se intercepta para cambiar de capítulo.
- Solo los tres enlaces de la copia SVG visible entran en el orden de tabulación durante la exploración. Las copias decorativas y los capítulos posteriores mantienen los enlaces de piezas desactivados. El límite `inert` del hero se aplica a su bloque editorial, para conservar accesibles las piezas de su SVG al llegar al centro.
- Las cajas transparentes de composición desktop dejan pasar el puntero; los nombres y el contenido informativo conservan sus áreas reales. Los espacios vacíos del isotipo no se convierten en enlaces ni bloquean el scroll.
- Foco visible de 2 px en piezas y nombres. El anillo de los nombres se dibuja dentro de su máscara de revelado existente, para que no quede recortado. El acento bajo el nombre también mantiene el estado de foco aprobado.

Las timelines, curvas, duración, poses, giro de 360°, longitudes de pin, fotografías y geometrías no se han recalibrado. `styles.css`, los cuatro recursos cinematográficos, ARQ-02/COPY-03 y las otras cuatro páginas mantienen sus bytes originales.

`division-navigation-contract.json` registra exclusivamente los fragmentos de interacción sustituidos en `motion.js`. El verificador invierte esas sustituciones exactas antes de cotejar el hash histórico: cualquier modificación del resto de la coreografía sigue causando un fallo. No se actualizó `shared/inicio/approval.json` para declarar una aprobación visual anticipada.

## QA en Chromium

| Formato | Comprobación |
| --- | --- |
| 1440×900 | CTA desde hero, hover en las tres piezas y tres nombres, recuperación neutral, seis destinos reales, Tab/Shift+Tab/Enter, foco visible, scroll adelante/atrás y desactivación de enlaces fuera de la convergencia. |
| 768×1024 | CTA, tres piezas y tres nombres: seis navegaciones correctas con una activación. Tres áreas independientes visibles, sin overflow horizontal. |
| 1024×768 | Composición horizontal, ancla/CTA y tres áreas de impacto visibles y diferenciadas. |
| 390×844 y 320×568 | CTA y seis destinos en cada formato; ninguna segunda activación requerida. Capturas y ausencia de overflow horizontal. Ancla directa adicional en 390×844. |
| 375×667 y 430×932 | CTA y las tres superficies visibles/independientes; sin overflow horizontal. |
| 1920×1080 | CTA, llegada al centro y tres superficies de impacto independientes. |
| Resize encadenado | 1440×900 → 768×1024 → 390×844 → 1024×768 → 1440×900: estado centrado conservado, tres enlaces habilitados, fotografías neutrales y sin overflow horizontal. |
| Movimiento reducido | Alternativa estática mediante el control existente: CTA, piezas y nombres disponibles; Enter sobre Linkbranding abre su página. Las consultas originales de `prefers-reduced-motion` permanecen intactas; no se cambió la preferencia del sistema. |

El Tab **nativo**, desde el foco que deja el CTA, conserva `scrollY=568` y la pose B exacta: `translate(432 174.83902439024394) scale(2.6016260162601625) rotate(360 110.7 105.765)`. Los enlaces reales se comprobaron con clic en puntos interiores de las siluetas, no con eventos JavaScript sintéticos. Las pruebas de viewport no equivalen a gestos en hardware táctil físico.

Consola Chromium: cero advertencias o errores capturados. Las muestras estables se toman después de la llegada y del scrub; el JSON conserva también observaciones intermedias de la prueba.

## Compilación y protección

- Compilaciones local y con `/grupo-branding-blueprint`: correctas.
- Verificación de 46 bloques de Inicio, identidad oficial, fotografías/máscaras, casos documentales, rutas de cinco páginas y Contacto: correcta.
- Sintaxis de `motion.js` y `git diff --check`: correctas.
- 148 archivos estáticos empaquetados; el contrato de verificación, fuentes, QA y recuperaciones no se publican como recursos del runtime.
- Recuperación local: etiqueta `recuperacion/navegacion-divisiones-20261119`; inventario de 287 archivos y `antes-navegacion.tar.gz` en `output/navegacion-divisiones-2026-11-19/`. No se eliminó ningún archivo protegido.

## Evidencias y límites

Capturas y registros excluidos de Git en `output/navegacion-divisiones-2026-11-19/`:

- `convergencia-desktop-final.jpg`, `hover-linkbranding-final.jpg`.
- `desktop-pieza-media-branding.jpg`, `desktop-pieza-linkbranding.jpg`, `desktop-pieza-media-print.jpg`.
- `focus-nombre-desktop.jpg`, `focus-pieza-desktop.jpg`.
- `convergencia-768x1024.jpg`, `convergencia-mobile-final.jpg`, `convergencia-320x568.jpg`.
- `movimiento-reducido.jpg`, `chromium-qa.json`, `consola-chromium.json`, registros de compilación y recuperación.

Safari queda pendiente por indicación expresa de Joel de utilizar Chrome y dejar Safari al otro agente. No se declara compatibilidad física iOS/iPadOS/Android verificada. No se cambió el comportamiento de backend ni de otras páginas.

## Archivos

- `experimentos/inicio-v01/build.py`: render de los enlaces reales y hash del CSS acotado.
- `experimentos/inicio-v01/template.html` e `index.html`: ancla de convergencia, enlaces SVG/HTML y recurso CSS.
- `experimentos/inicio-v01/motion.js`: navegación y accesibilidad de las superficies, sin cambios de coreografía.
- `experimentos/inicio-v01/division-navigation.css`: hit testing y foco; sin tamaños, geometrías ni animaciones nuevas.
- `experimentos/inicio-v01/division-navigation-contract.json`, `verify.py` y `shared/inicio/verify.py`: contrato y verificaciones de conservación.
- Este informe.
