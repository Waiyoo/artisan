import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>(c) {new Date().getFullYear()} ndegwa investments . A home for independent wealth.</p>
        <nav aria-label="Footer navigation" className="flex gap-5 font-medium">
          <Link href="/" className="transition-colors hover:text-emerald-300">investments</Link>
          <Link href="/about" className="transition-colors hover:text-emerald-300">About</Link>
          <Link href="/contact" className="transition-colors hover:text-emerald-300">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
