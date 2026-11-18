# Inicio · Experimento 02

Prototipo completo de las ocho secciones de Inicio. Reemplaza la exploración anterior en esta misma carpeta. Pendiente de aprobación por dirección de arte. La portada pública y `docs/arq.html` permanecen intactas.

## Ejecutar y editar

Desde la raíz del repositorio:

```sh
python3 -B -m http.server 4173 --bind 127.0.0.1
```

Abrir `http://127.0.0.1:4173/experimentos/inicio-v01/`. La carpeta es autónoma: también puede servirse desde otra ubicación con sus recursos relativos. No requiere instalación, servicios externos ni compilación para ejecutarse.

- `content.json`: copia estructurada de COPY-03, destinos y casos documentados. No contiene decisiones de composición. El contenido debe mantenerse aprobado durante esta etapa.
- `media.json`: fotografías, variantes locales, créditos, licencia, texto alternativo y punto focal.
- `build.py`: renderiza el contenido en la estructura fija de `template.html`; genera `index.html`. Ejecutar `python3 -B build.py` tras una edición editorial.
- `styles.css`: composición, tipografía, color y responsive. `motion.js`: control de presentación, GSAP, navegación y estados. Estas capas quedan fuera del futuro editor de contenido.
- `assets/vendor/`: GSAP 3.15.1 y ScrollTrigger oficiales, alojados localmente. No se decide aquí el stack o CMS definitivo.

## Movimiento y jerarquía actuales — revisión local

**Tres fuerzas, un grupo.** El hero, su tipografía y la convergencia conservan el giro acumulado de 360° del contenedor común del SVG. Sus piezas nunca se separan. Las fotografías y los polígonos oficiales permanecen intactos.

En la convergencia no hay selección automática. Hover en escritorio o foco de teclado previsualizan una empresa: solo su par revela el color oficial. Al salir se recuperan las tres fotografías. Los botones permiten navegar directamente a su capítulo, pero ningún clic es obligatorio. No existe bloqueo, interceptación de rueda/teclas ni memoria de desbloqueo por pestaña.

Al continuar el scroll aparecen Media Branding, Linkbranding y Media Print, en ese orden. En escritorio el símbolo alcanza su posición aprobada a la derecha y permanece inmóvil durante los tres capítulos. Los textos salen hacia arriba y entran desde abajo; cada cambio restaura la fotografía anterior antes de revelar el siguiente color. Colores exactos: `#0035d8`, `#092589`, `#1daabc`. Una sola timeline editorial controla paneles y color; el scroll inverso recorre los mismos estados. Los dos enlaces secundarios navegan a los capítulos correspondientes.

El primer tramo conserva su distancia original: a 1440 × 900, hero → convergencia → primera división ocupa 1125 px. Los tres capítulos comparten otros 810 px, con un pin total de 1935 px; no hay tres pantallas adicionales. En tablet y móvil la timeline editorial ocupa `clamp(420, 78vh, 760) × 1.26` px: 958 px en iPad y 829 px en 390 × 844. Cada capítulo no equivale a una pantalla.

En tablet, el mismo SVG animado tiene una ventana recortada propia debajo de la lectura del hero. Tras la convergencia se mantiene centrado arriba; la información aparece debajo. En horizontal, introducción y marca forman dos columnas bajo el símbolo. Las conexiones se reservan al escritorio. En móvil, las empresas se apilan bajo el isotipo y la introducción general precede a la escena fijada; el símbolo nunca viaja lateralmente. Los controles tienen al menos 44 px. Cambiar de orientación conserva el punto de lectura de la convergencia o del capítulo; la restauración se limita al resize dentro de esta escena.

La empresa activa domina la jerarquía mediante su SVG oficial. La introducción aprobada usa un cuerpo editorial secundario. Los anchos ópticos de los logotipos son distintos según su relación de aspecto; las cajas verticales reservan una misma altura para mantener estables párrafos y CTA. No se modifica ningún archivo de identidad.

Con `prefers-reduced-motion` o el control manual, no hay pin, giro ni desplazamientos: las tres empresas quedan legibles en el flujo natural. Viewports extremadamente bajos usan también una presentación sin pin. Sin JavaScript, el contenido permanece en el HTML.

Los CTA conservan las rutas ARQ-02 mediante `data-route`. Como las páginas completas están fuera del alcance, el prototipo abre las vistas de revisión existentes (`?vista=media-branding`, `?vista=linkbranding`, `?vista=media-print`); no se han implementado aquellas páginas.

## Recuperación

HEAD se mantiene en `0549555ec3f0de294e201b35fa548c0051e823aa`. No se ha hecho commit, push ni publicación.

- `inicio-antes-seleccion-directa`: árbol local `0e4ff4a182ec49ead27a000acd698634dd80ab2a`, conservado.
- `inicio-antes-jerarquia-editorial`: árbol local `162f37099521848cc2b2e30834e4fedb62b4a44f`, estado previo al adendum visual, incluidos los cambios locales de secuencia.
- `inicio-antes-transicion-v03`: commit `a869328fe0aefe18da7a7268590d793cb1400980`, conservado.

Las etiquetas de árbol se crearon con un índice temporal, sin crear commits ni tocar el índice normal. Recuperación selectiva cuando se autorice: `git restore --source=inicio-antes-jerarquia-editorial --worktree -- experimentos/inicio-v01/`. No ejecutar durante esta revisión. Los manifiestos y parches previos están en `output/playwright/` (ignorado por Git).

## Verificación

```sh
python3 -B build.py
python3 -B verify.py
node --check motion.js
```

`verify.py` contrasta los 46 bloques de Inicio, casos y estados del formulario con COPY-03; verifica los vectores oficiales, sus máscaras, recursos y hashes de la documentación protegida.

La validación visual actual se realizó mediante navegador real controlado por CUA y emulación responsive. `verify-browser.py` pertenece a la interacción anterior y no certifica esta secuencia; no se ejecutó como prueba vigente.

Evidencias: `output/playwright/revision-divisiones.html` contiene las doce capturas finales (convergencia y tres empresas en escritorio, tablet y móvil). Las comparaciones se guardan como `revision-desktop.jpg`, `revision-tablet.jpg` y `revision-movil.jpg`. Informe local: `design-qa.md`. Estos materiales están ignorados y no se publican.

Se comprobaron viewports de 320 a 1920 px, ambos formatos de iPad, recorrido inverso, scroll rápido, acceso con teclado, color exclusivo por par, CTA y alternativa manual de movimiento reducido. Safari 26.6.2 en macOS se comprobó en escritorio y modo responsive 390 × 844, 768 × 1024 y 1024 × 768: capítulos, enlaces secundarios, retorno y orientación. La preferencia de sistema de movimiento reducido se emuló desde su inspector y expuso los tres capítulos sin pin. El aviso ResizeObserver observado al rotar se corrigió difiriendo sus mediciones a requestAnimationFrame; la consola quedó limpia tras recargar y repetir ambas orientaciones. iPad físico, Safari en iPadOS y gestos táctiles reales siguen pendientes. No se declara compatibilidad completa en dispositivos físicos.
