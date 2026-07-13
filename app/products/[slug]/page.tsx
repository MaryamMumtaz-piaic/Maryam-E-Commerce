import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, getReviews } from "@/lib/data";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import { RecordView } from "@/components/product/RecordView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product?.name ?? "Product" };
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
