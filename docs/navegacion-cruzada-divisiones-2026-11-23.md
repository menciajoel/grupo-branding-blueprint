# Navegación cruzada de divisiones · 23-11-2026

Registro de la implementación y QA locales previos a la aprobación de publicación.
La autorización posterior incluye este menú y el ajuste de Linkbranding a
«Servicios complementarios»; ver [la consolidación](publicacion-navegacion-2026-11-23.md).
Base local: `de34cd3662e9df3399ab0c4cf3b2a8895e3f92a1`.
Rama de trabajo: `codex/navegacion-cruzada-divisiones`.

## Vista previa

- [Media Branding](http://192.168.68.105:4190/media-branding/).
- [Linkbranding](http://192.168.68.105:4190/linkbranding/).
- [Media Printing](http://192.168.68.105:4190/media-print/).

En este equipo también funciona `http://127.0.0.1:4190/`. El servidor sirve `_site/`,
la compilación local sin prefijo. El IP corresponde a la red durante esta revisión.

## Integración

Las tres páginas incorporan «Divisiones» inmediatamente antes de Contacto en el
navbar de escritorio. Es una única lista generada desde
`shared/divisions/navigation.py`:

| Página | Destinos, en orden |
| --- | --- |
| Media Branding | Grupo Branding · Linkbranding · Media Printing |
| Linkbranding | Grupo Branding · Media Branding · Media Printing |
| Media Printing | Grupo Branding · Media Branding · Linkbranding |

Grupo Branding apunta a `../experimentos/inicio-v01/`: es la ruta del Inicio
aprobado y publicado, conservada por el proyecto. No se utiliza la referencia
cinematográfica ni otro prototipo antiguo. Los otros enlaces utilizan las rutas
reales `../media-branding/`, `../linkbranding/` y `../media-print/`.

El componente utiliza un disclosure HTML nativo (`details`/`summary`), con
`aria-controls`, estado `aria-expanded` sincronizado por la mejora JavaScript y
enlaces semánticos. No utiliza roles de menú de aplicación ni atrapa el foco.
Enter/Espacio activan; Escape cierra y devuelve el foco al control. Tab recorre los
destinos y sale hacia Contacto. Clic fuera o selección cierran el desplegable.
Hover es una mejora para puntero fino; el primer clic sobre una vista previa
abierta la mantiene abierta. Un puente de puntero y una espera de 180 ms evitan
cierres al atravesar la separación del panel.

Se conserva el fondo propio de cada división, sin sombras ni tarjetas decorativas.
La entrada dura 160 ms y se elimina con movimiento reducido. Los acentos se leen
de los tokens existentes: azul de `media-branding/tokens.css`, verde de
`linkbranding/theme.css` y magenta de `media-print/theme.css`. El texto conserva
el color claro y el acento se limita a una marca lateral en hover/foco. El contraste
del texto del panel supera 16:1 en los tres fondos.

### Menú móvil existente

Se conserva el umbral actual de 1280 px y el mismo botón hamburguesa. El componente
se traslada después de Contacto y permanece abierto, con el identificador
«Otras divisiones». El control del desplegable se oculta: no existe otra pulsación,
acordeón ni menú flotante. La lista DOM es la misma; su orden de teclado coincide
con el visual. La navegación principal conserva sus textos y destinos.

Los destinos usan tres columnas cuando hay espacio y una columna en móvil. El
menú conserva scroll vertical interno como respaldo en alturas pequeñas, con
`100dvh`, área segura inferior y enlaces de al menos 44 px. No se añade bloqueo
global de scroll. También el panel desktop admite scroll si una ventana muy baja
no permite mostrar los tres destinos a la vez.

Sin JavaScript, el disclosure nativo continúa dando acceso a los enlaces. Se evita
una declaración estática de `aria-expanded` que contradiga la apertura nativa;
el estado expandido se comprobó en el árbol de accesibilidad real de Chrome.

## QA

Chrome macOS, sesión aislada. Viewport y gestos emulados; no dispositivos físicos.

- Las tres divisiones: clic, doble alternancia, hover, cruce de separación, salida
  del cursor, Escape con y sin foco en el panel, clic fuera, Enter, Espacio, Tab y
  foco visible de 2 px. Grupo primero, división actual excluida y tres destinos.
- 48 estados responsive: las tres páginas en 1920×1080, 1440×900, 1366×768,
  1281×800, 1280×800, 1024×768, 768×1024, 700×900, 600×900, 430×932,
  390×844, 375×667, 320×568, 844×390, 568×320 y regreso a 1440×900.
  Sin overflow horizontal ni colisión entre logo y navbar. Los enlaces inferiores
  son alcanzables dentro del menú sin desplazar la página.
- 18 navegaciones de un toque con `hasTouch`/viewport móvil: los nueve destinos
  desde las tres divisiones, en 390×844 y 768×1024. Se prueban bajo
  `/grupo-branding-blueprint/`; al volver, el menú principal está cerrado.
- Tres comprobaciones sin JavaScript: apertura nativa, estado expandido en el
  árbol AX y navegación real al Inicio de Grupo Branding.
- 1440×240: panel desplazable y tres destinos accesibles en las tres páginas.
  Resize con foco dentro del componente: el foco pasa al hamburguesa o al control
  desktop correspondiente; no desaparece. Tab desde el último destino cierra el
  panel y alcanza Contacto.
- Movimiento reducido: las tres divisiones, sin animación/transición del nuevo
  componente y con los tres enlaces disponibles en móvil. Preferencia emulada
  restaurada al finalizar; no se cambió la del sistema.
- Regresión en 1440×900 y 390×844: hero medido en progresos .10, .55, .95 y .10,
  verificando cambio real de máscara y reversión. Cada relevo cinematográfico
  mantiene .88 desktop/.94 móvil y regresa a 1, sin pin adicional ni controlador
  duplicado. Los seis accesos probados a Contacto conservan el origen correcto.
- Compilaciones local y con prefijo: correctas. Los 152 recursos del paquete
  prefijado responden HTTP 200 y coinciden con su SHA-256. Sintaxis JavaScript y
  verificadores editoriales, identidad y rutas: correctos. Consola: cero errores
  y advertencias capturados.

Safari queda pendiente por la instrucción de utilizar Chrome y dejar Safari libre.
No se afirman pruebas físicas de iOS/iPadOS/Android ni una sesión de VoiceOver.
La comprobación de lector de pantalla corresponde a semántica/árbol AX de Chrome.

## Protección

La comparación con la recuperación confirma que, en los tres HTML, únicamente
cambian el header y las referencias a los dos recursos de navegación. El resto del
documento, incluido el footer, conserva sus bytes.

Inicio, Contacto, ARQ-02/COPY-03, logotipos, fotografías, fuentes, CSS y controladores
GSAP originales permanecen intactos. Contra el paquete de la versión aprobada,
147 recursos mantienen su SHA-256: solo cambian los tres HTML de divisiones y se
añaden `navigation.css` y `navigation.js`. No se publica ni se modifica el paquete
de GitHub Pages durante esta intervención.

Recuperación local: etiqueta `recuperacion/navegacion-cruzada-20261123`, inventario
de 298 archivos y `antes-navegacion-cruzada.tar.gz` en
`output/navegacion-cruzada-2026-11-23/`. No se descartó trabajo previo.

## Archivos

Fuentes añadidas:

- `shared/divisions/navigation.py`: destinos y lectura de tokens oficiales.
- `shared/divisions/navigation.js`: disclosure, hover, teclado y disposición responsive.
- `shared/divisions/navigation.css`: tratamiento acotado del panel y su integración móvil.
- `shared/divisions/verify_navigation.py`: contrato de destinos, controles y recurso único.

Fuentes modificadas:

- `media-branding/build.py` y `media-branding/template.html`.
- `shared/divisions/render.py` y `shared/divisions/verify.py`.

HTML regenerados:

- `media-branding/index.html`.
- `linkbranding/index.html`.
- `media-print/index.html`.

Este informe completa la documentación. Las evidencias, capturas desktop/móvil y
registros están en `output/playwright/navegacion-cruzada-2026-11-23/`. Las capturas
por marca terminan en `-desktop.png` y `-mobile.png`; quedan fuera de Git y del
paquete público. Los registros de compilación, recursos y protección están en
`output/navegacion-cruzada-2026-11-23/`.
