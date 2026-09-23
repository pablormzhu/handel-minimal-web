function stripListMarkers(value: string): string {
  return value
    .replace(/^\s*\(\*\)\s*/g, "")
    .replace(/^\s*\*\s*/g, "")
    .trim();
}

export function sentenceCase(value: string): string {
  const lowered = stripListMarkers(value).toLowerCase().trim();
  if (!lowered) return "";
  return lowered.charAt(0).toUpperCase() + lowered.slice(1);
}

export function titleCase(value: string): string {
  return value
    .toLowerCase()
    .split(" ")
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(" ");
}

export function formatFeature(feature: string): { label: string; value: string } | null {
  const trimmed = feature.trim();
  if (!trimmed) return null;

  const separatorIndex = trimmed.indexOf(":");
  if (separatorIndex === -1) {
    return { label: "", value: sentenceCase(trimmed) };
  }

  const label = trimmed.slice(0, separatorIndex).trim();
  const value = trimmed.slice(separatorIndex + 1).trim();

  return {
    label: sentenceCase(label),
    value: sentenceCase(value),
  };
}

const PRESENTATION_PATTERN = /\b(caja\s+(?:con|c\/)|frasco\s+(?:con|de)|bolsa\s+(?:con|de)|paquete\s+(?:con|de)|bid[oó]n\s+(?:con|de)|kit\s+(?:con|de)|estuche\s+(?:con|de)|pieza\b|presentaci[oó]n\s*:?)\s*[^,.;]*/i;
const TECHNICAL_START_PATTERN = /\b(?:con\s*:|[ií]ndice de refracci[oó]n|viscosidad|densidad|temperatura de ebullici[oó]n|t\.?\s*de ebullici[oó]n|fluorescencia)\b/i;
const QUANTITY_PATTERN = /\b\d+(?:[.,]\d+)?\s*(?:x\s*\d+(?:[.,]\d+)?\s*)?(?:ml|µl|l(?:itros?)?|grs?|g|kg|piezas?|pzas?|pruebas?|determinaciones?|discos?|tubos?|placas?)\b/i;
const DETAIL_START_PATTERN = /\b(?:emplead[oa]s?|utilizad[oa]s?|para\s+(?:la|el|tinci[oó]n|prueba|conteo|detectar)|seg[uú]n\s+(?:el|la|m[eé]todo|f[oó]rmula)|soluci[oó]n\s+(?:colorante|estabilizada|para|con)|en\s+concentraci[oó]n)\b/i;

function cleanProductText(value: string): string {
  return stripListMarkers(value)
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:])/g, "$1")
    .replace(/\s*[.,;:]+\s*$/g, "")
    .trim();
}

function readableCase(value: string): string {
  const normalized = cleanProductText(value).toLowerCase();
  return normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : "";
}

function removeBrand(value: string, brand: string): string {
  const escapedBrand = brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return value
    .replace(new RegExp(`[,.;]?\\s*marca\\s+${escapedBrand}\\.?\\s*$`, "i"), "")
    .replace(/[,.;]?\s*marca\s+[a-z0-9 .®-]+\.?\s*$/i, "");
}

function extractPresentation(value: string): string {
  const clean = cleanProductText(value);
  const match = clean.match(PRESENTATION_PATTERN) ?? clean.match(QUANTITY_PATTERN);
  return match ? readableCase(match[0]) : "";
}

function extractType(value: string): string {
  const match = cleanProductText(value).match(/\btipo\s+["“”']?\s*[a-z0-9-]+\s*["“”']?/i);
  return match ? readableCase(match[0].replace(/["“”']/g, "")) : "";
}

function splitSpecifications(value: string): string[] {
  const normalized = cleanProductText(value)
    .replace(/\bT\.?\s*de ebullici[oó]n\b/gi, "Temperatura de ebullición")
    .replace(/\s*=\s*/g, ": ");

  const labels = [
    "Índice de refracción",
    "Indice de refraccion",
    "Baja viscosidad",
    "Viscosidad",
    "Densidad",
    "Temperatura de ebullición",
    "Fluorescencia",
  ];
  const escaped = labels.map((label) => label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const marked = normalized.replace(new RegExp(`\\b(${escaped})\\s*:`, "gi"), "|||$1:");
  return marked
    .split("|||")
    .slice(1)
    .map((item) => cleanProductText(item.split(/,\s*(?=[A-ZÁÉÍÓÚ])/)[0] ?? ""))
    .filter(Boolean);
}

export type ProductDisplayInfo = {
  title: string;
  detail: string;
  description: string;
  specifications: string[];
};

export function productDisplayInfo(product: {
  name: string;
  brand: string;
  description: string;
  features: string[];
}): ProductDisplayInfo {
  const source = cleanProductText(product.description || product.name);
  let title = removeBrand(cleanProductText(product.name), product.brand);
  const technicalStart = title.search(TECHNICAL_START_PATTERN);
  if (technicalStart > 0) title = title.slice(0, technicalStart);
  const presentationStart = title.search(PRESENTATION_PATTERN);
  if (presentationStart > 0) title = title.slice(0, presentationStart);
  const commaStart = title.indexOf(",");
  if (commaStart > 0) title = title.slice(0, commaStart);
  const detailStart = title.search(DETAIL_START_PATTERN);
  if (detailStart > 0) title = title.slice(0, detailStart);
  title = title
    .replace(/\btipo\s+["“”']?\s*[a-z0-9-]+\s*["“”']?/gi, "")
    .replace(QUANTITY_PATTERN, "")
    .replace(/\s+(?:de|con|en|para|seg[uú]n|y|o)\s*$/i, "");

  const detailParts = [extractType(source), extractPresentation(source)].filter(
    (part, index, parts) => part && parts.indexOf(part) === index,
  );
  if (detailParts.length === 0 && product.features.length > 0) {
    const firstFeature = product.features[0];
    const feature = firstFeature ? formatFeature(firstFeature) : null;
    if (feature) detailParts.push(feature.label ? `${feature.label}: ${feature.value}` : feature.value);
  }

  return {
    title: readableCase(title),
    detail: detailParts.join(" · "),
    description: readableCase(source),
    specifications: splitSpecifications(source),
  };
}
