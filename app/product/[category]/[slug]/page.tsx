'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import ProductDetail, { type ProductDetailTabContent } from '../../../components/ProductDetail';
import GradientButton from '../../../components/GradientButton';
import { getProductByCategorySlug, getProductUrl, slugify as slugifyValue, valueOfDayProducts, type ProductItem } from '../../../components/ValueOfDaySection';
import { addToCart } from '../../../lib/cart';
import { fetchProductById, type ApiProductDetail, type ApiProductTab } from '../../../lib/api';
import { getGpsProductBySlug, getGpsProductSlug, getGpsProductUrl, getGpsSubCategoryBySlug, type GpsProduct } from '../../../lib/gps-products';
import { getAccessoriesImageUrl, getAccessoriesImagesBySlug, getCableLugsDefaultImageUrl, getFuseAdapterGalleryUrls, getFuseAdapterImageUrl, getFuseGalleryUrls, getFuseImageUrl, getGpsTrackerImageUrl, getRelayHarnessDefaultImageUrl, getRfidSensorDefaultImageUrl, getTapeDefaultImageUrl, getTempDataLoggerDefaultImageUrl } from '../../../lib/accessories-images';

const TAB_KEYS: (keyof ProductDetailTabContent)[] = [
  'features', 'spectrumGnss', 'hardwareSpecs', 'otherSpecs', 'downloads', 'demoVideo',
];

function htmlToNode(html: string) {
  return <div className="text-gray-700 prose prose-sm max-w-none prose-p:mb-2" dangerouslySetInnerHTML={{ __html: html }} />;
}

function buildApiTabContent(description: string, apiTabs: ApiProductTab[]): ProductDetailTabContent {
  const sorted = [...apiTabs].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const content: ProductDetailTabContent = {};
  if (sorted.length === 0 && description.trim()) {
    content.features = htmlToNode(description);
    return content;
  }
  sorted.forEach((tab, i) => {
    const key = TAB_KEYS[i] ?? 'otherSpecs';
    const node = <div><h3 className="text-base font-semibold text-[#282A4D] mb-2">{tab.tab_title}</h3>{htmlToNode(tab.content ?? '')}</div>;
    if (key === 'features' && description.trim()) {
      content.features = <>{htmlToNode(description)}<div className="mt-4">{node}</div></>;
    } else {
      (content as Record<string, React.ReactNode>)[key] = node;
    }
  });
  return content;
}

function parseMoney(input: string) {
  const raw = (input ?? '').trim();
  const currencyMatch = raw.match(/^(AED|\$|€|£)\s*/i);
  const currency = currencyMatch?.[1]?.toUpperCase() ?? '';
  const amount = raw
    .replace(/^(AED|\$|€|£)\s*/i, '')
    .replace(/[^\d.,]/g, '')
    .replace(/,/g, '');
  const [major = '', minor = ''] = amount.split('.');
  return { currency, major, minor: (minor || '').slice(0, 2) };
}

function buildGalleryImages(product: ProductItem): string[] {
  const sources = [product.imageSrc, product.imageSrcHover].filter(Boolean) as string[];
  if (sources.length === 0) return [];
  const out: string[] = [];
  for (let i = 0; i < 5; i++) out.push(sources[i % sources.length]);
  return out;
}

