import type { CategoriesData } from '@/types';
import { catalogCategories } from './catalog';

/** Build categoriesData from catalog for Shop compatibility */
export const categoriesData: CategoriesData = Object.fromEntries(
  catalogCategories.map((cat) => [
    cat.id,
    {
      title: cat.title,
      desc: cat.desc,
      products: cat.products.map((p) => ({
        name: p.name,
        price: p.price,
        img: p.img,
      })),
    },
  ])
);

export const allCategories = catalogCategories.map((cat) => ({
  id: cat.id,
  title: cat.title,
  desc: cat.desc,
  products: cat.products.map((p) => ({ name: p.name, price: p.price, img: p.img })),
}));
