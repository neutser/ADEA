import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

function ConfigureRedirect() {
  const { search } = useLocation();
  const withDefaultProduct = search.includes('product=') ? search : `${search ? `${search}&` : '?'}product=craft-keychain`;
  return <Navigate to={`/marketplace/configure${withDefaultProduct}`} replace />;
}
function StudioRedirect() {
  const { search } = useLocation();
  const withDefaultProduct = search.includes('product=') ? search : `${search ? `${search}&` : '?'}product=craft-keychain`;
  return <Navigate to={`/marketplace/configure${withDefaultProduct}`} replace />;
}
import { PageMeta } from '@/components/PageMeta';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import AnalyticsTracker from '@/components/AnalyticsTracker';

import Home from '@/pages/Home';
import Shop from '@/pages/Shop';
import ProductDetail from '@/pages/ProductDetail';
import Portfolio from '@/pages/Portfolio';
import BusinessSolutions from '@/pages/BusinessSolutions';
import Quote from '@/pages/Quote';
import Contact from '@/pages/Contact';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import CheckoutSuccess from '@/pages/CheckoutSuccess';
import Login from '@/pages/Login';
import LocalSeoLanding from '@/pages/LocalSeoLanding';
import CraftsHome from '@/pages/Crafts/CraftsHome';
import CraftProduction from '@/pages/Crafts/CraftProduction';
import ApparelHome from '@/pages/Apparel/ApparelHome';
import BusinessSigns from '@/pages/BusinessSigns';
import BusinessSignSubPage from '@/pages/BusinessSignSubPage';
import PersonalizedGifts from '@/pages/PersonalizedGifts';
import WeddingEvent from '@/pages/WeddingEvent';
import HomeDecor from '@/pages/HomeDecor';
import PetProducts from '@/pages/PetProducts';
import CorporateGifts from '@/pages/CorporateGifts';
import DesignWizard from '@/pages/DesignWizard';
import DesignFlow from '@/pages/DesignFlow';
import CaseStudies from '@/pages/CaseStudies';
import Blog from '@/pages/Blog';
import MarketplaceHome from '@/pages/MarketplaceHome';
import DynamicConfigurator from '@/pages/DynamicConfigurator';
import CustomizationStudio from '@/pages/CustomizationStudio';
import CreatorStorefronts from '@/pages/Marketplace/CreatorStorefronts';
import StorefrontDetailPage from '@/pages/Marketplace/StorefrontDetail';
import AssetLibrary from '@/pages/Marketplace/AssetLibrary';
import FavoritesPage from '@/pages/Marketplace/FavoritesPage';
import SuiteDetailPage from '@/pages/Marketplace/SuiteDetail';

