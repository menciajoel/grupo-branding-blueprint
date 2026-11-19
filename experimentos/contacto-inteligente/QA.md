# QA local · Contacto inteligente

Fecha: 18 de noviembre de 2026. Alcance exclusivo:
`experimentos/contacto-inteligente/`. Sin commit, push ni publicación.

## Resultado

Recorrido navegable con una sola etapa visible, CTA condicionado, personalización
y campos de contacto progresivos. Se conserva el logotipo superior del grupo.
La especialidad precede al indicador de etapa. Las categorías combinada e
indefinida muestran una identificación textual neutra del grupo, sin otro logo.

Los datos de prueba permanecen en el DOM: no hay endpoint, peticiones de envío,
almacenamiento de respuestas ni afirmación de solicitud recibida. Los contactos
directos proceden de COPY-P08. La arquitectura y el copy documental no se editan.

## Pruebas funcionales

| Comprobación | Resultado observado |
| --- | --- |
| Inicio de Conocerte | `Empecemos por conocernos.`, nombre disponible y una sola línea de correo. Teléfono disponible mediante el selector. |
| Cambio de método | Alterna la línea y su placeholder. `Añadir teléfono (opcional)` / `Añadir correo (opcional)` revela el segundo campo. Valores conservados al cambiar, mostrar y ocultar. |
| Nombre → correo; nombre → teléfono | El primer carácter del contacto activa el saludo completo; contacto inválido mantiene el CTA deshabilitado. |
| Teléfono → nombre; correo → nombre | Al aportar el nombre se detecta el contacto existente y aparece el mismo saludo. |
| Edición del nombre | Texto actualizado sin repetir la animación por carácter. Al borrar, vuelve el titular inicial y se deshabilita el CTA. |
| Escucharte | Primer término del nombre en `Ahora te escuchamos, …`. Las cinco preguntas condicionales conservan su texto. |
| Regresar y cambiar especialidad | Nombre, contacto y texto del proyecto conservados. Pregunta, color e identidad actualizados. |
| Correo válido o teléfono válido | Cualquiera de los dos basta. No se exigen simultáneamente. Un medio adicional inválido no impide continuar si el otro es válido. |
| Proyecto obligatorio | Vacío o solo espacios: `Cuéntanos tu idea`, disabled nativo, gris/blanco y sin flecha. Texto no vacío, incluso una palabra: `Enviar mi solicitud →`, habilitado y con acento oficial. Sin mínimo arbitrario de palabras. Texto conservado al regresar. |
| CTA incompleto | Disabled nativo; `Completa tus datos`, gris `#3d3e40`, blanco, cursor normal y flecha invisible. |
| CTA completo | `Continuar →`, habilitado, acento oficial. Caja idéntica: en 320 px, 276 × 48 px antes y después. |
| Contacto directo / retorno | Contactos oficiales y regreso a la etapa anterior, sin borrar respuestas. |
| Cierre neutral | `Gracias, [nombre].` y `Has completado el recorrido.`. No afirma envío ni recepción; no hay backend. |
| Teclado | Controles nativos, radios, Tab y Enter. La personalización no cambia el foco ni utiliza una región viva para cada carácter. El foco de etapa se gestiona una vez al navegar. |

Chromium pasó los cuatro órdenes de escritura de nuevo después de recuperar los
campos progresivos. Safari real en macOS pasó: un solo campo inicial, saludo con
correo incompleto, cambio a teléfono, recuperación del correo anterior, teléfono
válido como único requisito de contacto y etapa 03 con primer nombre.

## Responsive y movimiento

- Chromium: etapas 02 y 03 comprobadas en 1440 × 900, 1366 × 768,
  1280 × 720, 768 × 1024, 1024 × 768, 390 × 844, 375 × 667 y 320 × 568.
  La matriz de personalización completa se ejecutó antes de restaurar los
  campos progresivos; tras restaurarlos se repitieron escritorio, ambas
  orientaciones de tablet, los tres tamaños de teléfono y la etapa 03 a 320 px.
- Composición normal dentro del viewport, sin desbordamiento horizontal.
  A 320 × 568 se reducen únicamente espacios de Conocerte para acomodar de
  nuevo el enlace adicional, conservando fuentes y áreas táctiles de 44 px.
