/** Editorial display only: catalog records, SKUs, URLs and photos stay intact. */
export type DisplayField = { label: string; value: string };
type ProductInput = {
  sku?: string;
  name: string;
  brand: string;
  description: string;
  features: string[];
  presentations?: string[];
};
export type ProductDisplayInfo = {
  title: string;
  detail: string;
  description: string;
  specifications: string[];
  type: string;
  presentation: string;
  fields: DisplayField[];
};

// Orthography only. Commercial identifiers and source records are preserved.
const ORTHOGRAPHY: ReadonlyArray<readonly [string, string]> = [
  ["albumina", "albúmina"],
  ["albuminas", "albúminas"],
  ["anaerobico", "anaeróbico"],
  ["anaerobicos", "anaeróbicos"],
  ["aposito", "apósito"],
  ["apositos", "apósitos"],
  ["azucar", "azúcar"],
  ["bacteriologia", "bacteriología"],
  ["bidon", "bidón"],
  ["bifasico", "bifásico"],
  ["bifasica", "bifásica"],
  ["borico", "bórico"],
  ["centrifuga", "centrífuga"],
  ["centrifugas", "centrífugas"],
  ["coagulo", "coágulo"],
  ["coagulos", "coágulos"],
  ["cojin", "cojín"],
  ["corazon", "corazón"],
  ["deteccion", "detección"],
  ["dimero", "dímero"],
  ["dimeros", "dímeros"],
  ["economica", "económica"],
  ["economico", "económico"],
  ["escobillon", "escobillón"],
  ["facil", "fácil"],
  ["formula", "fórmula"],
  ["frio", "frío"],
  ["graduacion", "graduación"],
  ["hidroxido", "hidróxido"],
  ["jabon", "jabón"],
  ["limon", "limón"],
  ["liquidos", "líquidos"],
  ["liquidas", "líquidas"],
  ["manipulacion", "manipulación"],
  ["maxima", "máxima"],
  ["maximo", "máximo"],
  ["medula", "médula"],
  ["metodo", "método"],
  ["micobiotico", "micobiótico"],
  ["modificacion", "modificación"],
  ["patologicos", "patológicos"],
  ["patologico", "patológico"],
  ["policroma", "polícroma"],
  ["presion", "presión"],
  ["rapida", "rápida"],
  ["rapidas", "rápidas"],
  ["recoleccion", "recolección"],
  ["sanguineos", "sanguíneos"],
  ["solido", "sólido"],
  ["solidos", "sólidos"],
  ["tripticaseina", "tripticaseína"],
  ["sudan", "Sudán"],
  ["esteriles", "estériles"],
  ["elasticos", "elásticos"],
  ["quimicos", "químicos"],
  ["plasticos", "plásticos"],
  ["diagnosticos", "diagnósticos"],
  ["clinicos", "clínicos"],
  ["bacteriologico", "bacteriológico"],
  ["bacteriologicos", "bacteriológicos"],
  ["bacilios", "bacilos"],
  ["blolsa", "bolsa"],
  ["fluorecencia", "fluorescencia"],
  ["minimpunta", "minipunta"],
  ["transparante", "transparente"],
  ["hemetico", "hermético"],
  ["hemeticos", "herméticos"],
  ["triglyceridos", "triglicéridos"],
  ["universa", "universal"],
  ["apoyeta", "ampolleta"],
  ["lowestein", "Lowenstein"],
  ["stenheimer", "Sternheimer"],
  ["stuar", "Stuart"],
  ["ependor", "Eppendorf"],
  ["wellch", "Welch"],
  ["scientiic", "Scientific"],
  ["scientifi", "Scientific"],
  ["sigmam", "Sigma"],
  ["dignostic", "Diagnostic"],
  ["diagnosti", "Diagnostic"],
  ["globr", "Globe"],
  ["ruisanchez", "Ruiz Sánchez"],
  ["hjeathrow", "Heathrow"],
  ["flockwab", "FLOQSwabs"],
  ["benzoperrol", "benzopirrol"],
];
const ORTHOGRAPHY_RULES = ORTHOGRAPHY.map(([from, to]) => ({
  pattern: new RegExp(`\\b${from}\\b`, 'gi'), replacement: to,
}));
export function correctOrthography(value: string): string {
  let text = value
    .replace(/\bstandar\s+diagnostics\b/gi, 'Standard Diagnostics')
    .replace(/\bmac\s+conkey\b/gi, 'MacConkey')
    .replace(/\bfecal\s+swab\b/gi, 'FecalSwab')
    .replace(/\bstandar\b/gi, 'estándar')
    .replace(/\baccu[ -]?check\b/gi, 'Accu-Chek')
    .replace(/\bcloraprep\b/gi, 'ChloraPrep')
    .replace(/\binstan-view\b/gi, 'Instant-View')
    .replace(/\bsangra\s+oculta\b/gi, 'sangre oculta')
    .replace(/\b[aá]cido\s+desistentes\b/gi, 'ácido resistentes')
    .replace(/\bbaarequipo\b/gi, 'BAAR; equipo')
    .replace(/\bmaraca\b/gi, 'marca')
    .replace(/\bmmcaja\b/gi, 'mm caja')
    .replace(/(\d)\s*mmcaja\b/gi, '$1 mm caja')
    .replace(/\bcoagulacion(?=\d)/gi, 'coagulación ')
    .replace(/\bp\s*\/(?=[a-záéíóú])/gi, 'para ')
    .replace(/\ba\s*c\s*s\b/gi, 'A.C.S.')
    .replace(/\bfco\.?\b/gi, 'frasco');
  for (const rule of ORTHOGRAPHY_RULES) {
    text = text.replace(rule.pattern, rule.replacement);
  }
  return text;
}
export function brandDisplayName(value: string): string {
  const aliases: Record<string, string> = {
    'HJEATHROW': 'HEATHROW',
    'ACCU CHECK': 'Accu-Chek',
    'RUIZ SANCHEZ': 'RUIZ SÁNCHEZ',
  };
  return aliases[value] ?? value;
}
export function normalizeSearch(value: string): string {
  return clean(value).normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();
}

