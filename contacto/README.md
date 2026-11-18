# Contacto — demostración local

Fuente íntegra: ARQ-P08 / COPY-P08 de `../docs/arq.html`. `content.json` conserva sus 23 bloques, datos y metadatos. No se modificó la documentación aprobada.

Regenerar desde la raíz con `python3 -B contacto/build.py`; verificar conjuntamente con `python3 -B media-branding/verify.py`. Servir la raíz en 127.0.0.1:4173 y abrir `/contacto/`.

Los campos son explorables y etiquetados. No existe elemento HTML form, action, backend, fetch, almacenamiento ni destinatario operativo. Enviar consulta queda desactivado con estado visible Demostración; pulsar Enter en un campo no simula envío. Los contactos aprobados se muestran como información, sin accionar correos o llamadas durante la revisión.

`#predios-privados` añade únicamente el contexto autorizado de presentación: Predios privados y predios@example.com, sin mailto ni número inventado. Este dato no forma parte de COPY-P08 y proviene de `../media-branding/presentation-copy.json`.

Navegación a Media Branding y al Inicio existente de Grupo Branding; responsive de una o dos columnas según espacio. GSAP opcional para la entrada inicial, con prefers-reduced-motion y contenido visible sin JavaScript. El paquete de GitHub Pages adapta sus enlaces al prefijo del repositorio; consultar `../README.md`.
