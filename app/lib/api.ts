const API_BASE =
  typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001')
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');

export type ApiCategory = {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  status: string;
  is_featured: boolean;
  sort_order: number;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

type RequestConfig = RequestInit & {
  params?: Record<string, string>;
};

async function request<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> {
  const { params, ...init } = config;
  const url = new URL(`${API_BASE}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString(), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.message || res.statusText || 'Request failed');
  }
  return json as ApiResponse<T>;
}

export const api = {
  get: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'GET' }),
  post: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'DELETE' }),
};

/**
 * Fetch categories. Uses Next.js proxy /api/categories in the browser to avoid CORS;
 * the proxy calls your backend at NEXT_PUBLIC_API_URL.
 */
export async function fetchCategories(): Promise<ApiCategory[]> {
  const url =
    typeof window === 'undefined'
      ? `${API_BASE}/api/public/categories`
      : `${window.location.origin}/api/categories`;
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || res.statusText || 'Failed to fetch');
  const data = json?.data;
  if (!json.success || !Array.isArray(data)) return [];
  return data;
}

/** Raw product from API – flexible shape for different backends */
export type ApiProduct = {
  id: number | string;
  name?: string;
  title?: string;
  slug?: string;
  description?: string;
  short_description?: string;
  price?: string | number;
  price_formatted?: string;
  image?: string;
  image_url?: string;
  thumbnail?: string;
  images?: string[];
  category?: string;
  category_name?: string;
  category_slug?: string;
  tag?: string;
  badge?: string;
  status?: string;
  [key: string]: unknown;
};

/**
 * Fetch products. Uses Next.js proxy /api/products in the browser to avoid CORS.
 */
export async function fetchProducts(): Promise<ApiProduct[]> {
  const url =
    typeof window === 'undefined'
      ? `${API_BASE}/api/products`
      : `${window.location.origin}/api/products`;
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || res.statusText || 'Failed to fetch');
  const data = json?.data ?? json?.products ?? json;
  if (!Array.isArray(data)) return [];
  return data;
}

/** Single product from API (e.g. GET /api/products/4) */
export type ApiProductTab = {
  id: number;
  tab_title: string;
  tab_slug: string;
  sort_order: number;
  content: string;
};

export type ApiProductDetail = ApiProduct & {
  image_urls?: string[];
  tabs?: ApiProductTab[];
  video_url?: string;
  short_video_url?: string;
  cover_image_url?: string;
  quantity?: number;
  discount_price?: string | null;
  sale_price?: string | null;
  place_of_origin?: string | null;
};

export type ApiProductByName = { id: number; name: string };

/**
 * Fetch products by category or subcategory. Uses Next.js proxy /api/products/by-category.
 * Provide only one of category or subcategory (ID or slug).
 */
export async function fetchProductsByCategory(params: {
  category?: number | string;
  subcategory?: number | string;
}): Promise<ApiProductByName[]> {
  const { category, subcategory } = params;
  if (!category && !subcategory) return [];
  if (category && subcategory) return [];

  const url =
    typeof window === 'undefined'
      ? `${API_BASE}/api/public/products/by-category`
      : `${window.location.origin}/api/products/by-category`;
  const searchParams = category
    ? `category=${encodeURIComponent(String(category))}`
    : `subcategory=${encodeURIComponent(String(subcategory!))}`;
  const res = await fetch(`${url}?${searchParams}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  const json = await res.json();
  if (!res.ok) return [];
  const data = json?.data;
  if (!json.success || !Array.isArray(data)) return [];
  return data as ApiProductByName[];
}

/**
 * Fetch a single product by id. Uses Next.js proxy /api/products/[id] in the browser.
 */
export async function fetchProductById(id: number | string): Promise<ApiProductDetail | null> {
  const url =
    typeof window === 'undefined'
      ? `${API_BASE}/api/products/${id}`
      : `${window.location.origin}/api/products/${id}`;
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
  const json = await res.json();
  if (!res.ok) return null;
  const data = json?.data ?? json;
  if (!data || typeof data !== 'object') return null;
  return data as ApiProductDetail;
}

/** Split flat categories into main (parent_id null) and children grouped by parent */
export function groupCategories(categories: ApiCategory[]) {
  const main = categories
    .filter((c) => c.parent_id == null)
    .sort((a, b) => a.sort_order - b.sort_order);
  const byParent = new Map<number, ApiCategory[]>();
  categories
    .filter((c) => c.parent_id != null)
    .sort((a, b) => a.sort_order - b.sort_order)
    .forEach((c) => {
      const pid = c.parent_id!;
      if (!byParent.has(pid)) byParent.set(pid, []);
      byParent.get(pid)!.push(c);
    });
  return { main, byParent };
}
