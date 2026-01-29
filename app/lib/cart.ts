const CART_KEY = 'cse-cart';
const LIST_KEY = 'cse-wishlist';
export const CART_UPDATED_EVENT = 'cse-cart-updated';
export const LIST_UPDATED_EVENT = 'cse-list-updated';

export type CartItem = {
  productId: string;
  name: string;
  price: string;
  imageSrc: string;
  quantity: number;
};

export type ListItem = {
  productId: string;
  name: string;
  price: string;
  imageSrc: string;
};

function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
}

export function addToCart(item: Omit<CartItem, 'quantity'> & { quantity?: number }) {
  const qty = item.quantity ?? 1;
  const cart = getCart();
  const existing = cart.find((i) => i.productId === item.productId);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({ ...item, quantity: qty });
  }
  setCart(cart);
}

export function getCartItems(): CartItem[] {
  return getCart();
}

export function getCartCount(): number {
  return getCart().reduce((sum, i) => sum + i.quantity, 0);
}

export function getCartTotal(): string {
  const cart = getCart();
  let total = 0;
  for (const i of cart) {
    const cleaned = i.price.replace(/,/g, '').replace(/[^\d.]/g, '');
    const num = parseFloat(cleaned) || 0;
    total += num * i.quantity;
  }
  return total.toFixed(2);
}

function getList(): ListItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setList(items: ListItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LIST_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(LIST_UPDATED_EVENT));
}

export function addToList(item: ListItem) {
  const list = getList();
  if (list.some((i) => i.productId === item.productId)) return;
  list.push(item);
  setList(list);
}

export function isInList(productId: string): boolean {
  return getList().some((i) => i.productId === productId);
}
