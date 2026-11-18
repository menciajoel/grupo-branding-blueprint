# Linkbranding — desarrollo local

Desde la raíz del repositorio:

```sh
python3 -B linkbranding/build.py
python3 -B shared/divisions/verify.py
python3 -B tools/build_site.py
python3 -m http.server 4175 --bind 127.0.0.1 --directory _site
```

Si 4175 ya está ocupado, conservar el servidor de revisión existente. La URL es `http://127.0.0.1:4175/linkbranding/`. El servidor de red del proyecto en 4174 sirve solo `_site/`.

- Contenido: `content.json`, copia trazable de COPY-P05. Cambiarlo requiere autorización editorial y actualizar la fuente aprobada; el verificador detecta diferencias.
- Imágenes: `media.json` y `assets/media/`. Sustituir los WebP en los anchos registrados en `media.json` (640, 960 y hasta 1600) por fotografías autorizadas, con sus dimensiones, encuadre, alt y procedencia. Las etiquetas conceptuales solo deben retirarse cuando el recurso deje de ser conceptual.
- Composición protegida: `design.json`, `theme.css`, `../shared/divisions/render.py`, `sections.css`.
- Movimiento protegido: `../shared/divisions/hero.js`, `sections.js`. La versión aprobada de Media Branding permanece inmutable. Las fuentes, vendor GSAP, iconos y galería se consumen en lectura desde las rutas existentes.
- Regenerar ambas divisiones después de cambiar un archivo compartido. `tools/build_site.py` valida que los HTML registrados sean reproducibles.
- Para probar el prefijo de Pages sin publicar: `python3 -B tools/build_site.py --base-path /grupo-branding-blueprint`. Volver a ejecutar sin prefijo antes de revisar en el servidor LAN en la raíz.

La publicación general del prototipo fue autorizada el 18-11-2026. Ver el README raíz para colaboración y despliegue. Los informes y capturas de QA permanecen locales, excluidos del repositorio y del paquete estático. No se implementa CMS ni un stack definitivo; los recursos conceptuales de `media.json` deben revisarse antes del sitio comercial definitivo.
