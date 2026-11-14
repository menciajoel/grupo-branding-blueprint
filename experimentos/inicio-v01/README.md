# Inicio · Experimento 02

Prototipo completo de las ocho secciones de Inicio. Reemplaza la exploración anterior en esta misma carpeta. Pendiente de aprobación por dirección de arte. La portada pública y `docs/arq.html` permanecen intactas.

## Ejecutar y editar

Desde la raíz del repositorio:

```sh
python3 -B -m http.server 4173 --bind 127.0.0.1
```

Abrir `http://127.0.0.1:4173/experimentos/inicio-v01/`. La carpeta es autónoma: también puede servirse desde otra ubicación con sus recursos relativos. No requiere instalación, servicios externos ni compilación para ejecutarse.

- `content.json`: copia estructurada de COPY-03, destinos y casos documentados. No contiene decisiones de composición. El contenido debe mantenerse aprobado durante esta etapa.
- `media.json`: fotografías, variantes locales, créditos, licencia, texto alternativo y punto focal.
- `build.py`: renderiza el contenido en la estructura fija de `template.html`; genera `index.html`. Ejecutar `python3 -B build.py` tras una edición editorial.
- `styles.css`: composición, tipografía, color y responsive. `motion.js`: control de presentación, GSAP, navegación y estados. Estas capas quedan fuera del futuro editor de contenido.
- `assets/vendor/`: GSAP 3.15.1 y ScrollTrigger oficiales, alojados localmente. No se decide aquí el stack o CMS definitivo.

## Movimiento

En pantallas desde 1100 × 780: ensamblaje rígido de los tres polígonos oficiales y entrada tipográfica. El scroll nativo gobierna salida por máscaras, separación, convergencia central, revelado fotográfico y traslado del conjunto al lado de las divisiones. Cada transformación conserva la geometría: traslación, rotación y escala uniforme. Una sola escena fijada; sin interceptar rueda/táctil ni esperas obligatorias.

En móvil y tablet: composición vertical propia, isotipo recortado entre titular y texto, transformación breve sin fijación y presentación de divisiones en el flujo del documento. Preferencia de movimiento reducido y control manual: documento estático completo. El contenido existe en el HTML inicial, incluso sin JavaScript.

## Verificación

```sh
python3 -B build.py
python3 -B verify.py
node --check motion.js
python3 -B verify-browser.py
```

`verify.py` contrasta los 46 bloques, casos y estados del formulario con la fuente aprobada, verifica geometría, recursos y hashes protegidos. `verify-browser.py` utiliza un Playwright CLI existente, sin instalar dependencias en el proyecto. Requiere sesión abierta `gb-redesign`; admite `--session`, `--url` y `--label`. Definir `PLAYWRIGHT_WRAPPER` si el wrapper está en otra ruta. Sus evidencias se guardan localmente en `output/playwright/`; no forman parte de la publicación. El informe visual local es `design-qa.md`; las capturas y este informe no se publican.

## Alcance y recursos

Las páginas internas completas no forman parte de Inicio: los CTA conservan sus destinos aprobados en `data-route` y abren vistas de revisión con contenido aprobado. Los enlaces `?vista=...` funcionan también al abrir una pestaña nueva. Los tres casos usan texto y referencias documentales originales, sin fotografías de stock como prueba de ejecución. Faltan fotografías reales de proyectos y logotipos de clientes; se muestran pendientes explícitos.

El newsletter valida correo y consentimiento y presenta el mensaje aprobado como vista previa identificada. No envía, almacena ni suscribe direcciones. Contacto y suscripción necesitan integración posterior.

Fotografías provisionales de Osman Rana, Yvette de Wit y Bank Phrom, [licencia Unsplash](https://unsplash.com/license), con uso comercial permitido. Fuentes y créditos exactos en `media.json` y visor de créditos. Inter Tight: SIL OFL. Iconos Lucide: ISC. GSAP/ScrollTrigger: [Standard License](https://gsap.com/standard-license). Se preservan los avisos originales.

Los dos isotipos se extrajeron de los respectivos SVG horizontales oficiales, copiando literalmente sus tres polígonos y definiciones; solo se recortó el viewBox. No se redibujaron ni alteraron colores o proporciones.
