# Consolidación total aprobada · 19-11-2026

Joel autoriza integrar, versionar y publicar todos los cambios locales aprobados,
incluida la navegación del isotipo, los tres relevos cinematográficos y el nombre
Media Printing en las cinco páginas y en ARQ-02/COPY-03. La publicación corresponde
al prototipo de GitHub Pages, no a los dominios comerciales.

## Alcance integrado

- Inicio: «Conoce nuestras divisiones» lleva a la convergencia. Las tres piezas y
  sus nombres son enlaces nativos a las divisiones; comparten hover y foco.
- Media Branding: Retail → 04 / Vallas y formatos publicitarios.
- Linkbranding: Eventos → 04 / Activaciones de marca, conservando su grupo editorial.
- Media Printing: Rotulación → 04 / Proyectos.
- Nombre público Media Printing en fuentes, generadores, HTML, datos, metadatos y
  Contacto. `/media-print/`, parámetros e identificadores permanecen intactos.
- Documentación de colaboración actualizada. Los experimentos, fuentes originales,
  informes históricos y recuperaciones se conservan; no se publican capturas ni videos.

Las tres transiciones reutilizan el controlador aprobado de Inicio, con escala
desktop .88 y móvil .94, suspensión, oscurecimiento, superposición y reversibilidad.
No se recalibran sus parámetros ni se añaden pins o alturas. Los archivos de runtime
aprobados conservan exactamente los bytes del inventario previo a esta publicación.
Solo se actualiza además el README para eliminar una indicación que había quedado
obsoleta sobre las transiciones interiores.

## Evidencia de implementación y QA

- [Navegación e interacciones del isotipo](../experimentos/inicio-v01/navegacion-divisiones-qa.md).
- [Transiciones, responsive y corrección de identidad](transiciones-divisiones-media-printing-2026-11-19.md).
- [Registro de sustituciones de nombre en su etapa de implementación](media-printing-name-corrections-2026-11-19.json).

Compilación aislada local y con `/grupo-branding-blueprint`: correctas. Se empaquetan
150 recursos estáticos. Pasan los controles de bloques editoriales, casos reales,
fotografías, logotipos oficiales, identidad blanca del grupo, conservación del motion,
18 accesos contextuales a Contacto y referencias de las cinco páginas. La sintaxis
JavaScript y la revisión de secretos de las fuentes seleccionadas no presentan errores.

El QA de implementación en Chrome cubre desktop, tablet y móvil; scroll adelante y
atrás, resize encadenado, teclado y movimiento reducido. Esta consolidación comprueba
de nuevo la navegación y debe verificar en la URL pública las cinco páginas, los
tres relevos, las seis superficies de enlaces, casos, galerías y Contacto. La evidencia
de despliegue y comprobación pública se conserva localmente en
`output/publicacion-total-2026-11-19/` y `output/playwright/publicacion-total-2026-11-19/`.
El cierre se determina contrastando `deployment.json.sourceCommit` y los SHA-256 del
paquete publicado con el commit y manifiesto correspondientes, no por el push solo.

## Git y recuperación

Base auditada: `f1b6678a8b84c441ab4357fa37776387298a0149`.
`origin/main` y `main` coinciden al comenzar; no existen ramas remotas adicionales.
Las ramas locales `codex/consolidacion-cinematografica` y
`codex/integracion-contacto-inteligente` ya son antecesoras de esa base.

Se conserva la etiqueta `recuperacion/publicacion-total-20261119`, además de todas
las recuperaciones anteriores. La carpeta local de evidencia contiene un archivo
de las 297 fuentes, su inventario SHA-256, el parche pendiente y un bundle de todas
las referencias Git. Los cambios se integran en `main` sin reescribir historial.
Solo se limpian ramas propias después de comprobar que no contienen commits únicos
y de verificar el despliegue; `main`, las etiquetas y los archivos se conservan.

## Límites que permanecen

- Safari pendiente por la instrucción de utilizar Chrome y dejar Safari al otro agente.
- Pruebas físicas de iOS/iPadOS/Android pendientes; emulación no equivale a hardware real.
- Contacto Inteligente y Newsletter siguen sin backend. No se simulan envíos ni se
  modifica su comportamiento durante esta publicación.
- Las imágenes conceptuales conservan su identificación. Las páginas/documentos
  de arquitectura aún no implementados no se desarrollan en esta consolidación.