// Lazy-load admin routes for smaller initial bundle
const CRMLayout = lazy(() => import('@/components/CRMLayout'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const KanbanBoard = lazy(() => import('@/pages/CRM/KanbanBoard'));
const LeadFinder = lazy(() => import('@/pages/CRM/LeadFinder'));
const SocialEngine = lazy(() => import('@/pages/CRM/SocialEngine'));
const OutreachSystem = lazy(() => import('@/pages/CRM/OutreachSystem'));
const ReferralProgram = lazy(() => import('@/pages/CRM/ReferralProgram'));
const ProductionPipeline = lazy(() => import('@/pages/Production/ProductionPipeline'));
const MachineQueue = lazy(() => import('@/pages/Production/MachineQueue'));
const InventorySystem = lazy(() => import('@/pages/Production/InventorySystem'));
const FileGenerator = lazy(() => import('@/pages/Production/FileGenerator'));
const QuoteManagement = lazy(() => import('@/pages/Admin/QuoteManagement'));
const ProductListPage = lazy(() => import('@/pages/Admin/ProductListPage'));
const ProductBuilderPage = lazy(() => import('@/pages/Admin/ProductBuilderPage'));
const ClientDashboard = lazy(() => import('@/pages/Client/ClientDashboard'));

function AdminFallback() {
  return (
    <div
      className="section"
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          border: '3px solid var(--border-color)',
          borderTopColor: 'var(--accent-neon-blue)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <PageMeta />
          <a href="#main-content" className="skip-to-content">
            Skip to main content
          </a>
          <AnalyticsTracker />
          <div className="app-container">
              <Navbar />
              <main id="main-content" className="main-content" role="main">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/shop/:categoryId" element={<Shop />} />
                  <Route path="/product/:productId" element={<ProductDetail />} />
                  <Route path="/design" element={<DesignFlow />} />
                  <Route path="/design-wizard" element={<DesignWizard />} />
                  <Route path="/signs" element={<BusinessSigns />} />
                  <Route path="/signs/:subType" element={<BusinessSignSubPage />} />
                  <Route path="/gifts" element={<PersonalizedGifts />} />
                  <Route path="/wedding" element={<WeddingEvent />} />
                  <Route path="/decor" element={<HomeDecor />} />
                  <Route path="/pets" element={<PetProducts />} />
                  <Route path="/corporate" element={<CorporateGifts />} />
                  <Route path="/stationery" element={<Navigate to="/shop/stationery" replace />} />
                  <Route path="/ai-builder" element={<StudioRedirect />} />
                  <Route path="/configure" element={<ConfigureRedirect />} />
                  <Route path="/marketplace" element={<MarketplaceHome />} />
                  <Route path="/marketplace/configure" element={<DynamicConfigurator />} />
                  <Route path="/marketplace/design-studio" element={<CustomizationStudio />} />
                  <Route path="/marketplace/storefronts" element={<CreatorStorefronts />} />
                  <Route path="/marketplace/storefronts/:slug" element={<StorefrontDetailPage />} />
                  <Route path="/marketplace/assets" element={<AssetLibrary />} />
                  <Route path="/marketplace/favorites" element={<FavoritesPage />} />
                  <Route path="/marketplace/suites/:id" element={<SuiteDetailPage />} />
                  <Route path="/crafts/configurator" element={<Navigate to="/marketplace/configure?product=craft-keychain" replace />} />
                  <Route path="/apparel/configurator" element={<Navigate to="/marketplace/configure?product=craft-mug" replace />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/case-studies" element={<CaseStudies />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/solutions" element={<BusinessSolutions />} />
                  <Route path="/quote" element={<Quote />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/checkout/success" element={<CheckoutSuccess />} />
                  <Route path="/login" element={<Login />} />

                  <Route path="/location/:city/:category" element={<LocalSeoLanding />} />

                  <Route
                    path="/client"
                    element={
                      <ProtectedRoute>
                        <Suspense fallback={<AdminFallback />}>
                          <ClientDashboard />
                        </Suspense>
                      </ProtectedRoute>
                    }
                  />

                  <Route path="/crafts" element={<CraftsHome />} />
                  <Route path="/crafts/category/:id" element={<CraftsHome />} />

                  <Route path="/apparel" element={<ApparelHome />} />

                  <Route path="/studio" element={<StudioRedirect />} />
                  <Route path="/crafting-studio" element={<StudioRedirect />} />

                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <Suspense fallback={<AdminFallback />}>
                          <CRMLayout />
                        </Suspense>
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<AdminDashboard />} />
                    <Route path="pipeline" element={<KanbanBoard />} />
                    <Route path="finder" element={<LeadFinder />} />
                    <Route path="social" element={<SocialEngine />} />
                    <Route path="outreach" element={<OutreachSystem />} />
                    <Route path="referrals" element={<ReferralProgram />} />
                    <Route path="quotes" element={<QuoteManagement />} />
                    <Route path="pipeline-workflow" element={<ProductionPipeline />} />
                    <Route path="machine-queue" element={<MachineQueue />} />
                    <Route path="inventory" element={<InventorySystem />} />
                    <Route path="file-generator" element={<FileGenerator />} />
                    <Route path="craft-production" element={<CraftProduction />} />
                    <Route path="products" element={<ProductListPage />} />
                    <Route path="products/new" element={<ProductBuilderPage />} />
                    <Route path="products/:id/edit" element={<ProductBuilderPage />} />
                  </Route>
                </Routes>
              </main>
              <Footer />
            </div>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
