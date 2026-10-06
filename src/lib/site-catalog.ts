import { catalogBrands, catalogProducts, type CatalogBrand, type CatalogProduct } from '@/lib/brand-catalog';
import { brandDisplayName, normalizeSearch, productDisplayInfo } from '@/lib/format-product';
import productTaxonomy from '@/lib/product-taxonomy.json';

type Classification = { family: string; subfamily: string };
const taxonomy: Record<string, Classification> = productTaxonomy;
export type SiteProduct = CatalogProduct & Classification & { brandSlug: string };

// The original group and SKU remain untouched: image resolution depends on them.
const printedBrands: Record<string, string> = {
  '457010CY-103SGC': 'KB',
  '45701CY-102CA6M': 'KB',
  '4570100CY-102CA': 'KB',
  '457010CY-1035GC': 'KB',
  '457010CY-104EK2': 'KB',
  '4570100CY-106SC': 'KB',
  '457010CY-100UBA': 'KB',
  '45701000CY-NA10': 'KB',
  '26501000PTC4100': 'CONDA',
  '0050100067218-1': 'Bio-Rad',
  '033010000064287': 'Cargille',
  '011010000080100': 'Cargille',
  '011010000-80100': 'Cargille',
};
export function productBrandName(product: CatalogProduct): string {
  return printedBrands[product.sku] ?? brandDisplayName(product.brand);
}
export function brandGroupKey(name: string): string {
  return normalizeSearch(brandDisplayName(name));
}
export const siteProducts: SiteProduct[] = catalogProducts.map(product => {
  const classification = taxonomy[product.sku];
  const group = catalogBrands.find(brand => brand.name === product.brand);
  if (!classification || !group) throw new Error(`Missing catalog metadata: ${product.sku}`);
  return { ...product, ...classification, brandSlug: group.slug };
});

export const siteBrands: CatalogBrand[] = [...new Map(
  catalogBrands.map(brand => [brandGroupKey(brand.name), {
    ...brand,
    name: brandDisplayName(brand.name),
    slug: brand.name === 'HJEATHROW' ? 'heathrow' : brand.slug,
    count: catalogProducts.filter(product => brandGroupKey(product.brand) === brandGroupKey(brand.name)).length,
  }]),
).values()].sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base', numeric: true }));

export function siteProductsByBrand(name: string): SiteProduct[] {
  return siteProducts.filter(product => brandGroupKey(product.brand) === brandGroupKey(name));
}
export function siteProductsByFamily(family: string): SiteProduct[] {
  return siteProducts.filter(product => product.family === family);
}
export function searchCatalog(query: string, products = siteProducts): SiteProduct[] {
  const term = normalizeSearch(query);
  if (!term) return products;
  return products.filter(product => {
    const info = productDisplayInfo(product);
    return normalizeSearch([
      product.sku, product.name, product.brand, productBrandName(product),
      product.description, ...product.features, product.family, product.subfamily,
      info.title, info.presentation,
    ].join(' ')).includes(term);
  });
}
export function catalogProductPath(product: CatalogProduct): string {
  const brand = catalogBrands.find(group => group.name === product.brand);
  if (!brand) throw new Error(`Missing brand: ${product.sku}`);
  return `/marca/${brand.slug}/producto/${product.slug}`;
}

// Old editorial/demo URLs retain a destination without exposing fictitious SKUs.
export const legacyProductFamilies: Record<string, string> = {
  'patches-banditas-adhesivas': 'material-medico-bioseguridad',
  'patches-venda-elastica': 'material-medico-bioseguridad',
  'patches-gasas-esteriles': 'material-medico-bioseguridad',
  'patches-guantes-exploracion': 'material-medico-bioseguridad',
  'maglumi-tsh': 'diagnostico-clinico',
  'maglumi-vitamina-d': 'diagnostico-clinico',
  'qca-glucosa': 'diagnostico-clinico',
  'tincion-gram-mcd': 'microbiologia',
  'hisopo-copan': 'toma-muestras',
  'portaobjetos-esmerilado': 'reactivos-consumibles',
  'micropipeta-variable': 'reactivos-consumibles',
  'guantes-nitrilo': 'material-medico-bioseguridad',
  'contenedor-rpbi': 'material-medico-bioseguridad',
};
