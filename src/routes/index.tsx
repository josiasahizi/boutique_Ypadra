import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import hero from "@/assets/hero.jpg";
import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "YAPADRAP — Vêtements essentiels en fibres naturelles" },
      {
        name: "description",
        content:
          "YAPADRAP conçoit des pièces intemporelles en lin, coton et laine, fabriquées en petites séries dans des ateliers responsables.",
      },
      { property: "og:title", content: "YAPADRAP — Vêtements essentiels" },
      {
        property: "og:description",
        content:
          "Pièces intemporelles en fibres naturelles, fabriquées en petites séries dans des ateliers responsables.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const nav = ["Nouveautés", "Femme", "Homme", "Accessoires", "Journal"];

const products = [
  { id: "ojai", name: "Pull côtelé Ojai", price: 110000, img: p1, tag: "Laine mérinos" },
  { id: "mesa", name: "Chemise ample Mesa", price: 81000, img: p2, tag: "Coton bio" },
  { id: "dune", name: "Sandales Dune", price: 93000, img: p3, tag: "Cuir tanné" },
];

type Product = (typeof products)[number];
type CartLine = { id: string; name: string; price: number; img: string; qty: number };

const fcfa = (n: number) => `${n.toLocaleString("fr-FR").replace(/\u202f|\u00a0/g, " ")} FCFA`;

function Index() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<CartLine[]>([]);

  const count = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);
  const total = useMemo(() => lines.reduce((s, l) => s + l.qty * l.price, 0), [lines]);

  const add = (p: Product) => {
    setLines((prev) => {
      const found = prev.find((l) => l.id === p.id);
      if (found) return prev.map((l) => (l.id === p.id ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { id: p.id, name: p.name, price: p.price, img: p.img, qty: 1 }];
    });
    toast.success(`${p.name} ajouté au panier`);
    setOpen(true);
  };

  const setQty = (id: string, delta: number) =>
    setLines((prev) =>
      prev
        .map((l) => (l.id === id ? { ...l, qty: l.qty + delta } : l))
        .filter((l) => l.qty > 0),
    );

  const remove = (id: string) => setLines((prev) => prev.filter((l) => l.id !== id));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <nav className="hidden gap-8 text-xs uppercase tracking-[0.16em] md:flex">
            {nav.slice(0, 3).map((n) => (
              <a key={n} href="#collection" className="text-muted-foreground transition-colors hover:text-foreground">
                {n}
              </a>
            ))}
          </nav>
          <a href="#" className="font-display text-2xl font-bold tracking-[0.3em] uppercase">
            YAPADRAP
          </a>
          <div className="flex gap-6 text-xs uppercase tracking-[0.16em]">
            <a href="#journal" className="text-muted-foreground transition-colors hover:text-foreground">
              Recherche
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={`Ouvrir le panier, ${count} article${count > 1 ? "s" : ""}`}
              className="relative flex items-center gap-2 uppercase tracking-[0.16em] transition-colors hover:text-accent"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Panier</span>
              {count > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <section className="relative">
        <img
          src={hero}
          alt="Mannequin portant une chemise et un pantalon en lin écru contre un mur de plâtre chaud"
          width={1600}
          height={1200}
          className="h-[78vh] w-full object-cover"
        />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-6 pb-14">
            <p className="eyebrow text-primary/70">Collection Été 26</p>
            <h1 className="mt-4 max-w-2xl text-5xl leading-[1.05] md:text-7xl">
              Des pièces faites pour durer plus d'une saison
            </h1>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#collection" className="btn-ink hover:btn-ink-hover">
                Voir la collection
              </a>
              <a
                href="#journal"
                className="btn-outline-ink hover:bg-primary hover:text-primary-foreground"
              >
                Notre atelier
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-secondary/40">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 text-center text-xs uppercase tracking-[0.18em] text-muted-foreground sm:grid-cols-3">
          <span>Livraison offerte dès 150 €</span>
          <span>Retours sous 30 jours</span>
          <span>Ateliers certifiés en Europe</span>
        </div>
      </section>

      <section id="collection" className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Sélection</p>
            <h2 className="mt-3 text-4xl md:text-5xl">Les essentiels</h2>
          </div>
          <a href="#collection" className="text-xs uppercase tracking-[0.18em] underline underline-offset-8">
            Tout parcourir
          </a>
        </div>

        <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <article key={p.name} className="group">
              <div className="overflow-hidden bg-muted">
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  width={900}
                  height={1100}
                  className="aspect-[9/11] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-5 flex items-baseline justify-between">
                <h3 className="text-xl">{p.name}</h3>
                <span className="text-sm font-bold text-foreground">{fcfa(p.price)}</span>
              </div>
              <p className="eyebrow mt-2">{p.tag}</p>
              <button
                type="button"
                onClick={() => add(p)}
                className="btn-ink hover:btn-ink-hover mt-4 w-full"
              >
                Ajouter au panier
              </button>
            </article>
          ))}
        </div>
      </section>

      <section id="journal" className="border-t border-border/60 bg-secondary/30">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-2">
          <img
            src={hero}
            alt="Détail de tissu en lin naturel sous la lumière du jour"
            loading="lazy"
            width={1600}
            height={1200}
            className="aspect-[4/3] w-full object-cover"
          />
          <div>
            <p className="eyebrow">Le journal</p>
            <h2 className="mt-3 text-4xl leading-tight md:text-5xl">
              Une matière, un atelier, une histoire
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">
              Chaque pièce naît d'une fibre choisie pour sa longévité : lin filé au Portugal, coton
              biologique tissé en Espagne, laine peignée dans les Abruzzes. Nous produisons en
              petites séries pour limiter les invendus et garantir un juste prix aux artisans.
            </p>
            <a
              href="#journal"
              className="mt-8 inline-block text-xs uppercase tracking-[0.18em] underline underline-offset-8"
            >
              Lire l'article
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="eyebrow">Newsletter</p>
        <h2 className="mt-3 text-4xl md:text-5xl">Restez proche de l'atelier</h2>
        <p className="mt-4 text-muted-foreground">
          Les nouveautés, les réassorts et les ventes privées, une fois par mois.
        </p>
        <form
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            required
            placeholder="votre@email.com"
            aria-label="Adresse e-mail"
            className="w-full border border-input bg-card px-4 py-3 text-sm outline-none focus:border-accent"
          />
          <button type="submit" className="btn-ink hover:btn-ink-hover">
            S'inscrire
          </button>
        </form>
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-2xl uppercase tracking-[0.3em]">YAPADRAP</p>
            <p className="mt-4 text-sm text-muted-foreground">
              Vêtements essentiels en fibres naturelles, conçus à Marseille.
            </p>
          </div>
          {[
            { t: "Boutique", l: ["Nouveautés", "Femme", "Homme", "Accessoires"] },
            { t: "Aide", l: ["Livraison", "Retours", "Guide des tailles", "Contact"] },
            { t: "Maison", l: ["Notre histoire", "Ateliers", "Matières", "Journal"] },
          ].map((c) => (
            <div key={c.t}>
              <p className="eyebrow">{c.t}</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {c.l.map((i) => (
                  <li key={i}>
                    <a href="#collection" className="transition-colors hover:text-foreground">
                      {i}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
          © 2026 YAPADRAP. Tous droits réservés.
        </div>
      </footer>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="flex w-full flex-col sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="font-display text-2xl uppercase tracking-[0.2em]">
              Panier ({count})
            </SheetTitle>
          </SheetHeader>

          {lines.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" aria-hidden />
              <p className="text-sm text-muted-foreground">Votre panier est vide.</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn-ink hover:btn-ink-hover"
              >
                Continuer mes achats
              </button>
            </div>
          ) : (
            <>
              <ul className="flex-1 space-y-6 overflow-y-auto px-6 py-2">
                {lines.map((l) => (
                  <li key={l.id} className="flex gap-4">
                    <img
                      src={l.img}
                      alt={l.name}
                      className="h-24 w-20 shrink-0 object-cover"
                      loading="lazy"
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <p className="truncate text-sm">{l.name}</p>
                        <button
                          type="button"
                          onClick={() => remove(l.id)}
                          aria-label={`Retirer ${l.name}`}
                          className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                        </button>
                      </div>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                        {fcfa(l.price)}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border border-border">
                          <button
                            type="button"
                            onClick={() => setQty(l.id, -1)}
                            aria-label="Diminuer la quantité"
                            className="px-2 py-1.5 transition-colors hover:bg-secondary"
                          >
                            <Minus className="h-3.5 w-3.5" aria-hidden />
                          </button>
                          <span className="min-w-8 text-center text-sm">{l.qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(l.id, 1)}
                            aria-label="Augmenter la quantité"
                            className="px-2 py-1.5 transition-colors hover:bg-secondary"
                          >
                            <Plus className="h-3.5 w-3.5" aria-hidden />
                          </button>
                        </div>
                        <span className="text-sm font-bold">{fcfa(l.price * l.qty)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <SheetFooter className="border-t border-border/60">
                <div className="w-full space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="uppercase tracking-[0.16em] text-muted-foreground">
                      Sous-total
                    </span>
                    <span className="text-lg font-bold">{fcfa(total)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Taxes incluses. Frais de livraison calculés au paiement.
                  </p>
                  <button
                    type="button"
                    onClick={() => toast("Paiement bientôt disponible")}
                    className="btn-ink hover:btn-ink-hover w-full"
                  >
                    Passer la commande
                  </button>
                </div>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
