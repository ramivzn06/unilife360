export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-5">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-[var(--primary)] border-2 border-[var(--border)] shadow-[var(--shadow-brutalist)] flex items-center justify-center">
            <span className="text-[var(--primary-foreground)] font-extrabold text-xl">U</span>
          </div>
          <span className="font-extrabold text-2xl tracking-tight">UniLife 360</span>
        </div>
        {children}
      </div>
    </div>
  );
}
