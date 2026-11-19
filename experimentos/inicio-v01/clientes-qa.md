# Ocho logotipos de clientes — implementación local

Estado: aprobado por Joel para publicación integral. Este informe conserva la validación local previa; el cierre se documenta en [el registro de publicación](../../docs/publicacion-integral-final-2026-11-18.md).

## Fuente y selección

Fuente obligatoria: [Media Branding, Nuestros clientes](https://mediabranding.net/spanish.html#clientDiv). Se inspeccionaron las 23 referencias gráficas publicadas en ese bloque. Se conservaron las URL exactas, fecha de recuperación, fragmento de fuente, dimensiones y hashes en `clients.json` y `source-images/clients/`.

Se seleccionan **Coca-Cola, Pepsi, Nestlé, Bimbo, BAC Credomatic, Gatorade, Lipton y Pandora**. Es una selección editorial por reconocimiento de marca y variedad comercial; no se presenta como un ranking cuantitativo ni implica resultados de campañas.

- Coca-Cola, Pepsi, Nestlé y Bimbo aportan reconocimiento en consumo masivo.
- Gatorade y Lipton amplían la representación de bebidas y deporte.
- Pandora añade una referencia de joyería y retail.
- BAC Credomatic incorpora una referencia financiera regional.

Las ocho aparecen en la fuente. MAPFRE y Salvavidas se excluyen expresamente y no tienen recursos incorporados al componente. No se añaden clientes, relaciones comerciales, campañas, cifras ni resultados ajenos a la fuente.

## Recursos recuperados

Se recuperaron los originales `coca.png`, `pepsi.png`, `nestle.png`, `bimbo.png`, `bac.png`, `gatorade.png`, `lipton.png` y `pandora.png`, todos de 5703×2814 px. Las copias se conservan sin modificación en `source-images/clients/`, con nombres legibles. La tabla completa de equivalencias y URL se encuentra en [el inventario de originales](source-images/clients/README.md).

Los ocho derivados PNG tienen 800×395 px y conservan el lienzo completo, transparencia y metadatos de color pertinentes. Solo se aplica reducción proporcional y compresión PNG; no se recorta, recolorea, reconstruye ni utiliza IA. La comprobación opcional compara los píxeles decodificados con esa transformación del original.

Peso: **4.750.123 bytes originales → 455.053 bytes web**, un **90,4 % menos**. La fuente no referencia SVG de estas ocho marcas en la sección de clientes. No falta ninguno de los ocho PNG seleccionados.

## Implementación

- Se completa exclusivamente el espacio reservado `COPY-P01-S05-B03` / pendiente `COPY-P01-S05-P01` del Inicio.
- Se mantienen el identificador, titular, párrafo, fondo, tipografía y separadores existentes de Marcas. El crecimiento natural de la sección corresponde al contenido incorporado.
- Grilla estática de cuatro columnas en escritorio/tablet y dos en móvil; ocho elementos en todos los casos, sin carrusel, enlaces adicionales, tarjetas, fondos decorativos ni animaciones nuevas.
- Anchos ópticos individuales, centrado y proporciones originales. Nestlé conserva el gris publicado por la fuente; ninguna imagen utiliza filtros CSS, cambios de opacidad o recoloreado para uniformar su aspecto.
- Lista semántica con ocho imágenes y nombres alternativos, dimensiones reservadas, carga diferida y decodificación asíncrona. No se añaden controles ni paradas de tabulación.
- `clients.css` se limita al componente de Marcas; `styles.css` y `motion.js` no se modifican.
- ARQ-02/COPY-03 y el registro editorial no se alteran: el bloque pendiente se identifica como cumplido por el inventario gráfico, sin mostrar la etiqueta técnica anterior al visitante.

## QA

| Comprobación | Resultado |
| --- | --- |
| Fuente | Ocho URL seleccionadas presentes en las 23 referencias de «Nuestros clientes». Copias originales y fragmento de fuente conservados con SHA-256. |
| Exclusiones | MAPFRE y Salvavidas ausentes del componente y de sus recursos. |
| Chromium | 1920×1080, 1440×900, 1024×768, 900×700, 768×1024, 600×900, 430×932, 390×844, 375×667 y 320×568. Ocho imágenes cargadas, contenidas en sus celdas y sin desbordamiento horizontal. |
| Equilibrio y contraste | Revisión visual de escritorio, tablet y móvil, conservando cada color original. Los logotipos tienen anchos ópticos diferenciados; no se estiran ni recortan. |
| Safari macOS | Ocho marcas visibles en escritorio y en Responsive Design Mode a 768×1024 y 390×844. Revisión adicional de la última fila mediante scroll móvil. Pruebas sobre el paquete estático abierto como archivo local. |
| Accesibilidad | Lista con ocho nombres de marca accesibles; imágenes estáticas sin nuevas interacciones. Focus y navegación existentes preservados. |
| Recursos | PNG con hashes, dimensiones y proporciones comprobadas. Verificación adicional de los píxeles del derivado contra el resize del lienzo original. |
| Consola | Sin advertencias ni errores capturados en Chromium. No se inspeccionó la consola de Safari en esta intervención. |
| Compilación | Construcción estática y comprobaciones de copy, identidades, navegación y animaciones protegidas. Se conserva la construcción bajo prefijo de GitHub Pages sin desplegarla. |

Safari se ha validado sobre archivo local; la carga HTTP de Safari y las pruebas en dispositivos físicos iOS/iPadOS siguen pendientes. En móvil, los ocho elementos se recorren mediante el scroll normal de la página.

## Protección y archivos

Recuperación previa en `output/clientes-8-2026-11-18/antes-clientes.tar.gz` y `proteccion.json`, incluyendo los refinamientos locales de Proyectos pendientes de publicación.

Modificados únicamente para este componente: `build.py`, `template.html`, `index.html`, `verify.py` y `shared/inicio/verify.py`. Este último reconoce solo la sustitución autorizada del placeholder al comparar el cuerpo protegido; los hashes de aprobación no cambian.

Añadidos: `clients.css`, `clients.json`, `prepare_client_logos.py`, `verify_clients.py`, ocho PNG web, ocho originales, fragmento de fuente, inventario y este informe. No se modifica JavaScript ni se añade ninguna timeline o listener.

Las fuentes de Proyectos, fotografías, testimonios, isotipos oficiales, correcciones de focus y SVG, hero, secciones posteriores y recursos cinematográficos permanecen idénticos a la instantánea de inicio de esta intervención.

## Revisión local

Vista previa: <http://192.168.68.120:4190/experimentos/inicio-v01/#marcas>. La sección se encuentra también en Menú → Marcas. El servidor permanece activo; el enlace requiere estar en la misma red local.

Evidencias en `output/clientes-8-2026-11-18/`: capturas de escritorio/tablet/móvil y Safari, `chromium-qa.json`, `safari-qa.json`, `consola-chromium.json`, registros de compilación e `integridad-final.json`. Las evidencias y los originales no se incorporan al artefacto público.
