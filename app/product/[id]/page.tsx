'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { valueOfDayProducts, type ProductItem } from '../../components/ValueOfDaySection';
import { addToCart, addToList, isInList } from '../../lib/cart';

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

function getProductById(id: string): ProductItem | undefined {
  return valueOfDayProducts.find((p) => p.id === id);
}

function buildGalleryImages(product: ProductItem): string[] {
  const sources = [product.imageSrc, product.imageSrcHover].filter(Boolean) as string[];
  if (sources.length === 0) return [];
  const out: string[] = [];
  for (let i = 0; i < 5; i++) out.push(sources[i % sources.length]);
  return out;
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : '';
  const product = getProductById(id);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState<string | null>(null);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Product not found</h1>
          <Link href="/" className="mt-4 inline-block text-[#1658a1] underline">Back to home</Link>
        </div>
      </div>
    );
  }

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageSrc: product.imageSrc,
      quantity,
    });
    showToast('Added to cart');
  };

  const handleBuyNow = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageSrc: product.imageSrc,
      quantity,
    });
    router.push('/cart?checkout=1');
  };

  const handleAddToList = () => {
    if (isInList(product.id)) {
      showToast('Already in your list');
      return;
    }
    addToList({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageSrc: product.imageSrc,
    });
    showToast('Added to list');
  };

  const price = parseMoney(product.price);
  const original = product.originalPrice ? parseMoney(product.originalPrice) : null;
  const galleryImages = buildGalleryImages(product);
  const mainImage = galleryImages[selectedImageIndex] || product.imageSrc;
  const description =
    product.description ||
    `${product.name} is a popular choice and enjoys a significant following with seasoned enthusiasts who enjoy quality products.`;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Image gallery – main + 4–5 thumbnails */}
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
                  <Image src={src} alt={`${product.name} ${i + 1}`} fill className="object-contain" sizes="80px" />
                </button>
              ))}
              </div>
              <div className="relative w-full aspect-square max-h-[480px] bg-white border border-gray-200 rounded-lg overflow-hidden order-1 md:order-2 flex-1">
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-2">Click to see full view</p>
          </div>

          {/* Right: Product details, price, delivery, actions */}
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">{product.name}</h1>
            <p className="text-gray-600 text-sm mt-1">Brand: {product.category}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-amber-500">★★★★☆</span>
              <span className="text-gray-500 text-sm">(8)</span>
              <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded">Our Choice</span>
            </div>

            {/* Deal & price */}
            {/* <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded">
              <span className="text-red-600 font-semibold text-sm">Our Deal</span>
            </div> */}
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

            {/* Delivery */}
            <div className="mt-4 p-4 border border-gray-200 rounded-lg">
              <p className="font-semibold text-gray-900">
                {price.currency} {price.major}
                {price.minor ? `.${price.minor}` : ''}
              </p>
              <p className="text-green-700 text-sm mt-1">FREE delivery Saturday, 31 January on your first order</p>
              <p className="text-green-700 text-sm mt-0.5">Fastest delivery Tomorrow, 30 January. Order within 7 hrs 48 mins</p>
              <p className="text-gray-500 text-sm mt-1">Deliver to Dubai, Al Barsha...</p>
            </div>

            {/* Stock & quantity */}
            <p className="text-green-700 font-semibold mt-4">In Stock</p>
            <div className="mt-2 flex items-center gap-2">
              <label htmlFor="qty" className="text-gray-700 text-sm">
                Quantity:
              </label>
              <select
                id="qty"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border border-gray-300 rounded px-3 py-1.5 text-sm"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {/* Action buttons – Add to cart (yellow), Buy Now (orange), Add to List */}
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-3 rounded-lg text-center font-semibold text-gray-900 bg-[#FDD835] hover:bg-[#f7ca00] transition-colors border-0"
              >
                Add to cart
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full py-3 rounded-lg text-center font-semibold text-white bg-[#FB8C00] hover:bg-[#e88b00] transition-colors border-0"
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

            {/* Seller */}
            <p className="mt-4 text-gray-600 text-sm">Fulfilled by Amazon</p>
            <p className="text-gray-600 text-sm">
              Sold by <a href="#" className="text-[#1658a1] hover:underline">Valisun-UAE</a>
            </p>
            <p className="text-gray-600 text-sm">
              <a href="#" className="text-[#1658a1] hover:underline">Payment Secure transaction</a>
            </p>

            {/* Service icons */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-gray-600">
              <div className="flex items-center gap-1.5">
                <span className="text-lg">💵</span> Cash on Delivery
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg">↩️</span> 15 days Returnable
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg">🚚</span> Free Delivery
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg">📦</span> Fulfilled by Amazon
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg">🔒</span> Secure transaction
              </div>
            </div>

            {/* Product specs */}
            <div className="mt-6 border-t border-gray-200 pt-4">
              <h2 className="font-bold text-gray-900 mb-2">Product details</h2>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>Brand {product.category}</li>
                <li>Colour / Type {product.wineType || product.category || '—'}</li>
                <li>Item weight / AWG {product.alcohol || '—'}</li>
                <li>Origin {product.origin || 'China'}</li>
              </ul>
              <p className="mt-3 text-sm text-gray-600">{description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
