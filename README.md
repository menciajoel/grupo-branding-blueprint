# Grupo Branding — prototipos para colaboración

Media Branding, incluida la galería de Proyectos, cuenta con aprobación creativa del director (18-11-2026). Este repositorio conserva el Inicio experimental de Grupo Branding y una pantalla demostrativa de Contacto. Es una presentación navegable en GitHub Pages, no el sitio definitivo en los dominios comerciales.

## Empezar

Requisitos: Git y Python **3.9 o posterior**. No se necesita npm, framework, CMS ni instalación de paquetes para compilar o servir las páginas. GSAP, ScrollTrigger, fuentes e iconos se incluyen localmente con sus licencias. Node.js solo es necesario para el chequeo opcional de sintaxis JavaScript; GitHub Actions lo ejecuta automáticamente.

```sh
git clone https://github.com/menciajoel/grupo-branding-blueprint.git
cd grupo-branding-blueprint
python3 -B tools/build_site.py
python3 -B -m http.server 4173 --bind 127.0.0.1 --directory _site
```

Abrir:

- Media Branding: <http://127.0.0.1:4173/media-branding/>
- Grupo Branding: <http://127.0.0.1:4173/experimentos/inicio-v01/>
- Contacto: <http://127.0.0.1:4173/contacto/>
- Documentación aprobada: <http://127.0.0.1:4173/docs/arq.html>

La compilación trabaja en una copia temporal, verifica el contenido y genera únicamente `_site/`. No sobrescribe las fuentes ni los HTML aprobados. Puede repetirse sin los originales de `recursos/`, sin capturas y sin carpetas `output/`.

## Estructura

```text
media-branding/             Página completa aprobada: fuentes editables y recursos web
contacto/                   COPY-P08 y presentación sin envíos
experimentos/inicio-v01/     Inicio aprobado existente, conservado
assets/brand/               SVG oficiales por marca
docs/arq.html               ARQ-02 + COPY-03, fuente de verdad
tools/build_site.py         Compilación aislada, prefijo de rutas y paquete estático
tools/verify_site.py        Verificación de referencias del paquete
.github/workflows/pages.yml Compilación y despliegue en GitHub Pages
_site/                      Salida regenerable, excluida de Git
```

La portada documental `index.html` permanece intacta. Los prototipos no se enlazan desde ella. El archivo histórico `_archivo/` se conserva en Git pero no se despliega. Los informes y catálogos internos, capturas, originales locales, cachés y dependencias regenerables no forman parte del paquete público.

## Editar y reconstruir

Trabajar en una rama propia, por ejemplo `git switch -c codex/ajuste-media-branding`, y solicitar revisión antes de cambiar elementos aprobados.

- **Contenido:** `media-branding/content.json` contiene los 26 bloques originales de COPY-P04; `presentation-copy.json` separa las sustituciones de Predios autorizadas para presentación; `editorial-trace.json` registra sus IDs. Contacto usa `contacto/content.json` (23 bloques de COPY-P08). No editar ARQ-02/COPY-03 para justificar una implementación.
- **Composición:** `template.html`, `build.py` y `components.py` generan el HTML. La galería se configura en `projects.json` y se renderiza en `projects_render.py`.
- **Estilos:** `tokens.css` define los colores aprobados; `styles.css` corresponde al hero y primera transición; `chapters.css` a las secciones posteriores; `projects.css` se limita a la galería. Contacto usa `contact.css`.
- **Movimiento:** `motion.js`, `chapters.js`, `projects.js`; conservar las coreografías aprobadas y el soporte de movimiento reducido. Contacto usa `contact.js`.

Después de editar fuentes, regenerar los HTML correspondientes y revisarlos antes de compilar:

```sh
python3 -B media-branding/build.py
python3 -B contacto/build.py
python3 -B media-branding/verify.py
python3 -B experimentos/inicio-v01/verify.py
python3 -B tools/build_site.py
```

El generador de Inicio es `experimentos/inicio-v01/build.py`; ejecutarlo solo al trabajar expresamente sobre Inicio. No editar únicamente un `index.html` generado: la compilación comprueba que las fuentes lo reproduzcan exactamente. Un manifiesto de protección local puede comprobarse opcionalmente con `media-branding/verify.py --baseline /ruta/manifiesto.json`.

