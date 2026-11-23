# Navegación corporativa y Servicios complementarios · 23-11-2026

Joel autoriza implementar, integrar y publicar en GitHub Pages el menú Divisiones
de las tres empresas y la corrección de etiqueta de Linkbranding. La autorización
corresponde al prototipo público, no a los dominios comerciales.

## Corrección puntual de Linkbranding

En `linkbranding/design.json`, la etiqueta asociada a `#grupo-branding` cambia de
«Grupo Branding» a **«Servicios complementarios»**. Ese registro genera la misma
navegación en escritorio, tablet y móvil. El nombre accesible procede del texto del
enlace; no se conserva un label distinto o redundante.

La comparación con el HTML anterior a esta corrección demuestra una única
sustitución de texto en ese enlace. El destino no cambia. Se conserva íntegra
la sección `COPY-P05-S11`, presentada como 09 / Grupo Branding, incluido el titular
«Cuando tu proyecto necesita más de una especialidad».

El destino «Grupo Branding» del desplegable mantiene su nombre y abre el Inicio
aprobado en `../experimentos/inicio-v01/`, la ruta real utilizada por producción.
No se sustituyen otras menciones de la marca ni se modifica ARQ-02/COPY-03.

La etiqueta más larga cabe sin superponer elementos ni crear saltos de línea.
No fue necesario cambiar CSS, tamaños de letra, espaciados ni breakpoints respecto
al menú revisado localmente.

## Menú Divisiones incluido

Se integra la implementación previamente revisada, documentada en
[Navegación cruzada](navegacion-cruzada-divisiones-2026-11-23.md):

- Escritorio: disclosure oscuro inmediatamente antes de Contacto; clic y hover,
  Enter/Espacio, Tab, Escape, foco visible, cierre fuera y al elegir destino.
- Tablet/móvil: una única lista visible como «Otras divisiones» dentro del menú
  existente, sin un segundo menú ni una segunda pulsación para revelar destinos.
- Grupo Branding siempre primero; división actual excluida; tres rutas reales.
- Tokens corporativos existentes, caret SVG, movimiento reducido y respaldo de
  scroll interno en alturas pequeñas. No se añaden dependencias, pins o scroll artificial.

## QA previo a publicación

Chrome macOS, sesión aislada; viewports emulados, no hardware físico.

| Formato | Tamaños obligatorios |
| --- | --- |
| Desktop | 1920×1080 · 1440×900 · 1366×768 |
| Tablet | 1024×768 · 820×1180 · 768×1024 |
| Móvil | 430×932 · 390×844 · 375×667 · 320×568 |

Se comprueban las tres páginas en esos diez tamaños y en 1281×800/1280×800:
36 estados sin overflow horizontal, superposición de logo/navbar o enlaces
inaccesibles. En los diez tamaños de Linkbranding se activa realmente el enlace
interno, se espera la llegada del scroll nativo a la sección 09 y se navega después
al Inicio mediante «Divisiones → Grupo Branding». Los diez recorridos son correctos.

Los tres desplegables pasan clic, alternancia, hover, cruce de separación, salida
del cursor, clic fuera, Enter, Espacio, Tab y Escape, con foco visible de 2 px.
El QA de la implementación anterior también conserva las pruebas de toque,
movimiento reducido, ausencia de JavaScript y alturas pequeñas; su controlador
permanece idéntico.

Regresión: los tres heroes se comprueban en 1440×900 y 390×844, midiendo cambios
reales de máscara y progresión adelante/atrás. Los relevos cinematográficos
mantienen .88 desktop/.94 móvil y regreso a 1, sin pins adicionales. Los accesos a
Contacto conservan el origen correspondiente. No se envía ningún formulario.

Las compilaciones aisladas local y con `/grupo-branding-blueprint` pasan:
contenido aprobado, identidades oficiales, casos documentales, rutas, Contacto,
controlador cinematográfico y reproducción de los HTML. Se empaquetan 152 recursos.
La sintaxis JavaScript y la revisión de secretos de los archivos candidatos pasan.

La verificación pública debe comprobar el workflow completado, el `sourceCommit`
de `deployment.json`, los SHA-256 de los 152 recursos y los recorridos reales en
la URL de Pages antes de cerrar la operación. La evidencia de esa comprobación se
conserva en `output/publicacion-navegacion-2026-11-23/` y
`output/playwright/publicacion-navegacion-2026-11-23/`.

## Protección y Git

Base auditada: `de34cd3662e9df3399ab0c4cf3b2a8895e3f92a1`.
`main` y `origin/main` coinciden al comenzar. Se conserva la etiqueta
`recuperacion/publicacion-navegacion-20261123`, el archivo de 303 fuentes actuales,
su inventario SHA-256, el parche previo y un bundle completo del historial.

La etiqueta de navegación es la única corrección de runtime posterior al menú
local revisado. Frente al paquete publicado anterior, permanecen intactos 147
recursos, incluidos Inicio, Contacto, fotografías, logotipos, tipografías y motion.
Solo cambian los tres HTML de divisiones y se incorporan los dos recursos de
navegación. En esos HTML, el contenido fuera del header y las referencias nuevas
conserva sus bytes. No se modifica el footer.

Los cambios se integran en `main` sin force push ni reescritura de historial.
Las capturas, videos, archivos temporales y recuperaciones locales no forman parte
del commit ni del paquete público. Se conservan las fuentes, experimentos y documentación.

## Archivos de esta consolidación

- `linkbranding/design.json`: etiqueta interna aprobada.
- `media-branding/build.py` y `media-branding/template.html`: consumo del componente.
- `shared/divisions/render.py`: encabezados de Linkbranding y Media Printing.
- `shared/divisions/navigation.py`, `.js` y `.css`: componente compartido aprobado.
- `shared/divisions/verify.py` y `verify_navigation.py`: contrato de navegación.
- `media-branding/index.html`, `linkbranding/index.html`, `media-print/index.html`: regenerados.
- `README.md`: guía actualizada de fuentes de navegación.
- `docs/navegacion-cruzada-divisiones-2026-11-23.md`: registro del QA local previo.
- Este informe.

## Límites conservados

Safari y las pruebas físicas iOS/iPadOS/Android siguen pendientes; se mantiene la
instrucción de trabajar en Chrome. La semántica de accesibilidad se comprueba en
Chrome, sin afirmar sesiones físicas de lectores de pantalla. Contacto y Newsletter
continúan sin backend; su comportamiento no se modifica ni se simulan envíos.
