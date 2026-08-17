import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Variant = {
  id: string;
  size: string;
  color: string;
  color_hex: string;
  stock_quantity: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_fcfa: number;
  category: string;
  image_url: string;
  tag: string | null;
  is_featured: boolean;
  product_variants: Variant[];
};

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "TU"];

export const sortSizes = (a: string, b: string) =>
  SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b);

export const totalStock = (p: Product) =>
  p.product_variants.reduce((s, v) => s + v.stock_quantity, 0);

export const fcfa = (n: number) =>
  `${n.toLocaleString("fr-FR").replace(/\u202f|\u00a0/g, " ")} FCFA`;

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("products")
      .select(
        "id, slug, name, description, price_fcfa, category, image_url, tag, is_featured, product_variants(id, size, color, color_hex, stock_quantity)",
      )
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return (data ?? []) as Product[];
  },
});
