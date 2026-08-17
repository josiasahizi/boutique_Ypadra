import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
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
import {
  fcfa,
  productsQuery,
  sortSizes,
  totalStock,
  type Product,
  type Variant,
} from "@/lib/products";
import hero from "@/assets/hero-abidjan.jpg";
import ville1 from "@/assets/ville-1.jpg";
import ville2 from "@/assets/ville-2.jpg";
import ville3 from "@/assets/ville-3.jpg";
import commu1 from "@/assets/commu-1.jpg";
import commu2 from "@/assets/commu-2.jpg";
import commu3 from "@/assets/commu-3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "YAPADRAP — Streetwear abidjanais dès 5 000 FCFA" },
      {
        name: "description",
        content:
          "YAPADRAP, la marque streetwear née à Abidjan : hoodies, tee-shirts, joggers, casquettes et accessoires à prix accessibles, de 5 000 à 25 000 FCFA.",
      },
      { property: "og:title", content: "YAPADRAP — Plus qu'un mot. Un état d'esprit." },
      {
        property: "og:description",
        content:
          "Hoodies, tees, joggers et casquettes streetwear made in Abidjan. Coupes oversize, prix accessibles, livraison en Côte d'Ivoire.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(productsQuery);
  },
  component: Index,
});

const nav = [
  { label: "Shop", href: "#collections" },
  { label: "L'univers", href: "#univers" },
  { label: "Histoire", href: "#histoire" },
  { label: "Abidjan", href: "#abidjan" },
];

const categories = [
  { key: "all", label: "Tout" },
  { key: "hoodies", label: "Hoodies" },
  { key: "t-shirts", label: "T-shirts" },
  { key: "joggers", label: "Joggers" },
  { key: "vestes", label: "Vestes" },
  { key: "casquettes", label: "Casquettes" },
  { key: "accessoires", label: "Accessoires" },
];

type CartLine = {
  key: string;
  productId: string;
  variantId: string;
  name: string;
  size: string;
  color: string;
  price: number;
  img: string;
  qty: number;
  stock: number;
};

const quartiers = ["Treichville", "Cocody", "Yopougon", "Plateau", "Marcory", "Koumassi", "Abobo"];

