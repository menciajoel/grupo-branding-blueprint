# Ensayo local de profundidad: Soluciones → Proyectos

## Estado consolidado — 18 de noviembre de 2026

La transición y el cierre editorial de Contacto fueron aprobados formalmente e integrados en `experimentos/inicio-v01/`, que conserva su ruta pública. La fuente única de sus cuatro recursos es `shared/inicio/`; el código se trasladó sin modificar sus bytes. `shared/inicio/approval.json` registra las huellas de aprobación y el cuerpo HTML aprobado.

Esta carpeta se conserva como referencia técnica con su generador, baseline histórico y los dos informes de QA. `build.py` reconstruye una copia navegable desde el Inicio consolidado, reutilizando esos recursos. Los HTML, CSS, JavaScript y assets copiados, junto con `demo/` y sus videos, son salidas locales ignoradas por Git. No se suben ni forman parte de GitHub Pages. Los originales locales se conservan.

Las secciones siguientes documentan el experimento y sus pruebas previas a la consolidación. Las rutas con IP dependen de la red local y del servidor de revisión.

Ruta local: <http://127.0.0.1:4173/experimentos/transicion-cinematografica/>.

La transición se aplica a Soluciones → Proyectos por indicación del director. El orden aprobado sigue siendo Divisiones → Soluciones → Proyectos. No se ha retirado ni reordenado contenido.

```sh
python3 -B experimentos/transicion-cinematografica/build.py
python3 -m http.server 4173 --bind 127.0.0.1
```

Si el servidor 4173 ya está activo, conservarlo. Sirve la raíz del repositorio.

- `index.html`: copia del HTML aprobado, con sus mismos bloques editoriales, destinos navegables y orden. Se añaden una clase de aislamiento, un contenedor no visual alrededor de Soluciones + Proyectos y los dos recursos de esta prueba.
- `styles.css`, `motion.js`, `assets/`: copias exactas de la versión aprobada; `baseline.json` registra sus hashes y el commit de referencia.
- `cinematic.css`: apilamiento de dos planos, suspensión mediante `position:sticky`, recorte del área ya recorrida y velo de oscurecimiento sin interacción. No cambia alturas ni añade filtros de blur.
- `cinematic.js`: una única timeline y un único ScrollTrigger **sin pin**. Soluciones se recorre normalmente hasta que su extremo inferior llega al borde inferior del viewport. Entonces se suspende, pasa de escala 1 a 0.88, se desplaza −8 px y recibe un velo negro del 20 %. Proyectos conserva el movimiento nativo y asciende por delante hasta cubrirla completamente. El scroll inverso recupera la escena y su desplazamiento normal.
- `build.py`: reconstruye exclusivamente esta carpeta. Lee las fuentes aprobadas sin escribir en ellas.

Hasta 700 px, y en formatos horizontales de hasta 1000 × 500 px, el efecto se adapta: escala 1 → 0.94, velo negro máximo del 12 % y desplazamiento de Soluciones de 0 a −4 px. Proyectos conserva exclusivamente su ascenso nativo. No se excluyen teléfonos por su altura. El efecto se desactiva con `prefers-reduced-motion` y con el control de movimiento existente. No cambia el hero, no intercepta wheel/touch/teclado, no crea scroll artificial y no añade otro pin.

El contenedor conserva la suma de las alturas originales. Como Soluciones puede superar la altura de pantalla, se permite leer todo su contenido antes de suspender el último viewport visible. El recorte superior afecta únicamente a la parte que ya salió de pantalla; no elimina HTML ni contenido editorial. Los controles cubiertos por Proyectos se retiran temporalmente del foco mediante `inert`; recuperan su estado al volver hacia arriba. Un único observador de tamaño y un listener de resize recalculan esta transición, con limpieza al cambiar de media query o reducir movimiento.

Revisión desde otro dispositivo en la misma red Wi-Fi: <http://192.168.68.120:4176/experimentos/transicion-cinematografica/#soluciones>. El servidor LAN de revisión sirve únicamente esta prueba y las páginas estáticas compiladas; no expone el repositorio completo. La IP puede cambiar si cambia la red.

Esta carpeta no pertenece a `PAGES` del empaquetado de producción. No se enlaza desde la versión aprobada. Las animaciones integradas sí se publican desde `shared/inicio/`, por autorización del director; no se publica esta copia de revisión.

Resultados, videos y limitaciones: [QA.md](QA.md).

Videos comparativos reproducibles también desde el teléfono: <http://192.168.68.120:4176/experimentos/transicion-cinematografica/demo/>. Se sirven en la misma copia experimental, sin autoplay ni modificación de la interfaz del Inicio.

## Cierre editorial de Contacto

Vista local: <http://192.168.68.120:4176/experimentos/transicion-cinematografica/?ensayo=cierre#contacto>. Para observar la aproximación mediante scroll, comenzar en `#por-que`.

La transición Soluciones → Proyectos está formalmente aprobada y permanece congelada: `cinematic.js` y `cinematic.css` no se modificaron para incorporar este cierre.

- `closing.css`: compone exclusivamente las transformaciones del isotipo existente de Contacto. No oculta contenido ni modifica medidas.
- `closing.js`: entrada editorial de titular completo, acomodo del isotipo, mensaje y CTA; firma final breve, con regreso al invertir el scroll. No añade pin ni altera el desplazamiento.
- `build.py`: incorpora estos dos recursos al HTML generado del mismo experimento. El cuerpo de la página conserva exactamente el HTML anterior.

El titular parte de 35 px y opacidad 0; el símbolo se acomoda desde −10°; el mensaje comienza en 0.82 s y el CTA en 0.97 s. La firma realiza un gesto de 2.5° y regresa a 0° en 0.6 s. En formatos bajos se utiliza el último intervalo visible del símbolo para que la firma no suceda fuera de pantalla. No hay bucles.

La entrada termina aunque se detenga el scroll. Al volver por encima de su punto de activación, se revierte y queda preparada para una nueva llegada. El estado leído se conserva al redimensionar. El CTA se revela inmediatamente si recibe foco por teclado. Sin JavaScript o con movimiento reducido, el contenido permanece visible.

Pruebas, capturas y límites históricos: [CIERRE-QA.md](CIERRE-QA.md). El cierre recibió aprobación posterior y su integración se registra en `shared/inicio/approval.json`.
