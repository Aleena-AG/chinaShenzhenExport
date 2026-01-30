import gpsData from '../components/gpsproduct.json';

export type GpsProduct = {
  id: number;
  name: string;
  description: string;
  fullDescription?: string;
  price: string;
  image: string;
  gallery?: string[];
  specs?: Record<string, unknown>;
  manufacturer?: { company: string; location: string; email: string };
  distributor?: { company: string; location: string; email: string; whatsapp?: string };
  badge?: { text: string; type: string } | null;
};

export type GpsSubCategory = {
  slug: string;
  label: string;
  products: GpsProduct[];
};

const subCategories = gpsData as GpsSubCategory[];

export function getGpsSubCategories(): GpsSubCategory[] {
  return subCategories;
}

export function getGpsSubCategoryBySlug(slug: string): GpsSubCategory | undefined {
  return subCategories.find((s) => s.slug === slug);
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9-]/g, '');
}

export function getGpsProductSlug(product: GpsProduct): string {
  return `${slugify(product.name)}-${product.id}`;
}

export function getGpsProductUrl(subSlug: string, product: GpsProduct): string {
  return `/product/${subSlug}/${getGpsProductSlug(product)}`;
}

export function getGpsProductBySlug(subSlug: string, productSlug: string): GpsProduct | undefined {
  const sub = getGpsSubCategoryBySlug(subSlug);
  if (!sub) return undefined;
  return sub.products.find((p) => getGpsProductSlug(p) === productSlug);
}
