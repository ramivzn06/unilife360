import { Sidebar } from "@/components/shared/sidebar";
import { Topbar } from "@/components/shared/topbar";
import { MobileNav } from "@/components/shared/mobile-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar />
      <div className="md:ml-[280px] transition-all duration-300">
        <Topbar />
        <main className="p-5 md:p-8 pb-[100px] md:pb-8">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
