import { categoriesData } from './categories';
import type { Product } from '@/types';
import { slugify } from '@/utils';

export interface ProductWithId extends Product {
  id: string;
  categoryId: string;
}

const productList: ProductWithId[] = [];
for (const [categoryId, category] of Object.entries(categoriesData)) {
  category.products.forEach((p, idx) => {
    productList.push({
      ...p,
      id: `${categoryId}-${idx}`,
      categoryId,
    });
  });
}

export function getProductById(id: string): ProductWithId | undefined {
  return productList.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): ProductWithId | undefined {
  return productList.find((p) => slugify(p.name) === slug);
}

export { productList };
