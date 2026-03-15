import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { getProductById } from '@/data/products';
import { categoriesData } from '@/data/categories';
import { useCart } from '@/contexts/CartContext';
import { getApiProductIdFromCatalog, getApiCategoryFromCatalog } from '@/utils/catalogToApi';

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { addItem } = useCart();
  const product = productId ? getProductById(productId) : undefined;

  if (!product) {
    return (
      <div className="section">
        <div className="container">
          <h1 className="heading-lg" style={{ marginBottom: '20px' }}>Product Not Found</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link to="/shop" className="btn btn-outline">
            <ArrowLeft size={18} style={{ marginRight: 8 }} />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const price = parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0;

  const handleAddToCart = () => {
    addItem({
      name: product.name,
      price,
      image: product.img,
      options: { Category: product.categoryId },
    });
  };

  return (
    <motion.div
      className="section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container" style={{ maxWidth: 900 }}>
        <Link
          to={`/shop/${product.categoryId}`}
          style={{ color: 'var(--accent-neon-blue)', marginBottom: '24px', display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          <ArrowLeft size={18} /> Back to {categoriesData[product.categoryId]?.title ?? product.categoryId}
        </Link>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
          <div
            className="card glass-panel"
            style={{ overflow: 'hidden', padding: 0, aspectRatio: '1' }}
          >
            <img
              src={product.img}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div>
            <h1 className="heading-lg" style={{ marginBottom: '16px' }}>{product.name}</h1>
            <p className="text-lg" style={{ color: 'var(--accent-neon-blue)', marginBottom: 24 }}>
              {product.price}
            </p>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
              Custom signage and engraving. Contact us for exact specifications and customization
              options.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={handleAddToCart}
              >
                <ShoppingCart size={20} style={{ marginRight: 8 }} />
                Add to Cart
              </button>
              <Link
                to={(() => {
                  const apiId = getApiProductIdFromCatalog(product.id, product.categoryId);
                  return apiId ? `/marketplace/configure?product=${apiId}` : `/design?category=${getApiCategoryFromCatalog(product.categoryId)}`;
                })()}
                className="btn btn-outline"
                style={{ flex: 1, textAlign: 'center' }}
              >
                Customize Design
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;
