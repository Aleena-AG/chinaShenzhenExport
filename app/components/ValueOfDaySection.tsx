'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getGpsSubCategories } from '../lib/gps-products';
import { fetchProducts, type ApiProduct } from '../lib/api';
import GradientButton from './GradientButton';
import HtmlRenderer from './RenderHtml';

/** Unified product for the card – from static list or API */
export type DisplayProduct = {
  id: string;
  name: string;
  description?: string;
  imageSrc: string;
  price: string;
  category?: string;
  tag?: string;
  productUrl: string;
};

// Product shape – imageSrc = default, imageSrcHover = hover pe dikhega. tag = optional ribbon (e.g. "NEW", "SALE", "HOT") – only shown when set.
export type ProductItem = {
  id: string;
  category: string;
  name: string;
  imageSrc: string;
  imageSrcHover?: string;
  price: string;
  originalPrice?: string;
  description?: string;
  origin?: string;
  wineType?: string;
  alcohol?: string;
  tag?: string;
};

// 16 unique products – each shown once on home page (no repeats)
export const valueOfDayProducts: ProductItem[] = [
  { id: '1', category: 'Gps Tracker & Accessories', name: 'DBV2-10 (Red copper)', imageSrc: '/accesories/cable%20lugs/lugs.png', imageSrcHover: '/accesories/cable%20lugs/lugs-removebg.png', price: 'AED 62.10', originalPrice: 'AED 69.00', tag: 'NEW' },
  { id: '2', category: 'Gps Tracker & Accessories', name: 'Teltonika FMC150', imageSrc: '/accesories/gps%20tracker/fmc150.jpg', imageSrcHover: '/accesories/gps%20tracker/FMC150-removebg-preview%20(1).png', price: 'AED 59.00', originalPrice: 'AED 79.00', tag: 'SALE' },
  { id: '3', category: 'Gps Tracker & Accessories', name: 'Mini Pin Fuse Adapter', imageSrc: '/accesories/Fuse%20Adapter/Mini%20Pin%20Fuse%20Adapter/mpfa.png', imageSrcHover: '/accesories/Fuse%20Adapter/Mini%20Pin%20Fuse%20Adapter/mpfa-removebg.png', price: '$12.00', tag: 'HOT' },
  { id: '4', category: 'Gps Tracker & Accessories', name: 'Drexia 1W-H0-04P 13.56mhz RFID Reader', imageSrc: '/accesories/RFID%20Sensor/1w-h0-04p-ms-rfid-reader-1356-mhz.jpg', imageSrcHover: '/accesories/RFID%20Sensor/1w-h0-04p-ms-rfid-reader-1356-mhz-removebg.png', price: '$799.00' },
  { id: '5', category: 'Gps Tracker & Accessories', name: 'Pet Cloth Automotive Tape', imageSrc: '/accesories/Tape/pet%20cloth%20automotive%20tape.jpg', imageSrcHover: '/accesories/Tape/pet_cloth_automotive_tape-removebg-preview.png', price: '$8.00', tag: 'NEW' },
  { id: '6', category: 'Gps Tracker & Accessories', name: 'ULOGS 3', imageSrc: '/accesories/Temperature%20Data%20Logger/Ulogs3.png', imageSrcHover: '/accesories/Temperature%20Data%20Logger/Ulogs3-removebg.png', price: '$45.00' },
  { id: '7', category: 'Gps Tracker & Accessories', name: 'Arkangel R-1701 /12V', imageSrc: '/accesories/Relay%26%20harness/12v-removebg-preview.png', imageSrcHover: '/accesories/Relay%26%20harness/12v-removebg-preview.png', price: '$0.00' },
  { id: '8', category: 'Gps Tracker & Accessories', name: 'Micro Low Profile Fuse', imageSrc: '/accesories/Fuse/Micro%20Low%20Profile%20Fuse/MLPF.avif', imageSrcHover: '/accesories/Fuse/Micro%20Low%20Profile%20Fuse/MLPF-removebg.png', price: '$0.00', tag: 'SALE' },
  { id: '9', category: 'Gps Tracker & Accessories', name: 'YG-D3 GPS Tracker', imageSrc: '/accesories/gps%20tracker/yg-d3.png', imageSrcHover: '/accesories/gps%20tracker/yg-d3-removebg-preview.png', price: '$0.00' },
  { id: '10', category: 'Gps Tracker & Accessories', name: 'Universal 5-Pin Automotive Relay Harness', imageSrc: '/accesories/Relay%26%20harness/5pin.jpeg', imageSrcHover: '/accesories/Relay%26%20harness/5pin-removebg-preview.png', price: '$0.00' },
  { id: '11', category: 'Gps Tracker & Accessories', name: 'Mini Fuse', imageSrc: '/accesories/Fuse/Mini%20Pin%20Fuse/mpf.png', imageSrcHover: '/accesories/Fuse/Mini%20Pin%20Fuse/mpf-removebg.png', price: '$0.00' },
  { id: '12', category: 'Gps Tracker & Accessories', name: 'Standard Fuse Tap', imageSrc: '/accesories/Fuse%20Adapter/Low%20Profile%20Fuse%20Adapter/LPFA.jpg', imageSrcHover: '/accesories/Fuse%20Adapter/Low%20Profile%20Fuse%20Adapter/LPFA-removebg.png', price: '$0.00' },
  { id: '13', category: 'Gps Tracker & Accessories', name: 'PVC Insulation Tape', imageSrc: '/accesories/Tape/Arkangel%20Circle%20Logo%20copy.jpg', imageSrcHover: '/accesories/Tape/Arkangel_Circle_Logo_copy-removebg-preview.png', price: '$6.00' },
  { id: '14', category: 'Gps Tracker & Accessories', name: 'ULOGS 4', imageSrc: '/accesories/Temperature%20Data%20Logger/Ulogs4.jpg', imageSrcHover: '/accesories/Temperature%20Data%20Logger/Ulogs4-removebg.png', price: '$0.00', tag: 'HOT' },
  { id: '15', category: 'Gps Tracker & Accessories', name: 'MDD1.25-250', imageSrc: '/accesories/cable%20lugs/Picture%202.png', imageSrcHover: '/accesories/cable%20lugs/Picture_2-removebg.png', price: 'AED 62.10' },
  { id: '16', category: 'Gps Tracker & Accessories', name: 'Teltonika FMC130', imageSrc: '/accesories/gps%20tracker/fmc130.jpeg', imageSrcHover: '/accesories/gps%20tracker/fmc130-removebg-preview.png', price: '$0.00' },
];

