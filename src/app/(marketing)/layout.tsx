import Link from "next/link";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Navbar */}
      <nav className="border-b-2 border-[var(--border)] bg-[var(--background)] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)] border-2 border-[var(--border)] shadow-[var(--shadow-brutalist-sm)] flex items-center justify-center">
              <span className="text-[var(--primary-foreground)] font-extrabold text-lg">U</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight">UniLife 360</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/features" className="text-sm font-bold hover:underline hidden md:block">
              Fonctionnalités
            </Link>
            <Link
              href="/login"
              className="h-10 px-5 inline-flex items-center justify-center font-bold text-sm border-2 border-[var(--border)] rounded-xl shadow-[var(--shadow-brutalist-sm)] bg-[var(--card)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="h-10 px-5 inline-flex items-center justify-center font-bold text-sm border-2 border-[var(--border)] rounded-xl shadow-[var(--shadow-brutalist-sm)] bg-[var(--primary)] text-[var(--primary-foreground)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
            >
              S&apos;inscrire
            </Link>
          </div>
        </div>
      </nav>

      {children}

      {/* Footer */}
      <footer className="border-t-2 border-[var(--border)] mt-20">
        <div className="max-w-6xl mx-auto px-5 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm font-bold text-[var(--muted-foreground)]">
              UniLife 360 &copy; 2026. Fait avec passion pour les étudiants.
            </p>
            <div className="flex gap-6">
              <Link href="/features" className="text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                Fonctionnalités
              </Link>
              <Link href="/pricing" className="text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                Tarifs
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
