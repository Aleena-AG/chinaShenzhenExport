'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaFacebookF, FaWhatsapp, FaPinterestP, FaLinkedinIn, FaInstagram, FaYoutube, FaRss } from 'react-icons/fa';

// Dragon fly animation – moves across full footer (right to left)
const dragonFlyStyles = `
  @keyframes dragonFly {
    0%   { left: 100%; transform: translate(0, -50%); }
    100% { left: 0; transform: translate(-100%, -50%); }
  }
  .animate-dragon-fly {
    animation: dragonFly 22s linear infinite;
  }
`;

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
    <footer className="w-full text-gray-700 bg-gray-50 relative overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: dragonFlyStyles }} />
      {/* Dragon – flies across full footer, no layout space */}
      <div
        className="hidden lg:block absolute top-107 pointer-events-none z-10 w-[200px] lg:w-[240px] xl:w-[280px] animate-dragon-fly"
        style={{ left: 0 }}
        aria-hidden
      >
        <Image
          src="https://res.cloudinary.com/dstnwi5iq/image/upload/v1770208002/Screenshot_2026-02-04_at_4.24.55_pm-removebg-preview_ngdwsq.png"
          alt=""
          width={280}
          height={280}
          className="h-auto w-full max-w-full object-contain"
        />
      </div>
      <NewsletterBar />
      <div className="w-full bg-white border-t border-gray-100 relative">
        <div className="container relative z-0 mx-auto px-4 sm:px-6 py-8 lg:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
            {/* Brand & Contact */}
            <div className="sm:col-span-2 lg:col-span-1 mt-[-40px]">
              <Link href="/" className="inline-block">
                <Image
                  src="https://res.cloudinary.com/dstnwi5iq/image/upload/v1770638918/ChatGPT_Image_Feb_9__2026__04_05_39_PM-removebg-preview_wluzqi.png"
                  alt="China Shenzhen Export"
                  width={200}
                  height={80}
                  className="h-auto w-[200px] object-contain block"
                />
              </Link>
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-gray-900 font-bold text-sm uppercase tracking-wider mb-2 text-[#1658a1]">Contact Info</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  NBQ Building Al Hamriya  Dubai, United Arab Emirates
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
        <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-center items-center text-center">
          <p className="text-gray-400 text-sm">Copyright © 2026 by China Shenzhen Export. All Rights Reserved.


</p>
        </div>
      </div>
    </footer>
  );
}
