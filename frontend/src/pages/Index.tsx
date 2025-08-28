import { useCallback, useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import LazyLoad from 'react-lazyload';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Link } from 'react-router-dom';
import { fetchPlantsWithStats, type PlantWithStats } from '../services/plantStats';
import heroImage1 from '../assets/111.webp';
import heroImage2 from '../assets/1111.webp';
import heroImage3 from '../assets/11111.webp';
import heroImage4 from '../assets/111111.webp';
import { ArrowRight, CheckCircle, Factory, Shield, Award, Building2, Beaker, MessageCircleCode, MapPin } from 'lucide-react';
import { fetchProducts } from '../services/product';
import type { Product } from '../services/product';
import QuoteModal from "../components/QuoteModal";
import { handleWhatsAppRedirect } from '../helper/whatsapp';
import ourFacilityImage from '../assets/about.jpg';
import Blog from '../components/Blog';

const Container = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 ${className}`}>{children}</div>
);
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [breakpoint]);

  return isMobile;
}
const LoadingSpinner = () => (
  <div className="text-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber mx-auto"></div>
    <p className="text-gray-600 mt-4">Loading...</p>
  </div>
);
const ErrorFallback = ({ error }: { error: string }) => (
  <div className="text-center py-12">
    <p className="text-red-500">{error}</p>
    <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
      Retry
    </Button>
  </div>
);

const Index = () => {
  const getPlantIcon = useCallback((plantName: string) => {
    const name = plantName.toLowerCase();
    if (name.includes('bitumen')) {
      return <Building2 className="h-9 w-9 text-white" />;
    } else if (name.includes('gabions')) {
      return <Shield className="h-9 w-9 text-white" />;
    } else if (name.includes('construction') || name.includes('chemical')) {
      return <Beaker className="h-9 w-9 text-white" />;
    } else {
      return <Factory className="h-9 w-9 text-white" />;
    }
  }, []);

  const { data: plants, isLoading: plantsLoading, error: plantsError } = useQuery({
    queryKey: ['plants'],
    queryFn: fetchPlantsWithStats,
    staleTime: 5 * 60 * 1000,
  });

  // Define the desired plant order
  const isMobile = useIsMobile();
  const plantOrder = isMobile
    ? ['bituminous-products', 'gabions', 'construction-chemicals'] // mobile order
    : ['gabions', 'bituminous-products', 'construction-chemicals']; // desktop order

  // Define static category configurations
  const categoryConfigs = {
    'bituminous-products': {
      icon: Building2,
    },
    gabion: { icon: Shield },
    construct: { icon: Beaker },
  };

  // Dynamically create plantCategories from plant data
  const plantCategories = useMemo(() => {
    if (!plants) return [];
    const categories = plants.map((plant) => {
      const nameLower = plant.name.toLowerCase().replace(/\s+/g, '-');
      let categoryId = 'other';
      let config = {
        icon: Factory,
      };

      if (nameLower.includes('bituminous-products') || nameLower.includes('bitumen')) {
        categoryId = 'bituminous-products';
        config = categoryConfigs['bituminous-products'];
      } else if (nameLower.includes('gabions')) {
        categoryId = 'gabions';
        config = categoryConfigs.gabion;
      } else if (nameLower.includes('construction') || nameLower.includes('chemical')) {
        categoryId = 'construct';
        config = categoryConfigs.construct;
      }

      return {
        id: categoryId,
        name: plant.name,
        plantId: plant._id,
        icon: config.icon,
      };
    });

    // Sort categories based on the predefined order
    return categories.sort((a, b) => {
      const indexA = plantOrder.indexOf(a.id);
      const indexB = plantOrder.indexOf(b.id);
      return (indexA === -1 ? plantOrder.length : indexA) - (indexB === -1 ? plantOrder.length : indexB);
    });
  }, [plants]);

  // Create dynamic plantMap using useMemo to avoid recalculating on every render
  const plantMap = useMemo(() => {
    const map: { [key: string]: string } = {};
    if (plants) {
      plants.forEach((plant) => {
        const name = plant.name.toLowerCase().replace(/\s+/g, '-');
        if (name.includes('bituminous-products') || name.includes('bitumen')) {
          map['bituminous-products'] = plant._id;
        } else if (name.includes('gabions')) {
          map['gabions'] = plant._id; // ✅ consistent plural
        } else if (name.includes('construction') || name.includes('chemical')) {
          map['construction-chemicals'] = plant._id; // ✅ consistent slug
        }
      });
    }
    return map;
  }, [plants]);

  const { data: flagshipProducts, isLoading: flagshipLoading, error: flagshipError } = useQuery({
    queryKey: ['flagshipProducts'],
    queryFn: () => fetchProducts(20),
    staleTime: 5 * 60 * 1000,
    enabled: !!Object.keys(plantMap).length,
    select: (allProducts) => {
      const flagship: Product[] = [];

      // Exact 3 categories in order
      ['bituminous-products', 'gabions', 'construction-chemicals'].forEach((category) => {
        const plantId = plantMap[category];  // map already cleaned
        if (plantId) {
          // pick exactly 1 product of this plant
          const prod = allProducts.find((p) => p.plantId && p.plantId._id === plantId);
          if (prod) flagship.push(prod);
        }
      });

      return flagship;
    },
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const backgroundImages = [heroImage1, heroImage2, heroImage3, heroImage4];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length]);
  return (
    <>
      <Helmet>
        <title>Gajpati Industries | India's Premier Infrastructure Chemicals Manufacturer</title>
        <meta
          name="description"
          content="Trusted by 5000+ projects, Gajpati Industries offers IS/ASTM certified infrastructure chemicals from 5 plants across India since 1998."
        />
        <meta
          name="keywords"
          content="infrastructure chemicals, eco-friendly products, Gajpati Industries, manufacturing plants, India"
        />
        <meta property="og:title" content="Gajpati Industries | Infrastructure Chemicals Manufacturer" />
        <meta
          property="og:description"
          content="Trusted by 5000+ projects, Gajpati Industries offers IS/ASTM certified infrastructure chemicals from 5 plants across India since 1998."
        />
        <meta property="og:image" content="https://gajpatiindustries.com/images/hero-manufacturing.jpg" />
        <meta property="og:url" content="https://gajpatiindustries.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Gajpati Industries | Infrastructure Chemicals Manufacturer" />
        <meta
          name="twitter:description"
          content="Trusted by 5000+ projects, Gajpati Industries offers IS/ASTM certified infrastructure chemicals from 5 plants across India since 1998."
        />
        <meta name="twitter:image" content="https://gajpatiindustries.com/images/hero-manufacturing.jpg" />
        <link rel="canonical" href="https://gajpatiindustries.com" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Gajpati Industries",
            "url": "https://gajpatiindustries.com",
            "logo": "https://gajpatiindustries.com/images/logo.webp",
            "description": "India's premier infrastructure chemicals manufacturer, trusted by 5000+ projects since 1998.",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-123-456-7890",
              "contactType": "Customer Service",
            },
            "sameAs": ["https://twitter.com/yourtwitter", "https://linkedin.com/company/yourlinkedin"],
          })}
        </script>
      </Helmet>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-hero text-white py-12 sm:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div
            className="absolute inset-0 flex transition-transform duration-1000 ease-in-out"
            style={{
              transform: `translateX(-${currentImageIndex * 100}vw)`,
              width: `${backgroundImages.length * 101}%`
            }}
          >
            {backgroundImages.map((image, index) => (
              <div
                key={index}
                className="h-full bg-cover bg-center bg-no-repeat opacity-30"
                style={{
                  backgroundImage: `url(${image})`,
                  width: `${100 / backgroundImages.length}%`
                }}
              />
            ))}
          </div>
          {/* Dots Indicator (optional) */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {backgroundImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex
                  ? 'bg-amber w-8'
                  : 'bg-white/50 hover:bg-white/70'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <div className="relative max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="font-display font-bold text-3xl sm:text-5xl lg:text-7xl mb-4 sm:mb-6 leading-tight">
                India's Premier
                <br />
                <span className="text-amber">Infrastructure Materials</span>
                <br />
                Partner
              </h1>
              <p className="text-base sm:text-xl leading-relaxed max-w-2xl sm:max-w-4xl mx-auto mb-6 sm:mb-8">
                Building a stronger India, together. IS/ASTM certified products from our manufacturing plant in Jammu & Kashmir, powering infrastructure development since 2020.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center items-center w-full max-w-sm sm:max-w-none mx-auto">
                <Button
                  variant="cta"
                  size="lg"
                  asChild
                  className="w-auto min-w-[160px] px-3 py-2 sm:min-w-[200px] sm:px-4 sm:py-8 lg:min-w-[240px] lg:px-6 lg:py-7 text-base sm:text-lg"
                >
                  <Link to="/products">
                    Explore Industrial Solutions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="trust"
                  size="lg"
                  className="w-auto min-w-[160px] px-3 py-2 sm:min-w-[200px] sm:px-4 sm:py-8 lg:min-w-[240px] lg:px-6 lg:py-6 text-base sm:text-lg"
                >
                  Download Company Profile
                </Button>
              </div>
              {/* Trust Indicators */}
              <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-6 mt-8 sm:mt-12 text-xs sm:text-sm">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-amber" />
                  ISO / BIS Certified
                </div>
                <div className="flex items-center">
                  <Factory className="h-4 w-4 mr-2 text-amber" />
                  Manufacturing Plant at J&K
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-2 text-amber" />
                  5+ Years Experience
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Facility Overview */}
        {/* <section className="py-12 sm:py-16 lg:py-20 bg-platinum/30">
          <Container>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-h1 text-egyptian-blue mb-4 sm:mb-6">
                  About Gajpati Industries
                </h2>
                <div className="space-y-4 text-gray-700 text-sm sm:text-base leading-relaxed">
                  <p>
                    Founded in 2020, Gajpati Industries began as a vision to simplify and modernize the infrastructure material supply chain in India. Backed by the legacy and leadership of A&T Infracon, our sister concern, we've rapidly evolved into a trusted brand known for quality, scalability, and innovation.
                  </p>
                  <p>
                    Our expertise spans across critical categories such as:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Bitumen & Emulsions for road construction and maintenance</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Gabion Wire Structures for slope protection and erosion control</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Construction Chemicals for enhanced structural performance</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Waterproofing & Sealants for long-lasting protection</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Concrete Admixtures for superior concrete performance</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Curing Compounds & Epoxy Systems for durability</span>
                    </li>
                  </ul>
                  <p>
                    With strategically placed stock points, field engineers, and a responsive support network, Gajpati ensures that infrastructure developers, government agencies, and contractors get the right material, at the right time, anywhere in India.
                  </p>
                </div>
              </div>
              <div className="relative">
                <LazyLoad height={400} offset={100}>
                  <div className="rounded-lg overflow-hidden shadow-xl">
                    <img
                      src={ourFacilityImage}
                      alt="Gajpati Industries - Building India's Infrastructure"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </LazyLoad>
                <Badge className="absolute top-4 right-4 bg-egyptian-blue text-white">
                  <MapPin className="h-4 w-4 mr-1" />
                  Since 2020
                </Badge>
              </div>
            </div>
          </Container>
        </section> */}
        {/* Plant Cards Section */}
        <LazyLoad height={200} offset={100}>
          <section className="py-8 sm:py-16 bg-white">
            <Container>
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="font-display font-bold text-2xl sm:text-4xl text-egyptian-blue mb-2 sm:mb-4">
                  Infrastructure Material Solutions
                </h2>
                <p className="text-gray-600 max-w-xl sm:max-w-3xl mx-auto text-sm sm:text-base">
                  Tailored product categories that deliver strength, reliability, and performance for every infrastructure challenge.
                </p>
              </div>
              {plantsLoading ? (
                <LoadingSpinner />
              ) : plantsError ? (
                <ErrorFallback error={plantsError.message} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {plantCategories.map((category) => (
                    <Card key={category.plantId} className="shadow-card hover:shadow-xl transition-all duration-300 group">
                      <CardContent className="p-4 sm:p-6">
                        <div className="text-center mb-4">
                          <div className="flex justify-center mb-3">
                            <div
                              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${category.name.toLowerCase().includes('bitumen')
                                ? 'bg-blue-500'
                                : category.name.toLowerCase().includes('gabions')
                                  ? 'bg-gray-500'
                                  : category.name.toLowerCase().includes('construction') || category.name.toLowerCase().includes('chemical')
                                    ? 'bg-yellow-500'
                                    : 'bg-egyptian-blue'
                                }`}
                            >
                              <category.icon className="h-9 w-9 text-white" />
                            </div>
                          </div>
                          <h3 className="font-display uppercase font-bold text-lg sm:text-xl text-egyptian-blue mb-1 sm:mb-2 group-hover:text-violet-blue">
                            {category.name}
                          </h3>
                          <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">
                            {plants.find((p) => p._id === category.plantId)?.description || 'Explore our range of products'}
                          </p>
                          <Badge variant="outline" className="mb-2 sm:mb-4">
                            {plants.find((p) => p._id === category.plantId)?.totalProductCount || 0} Products Available
                          </Badge>
                        </div>
                        {/* <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                          {plants.find((p) => p._id === category.plantId)?.topNatures.map((nature) => (
                            <div key={nature._id} className="flex justify-between items-center text-xs sm:text-sm">
                              <span className="text-gray-700">{nature.name}</span>
                              <Badge variant="outline" className="text-xs">{nature.productCount}</Badge>
                            </div>
                          ))}
                        </div> */}
                        <Button variant="enterprise" size="sm" className="w-full" asChild>
                          <Link to={`/nature/${category.id}`} onClick={() => console.log(`Navigating to /nature/${category.id}`)}>
                            View All Products
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </Container>
          </section>
        </LazyLoad>

        {/* Trust Section */}
        <section className="py-8 sm:py-16 bg-gradient-trust px-4">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div>
                <h2 className="font-display font-bold text-2xl sm:text-4xl text-egyptian-blue mb-4 sm:mb-6">
                  Trusted by India's Leading Infrastructure Projects
                </h2>
                <p className="mb-8">Backed by 25+ years of legacy through our parent company, A&T Infracon — Gajpati Industries is committed to supplying performance-driven materials across India’s most critical infrastructure projects.</p>
                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 sm:mr-3" />
                    <span className="text-sm sm:text-base">Engineered for high-performance metro and rail infrastructure</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 sm:mr-3" />
                    <span className="text-sm sm:text-base">Ideal for expressways & road maintenance contracts</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 sm:mr-3" />
                    <span className="text-sm sm:text-base">Suitable for coastal port & industrial infrastructure</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 sm:mr-3" />
                    <span className="text-sm sm:text-base">Formulated for urban development & commercial building projects</span>
                  </div>
                </div>
                <Button variant="action" size="lg" asChild className="w-auto min-w-[160px] px-3 py-2 sm:min-w-[200px] sm:px-4 sm:py-2">
                  <Link to="/about">Learn Our Story</Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                <Card className="shadow-card text-center p-4 sm:p-6">
                  <div className="text-xl sm:text-2xl font-bold text-egyptian-blue mt-4">Backed by A&T Infracon</div>
                  <div className="text-gray-600 text-sm sm:text-base">Since 1998</div>
                </Card>
                <Card className="shadow-card text-center p-4 sm:p-6">
                  <div className="text-3xl sm:text-5xl md:font-[500] font-bold text-egyptian-blue mt-5">5+ </div>
                  <div className="text-gray-600 text-sm sm:text-base">Years of R&D</div>
                </Card>
                <Card className="shadow-card text-center p-4 sm:p-6">
                  <div className="text-xl sm:text-2xl font-bold text-egyptian-blue">Complete Portfolio</div>
                  <div className="text-gray-600 text-sm sm:text-base">Bitumen, Gabions & Construction Chemicals</div>
                </Card>
                <Card className="shadow-card text-center p-4 sm:p-6">
                  <div className="text-xl sm:text-2xl font-bold text-egyptian-blue mt-3">Pan-India <br />Reach</div>
                  <div className="text-gray-600 text-sm sm:text-base">Supply Capability</div>
                </Card>
              </div>
            </div>
          </Container>
        </section>

        {/* Flagship Products */}
        <LazyLoad height={200} offset={100}>
          <section className="py-8 sm:py-16 bg-white px-4">
            <Container>
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="font-display font-bold text-2xl sm:text-4xl text-egyptian-blue mb-2 sm:mb-4">
                  Flagship Products
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">Industry-leading solutions for critical applications</p>
              </div>
              {flagshipLoading ? (
                <LoadingSpinner />
              ) : flagshipError ? (
                <ErrorFallback error={flagshipError.message} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
                  {flagshipProducts?.map((product, index) => (
                    <Card
                      key={product._id || product.id || index}
                      className="shadow-card hover:shadow-xl transition-shadow duration-300"
                    >
                      <CardContent className="p-4 sm:p-6">
                        <div className="h-32 sm:h-40 w-full bg-gradient-to-br from-platinum to-white rounded-lg mb-3 sm:mb-4 flex items-center justify-center overflow-hidden">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={`${product.images.find(img => img.isPrimary)?.url || product.images[0].url}?format=webp&quality=80`}
                              alt={product.images.find(img => img.isPrimary)?.alt || `Image of ${product.name}`}
                              className="h-full w-full object-cover rounded-lg"
                              loading="lazy"
                            />
                          ) : (
                            <div className="text-4xl text-egyptian-blue/30">📦</div>
                          )}
                        </div>
                        <Badge variant="secondary" className="mb-1 sm:mb-2">
                          {product.category || 'Product'}
                        </Badge>
                        <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Gajpati {product.abbreviation}</h3>
                        <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-4">{product.shortDescription}</p>
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                          <Badge variant="outline" className="text-amber border-amber text-xs">
                            {product.certification || 'Certified'}
                          </Badge>
                          <Button variant="enterprise" size="sm" asChild className="w-full sm:w-auto">
                            <Link to={`/product/${product._id || product.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </Container>
          </section>
        </LazyLoad>
        <Blog />
        {/* Floating CTA */}
        <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 bg-green-600">
          <Button size="sm" className="shadow-xl bg-green-600 hover:bg-green-700" onClick={handleWhatsAppRedirect}>
            <svg style={{ width: "20px", height: "20px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
              <path
                fill="white"
                d="M 64 2 C 29.8 2 2 29.8 2 64 C 2 74.5 4.5992188 84.800391 9.6992188 93.900391 L 4.4003906 113.30078 C 3.5003906 116.40078 4.3992188 119.60039 6.6992188 121.90039 C 8.9992188 124.20039 12.200781 125.10078 15.300781 124.30078 L 35.5 119 C 44.3 123.6 54.099609 126 64.099609 126 C 98.299609 126 126.09961 98.2 126.09961 64 C 126.09961 47.4 119.7 31.899219 108 20.199219 C 96.2 8.4992187 80.6 2 64 2 z M 64 8 C 79 8 93.099609 13.800391 103.59961 24.400391 C 114.19961 35.000391 120.1 49.1 120 64 C 120 94.9 94.9 120 64 120 C 54.7 120 45.399219 117.59922 37.199219 113.19922 C 36.799219 112.99922 36.300781 112.80078 35.800781 112.80078 C 35.500781 112.80078 35.3 112.80039 35 112.90039 L 13.699219 118.5 C 12.199219 118.9 11.200781 118.09922 10.800781 117.69922 C 10.400781 117.29922 9.6 116.30078 10 114.80078 L 15.599609 94.199219 C 15.799609 93.399219 15.700781 92.600391 15.300781 91.900391 C 10.500781 83.500391 8 73.8 8 64 C 8 33.1 33.1 8 64 8 z M 64 17 C 38.1 17 17 38 17 64 C 17 72.3 19.200781 80.4 23.300781 87.5 C 24.900781 90.3 25.3 93.599219 24.5 96.699219 L 21.599609 107.19922 L 32.800781 104.30078 C 33.800781 104.00078 34.800781 103.90039 35.800781 103.90039 C 37.800781 103.90039 39.8 104.40039 41.5 105.40039 C 48.4 109.00039 56.1 111 64 111 C 89.9 111 111 89.9 111 64 C 111 51.4 106.09922 39.599219 97.199219 30.699219 C 88.399219 21.899219 76.6 17 64 17 z M 43.099609 36.699219 L 45.900391 36.699219 C 47.000391 36.699219 48.099219 36.799219 49.199219 39.199219 C 50.499219 42.099219 53.399219 49.399609 53.699219 50.099609 C 54.099219 50.799609 54.300781 51.699219 53.800781 52.699219 C 53.300781 53.699219 53.100781 54.299219 52.300781 55.199219 C 51.600781 56.099219 50.699609 57.100781 50.099609 57.800781 C 49.399609 58.500781 48.6 59.300781 49.5 60.800781 C 50.4 62.300781 53.299219 67.1 57.699219 71 C 63.299219 76 68.099609 77.600781 69.599609 78.300781 C 71.099609 79.000781 71.900781 78.900391 72.800781 77.900391 C 73.700781 76.900391 76.5 73.599609 77.5 72.099609 C 78.5 70.599609 79.500781 70.900391 80.800781 71.400391 C 82.200781 71.900391 89.400391 75.499219 90.900391 76.199219 C 92.400391 76.899219 93.399219 77.300391 93.699219 77.900391 C 94.099219 78.700391 94.100391 81.599609 92.900391 85.099609 C 91.700391 88.499609 85.700391 91.899609 82.900391 92.099609 C 80.200391 92.299609 77.699219 93.300391 65.199219 88.400391 C 50.199219 82.500391 40.7 67.099609 40 66.099609 C 39.3 65.099609 34 58.100781 34 50.800781 C 34 43.500781 37.799219 40 39.199219 38.5 C 40.599219 37 42.099609 36.699219 43.099609 36.699219 z"
              />
            </svg>
            Quick Quote
          </Button>
        </div>

        {/* Final CTA */}
        <section className="py-8 sm:py-16 bg-gradient-hero text-white px-4">
          <Container>
            <div className="text-center">
              <h2 className="font-display font-bold text-xl sm:text-3xl md:text-4xl mb-4 sm:mb-6">
                Ready to Power Your Next Infrastructure Project?
              </h2>
              <p className="text-base sm:text-xl mb-6 sm:mb-8 leading-relaxed">
                Join our list of successful partnerships. Get expert consultation, technical specifications, and competitive pricing tailored to your requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center items-center">
                <Button variant="action" size="xl" asChild>
                  <Link to="/contact">Get Expert Consultation</Link>
                </Button>
                <Button variant="trust" size="xl" asChild>
                  <Link to="/products">Browse Product Catalog</Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </div>
      <QuoteModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </>
  );
};

export default Index;