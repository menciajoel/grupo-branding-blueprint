# Fuentes fotográficas de la división

- `canva/`: originales recuperados, sin alteraciones; su README registra página, hash y estado.
- `curated/`: maestros PNG con los ajustes fotográficos convencionales aprobados.
- `../media.json`: dimensiones, hash original/maestro, recorte, balance de canales, brillo, contraste, enfoque, alt y encuadre. Los ID heredados no implican que un recurso documental siga siendo conceptual; consultar `type`, `sourceResourceId` y `filePrefix`.
- `../assets/media/`: variantes WebP listas para web. El empaquetador publica solo las referenciadas por el sitio.

La compilación habitual solo necesita Python y los WebP versionados. Las fuentes y maestros permiten continuar la edición desde otra computadora; no se despliegan. La reproducción opcional del tratamiento requiere Pillow (versión usada: 11.3.0); aplicar la receta individual de `media.json`, sin ampliar el original ni inventar detalle. No ejecutar las utilidades históricas de preparación sobre la selección actual sin revisar sus entradas.

Se conservan versiones anteriores como referencia y recuperación. Selección vigente y límites: [publicación fotográfica](../../docs/publicacion-fotografica-2026-11-24.md).
