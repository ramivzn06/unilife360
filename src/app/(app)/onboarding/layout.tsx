export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Header minimal */}
      <header className="p-4 sm:p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--primary)] border-2 border-[var(--border)] shadow-[var(--shadow-brutalist-sm)] flex items-center justify-center">
          <span className="text-[var(--primary-foreground)] font-extrabold text-sm">U</span>
        </div>
        <h1 className="text-lg font-extrabold">UniLife 360</h1>
      </header>

      {/* Contenu centré */}
      <main className="flex-1 flex items-start justify-center px-4 pb-8">
        <div className="w-full max-w-2xl">{children}</div>
      </main>
    </div>
  );
}
