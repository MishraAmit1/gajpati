import { Toaster } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Layout } from './components/Layout';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import OurFacility from './pages/OurFacility';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
const About = lazy(() => import('./pages/About'));
const Careers = lazy(() => import('./pages/Careers'));
const CareerDetails = lazy(() => import('./pages/CareerDetails'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Contact = lazy(() => import('./pages/Contact'));
const ProductList = lazy(() => import('./pages/ProductList'));
const NatureProducts = lazy(() => import('./pages/NatureProducts'));
const NatureProductList = lazy(() => import('./pages/NatureProductList'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster
        position="top-right"
        expand={true}
        richColors={true}
        closeButton={true}
        toastOptions={{
          style: {
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          className: 'custom-toast',
        }}
      />
      <BrowserRouter>
        <Layout>
          <Suspense fallback={<div className="flex justify-center items-center h-screen">
            <div className="animate-spin h-8 w-8 border-4 border-t-transparent border-blue-500 rounded-full"></div>
          </div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/careers/:id" element={<CareerDetails />} /> {/* Added route for job details */}
              <Route path="/our-facility" element={<OurFacility />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/nature/:slug" element={<NatureProducts />} />
              <Route path="/nature/:natureId/products" element={<NatureProductList />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/product-list" element={<ProductList />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;