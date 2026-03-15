import { Link } from 'react-router-dom';
import { Mail, MessageSquare, ArrowRight } from 'lucide-react';
import { PageMeta } from '@/components/PageMeta';

const Contact = () => (
  <>
    <PageMeta title="Contact Us" description="Get in touch for custom quotes, bulk orders, and project inquiries." />
    <div className="section">
      <div className="container" style={{ maxWidth: 600 }}>
        <div className="card glass-panel" style={{ padding: 48, textAlign: 'center' }}>
          <Mail size={48} color="var(--accent-neon-blue)" style={{ marginBottom: 24 }} />
          <h1 className="heading-lg" style={{ marginBottom: 16 }}>Contact Us</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
            For custom quotes, bulk orders, or project inquiries, use our quote form. We typically respond within 24 hours.
          </p>
          <Link to="/quote" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <MessageSquare size={20} /> Request a Quote
          </Link>
          <p style={{ marginTop: 32, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Or email us at <a href="mailto:support@adeacrafts.com" style={{ color: 'var(--accent-neon-blue)' }}>support@adeacrafts.com</a>
          </p>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 24, color: 'var(--text-secondary)' }}>
            <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  </>
);

export default Contact;
