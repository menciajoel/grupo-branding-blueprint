# Identidades oficiales — implementación local

Fecha: 18 de noviembre de 2026. Estado: implementado localmente; pendiente de aprobación visual y validación en Safari. Sin commit, push ni despliegue.

## Fuentes y protección

- Referencia visual: `/Users/joelmencia/Downloads/marca grupo branding/BRAND BOARD GENERAL GB.pdf`, revisado íntegramente.
- Recursos definitivos de esta intervención: las tres variantes `horizontal-color-blanco-01.svg` entregadas por Joel. Se usan los archivos recibidos sin modificar sus trazados, colores ni composición.
- Estado de partida: `main`, commit `d88251a2b6e3739e9a6d08b188ea53e9f01968fe`, con cambios locales previos conservados.
- Recuperación local: `output/identidad-global-2026-11-18/antes-identidad.tar.gz`, `cambios-previos.patch` y `proteccion.json`. Los puntos de recuperación anteriores permanecen disponibles.
- La comparación SHA-256 contra esa instantánea confirma que ningún CSS ni JavaScript cambió durante esta intervención. ARQ-02/COPY-03, fotografías, casos documentados, recursos originales, focus e iconos SVG previos permanecen intactos. No se eliminó ningún archivo registrado en la instantánea.

## Inventario oficial

| Marca | SVG fuente en `assets/brand/` | ViewBox | Bytes |
| --- | --- | --- | ---: |
| Media Branding | `media-branding/horizontal-color-blanco-01.svg` | `0 0 529.25 157.50999` | 19.697 |
| Linkbranding | `linkbranding/horizontal-color-blanco-01.svg` | `0 0 923.91998 200.77` | 12.658 |
| Media Print | `media-printing/horizontal-color-blanco-01.svg` | `0 0 333.06 136.46001` | 63.306 |
| Grupo Branding | `grupo-branding/horizontal-blanco.svg` | Original aprobado | Sin cambios |
| Grupo Branding, isotipo | `grupo-branding/isotipo-blanco.svg` | Original aprobado | Sin cambios |

Los SVG contienen gráficos vectoriales, sin fuentes externas, texto HTML reconstruido, imágenes raster incrustadas, scripts ni enlaces externos. La transparencia y las proporciones proceden de los originales. No se aplican filtros CSS a los logotipos.

Los hashes exactos se registran en `assets/brand/approved-usage.json` y se verifican con `python3 -B tools/verify_identity.py`. No faltan variantes oficiales para el alcance solicitado.

## Sustituciones y superficies

| Página/superficie | Aplicación | Cantidad |
| --- | --- | ---: |
| Inicio / capítulos de divisiones | Tres logotipos completos oficiales, isotipo a color y nombre gráfico blanco | 3 |
| Media Branding / encabezado y footer | Variante oficial multicolor/blanco | 2 |
| Linkbranding / encabezado y footer | Variante oficial verde/blanco | 2 |
| Linkbranding / presentación del grupo | Logotipos completos oficiales de Media Branding y Media Print | 2 |
| Media Print / encabezado y footer | Variante oficial multicolor/blanco | 2 |
| Contacto / especialidad condicional | Isotipo oficial independiente de cada empresa, conservando la etiqueta funcional aprobada | 3 recursos |
| Contacto / finalización | Isotipo oficial blanco de Grupo Branding | 1 |
| Pestañas del navegador | Isotipo de cada división; blanco de Grupo Branding en Inicio y Contacto | 5 favicons |

Total: once colocaciones de logotipos completos de divisiones actualizadas. Los logotipos completos de Grupo Branding en encabezados y footers continúan blancos y usan sus recursos anteriores.

Los menús y menús móviles reutilizan el encabezado existente. No se añadieron logotipos duplicados. Los nombres en navegación, pestañas, CTA y selectores se conservan como etiquetas funcionales; no sustituyen los logotipos gráficos de presentación.

Contacto conserva el formato aprobado «isotipo oficial + nombre funcional de especialidad». Los isotipos se extraen copiando los nodos vectoriales originales de los nuevos SVG, sin redibujarlos. `contacto/assets/provenance.json` registra fuente, hash y viewBox; el verificador compara también los nodos extraídos con los originales. La identificación neutral no duplica el logotipo matriz.

El isotipo monumental, las máscaras fotográficas, las facetas animadas y la decoración independiente azul/cian de Inicio permanecen intactos. Los experimentos archivados no se modificaron.

## Archivos de implementación

