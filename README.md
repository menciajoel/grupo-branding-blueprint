# Grupo Branding — documentación de preproducción

Este repositorio presenta la documentación del nuevo sitio web de Grupo Branding. Todavía no contiene el sitio corporativo definitivo.

## Estructura

```text
/
├── index.html                         Portada pública de la documentación
├── README.md                          Guía del repositorio
├── .gitignore
├── docs/
│   ├── arq.html                       ARQ-02 + COPY-03, documento interactivo standalone
│   └── og-image.png                   Imagen de vista previa de la documentación
├── recursos/                          Material gráfico de referencia, solo local por ahora
└── _archivo/
    └── email-entrega-arq01.html       Correo de una entrega anterior
```

`docs/arq.html` contiene las dos fuentes de datos del documento: `blueprint` para la arquitectura y `copyBlueprint` para el contenido. Se puede abrir directamente en un navegador, sin servidor, build, npm ni framework. La portada `index.html` solo enlaza a este documento.

La carpeta `recursos/` conserva las imágenes originales para una etapa posterior. Por ahora no se versiona ni se publica en Pages; está excluida en `.gitignore`. El correo en `_archivo/` es documentación histórica y no forma parte del sitio.

## Futuro desarrollo web

El proyecto web se organizará separadamente cuando comience su desarrollo. No se ha creado una carpeta `/web/` ni infraestructura de aplicación en esta etapa. La documentación en `docs/` sirve como referencia de arquitectura y contenido, no como implementación del portal corporativo.

## GitHub Pages

Pages utiliza la rama `main` y la raíz `/` del repositorio. Al publicar un commit en `main`, la URL base muestra `index.html`; el documento se abre en `/docs/arq.html`. El documento mantiene `noindex, nofollow, noarchive` por tratarse de preproducción.
