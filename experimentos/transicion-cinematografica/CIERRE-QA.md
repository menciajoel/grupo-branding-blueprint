# Contacto — cierre cinematográfico local

18 de noviembre de 2026. Implementación exclusiva en `experimentos/transicion-cinematografica/`.

## Resultado

Se conserva la composición, el copy, la tipografía y el isotipo oficial existente de `06 / CONTACTO`. No se introducen elementos ni contenedores en la sección. Solo se añaden `closing.css` y `closing.js` en el head del HTML generado.

| Momento | Implementación |
|---|---|
| Titular | Bloque completo, y: 35 → 0 px, opacidad 0 → 1, 0.9 s, `power3.out` |
| Isotipo | Desde 0.20 s, rotación −10° → 0°, x: 8 → 0 px, y: 6 → 0 px, 1 s, `power2.out` |
| Mensaje | Desde 0.82 s, y: 18 → 0 px, opacidad 0 → 1, 0.65 s |
| CTA | Desde 0.97 s: 150 ms después del inicio del mensaje; y: 14 → 0 px, opacidad 0 → 1, 0.6 s |
| Firma final | 0° → 2.5° → 0°, desplazamiento máximo de 2 px, duración total 0.6 s |

La entrada es temporal, activada con ScrollTrigger al llegar el contenedor del titular al 94 % del viewport. No utiliza scrub ni pin: termina al detenerse el visitante. La firma tiene su propio umbral de scroll y espera a que termine la entrada; sus propiedades se componen con las del acomodo inicial, sin sobrescribirlas. El gesto se revierte al cruzar su umbral hacia arriba y no se repite en bucle.

La ubicación aprobada del isotipo es alta y puede abandonar antes la pantalla en teléfonos de poca altura. El umbral de firma se ajusta a su último intervalo visible, sin desplazar el gráfico a otra parte de la composición ni prolongar la sección.

## Protección de lo aprobado

Punto de recuperación local completo: `output/cierre-cinematografico-2026-11-18/recuperacion/`. El registro `proteccion.json` conserva los hashes anteriores y las etiquetas existentes.

Archivos congelados de la transición aprobada:

- `cinematic.js`: SHA-256 `50029421a5c50d0cad0f00420b41be3ef2e3ee5aae5cd06992825db0a3e87b15`.
- `cinematic.css`: SHA-256 `d21bf083aa661ac039e38f6a95af243ccd4bc17ccc4a296314bd358227511986`.

También se conservan `styles.css`, `motion.js`, los recursos, el cuerpo HTML y las páginas aprobadas. No se modifica ARQ-02 ni COPY-03. El commit de referencia sigue siendo `735a12b909beaa53291c7246da3a008ecf30143b`.

## Pruebas realizadas

| Prueba | Resultado |
|---|---|
| Chromium 1440 × 900 | Entrada animada real, giro y firma; estados completos al detener el scroll |
| Chromium 768 × 1024 y 1024 × 768 | Composición conservada, entrada/reversión y CTA visibles |
| Chromium 320 × 568, 390 × 844 y 430 × 932 | Movimiento real, sin desbordamiento horizontal ni pérdida de contenido |
| Scroll ascendente y descendente | La entrada vuelve al estado preparado al abandonar la sección hacia arriba y se reproduce al regresar |
| Gesto final | Se registró un ángulo distinto de cero y regreso a 0°; sin animación infinita |
| Llegada desde navegación | El foco de la sección no cancela la entrada; el titular se observó en opacidad intermedia |
| Teclado hacia CTA | Enlace enfocado correctamente; todo el contenido se revela inmediatamente |
| Scroll detenido | Titular, párrafo y CTA terminan en opacidad 1 |
| Resize encadenado 390 × 844 → 932 → 667 → 844 | ScrollY se conservó en 6441 px y el contenido leído permaneció en opacidad 1 |
| `prefers-reduced-motion: reduce` real emulado en DevTools | Sin entrada, firma ni estados ocultos; transforms de texto e isotipo eliminados |
| JavaScript desactivado en DevTools + recarga | Titular, mensaje y CTA visibles en opacidad 1; enlace correcto; sin depender de clases JS |
| Safari macOS | Revisión visual desktop, tablet 768 × 1024 y móvil responsive 390 × 844; entrada, firma, regreso y CTA operativo |
| CTA en Safari | Abrió `/contacto/?origen=grupo-branding`; regreso funcional a la página experimental |
| Consolas | Sin errores JavaScript capturados en Chromium ni visibles en la consola de Safari |

Se verificó movimiento, no solo visibilidad: antes de la entrada se midieron y = 35 px, opacidad 0 y rotación −10°; durante ella se registraron valores intermedios de opacidad y matrices de rotación; al terminar, textos en opacidad 1 y orientación original. La diferencia programada mensaje → CTA es de 150 ms; las muestras confirmaron ese orden.

Las alturas de Contacto antes/después permanecieron iguales: 634 px en 1440 × 900; 491 px en 768 × 1024; 511 px en 1024 × 768; 548 px en 320 × 568; 571 px en 390 × 844 y 430 × 932. El pin existente del hero se mantiene; no se añade ninguno.

Regresión de la transición aprobada en Chromium:

- Desktop: escalas `1 → .94 → .88 → .94 → 1`; Proyectos y = `900 → 450 → 0 → 450 → 900`.
- Móvil: escalas `1 → .97 → .94 → .97 → 1`; Proyectos y = `844 → 422 → 0 → 422 → 844`.
- Misma cantidad de pins y sin desbordamientos.

## Respaldo y accesibilidad

El HTML y el CSS base muestran siempre el copy. Los estados ocultos se aplican únicamente tras verificar GSAP y preparar el mecanismo de respaldo. Un error de inicialización restaura la composición estática. Un observador de visibilidad con temporizador acotado fuerza el contenido final si una entrada visible no termina. No se retiran textos del árbol accesible ni se cambian destinos.

El estado de entrada/firma completadas sobrevive a reconstrucciones de media queries para no ocultar contenido leído al cambiar el viewport. Al salir hacia arriba se restablece la posibilidad de reproducir la secuencia. Los observadores, listeners, timelines y temporizadores propios se limpian al cambiar el modo de movimiento.

## Evidencia y límites

Capturas y mediciones: `output/cierre-cinematografico-2026-11-18/`. Incluye `chromium-qa.json`, `entrada-movil.json`, `firma-movil.json`, `resize-cierre.json`, `movimiento-reducido-sistema.json`, `javascript-desactivado.json`, capturas de Safari y la comprobación de la transición congelada.

Las pruebas móviles son emulación responsive en navegadores de escritorio; no se probó hardware iOS/Android ni interacción táctil física. Safari se revisó visualmente; la conservación de estado tras el último ajuste de resize se midió en Chromium. No se realizó una medición de campo de Core Web Vitals: se conservaron estructura, alturas y recursos visuales, y solo se animan transformaciones y opacidad.

El cierre queda para aprobación creativa. Sin commit, push ni publicación.