type ResolvedProduct =
  | { source: 'valueOfDay'; product: ProductItem }
  | { source: 'gps'; product: import('../../../lib/gps-products').GpsProduct; categoryLabel: string };

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const categorySlug = typeof params.category === 'string' ? params.category : '';
  const productSlug = typeof params.slug === 'string' ? params.slug : '';
  const valueProduct = getProductByCategorySlug(categorySlug, productSlug);
  const gpsProduct = getGpsProductBySlug(categorySlug, productSlug);
  const gpsSub = gpsProduct ? getGpsSubCategoryBySlug(categorySlug) : null;
  const resolved: ResolvedProduct | null = valueProduct
    ? { source: 'valueOfDay', product: valueProduct }
    : gpsProduct && gpsSub
      ? { source: 'gps', product: gpsProduct, categoryLabel: gpsSub.label }
      : null;

  const idFromSlug = productSlug ? (productSlug.match(/-(\d+)$/) ?? null)?.[1] : null;
  const [apiProduct, setApiProduct] = useState<ApiProductDetail | null | undefined>(undefined);
  const [apiLoading, setApiLoading] = useState(false);

  useEffect(() => {
    if (resolved || !idFromSlug) {
      setApiProduct(undefined);
      return;
    }
    let cancelled = false;
    setApiLoading(true);
    fetchProductById(idFromSlug)
      .then((p) => {
        if (!cancelled) setApiProduct(p ?? null);
      })
      .finally(() => {
        if (!cancelled) setApiLoading(false);
      });
    return () => { cancelled = true; };
  }, [resolved, idFromSlug]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState<string | null>(null);

  if (!resolved && !idFromSlug) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Product not found</h1>
          <Link href="/" className="mt-4 inline-block text-[#1658a1] underline">Back to home</Link>
        </div>
      </div>
    );
  }

  if (!resolved && idFromSlug) {
    if (apiLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">Loading product…</p>
        </div>
      );
    }
    if (apiProduct === null || apiProduct === undefined) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Product not found</h1>
            <Link href="/" className="mt-4 inline-block text-[#1658a1] underline">Back to home</Link>
          </div>
        </div>
      );
    }
    const p = apiProduct;
    const name = (p.name ?? p.title ?? 'Product').toString().trim();
    const imageUrls = Array.isArray(p.image_urls) && p.image_urls.length > 0 ? p.image_urls : p.image_url ? [p.image_url] : [];
    const coverValid = p.cover_image_url && (p.cover_image_url.startsWith('http') || p.cover_image_url.startsWith('/'));
    const mainImage = (coverValid ? p.cover_image_url! : null) ?? imageUrls[0] ?? p.image_url ?? '';
    const allImages = coverValid
      ? [p.cover_image_url!, ...imageUrls.filter((u) => u !== p.cover_image_url)]
      : imageUrls;
    const description = (p.description ?? p.short_description ?? '').toString().trim();
    const apiTabs: ApiProductTab[] = Array.isArray(p.tabs) ? p.tabs : [];
    const tabContent = buildApiTabContent(description, apiTabs);
    const sortedTabs = [...apiTabs].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    const dynamicTabs = sortedTabs.length > 0 ? sortedTabs.map((t) => ({ tab_title: t.tab_title ?? '', content: t.content ?? '' })) : undefined;
    const orderHref = `/product/${categorySlug}/${productSlug}/order`;
    return (
      <div className="min-h-screen bg-white">
        <ProductDetail
          productName={name}
          productId={idFromSlug ?? undefined}
          productPrice={p.price ? String(p.price) : undefined}
          categorySlug={categorySlug}
          productSlug={productSlug}
          mainImage={mainImage}
          thumbnailImages={allImages.length > 0 ? allImages : undefined}
          backHref="/"
          orderNowHref={orderHref}
          tabContent={tabContent}
          dynamicTabs={dynamicTabs}
          shortVideoUrl={p.short_video_url ?? null}
          videoUrl={p.video_url ?? null}
        />
      </div>
    );
  }

  const r = resolved!;
  const isGps = r.source === 'gps';
  const gpsProductData = isGps ? (r.product as import('../../../lib/gps-products').GpsProduct) : null;
  const productId = isGps ? String(r.product.id) : String(r.product.id);
  const productName = r.product.name;
  const productPrice = r.product.price;
  let productImageSrc = isGps ? gpsProductData!.image : (r.product as ProductItem).imageSrc;
  const productCategory = isGps ? (r as { categoryLabel: string }).categoryLabel : (r.product as ProductItem).category;

  // For GPS products with non-URL image (e.g. /wp-content/...), use name-matched or accessories folder images
  let galleryImages: string[] = [];
  if (isGps && gpsProductData) {
    const rawImage = gpsProductData.image ?? '';
    const rawGallery = gpsProductData.gallery ?? [];
    if (rawImage.startsWith('http')) {
      galleryImages = rawGallery.length ? rawGallery : [rawImage];
    } else {
      const byName =
        categorySlug === 'gps-trackers'
          ? getGpsTrackerImageUrl(productName)
          : categorySlug === 'fuse-adapters' || categorySlug === 'fuse-adapter'
            ? getFuseAdapterImageUrl(productName)
            : categorySlug === 'tapes' || categorySlug === 'tape'
              ? getTapeDefaultImageUrl(productName)
              : categorySlug === 'temp-data-logger' || categorySlug === 'temperature-data-logger'
                ? getTempDataLoggerDefaultImageUrl(productName)
                : categorySlug === 'rfid-reader' || categorySlug === 'rfid-sensor'
                  ? getRfidSensorDefaultImageUrl(productName)
                  : categorySlug === 'relay-harness'
                    ? getRelayHarnessDefaultImageUrl(productName)
                    : categorySlug === 'fuse' || categorySlug === 'fuses'
                      ? getFuseImageUrl(productName)
                      : categorySlug === 'cable-lugs'
                        ? getCableLugsDefaultImageUrl(productName)
                        : null;
      if (byName) {
        productImageSrc = byName;
        if (categorySlug === 'fuse-adapters' || categorySlug === 'fuse-adapter') {
          const fuseGallery = getFuseAdapterGalleryUrls(productName);
          galleryImages = fuseGallery.length ? fuseGallery : [byName];
        } else if (categorySlug === 'fuse' || categorySlug === 'fuses') {
          const fuseGallery = getFuseGalleryUrls(productName);
          galleryImages = fuseGallery.length ? fuseGallery : [byName];
        } else {
          galleryImages = [byName];
        }
      } else {
        const sub = getGpsSubCategoryBySlug(categorySlug);
        const productIndex = sub?.products.findIndex((p) => p.id === gpsProductData.id && p.name === gpsProductData.name) ?? 0;
        const fromAccessories = getAccessoriesImagesBySlug(categorySlug);
        if (fromAccessories.length) {
          productImageSrc = getAccessoriesImageUrl(categorySlug, productIndex) ?? fromAccessories[0];
          galleryImages = fromAccessories;
        } else {
          productImageSrc = `https://via.placeholder.com/400?text=${encodeURIComponent(productName)}`;
          galleryImages = [productImageSrc];
        }
      }
    }
  }
  if (!isGps) {
    galleryImages = buildGalleryImages(r.product as ProductItem);
  }

  const mainImage = galleryImages[selectedImageIndex] || productImageSrc;
  const mainImageValid = mainImage?.startsWith('http') || mainImage?.startsWith('/');

  // Similar products: same sub-category (GPS) or same category (valueOfDay), excluding current
  const similarProducts: (GpsProduct | ProductItem)[] = isGps && gpsSub
    ? gpsSub.products.filter((p) => getGpsProductSlug(p) !== productSlug).slice(0, 8)
    : valueOfDayProducts.filter(
        (p) => slugifyValue(p.category) === categorySlug && `${slugifyValue(p.name)}-${p.id}` !== productSlug
      ).slice(0, 8);

  const description = isGps
    ? (r.product as import('../../../lib/gps-products').GpsProduct).fullDescription ||
      (r.product as import('../../../lib/gps-products').GpsProduct).description ||
      ''
    : (r.product as ProductItem).description ||
      `${r.product.name} is a popular choice and enjoys a significant following with seasoned enthusiasts who enjoy quality products.`;

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const handleAddToCart = () => {
    addToCart({
      productId,
      name: productName,
      price: productPrice,
      imageSrc: productImageSrc?.startsWith('http') ? productImageSrc : `https://via.placeholder.com/200?text=Product`,
      quantity,
    });
    showToast('Added to cart');
  };



