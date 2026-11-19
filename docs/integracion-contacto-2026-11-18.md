# Integración de Contacto Inteligente · 18 noviembre 2026

Autorización: sustituir Contacto por el experimento aprobado, integrar navegación,
commit, merge y publicar el prototipo en GitHub Pages. No hay autorización ni
implementación de backend, Resend o despliegue en dominios comerciales.

## Protección

Punto previo: `78feda9e2bef7a7e719ad691263c565b8e9b9025`.
Etiqueta local: `contacto-antes-integracion-inteligente-20261118`.
La copia de trabajo y el manifiesto se conservan localmente en
`output/contacto-integracion-2026-11-18/`. No se eliminan otras recuperaciones.

El experimento aprobado permanece sin cambios. La producción copia su template,
CSS, JS y generación de recursos adaptando exclusivamente rutas, nombre del CSS
y el retorno solicitado `Volver a Grupo Branding`. La comparación automática
confirma que no se reconstruyeron sus componentes ni coreografías.

## Rutas y accesos

Una experiencia pública: `/contacto/`. El empaquetador excluye
`experimentos/contacto-inteligente/` y conserva la referencia en el repositorio.

| Página | Accesos auditados | Origen |
| --- | --- | --- |
| Inicio | Navegación, hero, cierre, footer y menú móvil: 5 | grupo-branding |
| Media Branding | Navegación, hero, Predios, cierre y footer: 5 | media-branding |
| Linkbranding | Navegación, hero, cierre y footer: 4 | linkbranding |
| Media Print | Navegación, hero, cierre y footer: 4 | media-print |

Las tres anclas `#contacto` de navegación de Inicio ahora abren la página de
Contacto. La sección de cierre permanece en Inicio con el mismo HTML visual y
los mismos recursos de motion. Los dos CTA de Inicio dejan de abrir el antiguo
diálogo de vista previa. Predios mantiene su copy y dirige a Contacto con origen
Media Branding, sin el fragmento de contexto del formulario anterior.

`shared/inicio/verify.py` normaliza únicamente estos cambios autorizados de
navegación al comparar el cuerpo visual aprobado. Los hashes de aprobación y
todos los archivos GSAP, CSS cinematográfico, hero y documentación permanecen
intactos; no se actualizaron huellas para justificar un cambio visual.

## Datos y límites funcionales

El registro COPY-P08 conserva sus 23 bloques y se contrasta con `docs/arq.html`.
`contacto/editorial-trace.json` distingue lo conservado de los reemplazos
conversacionales aprobados. Correos, teléfonos y direcciones se extraen del
registro. Media Print comparte el contacto general con autorización expresa.

No hay fetch, endpoint, almacenamiento, claves ni Resend. Las etapas conservan
respuestas dentro de la misma página. El cierre neutral no afirma recepción.
Los enlaces mailto/tel abren los clientes del visitante; no se accionan envíos
durante QA. Maps utiliza búsquedas por las direcciones exactas, sin pin garantizado.

## Verificación

El paquete se valida con el prefijo real `/grupo-branding-blueprint`, incluyendo
las tres identidades seleccionadas por JavaScript y sus SVG mediante el
manifiesto runtime. `tools/verify_contact_integration.py` comprueba los 18 accesos,
orígenes permitidos, ausencia de intercepción antigua y una sola página pública.

Pruebas de navegador y verificación del despliegue quedan registradas en la
entrega y en los archivos locales de QA del mismo directorio `output/`.

QA previo al merge:

- Chromium: cuatro recorridos página → Contacto → origen y los cuatro menús
  móviles, sobre el paquete con prefijo real. Safari macOS: las cinco páginas
  y retornos de los cuatro orígenes.
- Origen Linkbranding y selección Media Print: retorno sigue siendo Linkbranding;
  cambiar pestañas no cambia la especialidad. Datos conservados entre etapas e
  información de contacto. Proyecto de espacios rechazado, una palabra válida.
- Etapas 02 y 03 caben sin scroll ni desbordamiento en 1440 × 900, 1280 × 720,
  1024 × 768, 768 × 1024, 390 × 844, 375 × 667 y 320 × 568.
- Teclado y cambio de pestañas comprobados en la ruta integrada. Movimiento
  reducido emulado en Chromium: saludo sin transform y transiciones de 0 s;
  preferencia restaurada. Sin avisos ni errores en el registro de la pestaña.
- Inicio: scroll real cambia el progreso cinematográfico y la escala, y vuelve
  al mismo estado al invertirlo. El cierre alcanza su estado estable y su CTA
  abre Contacto Inteligente. Los hashes de todos sus recursos siguen intactos.
- El cierre de Contacto muestra únicamente la confirmación neutral del recorrido;
  no afirma recepción de la solicitud. El verificador impide incluir mecanismos
  de red o almacenamiento y contrasta los datos y enlaces de Maps con COPY-P08.

Pendientes técnicos reales: backend/Resend y enrutamiento comercial; pruebas en
dispositivos físicos; revisión final de recursos conceptuales para el sitio
comercial. Las limitaciones existentes de Divisiones/Portafolio y Newsletter no
se amplían ni se implementan en esta integración.
