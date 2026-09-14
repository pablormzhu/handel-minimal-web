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
import hisopoRayon from "@/assets/prod/real/hisopo-rayon.jpg";
import abatelengua from "@/assets/prod/real/abatelengua.jpg";
import vinagreBlanco from "@/assets/prod/real/vinagre-blanco.jpg";
import cubrebocasN95 from "@/assets/prod/real/cubrebocas-n95.jpg";
import puntasAmarillas from "@/assets/prod/real/puntas-amarillas.jpg";
import amiesTransporte from "@/assets/prod/real/amies-transporte.jpg";
import recolector24h from "@/assets/prod/real/recolector-24h.jpg";
import tuboTaponRojo from "@/assets/prod/real/tubo-tapon-rojo.jpg";
import torundasAlgodon from "@/assets/prod/real/torundas-algodon.jpg";
import agarSalmonellaShigella from "@/assets/prod/real/agar-salmonella-shigella.jpg";
import vasoRecolector120 from "@/assets/prod/real/vaso-recolector-120.jpg";
import agarSangre from "@/assets/prod/real/agar-sangre.jpg";
import espejoVaginal from "@/assets/prod/real/espejo-vaginal.jpg";
import agarGelosaChocolate from "@/assets/prod/real/agar-gelosa-chocolate.webp";
import pipetaTransferencia from "@/assets/prod/real/pipeta-transferencia.jpg";
import vasoTapaRoja100 from "@/assets/prod/real/vaso-tapa-roja-100.jpg";
import triclofen from "@/assets/prod/real/triclofen.jpg";
import electroGel from "@/assets/prod/real/electro-gel.jpg";
import germisinSolucion500 from "@/assets/prod/real/germisin-solucion-500.jpg";
import accutrackHiv from "@/assets/prod/real/accutrack-hiv.jpg";
import banditasPanda from "@/assets/prod/real/banditas-panda.jpg";

// Fotos reales por clave de producto (tienen prioridad sobre las genéricas).
const SKU_IMAGES: Record<string, string> = {
  "030010000000035": lubriG, // LUBRI-G 135 g (Altamirano)
  "030010000000025": germisinEspuma, // GERMISIN ESPUMA 120 ml
  "0300100000008.1": antibenzil, // ANTIBENZIL JABÓN QUIRÚRGICO 500 ml
  "00104000NLD6052": hisopoRayon, // HISOPO DE RAYON OROFARINGEO (PATCHES)
  "00104000NLD6051": hisopoRayon, // HISOPO DE NYLON NASOFARINGEO (PATCHES)
  "009010000001181": abatelengua, // ABATELENGUA DE MADERA ESTERIL
  "200010000000122": abatelengua, // ABATELENGUA DE MADERA ESTERIL
  "039010000000001": vinagreBlanco, // VINAGRE BLANCO CJ 1000 ML
  "342010000000370": cubrebocasN95, // CUBRE BOCAS KN95
  "16501001-200009": puntasAmarillas, // PUNTA 5 A 200 uL AMARILLA (Delta Lab)
  "75801000T-200-Y": puntasAmarillas, // PUNTAS AMARILLAS 1-200 uL (Axygen)
  "1110100001008-C": amiesTransporte, // MEDIO DE TRANSPORTE STUART AMIES (Copan)
  "1750100000PW106": recolector24h, // BOTE RECOLECCION 24 HORAS (Plastic World)
  "35701000PW106-1": recolector24h, // BOTE RECOLECCION 24 HORAS (GH)
  "33301000GD050CA": tuboTaponRojo, // TUBO TAPON ROJO ACTIVADOR COAGULACION (Golden Vac)
  "3740100000AL335": torundasAlgodon, // TORUNDAS ALGODON 500 G (Lazzer Care)
  "456010000406389": torundasAlgodon, // TORUNDAS ALGODON 500 G (Quirmex)
  "005010001024-PP": agarSalmonellaShigella, // AGAR SALMONELLA Y SHIGELLA (Dibico)
  "265010000007164": agarSalmonellaShigella, // AGAR SALMONELLA Y SHIGELLA (MCD Lab)
  "3570100000PW120": vasoRecolector120, // VASO RECOLECTOR 120 ML TAPA AZUL (GH)
  "005010001212-PP": agarSangre, // AGAR SANGRE (Dibico)
  "265010000007504": agarSangre, // AGAR SANGRE (MCD Lab)
  "167018800004001": espejoVaginal, // ESPEJO VAGINAL CHICO (Harmony)
  "167018800004002": espejoVaginal, // ESPEJO VAGINAL MEDIANO (Harmony)
  "005010001214-PP": agarGelosaChocolate, // AGAR GELOSA CHOCOLATE (Dibico)
  "265010000007284": agarGelosaChocolate, // AGAR GELOSA CHOCOLATE (MCD Lab)
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