const valueProductItem = !isGps ? (r.product as ProductItem) : null;
  const specs = isGps && gpsProductData ? (gpsProductData.specs as Record<string, string> | undefined) : undefined;

  const tabContent: ProductDetailTabContent = {
    features: (
      <>
        <p className="mb-4">{description}</p>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li>Dual-lens Recording with 2K Lens</li>
          <li>Driver Monitoring System (DMS)</li>
          <li>High-quality build and reliable performance</li>
        </ul>
      </>
    ),
    spectrumGnss: specs?.gnss || specs?.spectrum ? (
      <ul className="space-y-2 text-sm">
        {specs.gnss && <li><strong>GNSS:</strong> {specs.gnss}</li>}
        {specs.spectrum && <li><strong>Spectrum:</strong> {specs.spectrum}</li>}
      </ul>
    ) : (
      <p className="text-sm">Spectrum and GNSS details can be provided on request.</p>
    ),
    hardwareSpecs: (
      <ul className="space-y-2 text-sm">
        <li><strong>Brand:</strong> {productCategory}</li>
        <li><strong>Type:</strong> {valueProductItem?.wineType || productCategory}</li>
        <li><strong>AWG / Rating:</strong> {valueProductItem?.alcohol || specs?.rating || specs?.awg || '—'}</li>
        {specs && Object.entries(specs).filter(([k]) => !['gnss', 'spectrum', 'origin', 'type', 'rating', 'awg'].includes(k)).map(([key, val]) => (
          <li key={key}><strong>{key}:</strong> {String(val)}</li>
        ))}
      </ul>
    ),
    otherSpecs: (
      <ul className="space-y-2 text-sm">
        <li><strong>Origin:</strong> {valueProductItem?.origin || specs?.origin || 'China'}</li>
        <li><strong>Colour / Type:</strong> {valueProductItem?.wineType || productCategory}</li>
        <li><strong>Item weight / AWG:</strong> {valueProductItem?.alcohol || '—'}</li>
      </ul>
    ),
    downloads: (
      <ul className="space-y-2 text-sm">
        <li><a href="#" className="text-[#1658a1] hover:underline">Product datasheet (PDF)</a></li>
        <li><a href="#" className="text-[#1658a1] hover:underline">User manual (PDF)</a></li>
      </ul>
    ),
    demoVideo: (
      <div className="aspect-video max-w-lg bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm">
        Demo video placeholder — link or embed can be added here.
      </div>
    ),
  };

  const orderPageHref = `/product/${categorySlug}/${productSlug}/order`;

  return (
    <div className="min-h-screen bg-white">
      <ProductDetail
        productName={productName}
        productId={productId}
        productPrice={productPrice}
        categorySlug={categorySlug}
        productSlug={productSlug}
        mainImage={galleryImages[0] || productImageSrc}
        thumbnailImages={galleryImages}
        backHref="/"
        orderNowHref={orderPageHref}
        tabContent={tabContent}
      />

   
    </div>
  );
}

