# metodo-reglas

Reglas comunes que sigue Claude Code en todas las apps de `fmargon780`.

- `METODO-COMUN.md` es el original. Solo se cambia aquí.
- `comprueba-cola.js` comprueba que `docs/COLA.md` de una app está escrita como manda el
  apartado 7 de ese fichero. Las apps no guardan copia: lo bajan y lo pasan antes de subir un
  cambio de la cola (apartado 5.6). Sus pruebas: `node comprueba-cola.test.js`.
- `CUANDO-HACE-FALTA.md` guarda lo que solo se necesita a veces (la pasada larga, reducir la cola,
  el tercer arreglo del mismo fallo). Las apps no
  guardan copia: lo bajan cuando `METODO-COMUN.md` lo dice.
- Cada app guarda una copia en `docs/METODO-COMUN.md` y la pone al día sola al empezar cada tarea
  (apartado 0 del fichero).
- El resto del método (cómo se diseña, cómo se habla con cada persona) vive en un repositorio
  privado aparte. Aquí no hay datos personales.
