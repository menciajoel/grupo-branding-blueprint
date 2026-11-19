# Fotografías documentales de Inicio

Fuente: `recursos/originales/IMPACTOS EXITO MEDIA BRANDING.pdf` (cinco páginas).
SHA-256 del documento: `94f6d694876bfab7e06cbf55d0033c60608da13b6dcee2adcdfb9ea290cacba6`.

| Recurso fuente | Página / objeto PDF | Resolución nativa | Correspondencia |
|---|---|---|---|
| dunkin.png | 2 / 157 | 1720 × 1290 | Campaña exterior de Dunkin; testimonio de Gilma Mejía. |
| issima.png | 3 / 173 | 1642 × 1256 | ISSIMA, Corporación Dinant; testimonio de 4am Saatchi & Saatchi. |
| flying-fish.png | 4 / 188 | 1164 × 1488 | Flying Fish, Cervecería Hondureña; testimonio de Eco Publicidad. |

Los PNG conservan los píxeles RGB y el perfil ICC de las imágenes incrustadas.
No son capturas de páginas, no tienen maquetación del PDF y no se han recortado,
retocado ni ampliado. Flying Fish conserva la nitidez limitada de su original.

Los derivados WebP están en `../../assets/media/projects/`. Se convierten a sRGB
y solo se reducen proporcionalmente. El inventario de tamaños, pesos y huellas
está en `../../project-images.json`; el texto literal, en `../../project-cases.json`.

Para regenerar recursos se necesitan las dependencias opcionales `pypdf` y
`Pillow`, además del PDF original. Desde la raíz del repositorio:

```sh
python3 -m pip install pypdf Pillow
python3 -B experimentos/inicio-v01/extract_project_photos.py --pdf "recursos/originales/IMPACTOS EXITO MEDIA BRANDING.pdf"
python3 -B experimentos/inicio-v01/verify_projects.py --pdf "recursos/originales/IMPACTOS EXITO MEDIA BRANDING.pdf"
python3 -B experimentos/inicio-v01/build.py
python3 -B tools/build_site.py
```

La construcción habitual del sitio utiliza solo la biblioteca estándar de Python:
no requiere regenerar fotografías ni disponer de las dependencias opcionales.
Los originales, el PDF y esta documentación no se incluyen en el paquete estático.