type CategoryWithSubTypes = { title: string; subTypes: string[] };

const categoryLinks: CategoryWithSubTypes[] = [
  {
    title: 'Gps Tracker & Accessories',
    
    subTypes: ['GPS Trackers', 'Cable Lugs', 'Relay & Harness', 'Fuse Adapter & Fuse Holder', 'Tapes', 'Fuses', 'Temp Data Logger', 'RFID Reader'],
  },
  {
    title: 'Cameras, Audio & Video',
    subTypes: ['Cameras', 'Audio', 'Video', 'Lenses', 'Tripods'],
  },
  {
    title: 'Mobiles & Tablets',
    subTypes: ['Smartphones', 'Tablets', 'Cases', 'Chargers', 'Screen Protectors'],
  },
  {
    title: 'Movies, Music & Video Games',
    subTypes: ['Movies', 'Music', 'Video Games', 'Consoles', 'Accessories'],
  },
  {
    title: 'Watches & Eyewear',
    subTypes: ['Smartwatches', 'Watches', 'Sunglasses', 'Eyewear Accessories'],
  },
  {
    title: 'Car, Motorbike & Industrial',
    subTypes: ['Car Accessories', 'Motorbike', 'Industrial', 'Tools'],
  },
  {
    title: 'TV & Audio',
    subTypes: ['TVs', 'Speakers', 'Soundbars', 'Audio Cables', 'Mounts'],
  },
];

/** Slug for URL: lowercase, spaces/special -> hyphens */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9-]/g, '');
}

/** Product URL path: /product/[category]/[slug] */
export function getProductUrl(product: ProductItem): string {
  const categorySlug = slugify(product.category);
  const productSlug = `${slugify(product.name)}-${product.id}`;
  return `/product/${categorySlug}/${productSlug}`;
}

/** Map static ProductItem to DisplayProduct for the card grid */
function toDisplayProduct(p: ProductItem): DisplayProduct {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    imageSrc: p.imageSrc,
    price: p.price,
    category: p.category,
    tag: p.tag,
    productUrl: getProductUrl(p),
  };
}

/** Map API product to DisplayProduct; handles various backend field names */
function apiProductToDisplay(p: ApiProduct): DisplayProduct {
  const id = String(p.id ?? '');
  const name = (p.name ?? p.title ?? 'Product').toString().trim();
  const desc = (p.short_description ?? p.description ?? '').toString().trim();
  const img =
    (p.image ?? p.image_url ?? p.thumbnail ?? (Array.isArray(p.images) ? p.images[0] : undefined) ?? '')?.toString().trim() ||
    `https://via.placeholder.com/200x200?text=${encodeURIComponent(name)}`;
  const price =
    (p.price_formatted ?? (typeof p.price === 'number' ? `$${p.price}` : p.price) ?? '$0.00').toString().trim();
  const category = (p.category_name ?? p.category ?? '').toString().trim();
  const tag = (p.tag ?? p.badge ?? '').toString().trim() || undefined;
  const catSlug = (p.category_slug ?? (category ? slugify(category) : '')).toString().trim();
  const productSlug = (p.slug ?? `${slugify(name)}-${id}`).toString().trim();
  const numericId = typeof p.id === 'number' ? p.id : (p.id && /^\d+$/.test(String(p.id)) ? Number(p.id) : null);
  const productUrl = numericId != null ? `/product/${numericId}` : (catSlug ? `/product/${catSlug}/${productSlug}` : `/#product-${id}`);
  return {
    id,
    name,
    description: desc || undefined,
    imageSrc: img.startsWith('http') || img.startsWith('/') ? img : `https://via.placeholder.com/200?text=${encodeURIComponent(name)}`,
    price,
    category: category || undefined,
    tag: tag || undefined,
    productUrl,
  };
}

