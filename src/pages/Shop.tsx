import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { categoriesData, allCategories } from '@/data/categories';
import { useCart } from '@/contexts/CartContext';
import { getApiProductIdFromCatalog, getApiCategoryFromCatalog } from '@/utils/catalogToApi';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Shop: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { addItem } = useCart();

  const handleAddToCart = (name: string, priceStr: string, img: string) => {
    const price = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
    addItem({ name, price, image: img });
  };

  // If a specific category is selected
  if (categoryId && categoriesData[categoryId]) {
    const category = categoriesData[categoryId];
    return (
      <motion.div
        className="section"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="container">
          <Link to="/shop" style={{ color: 'var(--accent-neon-blue)', marginBottom: '20px', display: 'inline-block' }}>&larr; Back to all categories</Link>
          <div style={{ marginBottom: '60px' }}>
            <h1 className="heading-lg" style={{ marginBottom: '16px' }}>{category.title}</h1>
            <p className="text-lg" style={{ color: 'var(--text-secondary)', maxWidth: '800px' }}>{category.desc}</p>
          </div>
          
          <motion.div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}
            variants={containerVariants}
          >
            {category.products.map((p, i) => {
              const productId = `${categoryId}-${i}`;
              return (
                <motion.div key={productId} variants={itemVariants} className="card glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                  <Link to={`/product/${productId}`}>
                    <img src={p.img} alt={p.name} style={{ width: '100%', height: '240px', objectFit: 'cover' }} loading="lazy" />
                  </Link>
                  <div style={{ padding: '24px' }}>
                    <Link to={`/product/${productId}`}>
                      <h3 className="heading-md" style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{p.name}</h3>
                    </Link>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>{p.price}</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ flex: 1 }}
                        onClick={() => handleAddToCart(p.name, p.price, p.img)}
                      >
                        <ShoppingCart size={18} style={{ marginRight: 6 }} />
                        Add to Cart
                      </button>
                      <Link
                        to={getApiProductIdFromCatalog(productId, categoryId)
                          ? `/marketplace/configure?product=${getApiProductIdFromCatalog(productId, categoryId)}`
                          : `/design?category=${getApiCategoryFromCatalog(categoryId)}`}
                        className="btn btn-outline"
                      >
                        Customize
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // General Shop landing
  return (
    <motion.div
      className="section"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 className="heading-lg" style={{ marginBottom: '16px' }}>Shop by Category</h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Browse our catalog of custom signage solutions.</p>
        </div>
        
        <motion.div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}
          variants={containerVariants}
        >
          {allCategories.map((category, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Link to={`/shop/${category.id}`} className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '30px', textDecoration: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                   <h3 className="heading-md" style={{ fontSize: '1.5rem' }}>{category.title}</h3>
                   <ArrowRight size={24} color="var(--accent-neon-blue)" />
                </div>
                <p style={{ color: 'var(--text-secondary)', flex: 1 }}>{category.desc}</p>
                <div style={{ marginTop: '20px', color: 'var(--accent-neon-blue)', fontSize: '0.9rem', fontWeight: 600 }}>Explore {category.products.length} Products &rarr;</div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Shop;
