# Consolidación aprobada · 18 de noviembre de 2026

## Alcance y protección

Se integra en el Inicio existente el motion aprobado del experimento
`experimentos/transicion-cinematografica/`. Los cuatro archivos de ejecución
se conservan sin cambios en `shared/inicio/`; `approval.json` registra sus
SHA-256 y `verify.py` comprueba esos hashes en cada compilación.

Punto de partida: `735a12b909beaa53291c7246da3a008ecf30143b`.
Recuperación local: `consolidacion-antes-integrar-20261118` (árbol completo,
incluido el experimento original). Las etiquetas anteriores se conservan.
La etiqueta de recuperación incluye material de revisión local y no se publica.

No se modifican el CSS ni el JavaScript originales del hero de Inicio,
las divisiones, Contacto, identidades ni `docs/arq.html`. No se implementan
las futuras transiciones cinematográficas de las divisiones.

## Integración

- `experimentos/inicio-v01/template.html`: importa los cuatro recursos aprobados
  y contiene un único contenedor de apilamiento de Soluciones y Proyectos.
- `shared/inicio/`: fuente única del motion aprobado; sin recalibrar valores,
  recorrido, alturas ni pins.
- El experimento conserva constructor, documentación y QA históricos. Sus
  copias generadas, imágenes y videos permanecen locales e ignorados por Git.
- El empaquetador incluye las dependencias nuevas y el icono `play.svg`, que
  el controlador de movimiento selecciona desde JavaScript. Este último se
  declara en `runtime-assets.json`; no cambia el comportamiento del control.
- GitHub Actions comprueba también la sintaxis de los dos nuevos JavaScript.

## Verificación local previa al commit

Compilación aislada del árbol preparado, con prefijo `/grupo-branding-blueprint`:

| Comprobación | Resultado |
| --- | --- |
| Cinco páginas, copy y fuentes aprobadas | Correcto: verificadores de Inicio, Media Branding, Contacto y ambas divisiones |
| Motion y cuerpo de Inicio | Coincidencia exacta con la referencia aprobada; una sola envoltura |
| Paquete estático | 125 archivos, 154 referencias locales verificadas; sin videos, capturas ni informes |
| Sintaxis JavaScript | Nueve archivos comprobados con `node --check` |
| Cinemática Chromium 1440 × 900 | Escalas 1 → 0.94 → 0.88; inversa 0.88 → 0.94 → 1 |
| Cinemática Chromium 390 × 844 | Escalas 1 → 0.97 → 0.94; inversa equivalente |
| Suspensión y apilamiento | Soluciones permanece sticky; Proyectos pasa de abajo al borde superior; un único pin previo |
| Cierre en móvil | Entrada real de titular, isotipo, mensaje y CTA; continúa tras detener el desplazamiento |
| CTA de divisiones en Inicio | Azul `#2e70b4`, verde `#86be3a`, magenta `#ce2a6c`, conservados |
| Galería Media Branding | Seis avances hasta volver a 01/06; retroceso mediante Enter hasta 06/06 |
| Contacto compartido | Origen Grupo sin selección; Linkbranding valor 3 y Media Print valor 4; retorno contextual correcto |
| Tablet 768 × 1024 y móvil 390 × 844 | Sin desbordamiento horizontal en las páginas revisadas |
| Consola Chromium | Sin errores ni advertencias observados en el recorrido local |

Las medidas y capturas de revisión se guardan fuera de producción en
`output/consolidacion-2026-11-18/`.

## Publicación y comprobación posterior

La publicación utiliza el flujo existente de GitHub Pages sobre `main`,
sin force push. Después se debe contrastar `deployment.json.sourceCommit`
con el commit integrado, comprobar sus recursos y abrir las cinco páginas
públicas. La verificación pública y Safari se registran en el informe final
de entrega; esta tabla documenta exclusivamente lo comprobado localmente.

## Límites conservados

- Contacto es demostrativo, sin backend ni simulación de envío real.
- Se conservan las identificaciones de fotografías conceptuales provisionales.
- No se desarrollan Newsletter, páginas de proyecto ni contenido comercial nuevo.
- La emulación responsive no equivale a una prueba física en iOS o Android.
- No se atribuyen métricas de Core Web Vitals de campo ni FPS instrumentados.

El sitio publicado sigue siendo el prototipo público de revisión; no se
despliega en dominios comerciales.
