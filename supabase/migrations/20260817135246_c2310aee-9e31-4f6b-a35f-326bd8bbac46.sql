CREATE TYPE public.product_category AS ENUM ('hoodies','t-shirts','joggers','casquettes','vestes','accessoires');
CREATE TYPE public.product_size AS ENUM ('XS','S','M','L','XL','XXL','TU');

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price_fcfa integer NOT NULL CHECK (price_fcfa >= 0),
  category public.product_category NOT NULL,
  image_url text NOT NULL,
  tag text,
  is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size public.product_size NOT NULL,
  color text NOT NULL,
  color_hex text NOT NULL DEFAULT '#000000',
  stock_quantity integer NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, size, color)
);

CREATE INDEX idx_product_variants_product ON public.product_variants(product_id);

GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
GRANT SELECT ON public.product_variants TO anon;
GRANT SELECT ON public.product_variants TO authenticated;
GRANT ALL ON public.product_variants TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active products are publicly viewable"
  ON public.products FOR SELECT TO anon, authenticated USING (is_active = true);

CREATE POLICY "Variants of active products are publicly viewable"
  ON public.product_variants FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_id AND p.is_active = true));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$
LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER product_variants_updated_at BEFORE UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.products (slug, name, description, price_fcfa, category, image_url, tag, is_featured) VALUES
('hoodie-blanc-treich','Hoodie Treich Blanc','Hoodie oversize en molleton gratté, capuche doublée et logo brodé discret. La pièce qui tient la ville.',24000,'hoodies','/products/blanc.jpg','Molleton 320g',true),
('hoodie-rose-poudre','Hoodie Rose Poudré','Édition limitée en rose poudré, coupe large et poignets côtelés. Pour sortir du gris.',25000,'hoodies','/products/rose.jpg','Édition limitée',true),
('tee-noir-boxy','Tee Boxy Noir','T-shirt coupe boxy en coton peigné, épaules tombantes. L''essentiel de tous les jours.',9000,'t-shirts','/products/noir.jpg','Coton peigné 190g',true),
('tee-oversize-nuit','Tee Oversize Nuit','T-shirt oversize noir profond, col renforcé. Simple, lourd, propre.',10500,'t-shirts','/products/tee2.jpg','Oversize',false),
('jogger-gris-abobo','Jogger Gris Abobo','Jogger molleton gris chiné, taille élastiquée et cordon plat. Confort toute la journée.',15000,'joggers','/products/jogger.jpg','Molleton chiné',true),
('cargo-anthracite','Cargo Anthracite','Pantalon cargo en twill résistant, poches latérales, bas resserré.',19500,'joggers','/products/gris.jpg','Twill résistant',false),
('veste-marron-canvas','Veste Zippée Marron','Veste zippée en canvas délavé, coupe droite. Une pièce qui vieillit bien.',24500,'vestes','/products/marron.jpg','Canvas délavé',false),
('bomber-noir-plateau','Bomber Noir Plateau','Bomber manches courtes, zip métal et bords côtelés. Le soir au Plateau.',23000,'vestes','/products/veste2.jpg','Zip métal',true),
('casquette-noire-logo','Casquette Noire Logo','Casquette 6 panneaux en coton lourd, patch logo, fermeture réglable.',6500,'casquettes','/products/casquette.jpg','Réglable',false),
('tote-bag-yapadrap','Tote Bag YAPADRAP','Tote bag en toile épaisse, anses renforcées, sérigraphie discrète.',5000,'accessoires','/products/tote.jpg','Toile épaisse',false);

INSERT INTO public.product_variants (product_id, size, color, color_hex, stock_quantity)
SELECT p.id, s.size, c.color, c.hex, c.qty
FROM public.products p
CROSS JOIN LATERAL (VALUES ('S'::public.product_size),('M'),('L'),('XL'),('XXL')) AS s(size)
CROSS JOIN LATERAL (VALUES ('Blanc','#FFFFFF',8),('Noir','#111111',12)) AS c(color,hex,qty)
WHERE p.slug IN ('hoodie-blanc-treich','tee-noir-boxy','tee-oversize-nuit','bomber-noir-plateau');

INSERT INTO public.product_variants (product_id, size, color, color_hex, stock_quantity)
SELECT p.id, s.size, c.color, c.hex, c.qty
FROM public.products p
CROSS JOIN LATERAL (VALUES ('S'::public.product_size),('M'),('L'),('XL')) AS s(size)
CROSS JOIN LATERAL (VALUES ('Rose','#E8C7C8',5),('Gris anthracite','#3A3A3A',9)) AS c(color,hex,qty)
WHERE p.slug IN ('hoodie-rose-poudre','jogger-gris-abobo','cargo-anthracite','veste-marron-canvas');

INSERT INTO public.product_variants (product_id, size, color, color_hex, stock_quantity)
SELECT p.id, 'TU'::public.product_size, c.color, c.hex, c.qty
FROM public.products p
CROSS JOIN LATERAL (VALUES ('Noir','#111111',20),('Blanc','#FFFFFF',14)) AS c(color,hex,qty)
WHERE p.slug IN ('casquette-noire-logo','tote-bag-yapadrap');

UPDATE public.product_variants v SET stock_quantity = 0
FROM public.products p
WHERE v.product_id = p.id AND p.slug = 'hoodie-rose-poudre' AND v.size IN ('XL');