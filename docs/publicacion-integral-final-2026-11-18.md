# Publicación integral final del prototipo

Joel aprueba todos los cambios pendientes y autoriza commit, integración, push y despliegue mediante GitHub Pages. No se autorizan rediseños durante la operación. Este registro prevalece sobre las menciones históricas de «pendiente de aprobación» o «sin publicar» de los informes de las iteraciones anteriores.

## Auditoría y recuperación

- Rama de publicación: `main`, alineada con `origin/main` al realizar fetch.
- Base publicada anterior: `6780fe6783c6944443318098f0d87476d5096190`.
- Las ramas `codex/consolidacion-cinematografica` y `codex/integracion-contacto-inteligente` ya están integradas en `main`.
- Recuperación previa: etiqueta local `recuperacion/publicacion-integral-20261118`, más `output/publicacion-integral-2026-11-18/antes-publicacion.tar.gz`, inventario SHA-256 y parche de los cambios anteriores. Se preservaron 286 archivos de trabajo, incluidos los recursos que todavía estaban sin commit.
- Se conservaron las 28 etiquetas de recuperación anteriores. No se restauran archivos sobre trabajo ajeno ni se utiliza force push.
- La auditoría no identifica modificaciones de experimentos pendientes de integración: las implementaciones aprobadas ya están en el Inicio activo y las referencias históricas se conservan.

## Conjunto aprobado

1. **Casos de éxito:** Dunkin, ISSIMA y Flying Fish, con fotografías y testimonios documentales. Isotipo multicolor de Media Branding en las tres fichas. Testimonios completos desde la apertura en escritorio, composición 60/40 y scroll exclusivo de la columna informativa.
2. **Lectura compacta:** encabezado y cierre fuera del scroller de tablet/móvil; corrección de la franja fotográfica superior y del scroll retenido al reabrir. Lectura por teclado y retorno al activador conservados.
3. **Clientes:** ocho logotipos publicados en la fuente oficial: Coca-Cola, Pepsi, Nestlé, Bimbo, BAC Credomatic, Gatorade, Lipton y Pandora. MAPFRE y Salvavidas excluidas. PNG originales, procedencia y preparación reproducible conservados; solo los PNG web se despliegan.
4. **Trabajo ya publicado que permanece:** identidades oficiales, Grupo Branding blanco, focus global, flechas SVG, hero, máscaras, transición cinematográfica Soluciones → Proyectos, cierre editorial, tres divisiones y Contacto Inteligente.

Durante esta operación solo se actualiza la documentación de aprobación/publicación. No se modifican estilos, componentes ni comportamiento aprobados. ARQ-02/COPY-03 y los archivos protegidos de las animaciones permanecen intactos.

## Compilación y colaboración

El flujo existente `.github/workflows/pages.yml` compila y valida con Python, verifica la sintaxis JavaScript y despliega únicamente `_site/`. El prefijo de GitHub Pages se obtiene de su configuración; no se publican rutas absolutas de localhost.

La compilación habitual necesita Git y Python, sin acceso a la fuente remota ni dependencias de imagen. Los originales de clientes y proyectos, sus manifiestos y herramientas de regeneración se versionan en el repositorio. Pillow y pypdf se necesitan únicamente para las comprobaciones y preparaciones opcionales de imagen documentadas en los inventarios. Capturas, videos, cachés, copias temporales, originales de análisis ajenos al inventario y registros de QA permanecen fuera del artefacto público.

## Verificación de publicación

El cierre exige comprobar el resultado exitoso de Actions, el `sourceCommit` de `deployment.json`, la integridad de los archivos publicados y las cinco páginas públicas. Las evidencias de esta ejecución, el commit definitivo y los resultados se guardan en `output/publicacion-integral-2026-11-18/` y se comunican en la entrega. Un push exitoso por sí solo no constituye el cierre.

Informes de las implementaciones aprobadas:

- [Refinamiento de casos](../experimentos/inicio-v01/proyectos-refinamiento-final-qa.md).
- [Clientes y procedencia](../experimentos/inicio-v01/clientes-qa.md).
- [Identidades oficiales](identidad-implementacion-2026-11-18.md).
- [Focus global](../shared/focus/README.md).

## Límites que permanecen

- Contacto Inteligente y Newsletter no tienen backend real. No se añaden envíos, almacenamiento ni confirmaciones de recepción.
- Las pruebas físicas iOS/iPadOS continúan pendientes. La emulación de viewport y Responsive Design Mode no las sustituyen.
- Las validaciones locales recientes de Safari macOS se realizaron sobre el paquete abierto como archivo. No se presentan como comprobación de transporte HTTP de aquella ejecución; el alcance de la nueva revisión pública se detalla en la entrega.
- Se mantienen los pendientes documentales y recursos conceptuales de otras secciones descritos en los inventarios anteriores. No se atribuyen a clientes fotografías sin evidencia.
- La autorización corresponde al prototipo de revisión en GitHub Pages, sin despliegue en dominios comerciales.
