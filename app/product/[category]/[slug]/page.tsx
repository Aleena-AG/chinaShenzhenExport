'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { getProductByCategorySlug, getProductUrl, slugify as slugifyValue, valueOfDayProducts, type ProductItem } from '../../../components/ValueOfDaySection';
import { addToCart, addToList, isInList } from '../../../lib/cart';
import { getGpsProductBySlug, getGpsProductSlug, getGpsProductUrl, getGpsSubCategoryBySlug, type GpsProduct } from '../../../lib/gps-products';
import { getAccessoriesImageUrl, getAccessoriesImagesBySlug } from '../../../lib/accessories-images';

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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState<string | null>(null);

  if (!resolved) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Product not found</h1>
          <Link href="/" className="mt-4 inline-block text-[#1658a1] underline">Back to home</Link>
        </div>
      </div>
    );
  }

  const isGps = resolved.source === 'gps';
  const gpsProductData = isGps ? (resolved.product as import('../../../lib/gps-products').GpsProduct) : null;
  const productId = isGps ? String(resolved.product.id) : resolved.product.id;
  const productName = resolved.product.name;
  const productPrice = resolved.product.price;
  let productImageSrc = isGps ? gpsProductData!.image : (resolved.product as ProductItem).imageSrc;
  const productCategory = isGps ? resolved.categoryLabel : (resolved.product as ProductItem).category;

  // For GPS products with non-URL image (e.g. /wp-content/...), use accessories folder images
  let galleryImages: string[] = [];
  if (isGps && gpsProductData) {
    const rawImage = gpsProductData.image ?? '';
    const rawGallery = gpsProductData.gallery ?? [];
    if (rawImage.startsWith('http')) {
      galleryImages = rawGallery.length ? rawGallery : [rawImage];
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
  if (!isGps) {
    galleryImages = buildGalleryImages(resolved.product as ProductItem);
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
    ? (resolved.product as import('../../../lib/gps-products').GpsProduct).fullDescription ||
      (resolved.product as import('../../../lib/gps-products').GpsProduct).description ||
      ''
    : (resolved.product as ProductItem).description ||
      `${resolved.product.name} is a popular choice and enjoys a significant following with seasoned enthusiasts who enjoy quality products.`;

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

  const handleBuyNow = () => {
    addToCart({
      productId,
      name: productName,
      price: productPrice,
      imageSrc: productImageSrc?.startsWith('http') ? productImageSrc : `https://via.placeholder.com/200?text=Product`,
      quantity,
    });
    router.push('/cart?checkout=1');
  };

  const handleAddToList = () => {
    if (isInList(productId)) {
      showToast('Already in your list');
      return;
    }
    addToList({
      productId,
      name: productName,
      price: productPrice,
      imageSrc: productImageSrc?.startsWith('http') ? productImageSrc : `https://via.placeholder.com/200?text=Product`,
    });
    showToast('Added to list');
  };

  const price = parseMoney(productPrice);
  const original = !isGps && (resolved.product as ProductItem).originalPrice ? parseMoney((resolved.product as ProductItem).originalPrice!) : null;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-col gap-2 order-2 md:order-1 md:w-20 shrink-0">
                {galleryImages.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImageIndex(i)}
                    className={`relative w-full aspect-square rounded border-2 overflow-hidden bg-gray-100 ${
                      selectedImageIndex === i ? 'border-[#1658a1]' : 'border-gray-200'
                    }`}
                  >
                    <Image src={src?.startsWith('http') || src?.startsWith('/') ? src : `https://via.placeholder.com/80?text=${i + 1}`} alt={`${productName} ${i + 1}`} fill className="object-contain" sizes="80px" unoptimized={!(src?.startsWith('http') || src?.startsWith('/'))} />
                  </button>
                ))}
              </div>
              <div className="relative w-full aspect-square max-h-[480px] bg-white border border-gray-200 rounded-lg overflow-hidden order-1 md:order-2 flex-1">
                <Image
                  src={mainImageValid ? mainImage : `https://via.placeholder.com/400?text=${encodeURIComponent(productName)}`}
                  alt={productName}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  unoptimized={!mainImageValid}
                />
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-2">Click to see full view</p>
          </div>

          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">{productName}</h1>
            <p className="text-gray-600 text-sm mt-1">Brand: {productCategory}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-amber-500">★★★★☆</span>
              <span className="text-gray-500 text-sm">(8)</span>
              <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded">Our Choice</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2 flex-wrap">
              <span className="text-red-600 font-bold text-sm">-15%</span>
              <span className="text-2xl font-bold text-gray-900">
                {price.currency} {price.major}
                {price.minor ? `.${price.minor}` : ''}
              </span>
              {original && (
                <span className="text-gray-500 text-sm line-through">
                  Was: {original.currency} {original.major}
                  {original.minor ? `.${original.minor}` : ''}
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm mt-1">FREE Returns</p>
            <p className="text-gray-500 text-xs mt-0.5">All prices include VAT.</p>

            <div className="mt-4 p-4 border border-gray-200 rounded-lg">
              <p className="font-semibold text-gray-900">
                {price.currency} {price.major}
                {price.minor ? `.${price.minor}` : ''}
              </p>
              <p className="text-green-700 text-sm mt-1">FREE delivery Saturday, 31 January on your first order</p>
              <p className="text-green-700 text-sm mt-0.5">Fastest delivery Tomorrow, 30 January. Order within 7 hrs 48 mins</p>
              <p className="text-gray-500 text-sm mt-1">Deliver to Dubai, Al Barsha...</p>
            </div>

            <p className="text-green-700 font-semibold mt-4">In Stock</p>
            <div className="mt-2 flex items-center gap-2">
              <label htmlFor="qty" className="text-gray-700 text-sm">Quantity:</label>
              <select
                id="qty"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border border-gray-300 rounded px-3 py-1.5 text-sm"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-3 rounded-lg text-center font-semibold text-white bg-[#f7aa97] hover:bg-[#f3d2cb] transition-colors border-0"
              >
                Add to cart
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full py-3 rounded-lg text-center font-semibold text-white bg-[#1658a1] hover:bg-[#039bed] transition-colors border-0"
              >
                Buy Now
              </button>
              <button
                type="button"
                onClick={handleAddToList}
                className="w-full py-3 rounded-lg text-center font-semibold text-gray-800 bg-white border border-[#D3D6DB] hover:bg-gray-50 transition-colors"
              >
                Add to List
              </button>
            </div>
            {toast && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50">
                {toast}
              </div>
            )}

            <p className="mt-4 text-gray-600 text-sm">Fulfilled by Amazon</p>
            <p className="text-gray-600 text-sm">
              Sold by <a href="#" className="text-[#1658a1] hover:underline">Valisun-UAE</a>
            </p>
            <p className="text-gray-600 text-sm">
              <a href="#" className="text-[#1658a1] hover:underline">Payment Secure transaction</a>
            </p>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-gray-600">
              <div className="flex items-center gap-1.5"><span className="text-lg">💵</span> Cash on Delivery</div>
              <div className="flex items-center gap-1.5"><span className="text-lg">↩️</span> 15 days Returnable</div>
              <div className="flex items-center gap-1.5"><span className="text-lg">🚚</span> Free Delivery</div>
              <div className="flex items-center gap-1.5"><span className="text-lg">📦</span> Fulfilled by Amazon</div>
              <div className="flex items-center gap-1.5"><span className="text-lg">🔒</span> Secure transaction</div>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-4">
              <h2 className="font-bold text-gray-900 mb-2">Product details</h2>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>Brand {productCategory}</li>
                <li>Colour / Type {!isGps ? (resolved.product as ProductItem).wineType || productCategory : '—'}</li>
                <li>Item weight / AWG {!isGps ? (resolved.product as ProductItem).alcohol || '—' : '—'}</li>
                <li>Origin {!isGps ? (resolved.product as ProductItem).origin || 'China' : 'China'}</li>
              </ul>
              <p className="mt-3 text-sm text-gray-600">{description}</p>
            </div>
          </div>
        </div>

        {similarProducts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">Similar products</h2>
              <div className="similar-products-swiper-nav flex items-center gap-2">
                <button type="button" className="similar-swiper-prev flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-200 bg-white text-[#1658a1] shadow-sm transition hover:border-[#1658a1] hover:bg-[#1658a1] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#1658a1] focus:ring-offset-2" aria-label="Previous">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button type="button" className="similar-swiper-next flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-200 bg-white text-[#1658a1] shadow-sm transition hover:border-[#1658a1] hover:bg-[#1658a1] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#1658a1] focus:ring-offset-2" aria-label="Next">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={2}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
              }}
              navigation={{
                nextEl: '.similar-swiper-next',
                prevEl: '.similar-swiper-prev',
              }}
              pagination={{
                clickable: true,
                el: '.similar-swiper-pagination',
                bulletClass: 'similar-swiper-bullet',
                bulletActiveClass: 'similar-swiper-bullet-active',
              }}
              grabCursor
              loop={similarProducts.length >= 4}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 3, spaceBetween: 24 },
                1024: { slidesPerView: 4, spaceBetween: 24 },
              }}
              className="similar-products-swiper overflow-visible pb-14"
            >
              {similarProducts.map((item, idx) => (
                <SwiperSlide key={isGps ? (item as GpsProduct).id + '-' + idx : (item as ProductItem).id + '-' + idx} className="!h-auto">
                  {isGps ? (
                    <SimilarGpsCard
                      product={item as GpsProduct}
                      subSlug={categorySlug}
                      categoryLabel={productCategory}
                      imageIndex={gpsSub!.products.findIndex((p) => getGpsProductSlug(p) === getGpsProductSlug(item as GpsProduct))}
                    />
                  ) : (
                    <SimilarValueCard product={item as ProductItem} />
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="similar-swiper-pagination similar-products-swiper-pagination mt-4 flex justify-center gap-1.5" />
          </div>
        )}
      </div>
    </div>
  );
}

/** Same card as category page: default + hover overlay, click goes to product detail */
function SimilarGpsCard({ product, subSlug, categoryLabel, imageIndex }: { product: GpsProduct; subSlug: string; categoryLabel: string; imageIndex: number }) {
  const fromSubFolder = getAccessoriesImageUrl(subSlug, imageIndex);
  const imageSrc = product.image?.startsWith('http')
    ? product.image
    : fromSubFolder ?? `https://via.placeholder.com/300x200?text=${encodeURIComponent(product.name)}`;
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
        <Link
          href={getGpsProductUrl(subSlug, product)}
          className="mt-auto w-full max-w-[180px] mx-auto py-2.5 rounded-full border-0 text-white font-semibold text-sm uppercase tracking-wide transition-colors hover:opacity-95 flex items-center justify-center"
          style={{ background: 'linear-gradient(90deg,rgba(0, 58, 145, 1) 24%, rgba(156, 3, 3, 1) 100%)' }}
        >
          Buy Now
        </Link>
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
        <Link
          href={getProductUrl(product)}
          className="mt-auto w-full max-w-[180px] mx-auto py-2.5 rounded-full border-0 text-white font-semibold text-md uppercase tracking-wide transition-colors hover:opacity-95 flex items-center justify-center"
          style={{ background: 'linear-gradient(90deg,rgba(0, 58, 145, 1) 24%, rgba(156, 3, 3, 1) 100%)' }}
        >
          Buy Now
        </Link>
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