- Nombres largos y compuestos probados. El caso largo en 320 px
  necesita scroll vertical de respaldo; no se recorta ni desborda horizontalmente.
  La reserva temporal del titular se libera al completar o cancelar el saludo.
- Altura reducida 390 × 430 y paisaje 844 × 390: scroll nativo de seguridad.
  CTA accesible. No hay pin, bloqueo de scroll ni scroll programado.
- Zoom real de Chrome al 200 %: composición con crecimiento natural y CTA
  alcanzable. Verificación realizada antes del último cambio de campos; el
  mecanismo de respaldo permanece intacto.
- `prefers-reduced-motion` comprobado mediante emulación real de Chromium:
  titulares sin desplazamiento, CTA sin transición y dimensiones conservadas.
  Preferencia restaurada después de la prueba. No se añadieron nuevas animaciones
  durante la recuperación de los campos.
- Safari macOS: pruebas visuales en escritorio y emulación responsive de tablet,
  390 × 844 y 320 × 568 durante la personalización. La última restauración de
  campos progresivos se comprobó funcionalmente en una ventana aparte de Safari.
  La ventana de prueba se cerró sin tocar las ventanas de revisión del usuario.
- Sin avisos ni errores capturados por el registro de consola de la pestaña
  Chromium de prueba. No se inspeccionó la consola de Safari.
- Sin JavaScript, se muestran los contactos oficiales y el recorrido queda
  deshabilitado: no se produce un envío nativo accidental.

## Contraste

| Estado estable | Fondo | Tinta | Relación aproximada |
| --- | --- | --- | --- |
| Grupo / combinada / indefinida | `#0035d8` | Blanco | 8.40:1 |
| Media Branding | `#2e70b4` | Blanco | 5.13:1 |
| Linkbranding | `#86be3a` | `#101712` | 8.19:1 |
| Media Print | `#ce2a6c` | Blanco | 5.03:1 |

La tinta se ajusta durante la interpolación del acento para conservar AA.
El estado no depende solo del color: cambia el texto y el atributo disabled.

## Evidencia local

Directorio: `output/contacto-inteligente-2026-11-18/` (excluido de producción).

Estado final de campos progresivos:

- `desktop-campos-progresivos-inicial.jpg`: campo único con placeholder.
- `desktop-campos-progresivos-final.jpg`: saludo personalizado y CTA activo.
- `movil-campos-progresivos.jpg`: Conocerte a 320 × 568.
- `safari-campos-progresivos.png`: etapa 03 en Safari real.
- `campos-progresivos.json`: método, conservación de datos y expansión.
- `ordenes-campos-progresivos.json`: los cuatro órdenes de escritura.
- `campos-progresivos-final.json`: CTA, dimensiones, regreso y categoría neutra.
- `nombre-largo-final.json`: medición asentada del caso largo.
- `proyecto-obligatorio.json`: vacío, espacios, una palabra y texto conservado.
- `proyecto-colores.json`: cinco categorías, colores y tinta del CTA de etapa 03.
- `proyecto-reduced-motion.json`: mismo botón con transición de 0 s.
- `desktop-proyecto-vacio.jpg`, `desktop-proyecto-valido.jpg` y
  `movil-proyecto-obligatorio.jpg`: estados del nuevo CTA obligatorio.

El adendum de proyecto obligatorio se probó en Chromium a 320 × 568,
768 × 1024 y 1440 × 900, incluidos cambio de especialidad, regreso y llegada
al cierre demostrativo. También se repitió específicamente en Safari macOS:
vacío y espacios mantienen el botón deshabilitado; `Evento` lo habilita y se
conserva al regresar. Evidencia: `safari-proyecto-obligatorio.json` y `.png`.

Último ticket editorial: `¿Cómo podemos llamarte?` se sustituye exclusivamente
por `¿Cuál es tu nombre?` en el label del nombre, conservando asociación, estilos
y lógica. Se reconstruyó HTML y comprobó la sustitución servida por HTTP. Las
capturas de Conocerte preceden a este cambio de pregunta; no representan otro
cambio visual pendiente.

### Ajustes finales de presentación para cliente

