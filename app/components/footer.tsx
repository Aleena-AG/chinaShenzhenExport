'use client';

import Image from 'next/image';

// ─── Newsletter bar ─────────────────────────────────────────────────────────
function NewsletterBar() {
  return (
    <div
        className="w-full py-6 sm:py-8 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://res.cloudinary.com/dstnwi5iq/image/upload/v1769668522/abstract-blurred-blue-purple-colorful-rays-moving-opposite-each-other.jpg_cemgvf.jpg')",
        }}
      >
      <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-start gap-3">
          <span className="shrink-0 text-white mt-0.5" aria-hidden>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </span>
          <div>
            <p className="text-white text-xl font-bold">Sign up to Newsletter</p>
            <p className="text-white text-md mt-0.5">...and receive $20 coupon for first shopping</p>
          </div>
        </div>
        <form className="flex w-full md:w-auto md:min-w-[520px]">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 min-w-0 px-4 py-3 rounded-l-lg bg-white border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#db1f26] focus:border-transparent"
            aria-label="Email for newsletter"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-r-lg bg-[#1658a1] text-white font-semibold text-sm hover:bg-[#1658a1] transition-colors shrink-0"
          >
            SignUp
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Link list block ───────────────────────────────────────────────────────
function LinkBlock({ title, links }: { title: string; links: { label: string; href?: string }[] }) {
  return (
    <div>
      <h3 className="text-white bg-gray font-bold-200 text-sm uppercase tracking-wide mb-4">{title}</h3>
      <ul className="space-y-2">
        {links.map(({ label, href }) => (
          <li key={label}>
            <a href={href ?? '#'} className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Social icons (simple circles + generic icons) ──────────────────────────
const SOCIAL_LINKS = [
  { name: 'Facebook', href: '#' },
  { name: 'WhatsApp', href: '#' },
  { name: 'Pinterest', href: '#' },
  { name: 'LinkedIn', href: '#' },
  { name: 'Instagram', href: '#' },
  { name: 'YouTube', href: '#' },
  { name: 'RSS', href: '#' },
];

function SocialIcons() {
  return (
    <div className="flex items-center gap-2 mt-4">
      {SOCIAL_LINKS.map(({ name, href }) => (
        <a
          key={name}
          href={href}
          className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 hover:text-gray-900 transition-colors"
          aria-label={name}
        >
          <span className="text-xs font-medium">{name.slice(0, 1)}</span>
        </a>
      ))}
    </div>
  );
}



// ─── Data ─────────────────────────────────────────────────────────────────
const FIND_IT_FAST = [
  'Laptops & Computers',
  'Cameras & Photography',
  'Smart Phones & Tablets',
  'Video Games & Consoles',
  'TV & Audio',
  'Gadgets',
  'Waterproof Headphones',
].map((label) => ({ label }));

const ABOUT_LINKS = ['About', 'Contact', 'Wishlist', 'Compare', 'FAQ', 'Store Directory'].map((label) => ({ label }));

const CUSTOMER_CARE = [
  'My Account',
  'Track your Order',
  'Customer Service',
  'Returns/Exchange',
  'FAQs',
  'Product Support',
].map((label) => ({ label }));

// ─── Main footer ───────────────────────────────────────────────────────────
export default function Footer() {
  return (
    <footer className="w-full text-gray-700">
      <NewsletterBar />
      <div className="w-full bg-white">
  <div className="container mx-auto px-4 sm:px-6 py-12 lg:py-14">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
      {/* Brand & Contact */}
      <div>
      
    <Image src="https://res.cloudinary.com/dstnwi5iq/image/upload/v1769430712/ece77608-1576-4cc6-9ba6-b8193cd4b90f-removebg-preview_1_c2qehx.png" alt="Logo" width={250} height={100} />
        
        <p className="text-gray-500 text-sm">Got Questions? Call us 24/7!</p>
        <div className="flex items-center gap-2 mt-3">
          <span className="shrink-0 text-[#db1f26]" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2a4 4 0 0 1 4 4v1.5a2.5 2.5 0 0 1-2 2.45V8a2 2 0 0 0-4 0v3.95a2.5 2.5 0 0 1-2-2.45V6a4 4 0 0 1 4-4Z" />
              <path d="M19 11v1a7 7 0 0 1-14 0v-1h2v1a5 5 0 0 0 10 0v-1h2Z" />
            </svg>
          </span>
          <span className="text-gray-900 font-semibold text-sm">(800) 8001-8588, (0600) 874 548</span>
        </div>
        <div className="mt-6">
          <h3 className="text-gray-900 font-bold text-sm uppercase tracking-wide mb-2">Contact Info</h3>
          <p className="text-gray-600 text-sm">
            17 Princess Road, London, Greater London NW1 8JR, UK
          </p>
        </div>
        <SocialIcons />
      </div>

      {/* Find It Fast */}
      <LinkBlock title="Find It Fast" links={FIND_IT_FAST} />
      
      {/* Customer Care */}
      <LinkBlock title="Customer Care" links={CUSTOMER_CARE} />
      
      {/* About */}
      <LinkBlock title="About" links={ABOUT_LINKS} />
    </div>
  </div>
</div>

      {/* Copyright & legal links – dark bar */}
      <div className="w-full  m-4 border-t border-[#2a2a2a]">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-gray-400 text-sm order-2 sm:order-1">© 2022 – 2026 ChinaShenzhenExport</p>
          <div className="order-1 sm:order-2 flex flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-gray-300 underline">Terms of use</a>
            <a href="#" className="text-gray-400 hover:text-gray-300 underline">Privacy policy</a>
            <span className="inline-flex items-center gap-1.5">
              <a href="#" className="text-gray-400 hover:text-gray-300 underline">Your privacy choices</a>
              <span className="inline-flex h-5 rounded-full overflow-hidden border border-gray-500" aria-hidden title="Privacy choices toggle">
                <span className="h-full w-5 flex items-center justify-center bg-blue-600">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </span>
                <span className="h-full w-5 flex items-center justify-center bg-gray-600">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </span>
              </span>
            </span>
            <a href="#" className="text-gray-400 hover:text-gray-300 underline">Ad Choices</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
