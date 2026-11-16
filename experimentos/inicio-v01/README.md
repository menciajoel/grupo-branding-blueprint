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

Concepto de transición: **Tres fuerzas, un grupo**. La secuencia GSAP contiene tres estados explícitos: **A**, hero monumental a la derecha; **B**, isotipo fotográfico completo centrado con el tamaño de la convergencia original; **C**, isotipo fotográfico a la derecha junto a las divisiones. Un contenedor común del SVG mantiene unidas sus tres piezas. El giro A → B acumula 360° mediante una propiedad numérica de GSAP; B y C conservan 360°, visualmente equivalentes a la orientación oficial. El scroll inverso recorre 360° → 0° sin normalizar el ángulo. Se conservan exactamente A y C, el copy y las animaciones tipográficas.

En escritorio desde 1100 × 780: A → B ocupa el 0–44 % del scroll; B permanece reconocible entre el 44–57 %, sin bloquear el desplazamiento; B → C ocupa el 57–100 %, coordinado con la entrada de divisiones. Las fotografías ya están reveladas al alcanzar B. El recorrido inverso restaura C → B → A. El tamaño de B y C conserva las proporciones originales de cada estado.

En móvil y tablet: los mismos tres estados se adaptan al encuadre sin fijar la pantalla. En móvil la convergencia sucede antes de que la ventana gráfica salga del viewport; la presentación final de las divisiones sigue en el flujo original. Preferencia de movimiento reducido y control manual: documento estático completo. El contenido existe en el HTML inicial, incluso sin JavaScript.

Recuperación de la versión anterior: etiqueta publicada `inicio-antes-transicion-v03`, commit `a869328fe0aefe18da7a7268590d793cb1400980`. La etiqueta identifica exactamente el árbol publicado antes de este refinamiento.

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
