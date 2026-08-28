import diagnostico from "@/assets/fam-diagnostico.jpg";
import microbiologia from "@/assets/fam-microbiologia.jpg";
import control from "@/assets/fam-control.jpg";
import muestras from "@/assets/fam-muestras.jpg";
import reactivos from "@/assets/fam-reactivos.jpg";
import bioseguridad from "@/assets/fam-bioseguridad.jpg";

export type Product = {
  slug: string;
  name: string;
  brand: string;
  sku: string;
  family: string;
  subfamily: string;
  description: string;
  presentations: string[];
  features: string[];
  documents: string[];
};

export type Family = {
  slug: string;
  name: string;
  tagline: string;
  intro: string;
  image: string;
  subfamilies: string[];
};

export const families: Family[] = [
  {
    slug: "diagnostico-clinico",
    name: "Diagnóstico clínico",
    tagline: "Inmunoensayo, química clínica y hematología.",
    intro:
      "Plataformas y reactivos para determinación clínica, desde quimioluminiscencia hasta pruebas rápidas en el punto de atención.",
    image: diagnostico,
    subfamilies: [
      "Inmunoensayo y quimioluminiscencia",
      "Química clínica",
      "Hematología y HbA1c",
      "Serología e inmunohematología",
      "Pruebas rápidas y Point of Care",
    ],
  },
  {
    slug: "microbiologia",
    name: "Microbiología",
    tagline: "Medios, identificación y susceptibilidad.",
    intro:
      "Todo el flujo microbiológico: cultivo, identificación, susceptibilidad antimicrobiana y transporte de muestra.",
    image: microbiologia,
    subfamilies: [
      "Medios de cultivo",
      "Susceptibilidad antimicrobiana",
      "Identificación",
      "Tinciones y reactivos",
      "Toma y transporte microbiológico",
    ],
  },
  {
    slug: "control-calidad",
    name: "Control de calidad",
    tagline: "Controles y calibradores trazables.",
    intro:
      "Materiales de control y calibración para sostener la confiabilidad analítica del laboratorio.",
    image: control,
    subfamilies: [
      "Inmunoensayo",
      "Química clínica",
      "Diabetes y HbA1c",
      "Coagulación",
      "Uroanálisis",
    ],
  },
  {
    slug: "toma-muestras",
    name: "Toma y manejo de muestras",
    tagline: "Del paciente al analizador.",
    intro:
      "Sistemas de toma al vacío, agujas, equipos alados, hisopos y microcolección para una fase preanalítica consistente.",
    image: muestras,
    subfamilies: [
      "Toma de sangre",
      "Tubos y sistemas al vacío",
      "Agujas",
      "Equipos alados",
      "Orina",
      "Hisopos",
      "Capilares y microcolección",
    ],
  },
  {
    slug: "reactivos-consumibles",
    name: "Reactivos y consumibles de laboratorio",
    tagline: "El insumo diario del laboratorio.",
    intro:
      "Consumibles y reactivos generales para operación cotidiana: pipeteo, vidrio, portaobjetos, microtubos y soluciones.",
    image: reactivos,
    subfamilies: [
      "Portaobjetos y cubreobjetos",
      "Pipeteo",
      "Tubos y microtubos",
      "Cajas Petri",
      "Vidrio",
      "Gradillas",
      "Soluciones y reactivos generales",
    ],
  },
  {
    slug: "material-medico-bioseguridad",
    name: "Material médico y bioseguridad",
    tagline: "Protección, curación y manejo de RPBI.",
    intro:
      "Insumos de protección personal, curación, jeringas, antisépticos y manejo seguro de residuos punzocortantes.",
    image: bioseguridad,
    subfamilies: [
      "Guantes y protección",
      "Curación",
      "Jeringas",
      "Material médico desechable",
      "Antisépticos",
      "RPBI y punzocortantes",
    ],
  },
];

export const brands = [
  "SNIBE Diagnostic",
  "MCD Lab",
  "Dibico",
  "QCA",
  "Maesa",
  "Hycel",
  "Spin React",
  "Nihon Kohden",
  "Abbott",
  "Copan",
  "Kabla",
  "Golden Vac",
  "Sarstedt",
  "Puritan",
  "Delta Lab",
  "Pyrex",
  "Ambiderm",
  "Quirmex",
  "3M",
  "Universal de Desechables",
];

