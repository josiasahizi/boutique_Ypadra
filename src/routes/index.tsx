import { createFileRoute } from "@tanstack/react-router";
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
  { name: "Pull côtelé Ojai", price: "168 €", img: p1, tag: "Laine mérinos" },
  { name: "Chemise ample Mesa", price: "124 €", img: p2, tag: "Coton bio" },
  { name: "Sandales Dune", price: "142 €", img: p3, tag: "Cuir tanné" },
];

function Index() {
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
          <a href="#" className="font-display text-2xl tracking-[0.3em] uppercase">
            YAPADRAP
          </a>
          <div className="flex gap-6 text-xs uppercase tracking-[0.16em]">
            <a href="#journal" className="text-muted-foreground transition-colors hover:text-foreground">
              Recherche
            </a>
            <a href="#collection" className="transition-colors hover:text-accent">
              Panier (0)
            </a>
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
                <span className="text-sm text-muted-foreground">{p.price}</span>
              </div>
              <p className="eyebrow mt-2">{p.tag}</p>
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
    </div>
  );
}
