import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { PageMeta } from '@/components/PageMeta';

const Terms = () => (
  <>
    <PageMeta title="Terms of Service" description="Adea Crafts terms of service and usage guidelines." />
    <div className="section">
      <div className="container" style={{ maxWidth: 720 }}>
        <Link to="/" style={{ color: 'var(--accent-neon-blue)', marginBottom: 24, display: 'inline-block' }}>&larr; Back to Home</Link>
        <div className="card glass-panel" style={{ padding: 48 }}>
          <FileText size={40} color="var(--accent-neon-blue)" style={{ marginBottom: 24 }} />
          <h1 className="heading-lg" style={{ marginBottom: 24 }}>Terms of Service</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>Last updated: {new Date().toLocaleDateString()}</p>
          <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <p style={{ marginBottom: 16 }}>By using Adea Crafts (&quot;the Service&quot;), you agree to these terms.</p>
            <h3 style={{ color: 'var(--text-primary)', marginTop: 24, marginBottom: 12 }}>Orders & Customization</h3>
            <p style={{ marginBottom: 16 }}>Custom products are made to your specifications. You are responsible for providing accurate designs, text, and artwork. We reserve the right to refuse orders that violate intellectual property or contain inappropriate content.</p>
            <h3 style={{ color: 'var(--text-primary)', marginTop: 24, marginBottom: 12 }}>Pricing & Payment</h3>
            <p style={{ marginBottom: 16 }}>Prices are as displayed at checkout. Quote requests may result in different pricing based on complexity and quantity.</p>
            <h3 style={{ color: 'var(--text-primary)', marginTop: 24, marginBottom: 12 }}>Shipping & Returns</h3>
            <p style={{ marginBottom: 16 }}>Custom-made items are generally non-returnable. Defective or incorrect items may be replaced at our discretion.</p>
            <p>For questions, contact us at <a href="mailto:support@adeacrafts.com" style={{ color: 'var(--accent-neon-blue)' }}>support@adeacrafts.com</a>.</p>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default Terms;