/** Same card as category page: default + hover overlay, click goes to product detail */
function SimilarGpsCard({ product, subSlug, categoryLabel, imageIndex }: { product: GpsProduct; subSlug: string; categoryLabel: string; imageIndex: number }) {
  const byName =
    subSlug === 'gps-trackers'
      ? getGpsTrackerImageUrl(product.name)
      : subSlug === 'fuse-adapters' || subSlug === 'fuse-adapter'
        ? getFuseAdapterImageUrl(product.name)
        : subSlug === 'tapes' || subSlug === 'tape'
          ? getTapeDefaultImageUrl(product.name)
          : subSlug === 'temp-data-logger' || subSlug === 'temperature-data-logger'
            ? getTempDataLoggerDefaultImageUrl(product.name)
            : subSlug === 'rfid-reader' || subSlug === 'rfid-sensor'
              ? getRfidSensorDefaultImageUrl(product.name)
              : subSlug === 'relay-harness'
                ? getRelayHarnessDefaultImageUrl(product.name)
                : subSlug === 'fuse' || subSlug === 'fuses'
                  ? getFuseImageUrl(product.name)
                  : subSlug === 'cable-lugs'
                    ? getCableLugsDefaultImageUrl(product.name)
                    : null;
  const fromSubFolder = getAccessoriesImageUrl(subSlug, imageIndex);
  const imageSrc = product.image?.startsWith('http')
    ? product.image
    : byName ?? fromSubFolder ?? `https://via.placeholder.com/300x200?text=${encodeURIComponent(product.name)}`;
  const price = product.price || '$0.00';
  const description =
    product.fullDescription ||
    product.description ||
    `${product.name} is a popular choice and enjoys a significant following with seasoned enthusiasts who enjoy quality products.`;
  const specs = product.specs as Record<string, string> | undefined;

  return (
    <div className="group/card relative bg-white rounded-xl border-2 border-gray-200 overflow-visible flex flex-col py-6 px-5 text-center min-h-[340px]">
      <div className="overflow-hidden rounded-xl flex flex-col flex-1 min-h-0">
        <h3 className="text-[#555] font-semibold text-base sm:text-lg tracking-wide">{product.name}</h3>
        <p className="text-[#999] text-xs sm:text-sm uppercase tracking-wide mt-1">{categoryLabel}</p>
        <div className="relative w-full flex-1 min-h-[180px] flex items-center justify-center my-6">
          <Image
            src={imageSrc}
            alt={product.name}
            width={400}
            height={220}
            className="object-contain w-full max-h-48"
            unoptimized={imageSrc.startsWith('https://via.placeholder')}
          />
        </div>
        <p className="text-[#555] font-semibold text-lg sm:text-xl mb-2">{price}</p>
        <GradientButton
          href={getGpsProductUrl(subSlug, product)}
          variant="primary"
          size="lg"
          className="mt-auto w-full max-w-[180px] mx-auto"
        >
          Buy Now
        </GradientButton>
      </div>
      <Link
        href={getGpsProductUrl(subSlug, product)}
        className="absolute inset-0 flex flex-col opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-10 bg-gray-100 rounded-xl py-0 overflow-visible pointer-events-none group-hover/card:pointer-events-auto"
      >
        <div className="w-full flex items-end justify-center min-h-[140px] sm:min-h-[160px] pt-0 pb-2 -mt-[40px] shrink-0 relative">
          <Image
            src={imageSrc}
            alt={product.name}
            width={320}
            height={400}
            className="object-contain max-h-44 sm:max-h-52 w-auto drop-shadow-lg -translate-y-2"
            unoptimized={imageSrc.startsWith('https://via.placeholder')}
          />
        </div>
        <div className="flex-1 flex flex-col py-4 px-4 text-center overflow-hidden">
          <h3 className="text-[#555] font-semibold text-lg tracking-wide">{product.name}</h3>
          <p className="text-[#999] text-xs uppercase tracking-wide mt-0.5">{categoryLabel}</p>
          <p className="text-[#555] font-semibold text-base mt-2">{price}</p>
          <p className="text-[#888] text-xs leading-snug mt-2 line-clamp-3">{description}</p>
          <div className="mt-3 rounded-lg border border-[#e5e5e5] bg-white/60 py-2.5 px-3 text-left">
            <div className="flex justify-between text-xs">
              <span className="text-[#999]">Origin</span>
              <span className="text-[#555] font-medium">{specs?.origin ?? 'China'}</span>
            </div>
            <div className="flex justify-between text-xs mt-1.5">
              <span className="text-[#999]">Type</span>
              <span className="text-[#555] font-medium">{specs?.type ?? categoryLabel}</span>
            </div>
            <div className="flex justify-between text-xs mt-1.5">
              <span className="text-[#999]">Spec</span>
              <span className="text-[#555] font-medium">{specs?.rating ?? specs?.awg ?? '—'}</span>
            </div>
          </div>
          <span className="mt-4 w-full py-2.5 rounded-lg border border-[#1658a1] bg-[#dae3ef] text-[#1658a1] font-medium text-sm uppercase tracking-wide text-center block">
            Buy Now
          </span>
        </div>
      </Link>
    </div>
  );
}

