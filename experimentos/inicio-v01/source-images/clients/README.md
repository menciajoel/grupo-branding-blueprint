# Logotipos originales de clientes

Fuente: https://mediabranding.net/spanish.html, sección «Nuestros clientes».

Los ocho PNG se conservan byte por byte tal como fueron recuperados. Todos tienen
5703 × 2814 px. Sus URL, hashes y razones de selección constan en `../../clients.json`.
La captura textual `mediabranding-clientes.source.txt` conserva solo el fragmento
relevante de la fuente, con las 23 referencias gráficas publicadas. No es una página
del prototipo ni se incluye en el despliegue.

MAPFRE y Salvavidas están expresamente excluidas de la selección. No se incorpora
ningún recurso de esas dos marcas. Las relaciones se respaldan exclusivamente en
la presencia de cada logotipo en la fuente indicada, sin añadir campañas ni resultados.

| Marca | Archivo publicado | Original conservado | Línea de la página fuente | PNG web (bytes) |
| --- | --- | --- | ---: | ---: |
| Coca-Cola | `coca.png` | `coca-cola.png` | 765 | 71171 |
| Pepsi | `pepsi.png` | `pepsi.png` | 753 | 51021 |
| Nestlé | `nestle.png` | `nestle.png` | 741 | 86308 |
| Bimbo | `bimbo.png` | `bimbo.png` | 657 | 53784 |
| BAC Credomatic | `bac.png` | `bac-credomatic.png` | 649 | 51743 |
| Gatorade | `gatorade.png` | `gatorade.png` | 665 | 30015 |
| Lipton | `lipton.png` | `lipton.png` | 673 | 79044 |
| Pandora | `pandora.png` | `pandora.png` | 721 | 31967 |

## Derivados web

En `../../assets/media/clients/` se guardan ocho PNG de 800 × 395 px. Se reduce
proporcionalmente el lienzo completo, conservando transparencia e información de
color; no se recorta, redibuja, recolorea ni utiliza IA. Los 4.750.123 bytes
originales se reducen a 455.053 bytes de recursos web (90,4 % menos). Las dimensiones
y la carga diferida están declaradas en el HTML.

La fuente publica PNG para estas marcas; no enlaza SVG de ellas en este bloque.
Los ocho originales seleccionados pudieron recuperarse.

## Regenerar y verificar

La preparación opcional requiere Pillow. Desde la raíz del repositorio:

```sh
python3 -m pip install Pillow
python3 -B experimentos/inicio-v01/prepare_client_logos.py
python3 -B experimentos/inicio-v01/build.py
python3 -B experimentos/inicio-v01/verify_clients.py --originals
python3 -B tools/build_site.py
```

La compilación habitual usa solo la biblioteca estándar de Python; consume los
PNG web y `clients.json`, sin acceder a la red ni necesitar Pillow. Los originales
y la procedencia quedan fuera del paquete público.
