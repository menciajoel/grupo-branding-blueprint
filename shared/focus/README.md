# Foco compartido

Esta capa modifica únicamente la indicación visual. Las páginas conservan sus
`focus()`, `tabindex`, navegación, estados seleccionados y animaciones.

- `focus.css` utiliza `:focus-visible`, colores existentes y una señal inferior
  para campos de texto. Los fondos claros reutilizan las tintas de cada marca.
- `focus.js` vincula una activación real de puntero con los destinos conocidos
  de anclas, capítulos y etapas de Contacto. Evita el contorno heredado por
  Safari al transferir foco por script, sin retirar el foco funcional.
- La excepción termina al salir del destino, usar una tecla, iniciar otra
  interacción o abandonar la página. No existe un modo global ratón/teclado.
- Las activaciones de teclado y de asistencia sin señal de puntero conservan
  las heurísticas del navegador. Los colores forzados conservan su indicador.

Se carga una sola vez desde los generadores de las cinco páginas, antes de los
controladores existentes. Sus hashes se regeneran con los comandos habituales
de compilación; el empaquetador incluye únicamente CSS y JavaScript referenciados.

Al incorporar una nueva transferencia de foco, revisar su destino en
`destinations()` y comprobar clic, Tab, Shift+Tab y el foco después de GSAP en
Safari y Chromium. No sustituir esta asociación por una clase global de modalidad.
