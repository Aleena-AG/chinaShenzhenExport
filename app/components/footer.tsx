'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaFacebookF, FaWhatsapp, FaPinterestP, FaLinkedinIn, FaInstagram, FaYoutube, FaRss } from 'react-icons/fa';

// ─── Newsletter bar ─────────────────────────────────────────────────────────
function NewsletterBar() {
  return (
    <div
      className="relative w-full py-8 sm:py-10 bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        backgroundImage: "url('https://res.cloudinary.com/dstnwi5iq/image/upload/v1769668522/abstract-blurred-blue-purple-colorful-rays-moving-opposite-each-other.jpg_cemgvf.jpg')",
      }}
    >
      <div className="absolute inset-0 " aria-hidden />
      <div className="container relative mx-auto px-4 sm:px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div className="flex items-start gap-4">
          <span className="shrink-0 w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white" aria-hidden>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </span>
          <div>
            <h3 className="text-white text-xl sm:text-2xl font-bold tracking-tight">Sign up to Newsletter</h3>
            <p className="text-white/90 text-sm sm:text-base mt-1">Get exclusive offers and a $20 coupon on your first order.</p>
          </div>
        </div>
        <form className="flex w-full md:w-auto md:min-w-[380px] shadow-lg rounded-xl overflow-hidden">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 min-w-0 px-4 py-3.5 bg-white/95 border-0 text-gray-900 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Email for newsletter"
          />
          <button
            type="submit"
            className="px-6 py-3.5 bg-[#1658a1] text-white font-semibold text-sm hover:bg-[#124a85] transition-colors shrink-0"
          >
            Sign Up
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
      <h3 className="text-gray-900 font-bold text-sm uppercase tracking-wider mb-5 text-[#1658a1]">{title}</h3>
      <ul className="space-y-3">
        {links.map(({ label, href }) => (
          <li key={label}>
            <a href={href ?? '#'} className="text-gray-600 hover:text-[#1658a1] text-sm transition-colors">
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
  { name: 'Facebook', href: 'https://www.facebook.com/ChinaShenzhenExport', Icon: FaFacebookF },
  { name: 'WhatsApp', href: 'https://wa.me/971561234567', Icon: FaWhatsapp },
  { name: 'Instagram', href: 'https://www.instagram.com/ChinaShenzhenExport', Icon: FaInstagram },
  { name: 'YouTube', href: 'https://www.youtube.com/ChinaShenzhenExport', Icon: FaYoutube },
 
];

function SocialIcons() {
  return (
    <div className="flex items-center gap-2 mt-6 flex-wrap">
      {SOCIAL_LINKS.map(({ name, href, Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#1658a1] hover:text-white transition-colors"
          aria-label={name}
        >
          <Icon className="w-4 h-4" />
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
    <footer className="w-full text-gray-700 bg-gray-50">
      <NewsletterBar />
      <div className="w-full bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 py-8 lg:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
            {/* Brand & Contact */}
            <div className="sm:col-span-2 lg:col-span-1 mt-[-40px]">
              <Link href="/" className="inline-block">
                <Image
                  src="https://res.cloudinary.com/dstnwi5iq/image/upload/v1769773702/161d8737-4a02-4882-8ddd-5363a1b95eb8-removebg-preview_4_uzklux.png"
                  alt="China Shenzhen Export"
                  width={200}
                  height={80}
                  className="h-auto w-[200px] object-contain block"
                />
              </Link>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h3 className="text-gray-900 font-bold text-sm uppercase tracking-wider mb-2 text-[#1658a1]">Contact Info</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  17 Princess Road, London, Greater London NW1 8JR, UK
                </p>
              </div>
              <SocialIcons />
            </div>

            <LinkBlock title="Find It Fast" links={FIND_IT_FAST} />
            <LinkBlock title="Customer Care" links={CUSTOMER_CARE} />
            <LinkBlock title="About" links={ABOUT_LINKS} />
          </div>
        </div>
      </div>

      {/* Copyright & legal links – dark bar */}
      <div className="w-full bg-[#212121] border-t border-[#2a2a2a]">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-gray-400 text-sm order-2 sm:order-1">© 2022 – 2026 ChinaShenzhenExport</p>
          <div className="order-1 sm:order-2 flex flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors underline underline-offset-2">Terms of use</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors underline underline-offset-2">Privacy policy</a>
            <span className="inline-flex items-center gap-1.5">
              <a href="#" className="text-gray-400 hover:text-white transition-colors underline underline-offset-2">Your privacy choices</a>
              <span className="inline-flex h-5 rounded-full overflow-hidden border border-gray-500" aria-hidden title="Privacy choices toggle">
                <span className="h-full w-5 flex items-center justify-center bg-blue-600">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </span>
                <span className="h-full w-5 flex items-center justify-center bg-gray-600">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </span>
              </span>
            </span>
            <a href="#" className="text-gray-400 hover:text-white transition-colors underline underline-offset-2">Ad Choices</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
