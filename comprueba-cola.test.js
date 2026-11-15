// Pruebas de comprueba-cola.js. Desde la raíz del repositorio: node comprueba-cola.test.js
"use strict";
const { comprueba } = require("./comprueba-cola.js");
const CAB = "# Cola\n\n| Nº | Instrucción | Estado | Notas |\n|---|---|---|---|\n";
let n = 0, mal = 0;
function caso(nombre, texto, antes, esperaFallos, contiene) {
  n++;
  const r = comprueba(texto, antes);
  const ok = r.fallos.length === esperaFallos && (!contiene || r.fallos.concat(r.avisos).some(f => f.includes(contiene)));
  if (!ok) { mal++; console.error("FALLA: " + nombre + " → " + JSON.stringify(r.fallos) + " avisos " + JSON.stringify(r.avisos)); }
}
const bien = [
  "| 1 | Una idea | IDEA (15-nov-2026) | |",
  "| 2 | Paso de Ana (de la fila 1): algo | IDEA (15-nov-2026 · paso de Ana) | Venía de otra parte |",
  "| 3 | Tema: uno. Junta las ideas 1 y 2 | DECIDIDA (15-nov-2026 · tema) | |",
  "| 4 | Otra | EN TEMA 3 (15-nov-2026) | |",
  "| 5 | `docs/5-algo.md` | PENDIENTE (15-nov-2026) | no antes del 20-nov-2026 |",
  "| 6 | `docs/6-algo.md` | APLAZADA hasta 20-nov-2026 | |",
  "| 7 | `docs/7-algo.md` | ESPERA A LA IDEA 2 (15-nov-2026) | falta el paso |",
  "| 8 | `docs/8-algo.md` | EN CURSO (15-nov-2026) | |",
  "| 9 | `docs/9-algo.md` | ESPERA TU VISTAZO (15-nov-2026) | enlace |",
  "| 10 | `docs/10-algo.md` | HECHA (15-nov-2026 14:05) | Publicada |",
  "| 11 | `docs/11-algo.md` | SIN PUBLICACIÓN COMPROBADA (15-nov-2026) | Vercel 402 |",
  "| 12 | `docs/12-algo.md` | BLOQUEADA (15-nov-2026) | ATASCO PARA CLAUDE: no arranca |",
  "| 13 | `docs/13-algo.md` | DEVUELTA (15-nov-2026) | falla el botón |",
  "| 14 | Tema viejo | SUSTITUIDA (15-nov-2026): diseñado en las filas 5 a 6 | |",
  "| 15 | No | DESCARTADA (15-nov-2026): ya lo hace la app | |",
  "| 16 | En diseño | EN DISEÑO (15-nov-2026, Marcos) | |",
].join("\n") + "\n";
caso("todos los estados, bien escritos", CAB + bien, null, 0);
caso("sin barra final", CAB + "| 1 | Una idea | IDEA (15-nov-2026) | una nota\n", null, 1, "barra del final");
caso("tres casillas", CAB + "| 1 | Una idea | IDEA (15-nov-2026) |\n", null, 1, "3 casillas");
caso("una barra dentro del texto", CAB + "| 1 | Tocar | Editar | IDEA (15-nov-2026) | |\n", null, 1, "5 casillas");
caso("estado que no existe", CAB + "| 1 | Una idea | ESPERANDO A ANA (15-nov-2026) | |\n", null, 1, "no empieza por un estado");
caso("estado en minúsculas", CAB + "| 1 | Una idea | Hecha (15-nov-2026) | |\n", null, 1, "no empieza por un estado");
caso("estado vacío", CAB + "| 1 | Una idea | | nota |\n", null, 1, "está vacía");
caso("texto detrás del paréntesis", CAB + "| 1 | Una idea | IDEA (15-nov-2026) · paso de Ana | |\n", null, 1, "Notas");
caso("en tema sin número", CAB + "| 1 | Una idea | EN TEMA (15-nov-2026) | |\n", null, 1, "número del tema");
caso("número repetido", CAB + "| 1 | Una | IDEA (15-nov-2026) | |\n| 1 | Otra | IDEA (15-nov-2026) | |\n", null, 1, "dos filas");
caso("cabecera de tres columnas", "| Nº | Instrucción | Estado |\n|---|---|---|\n", null, 2, "cabecera");
caso("estado y notas cambiados de sitio", "| Nº | Instrucción | Notas | Estado |\n|---|---|---|---|\n| 1 | Una | nota | HECHA (15-nov-2026) |\n", null, 2, "cabecera");
caso("apartados", "## 1. Una idea — IDEA (15-nov-2026)\n\ntexto\n", null, 2, "apartado");
caso("sin cabecera", "| 1 | Una idea | IDEA (15-nov-2026) | |\n", null, 1, "Falta la cabecera");
caso("un título cualquiera no es una fila", CAB + "| 1 | Una | IDEA (15-nov-2026) | |\n\n## Notas sueltas\n\ntexto\n", null, 0);
caso("falta una fila viva", CAB + "| 2 | Otra | IDEA (15-nov-2026) | |\n", CAB + "| 1 | Una | PENDIENTE (15-nov-2026) | |\n| 2 | Otra | IDEA (15-nov-2026) | |\n", 1, "Falta la fila 1");
caso("una fila cerrada puede salir", CAB + "| 2 | Otra | IDEA (15-nov-2026) | |\n", CAB + "| 1 | Una | HECHA (14-nov-2026 10:00) | |\n| 2 | Otra | IDEA (15-nov-2026) | |\n", 0);
const vieja = "| 1 | Una idea | IDEA (15-nov-2026) · paso de Ana | |\n";
caso("lo que ya estaba mal en main es un aviso", CAB + vieja + "| 2 | Otra | IDEA (15-nov-2026) | |\n", CAB + vieja, 0, "Notas");
caso("lo que se escribe mal ahora es un fallo", CAB + vieja + "| 2 | Otra | IDEA |\n", CAB + vieja, 1, "3 casillas");
if (mal) { console.error(mal + " de " + n + " pruebas fallan."); process.exit(1); }
console.log(n + " pruebas, todas bien.");
