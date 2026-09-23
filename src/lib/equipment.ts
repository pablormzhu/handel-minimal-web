import mek9200Image from "@/assets/equipos/mek-9200.webp";
import mek1305Image from "@/assets/equipos/mek-1305.webp";
import mek1303Image from "@/assets/equipos/mek-1303.webp";
import mek7300Image from "@/assets/equipos/mek-7300.webp";

export type Equipment = {
  slug: string;
  model: string;
  name: string;
  category: string;
  summary: string;
  image: string;
  highlights: string[];
  specifications: Array<{ label: string; value: string }>;
  source: string;
};

export const equipment: Equipment[] = [
  {
    slug: "celltac-g-mek-9200",
    model: "MEK-9200",
    name: "Celltac G+",
    category: "Analizador hematológico con diferencial de 6 partes",
    summary: "Análisis hematológico avanzado con medición de reticulocitos y procesamiento continuo de muestras.",
    image: mek9200Image,
    highlights: [
      "Diferencial leucocitario de 6 partes y medición de reticulocitos.",
      "Tecnología DynaScatter Laser +HEM488 con láser azul y rojo.",
      "Carga continua de muestras para un flujo de trabajo eficiente.",
    ],
    specifications: [
      { label: "Parámetros reportables", value: "35, incluyendo RET% y RET" },
      { label: "Rendimiento", value: "90 pruebas por hora en CBC+DIFF" },
      { label: "Muestra para CBC", value: "32 µl" },
      { label: "Muestra para CBC+DIFF+RET", value: "47 µl" },
    ],
    source: "https://mx.nihonkohden.com/es/products/invitro-diagnostics/6part-diff-hematology-analyzers/celltac-g-mek-9200",
  },
  {
    slug: "celltac-alpha-plus-mek-1305",
    model: "MEK-1305",
    name: "Celltac α+",
    category: "Analizador hematológico de 3 partes con ESR",
    summary: "Integra hemograma y velocidad de sedimentación globular en una sola aspiración.",
    image: mek1305Image,
    highlights: [
      "Resultados de CBC y ESR a partir de una misma muestra.",
      "Tecnología CiRHEX con alta correlación con el método Westergren.",
      "DynaHelix Flow favorece un conteo celular preciso y estable.",
    ],
    specifications: [
      { label: "Parámetros", value: "32, incluyendo ESR" },
      { label: "Rendimiento CBC", value: "60 muestras por hora" },
      { label: "Rendimiento CBC+ESR", value: "20 muestras por hora" },
      { label: "Muestra para CBC+ESR", value: "80 µl" },
    ],
    source: "https://mx.nihonkohden.com/es/products/invitro-diagnostics/3-part-diff-hematology-analyzers/celltac-alpha-plus-mek-1305",
  },
  {
    slug: "celltac-alpha-plus-mek-1303",
    model: "MEK-1303",
    name: "Celltac α+",
    category: "Analizador hematológico de 3 partes con CRP y HbA1c",
    summary: "Reúne hematología, proteína C reactiva y hemoglobina glucosilada en un solo sistema.",
    image: mek1303Image,
    highlights: [
      "Procesamiento integrado de CBC, CRP y HbA1c.",
      "Una sola aspiración simplifica el flujo de trabajo clínico.",
      "Tecnología DynaHelix Flow para resultados precisos y confiables.",
    ],
    specifications: [
      { label: "Parámetros", value: "26, incluyendo 4 de investigación" },
      { label: "Rendimiento CBC", value: "60 muestras por hora" },
      { label: "Muestra para CBC", value: "20 µl" },
      { label: "Muestra para CBC+CRP", value: "26 µl" },
      { label: "Muestra para HbA1c", value: "10 µl" },
    ],
    source: "https://mx.nihonkohden.com/es/products/invitro-diagnostics/3-part-diff-hematology-analyzers/celltac-alpha-plus-mek-1303",
  },
  {
    slug: "celltac-es-mek-7300",
    model: "MEK-7300",
    name: "Celltac ES",
    category: "Analizador hematológico con diferencial de 5 partes",
    summary: "Conteo celular confiable con tecnología láser, manejo intuitivo y revisión flexible de resultados.",
    image: mek7300Image,
    highlights: [
      "Diferencial leucocitario de 5 partes con tecnología DynaScatter Laser.",
      "Advanced Count mejora el análisis de muestras con niveles celulares bajos.",
      "Pantalla táctil de 10.4 pulgadas y operación intuitiva.",
    ],
    specifications: [
      { label: "Parámetros reportables", value: "23" },
      { label: "Rendimiento", value: "Aproximadamente 60 muestras por hora" },
      { label: "Muestra para CBC", value: "30 µl" },
      { label: "Muestra para CBC+DIFF", value: "55 µl" },
    ],
    source: "https://mx.nihonkohden.com/es/products/invitro-diagnostics/5part-diff-hematology-analyzers/celltac-es-mek-7300",
  },
];

export function equipmentBySlug(slug: string) {
  return equipment.find((item) => item.slug === slug);
}