export const products: Product[] = [
  {
    slug: "maglumi-tsh",
    name: "MAGLUMI TSH",
    brand: "SNIBE Diagnostic",
    sku: "130201",
    family: "diagnostico-clinico",
    subfamily: "Inmunoensayo y quimioluminiscencia",
    description: "Inmunoensayo para determinación de TSH por quimioluminiscencia.",
    presentations: ["Kit 100 pruebas", "Kit 200 pruebas"],
    features: [
      "Quimioluminiscencia con partículas paramagnéticas",
      "Compatible con serie MAGLUMI",
      "Calibrador y control disponibles por separado",
    ],
    documents: ["Ficha técnica", "Inserto"],
  },
  {
    slug: "maglumi-vitamina-d",
    name: "MAGLUMI 25-OH Vitamina D",
    brand: "SNIBE Diagnostic",
    sku: "130308",
    family: "diagnostico-clinico",
    subfamily: "Inmunoensayo y quimioluminiscencia",
    description: "Determinación cuantitativa de 25-OH vitamina D total en suero.",
    presentations: ["Kit 100 pruebas"],
    features: ["Ensayo competitivo", "Resultado en 30 minutos"],
    documents: ["Ficha técnica"],
  },
  {
    slug: "qca-glucosa",
    name: "Glucosa GOD-PAP",
    brand: "QCA",
    sku: "99-1002",
    family: "diagnostico-clinico",
    subfamily: "Química clínica",
    description: "Reactivo enzimático colorimétrico para determinación de glucosa.",
    presentations: ["4 × 250 mL", "2 × 100 mL"],
    features: ["Método GOD-PAP", "Estable en refrigeración", "Adaptable a analizadores abiertos"],
    documents: ["Ficha técnica", "Inserto"],
  },
  {
    slug: "tincion-gram-mcd",
    name: "Set de tinción de Gram",
    brand: "MCD Lab",
    sku: "TG-500",
    family: "microbiologia",
    subfamily: "Tinciones y reactivos",
    description: "Juego de colorantes para tinción diferencial de Gram.",
    presentations: ["Set 4 × 500 mL"],
    features: ["Filtrado listo para uso", "Envase con dosificador"],
    documents: ["Ficha técnica"],
  },
  {
    slug: "tincion-gram-mcd",
    name: "Set de tinción de Gram",
    brand: "MCD Lab",
    sku: "TG-500",
    family: "microbiologia",
    subfamily: "Tinciones y reactivos",
    description: "Juego de colorantes para tinción diferencial de Gram.",
    presentations: ["Set 4 × 500 mL"],
    features: ["Filtrado listo para uso", "Envase con dosificador"],
    documents: ["Ficha técnica"],
  },
  {
    slug: "vacutainer-edta",
    name: "Tubo al vacío con EDTA K2",
    brand: "BD",
    sku: "367861",
    family: "toma-muestras",
    subfamily: "Tubos y sistemas al vacío",
    description: "Tubo plástico para recolección de sangre total en hematología.",
    presentations: ["Caja con 100 piezas", "Caja con 1000 piezas"],
    features: ["4 mL", "Tapón lavanda", "Interior siliconizado"],
    documents: ["Ficha técnica"],
  },
  {
    slug: "equipo-alado-bd",
    name: "Equipo alado para toma de muestra",
    brand: "BD",
    sku: "367281",
    family: "toma-muestras",
    subfamily: "Equipos alados",
    description: "Set de venopunción con aguja de pared delgada y tubuladura flexible.",
    presentations: ["Caja con 50 piezas"],
    features: ["Calibre 23 G", "Longitud de tubuladura 19 cm"],
    documents: ["Inserto"],
  },
  {
    slug: "hisopo-copan",
    name: "Hisopo con medio de transporte",
    brand: "Copan",
    sku: "108C",
    family: "toma-muestras",
    subfamily: "Hisopos",
    description: "Hisopo estéril con tubo y medio Amies para transporte de muestra.",
    presentations: ["Caja con 100 piezas"],
    features: ["Aplicador de nylon", "Estéril individual"],
    documents: ["Ficha técnica"],
  },
  {
    slug: "portaobjetos-esmerilado",
    name: "Portaobjetos esmerilado",
    brand: "Delta Lab",
    sku: "D100010",
    family: "reactivos-consumibles",
    subfamily: "Portaobjetos y cubreobjetos",
    description: "Portaobjetos de vidrio con banda esmerilada para identificación.",
    presentations: ["Caja con 50 piezas", "Caja con 1440 piezas"],
    features: ["26 × 76 mm", "Bordes esmerilados", "Espesor 1 mm"],
    documents: [],
  },
  {
    slug: "micropipeta-variable",
    name: "Micropipeta de volumen variable",
    brand: "Hycel",
    sku: "MP-1000",
    family: "reactivos-consumibles",
    subfamily: "Pipeteo",
    description: "Pipeta monocanal para dosificación precisa en rutina de laboratorio.",
    presentations: ["100–1000 µL", "20–200 µL"],
    features: ["Autoclavable parcialmente", "Expulsor de puntas integrado"],
    documents: ["Manual"],
  },
  {
    slug: "guantes-nitrilo",
    name: "Guantes de nitrilo para exploración",
    brand: "Ambiderm",
    sku: "GN-100",
    family: "material-medico-bioseguridad",
    subfamily: "Guantes y protección",
    description: "Guante desechable sin polvo para uso clínico y de laboratorio.",
    presentations: ["Caja con 100 piezas"],
    features: ["Libre de látex", "Texturizado en dedos", "Tallas CH a G"],
    documents: ["Ficha técnica"],
  },
  {
    slug: "contenedor-rpbi",
    name: "Contenedor para punzocortantes",
    brand: "Quirmex",
    sku: "CP-1000",
    family: "material-medico-bioseguridad",
    subfamily: "RPBI y punzocortantes",
    description: "Contenedor rígido rojo para disposición de residuos punzocortantes.",
    presentations: ["1 L", "3 L", "5 L"],
    features: ["Conforme a NOM-087", "Tapa de cierre definitivo"],
    documents: [],
  },
];

export const getFamily = (slug: string) => families.find((f) => f.slug === slug);
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const productsByFamily = (slug: string) => products.filter((p) => p.family === slug);
