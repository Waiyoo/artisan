import type { Metadata } from 'next';
import './globals.css';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export const metadata: Metadata = {
  title: 'ndegwa investments  Platform',
  description: 'Institutional investment Directory and Management Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "try { var theme = localStorage.getItem('ndegwa-theme'); if (theme === 'light') { document.documentElement.classList.remove('dark'); document.documentElement.classList.add('light'); } } catch (e) {}" }} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <div className="fixed bottom-5 right-5 z-[60]">
          <ThemeToggle />
        </div>
      </body>
    </html>
  );
}
