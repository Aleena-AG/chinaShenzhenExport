'use client';

// ─── Types ─────────────────────────────────────────────────────────────────
type ProductRow = {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
};

type OnSaleProduct = ProductRow & { rating: number };

// ─── Data ─────────────────────────────────────────────────────────────────
const FEATURED: ProductRow[] = [
  { id: 'f1', name: 'Tablet Thin EliteBook Revolve 810 G6', price: '$1,300.00' },
  { id: 'f2', name: 'Notebook Widescreen Z51-70 40K6013UPB', price: '$1,100.00' },
  { id: 'f3', name: 'Smartphone 6S 128GB LTE', price: '$750.00', originalPrice: '$780.00' },
];

const TOP_SELLING: ProductRow[] = [
  { id: 't1', name: 'Game Console Controller + USB 3.0 Cable', price: '$99.00' },
  { id: 't2', name: 'Universal Headphones Case in Black', price: '$159.00' },
  { id: 't3', name: 'Tablet Thin EliteBook Revolve 810 G6', price: '$1,300.00' },
];

const ON_SALE: OnSaleProduct[] = [
  { id: 's1', name: 'Ultrabook UX305CA-FC050T', price: '$1,200.00', originalPrice: '$1,218.00', rating: 4 },
  { id: 's2', name: 'Smartwatch 2.0 LTE Wifi Waterproof', price: '$700.00', originalPrice: '$725.00', rating: 4 },
  { id: 's3', name: 'Powerbank 1130 mAh Blue', price: '$200.00', originalPrice: '$210.00', rating: 4 },
];

// ─── Placeholder (no external image) ───────────────────────────────────────
function ProductImagePlaceholder() {
  return (
    <div
      className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded bg-gray-200 flex items-center justify-center"
      aria-hidden
    >
      <span className="text-gray-400 text-xs">Photo</span>
    </div>
  );
}

// ─── Shared product row (image left, name + price right) ───────────────────
function ProductRowItem({ item }: { item: ProductRow }) {
  return (
    <div className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
      <ProductImagePlaceholder />
      <div className="min-w-0 flex-1">
        <p className="text-gray-900 text-sm font-medium line-clamp-2">{item.name}</p>
        <div className="mt-1 flex items-center gap-2 flex-wrap">
          {item.originalPrice && (
            <span className="text-gray-400 text-xs line-through">{item.originalPrice}</span>
          )}
          <span className={`text-sm font-semibold ${item.originalPrice ? 'text-red-600' : 'text-gray-900'}`}>
            {item.price}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── On-sale row (same layout + star rating) ────────────────────────────────
function OnSaleRowItem({ item }: { item: OnSaleProduct }) {
  return (
    <div className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
      <ProductImagePlaceholder />
      <div className="min-w-0 flex-1">
        <p className="text-gray-900 text-sm font-medium line-clamp-2">{item.name}</p>
        <div className="mt-1 flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`text-sm ${i < item.rating ? 'text-[#db1f26]' : 'text-gray-200'}`}
              aria-hidden
            >
              ★
            </span>
          ))}
        </div>
        <div className="mt-1 flex items-center gap-2 flex-wrap">
          {item.originalPrice && (
            <span className="text-gray-400 text-xs line-through">{item.originalPrice}</span>
          )}
          <span className="text-sm font-semibold text-red-600">{item.price}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Column header (title + accent underline) ───────────────────────────────
function ColumnTitle({ title }: { title: string }) {
  return (
    <h2 className="text-gray-900 font-bold text-base pb-1 border-b-2 border-[#db1f26] w-fit mb-4">
      {title}
    </h2>
  );
}

// ─── Main section ──────────────────────────────────────────────────────────
export default function ProductSale() {
  return (
    <section className="w-full bg-white">
      <div className="container mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Featured Products */}
          <div className="min-w-0">
            <ColumnTitle title="Featured Products" />
            <div className="divide-y-0">
              {FEATURED.map((item) => (
                <ProductRowItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="min-w-0">
            <ColumnTitle title="Top Selling Products" />
            <div className="divide-y-0">
              {TOP_SELLING.map((item) => (
                <ProductRowItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* On-sale Products */}
          <div className="min-w-0">
            <ColumnTitle title="On-sale Products" />
            <div className="divide-y-0">
              {ON_SALE.map((item) => (
                <OnSaleRowItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Promo banner */}
          <div className="min-w-0 lg:flex lg:flex-col">
            <div className="flex-1 rounded-xl bg-gray-50 border border-gray-100 p-5 lg:p-6 flex flex-col justify-between min-h-[280px]">
              <div>
                <p className="text-gray-700 font-semibold text-lg">smartG3</p>
                <p className="text-gray-600 text-sm mt-0.5">Now with 4G</p>
                <p className="text-gray-900 font-bold text-xl mt-4">STARTING AT $129.99</p>
              </div>
              <div className="mt-6 aspect-[4/3] max-h-40 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-gray-400 text-sm">Banner image</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
