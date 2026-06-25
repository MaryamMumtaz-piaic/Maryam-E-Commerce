import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getRelatedProducts, getReviews } from "@/lib/data";
import { ProductGallery } from "@/components/product/ProductGallery";
import { AddToCart } from "@/components/product/AddToCart";
import { ReviewList } from "@/components/product/ReviewList";
import { ReviewForm } from "@/components/product/ReviewForm";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Rating } from "@/components/ui/Rating";
import { formatPrice } from "@/lib/utils";
import { ShieldIcon, TruckIcon } from "@/components/ui/icons";

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

  const onSale = product.compareAt != null && product.compareAt > product.price;

  return (
    <>
      <Section className="py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-ink-soft">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span>/</span>
          <Link href={`/categories/${product.categorySlug}`} className="hover:text-ink">
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          <ProductGallery images={product.images} name={product.name} />

          <div className="flex flex-col">
            <p className="text-xs uppercase tracking-wider text-[var(--color-gold-dark)]">
              {product.categoryName}
            </p>
            <h1 className="mt-2 font-serif text-3xl tracking-tight text-ink sm:text-4xl">
              {product.name}
            </h1>
            <div className="mt-3">
              <Rating value={product.rating} count={product.numReviews} size="md" />
            </div>

            <div className="mt-5 flex items-center gap-3">
              <span className="text-2xl font-semibold text-ink">{formatPrice(product.price)}</span>
              {onSale && (
                <span className="text-lg text-ink-soft line-through">
                  {formatPrice(product.compareAt!)}
                </span>
              )}
            </div>

            <p className="mt-5 leading-relaxed text-ink-soft">{product.description}</p>

            <div className="mt-8">
              <AddToCart product={product} />
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 border-t border-line pt-6">
              <div className="flex items-center gap-3 text-sm text-ink-soft">
                <TruckIcon className="h-5 w-5 text-[var(--color-gold-dark)]" />
                Free shipping over $75
              </div>
              <div className="flex items-center gap-3 text-sm text-ink-soft">
                <ShieldIcon className="h-5 w-5 text-[var(--color-gold-dark)]" />
                Secure Stripe checkout
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Reviews */}
      <Section className="py-10">
        <SectionHeading
          eyebrow="Customer reviews"
          title={`Reviews (${product.numReviews})`}
          description="What customers are saying about this product."
        />
        <div className="grid max-w-5xl gap-10 lg:grid-cols-2">
          <ReviewList reviews={reviews} />
          <ReviewForm productId={product.id} />
        </div>
      </Section>

      {/* Related */}
      {related.length > 0 && (
        <Section className="py-10">
          <SectionHeading eyebrow="You may also like" title="Related products" />
          <ProductGrid products={related} />
        </Section>
      )}
    </>
  );
}
