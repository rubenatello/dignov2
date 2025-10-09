"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">About DGNO</h1>
          <p className="text-slate-700 leading-relaxed mb-4">
            DGNO stems from the word <strong>dignified</strong>. Meaning everyone is worthy of dignified, honest,
            pro–human rights and pro–democracy information designed to help them.
          </p>
          <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
            <li>Independent news source — pro democracy, calling out all sides.</li>
            <li>The Constitution and the law are our measuring sticks.</li>
            <li>Founder: Ruben Caz — data analyst and developer turned founder and editor of DGNO.</li>
          </ul>
          <p className="text-slate-700 mb-2">Founded in 2025.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