- `experimentos/inicio-v01/build.py`, `template.html` y `index.html`: referencias de logotipos y favicon.
- `media-branding/media.json`, `template.html` y `index.html`: fuente oficial de marca, hash y favicon. El resto del registro de medios permanece igual.
- `shared/divisions/render.py`, `linkbranding/index.html` y `media-print/index.html`: logotipos de encabezados, footers, presentación del grupo y favicons.
- `contacto/build.py`, `template.html`, `index.html`, tres SVG de `contacto/assets/` y `provenance.json`: extracción nativa, favicon y firma blanca final.
- `assets/brand/approved-usage.json`, tres nuevos SVG originales y `tools/verify_identity.py`: inventario e integridad.
- `tools/build_site.py`: ejecuta la comprobación de identidades al construir.
- `shared/inicio/verify.py`: admite exclusivamente las tres referencias de marca autorizadas al comprobar la estructura protegida anterior. Los hashes de las animaciones y la aprobación original no se cambian.
- Este informe y las comparativas locales de QA.

## QA realizado

| Comprobación | Resultado y evidencia |
| --- | --- |
| Chromium, cinco páginas a 1440×900, 768×1024 y 390×844 | Capturas antes/después; sin desbordamiento horizontal. `before-layout.json` / `after-layout.json`. |
| Proporciones de encabezados | Ancho de marca y altura del encabezado conservados. La diferencia intrínseca del nuevo SVG de Media Print es inferior a 1 px en estas pruebas; no se deforma el archivo. |
| Tres capítulos de Inicio, desktop/tablet/móvil | Tres marcas oficiales visibles en sus contenedores anteriores; `object-fit: contain`, filtro `none`. `inicio-brand-qa.json` y nueve capturas `inicio-{marca}-{formato}.jpg`. |
| Footers de Inicio y tres divisiones | SVG cargados, proporciones conservadas; Grupo Branding blanco. `footers-qa.json`. |
| Menús móviles y navegación | Apertura de los tres menús, acceso a Contacto y retorno contextual comprobados. |
| Contacto, tres orígenes y origen general | Especialidad, isotipo y retorno correctos; origen general neutral sin duplicar marca. `contacto-identidad-qa.json`. |
| Recorrido completo de Contacto | Validación, saludo, proyecto y final neutral comprobados en móvil con Media Print. Firma de Grupo Branding blanca. `contacto-final-mobile.jpg`. |
| Recursos originales | Tres nuevos SVG sin alteraciones; extracción de isotipos verificable por nodos y hashes. |
| Compilación local y con prefijo Pages | Ambas correctas. 138 archivos estáticos; 177 referencias locales resueltas. La comprobación del prefijo es local y no representa un despliegue. |
| Protecciones editoriales y funcionales | Verificadores de Inicio, casos documentados, divisiones, Contacto y transiciones aprobadas correctos. CSS/JS idénticos a la instantánea. |
| Consola | Sin advertencias ni errores capturados en la pestaña final de revisión de Chromium. No equivale a una auditoría nueva exhaustiva de cada interacción del sitio. |
| Safari macOS | Pendiente: Safari dejó de responder al control de la ventana durante la preparación de la prueba. No se reinició ni se cerró la ventana de revisión del usuario. |
| Safari iOS/iPadOS y dispositivos físicos | Pendientes. Las pruebas responsive indicadas son emulación de viewport en Chromium. |

No se modificaron las animaciones, el tratamiento de movimiento reducido ni los estilos de focus. Su código e integridad se verificaron; no se declara una nueva cobertura completa de todas sus combinaciones en Safari.

## Evidencia visual

Carpeta local: `output/identidad-global-2026-11-18/`.

- `comparativas.html`: comparativas de encabezados en el mismo viewport y capturas de las tres marcas en Inicio, footers, menús y Contacto.
- `preview-final.jpg`: composición final de Media Branding dentro del Inicio a 1470×780.
- `recursos-oficiales.jpg`: vista conjunta de los tres SVG recibidos.
- `integridad-final.json`: archivos cambiados respecto a la instantánea, sin archivos ausentes ni CSS/JS modificados.

Las comparativas de encabezados muestran únicamente esa región para no confundir diferencias de instante del revelado inicial del hero con cambios de identidad. Los archivos de QA no forman parte del artefacto estático.

## Revisión local

- Inicio: `http://192.168.68.120:4190/experimentos/inicio-v01/`
- Media Branding: `http://192.168.68.120:4190/media-branding/`
- Linkbranding: `http://192.168.68.120:4190/linkbranding/`
- Media Print: `http://192.168.68.120:4190/media-print/`
- Contacto: `http://192.168.68.120:4190/contacto/`

Servidor local activo. Estas URL requieren estar en la misma red local y que el equipo anfitrión permanezca encendido.

Pendientes: aprobación visual y las pruebas Safari indicadas. No se ha creado commit ni realizado push o publicación.
