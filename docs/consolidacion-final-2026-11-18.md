# Consolidación final aprobada — 18 de noviembre de 2026

Autorización de Joel: integrar todos los cambios aprobados pendientes, crear commits, publicar en `main` y desplegar el prototipo mediante GitHub Pages. No se autoriza un rediseño ni publicación en los dominios comerciales.

## Estado de partida y recuperación

- Rama: `main`, alineada con `origin/main` tras fetch.
- Commit de partida: `d88251a2b6e3739e9a6d08b188ea53e9f01968fe`.
- Las ramas `codex/consolidacion-cinematografica` y `codex/integracion-contacto-inteligente` ya son antecesoras de `main`; no requieren otro merge.
- Punto de recuperación: etiqueta local `recuperacion/consolidacion-final-20261118` sobre el commit de partida. Los 261 archivos de trabajo existentes se preservan también en `output/consolidacion-final-2026-11-18/antes-consolidacion.tar.gz`, con inventario SHA-256 y parche de los cambios anteriores. La etiqueta no pretende contener los archivos que todavía estaban sin commit.
- No se eliminan experimentos, informes anteriores ni etiquetas históricas. Las salidas de QA, cachés y originales privados continúan excluidos del despliegue.

## Cambios incluidos

1. **Focus global:** `shared/focus/` y sus referencias en las cinco páginas. Conserva el focus funcional y la navegación por teclado, distinguiendo las transferencias activadas por puntero.
2. **Iconos SVG:** sustitución de los símbolos visuales del Contacto y la flecha de la portada documental; las demás superficies usan los recursos vectoriales existentes. Los iconos decorativos heredan `currentColor` o conservan su recurso SVG aprobado y no dependen de una fuente emoji.
3. **Casos reales de Inicio:** Dunkin, ISSIMA y Flying Fish. Registro testimonial y fotográfico verificable, tres originales extraídos del PDF y once variantes WebP. Modales editoriales, testimonios expandibles y respaldo HTML sin JavaScript. No se atribuyen estos recursos a otros proyectos.
4. **Identidades oficiales:** tres SVG `horizontal-color-blanco-01.svg` entregados por Joel, once colocaciones completas, isotipos nativos de Contacto y favicons correspondientes. Grupo Branding conserva logotipo y firma blancos; el elemento monumental/decorativo independiente de Inicio sigue intacto.
5. **Compilación y documentación:** validación de casos, identidades y dependencias estáticas; ampliación del chequeo sintáctico de CI a los nuevos archivos JS; inventarios y guías de reconstrucción. No se modifican las composiciones.

Los cambios pendientes de Git corresponden a estas intervenciones aprobadas. No se incorporan nuevas modificaciones de los experimentos de referencia ni propuestas creativas sin aprobar.

## Protecciones

Permanecen intactos `docs/arq.html`, los registros de copy, los estilos aprobados del hero, las animaciones GSAP/ScrollTrigger, las cuatro fuentes cinematográficas/de cierre y la lógica condicional de Contacto. La única extensión de `motion.js` es el evento síncrono del renderizado documental ya aprobado. Los verificadores permiten exclusivamente esas excepciones y las referencias oficiales de marca, conservando los hashes de aprobación anteriores.

El paquete público se obtiene mediante el flujo existente de Actions, con prefijo `/grupo-branding-blueprint`. Incluye las cinco páginas y sus dependencias; las fuentes Python/JSON, PNG originales, inventarios e instrucciones permanecen en el repositorio para el colaborador. `docs/arq.html` está versionado en ese mismo repositorio.

## Verificación y entrega

La compilación comprueba contenido, testimonios, recursos, geometrías, rutas, orígenes de Contacto e integridad de las animaciones. Se revisan las cinco páginas y los tres casos en el paquete publicado. El manifiesto público `deployment.json` identifica el commit servido y los hashes de los recursos. Las evidencias de esta ejecución se conservan localmente en `output/consolidacion-final-2026-11-18/`; el resultado y commit definitivos se comunican al finalizar la publicación.

## Límites que permanecen

- iOS/iPadOS físicos: pendientes, expresamente fuera de las pruebas completadas. La emulación responsive no los sustituye.
- Safari macOS: la última intervención de identidades no pudo concluir su prueba porque el navegador dejó de responder al control; no se considera un resultado aprobado de esa ejecución.
- Contacto Inteligente continúa sin backend ni envío real; su final es neutral. Newsletter tampoco dispone de envío real.
- Permanecen las páginas independientes y evidencias documentales adicionales registradas como pendientes en las guías existentes. Las fotografías conceptuales de otras secciones conservan su identificación.
- Flying Fish conserva la nitidez de la fotografía documental original. No se amplía ni se inventan resultados comerciales.

Esta publicación es exclusivamente el prototipo público de revisión.
