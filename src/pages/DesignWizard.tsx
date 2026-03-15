import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Upload, Building2, Sparkles, Share2, Download, MessageCircle, GitCompare, Wand2 } from 'lucide-react';
import { GenerativeDesignModal } from './GenerativeDesignModal';
import { motion, AnimatePresence } from 'framer-motion';
import { PageMeta } from '@/components/PageMeta';
import {
  getRecommendations,
  getDesignComparisons,
  generateQuotePreview,
  type WizardAnswers,
  type ProductType,
  type UsageLocation,
  type StylePreference,
  type DesignSuggestion,
} from '@/services/designWizard';

const PRODUCT_TYPES: { id: ProductType; label: string; icon: string }[] = [
  { id: 'business-sign', label: 'Business sign', icon: '🏢' },
  { id: 'gift', label: 'Gift item', icon: '🎁' },
  { id: 'wedding', label: 'Wedding product', icon: '💒' },
  { id: 'clothing', label: 'Clothing', icon: '👕' },
];

const USAGE_OPTIONS: { id: UsageLocation; label: string }[] = [
  { id: 'indoor-wall', label: 'Indoor wall' },
  { id: 'outdoor-building', label: 'Outdoor building' },
  { id: 'apparel', label: 'Apparel' },
  { id: 'desk-decoration', label: 'Desk / decoration' },
];

const STYLE_OPTIONS: { id: StylePreference; label: string }[] = [
  { id: 'modern', label: 'Modern' },
  { id: 'luxury', label: 'Luxury' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'playful', label: 'Playful' },
];

const DesignWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<WizardAnswers>({
    productType: 'business-sign',
    hasLogoUpload: false,
    hasSpacePhoto: false,
    usageLocation: 'indoor-wall',
    style: 'modern',
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [spacePreview, setSpacePreview] = useState<string | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<DesignSuggestion | null>(null);
  const [showCompare, setShowCompare] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showGenModal, setShowGenModal] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const spaceInputRef = useRef<HTMLInputElement>(null);

  const recommendations = getRecommendations(answers);
  const comparisons = getDesignComparisons(answers.productType);
  const quote = generateQuotePreview(answers, selectedDesign ?? undefined);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
        setAnswers(a => ({ ...a, hasLogoUpload: true }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSpaceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSpacePreview(reader.result as string);
        setAnswers(a => ({ ...a, hasSpacePhoto: true }));
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleGenSelect = (dataUrl: string) => {
    setLogoPreview(dataUrl);
    setAnswers((a) => ({ ...a, hasLogoUpload: true }));
  };

  const handleProceedToBuilder = () => {
    try {
      const payload: { logo?: string; space?: string } = {};
      if (logoPreview) payload.logo = logoPreview;
      if (spacePreview) payload.space = spacePreview;
      if (Object.keys(payload).length > 0) {
        sessionStorage.setItem('adea-wizard-uploads', JSON.stringify(payload));
      }
    } catch {
      /* ignore storage errors */
    }
    if (selectedDesign) navigate(selectedDesign.link);
    else if (recommendations[0]) navigate(recommendations[0].link);
    else navigate('/marketplace/configure');
  };

  const totalSteps = 5;

  return (
    <>
      <PageMeta
        title="Guided Design Wizard"
        description="Answer a few questions and get AI-powered product recommendations. Design your custom product with confidence."
      />
      <div className="section" style={{ minHeight: '85vh' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          {/* Progress */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
            {[...Array(totalSteps)].map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  background: i + 1 <= step ? 'var(--accent-neon-blue)' : 'var(--border-color)',
                  transition: 'background 0.3s',
                }}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: What to create */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="heading-lg" style={{ marginBottom: 8 }}>What do you want to create?</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Choose the type of product you're looking for.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                  {PRODUCT_TYPES.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => { setAnswers(a => ({ ...a, productType: p.id })); nextStep(); }}
                      className="card glass-panel"
                      style={{
                        padding: 24,
                        textAlign: 'center',
                        border: answers.productType === p.id ? '2px solid var(--accent-neon-blue)' : '1px solid var(--border-color)',
                        cursor: 'pointer',
                      }}
                    >
                      <span style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }}>{p.icon}</span>
                      <span style={{ fontWeight: 600 }}>{p.label}</span>
                    </button>
                  ))}
                </div>
                <p style={{ marginTop: 24, textAlign: 'center' }}>
                  <Link to="/design" style={{ color: 'var(--accent-neon-blue)', fontSize: '0.95rem' }}>
                    Or browse all categories
                  </Link>
                </p>
              </motion.div>
            )}

            {/* Step 2: Upload (optional) */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="heading-lg" style={{ marginBottom: 8 }}>Upload your assets (optional)</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Logo or image for your design. Building photo for sign placement.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setShowGenModal(true)}
                    style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <Wand2 size={18} /> Generate from prompt
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div
                    className="card glass-panel"
                    style={{ padding: 24, textAlign: 'center', cursor: 'pointer', border: logoPreview ? '2px solid var(--accent-neon-blue)' : '1px dashed var(--border-color)' }}
                    onClick={() => logoInputRef.current?.click()}
                  >
                    <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} aria-label="Upload logo" />
                    <Upload size={32} color="var(--accent-neon-blue)" style={{ marginBottom: 12 }} />
                    <p style={{ fontWeight: 600, marginBottom: 4 }}>Logo or image</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{logoPreview ? 'Uploaded ✓' : 'Click to upload'}</p>
                    {logoPreview && <img src={logoPreview} alt="Logo" style={{ maxHeight: 80, marginTop: 12, borderRadius: 4 }} />}
                  </div>
                  <div
                    className="card glass-panel"
                    style={{ padding: 24, textAlign: 'center', cursor: 'pointer', border: spacePreview ? '2px solid var(--accent-neon-blue)' : '1px dashed var(--border-color)' }}
                    onClick={() => spaceInputRef.current?.click()}
                  >
                    <input ref={spaceInputRef} type="file" accept="image/*" onChange={handleSpaceUpload} style={{ display: 'none' }} aria-label="Upload space photo" />
                    <Building2 size={32} color="var(--accent-neon-blue)" style={{ marginBottom: 12 }} />
                    <p style={{ fontWeight: 600, marginBottom: 4 }}>Photo of your space</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{spacePreview ? 'Uploaded ✓' : 'Storefront, room, wall'}</p>
                    {spacePreview && <img src={spacePreview} alt="Space" style={{ maxHeight: 80, marginTop: 12, borderRadius: 4 }} />}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
                  <button type="button" className="btn btn-outline" onClick={prevStep}>Back</button>
                  <button type="button" className="btn btn-primary" onClick={nextStep}>Continue</button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Where used */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="heading-lg" style={{ marginBottom: 8 }}>Where will the product be used?</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>This helps us recommend the right size and materials.</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  {USAGE_OPTIONS.map(u => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setAnswers(a => ({ ...a, usageLocation: u.id }))}
                      className="btn"
                      style={{
                        background: answers.usageLocation === u.id ? 'rgba(0,240,255,0.15)' : 'var(--bg-elevated)',
                        borderColor: answers.usageLocation === u.id ? 'var(--accent-neon-blue)' : 'var(--border-color)',
                      }}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
                  <button type="button" className="btn btn-outline" onClick={prevStep}>Back</button>
                  <button type="button" className="btn btn-primary" onClick={nextStep}>Continue</button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Style */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="heading-lg" style={{ marginBottom: 8 }}>Preferred style</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>We'll tailor recommendations to your aesthetic.</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  {STYLE_OPTIONS.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setAnswers(a => ({ ...a, style: s.id }))}
                      className="btn"
                      style={{
                        background: answers.style === s.id ? 'rgba(0,240,255,0.15)' : 'var(--bg-elevated)',
                        borderColor: answers.style === s.id ? 'var(--accent-neon-blue)' : 'var(--border-color)',
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
                  <button type="button" className="btn btn-outline" onClick={prevStep}>Back</button>
                  <button type="button" className="btn btn-primary" onClick={nextStep}>
                    <Sparkles size={18} style={{ marginRight: 8 }} /> Get AI Recommendations
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Recommendations & Quote */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <Sparkles size={28} color="var(--accent-neon-blue)" />
                  <h2 className="heading-lg" style={{ margin: 0 }}>AI Recommendations</h2>
                </div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
                  Based on your answers, here are our top suggestions. Choose one to customize.
                </p>

                {/* Design suggestions */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 40 }}>
                  {recommendations.map(rec => (
                    <div
                      key={rec.id}
                      className="card glass-panel"
                      style={{
                        padding: 0,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: selectedDesign?.id === rec.id ? '2px solid var(--accent-neon-blue)' : '1px solid var(--border-color)',
                      }}
                      onClick={() => setSelectedDesign(rec)}
                    >
                      <div style={{ height: 140, background: `url(${rec.img}) center/cover` }} />
                      <div style={{ padding: 16 }}>
                        <h3 style={{ fontWeight: 600, marginBottom: 4 }}>{rec.name}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 8 }}>{rec.desc}</p>
                        {rec.aiTip && (
                          <p style={{ fontSize: '0.8rem', color: 'var(--accent-neon-blue)', marginBottom: 8 }}>💡 {rec.aiTip}</p>
                        )}
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{rec.priceRange}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Compare designs */}
                {comparisons.length > 0 && (
                  <div style={{ marginBottom: 40 }}>
                    <button
                      type="button"
                      className="btn btn-outline"
                      style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}
                      onClick={() => setShowCompare(!showCompare)}
                    >
                      <GitCompare size={18} /> Compare designs side-by-side
                    </button>
                    {showCompare && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {comparisons.map((c, i) => (
                          <div key={i} className="card glass-panel" style={{ padding: 24 }}>
                            <p style={{ fontWeight: 600, marginBottom: 16 }}>{c.label}</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                              <div>
                                <div style={{ height: 120, background: `url(${c.a.img}) center/cover`, borderRadius: 8, marginBottom: 8 }} />
                                <p style={{ fontWeight: 600 }}>{c.a.name}</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{c.a.desc} · {c.a.priceRange}</p>
                                <button type="button" className="btn btn-outline" style={{ marginTop: 8 }} onClick={() => { setSelectedDesign(c.a); handleProceedToBuilder(); }}>Choose</button>
                              </div>
                              <div>
                                <div style={{ height: 120, background: `url(${c.b.img}) center/cover`, borderRadius: 8, marginBottom: 8 }} />
                                <p style={{ fontWeight: 600 }}>{c.b.name}</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{c.b.desc} · {c.b.priceRange}</p>
                                <button type="button" className="btn btn-outline" style={{ marginTop: 8 }} onClick={() => { setSelectedDesign(c.b); handleProceedToBuilder(); }}>Choose</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Quote preview (for business signs) */}
                {answers.productType === 'business-sign' && (
                  <div className="card glass-panel" style={{ padding: 24, marginBottom: 32, border: '1px solid var(--accent-neon-blue)' }}>
                    <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Sparkles size={20} color="var(--accent-neon-blue)" /> Instant Quote Preview
                    </h3>
                    <div style={{ display: 'grid', gap: 8, marginBottom: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Product</span><span>{quote.product}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Size</span><span>{quote.size}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Material</span><span>{quote.material}</span></div>
                      {quote.lighting && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Lighting</span><span>{quote.lighting}</span></div>}
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}><span>Estimated cost</span><span style={{ color: 'var(--accent-neon-blue)' }}>{quote.estimatedCost}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Production time</span><span>{quote.productionTime}</span></div>
                    </div>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      <button type="button" className="btn btn-primary" onClick={handleProceedToBuilder}>Order now</button>
                      <button type="button" className="btn btn-outline" onClick={() => navigate('/quote')}>Request consultation</button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                  <button type="button" className="btn btn-primary" onClick={handleProceedToBuilder} disabled={!selectedDesign && recommendations.length > 0}>
                    {selectedDesign ? `Customize ${selectedDesign.name}` : 'Customize'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setSaved(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <Share2 size={18} /> {saved ? 'Saved ✓' : 'Save design'}
                  </button>
                  <button type="button" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Download size={18} /> Download preview
                  </button>
                  <button type="button" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => navigate('/quote')}>
                    <MessageCircle size={18} /> Let our designer improve it
                  </button>
                </div>

                <button type="button" className="btn btn-outline" style={{ marginTop: 24 }} onClick={prevStep}>Back</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <GenerativeDesignModal
        isOpen={showGenModal}
        onClose={() => setShowGenModal(false)}
        onSelectImage={handleGenSelect}
        productCategory={answers.productType}
        style={answers.style}
      />
    </>
  );
};

export default DesignWizard;