/** Same card as home page: default + hover overlay, click goes to product detail */
function SimilarValueCard({ product }: { product: ProductItem }) {
  const price = parseMoney(product.price);
  const original = product.originalPrice ? parseMoney(product.originalPrice) : null;
  const displayImage = (product.imageSrcHover?.trim() || product.imageSrc?.trim()) as string;
  const description =
    product.description ||
    `${product.name} is a popular choice and enjoys a significant following with seasoned enthusiasts who enjoy quality products.`;

  return (
    <div className="group/card relative bg-white rounded-xl border-2 border-gray-200 overflow-visible flex flex-col py-6 px-5 text-center min-h-[340px]">
      <div className="overflow-hidden rounded-xl flex flex-col flex-1 min-h-0">
        <h3 className="text-[#555] font-semibold text-base sm:text-lg tracking-wide">{product.name}</h3>
        <p className="text-[#999] text-xs sm:text-sm uppercase tracking-wide mt-1">{product.category}</p>
        <div className="relative w-full flex-1 min-h-[180px] flex items-center justify-center my-6">
          {product.imageSrc ? (
            <Image
              src={(product.imageSrc as string).trim()}
              alt={product.name}
              width={400}
              height={220}
              className="object-contain w-full max-h-48"
            />
          ) : (
            <span className="text-gray-300 text-xs">Add image</span>
          )}
        </div>
        <div className="flex flex-col items-center gap-0.5">
          {original && (
            <span className="text-[#999] text-sm line-through">
              {(original.currency || price.currency || 'AED')} {original.major}
              {original.minor ? `.${original.minor}` : ''}
            </span>
          )}
          <p className="text-[#555] font-semibold text-lg sm:text-xl mb-2">
            {price.currency || 'AED'} {price.major}
            {price.minor ? <span className="text-base">.{price.minor}</span> : ''}
          </p>
        </div>
        <GradientButton
          href={getProductUrl(product)}
          variant="primary"
          size="lg"
          className="mt-auto w-full max-w-[180px] mx-auto"
        >
          Buy Now
        </GradientButton>
      </div>
      <Link
        href={getProductUrl(product)}
        className="absolute inset-0 flex flex-col opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-10 bg-gray-100 rounded-xl py-0 overflow-visible pointer-events-none group-hover/card:pointer-events-auto"
      >
        <div className="w-full flex items-end justify-center min-h-[140px] sm:min-h-[160px] pt-0 pb-2 -mt-[40px] shrink-0 relative">
          {displayImage && (
            <Image
              src={displayImage}
              alt={product.name}
              width={320}
              height={400}
              className="object-contain max-h-44 sm:max-h-52 w-auto drop-shadow-lg -translate-y-2"
            />
          )}
        </div>
        <div className="flex-1 flex flex-col py-4 px-4 text-center overflow-hidden">
          <h3 className="text-[#555] font-semibold text-lg tracking-wide">{product.name}</h3>
          <p className="text-[#999] text-xs uppercase tracking-wide mt-0.5">{product.category}</p>
          <p className="text-[#555] font-semibold text-base mt-2">
            {price.currency || 'AED'} {price.major}
            {price.minor ? `.${price.minor}` : ''}
          </p>
          <p className="text-[#888] text-xs leading-snug mt-2 line-clamp-3">{description}</p>
          <div className="mt-3 rounded-lg border border-[#e5e5e5] bg-white/60 py-2.5 px-3 text-left">
            <div className="flex justify-between text-xs">
              <span className="text-[#999]">Origin</span>
              <span className="text-[#555] font-medium">{product.origin || 'China'}</span>
            </div>
            <div className="flex justify-between text-xs mt-1.5">
              <span className="text-[#999]">Type</span>
              <span className="text-[#555] font-medium">{product.wineType || product.category || ''}</span>
            </div>
            <div className="flex justify-between text-xs mt-1.5">
              <span className="text-[#999]">AWG Rating:</span>
              <span className="text-[#555] font-medium">{product.alcohol || '18w'}</span>
            </div>
          </div>
          <span className="mt-4 w-full py-2.5 rounded-lg border border-[#1658a1] bg-[#dae3ef] text-[#1658a1] font-medium text-sm uppercase tracking-wide text-center block">
            Buy Now
          </span>
        </div>
      </Link>
    </div>
  );
}
