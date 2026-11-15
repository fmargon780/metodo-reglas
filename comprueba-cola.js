#!/usr/bin/env node
// Comprueba que docs/COLA.md está escrita como manda METODO-COMUN.md, apartado 7.
// Uso, desde la raíz del repositorio de la app:
//     node comprueba-cola.js [docs/COLA.md] [cola de antes]
// Si no se le da la cola de antes, la saca de origin/main con git (si puede). Con ella mira que no
// se haya perdido ninguna fila viva, y solo da por fallo lo que es de esta subida: una fila mal
// escrita que ya estaba igual en main se enseña como aviso y no impide subir.
// Sale con 0 si todo está bien y con 1 si hay algo que arreglar.
// No necesita instalar nada. Si apartado 7 gana o pierde un estado, se cambia ESTADOS.
"use strict";
const fs = require("fs");

const ESTADOS = ["IDEA", "DECIDIDA", "EN TEMA", "EN DISEÑO", "PENDIENTE", "APLAZADA", "ESPERA A LA IDEA",
  "EN CURSO", "ESPERA TU VISTAZO", "HECHA", "SIN PUBLICACIÓN COMPROBADA", "BLOQUEADA", "DEVUELTA",
  "SUSTITUIDA", "DESCARTADA"];
const CERRADOS = ["HECHA", "SUSTITUIDA", "DESCARTADA"];
const CABECERA = ["nº", "instrucción", "estado", "notas"];

