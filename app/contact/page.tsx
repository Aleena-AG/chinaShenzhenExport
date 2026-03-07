'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaFacebookF, FaWhatsapp, FaInstagram, FaYoutube } from 'react-icons/fa';

const GRADIENT = 'linear-gradient(135deg, #003a91 0%, #9c0303 100%)';

const SOCIAL_LINKS = [
  { name: 'Facebook', href: 'https://www.facebook.com/ChinaShenzhenExport', Icon: FaFacebookF },
  { name: 'WhatsApp', href: 'https://wa.me/971561234567', Icon: FaWhatsapp },
  { name: 'Instagram', href: 'https://www.instagram.com/ChinaShenzhenExport', Icon: FaInstagram },
  { name: 'YouTube', href: 'https://www.youtube.com/ChinaShenzhenExport', Icon: FaYoutube },
];

const cardClassName =
  'flex items-start gap-4 p-6 rounded-2xl bg-white border-2 border-gray-100 hover:border-[#1658a1]/30 hover:shadow-lg transition-all duration-300';

function ContactCard({
  icon,
  title,
  content,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
  href?: string;
}) {
  const inner = (
    <>
      <span
        className="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-white"
        style={{ background: GRADIENT }}
      >
        {icon}
      </span>
      <div>
        <h3 className="font-bold text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm mt-1">{content}</p>
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`${cardClassName} cursor-pointer`}>
        {inner}
      </Link>
    );
  }
  return <div className={cardClassName}>{inner}</div>;
}

export default function ContactPage() {
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus('error');
        setErrorMessage(json?.message || json?.error || 'Something went wrong. Please try again.');
        return;
      }
      setStatus('sent');
      setFormState({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
      setErrorMessage('Unable to send. Please try again or email us directly.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero – background image */}
      <section
        className="relative py-20 sm:py-28 overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: "url('https://res.cloudinary.com/dstnwi5iq/image/upload/v1769668522/abstract-blurred-blue-purple-colorful-rays-moving-opposite-each-other.jpg_cemgvf.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/40 z-0" aria-hidden />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-2xl">
            <p className="text-white/90 text-sm font-medium uppercase tracking-wider mb-2">
              Get in Touch
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              Contact Us
            </h1>
            <p className="text-white/90 text-lg mt-4">
              We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact cards + form */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact info cards */}
            <div className="lg:col-span-1 space-y-6">
              <ContactCard
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
                title="Address"
                content="NBQ Building, Al Hamriya, Dubai, United Arab Emirates"
              />
              <ContactCard
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
                title="Email"
                content="info@chinashenzhenexport.com"
                href="mailto:info@chinashenzhenexport.com"
              />
              <ContactCard
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
                title="Phone / WhatsApp"
                content="+971 56 123 4567"
                href="https://wa.me/971561234567"
              />
              <div className="pt-4">
                <h3 className="font-bold text-gray-800 mb-3">Follow Us</h3>
                <div className="flex gap-3">
                  {SOCIAL_LINKS.map(({ name, href, Icon }) => (
                    <a
                      key={name}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-transform hover:scale-110"
                      style={{ background: GRADIENT }}
                      aria-label={name}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-2">
              <div
                className="p-8 sm:p-10 rounded-2xl border-2 border-gray-100 shadow-sm"
                style={{ background: 'linear-gradient(180deg, #fafbfc 0%, #ffffff 100%)' }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Send a Message</h2>
                <p className="text-gray-600 text-sm mb-8">
                  Fill out the form below and we&apos;ll get back to you within 24 hours.
                </p>

                {status === 'sent' && (
                  <div className="mb-6 p-4 rounded-xl bg-green-50 text-green-800 text-sm font-medium">
                    Thank you! Your message has been sent. We&apos;ll be in touch soon.
                  </div>
                )}
                {status === 'error' && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 text-sm">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#1658a1] focus:ring-2 focus:ring-[#1658a1]/20 outline-none transition-all"
                        placeholder="John Doe"
                        disabled={status === 'sending'}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#1658a1] focus:ring-2 focus:ring-[#1658a1]/20 outline-none transition-all"
                        placeholder="john@example.com"
                        disabled={status === 'sending'}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      required
                      value={formState.subject}
                      onChange={(e) => setFormState((s) => ({ ...s, subject: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#1658a1] focus:ring-2 focus:ring-[#1658a1]/20 outline-none transition-all"
                      placeholder="How can we help?"
                      disabled={status === 'sending'}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      value={formState.message}
                      onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#1658a1] focus:ring-2 focus:ring-[#1658a1]/20 outline-none transition-all resize-none"
                      placeholder="Tell us more about your inquiry..."
                      disabled={status === 'sending'}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full sm:w-auto px-10 py-3.5 rounded-xl font-semibold text-white transition-all disabled:opacity-70 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50"
                    style={{ background: GRADIENT }}
                  >
                    {status === 'sending' ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <p className="text-gray-600 text-sm">
            Browse our products?{' '}
            <Link href="/shop" className="text-[#1658a1] font-semibold hover:underline">
              Visit Shop
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