## Actualizar imágenes

Los WebP en `media-branding/assets/media/` son los recursos completos necesarios para reconstruir la presentación; no requieren descargar archivos privados. `media.json` registra variantes, dimensiones, alt, encuadre, procedencia y condición conceptual. `projects.json` define el orden y las etiquetas de las seis fotografías.

Al sustituir una imagen: conservar proporciones, generar variantes WebP, actualizar el registro y su alt, y comprobar los encuadres en escritorio, tablet y móvil. No alterar los SVG oficiales ni sus colores. `procedencia-imagenes.json` conserva prompts y procedencia disponibles; `inventario-imagenes.md` documenta usos y sustituciones pendientes.

`prepare_media.py` es una utilidad opcional para el original del hero: requiere Pillow 11.3.0 (`python3 -m pip install Pillow==11.3.0`) y el archivo original indicado en el manifiesto. Los originales de cámara/PDF y PNG generados permanecen en el equipo del proyecto, fuera de Git. No son necesarios para compilar; solicitarlos al director si se necesita volver a producir esas fotografías.

Issima cuenta con una fotografía documental extraída del PDF original. Los recursos generados no documentan campañas de Six, Fútbol ni Powerade; mantienen visible **«Visualización conceptual · Imagen provisional»**. Los permisos para el sitio comercial definitivo y la sustitución de recursos conceptuales requieren confirmación del cliente. La autorización actual cubre esta publicación de prototipo.

## Rutas y despliegue

GitHub Pages publica desde **GitHub Actions**, no desde una copia indiscriminada de la raíz. Un push normal a `main` compila y valida, comprueba JavaScript, sube `_site/` y despliega en el entorno `github-pages`. También puede ejecutarse manualmente desde Actions. No se necesitan secretos personalizados ni credenciales en el código.

Para reproducir el paquete de Pages:

```sh
python3 -B tools/build_site.py --base-path /grupo-branding-blueprint
python3 -B tools/verify_site.py --base-path /grupo-branding-blueprint
```

El prefijo se obtiene de `configure-pages` en CI. Solo en la salida se adaptan las rutas absolutas de Contacto/Media Branding y se conectan los enlaces de Inicio a las dos páginas ya implementadas. Las demás páginas conservan sus vistas de prototipo. No se cambia el diseño ni se implementan destinos comerciales adicionales. Servir `_site/` directamente requiere compilar sin prefijo; para previsualizar un prefijo debe montarse esa carpeta bajo dicho subdirectorio.

URLs públicas:

- [Media Branding](https://menciajoel.github.io/grupo-branding-blueprint/media-branding/)
- [Inicio de Grupo Branding](https://menciajoel.github.io/grupo-branding-blueprint/experimentos/inicio-v01/)
- [Contacto](https://menciajoel.github.io/grupo-branding-blueprint/contacto/)

Revisar el resultado de Actions y el `sourceCommit` de `deployment.json` en la raíz publicada después de desplegar. La portada y `docs/arq.html` se copian sin modificaciones. El paquete incluye solo recursos referenciados y avisos de licencia; las fuentes Python/JSON, instrucciones y procedencia permanecen en el repositorio para colaboración.

## Preservación y límites

Conservar el hero, las transformaciones de Inicio, las máscaras, SVG oficiales, copy, rutas aprobadas y demás composiciones aprobadas. Las etiquetas de recuperación existentes siguen intactas; algunas apuntan a **árboles de archivos**, no a commits: inspeccionar con `git cat-file -t <etiqueta>^{}` y recuperar en una carpeta aparte con `git archive <etiqueta> | tar -x -C /ruta/vacia`. Nunca restaurar destructivamente sobre trabajo ajeno. Las etiquetas locales de trabajo no se publican indiscriminadamente porque pueden incluir material interno.

Contacto es demostrativo: no hay backend, almacenamiento ni mensajes de envío simulado. El correo de Predios es un dato demostrativo sin destinatario operativo. Newsletter y las páginas independientes de las otras empresas quedan pendientes. Las validaciones responsive y Safari de escritorio no equivalen a una prueba en iPad/iPhone físicos. El alcance aprobado sigue siendo prototipo; no se ha desplegado ningún dominio comercial.
