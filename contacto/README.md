# Contacto Inteligente · presentación aprobada

Ruta pública única: `/contacto/`. Sustituye el formulario anterior; el experimento
aprobado se conserva en `../experimentos/contacto-inteligente/` como referencia
técnica, sin incluirlo como página adicional de GitHub Pages.

## Reconstruir

Desde la raíz:

```sh
python3 -B contacto/build.py
python3 -B contacto/verify.py
python3 -B tools/build_site.py
```

Servir `_site/` y abrir `/contacto/`. Para Pages, compilar con
`--base-path /grupo-branding-blueprint`; consultar el README general.

`template.html`, `contact.css` y `contact.js` conservan el diseño, las tres etapas,
la personalización, validaciones, colores, pestañas, accesibilidad y motion del
experimento aprobado. Solo se adaptan las rutas de recursos y retorno y la
etiqueta solicitada `Volver a Grupo Branding`.

`content.json` conserva los 23 bloques de COPY-P08 sin modificar ARQ-02/COPY-03.
`editorial-trace.json` registra las sustituciones y omisiones autorizadas para la
experiencia conversacional. Los datos de contacto y oficinas se extraen de esa
fuente; `assets/contact-data.json` conserva su procedencia. Media Printing utiliza
el contacto compartido por autorización expresa del director. Los SVG se derivan
de sus nodos oficiales, con hashes en `assets/provenance.json`.

## Origen y selección

`?origen=` admite `media-branding`, `linkbranding`, `media-print` y
`grupo-branding`. Sin origen o con un valor desconocido, el contexto es neutral.
Se conserva compatibilidad con `?servicio=division` cuando falta `origen`.

El origen determina el retorno y la selección inicial. Cambiar especialidad o
pestaña de contacto nunca modifica el enlace de regreso. Los enlaces de correo
son mailto, los teléfonos tel y Maps abre una búsqueda externa por la dirección
exacta aprobada, sin coordenadas inventadas.

Los iconos elegidos mediante JavaScript se declaran en `runtime-assets.json`
para que el empaquetador los incluya en Pages. No eliminar ese manifiesto.

## Presentación sin envío

No existe backend, Resend, endpoint, claves API ni almacenamiento de solicitudes.
Los formularios usan `method="dialog"`, sus eventos impiden el envío nativo y los
botones están inicialmente deshabilitados. El cierre neutral dice
`Has completado el recorrido.`; no afirma recepción ni envío.

Las respuestas permanecen en el DOM mientras se navega entre etapas o información
de contacto. No se garantiza conservarlas al recargar o salir de la página.
Sin JavaScript se muestran los contactos oficiales y no se habilita un envío.

La composición usa el viewport visible; pantallas muy pequeñas, zoom o teclado
pueden necesitar scroll nativo de respaldo. Las pruebas de Safari macOS y
emulación responsive no sustituyen la comprobación en teléfonos físicos.

La integración real de Resend, enrutamiento por especialidad y confirmación de
recepción corresponde a una fase posterior.
