// components/public/PublicNavbar.tsx
import Link from "next/link";
import { Sparkles, Compass, Shield } from "lucide-react";

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-extrabold tracking-wider uppercase font-serif bg-gradient-to-r from-emerald-200 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
            ndegwa investments 
          </span>
          <span className="text-[10px] tracking-widest uppercase bg-emerald-950 text-emerald-300 border border-emerald-800/50 px-2 py-0.5 rounded font-mono">
            Registry
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link href="/" className="hover:text-emerald-300 transition-colors flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-emerald-400" /> Discover investments
          </Link>
          <Link href="/about" className="hover:text-amber-300 transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-amber-300 transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-emerald-950/20 transition-all"
          >
            <Sparkles className="w-4 h-4 text-emerald-100" /> Explore wealth
          </Link>
          <Link
            href="/admin"
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 rounded-lg transition-colors"
            title="Admin Portal"
          >
            <Shield className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
