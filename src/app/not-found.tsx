import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-5 bg-[var(--background)]">
            <div className="brutalist-card p-10 md:p-16 text-center max-w-lg">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-[var(--color-sport)] rounded-xl border-2 border-[var(--border)] shadow-[var(--shadow-brutalist)] mb-8 -rotate-3">
                    <span className="text-5xl font-extrabold">404</span>
                </div>

                <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
                    Page introuvable
                </h1>
                <p className="text-[var(--muted-foreground)] font-medium mb-8">
                    Oups ! On dirait que cette page a séché les cours.
                    <br />
                    Retourne sur le campus, elle reviendra peut-être demain.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/">
                        <Button size="lg" className="text-base">
                            <Home className="w-5 h-5" />
                            Retour à l&apos;accueil
                        </Button>
                    </Link>
                    <Link href="/features">
                        <Button variant="outline" size="lg" className="text-base">
                            <Search className="w-5 h-5" />
                            Voir les fonctionnalités
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