Se retiran las etiquetas visuales redundantes `Nombre` y `Tu proyecto`; las
preguntas conservan `label for` y el árbol de accesibilidad verifica los nombres
`¿Cuál es tu nombre?` y la pregunta condicional del textarea. Autocomplete y
atributos required permanecen intactos.

Se elimina `Revisar mis respuestas` y su listener. Se sustituye el acceso
alternativo por `Ver información de contacto ↗`, manteniendo su navegación.
El título de pestaña es `Contacto | Grupo Branding`. Se retiran los avisos
técnicos del footer, proyecto y cierre. El anuncio accesible final también es
neutral. No se cambia CSS, colores, fuentes, validaciones ni parámetros GSAP.

Chromium: recorrido 01 → 02 → 03 → Contacto directo → 03 → cierre, con datos
conservados, proyecto de espacios deshabilitado y una palabra habilitada.
Las etapas 02 y 03 caben en los ocho tamaños de la matriz, sin scroll horizontal
ni vertical en condiciones normales. No hay errores/avisos en el registro de la
pestaña. No se repitió Safari para este cambio exclusivamente editorial.

Evidencia actual, que sustituye visualmente a las capturas previas:
`cliente-conocerte-desktop.jpg`, `cliente-conocerte-movil.jpg`,
`cliente-escucharte-desktop.jpg`, `cliente-escucharte-movil.jpg`,
`cliente-final-desktop.jpg`, `cliente-final-movil.jpg`,
`cliente-conocerte-viewports.json`, `cliente-escucharte-viewports.json`
y `cliente-estados.json`. Recuperación: `antes-limpieza-presentacion.tar.gz`.

Otras evidencias previas del mismo trabajo:
`personalizacion-principal.json`, `personalizacion-ordenes.json`,
`personalizacion-continuidad.json`, `viewport-personalizado-etapa2.json`,
`viewport-personalizado-etapa3.json`, `zoom-200.json`,
`cta-reduced-motion.json`, `altura-reducida.json`, `categorias.json`
y `origenes.json`. Las capturas anteriores que muestran dos campos por defecto
son históricas y quedan sustituidas por las citadas arriba. La primera matriz
`viewport-campos-progresivos.json` capturó 16 px de crecimiento a 320 px; el
ajuste posterior de espacios y `campos-progresivos-final.json` verifican 568 px.

## Protección y verificaciones reproducibles

HEAD de partida: `78feda9e2bef7a7e719ad691263c565b8e9b9025`.

Copias locales de recuperación: `antes-personalizacion.tar.gz` y
`antes-restaurar-campos-progresivos.tar.gz`, junto con sus manifiestos SHA-256.
El manifiesto `proteccion.json` permite verificar los 204 archivos versionados
del punto de partida sin modificarlos.

```sh
python3 -B experimentos/contacto-inteligente/build.py
node --check experimentos/contacto-inteligente/contact.js
python3 -B experimentos/contacto-inteligente/verify.py --baseline output/contacto-inteligente-2026-11-18/proteccion.json
```

Se verifican sintaxis, rutas estáticas, hashes CSS/JS, procedencia de SVG,
contactos aprobados, ausencia de mecanismo de envío y preservación del baseline.

## Limitaciones reales

- No hay dispositivo físico iOS/Android ni teclado virtual real. Se usa Safari
  macOS y emulación de viewport/altura en Chromium y Safari, sin declarar
  compatibilidad completa en teléfonos reales.
- Se implementan señales de `input`, `change`, `focusin`, `pageshow` y autofill
  WebKit. La lectura conjunta de campos está probada con entrada por UI, pero
  no se creó ni utilizó un perfil real de autocompletado personal. Su prueba
  nativa con perfiles guardados queda pendiente.
- El lector de pantalla se revisa mediante semántica/árbol de accesibilidad;
  no se realizó un recorrido auditivo completo con VoiceOver/TalkBack.
- El contacto continúa siendo demostrativo; no existe backend ni envío real.
- La consola nativa de Chrome conserva dos peticiones históricas 404 a
  `/favicon.ico`; el documento actual declara su SVG oficial. No se observaron
  excepciones JavaScript en el recorrido probado. No se inspeccionó la consola
  Safari.
