const WISHLIST_KEY = 'cse-wishlist';
const COMPARE_KEY = 'cse-compare';

export const WISHLIST_UPDATED_EVENT = 'cse-wishlist-updated';
export const COMPARE_UPDATED_EVENT = 'cse-compare-updated';

export type WishlistItem = {
  productId: string;
  name: string;
  price?: string;
  imageSrc?: string;
  categorySlug?: string;
  productSlug?: string;
};

/** Flattened specs for comparison – arrays joined to string */
export type CompareSpecs = Record<string, string>;

/** Flatten specs for comparison – arrays → comma-joined, objects skipped */
export function flattenSpecs(raw: Record<string, unknown> | undefined): CompareSpecs {
  if (!raw || typeof raw !== 'object') return {};
  const out: CompareSpecs = {};
  for (const [k, v] of Object.entries(raw)) {
    if (v == null) continue;
    if (Array.isArray(v)) out[k] = v.map((x) => (typeof x === 'string' ? x : String(x))).join(', ');
    else if (typeof v === 'object') continue;
    else out[k] = String(v);
  }
  return out;
}

export type CompareItem = {
  productId: string;
  name: string;
  price?: string;
  originalPrice?: string;
  imageSrc?: string;
  categorySlug?: string;
  productSlug?: string;
  sku?: string;
  availability?: string;
  /** Your product specs – connectivity, positioning, dimensions, weight, etc. */
  specs?: CompareSpecs;
};

function getWishlist(): WishlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setWishlist(items: WishlistItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(WISHLIST_UPDATED_EVENT));
}

export function addToWishlist(item: WishlistItem) {
  const list = getWishlist();
  if (list.some((i) => i.productId === item.productId)) return false;
  list.push(item);
  setWishlist(list);
  return true;
}

export function removeFromWishlist(productId: string) {
  const list = getWishlist();
  const filtered = list.filter((i) => i.productId !== productId);
  setWishlist(filtered);
}

export function isInWishlist(productId: string): boolean {
  return getWishlist().some((i) => i.productId === productId);
}

export function getWishlistItems(): WishlistItem[] {
  return getWishlist();
}

export function getWishlistCount(): number {
  return getWishlist().length;
}

function getCompare(): CompareItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(COMPARE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setCompare(items: CompareItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(COMPARE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(COMPARE_UPDATED_EVENT));
}

export function addToCompare(item: CompareItem) {
  const list = getCompare();
  if (list.some((i) => i.productId === item.productId)) return false;
  if (list.length >= 4) return false;
  list.push(item);
  setCompare(list);
  return true;
}

export function removeFromCompare(productId: string) {
  const list = getCompare();
  const filtered = list.filter((i) => i.productId !== productId);
  setCompare(filtered);
}

export function isInCompare(productId: string): boolean {
  return getCompare().some((i) => i.productId === productId);
}

export function getCompareItems(): CompareItem[] {
  return getCompare();
}

export function getCompareCount(): number {
  return getCompare().length;
}