function ProductCard({ p, onAdd }: { p: Product; onAdd: (p: Product, v: Variant) => void }) {
  const colors = useMemo(() => {
    const seen = new Map<string, string>();
    p.product_variants.forEach((v) => seen.set(v.color, v.color_hex));
    return [...seen.entries()].map(([color, hex]) => ({ color, hex }));
  }, [p]);

  const [color, setColor] = useState(colors[0]?.color ?? "");

  const sizes = useMemo(
    () =>
      p.product_variants
        .filter((v) => v.color === color)
        .sort((a, b) => sortSizes(a.size, b.size)),
    [p, color],
  );

  const [sizeId, setSizeId] = useState<string | null>(null);
  const selected = sizes.find((v) => v.id === sizeId) ?? null;
  const stock = totalStock(p);

  return (
    <article className="group flex flex-col">
      <div className="relative overflow-hidden bg-muted">
        <img
          src={p.image_url}
          alt={p.name}
          loading="lazy"
          width={900}
          height={1100}
          className="aspect-[9/11] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        {stock === 0 && (
          <span className="absolute left-0 top-0 bg-foreground px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-background">
            Rupture
          </span>
        )}
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-3">
        <h3 className="text-lg tracking-normal">{p.name}</h3>
        <span className="whitespace-nowrap text-sm font-bold text-foreground">
          {fcfa(p.price_fcfa)}
        </span>
      </div>
      <p className="eyebrow mt-2">{p.tag ?? p.category}</p>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {colors.map((c) => (
          <button
            key={c.color}
            type="button"
            onClick={() => {
              setColor(c.color);
              setSizeId(null);
            }}
            aria-label={`Couleur ${c.color}`}
            aria-pressed={color === c.color}
            title={c.color}
            className={`h-6 w-6 rounded-full border transition-all ${
              color === c.color ? "ring-1 ring-foreground ring-offset-2" : "border-border"
            }`}
            style={{ backgroundColor: c.hex }}
          />
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {sizes.map((v) => {
          const out = v.stock_quantity === 0;
          return (
            <button
              key={v.id}
              type="button"
              disabled={out}
              onClick={() => setSizeId(v.id)}
              className={`min-w-11 border px-2 py-1.5 text-xs uppercase tracking-[0.12em] transition-colors ${
                sizeId === v.id
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:border-foreground"
              } ${out ? "cursor-not-allowed opacity-35 line-through" : ""}`}
            >
              {v.size}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={stock === 0}
        onClick={() => {
          if (!selected) {
            toast("Choisis une taille d'abord");
            return;
          }
          onAdd(p, selected);
        }}
        className="btn-ink hover:btn-ink-hover mt-4 w-full disabled:cursor-not-allowed disabled:opacity-40"
      >
        {stock === 0 ? "Rupture de stock" : "Ajouter au panier"}
      </button>
    </article>
  );
}

function Index() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const [open, setOpen] = useState(false);
  const [cat, setCat] = useState("all");
  const [lines, setLines] = useState<CartLine[]>([]);

  const visible = useMemo(
    () => (cat === "all" ? products : products.filter((p) => p.category === cat)),
    [products, cat],
  );

  const count = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);
  const total = useMemo(() => lines.reduce((s, l) => s + l.qty * l.price, 0), [lines]);

  const add = (p: Product, v: Variant) => {
    const key = v.id;
    setLines((prev) => {
      const found = prev.find((l) => l.key === key);
      if (found) {
        if (found.qty >= v.stock_quantity) {
          toast("Stock maximum atteint pour cette taille");
          return prev;
        }
        return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l));
      }
      return [
        ...prev,
        {
          key,
          productId: p.id,
          variantId: v.id,
          name: p.name,
          size: v.size,
          color: v.color,
          price: p.price_fcfa,
          img: p.image_url,
          qty: 1,
          stock: v.stock_quantity,
        },
      ];
    });
    toast.success(`${p.name} — ${v.color} / ${v.size} ajouté au panier`);
    setOpen(true);
  };

  const setQty = (key: string, delta: number) =>
    setLines((prev) =>
      prev
        .map((l) =>
          l.key === key ? { ...l, qty: Math.min(l.qty + delta, l.stock) } : l,
        )
        .filter((l) => l.qty > 0),
    );

  const remove = (key: string) => setLines((prev) => prev.filter((l) => l.key !== key));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed top-0 z-30 w-full border-b border-white/15 bg-black/40 text-white backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <nav className="hidden gap-8 text-[11px] uppercase tracking-[0.2em] md:flex">
            {nav.slice(0, 2).map((n) => (
              <a key={n.href} href={n.href} className="opacity-70 transition-opacity hover:opacity-100">
                {n.label}
              </a>
            ))}
          </nav>
          <a href="#" className="font-display text-2xl font-bold tracking-[0.3em]">
            YAPADRAP
          </a>
          <div className="flex items-center gap-6 text-[11px] uppercase tracking-[0.2em]">
            <a href="#communaute" className="hidden opacity-70 transition-opacity hover:opacity-100 sm:inline">
              Communauté
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={`Ouvrir le panier, ${count} article${count > 1 ? "s" : ""}`}
              className="relative flex items-center gap-2"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Panier</span>
              {count > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-[10px] font-bold text-black">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative h-screen w-full">
        <img
          src={hero}
          alt="Jeune homme en hoodie oversize dans une rue d'Abidjan"
          width={1600}
          height={2000}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-6 pb-20 text-white">
            <h1 className="font-display text-[15vw] leading-[0.85] tracking-tight sm:text-[11rem]">
              YAPADRAP
            </h1>
            <p className="mt-4 max-w-md text-sm uppercase tracking-[0.28em] text-white/80">
              Plus qu'un mot. Un état d'esprit.
            </p>
            <p className="mt-3 max-w-md text-base text-white/70">
              Le streetwear d'Abidjan à partir de 5 000 FCFA. Pas de drap, pas de stress.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#collections"
                className="bg-white px-9 py-4 text-[11px] uppercase tracking-[0.2em] text-black transition-opacity hover:opacity-85"
              >
                Shopper maintenant
              </a>
              <a
                href="#histoire"
                className="border border-white/70 px-9 py-4 text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-black"
              >
                Notre histoire
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* UNIVERS */}
      <section id="univers" className="bg-background">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-28 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="eyebrow">L'univers</p>
            <h2 className="mt-4 text-5xl md:text-6xl">
              « Yapadrap »<br />
              ça veut dire : ça va aller
            </h2>
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>
              À Abidjan, on le dit pour rassurer, pour relancer, pour continuer malgré tout. Pas de
              problème, pas de stress : on avance. C'est une manière d'être, une façon de porter
              les jours difficiles avec le sourire.
            </p>
            <p>
              YAPADRAP transforme cette phrase en vêtement. Des pièces sobres, taillées large,
              faites pour durer — et à des prix que la jeunesse d'Abidjan peut vraiment se payer.
            </p>
            <div className="grid gap-6 pt-4 sm:grid-cols-3">
              {[
                { t: "Courage", d: "Avancer sans se plaindre." },
                { t: "Créativité", d: "Faire beaucoup avec peu." },
                { t: "Fierté", d: "Assumer d'où l'on vient." },
              ].map((v) => (
                <div key={v.t} className="border-t border-border pt-4">
                  <p className="font-display text-xl text-foreground">{v.t}</p>
                  <p className="mt-1 text-sm">{v.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section id="collections" className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-6 py-28">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Le shop</p>
              <h2 className="mt-3 text-5xl md:text-6xl">Ça part vite</h2>
            </div>
            <p className="max-w-xs text-sm text-muted-foreground">
              Hoodies, tees, joggers, casquettes. De 5 000 à 25 000 FCFA. Choisis ta couleur et ta
              taille.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setCat(c.key)}
                className={`border px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors ${
                  cat === c.key
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:border-foreground"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => (
              <ProductCard key={p.id} p={p} onAdd={add} />
            ))}
          </div>
          {visible.length === 0 && (
            <p className="mt-12 text-sm text-muted-foreground">
              Rien dans cette catégorie pour l'instant.
            </p>
          )}
        </div>
      </section>

      {/* HISTOIRE */}
      <section id="histoire" className="bg-[oklch(0.145_0_0)] text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-28 lg:grid-cols-2">
          <img
            src={ville3}
            alt="Groupe de jeunes discutant dans une rue d'Abidjan au coucher du soleil"
            loading="lazy"
            width={1200}
            height={1500}
            className="aspect-[4/5] w-full object-cover grayscale"
          />
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/60">Notre histoire</p>
            <h2 className="mt-4 text-5xl md:text-6xl">Née dans la rue, pensée pour le monde</h2>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-white/70">
              <p>
                YAPADRAP est née d'une envie simple : donner une forme à ce que l'on entend chaque
                jour dans les rues d'Abidjan. Une marque qui parle de résilience sans jamais la
                mettre en scène.
              </p>
              <p>
                Chaque pièce est dessinée ici, produite en petites séries, et portée d'abord par
                celles et ceux qui font vivre la ville. L'ambition dépasse la Côte d'Ivoire — mais
                le point de départ, lui, ne bouge pas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ABIDJAN */}
      <section id="abidjan" className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-28">
          <p className="eyebrow">Abidjan dans la marque</p>
          <h2 className="mt-3 max-w-2xl text-5xl md:text-6xl">La ville est notre studio</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { src: ville1, alt: "Rue de marché animée à Abidjan" },
              { src: ville2, alt: "Le quartier du Plateau à Abidjan à la tombée du jour" },
              { src: ville3, alt: "Jeunes assis sur un muret dans un quartier d'Abidjan" },
            ].map((i) => (
              <img
                key={i.alt}
                src={i.src}
                alt={i.alt}
                loading="lazy"
                width={1200}
                height={1500}
                className="aspect-[4/5] w-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
              />
            ))}
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            {quartiers.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* COMMUNAUTE */}
      <section id="communaute" className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-6 py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">La communauté</p>
              <h2 className="mt-3 text-5xl md:text-6xl">Ceux qui la portent</h2>
            </div>
            <p className="max-w-sm text-sm text-muted-foreground">
              Balance tes photos avec #YAPADRAP. Les meilleures passent dans la galerie.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { src: commu1, alt: "Jeune femme en hoodie noir devant un mur peint" },
              { src: commu2, alt: "Deux jeunes hommes en tee-shirts clairs sur un scooter" },
              { src: commu3, alt: "Jeune homme souriant en veste marron dans la rue" },
            ].map((i) => (
              <img
                key={i.alt}
                src={i.src}
                alt={i.alt}
                loading="lazy"
                width={1000}
                height={1000}
                className="aspect-square w-full object-cover"
              />
            ))}
          </div>

          <form
            className="mx-auto mt-16 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="votre@email.com"
              aria-label="Adresse e-mail"
              className="w-full border border-input bg-card px-4 py-3 text-sm outline-none focus:border-foreground"
            />
            <button type="submit" className="btn-ink hover:btn-ink-hover">
              Rejoindre
            </button>
          </form>
        </div>
      </section>

      <footer className="bg-[oklch(0.145_0_0)] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-2xl font-bold tracking-[0.3em]">YAPADRAP</p>
            <p className="mt-4 text-sm text-white/60">
              Streetwear né à Abidjan, Côte d'Ivoire. Plus qu'un mot. Un état d'esprit.
            </p>
          </div>
          {[
            { t: "Boutique", l: ["Hoodies", "T-shirts", "Joggers", "Casquettes"] },
            { t: "Aide", l: ["Livraison", "Retours", "Guide des tailles", "Contact"] },
            { t: "Marque", l: ["Notre histoire", "L'univers", "Abidjan", "Communauté"] },
          ].map((c) => (
            <div key={c.t}>
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/50">{c.t}</p>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                {c.l.map((i) => (
                  <li key={i}>
                    <a href="#collections" className="transition-colors hover:text-white">
                      {i}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
          © 2026 YAPADRAP — Abidjan. Tous droits réservés. Prix en FCFA (XOF).
        </div>
      </footer>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="flex w-full flex-col sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="font-display text-2xl tracking-[0.2em]">
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
                  <li key={l.key} className="flex gap-4">
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
                          onClick={() => remove(l.key)}
                          aria-label={`Retirer ${l.name}`}
                          className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                        </button>
                      </div>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                        {l.color} · {l.size} · {fcfa(l.price)}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border border-border">
                          <button
                            type="button"
                            onClick={() => setQty(l.key, -1)}
                            aria-label="Diminuer la quantité"
                            className="px-2 py-1.5 transition-colors hover:bg-secondary"
                          >
                            <Minus className="h-3.5 w-3.5" aria-hidden />
                          </button>
                          <span className="min-w-8 text-center text-sm">{l.qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(l.key, 1)}
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
                    Prix en FCFA (XOF). Livraison calculée au paiement.
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
