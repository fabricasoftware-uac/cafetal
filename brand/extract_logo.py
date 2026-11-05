"""Extrae el logo vectorial del Manual de Marca CAFETAL (p. 4, versión dorada) a SVGs animables."""
import sys, os
import pymupdf as fitz

PDF, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)
K = 10  # escala: 1 pt -> 10 unidades, para redondear a enteros sin perder precisión

doc = fitz.open(PDF)
page = doc[3]
TILE = fitz.Rect(298, 117, 595, 359)
dr = [x for x in page.get_drawings() if x["rect"] in TILE and x["rect"] != TILE]
# glifo rosado #CF1A5A dentro de la "o" de Tostado: residuo del archivo fuente, se descarta
dr = [x for x in dr if not (x["fill"] and x["fill"][0] > 0.8 and x["fill"][1] < 0.2)]

def pathd(x, ox, oy):
    f = lambda p: f"{round((p.x-ox)*K,1):g} {round((p.y-oy)*K,1):g}"
    out, cur = [], None
    for it in x["items"]:
        op = it[0]
        if op == "re":
            r = it[1]
            out.append(f"M{f(r.tl)}H{round((r.x1-ox)*K,1):g}V{round((r.y1-oy)*K,1):g}H{round((r.x0-ox)*K,1):g}Z"); cur = None; continue
        if op == "qu":
            q = it[1]; out.append(f"M{f(q.ul)}L{f(q.ur)}L{f(q.lr)}L{f(q.ll)}Z"); cur = None; continue
        p0 = it[1]
        if cur is None or abs(p0.x-cur.x) > 1e-3 or abs(p0.y-cur.y) > 1e-3:
            if out and x.get("closePath"): out.append("Z")
            out.append(f"M{f(p0)}")
        if op == "l": out.append(f"L{f(it[2])}"); cur = it[2]
        elif op == "c": out.append(f"C{f(it[2])} {f(it[3])} {f(it[4])}"); cur = it[4]
    if x.get("closePath"): out.append("Z")
    return "".join(out)

def band(x):
    y = x["rect"].y0
    if y < 241: return "casa"
    if y < 280: return "marca"
    if y < 304: return "slogan"
    return "subslogan"

groups = {"casa": [], "marca": [], "slogan": [], "subslogan": []}
for x in dr: groups[band(x)].append(x)
for g in groups.values(): g.sort(key=lambda x: x["rect"].x0)

LETTERS = {"marca": list("CaFETAL")}
# Agrupa glifos compuestos (é = e + tilde, i = palo + punto) en letras por solape horizontal
def letters(items):
    out = []
    for x in items:
        contenido = out and x["rect"].x1 <= out[-1]["x1"] + 0.5
        if out and x["rect"].x0 < out[-1]["x1"] - 0.6 and (x["rect"].width < 4 or out[-1]["w"] < 4 or contenido):
            out[-1]["items"].append(x); out[-1]["x1"] = max(out[-1]["x1"], x["rect"].x1); out[-1]["w"] = out[-1]["x1"]-out[-1]["x0"]
        else:
            out.append({"items": [x], "x0": x["rect"].x0, "x1": x["rect"].x1, "w": x["rect"].width})
    return out

def bbox(items):
    r = fitz.Rect(items[0]["rect"])
    for x in items[1:]: r |= x["rect"]
    return r

PAD = 2
def build(parts, name, fill, animable=False, square=False):
    items = [x for p in parts for x in groups[p]]
    b = bbox(items)
    ox, oy = b.x0 - PAD, b.y0 - PAD
    w, h = (b.width + 2*PAD)*K, (b.height + 2*PAD)*K
    if square:
        s = max(w, h); ox -= (s-w)/2/K; oy -= (s-h)/2/K; w = h = s
    body = []
    for p in parts:
        if animable:
            body.append(f'  <g id="cafetal-{p}" class="cafetal-{p}">')
            if p == "casa":
                body.append(f'    <path class="casa-trazo" d="{pathd(groups[p][0], ox, oy)}"/>')
                for x in groups[p][1:]: body.append(f'    <path class="casa-detalle" d="{pathd(x, ox, oy)}"/>')
            else:
                labels = LETTERS.get(p)
                for i, L in enumerate(letters(groups[p])):
                    d = "".join(pathd(x, ox, oy) for x in L["items"])
                    lab = f' data-letra="{labels[i]}"' if labels else ""
                    body.append(f'    <path class="letra" style="--i:{i}"{lab} d="{d}"/>')
            body.append("  </g>")
        else:
            d = "".join(pathd(x, ox, oy) for x in groups[p])
            body.append(f'  <path id="{p}" d="{d}"/>')
    title = "CaFETAL — Café Tostado y Molido"
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.0f} {h:.0f}" fill="{fill}" role="img" aria-label="{title}">\n'
           f'  <title>{title}</title>\n' + "\n".join(body) + "\n</svg>\n")
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as fh: fh.write(svg)
    print(name, f"{w:.0f}x{h:.0f}", len(svg)//1024, "KB")

COLORS = {"dorado": "#E1B75D", "negro": "#010101", "blanco": "#FFFFFF", "gris": "#9A9FA3"}
LOCKUPS = {"logo-slogan": ["casa", "marca", "slogan", "subslogan"], "logo": ["casa", "marca"], "imagotipo": ["casa"]}
for lk, parts in LOCKUPS.items():
    for cn, c in COLORS.items(): build(parts, f"{lk}-{cn}.svg", c)
    build(parts, f"{lk}-animable.svg", "currentColor", animable=True)
build(["casa"], "favicon.svg", "#E1B75D", square=True)

# --- Módulo TS para la web: mismos trazos, coordenadas enteras, origen común ---
import json, re
def entero(d): return re.sub(r"-?\d+\.\d+", lambda m: str(round(float(m.group()))), d)
todos = [x for g in groups.values() for x in g]
B = bbox(todos); ox, oy = B.x0 - PAD, B.y0 - PAD
def caja(parts):
    b = bbox([x for p in parts for x in groups[p]])
    return [round((b.x0-PAD-ox)*K), round((b.y0-PAD-oy)*K), round((b.width+2*PAD)*K), round((b.height+2*PAD)*K)]
def letras_d(p): return [entero("".join(pathd(x, ox, oy) for x in L["items"])) for L in letters(groups[p])]
ts = ["// Generado por brand/extract_logo.py desde el Manual de Marca (p. 4). No editar a mano.",
      f"export const CASA = {json.dumps(entero(pathd(groups['casa'][0], ox, oy)))}",
      f"export const CASA_DETALLE = {json.dumps([entero(pathd(x, ox, oy)) for x in groups['casa'][1:]])}",
      f"export const MARCA = {json.dumps(letras_d('marca'))}",
      f"export const SLOGAN = {json.dumps(letras_d('slogan'))}",
      f"export const SUBSLOGAN = {json.dumps(letras_d('subslogan'))}",
      "/** viewBox [x, y, ancho, alto] de cada lockup en el sistema común */",
      f"export const CAJAS = {{ imagotipo: {caja(['casa'])}, logo: {caja(['casa','marca'])}, completo: {caja(list(groups))} }} as const"]
TS = sys.argv[3]
os.makedirs(os.path.dirname(TS), exist_ok=True)
with open(TS, "w", encoding="utf-8") as fh: fh.write("\n".join(ts) + "\n")
print("trazos.ts", os.path.getsize(TS)//1024, "KB")
