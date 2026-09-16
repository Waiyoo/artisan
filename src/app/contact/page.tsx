import { PublicFooter } from '@/components/public/PublicFooter';
import { PublicNavbar } from '@/components/public/PublicNavbar';
import { getSiteSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const email = settings.defaultEmail || 'contact@daytonrich.com';
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <PublicNavbar />
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">Contact</p>
        <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Let's start a conversation.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-300">For general platform enquiries, partnerships, and investment representation, contact our team directly.</p>
        <a href={`mailto:${email}`} className="mt-8 inline-flex rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-emerald-500">Email {email}</a>
        {settings.defaultWebsite && <p className="mt-5 text-sm text-slate-400">Website: <a className="text-emerald-300 underline hover:text-emerald-200" href={settings.defaultWebsite}>{settings.defaultWebsite}</a></p>}
      </section>
      <PublicFooter />
    </main>
  );
}