const sinMarcas = s => String(s || "").replace(/`/g, "").replace(/\*\*/g, "").trim();
// El estado con el que empieza una casilla, o "" si no es ninguno de la lista
function estadoDe(casilla) {
  const t = sinMarcas(casilla);
  // primero los más largos, para que «ESPERA A LA IDEA» no se quede en otro más corto
  const e = ESTADOS.slice().sort((a, b) => b.length - a.length).find(k => t.startsWith(k));
  if (!e) return "";
  const sigue = t.slice(e.length);
  return sigue === "" || /^[\s(:]/.test(sigue) ? e : "";
}
// Lo que va detrás del estado: nada, «N», «hasta <fecha>», un paréntesis y, al final, «: motivo»
const RE_RESTO = /^(?:\s+\d+|\s+hasta(?:\s+el)?\s+[^():]+?)?(?:\s*\([^()]*\))?(?::\s+\S.*)?$/;

function filasDe(texto) {
  const filas = [], fallos = [];
  let cabeceras = 0, apartados = 0, lineaDeAhora = "";
  // cada fallo recuerda la línea que lo causa
  const push = fallos.push.bind(fallos);
  fallos.push = t => push({ texto: t, linea: lineaDeAhora });
  const lineas = String(texto || "").split("\n");
  lineas.forEach((l, i) => {
    lineaDeAhora = l;
    const donde = "línea " + (i + 1);
    if (/^\|\s*N[º°o]?\s*\|/i.test(l) && /Estado/i.test(l)) {
      cabeceras++;
      const c = l.trim().replace(/^\||\|$/g, "").split("|").map(x => x.trim().toLowerCase().replace(/^n[°o]?$/, "nº"));
      if (c.join("|") !== CABECERA.join("|")) fallos.push("La cabecera de la tabla (" + donde + ") tiene que ser «| Nº | Instrucción | Estado | Notas |».");
      if (!/^\|(\s*:?-+:?\s*\|){4}\s*$/.test(lineas[i + 1] || "")) fallos.push("Debajo de la cabecera (" + donde + ") falta la línea «|---|---|---|---|».");
      return;
    }
    if (/^## \d+\. /.test(l)) { apartados++; fallos.push("«" + l.slice(0, 60) + "» (" + donde + ") es un apartado: la cola es una sola tabla, una fila por línea."); return; }
    const m = l.match(/^\|\s*(\d+)\s*\|/);
    if (!m) return;
    const n = m[1], fila = "Fila " + n + " (" + donde + ")";
    if (!/\|\s*$/.test(l)) { fallos.push(fila + ": le falta la barra del final."); filas.push({ n, estado: "" }); return; }
    const casillas = l.trim().replace(/^\||\|$/g, "").split("|");
    if (casillas.length !== 4) {
      fallos.push(fila + ": tiene " + casillas.length + " casillas y tienen que ser cuatro (Nº, Instrucción, Estado y Notas)." +
        (casillas.length > 4 ? " Mira si hay una barra «|» dentro del texto." : ""));
      filas.push({ n, estado: estadoDe(casillas[casillas.length > 4 ? casillas.length - 2 : casillas.length - 1]) });
      return;
    }
    if (!sinMarcas(casillas[1])) fallos.push(fila + ": la casilla «Instrucción» está vacía.");
    const txt = sinMarcas(casillas[2]), estado = estadoDe(txt);
    if (!txt) fallos.push(fila + ": la casilla «Estado» está vacía.");
    else if (!estado) fallos.push(fila + ": «" + txt.slice(0, 50) + "» no empieza por un estado de METODO-COMUN.md, apartado 7 (en mayúsculas).");
    else if (!RE_RESTO.test(txt.slice(estado.length))) fallos.push(fila + ": detrás de «" + estado + "» solo va su fecha entre paréntesis (lo que haya que añadir, dentro, tras « · ») y, si acaso, «: motivo corto». Lo demás va en «Notas».");
    else if (estado === "EN TEMA" && !/^EN TEMA\s+\d+/.test(txt)) fallos.push(fila + ": «EN TEMA» lleva detrás el número del tema.");
    else if (estado === "ESPERA A LA IDEA" && !/^ESPERA A LA IDEA\s+\d+/.test(txt)) fallos.push(fila + ": «ESPERA A LA IDEA» lleva detrás el número de la fila.");
    filas.push({ n, estado });
  });
  lineaDeAhora = "";
  if (cabeceras === 0 && (filas.length || apartados)) fallos.push("Falta la cabecera de la tabla: «| Nº | Instrucción | Estado | Notas |».");
  if (cabeceras > 1) fallos.push("Hay " + cabeceras + " tablas con cabecera de cola: tiene que haber una sola.");
  const vistos = {};
  filas.forEach(f => { if (vistos[f.n]) fallos.push("El número " + f.n + " está en dos filas."); vistos[f.n] = true; });
  return { filas, fallos };
}

// Filas vivas que estaban antes y ya no están (las cerradas pueden haber pasado a docs/HISTORIA.md)
function perdidas(antes, ahora) {
  const quedan = new Set(ahora.map(f => f.n));
  return antes.filter(f => !quedan.has(f.n) && !CERRADOS.includes(f.estado)).map(f => f.n);
}

function comprueba(texto, textoAntes) {
  const r = filasDe(texto), filas = r.filas, fallos = [], avisos = [];
  const deAntes = new Set(textoAntes != null ? String(textoAntes).split("\n") : []);
  r.fallos.forEach(f => (f.linea && deAntes.has(f.linea) ? avisos : fallos).push(f.texto));
  if (textoAntes != null) {
    const p = perdidas(filasDe(textoAntes).filas, filas);
    if (p.length) fallos.push("Falta" + (p.length > 1 ? "n las filas " : " la fila ") + p.join(", ") + ", que estaba" + (p.length > 1 ? "n" : "") + " en la cola y no estaba" + (p.length > 1 ? "n" : "") + " cerrada" + (p.length > 1 ? "s" : "") + ". Recupérala" + (p.length > 1 ? "s" : "") + " antes de subir.");
  }
  return { filas, fallos, avisos };
}

module.exports = { comprueba, filasDe, ESTADOS };

if (require.main === module) {
  const ruta = process.argv[2] || "docs/COLA.md";
  let texto;
  try { texto = fs.readFileSync(ruta, "utf8"); } catch (e) { console.error("No encuentro " + ruta + "."); process.exit(1); }
  let antes = null;
  if (process.argv[3]) {
    try { antes = fs.readFileSync(process.argv[3], "utf8"); } catch (e) { console.error("No encuentro " + process.argv[3] + "."); process.exit(1); }
  } else {
    try { antes = require("child_process").execFileSync("git", ["show", "origin/main:./" + ruta], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 20 * 1024 * 1024 }); } catch (e) { antes = null; }
  }
  const r = comprueba(texto, antes);
  if (r.avisos.length) {
    console.log("Ya estaba así en main (no es de esta subida; arréglalo solo si la fila es la tuya):");
    r.avisos.forEach(f => console.log("- " + f));
  }
  if (r.fallos.length) {
    console.error("La cola (" + ruta + ") tiene " + r.fallos.length + " cosa" + (r.fallos.length > 1 ? "s" : "") + " que arreglar antes de subir:");
    r.fallos.forEach(f => console.error("- " + f));
    process.exit(1);
  }
  console.log("Cola bien escrita: " + r.filas.length + " fila" + (r.filas.length === 1 ? "" : "s") + (antes == null ? " (sin comparar con la de antes)" : ", y no falta ninguna de las que había sin cerrar") + ".");
}