- El contador de etapa del cierre demostrativo conserva un comportamiento
  previo: puede indicar `01 / 03` aunque la barra esté completa. No afecta la
  validación ni el contenido y queda registrado fuera del último adendum;
  no se ha ampliado esta intervención para cambiar ese componente.
- La IP depende de la red local. El servidor se mantiene activo para revisión.

## Información de contacto · pestañas y refinamiento desktop

Implementado exclusivamente dentro del experimento. Las secciones HTML de los
pasos 01, 02 y 03 se compararon con la recuperación anterior: son idénticas.
Los 204 archivos versionados del punto de partida siguen intactos.

- Titular `Estamos aquí para ti.`; tres pestañas tablist/tab/tabpanel y un solo
  panel visible. Orígenes Media Branding, Linkbranding y Media Print abren su
  pestaña; Grupo Branding abre Media Branding.
- Media Print utiliza el contacto compartido por autorización expresa recibida
  durante esta intervención. No se modificó COPY-03. Datos y trazabilidad en
  `assets/contact-data.json`; el verificador compara con los bloques aprobados.
- Correos mailto y teléfonos tel conservan los valores exactos. Los dos enlaces
  de Maps se abrieron en pestañas externas y mostraron las búsquedas por las
  direcciones aprobadas. Son búsquedas, sin un pin geográfico garantizado.
- Regreso comprobado desde los pasos 01, 02 y 03. Nombre, correo, proyecto,
  validación y especialidad del formulario conservados al cambiar pestañas.
  Se conserva también la selección de contacto al volver a entrar.
- Flechas, Home, End, Tab y foco del tabpanel probados en Chromium. Cambios
  rápidos dejan una sola empresa, opacidad 1 y ninguna transformación residual.
  Safari macOS pasó las tres pestañas, flecha derecha/Home y retorno con datos.
- Relevos de 100 ms de salida y 150 ms de entrada. Movimiento reducido real
  emulado en Chromium: panel inmediato y transiciones CSS de 0 s. Emulación
  restaurada. Contraste estable de acentos según la tabla anterior y tinta
  ajustada durante la transición del CTA.
- Escritorio final: 40/60 sobre el ancho disponible entre columnas, CTA inferior
  izquierdo y texto secundario aprobado. Alturas del titular, filas y CTA
  idénticas entre las tres pestañas a 1440 × 900. Contacto compartido sin duplicar
  en Media Print desktop; los mismos datos siguen visibles en su panel.
- Chromium: 1920 × 1080, 1440 × 900, 1366 × 768, 1280 × 720 y 1101 × 768 sin
  scroll ni desbordamiento. Tablet 1024 × 768 y 768 × 1024 conserva su composición.
  También se comprobó el ancho intermedio 600 × 900.
- Móvil: 430 × 932, 390 × 844 y 375 × 667 caben completos. A 320 × 568 el
  documento necesita 724 px; scroll nativo de respaldo de 156 px permite llegar
  al CTA. No hay desbordamiento horizontal ni contenido oculto para ajustar.
- La captura de Linkbranding a 390 × 844 anterior y posterior al refinamiento
  desktop es idéntica píxel por píxel; las coordenadas, fuentes y alturas también
  coinciden. Las nuevas reglas compositivas solo se aplican desde 1101 px.
- Safari real de macOS muestra correctamente 40/60, CTA izquierdo, colores,
  pestañas y deduplicación. No se declara prueba en Safari iOS físico.

Evidencias en `output/contacto-inteligente-2026-11-18/`:
`contacto-desktop-antes-refinamiento.jpg`,
`contacto-refinado-{media-branding,linkbranding,media-print}-desktop.jpg`,
`contacto-mobile-aprobado-{antes,despues}-desktop.jpg`,
`contacto-mobile-geometria-{antes,despues}.json`, `contacto-desktop-40-60.json`,
`contacto-refinado-estados.json`, `contacto-pestanas.json`,
`contacto-teclado-rapido.json`, `contacto-origenes.json`,
`contacto-retorno-respuestas.json`, `contacto-reduced-motion.json`,
`contacto-maps.json`, `safari-contacto-refinado-desktop.png` y
`safari-contacto-qa.json`.

Recuperaciones conservadas: `antes-contacto-pestanas.tar.gz` y
`antes-composicion-contacto-desktop.tar.gz`. Sin commit, push ni despliegue.
