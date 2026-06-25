export type ProductView = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAt: number | null;
  images: string[];
  stock: number;
  featured: boolean;
  rating: number;
  numReviews: number;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
};

export type CategoryView = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  productCount: number;
};

export type ReviewView = {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  authorName: string;
  createdAt: string;
};
