'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getProductByCategorySlug, type ProductItem } from '../../../../components/ValueOfDaySection';
import { getGpsProductBySlug, getGpsSubCategoryBySlug } from '../../../../lib/gps-products';
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

export default function OrderDevicePage() {
  const params = useParams();
  const categorySlug = typeof params.category === 'string' ? params.category : '';
  const productSlug = typeof params.slug === 'string' ? params.slug : '';
  const info = getProductInfo(categorySlug, productSlug);

  if (!info) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold text-gray-800">Product not found</h1>
          <Link href="/" className="mt-4 inline-block text-[#1658a1] underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <OrderForm
      productName={info.productName}
      productImage={info.productImage}
      productSlug={productSlug}
      categorySlug={categorySlug}
      variant="page"
     
    />
  );
}