/** Find product by URL category + slug */
export function getProductByCategorySlug(categorySlug: string, productSlug: string): ProductItem | undefined {
  return valueOfDayProducts.find(
    (p) => slugify(p.category) === categorySlug && `${slugify(p.name)}-${p.id}` === productSlug
  );
}

function parseMoney(input: string) {
  const raw = (input ?? '').trim();
  const currencyMatch = raw.match(/^(AED|\$|€|£)\s*/i);
  const currency = currencyMatch?.[1]??'';
  const amount = raw
    .replace(/^(AED|\$|€|£)\s*/i, '')
    .replace(/[^\d.,]/g, '')
    .replace(/,/g, '');

  const [major = '', minor = ''] = amount.split('.');
  return {
    currency,
    major: major || amount || raw,
    minor: (minor || '').slice(0, 2),
    raw,
  };
}

function ValueOfDayCard({ product }: { product: DisplayProduct }) {
  const ribbonTag = product.tag?.trim();
  const imageSrc = product.imageSrc?.trim() || `https://via.placeholder.com/200?text=${encodeURIComponent(product.name)}`;

  return (
    <Link
      href={product.productUrl}
      className="group/card relative bg-white rounded-[16px] shadow-[0_4px_24px_rgba(0,0,0,0.08)] overflow-visible flex flex-col min-w-0 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-shadow"
    >
      {/* Ribbon – top right (NEW, SALE, HOT) */}
      {ribbonTag && (
        <div className="absolute top-0 right-0 overflow-hidden w-16 h-16 z-10">
          <div
            className="absolute top-2 right-[-32px] w-[80px] py-0.5 text-center text-[10px] font-bold text-white uppercase tracking-wide shadow-md"
            style={{ background: 'linear-gradient(90deg, #b91c1c 0%, #991b1b 100%)', transform: 'rotate(45deg)' }}
          >
            {ribbonTag}
          </div>
        </div>
      )}

      {/* Image (left) + title & description (right) */}
      <div className="flex flex-row items-center flex-1 min-h-[120px] p-4 sm:p-4 gap-3">
        <div className="relative w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] shrink-0 flex items-center justify-center rounded-2xl bg-gray-100 overflow-hidden">
          <Image
            src={imageSrc}
            alt={product.name}
            width={150}
            height={150}
            className="object-contain w-full h-full"
            unoptimized={imageSrc.startsWith('https://via.placeholder')}
          />
        </div>
        <div className="flex-1 min-w-0 py-2">
          <h3 className="text-[#282A4D] mb-1 font-bold text-base sm:text-lg leading-tight line-clamp-2">
            {product.name}
          </h3>
          {product.description ? (
            <div className="text-[#003a91] text-sm mt-1 line-clamp-2"><HtmlRenderer htmlString={product.description} /></div>
          ) : null}
        
        </div>
      </div>

      {/* MORE INFO button – gradient */}
      <div className="flex justify-center pb-4 pt-2">
        <GradientButton asSpan>MORE INFO</GradientButton>
      </div>
    </Link>
  );
}

const PARENT_SLUG_GPS = 'gps-tracker-accessories';

const staticDisplayProducts: DisplayProduct[] = valueOfDayProducts.map(toDisplayProduct);

export default function ValueOfDaySection() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [apiProducts, setApiProducts] = useState<DisplayProduct[]>([]);
  const gpsSubCategories = getGpsSubCategories();

  useEffect(() => {
    let cancelled = false;
    fetchProducts()
      .then((list) => {
        if (!cancelled) setApiProducts(list.map(apiProductToDisplay));
      })
      .catch(() => {
        if (!cancelled) setApiProducts([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const allProducts = useMemo(
    () => [...staticDisplayProducts, ...apiProducts],
    [apiProducts]
  );

  const toggleCategory = (key: string) => {
    setOpenCategory((prev) => (prev === key ? null : key));
  };

  return (
    <section className="bg-white min-h-[60vh]">
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {allProducts.map((product, idx) => (
                <ValueOfDayCard key={`${product.id}-${idx}`} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