const SPELLINGS: Array<[RegExp, string]> = [
  [/\bporta\s+objetos\b/gi, 'portaobjetos'], [/\bcubre\s+objetos\b/gi, 'cubreobjetos'],
  [/\bcubre\s+bocas\b/gi, 'cubrebocas'], [/\bvinyl\b/gi, 'vinilo'],
  [/\besteril\b/gi, 'estéril'], [/\besterilizada\b/gi, 'esterilizada'],
  [/\besterelizada\b/gi, 'esterilizada'], [/\bestrel\b/gi, 'estéril'],
  [/\btransaparente\b/gi, 'transparente'], [/\btrasnporte\b/gi, 'transporte'],
  [/\bcoabulacion\b/gi, 'coagulación'], [/\bcentifuga\b/gi, 'centrífuga'],
  [/\bsabor[aou]+d\b/gi, 'Sabouraud'], [/\borofaringeo\b/gi, 'orofaríngeo'],
  [/\bnasofaringeo\b/gi, 'nasofaríngeo'], [/\bespatula\b/gi, 'espátula'],
  [/\bantigenos\b/gi, 'antígenos'], [/\bespeculos\b/gi, 'espéculos'],
  [/\bsabana\b/gi, 'sábana'], [/\babsor[bv]ente\b/gi, 'absorbente'],
  [/\b(?:pzas?|pzs)\b/gi, 'piezas'], [/\bpbas\b/gi, 'pruebas'],
  ...['diagnostico:diagnóstico','clinico:clínico','elastica:elástica','latex:látex',
    'rayon:rayón','indice:índice','inmersion:inmersión','refraccion:refracción',
    'solucion:solución','determinacion:determinación','quimica:química','plastico:plástico',
    'biologia:biología','hematologia:hematología','microbiologia:microbiología',
    'serologia:serología','coagulacion:coagulación','centrifugacion:centrifugación',
    'identificacion:identificación','calibracion:calibración','concentracion:concentración',
    'medicion:medición','reaccion:reacción','proteccion:protección','exploracion:exploración',
    'citologico:citológico','liquido:líquido','liquida:líquida','algodon:algodón',
    'tapon:tapón','etilico:etílico','acido:ácido','acidos:ácidos','urico:úrico',
    'fosforo:fósforo','proteinas:proteínas','trigliceridos:triglicéridos',
    'isopropilico:isopropílico','formaldehido:formaldehído','glutaraldeido:glutaraldehído',
    'monobasico:monobásico','cromogenico:cromogénico','enterico:entérico',
    'pediatrico:pediátrico','pediatrica:pediátrica','division:división',
    'conico:cónico','hipodermico:hipodérmico','quirurgico:quirúrgico',
    'calibracion:calibración','bisturi:bisturí','numero:número','metodos:métodos',
    'bioquimicas:bioquímicas','tincion:tinción','celulas:células','parasitos:parásitos',
    'infusion:infusión','carbon:carbón'].map(entry => {
      const [from,to] = entry.split(':'); return [new RegExp(`\\b${from}\\b`,'gi'),to] as [RegExp,string];
    }),
];
function clean(value: string): string {
  const separated=correctOrthography(value).replace(/(\d)(?=(?:pzs|pzas?|pbas|piezas|pruebas)\b)/gi,'$1 ');
  return SPELLINGS.reduce((s,[pattern,replacement]) => s.replace(pattern,replacement), separated)
    .replace(/^\s*(?:\(\*\)|\*)\s*/, '')
    .replace(/[´’]{2}/g, '″').replace(/\s+/g,' ')
    .replace(/\(\s+/g,'(').replace(/\s+\)/g,')')
    .replace(/\s+([,.;:])/g,'$1').trim();
}
function units(value: string): string {
  return value.replace(/μ/g,'µ')
    .replace(/(\d+),(\d{1,2})(?=\s*(?:mL|µL|uL|L|mm|cm|m|g)\b)/gi,'$1.$2')
    .replace(/(\d)\s*(?:µl|ul)\b/gi,'$1 µL')
    .replace(/(\d)\s*(?:mlts?|ml)\b/gi,'$1 mL')
    .replace(/(\d)\s*(?:litros?|lts?\.?|lto\.?|l)\b/gi,'$1 L')
    .replace(/(\d)\s*(?:gramos?|grs?\.?|g)\b/gi,'$1 g')
    .replace(/(\d)\s*kg\b/gi,'$1 kg')
    .replace(/(\d)\s*mms?\b/gi,'$1 mm')
    .replace(/(\d)\s*cms?\b/gi,'$1 cm')
    .replace(/(\d)\s*mts?\b/gi,'$1 m')
    .replace(/(["″])\s*x\s*(?=\d)/gi,'$1 × ')
    .replace(/(\d)\s*(?:x|×)\s*(?=\d)/gi,'$1 × ')
    .replace(/(\d)\s*(mm|cm|m)\s*[x×]\s*(\d+(?:[.,]\d+)?)\s*\2\b/gi,'$1 × $3 $2')
    .replace(/(\d)\s+(?:a)\s+(?=\d)/gi,'$1–')
    .replace(/(\d)\s*-\s*(\d+(?:[.,]\d+)?)(?=\s*(?:mL|µL|uL|mm|cm)\b)/gi,'$1–$2')
    .replace(/(\d)\s*%/g,'$1%');
}
function technicalCase(value: string): string {
  const properNames: Record<string, string> = {"sabouraud": "Sabouraud", "lowenstein": "Lowenstein", "jensen": "Jensen", "sternheimer": "Sternheimer", "malbin": "Malbin", "ehrlich": "Ehrlich", "kovac": "Kovac", "gram": "Gram", "wright": "Wright", "ziehl": "Ziehl", "neelsen": "Neelsen", "loeffler": "Loeffler", "hucker": "Hucker", "cargille": "Cargille", "ayre": "Ayre", "stuart": "Stuart", "amies": "Amies", "cary": "Cary", "blair": "Blair", "mueller": "Mueller", "hinton": "Hinton", "simmons": "Simmons", "christensen": "Christensen", "casman": "Casman", "kligler": "Kligler", "mazzini": "Mazzini", "bengala": "Bengala", "salmonella": "Salmonella", "shigella": "Shigella", "brucella": "Brucella", "vibrio": "Vibrio", "helicobacter": "Helicobacter", "campylobacter": "Campylobacter", "candida": "Candida", "streptococcus": "Streptococcus", "eppendorf": "Eppendorf", "gilson": "Gilson", "nichiryo": "Nichiryo", "heathrow": "Heathrow", "scientific": "Scientific", "welch": "Welch", "allyn": "Allyn", "snibe": "SNIBE", "diagnostic": "Diagnostic", "diagnostics": "Diagnostics", "copan": "Copan", "hycel": "Hycel", "maesa": "Maesa", "sigma": "Sigma", "globe": "Globe", "instant": "Instant", "view": "View", "standard": "Standard", "chek": "Chek", "fecalswab": "FecalSwab", "floqswabs": "FLOQSwabs", "cloraprep": "ChloraPrep", "sudán": "Sudán", "accu": "Accu", "crm": "CRM", "mcd": "MCD", "kb": "KB", "qca": "QCA", "ruiz": "Ruiz", "sánchez": "Sánchez", "lab": "Lab", "deltalab": "Deltalab", "ambiderm": "Ambiderm", "bactident": "Bactident", "benedict": "Benedict", "brand": "Brand", "certum": "Certum", "celltac": "Celltac", "chloraprep": "ChloraPrep", "chromagar": "CHROMagar", "columbia": "Columbia", "conda": "Conda", "golden": "Golden", "hartmann": "Hartmann", "hektoen": "Hektoen", "herxheimer": "Herxheimer", "hemascreen": "Hemascreen", "hpl": "HPL", "lugol": "Lugol", "macconkey": "MacConkey", "merck": "Merck", "nihon": "Nihon", "kohden": "Kohden", "orth": "Orth", "panbio": "Panbio", "proteus": "Proteus", "revolution": "Revolution", "seriscann": "Seriscann", "thayer": "Thayer", "martin": "Martin", "vacutainer": "Vacutainer", "dextrosol": "Dextrosol", "dacron": "Dacron"};
  const properPattern = /\b(?:sabouraud|lowenstein|jensen|sternheimer|malbin|ehrlich|kovac|gram|wright|ziehl|neelsen|loeffler|hucker|cargille|ayre|stuart|amies|cary|blair|mueller|hinton|simmons|christensen|casman|kligler|mazzini|bengala|salmonella|shigella|brucella|vibrio|helicobacter|campylobacter|candida|streptococcus|eppendorf|gilson|nichiryo|heathrow|scientific|welch|allyn|snibe|diagnostic|diagnostics|copan|hycel|maesa|sigma|globe|instant|view|standard|chek|fecalswab|floqswabs|cloraprep|sudán|accu|crm|mcd|kb|qca|ruiz|sánchez|lab|deltalab|ambiderm|bactident|benedict|brand|certum|celltac|chloraprep|chromagar|columbia|conda|golden|hartmann|hektoen|herxheimer|hemascreen|hpl|lugol|macconkey|merck|nihon|kohden|orth|panbio|proteus|revolution|seriscann|thayer|martin|vacutainer|dextrosol|dacron)\b/gi;
  return value
    .replace(properPattern, name => properNames[name.toLowerCase()] ?? name)
    .replace(/\bAccu-Chek active\b/gi, 'Accu-Chek Active')
    .replace(/\b(?:edta|rpbi|pcr|vsg|hiv|hcg|bnp|acth|cea|afp|fsh|lh|prl|pct|psa|tga|tg|crp|tsh|clia|hdl|ldl|ldh|ggt|ast|alt|tgo|tgp|gpt|gop|uv|sms|pp|pet|ac[d]|cna|cdc|tcbs|xld|lia|tsi|bhi|mio|sim|mr-vp|vcmu|nih|baar|dna|rna|ivd|std|ca|oh|fic-tr)\b/gi, m => m.toUpperCase())
    .replace(/\bvitamina?\s+d\b/gi,m=>m.slice(0,-1)+'D')
    .replace(/\bhba1c\b/gi,'HbA1c').replace(/\bph\b/gi,'pH')
    .replace(/\big([agm e])\b/gi,(_,letter:string)=>'Ig'+letter.toUpperCase())
    .replace(/\bd?sdna\b/gi,'dsDNA').replace(/\bnt-probnp\b/gi,'NT-proBNP')
    .replace(/\bmaglumi\b/gi,'MAGLUMI').replace(/\bkn95\b/gi,'KN95')
    .replace(/\bmek-cal\b/gi,'MEK-CAL')
    .replace(/\b(?:t[34]|e2|k2|ns1)\b/gi,m=>m.toUpperCase())
    .replace(/\b([a-z]{1,5})-(\d[a-z0-9.-]*)\b/gi,(_,prefix:string,rest:string)=>prefix.toUpperCase()+'-'+rest.toUpperCase())
    .replace(/\b(pe\d+|pd\d+|hs-\d+[a-z]*|ve-p\d+|\d+[cg])\b/gi,m=>m.toUpperCase())
    .replace(/\b(?:SARS-COV-2|COVID)\b/gi,m=>m.toUpperCase())
    .replace(/\b(?:m[lL]|µ[lL])\b/g,m=>m.toLowerCase().startsWith('µ')?'µL':'mL')
    .replace(/(\d)\s+l\b/g,'$1 L');
}
export function sentenceCase(value: string): string {
  const text=technicalCase(units(clean(value).toLowerCase()));
  const sentences=text.replace(/([.!?]\s+)([a-záéíóúüñ])/g, (match, separator: string, letter: string, offset: number) => {
    const previous=text.slice(0,offset).match(/([a-z]+)$/i)?.[1]?.toLowerCase() ?? '';
    return ['aprox','mca','sol','eq','cat','ref','dr','dra','sr','sra'].includes(previous) ? match : separator+letter.toUpperCase();
  });
  return sentences ? sentences.charAt(0).toUpperCase()+sentences.slice(1) : '';
}
export function titleCase(value: string): string {
  return value.toLowerCase().split(' ').map(word=>word?word.charAt(0).toUpperCase()+word.slice(1):word).join(' ');
}
export function formatFeature(feature: string): DisplayField | null {
  const text=clean(feature); if(!text) return null;
  const split=text.indexOf(':');
  if(split<0) return {label:'Detalle',value:sentenceCase(text)};
  return {label:sentenceCase(text.slice(0,split)),value:sentenceCase(text.slice(split+1))};
}

// These names only reorganize existing source information; details remain below.
const TITLES: Record<string,string> = {
  '01101080100-100':'Aceite de inmersión tipo 300',
  '011010000080100':'Aceite de inmersión tipo A Cargille',
  '011010000-80100':'Aceite de inmersión tipo A Cargille',
  '033010000064287':'Aceite de inmersión tipo A Cargille',
  '011010000030310':'Agua bidestilada de calidad reactivo',
  '011010000030300':'Agua destilada de calidad reactivo',
  '011010000080200':'Alcohol-acetona para tinción de Gram',
  '011010000080300':'Alcohol-ácido de Orth al 70%',
  '011010000063300':'Azul de metileno de Loeffler',
  '011010000080550':'Diluyente para espermatozoides',
  '011010000031000':'Formaldehído USP/NF al 37–40%',
  '01101026488-500':'Fosfato de potasio monobásico anhidro A.C.S.',
  '011010000063710':'Fucsina carbólica o fenicada',
  '011010075-81552':'Glucox · solución glucosada',
  '011010000081550':'Glucox · solución glucosada',
  '011010000081551':'Solución glucosada para tolerancia a la glucosa',
  '01101820004X125':'Equipo de reactivos para tinción de Gram',
  '011010000054000':'Hidróxido de potasio · solución hasta el 10%',
  '011010000081200':'Reactivo de Ehrlich modificado',
  '011010000-63520':'Safranina para tinción de Gram',
  '011010000063540':'Sudan III · solución alcohólica',
  '011010000-63400':'Violeta de genciana o cristal · fórmula de Hucker',
  '011010000064000':'Wright · solución colorante',
  '011010000-80920':'Yodo para tinción de Gram',
  '011010000082100':'Equipo de colorantes Ziehl-Neelsen',
  '03301HY1317-100':'Buffer de fosfato para Wright · pH 6.4',
  '033010HY840-100':'Colorante de Wright',
  '0330100000537-1':'Dextrosol para tolerancia a la glucosa',
  '0330100005375-1':'Dextrosol para tolerancia a la glucosa',
  '03301003000-125':'Eosina-nigrosina para espermatozoides',
  '033010000064510':'Fertycel · kit para espermatobioscopia',
  '033010000006269':'Violeta de genciana · fórmula de Hucker',
  '0330164840-1000':'Equipo de tinción Wright con buffer',
  '033010000064840':'Equipo de tinción Wright con buffer',
  '033010000064293':'Equipo de tinción Ziehl-Neelsen en frío',
  '265010000PT7975':'Kit de pruebas bioquímicas para enterobacterias',
  '265010000PT7214':'Agar TCBS',
  '0050100067218-1':'Sensidisco de penicilina 6 G/10 µg',
  '16501001-200009':'Puntas amarillas universales con corona',
  '00601LRO122-200':'Bolsa de polietileno para RPBI · LRO-122-200',
  '1680100000PT-06':'Antígenos febriles con sueros control',
  '1680100000PT-40':'Hemocult pediátrico · medio de cultivo bifásico',
  '1680100000PT-34':'Multibac para bacterias Gram (+)',
  '1680100000PT-35':'Multibac para bacterias Gram (−)',
  '1680100000PT-37':'Suspibac A',
  '1680100000PT-39':'Suspibac O',
  '456010000406075':'Gasa de algodón esterilizada',
  '456010000406013':'Gasa de algodón seca cortada no esterilizada',
  '456017503003406':'Gasa de algodón seca cortada no estéril',
  '45601ROLLOGASAQ':'Rollo de gasa · tejido 20 × 12',
  '030010000000018':'Electrogel', '0300101ELECT250':'Electrogel',
  '0300100000024.1':'Germisin espuma',
  '030010000005006':'Gafidex · solución estéril de glutaraldehído',
  '030010000ALT008':'Antibenzil · jabón quirúrgico neutro',
  '11101000000470C':'FecalSwab · hisopo de nylon flocado',
  '11101000525CS01':'Hisopo de nylon con minipunta y punto de quiebre',
  '210010000PD1009':'Microtubos para centrífuga',
  '210010000PD1010':'Microtubos para centrífuga · tapa plana',
  '024010000805020':'Aplicadores de plástico con algodón estériles',
  '187010000031006':'Aplicadores de plástico con algodón estériles',
  '035011095430001':'Tiras indicadoras de pH que no destiñen',
  '034010000041282':'GPT/ALT-LQ',
  '034010001001046':'Bilirrubina total DPD',
  '034010001205010':'Kit de antígenos febriles con controles',
  '0450100001626.W':'Apósito transparente estéril con cojín absorbente',
  '04501001626.W-1':'Apósito transparente estéril con cojín absorbente',
  '03201000200400P':'Microtubos con tapón de presión graduados',
  '032010000200400':'Microtubos con tapón de presión sin graduar',
  '013010000000331':'Hemascreen · sangre oculta en heces con controles',
  '2830100MG100S-1':'Guantes de examen de nitrilo MG ES · chico',
  '2830100MG100M-1':'Guantes de examen de nitrilo MG ES · mediano',
  '25101000001292B':'Tubos capilares de vidrio sin heparina',
  '25701HBNP15080N':'Hisopo nasofaríngeo de nylon con punto de quiebre',
  '1940100002-7602':'iFOB Plus · prueba de sangre oculta en heces',
  '033010000000669':'Azul de cresil brillante al 1% para reticulocitos',
  '00101LAR2022012':'Banditas adhesivas redondas estériles sin látex',
  '019010004000394':'Solución salina al 0.9%',
  '4580100TC510403':'Tubo de recolección · tapón lila',
  '4580100TC321502':'Tubo de recolección · tapón oro',
  '3120110L2232-SB':'Jeringa · color negro',
  '3120105L2232-SB':'Jeringa · color negro',
  '210010SKUPE1015':'Puntas amarillas para micropipeta tipo Brand',
  '210010SKUPE1017':'Puntas azules para micropipeta tipo Brand',
  '237010000PE1011':'Puntas amarillas para micropipeta tipo Brand',
  '027010000000203':'Caja de Petri estéril con 1 división',
  '02701000000203B':'Caja de Petri estéril con 3 divisiones',
  '027010000000200':'Caja de Petri estéril sin división',
  '265010000PT7455':'Medio líquido de tioglicolato sin dextrosa ni indicador',
  '125010HS-15991A':'Caja económica azul para 100 portaobjetos',
  '02701000002582A':'Escobillón para tubo · no estéril',
'187010000216000':'Torundas de algodón',
  '4890100MEK-620I':'CLEANAC 3',
  '489010000MK-710':'CLEANAC 710',
  '489010000MK-310':'HEMOLYNAC 310',
  '4890100MEK-641I':'ISOTONAC 4',
  '489010MEK-3CLNH':'Kit Hematology Control',
  '489010MEK-5DLNH':'Kit Hematology Control',
  '001010000KZ4022':'Venda elástica autoadherible estirada',
  '001010000KZ4021':'Venda elástica autoadherible estirada',
  '0010100KZ4021-1':'Venda elástica autoadherible estirada',
  '20701130661004M':'25 OH-vitamina D (2G)',
  '207010000630003':'MAGLUMI Reaction Modules',
};
const PRESENTATIONS:Record<string,string>={
  '42501J052232B3.':'Caja con 5 piezas',
  '42501J032325C50':'Caja con 5 piezas',
  '42501J102132P10':'Caja con 5 piezas',
  '0510160456039-1':'1 pieza',
  '051010001108023':'Caja con 100 piezas',
  '051010001108024':'Caja con 100 piezas',
  '051010001108022':'Caja con 100 piezas',
  '033010000064840':'Kit con 2 frascos de 500 mL',
  '456010000406075':'100 gasas', '456010000406013':'200 gasas', '456017503003406':'200 gasas',
  '035011001810002':'50 tiras',
  '1680100000PT-06':'Equipo con 6 frascos de 5 mL y sueros control',
  '1680100000PT-40':'10 frascos',
  '207010000630003':'6 cajas con 64 tiras',
'0330164840-1000':'Kit con 2 frascos de 1000 mL',
  '4890100MEK-620I':'Pieza con 1 L',
'489010000MK-710':'Pieza con 3 L',
  '054020000009820':'Pieza', '054030000009820':'Pieza',
  '489010000MK-310':'Pieza con 250 mL',
  '4890100MEK-641I':'Pieza con 20 L',
};
const NUM='\\d+(?:[.,]\\d+)?';
const VOLUME=new RegExp(`(?:${NUM}\\s*(?:x|×|a|–|-)\\s*)?${NUM}\\s*(?:mL|µL|uL|mlts?|litros?|lts?\\.?|lto\\.?|L|gramos?|grs?\\.?|kg|g)\\b`,'gi');
const DIMENSION=new RegExp(`${NUM}\\s*(?:mm|cm|m)?\\s*(?:x|×)\\s*${NUM}(?:\\s*(?:x|×)\\s*${NUM})?(?:\\s*(?:mm|cms?|cm|m)\\b)?`,'gi');
const COUNT=new RegExp(`${NUM}\\s*(?:piezas?|pzas?|pzs|pruebas?|pbas|determinaciones?|discos?|tubos?|placas?|tiras?|strips|capilares?|frascos?|viales?)\\b`,'gi');
const PACK=new RegExp(`\\b(caja|bolsa|bolsita|paquete|frasco|bid[oó]n|vial|sobre|kit|estuche)\\s*(?:de|con|c\\s*\\/)\\s*${NUM}(?:\\s*(?:x|×)\\s*${NUM})?\\s*(?:mL|µL|uL|ml|litros?|lts?|L|g|grs?|piezas?|pzas?|pzs|pruebas?|pbas|tubos?|placas?|discos?|tiras?|capilares?)?`,'gi');
function canonicalPresentation(value:string):string {
  return sentenceCase(value.replace(/\bc\s*\//gi,'con ').replace(/\bbolsita\b/gi,'bolsa').replace(/\bcon(?=\d)/gi,'con '));
}
function sourceFor(product:ProductInput):string {
  let source=product.description || product.name;
  if (/snibe/i.test(product.brand)) source=source.replace(/\b([123])\s*(?:g\b|(?:da|ra)?\.?\s*generaci[oó]n\b)/gi,(_,n:string)=>`${n}G`);
  return source;
}
function physicalAmounts(source:string, product:ProductInput):string[] {
  const snibe=/snibe/i.test(product.brand), needle=/jeringa|lanceta|aguja/i.test(product.name);
  return [...source.matchAll(VOLUME)].filter(m=>!/^\s*\/\s*cc\b/i.test(source.slice((m.index??0)+m[0].length))).map(m=>m[0])
    .filter(s=>!(snibe && /^[123]\s*g\.?$/i.test(s)) && !(needle && /g\.?$/i.test(s)))
    .filter((s,i,a)=>a.findIndex(v=>sentenceCase(v)===sentenceCase(s))===i);
}
function removeBrand(value:string,brand:string):string {
  const escaped=brand.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  return value.replace(/\b(?:marca|maraca|mca\.?)\s*:?[\s\S]*$/i,'')
    .replace(new RegExp(`\\s+${escaped}\\s*$`,'i'),'');
}
function titleFor(product:ProductInput):string {
  const explicitTitle=product.sku ? TITLES[product.sku] : undefined;
  if (explicitTitle) return correctOrthography(explicitTitle);
  let title=removeBrand(clean(product.name),product.brand).replace(/\bc\s*\//gi,'con ');
  if (/snibe/i.test(product.brand)) title=title.replace(/\b([123])\s*(?:g\b|(?:da|ra)?\.?\s*generaci[oó]n\b)/gi,(_,n:string)=>`${n}G`);
  title=title.replace(PACK,'');
  for(const amount of physicalAmounts(title,product)) title=title.replace(amount,'');
  title=title.replace(DIMENSION,'');
  title=title.replace(/\bmodelo\s*:?\s*[a-z0-9.-]+/gi,'');
  title=title.replace(COUNT,(match,offset:number,whole:string)=>/\b(?:para|capacidad\s*(?:de)?)\s*$/i.test(whole.slice(0,offset))?match:'');
  title=title.replace(/\bc\s*\/\s*\d+(?:\s*piezas?)?(?![\d.])/gi,'')
    .replace(/\b(?:capacidad|contenido)\s*(?:de)?\s*[.,]?/gi,'')
    .replace(/\bpieza(?:s)?\s*$/i,'').replace(/\(\s*\)/g,'')
    .replace(/\s*[,.;]\s*[,.;]/g,',').replace(/^[\s,.;]+|[\s,.;]+$/g,'')
    .replace(/\b(?:de|con|en|para|y|del)\s*(?=[,.;]|$)/gi,'')
    .replace(/\.\s*(?=[a-záéíóú])/gi,' ').replace(/[.,;:\s]+$/g,'').trim();
  title=title.replace(/\.\s*(?=\()/g,' ');
  // Never truncate a title or discard a clause after a comma.
  const result=sentenceCase(title || removeBrand(product.name,product.brand));
  const compact = result.replace(/^(Agar deshidratado .+?) deshidratado$/i,'$1');
  return /snibe/i.test(product.brand)?compact.replace(/\b([123])\s*g\b/gi,'$1G'):compact;
}

export function productDisplayInfo(product:ProductInput):ProductDisplayInfo {
  const source=sourceFor(product), amounts=physicalAmounts(source,product);
  const fields:DisplayField[]=[];
  const push=(label:string,value:string)=>{
    const normalized=label==='Generación'?value.replace(/\s/g,'').toUpperCase():sentenceCase(value); if(!normalized) return;
    const existing=fields.find(row=>row.label===label);
    if(existing){
      const values=existing.value.split(' · ');
      if((label==='Contenido'||label==='Medidas') && /[–×]/.test(normalized)) {
        existing.value=values.filter(v=>!normalized.toLowerCase().endsWith(v.toLowerCase())).join(' · ');
      } else if((label==='Contenido'||label==='Medidas') && values.some(v=>/[–×]/.test(v)&&v.toLowerCase().endsWith(normalized.toLowerCase())))return;
      if(!existing.value){existing.value=normalized;return;}
      if(!existing.value.split(' · ').some(v=>v.toLowerCase()===normalized.toLowerCase())) existing.value+=' · '+normalized;
    } else fields.push({label,value:normalized});
  };
  let presentation=product.presentations?.map(canonicalPresentation).join(' / ') || '';
  for(const text of product.features){
    const row=formatFeature(text);if(!row)continue;
    if(row.label==='Presentación'){presentation=canonicalPresentation(row.value);continue;}
    if(/snibe/i.test(product.brand) && row.label==='Contenido' && /^[123]\s*g$/i.test(row.value)){
      push('Generación',row.value.replace(/\s*g$/i,'G'));continue;
    }
    const label=row.label==='Medida'?'Medidas':row.label==='Contenido' && /capacidad/i.test(source)?'Capacidad':row.label;
    push(label,row.value);
  }
  const explicitPresentation=product.sku ? PRESENTATIONS[product.sku] : undefined;
  if(explicitPresentation) presentation=explicitPresentation;
  if(!presentation){
    const packs=[...source.matchAll(PACK)].map(m=>canonicalPresentation(m[0]));
    if(packs.length) presentation=[...new Set(packs)].join(' / ');
    else {
      const counts=[...source.matchAll(COUNT)].filter(m=>!/\b(?:para|capacidad\s*(?:de)?|[x×])\s*$/i.test(source.slice(0,m.index)));
      const lastCount=counts.at(-1)?.[0];
      if(lastCount) presentation=/^1\s*pieza$/i.test(lastCount)?'Pieza':sentenceCase(lastCount);
      else if(/\bpieza\b/i.test(source)) presentation='Pieza';
      else if(source.match(/\bc\s*\/\s*(\d+)\b(?!\s*(?:mL|µL|uL|mm|cm|g)\b)/i)) presentation=source.match(/\bc\s*\/\s*(\d+)\b/i)![1]+' (unidad no indicada)';
      else if(/\bcon\s+200\s*$/i.test(source)) presentation='200 (unidad no indicada)';
      else if(/\bpiezas\s*$/i.test(source)) presentation='Piezas (cantidad no indicada)';
      else if(amounts.length) {
        const firstAmount=amounts[0] ?? '';
        const amountIndex=source.indexOf(firstAmount);
        presentation=/^(QCA|SPIN REACT)$/i.test(product.brand)?sentenceCase(source.slice(amountIndex)):amounts.map(sentenceCase).join(' · ');
      }
    }
  }
  for(const amount of amounts) push(/capacidad/i.test(source)?'Capacidad':'Contenido',amount);
  for(const dimension of source.matchAll(DIMENSION)){
    if(product.sku==='45601ROLLOGASAQ')continue;
    if(!/\b(?:mL|µL)\b/i.test(source.slice((dimension.index??0)+dimension[0].length,(dimension.index??0)+dimension[0].length+3)))push('Medidas',dimension[0]);
  }
  for(const dimension of source.matchAll(/\d+(?:\/\d+|[.,]\d+)?\s*["″](?:\s*[x×]\s*\d+(?:[.,]\d+)?\s*(?:yds?|["″]))?/gi))push('Medidas',dimension[0]);
  const model=source.match(/\b(?:modelo|model|ref\.?|cat\.?)\s*:?\s*([a-z0-9][a-z0-9.-]+)/i);
  const modelValue=model?.[1];
  if(modelValue)push('Modelo',modelValue.replace(/[.,;]+$/g,''));
  const ph=source.match(/\bpH\s*[,;:]?\s*(\d+(?:[.,]\d+)?)(?:\s*[-–]\s*(\d+(?:[.,]\d+)?))?/i);
  const phStart=ph?.[1];
  if(phStart)push('pH',ph[2]?phStart+'–'+ph[2]:phStart);
  for(const measurement of source.matchAll(/\b(longitud|largo|ancho|altura|espesor de pared|di[aá]metro interior|di[aá]metro exterior)\s*(?:de|:)?\s*(\d+(?:[.,]\d+)?(?:\s*[-–]\s*\d+(?:[.,]\d+)?)?\s*(?:mm|cm|m)\b)/gi)) {
    const label=measurement[1], value=measurement[2];
    if(label && value)push(sentenceCase(label),value);
  }
  if(/snibe/i.test(product.brand)) for(const generation of source.matchAll(/\b([123])G\b/gi))push('Generación',generation[1]+'G');
  // Prefer an explicit physical amount already present in the source over an
  // incomplete C/1 token. Unknown quantities remain unknown; no photo is evidence.
  if (/unidad no indicada/i.test(presentation) && amounts.length === 1 && presentation.match(/\d+/)?.[0] === amounts[0].match(/\d+/)?.[0]) {
    presentation = sentenceCase(amounts[0]);
  }
  const unresolved = /unidad no indicada|cantidad no indicada/i.test(presentation);
  if (unresolved) {
    push('Cantidad indicada', presentation.replace(/\s*\([^)]*no indicada[^)]*\)/gi,''));
    presentation = 'Consultar cantidad y unidad';
  }
  presentation=presentation || 'Consultar presentación';
  fields.unshift({label:'Presentación',value:presentation});
  const order=['Presentación','Contenido','Capacidad','Medidas','Modelo','Generación','Material','Color'];
  fields.sort((a,b)=>(order.indexOf(a.label)<0?99:order.indexOf(a.label))-(order.indexOf(b.label)<0?99:order.indexOf(b.label)));
  const specs=fields.filter(row=>row.label!=='Presentación');
  const duplicatesPresentation=(value:string)=>presentation.toLowerCase().includes(value.toLowerCase());
  const cardSpecs=specs.filter(row=>!['Contenido','Capacidad'].includes(row.label)||!duplicatesPresentation(row.value));
  const detail=[cardSpecs.map(row=>row.label==='Detalle'?row.value:row.label+': '+row.value).join(' · '), 'Presentación: '+presentation].filter(Boolean).join('\n');
  const description=/snibe/i.test(product.brand)?sentenceCase(source).replace(/\b([123])\s*g\b/gi,'$1G'):sentenceCase(source);
  return {title:titleFor(product),detail,description,presentation,fields,
    specifications:specs.map(row=>row.label+': '+row.value),type:''};
}

