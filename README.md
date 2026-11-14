# Grupo Branding — documentación de preproducción

Este repositorio presenta la documentación del nuevo sitio web de Grupo Branding. Todavía no contiene el sitio corporativo definitivo.

## Estructura

```text
/
├── index.html                         Portada pública de la documentación
├── README.md                          Guía del repositorio
├── .gitignore
├── assets/
│   └── brand/                         Logotipos SVG oficiales, organizados por marca
├── docs/
│   ├── arq.html                       ARQ-02 + COPY-03, documento interactivo standalone
│   └── og-image.png                   Imagen de vista previa de la documentación
├── recursos/                          Material gráfico de referencia, solo local por ahora
└── _archivo/
    └── email-entrega-arq01.html       Correo de una entrega anterior
```

`docs/arq.html` contiene las dos fuentes de datos del documento: `blueprint` para la arquitectura y `copyBlueprint` para el contenido. Se puede abrir directamente en un navegador, sin servidor, build, npm ni framework. La portada `index.html` solo enlaza a este documento.

La carpeta `recursos/` conserva las imágenes originales para una etapa posterior. Por ahora no se versiona ni se publica en Pages; está excluida en `.gitignore`. El correo en `_archivo/` es documentación histórica y no forma parte del sitio.

## Logotipos oficiales

Los 15 SVG entregados están en `assets/brand/`, separados por marca. Cada archivo es una copia íntegra del original; se normalizó únicamente el nombre del archivo y su ubicación. La convención es `{horizontal|vertical}-{color|blanco|negro}.svg`.

| Carpeta | Variantes disponibles |
| --- | --- |
| `grupo-branding/` | `horizontal-color.svg`, `horizontal-blanco.svg`, `horizontal-negro.svg` |
| `media-branding/` | `horizontal-color.svg`, `horizontal-blanco.svg`, `horizontal-negro.svg`, `vertical-color.svg`, `vertical-blanco.svg`, `vertical-negro.svg` |
| `linkbranding/` | `horizontal-color.svg`, `horizontal-blanco.svg`, `horizontal-negro.svg` |
| `media-printing/` | `horizontal-color.svg`, `horizontal-blanco.svg`, `horizontal-negro.svg` |

Para el futuro sitio, elegir la variante según el contraste del fondo, mantener la proporción indicada por el `viewBox` y dejar espacio suficiente alrededor del logotipo. No estirar, recolorear, alterar trazados ni derivar variantes nuevas de estos archivos. Solo Media Branding cuenta con orientación vertical entre los recursos recibidos.

La entrega original incluye cuatro imágenes PNG en una subcarpeta `colores`, una paleta por marca. Se inspeccionaron como referencia cromática, pero no forman parte de esta incorporación de SVG ni sustituyen los colores de los vectores. Cualquier sistema de tokens de color deberá validarse por separado.

**Nombre pendiente de validación:** ARQ-02 y COPY-03 usan «Media Print», mientras que los archivos oficiales del logotipo dicen «Media Printing». Se conserva `media-printing/` para reflejar el material recibido. Esta diferencia no modifica la documentación aprobada.

## Futuro desarrollo web

El proyecto web se organizará separadamente cuando comience su desarrollo. No se ha creado una carpeta `/web/` ni infraestructura de aplicación en esta etapa. La documentación en `docs/` sirve como referencia de arquitectura y contenido, no como implementación del portal corporativo.

## GitHub Pages

Pages utiliza la rama `main` y la raíz `/` del repositorio. Al publicar un commit en `main`, la URL base muestra `index.html`; el documento se abre en `/docs/arq.html`. El documento mantiene `noindex, nofollow, noarchive` por tratarse de preproducción.
