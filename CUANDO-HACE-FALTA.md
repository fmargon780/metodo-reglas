# Reglas de Claude Code que solo hacen falta a veces

> Parte de `METODO-COMUN.md`, sacada aparte el 15-nov-2026 para que cada sesión lea menos. Las
> apps no guardan copia: se baja cuando `METODO-COMUN.md` lo dice y se lee solo el apartado que
> nombra. Si algo de aquí choca con `METODO-COMUN.md`, manda `METODO-COMUN.md`.

## 1. La pasada larga (`METODO-COMUN.md` 5.1)

Solo para las apps cuya última pasada completa, en `docs/PASADA-DIARIA.md`, tardó más de 10
minutos. La frontera se mira siempre con la última medida.

- **Al empezar la sesión** (paso 5 del apartado 1), si la fecha apuntada no es la de hoy (hora de
  Madrid), se hace la pasada completa sobre `main` recién bajado, antes de tocar el código de la
  fila, y se apunta el resultado en `docs/PASADA-DIARIA.md`.
- Si una prueba falla, se repite a solas. Si a solas pasa, es fallo de carga: se apunta en una
  línea y no cuenta. Si también falla, se añade la fila «Arreglar la prueba <nombre>, que falla en
  la pasada diaria del <fecha>» encima de todas las PENDIENTE y DEVUELTA, la fila que se había
  marcado vuelve a PENDIENTE y esta sesión trabaja la del arreglo.
- Durante la fila, solo las pruebas de lo tocado y las fijas que obligue `CLAUDE.md`; no se repite
  la pasada completa antes de subir. Si la sesión hace varias filas seguidas, una sola pasada, al
  principio. Si en el día no se lanza ninguna fila, no hay pasada.
- El resultado («Pasada completa del día: <minutos> min, <sin fallos | con N fallos, arreglo
  apuntado el primero>.») va en la nota de la fila y en `docs/PASADA-DIARIA.md`, no en el mensaje
  final, que es solo la frase de `METODO-COMUN.md` 6.8; las demás filas no la mencionan.

## 2. Reducir la cola y el resumen (`METODO-COMUN.md` 5.5)

Solo cuando, al escribir en `docs/COLA.md` (al marcar una fila HECHA, o desde una conversación
del chat), la cola pasa de 40 KB, o, al marcar una fila HECHA, `docs/CONTEXTO-CORTO.md` pasa de
160 líneas o de 20 KB. Se hace en esa misma subida.

- **Cola:** las filas HECHA, SUSTITUIDA y DESCARTADA salen de la cola y pasan, con su texto
  completo, al final de `docs/HISTORIA.md`. Se quedan en la cola, porque el Centro de mando o el
  buzón de soporte las necesitan:
  - las HECHA de hoy y de ayer (el Centro de mando saca de ahí «Hechas hoy»);
  - la fila de número más alto, si está cerrada (las filas nuevas cogen el número siguiente al más
    alto de la cola; sin ella se repetirían números);
  - los avisos de usuarios del botón de soporte, todos, y en las apps sin avisos, la fila que puso
    ese botón (con ellas se sabe si el botón funciona);
  - las últimas HECHA con hora, unas pocas (con ellas calcula el Centro de mando cuándo acabará la
    cola).
- Las notas largas de las filas que siguen vivas se dejan en una línea; el detalle va a la
  instrucción de la fila. La forma de la cola (`METODO-COMUN.md` 7) no cambia.
- **Resumen:** lo que ya es pasado va a `docs/HISTORIA.md`; el detalle largo que sigue vigente va a
  `docs/CONTEXTO.md`, y en el resumen queda una línea que remite a él.
- No se pierde ningún texto. Si `docs/HISTORIA.md` o `docs/CONTEXTO.md` no existen, se crean.
- Antes de subir, el programa de `METODO-COMUN.md` 5.6, y después, que no falta ninguna fila viva.
- Si no se puede bajar del límite sin quitar algo vigente, se dice en la nota de la fila.

## 3. Tercer arreglo del mismo fallo (`METODO-COMUN.md` 3.D)

Un arreglo es una fila DEVUELTA que se retoma, o una fila que arregla lo que hizo otra (su texto
dice «de la fila N»). Antes de empezar uno, la sesión mira en la cola, en las notas y en
`docs/HISTORIA.md` cuántos arreglos del mismo fallo ha habido ya, aunque sean de otras filas o de
otras sesiones.

Si este sería el tercero, no se programa. La fila pasa a BLOQUEADA con «ATASCO PARA CLAUDE: tercer
arreglo del mismo fallo (filas …); hay que mirarlo de otra forma», y en la nota, en pocas líneas,
qué intentó cada arreglo y qué se sabe del fallo. Sigue como en `METODO-COMUN.md` 3.B.
