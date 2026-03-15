import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { PageMeta } from '@/components/PageMeta';

const Privacy = () => (
  <>
    <PageMeta title="Privacy Policy" description="Adea Crafts privacy policy and data handling practices." />
    <div className="section">
      <div className="container" style={{ maxWidth: 720 }}>
        <Link to="/" style={{ color: 'var(--accent-neon-blue)', marginBottom: 24, display: 'inline-block' }}>&larr; Back to Home</Link>
        <div className="card glass-panel" style={{ padding: 48 }}>
          <Shield size={40} color="var(--accent-neon-blue)" style={{ marginBottom: 24 }} />
          <h1 className="heading-lg" style={{ marginBottom: 24 }}>Privacy Policy</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>Last updated: {new Date().toLocaleDateString()}</p>
          <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <p style={{ marginBottom: 16 }}>Adea Crafts (&quot;we&quot;, &quot;our&quot;) respects your privacy. This policy describes how we collect, use, and protect your information when you use our website and services.</p>
            <h3 style={{ color: 'var(--text-primary)', marginTop: 24, marginBottom: 12 }}>Information We Collect</h3>
            <p style={{ marginBottom: 16 }}>We collect information you provide when placing orders, requesting quotes, or contacting us—including name, email, address, and payment details. We also collect usage data to improve our site.</p>
            <h3 style={{ color: 'var(--text-primary)', marginTop: 24, marginBottom: 12 }}>How We Use It</h3>
            <p style={{ marginBottom: 16 }}>Your information is used to process orders, fulfill requests, and communicate with you. We do not sell your data to third parties.</p>
            <h3 style={{ color: 'var(--text-primary)', marginTop: 24, marginBottom: 12 }}>Data Security</h3>
            <p style={{ marginBottom: 16 }}>We implement industry-standard security measures to protect your personal information.</p>
            <p>For questions, contact us at <a href="mailto:support@adeacrafts.com" style={{ color: 'var(--accent-neon-blue)' }}>support@adeacrafts.com</a>.</p>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default Privacy;
