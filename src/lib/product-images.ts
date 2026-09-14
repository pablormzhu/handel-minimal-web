import medios from "@/assets/prod/medios.jpg";
import reactivos from "@/assets/prod/reactivos.jpg";
import tubos from "@/assets/prod/tubos.jpg";
import guantes from "@/assets/prod/guantes.jpg";
import curacion from "@/assets/prod/curacion.jpg";
import jeringas from "@/assets/prod/jeringas.jpg";
import equipos from "@/assets/prod/equipos.jpg";
import microscopia from "@/assets/prod/microscopia.jpg";
import pruebas from "@/assets/prod/pruebas.jpg";
import consumibles from "@/assets/prod/consumibles.jpg";
import soluciones from "@/assets/prod/soluciones.jpg";
import general from "@/assets/prod/general.jpg";
import lubriG from "@/assets/prod/real/lubri-g.jpg";
import germisinEspuma from "@/assets/prod/real/germisin-espuma.jpg";
import antibenzil from "@/assets/prod/real/antibenzil.jpg";

// Fotos reales por clave de producto (tienen prioridad sobre las genéricas).
const SKU_IMAGES: Record<string, string> = {
  "030010000000035": lubriG, // LUBRI-G 135 g (Altamirano)
  "030010000000025": germisinEspuma, // GERMISIN ESPUMA 120 ml
  "0300100000008.1": antibenzil, // ANTIBENZIL JABÓN QUIRÚRGICO 500 ml
};


const RULES: Array<[RegExp, string]> = [
  [/\b(agar|caldo|medio de cultivo|gelosa|peptonad|placa)\b/i, medios],
  [/\b(guante|cubrebocas|bata|gorro|botas|careta|mascarilla|respirador)\b/i, guantes],
  [/\b(venda|gasa|apósito|aposito|algod[oó]n|micropore|tela adhesiva|curaci[oó]n|abatelengua|torunda)\b/i, curacion],
  [/\b(jeringa|aguja|lanceta|cat[eé]ter|punz[oó]n|vacutainer|hipod[eé]rmica)\b/i, jeringas],
  [/\b(tubo|microtubo|capilar|vial|criovial|frasco de recolecci|contenedor de orina|copro)\b/i, tubos],
  [/\b(microscopio|portaobjeto|cubreobjeto|laminilla|aceite de inmersi[oó]n|asa bacteriol)\b/i, microscopia],
  [/\b(tira|prueba r[aá]pida|cassette|test|panel|kit de detecci|inmunocrom)\b/i, pruebas],
  [/\b(analizador|equipo|centr[ií]fuga|incubadora|ba[ñn]o|autoclave|espectro|lector|impresora|monitor|electrocardi|balanza|agitador|micropipeta autom)\b/i, equipos],
  [/\b(punta|pipeta|micropipeta|celda|gradilla|asa|cubeta|placa de 96|puntilla)\b/i, consumibles],
  [/\b(alcohol|cloro|desinfect|antis[eé]ptic|jab[oó]n|sanitizante|benzal|yodo|glutaralde|agua destilada|agua inyectable|agua bidestilada|soluci[oó]n salina)\b/i, soluciones],
  [/\b(reactivo|colorante|control|calibrador|est[aá]ndar|buffer|diluyente|suero|antisuero|glucosa|colesterol|triglic[eé]rid|creatinina|urea|[aá]cido|hemoglobina|tinci[oó]n|wright|giemsa|gram)\b/i, reactivos],
];

export function productImage(input: { name: string; description?: string; sku?: string }): string {
  const real = input.sku ? SKU_IMAGES[input.sku] : undefined;
  if (real) return real;
  const text = `${input.name} ${input.description ?? ""}`;
  for (const [re, img] of RULES) {
    if (re.test(text)) return img;
  }
  return general;
}
