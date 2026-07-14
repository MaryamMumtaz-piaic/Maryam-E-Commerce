import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, getReviews } from "@/lib/data";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import { RecordView } from "@/components/product/RecordView";

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const title = product?.name ?? "Product";
  const desc = product?.description
    ? product.description.substring(0, 160)
    : "Maryam is a curated store of refined apparel, footwear, accessories, and home goods. Timeless design, premium materials.";
  const image = product?.images?.[0] ?? "https://picsum.photos/seed/maryam-og/1200/630";

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      type: "website",
      images: [
        {
          url: image,
          width: 800,
          height: 600,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [image],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [reviews, related] = await Promise.all([
    getReviews(product.id),
    getRelatedProducts(product.categorySlug, product.slug, 4),
  ]);

  return (
    <>
      <RecordView
        item={{
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          compareAt: product.compareAt,
          image: product.images[0],
          categoryName: product.categoryName,
        }}
      />
      
      <ProductDetailView
        product={product}
        initialReviews={reviews}
        relatedProducts={related}
      />
    </>
  );
}
