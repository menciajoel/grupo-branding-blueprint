# Hero responsive — corrección local y QA

Fecha: 18-11-2026. Resultado técnico local: **passed**. Publicación de esta corrección autorizada por el director. La comprobación en los dispositivos físicos indicados continúa pendiente.

## Protección

- Commit base: `7e51481c1a9347a1a7bcf8bd29a0656a89b06069`.
- Etiqueta local: `media-branding-antes-correccion-hero-responsive`, sobre ese mismo commit.
- Baseline SHA-256 y copias anteriores: `output/correccion-hero-responsive-2026-11-18/`.
- 146 archivos previos permanecen idénticos, incluidos Inicio, ARQ-02/COPY-03, datos, SVG, fotografías y controladores de las demás secciones.
- El body HTML de Media Branding es idéntico. Contacto solo cambia el identificador de caché de la hoja compartida; no cambian contenido, diseño ni comportamiento.

## Causa y corrección

La implementación anterior condicionaba la transformación a 840 px de altura en móvil y 900 px en tablet vertical. Al cruzar esos límites se destruía la variante con pin y se sustituía por flujo con progreso binario. En 840→839→840 podía pasar de 42,51 % al 100 % y cambiar scrollY 277→737→638.

Cambios acotados a `motion.js` y reglas del hero en `styles.css`:

1. Se retiran las condiciones de altura de móvil/tablet. La condición corta de escritorio se conserva, limitada expresamente a escritorio.
2. La escena mide `100svh` y el espacio real de titular, descripción, CTA e introducción. Ajusta espacios y tipografía solo cuando lo necesitan esos contenidos, manteniendo tamaños mínimos de lectura. Recalcula después de cargar la fuente y mide en coordenadas de layout, sin incorporar transformaciones de una animación anterior.
3. Mantiene la coreografía, sus tiempos y curvas. El recorte final y el encuadre se adaptan al texto disponible; en composición compacta se conserva el encuadre inicial de la fotografía para que la valla permanezca reconocible.
4. Si una orientación es demasiado baja incluso después del ajuste, mantiene una transformación sincronizada con scroll en flujo nativo. No fuerza contenido dentro de un pin insuficiente, ni elimina la transformación. La información sigue accesible al desplazarse.
5. Conserva progreso continuo durante resize/orientación, incluida la transición entre pin y flujo. Una ráfaga comparte un punto de lectura; la restauración no lo convierte en 0/1.
6. Cada escena anterior se revierte mediante su contexto GSAP antes de reconstruirse. No se acumulan pins. Un nuevo gesto prevalece sobre una restauración pendiente.
7. Si el visitante está en una sección posterior, conserva su ancla de lectura para que recalcular la altura del hero no desplace la sección que estaba viendo.
8. Se mantiene `prefers-reduced-motion`, la navegación nativa, los estados inert/ARIA y el foco. No se modifica configuración global de ScrollTrigger ni se instala ninguna dependencia.

Archivos de implementación: `motion.js`, `styles.css`. HTML generado: `media-branding/index.html` (huellas de CSS/JS), `contacto/index.html` (únicamente huella de CSS compartido).

## Resultados medidos

| Prueba | Resultado |
| --- | --- |
| 375×667, 375×839, 375×840, 390×844, 430×932, 768×899 y 768×900 | Transformación real con pin, cambio progresivo de máscara y contenido legible; CTA y párrafos dentro de la composición. |
| 320×568 | Misma coreografía con composición compacta y tipografía de lectura; sin desbordamiento horizontal. |
| Scroll 0→25→50→75→100→0 | Máscaras y transformaciones cambian realmente y regresan al hero. No se deduce el movimiento de una captura estática. |
| Resize 375×840→375×839→375×840 | Progreso 0,4248→0,4248→0,4248; scrollY se mantiene en 271 en la prueba. |
| Orientación y cambios intermedios: 667×375→375×667→768×899→900×768→768×900→390×844 | Conserva 0,4248 en todos los pasos, incluso al pasar por flujo animado. Un pin o ninguno según la composición, sin duplicación. |
| Ráfaga 320×568→600×900→1200×900→1920×1080→375×667 | Mantiene progreso 0,5000. |
| Gesto durante resize | Avanza a 0,7368 y no vuelve al punto anterior; scroll rápido sale del hero y scroll inverso regresa a 0. |
| Escritorio 1440×900, comparación con versión publicada | Geometría de título, párrafo, CTA, foto e introducción, máscara y opacidades exactamente iguales al 0 %, 50 % y 100 %. |
| Resize desde Proyectos | Su parte superior se conserva en 104,2266→104,2344 px, en lugar de desplazarse con el cambio de altura del hero. La galería continúa navegando. |
| Teclado y CTA | Foco visible; Tab desde CTA continúa a «Qué resolvemos»; CTA abre Contacto en el sitio local. |
| Reduced motion en Chrome real | Inspector confirma `data-motion="reduced"`; al restaurar la preferencia vuelve la presentación animada. Sin forzar movimiento al usuario. |
| Chrome real, perfil Android Pixel 9 (412×924) | Inicializa `pinned`, medidas adaptativas y recorrido; consola con 0 mensajes. Complementa los tamaños responsive probados; no equivale a un Motorola físico. |
| Safari de macOS, diseño responsive | Recorrido real con scroll a 375×667 y 768×899, cambio entre tamaños y contenido completo. Inspector sin errores JavaScript. |
| Integridad y compilación | `verify.py`, `node --check`, compilación aislada y 95 referencias internas del artefacto pasan. |

