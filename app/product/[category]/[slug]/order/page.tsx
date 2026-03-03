'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getProductByCategorySlug, type ProductItem } from '../../../../components/ValueOfDaySection';
import { getGpsProductBySlug, getGpsSubCategoryBySlug } from '../../../../lib/gps-products';
import { fetchProductById } from '../../../../lib/api';
import {
  getAccessoriesImageUrl,
  getAccessoriesImagesBySlug,
  getCableLugsDefaultImageUrl,
  getFuseAdapterImageUrl,
  getFuseImageUrl,
  getGpsTrackerImageUrl,
  getRelayHarnessDefaultImageUrl,
  getRfidSensorDefaultImageUrl,
  getTapeDefaultImageUrl,
  getTempDataLoggerDefaultImageUrl,
} from '../../../../lib/accessories-images';
import OrderForm from '../../../../components/orderForm';

function getProductIdFromSlug(productSlug: string): string | null {
  const parts = productSlug.split('-');
  const last = parts[parts.length - 1];
  return last && /^\d+$/.test(last) ? last : null;
}

function getProductInfo(categorySlug: string, productSlug: string) {
  const valueProduct = getProductByCategorySlug(categorySlug, productSlug);
  if (valueProduct) {
    const img = (valueProduct as ProductItem).imageSrc || (valueProduct as ProductItem).imageSrcHover;
    return {
      productName: valueProduct.name,
      productImage: (img as string)?.trim() || undefined,
    };
  }
  const gpsProduct = getGpsProductBySlug(categorySlug, productSlug);
  const gpsSub = gpsProduct ? getGpsSubCategoryBySlug(categorySlug) : null;
  if (!gpsProduct || !gpsSub) return null;
  const productName = gpsProduct.name;
  let productImage = gpsProduct.image?.startsWith('http') ? gpsProduct.image : undefined;
  if (!productImage) {
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
    if (byName) productImage = byName;
    else {
      const sub = getGpsSubCategoryBySlug(categorySlug);
      const productIndex = sub?.products.findIndex((p) => p.id === gpsProduct.id && p.name === gpsProduct.name) ?? 0;
      const fromAccessories = getAccessoriesImagesBySlug(categorySlug);
      productImage = fromAccessories.length
        ? (getAccessoriesImageUrl(categorySlug, productIndex) ?? fromAccessories[0])
        : undefined;
    }
  }
  return { productName, productImage };
}

function NotFound({ backHref = '/' }: { backHref?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center px-4">
        <h1 className="text-2xl font-bold text-gray-800">Product not found</h1>
        <Link href={backHref} className="mt-4 inline-block text-[#1658a1] underline">
          Back to {backHref === '/' ? 'home' : 'shop'}
        </Link>
      </div>
    </div>
  );
}

export default function OrderDevicePage() {
  const params = useParams();
  const categorySlug = typeof params.category === 'string' ? params.category : '';
  const productSlug = typeof params.slug === 'string' ? params.slug : '';
  const staticInfo = getProductInfo(categorySlug, productSlug);

  const [apiInfo, setApiInfo] = useState<{ productName: string; productImage?: string } | null>(null);
  const [apiLoading, setApiLoading] = useState(false);

  const productId = getProductIdFromSlug(productSlug);

  useEffect(() => {
    if (staticInfo || !productId) return;
    let cancelled = false;
    setApiLoading(true);
    fetchProductById(productId)
      .then((p) => {
        if (cancelled) return;
        if (p) {
          const name = (p.name ?? p.title ?? 'Product').toString().trim();
          const img = p.cover_image_url ?? (Array.isArray(p.image_urls) ? p.image_urls[0] : p.image_url ?? p.image);
          setApiInfo({ productName: name, productImage: typeof img === 'string' ? img : undefined });
        } else {
          setApiInfo(null);
        }
      })
      .catch(() => {
        if (!cancelled) setApiInfo(null);
      })
      .finally(() => {
        if (!cancelled) setApiLoading(false);
      });
    return () => { cancelled = true; };
  }, [productId, staticInfo]);

  const info = staticInfo ?? apiInfo;

  if (staticInfo) {
    return (
      <OrderForm
        productName={staticInfo.productName}
        productImage={staticInfo.productImage}
        productSlug={productSlug}
        categorySlug={categorySlug}
        variant="page"
      />
    );
  }

  if (apiLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500">Loading product…</p>
      </div>
    );
  }

  if (apiInfo) {
    return (
      <OrderForm
        productName={apiInfo.productName}
        productImage={apiInfo.productImage}
        productSlug={productSlug}
        categorySlug={categorySlug}
        variant="page"
      />
    );
  }

  return <NotFound backHref={productId ? '/shop' : '/'} />;
}
