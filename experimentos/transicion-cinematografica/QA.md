# Revisión local — planos suspendidos

Fecha: 18 de noviembre de 2026. Base aprobada: `735a12b909beaa53291c7246da3a008ecf30143b`.

URL: <http://192.168.68.120:4176/experimentos/transicion-cinematografica/?ensayo=planos#soluciones>.

## Mecanismo comprobado

El sticky original solo corresponde a `.solution-visual`. No suspende la sección completa. La capa experimental incorpora un contenedor alrededor de Soluciones y Proyectos, sin padding, margen, altura fija ni spacer. Soluciones utiliza sticky negativo calculado según su altura real; así se recorre su contenido antes de detener el último viewport visible. El origen de escala corresponde al centro de ese fragmento.

Proyectos no recibe transformaciones: su ascenso depende del scroll nativo. Su fondo opaco y su nivel superior lo hacen pasar por delante. El contenedor limita la permanencia de Soluciones al recorrido de estas dos secciones. No se añadió ningún pin.

En 1440 × 900, Proyectos pasó por y = 900 → 675 → 450 → 225 → 0 px. Soluciones pasó por escala 1 → .97 → .94 → .91 → .88; su marco superior pasó por 0 → 11.5 → 23 → 34.5 → 46 px, debido al retroceso, sin acompañar el desplazamiento de 900 px del documento. El regreso reprodujo los mismos estados.

## Pruebas

| Configuración | Resultado |
|---|---|
| 320 × 480 y 320 × 568 | Escala móvil 1 → .94; cobertura y reversión correctas |
| 375 × 667 y 375 × 812 | Sin desbordamientos; alturas estables durante el recorrido |
| 390 × 667 y 390 × 844 | Suspensión y márgenes; retorno a escala 1 |
| 430 × 740 y 430 × 932 | Cobertura completa; no fue necesario desactivar el efecto |
| 768 × 1024 y 1024 × 768 | Escala 1 → .88; recorrido reversible |
| 1440 × 900 y 1920 × 1080 | Profundidad y planos independientes, sin pin adicional |
| 740 × 390 horizontal | Variante móvil .94, sin reutilizar la intensidad desktop |
| Resize 390 × 740 → 844 → 667 → 740 × 390 → 390 × 740 | ScrollY se mantuvo en 3518 px en la prueba; recálculo local de límites y geometría |
| Scroll lento, cambios de dirección y recorrido rápido | Estados coherentes y recuperación de escala 1 |
| Selección de Soluciones durante el relevo | Clic operativo en el contenido visible |
| Teclado | Tab salta al CTA de Proyectos cuando el siguiente botón de Soluciones ya está cubierto; los controles se recuperan al subir |
| `prefers-reduced-motion: reduce` emulado en DevTools | Sticky y escala desactivados; flujo estático, sin trigger experimental |
| Control manual de reducción | Desactiva y restaura la capa; mantiene la lógica heredada del hero |
| Consola Chromium final | Sin errores JavaScript ni advertencias capturadas |

No se añadió un tramo de scroll: las capturas de comparación de 1470 × 780 y 390 × 740 conservaron exactamente el inicio/final natural de Proyectos y la altura total de la página respecto de la base aprobada. El único pin presente en modo animado sigue siendo el del hero. Los doce tamaños de la matriz conservaron su altura de documento durante la transición.

Durante QA se corrigieron dos detalles propios de esta capa: límites obsoletos al cambiar solo la altura móvil y foco de teclado detrás del plano delantero. No se modificó el script aprobado para resolverlos.

## Evidencia

Carpeta local: `output/transicion-cinematografica-2026-11-18/`.

- `comparativa-desktop.mp4`: Inicio aprobado a la izquierda; experimento a la derecha, bajada y subida completas.
- `comparativa-movil.mp4`: mismo recorrido en 390 × 740.
- `secuencia-desktop-suspendido.jpg` y `secuencia-movil-suspendido.jpg`: estados A, B, C y D.
- `plano-suspendido-qa.json`: mediciones de los doce viewports.
- `plano-suspendido-resize-final.json`, `plano-suspendido-teclado.json` y `plano-suspendido-reduced-system.json`: comprobaciones específicas.
- `video-frames/*/capture.json`: posiciones reales de scroll de cada secuencia comparativa.
- `proteccion.json`: hashes de los 190 archivos versionados y referencias de recuperación previas.

Los videos se montaron con capturas nativas de Chrome y entrada nativa de scroll muestreada, a 12 capturas por segundo de reproducción. Muestran los estados reales del navegador y ambos sentidos; no son una medición de FPS ni una grabación de rendimiento en tiempo real. No se sintetizó el efecto en posproducción.

## Límites pendientes

- La última variante de sticky suspendido **no se ha validado en Safari**. Safari estaba siendo utilizado para la revisión del usuario. Las pruebas de Safari de variantes anteriores no acreditan esta implementación.
- No se probó un teléfono/iPad físico ni una sesión táctil real. La validación móvil descrita corresponde a Chromium con viewport emulado y entrada de scroll/clic/teclado.
- Alternar el control manual de reducción en mitad de la página recompone también el hero heredado y puede cambiar la posición de lectura. No se intervino esa lógica aprobada.
- No se hizo un perfil instrumental de rendimiento. El video muestreado no permite afirmar una tasa de cuadros determinada.

Inicio aprobado, ARQ-02, COPY-03 y configuración de publicación permanecen intactos. No se creó commit, push ni despliegue.