El desplazamiento numérico necesario al cambiar de orientación se recalcula para conservar el mismo momento visual; no se mantiene un scrollY obsoleto cuando cambia la longitud del recorrido. Dentro de una variación de 1 px no aparece el salto al final anterior.

## Evidencias

Carpeta: `output/correccion-hero-responsive-2026-11-18/`.

- `matriz-principal.json`: tamaños solicitados, geometría y cantidad de pins.
- `resize-orientacion.json`: conservación de progreso entre formatos.
- `gestos-y-burst.json`: ráfagas, nuevo gesto, scroll rápido e inverso.
- `desktop-comparacion.json`: geometrías antes/después idénticas.
- `secciones-posteriores-resize.json`: preservación de Proyectos.
- `proteccion-final.json`: archivos protegidos y alcance de las diferencias.
- `medicion-layout-final.json`: misma máscara y posición del texto en una carga fresca de 375×839 y al volver desde horizontal.
- `final-movil-hero.jpg`, `final-movil-resolve.jpg`, `final-tablet-hero.jpg`, `final-tablet-resolve.jpg`: composición final.
- Capturas y registros `safari-*`, `chrome-android-*`, `chrome-reducido-dom.txt` y `chrome-consola-final.txt`.

## Límites reales

### Comprobación adicional durante la publicación

La inspección pública detectó un desplazamiento residual en las líneas del titular al cruzar de móvil a escritorio sin recargar. La carga directa de escritorio no lo presentaba. Se declara `y:0` en ambos extremos del tween de entrada, junto con `yPercent`, para evitar que al reconstruir el contexto se conserve una traslación en píxeles. No cambia el recorrido ni el timing aprobados.

Se reprodujo el defecto y se comprobó su corrección en la cadena 1440×900→375×667→768×899→768×900→900×768→1440×900: progreso conservado en 0,4242, una sola envoltura de pin, cero desbordamientos y las cuatro líneas con traslación final cero. Al volver al inicio, el titular permanece completo. Evidencias adicionales en `output/publicacion-hero-2026-11-18/`.

No se dispone de acceso directo a Motorola Edge 50 Pro/Edge 60 Fusion, iPad Mini 5/iPad 10 ni Safari iOS físico. La emulación y Safari de macOS no reproducen íntegramente las barras, preferencias ni rendimiento de esos dispositivos. Su revisión física queda pendiente del director.

Safari emitió una advertencia no bloqueante sobre la precarga de Inter Tight no utilizada durante los primeros segundos; no se observó un error JavaScript asociado. No se alteró la fuente aprobada ni su configuración durante esta corrección. No se midieron FPS en dispositivos físicos.

## Revisión local

- En este Mac: `http://127.0.0.1:4173/media-branding/`.
- En Motorola/iPad conectados a la misma red del Mac: `http://192.168.68.120:4174/media-branding/`.

El segundo servidor sirve exclusivamente el paquete estático `_site/`, sin originales, capturas, Python ni informes internos. Ambos servidores permanecen activos. No hay túnel público ni despliegue a dominios comerciales. La corrección se publica mediante el workflow existente de GitHub Pages en https://menciajoel.github.io/grupo-branding-blueprint/media-branding/. El commit y el resultado del despliegue quedan registrados en Git y GitHub Actions.
