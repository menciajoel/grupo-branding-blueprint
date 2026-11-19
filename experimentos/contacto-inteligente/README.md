# Contacto inteligente · experimento local

Ruta de revisión en la red local:
<http://192.168.68.120:4180/experimentos/contacto-inteligente/>

Origen contextual, por ejemplo:
<http://192.168.68.120:4180/experimentos/contacto-inteligente/?origen=linkbranding>

Solo existe dentro de esta carpeta. No sustituye `/contacto/`, no se añade al
empaquetador de producción y no modifica el Inicio ni las divisiones.
El punto publicado de partida es `78feda9e2bef7a7e719ad691263c565b8e9b9025`.

## Ejecutar y reconstruir

Desde la raíz del repositorio, con Python 3.9 o posterior:

```sh
python3 -B experimentos/contacto-inteligente/build.py
python3 -B experimentos/contacto-inteligente/verify.py
python3 -B experimentos/contacto-inteligente/serve.py --bind 127.0.0.1 --port 4180
```

Abrir `http://127.0.0.1:4180/experimentos/contacto-inteligente/`.
Para revisar desde otro dispositivo, sustituir `--bind` por la IP de la
interfaz local y conectarse a la misma red. La IP puede cambiar.

El servidor combina esta ruta con el paquete estático `_site/` para que
funcionen las identidades, la fuente, GSAP y los enlaces de retorno. Si ese
paquete no existe, reconstruirlo con `python3 -B tools/build_site.py`.
El servidor no ofrece listados ni sirve Python, Markdown, JSON, Git o secretos.
No hay npm ni dependencias nuevas; se reutiliza GSAP local y la fuente Inter Tight.

## Archivos

- `template.html`: estructura semántica y nuevos textos del brief experimental.
- `build.py`: genera `index.html`, inserta contactos de COPY-P08 y extrae los
  isotipos existentes conservando sus nodos y estilos oficiales.
- `contact.js`: estado del recorrido, validación, personalización y GSAP.
- `styles.css`: composición editorial y adaptación al alto visible.
- `assets/`: tres isotipos derivados exclusivamente de los SVG oficiales y
  `provenance.json`, con fuentes, selección y SHA-256; `contact-data.json`
  registra los datos oficiales usados por las pestañas.
- `verify.py`: comprueba recursos, contactos, procedencia y demostración honesta.
- `QA.md`: pruebas ejecutadas y límites reales.

## Lógica del recorrido

1. Elegir una de las cinco necesidades lleva directamente a Conocerte.
2. Se puede empezar por el nombre o por el contacto. El selector muestra una
   sola línea de correo o teléfono, con placeholder contextual. `Añadir teléfono
   (opcional)` / `Añadir correo (opcional)` revela el segundo medio. Cambiar el
   método, ocultar el adicional o regresar nunca borra los valores. Basta nombre
   no vacío y un contacto válido entre los medios mostrados; no se exigen ambos.
3. El proyecto es obligatorio. La pregunta depende de la categoría. El botón
   muestra `Cuéntanos tu idea` deshabilitado mientras el texto está vacío o solo
   contiene espacios; cualquier texto no vacío habilita `Enviar mi solicitud →`.
   No existe mínimo de palabras. Comparte el cambio de fondo de 250 ms, contraste
   AA y respuesta inmediata con movimiento reducido del CTA de Conocerte.
4. El cierre utiliza `Gracias, [nombre].` y `Has completado el recorrido.`.
   No afirma recepción ni envío. Los avisos técnicos no se muestran en la
   presentación para cliente. No hay backend, peticiones de envío ni simulación
   de mensajes recibidos; esa limitación sigue documentada aquí.

Las preguntas visibles son labels nativos de Nombre y del textarea de proyecto;
se retiraron sus etiquetas visuales redundantes. El nombre conserva
`autocomplete="name"`. El acceso alternativo muestra `Ver información de
contacto ↗` en todas las etapas. Se retiró `Revisar mis respuestas` del cierre.

El CTA de Conocerte mantiene su caja al alternar entre `Completa tus datos`
(disabled nativo, gris `#3d3e40`, texto blanco, flecha invisible) y `Continuar →`
(habilitado, color oficial). El fondo cambia durante 250 ms; con movimiento
reducido el cambio es inmediato. La tinta conserva contraste AA también durante
la interpolación. Se valida correo nativo HTML y teléfono con 7–15 dígitos,
permitiendo espacios y signos telefónicos habituales.

## Personalización sin temporizadores

Conocerte comienza con `Empecemos por conocernos.`. El primer contenido en
correo o teléfono, acompañado de un nombre no vacío, activa `Mucho gusto,
[nombre completo].`; el contacto todavía puede ser inválido. Si se escribe el
contacto antes del nombre, se detecta al aportar este último.

`input`, `change`, `focusin`, `pageshow` y la señal CSS no visual de autofill
activan una lectura conjunta de los campos en el siguiente frame. No se usa
un tiempo de inactividad para adivinar cuándo terminó el nombre.

