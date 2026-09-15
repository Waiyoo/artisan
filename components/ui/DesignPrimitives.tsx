// components/ui/DesignPrimitives.tsx
import React from "react";

export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif">{title}</h2>
        {subtitle && <p className="text-sm text-neutral-400 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function StatusBadge({ status }: { status: "PUBLISHED" | "DRAFT" | "FEATURED" | "TRENDING" | string }) {
  const styles: Record<string, string> = {
    PUBLISHED: "bg-emerald-950/80 text-emerald-400 border-emerald-800/60",
    DRAFT: "bg-neutral-900 text-neutral-400 border-neutral-800",
    FEATURED: "bg-amber-950/80 text-amber-400 border-amber-800/60",
    TRENDING: "bg-rose-950/80 text-rose-400 border-rose-800/60",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium tracking-wide uppercase border ${styles[status] || styles.DRAFT}`}>
      {status}
    </span>
  );
}

export function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" | "ghost" }) {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all text-sm rounded-lg px-4 py-2.5 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white shadow-md shadow-rose-950/20",
    secondary: "bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800",
    danger: "bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800/60",
    ghost: "bg-transparent hover:bg-neutral-900 text-neutral-300",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}