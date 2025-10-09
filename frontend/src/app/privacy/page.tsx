"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-slate-700 mb-4">
            Your privacy matters to us. This policy explains what we collect, why we collect it, and how we handle your data.
          </p>
          <h2 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Information We Collect</h2>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li>Account data (name, email) when you sign up or subscribe</li>
            <li>Usage data (pages viewed, interactions) to improve our site</li>
            <li>Technical data (IP address, browser) for security and analytics</li>
          </ul>
          <h2 className="text-xl font-semibold text-slate-900 mt-6 mb-2">How We Use Information</h2>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li>Operate and improve our services and content</li>
            <li>Send important updates and newsletters when you opt in</li>
            <li>Prevent abuse and ensure platform security</li>
          </ul>
          <h2 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Data Sharing</h2>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li>We do not sell personal data.</li>
            <li>We may share with service providers (e.g., analytics, email) under strict agreements.</li>
            <li>We may disclose if required by law or to protect our rights and users.</li>
          </ul>
          <h2 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Cookies and Tracking</h2>
          <p className="text-slate-700">
            We use cookies and similar technologies for essential site functions and analytics. You can control cookies through your browser settings.
          </p>
          <h2 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Your Choices</h2>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li>Access, update, or delete your account data</li>
            <li>Opt out of non-essential email communications</li>
            <li>Manage cookies and tracking preferences</li>
          </ul>
          <h2 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Contact</h2>
          <p className="text-slate-700">
            Questions or requests? Contact us at privacy@digno.news
          </p>
          <p className="text-slate-500 text-xs mt-8">
            Effective date: October 9, 2025. We may update this policy to reflect changes in practices or for legal reasons. We will notify users of material updates as appropriate.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