Solo el cambio de modo inicial/saludo reproduce la salida y entrada del titular
completo. Las ediciones posteriores actualizan el texto; si existe una transición
en curso, conservan la última versión para completar el intercambio de forma
atómica. Borrar el nombre recupera el titular inicial. Nunca se mueve el foco
por personalización ni se anuncian caracteres mediante `aria-live`.

Escucharte muestra `Ahora te escuchamos, [primer nombre].`. Primer nombre
significa el primer término separado por espacios; el nombre completo ingresado
permanece intacto. Las cinco preguntas condicionales no incluyen el nombre.

## Identidad y orígenes

| Categoría | Acento | Fuente existente |
| --- | --- | --- |
| Media Branding | `#2e70b4` | `media-branding/tokens.css`, paleta de interfaz aprobada |
| Linkbranding | `#86be3a` | SVG oficial y `linkbranding/theme.css` |
| Media Printing | `#ce2a6c` | SVG oficial y `media-print/theme.css` |
| Combinada / indefinida | `#0035d8` | tokens de Inicio de Grupo Branding |

El logotipo principal siempre pertenece al grupo. La fila de progreso alinea a
la izquierda el isotipo oficial y el nombre de especialidad, seguidos de un
separador y `02 / 03` (o la etapa correspondiente). Solo las tres divisiones
específicas muestran isotipo; combinada e indefinida usan el texto neutro
`Grupo Branding`, sin duplicar el logotipo principal. Los contactos y oficinas
proceden literalmente de COPY-P08-S03 en `contacto/content.json`, trazado a
`docs/arq.html`; no se inventa información comercial.

`?origen=` acepta `media-branding`, `linkbranding`, `media-print` y
`grupo-branding`. Los valores desconocidos vuelven al contexto del grupo.
`?servicio=division` es compatible cuando no se proporciona `origen`.
El origen conserva el enlace de retorno incluso al cambiar la necesidad.

## Información de contacto

`Ver información de contacto ↗` abre una vista independiente con el titular
`Estamos aquí para ti.` y pestañas accesibles de las tres divisiones. Su estado
no modifica la especialidad del formulario. El origen de división determina la
pestaña inicial; para el grupo se utiliza Media Branding. La elección de pestaña
se conserva al volver a abrir esta vista dentro de la misma sesión de página.

Correos, teléfonos y oficinas se extraen de COPY-P08-S03. Media Printing utiliza
`ventas3@gbrandingca.com / 8735-6357`, por autorización expresa del director del
18 de noviembre de 2026. Las oficinas son compartidas del grupo. Los dos enlaces
de Google Maps abren búsquedas externas por sus direcciones aprobadas exactas,
sin coordenadas incorporadas ni mapas embebidos.

Las pestañas admiten flechas, Home/End y Tab. Los relevos duran 250 ms, con una
sola empresa visible; los cambios rápidos cancelan el relevo anterior. Movimiento
reducido muestra el nuevo panel de inmediato. `Prefiero darte mi idea →` vuelve
al mismo paso con todas las respuestas. En esta vista se ocultan el progreso y
los controles duplicados del recorrido.

Desde 1101 px se aplica la composición 40/60: contexto y CTA abajo a la izquierda,
información a la derecha. El texto secundario autorizado se muestra solo en ese
formato. Al mostrar Media Printing en escritorio se evita repetir el contacto
compartido en la sección general. En tablet y móvil se conserva la composición
anterior aprobada, con el CTA tras la información. A 320 × 568 se necesita scroll
vertical de respaldo para mantener todos los datos y áreas táctiles legibles.

## Viewport, navegación y accesibilidad

Se mantiene una sola etapa visible. La composición usa `100dvh`, la altura de
`visualViewport` cuando está disponible y tres densidades (espaciosa, compacta,
ajustada). Elige la menos compacta que contiene el contenido real; reduce
espacios antes que tipografía. No hay pin, scroll sintético ni bloqueo de página.

Cuando no cabe —teclado, zoom, nombres muy largos, un área de texto ampliada o
alturas de paisaje muy pequeñas— el documento crece y permite scroll nativo.
No se oculta contenido ni se aplica overflow hidden a la página.

Regresar, cambiar categoría o entrar/salir de Contacto directo conserva los
valores. Las respuestas permanecen únicamente en el DOM de la pestaña; la app
no usa almacenamiento ni transmite datos. La recarga no garantiza conservarlas;
el navegador puede aplicar su propio autocompletado/restauración.

Las etapas gestionan foco y anuncio una vez por navegación. Tab, Enter, radios,
campos y controles mantienen su comportamiento nativo. Sin JavaScript se ofrecen
los contactos oficiales; los formularios no realizan peticiones nativas.

## Control editorial y protección

Los titulares y el recorrido son propuestas autorizadas por los briefs de este
experimento, no una sustitución documental de COPY-P08. La omisión de Empresa y
la nueva estructura conversacional no se trasladan a ARQ-02/COPY-03.

La protección inicial y las capturas se conservan en
`output/contacto-inteligente-2026-11-18/`. Allí existe además una recuperación
del experimento anterior al adendum de personalización y otra anterior a la
recuperación de los campos progresivos.
No se ha hecho commit, push ni despliegue.
