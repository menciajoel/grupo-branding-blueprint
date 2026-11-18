# Motion aprobado de Inicio

Fuente única de los cuatro recursos trasladados desde `experimentos/transicion-cinematografica/`, aprobados formalmente el 18-11-2026. El traslado conserva sus bytes:

- `cinematic.css` / `cinematic.js`: Soluciones suspendida, escala desktop .88 / móvil .94, Proyectos por delante, scroll reversible y sin pin adicional ni cambio de alturas.
- `closing.css` / `closing.js`: titular completo → isotipo → mensaje → CTA (150 ms), con firma breve. Conserva accesibilidad, movimiento reducido y contenido visible sin JavaScript.

El template y generador de `experimentos/inicio-v01/` incorporan el mismo contenedor y clase usados en la referencia aprobada. No se altera `styles.css` ni `motion.js` del Inicio previo.

`approval.json` conserva los hashes de los recursos, de las fuentes protegidas y del cuerpo HTML aprobado. `verify.py` contrasta la integración con esas huellas; únicamente normaliza los destinos implementados para comparar fuente y HTML publicado. No debe actualizarse el manifiesto para justificar cambios sin aprobación creativa.

```sh
python3 -B experimentos/inicio-v01/build.py
python3 -B experimentos/inicio-v01/verify.py
python3 -B shared/inicio/verify.py
python3 -B tools/build_site.py
```

Los archivos se despliegan por dependencia desde el Inicio. Los informes, manifiestos de fuente, generadores y capturas no se incluyen en el paquete estático.

El experimento se puede reconstruir localmente con `python3 -B experimentos/transicion-cinematografica/build.py`; sus salidas son copias regenerables, no otra fuente de las animaciones. Sus informes históricos se conservan en esa carpeta. La consolidación no incorpora estas transiciones en Media Branding, Linkbranding ni Media Print.
