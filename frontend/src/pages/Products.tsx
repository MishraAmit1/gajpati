import { useEffect, useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import bitumeImage from "../assets/bitumen.jpg"
import {
  Search,
  Download,
  Building2,
  Shield,
  Beaker,
  ArrowRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchPlantsWithStats, type PlantWithStats } from "../services/plantStats";
import { handleWhatsAppRedirect } from '../helper/whatsapp';
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [breakpoint]);

  return isMobile;
}
// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// Product interface
interface Product {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  shortDescription?: string;
  category?: string;
  certification?: string;
  images?: { url: string; alt: string; isPrimary?: boolean }[];
  brochure?: { url: string; title: string };
  plantId?: { _id?: string; name?: string; certifications?: string[] };
  natureId?: { _id?: string; name?: string };
  plants?: string[];
  plantNames?: string[];
  plantAvailability?: { state: string }[];
}

// Spinner component
export const Spinner = function Spinner({
  size = 8,
  border = 2,
  className = "",
}) {
  return (
    <div className={`flex justify-center items-center py-6 ${className}`}>
      <div
        className={`animate-spin rounded-full`}
        style={{
          height: `${size * 4}px`,
          width: `${size * 4}px`,
          borderTop: `${border}px solid #2563eb`,
          borderBottom: `${border}px solid #2563eb`,
          borderLeft: `${border}px solid transparent`,
          borderRight: `${border}px solid transparent`,
          opacity: 0.8,
        }}
      />
    </div>
  );
};

// Detect UI key from plant name (for icon/bg only)
function detectCategoryKey(name?: string) {
  const s = (name || "").toLowerCase();
  if (s.includes("gabion")) return "gabion";
  if (s.includes("bitumen") || s.includes("bituminous")) return "bitumen"; // include "bituminous"
  if (s.includes("construction") || s.includes("chemical")) return "construct";
  return "other";
}

// Fallback slug generator (if backend doesn't send slug)
const toSlug = (s?: string) =>
  (s || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const Products = () => {
  const [searchParams] = useSearchParams();
  // categoryIdFromQuery is legacy; not used for routing anymore
  const categoryIdFromQuery = searchParams.get("categoryId");
  const plantIdFromQuery = searchParams.get("plantId");
  const natureIdFromQuery = searchParams.get("natureId");

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 10;
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Fetch plant data
  const { data: plants, isLoading: plantsLoading, error: plantsError } = useQuery({
    queryKey: ['plants'],
    queryFn: fetchPlantsWithStats,
    staleTime: 5 * 60 * 1000,
  });

  function capitalizeWords(str: string) {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  // Static category configurations (for icons/backgrounds only)
  const categoryConfigs = {
    bitumen: {
      icon: Building2,
      gradient: "bg-gradient-to-br from-egyptian-blue to-violet-blue",
      bgImage: bitumeImage,
    },
    gabion: {
      icon: Shield,
      gradient: "bg-gradient-to-br from-egyptian-blue to-violet-blue",
      bgImage: "https://cdn.mos.cms.futurecdn.net/hFHLgTVFX6VJpwPDUzrEtL.jpg",
    },
    construct: {
      icon: Beaker,
      gradient: "bg-gradient-to-br from-egyptian-blue to-violet-blue",
      bgImage: "https://backgroundimages.withfloats.com/actual/5bd1af4f3f02cc0001c0f035.jpg",
    },
    other: {
      icon: Building2,
      gradient: "bg-gradient-to-br from-egyptian-blue to-violet-blue",
      bgImage: "https://via.placeholder.com/1200x300",
    },
  };
  // Desired UI order fallback (used only if slug not in priority map)
  const categoryOrder = ['gabion', 'bitumen', 'construct'];
  const isMobile = useIsMobile();

  const priorityBySlug: Record<string, number> = isMobile
    ? {
      "bituminous-products": 0,   // bituminous first on mobile
      "gabions": 1,
      "construction-chemicals": 2,
    }
    : {
      "gabions": 0,               // gabions first on desktop
      "bituminous-products": 1,
      "construction-chemicals": 2,
    };

  // Build categories from plants (keep uiKey for UI, slug for URL, id for data)
  const productCategories = useMemo(() => {
    if (!plants) return [];
    const categories = plants.map((plant) => {
      const uiKey = detectCategoryKey(plant.name);
      const config = categoryConfigs[uiKey] || categoryConfigs.other;
      const slug = (plant as any).slug || toSlug(plant.name);

      return {
        id: plant._id,
        uiKey,
        slug,
        name: plant.name,
        tagline: (plant as any).description || "Explore our range of products",
        icon: config.icon,
        gradient: config.gradient,
        bgImage: config.bgImage,
        plantId: plant._id,
      };
    });

    return categories.sort((a, b) => {
      const pa = priorityBySlug[a.slug];
      const pb = priorityBySlug[b.slug];

      if (pa !== undefined || pb !== undefined) {
        return (pa ?? 999) - (pb ?? 999);
      }

      const indexA = categoryOrder.indexOf(a.uiKey);
      const indexB = categoryOrder.indexOf(b.uiKey);
      return (indexA === -1 ? categoryOrder.length : indexA) -
        (indexB === -1 ? categoryOrder.length : indexB);
    });
  }, [plants, priorityBySlug]);

  // Current category (for hero on listing page) resolved via plantId from query
  const currentCategory = useMemo(() => {
    if (!plantIdFromQuery) return undefined;
    return productCategories.find(cat => cat.plantId === plantIdFromQuery);
  }, [productCategories, plantIdFromQuery]);

  // Helper to check if search term is meaningful
  function isValidSearchTerm(term: string) {
    return /[a-zA-Z0-9]/.test(term);
  }

  // Reset page/products when filter/search changes
  useEffect(() => {
    setPage(1);
    setProducts([]);
    setHasMore(true);
  }, [plantIdFromQuery, natureIdFromQuery, debouncedSearch]);

  // Fetch products when plantId, natureId, search, or page changes (ID-based)
  useEffect(() => {
    if (!plantIdFromQuery || !natureIdFromQuery) return;

    setLoading(true);
    setError(null);
    let url = `${import.meta.env.VITE_API_URL || "https://gajpati-backend.onrender.com"
      }/api/v1/products/search?plantId=${plantIdFromQuery}&page=${page}&limit=${PAGE_SIZE}`;

    if (natureIdFromQuery) {
      url += `&natureId=${natureIdFromQuery}`;
    }
    if (debouncedSearch.trim() !== "" && isValidSearchTerm(debouncedSearch)) {
      url += `&search=${encodeURIComponent(debouncedSearch)}`;
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        const newProducts = data.data?.products || [];
        setTotal(data.data?.total || 0);
        if (page === 1) {
          setProducts(newProducts);
        } else {
          setProducts((prev) => [...prev, ...newProducts]);
        }
        setHasMore(page * PAGE_SIZE < (data.data?.total || 0));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [plantIdFromQuery, natureIdFromQuery, debouncedSearch, page]);

  // Infinite scroll: observe sentinel
  useEffect(() => {
    if (!hasMore || loading) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((p) => p + 1);
        }
      },
      { root: null, rootMargin: "0px", threshold: 1.0 }
    );
    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);
    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [hasMore, loading]);

  // Decide view: show grid unless both plantId and natureId are present
  const showCategoryGrid = !(plantIdFromQuery && natureIdFromQuery);

  return (
    <>
      <Helmet>
        <title>Products | Gajpati Industries | Leading Infrastructure Chemicals Manufacturer</title>
        <meta
          name="description"
          content="Explore Gajpati Industries' range of infrastructure chemicals products, trusted by 5000+ projects since 1998."
        />
        <meta
          name="keywords"
          content="Gajpati Industries, products, infrastructure chemicals, manufacturing, India"
        />
        <meta
          property="og:title"
          content="Products | Gajpati Industries | Infrastructure Chemicals Manufacturer"
        />
        <meta
          property="og:description"
          content="Explore Gajpati Industries' range of infrastructure chemicals products, trusted by 5000+ projects since 1998."
        />
        <meta property="og:image" content="https://gajpatiindustries.com/images/products-og.jpg" />
        <meta property="og:url" content="https://gajpatiindustries.com/products" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Products | Gajpati Industries | Infrastructure Chemicals Manufacturer"
        />
        <meta
          name="twitter:description"
          content="Explore Gajpati Industries' range of infrastructure chemicals products, trusted by 5000+ projects since 1998."
        />
        <meta name="twitter:image" content="https://gajpatiindustries.com/images/products-og.jpg" />
        <link rel="canonical" href="https://gajpatiindustries.com/products" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Gajpati Industries",
            "url": "https://gajpatiindustries.com",
            "logo": "https://gajpatiindustries.com/images/logo.webp",
            "description": "India's premier infrastructure chemicals manufacturer since 1998, trusted by 5000+ projects.",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-123-456-7890",
              "contactType": "Customer Service",
            },
            "sameAs": ["https://twitter.com/yourtwitter", "https://linkedin.com/company/yourlinkedin"],
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gajpatiindustries.com" },
              { "@type": "ListItem", "position": 2, "name": "About", "item": "https://gajpatiindustries.com/about" },
            ],
          })}
        </script>
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-egyptian-blue to-violet-blue text-white py-12 sm:py-16 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-hero mb-3 sm:mb-4">
                Industrial Infrastructure Solutions
              </h1>
              <p className="text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl sm:max-w-3xl mx-auto">
                Discover our comprehensive range of industrial-grade solutions designed for modern infrastructure needs
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:mt-0 mt-10">
          {showCategoryGrid ? (
            <section className="py-8 sm:py-10 bg-gradient-to-b from-background to-slate-50 -mt-10">
              <div className="container-industrial">
                {plantsLoading ? (
                  <div className="text-center py-8 sm:py-12">
                    <Spinner size={8} border={3} />
                  </div>
                ) : plantsError ? (
                  <div className="text-center py-8 sm:py-12">
                    <p className="text-red-500 text-sm sm:text-base">{(plantsError as any).message}</p>
                    <Button variant="outline" onClick={() => window.location.reload()} className="mt-3 sm:mt-4 text-sm sm:text-base">
                      Retry
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {productCategories.map((category, index) => (
                      <Link
                        to={`/nature/${category.slug}`}
                        key={category.id}
                        className="block group"
                        onClick={() => console.log(`Navigating to /nature/${category.slug}`)}
                      >
                        <div
                          className="card-industrial p-3 sm:p-4 text-center rounded-lg 
               border border-yellow-500 bg-white shadow-sm hover:shadow-xl 
               transition-all duration-300 h-[350px] sm:h-[410px]"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="relative mb-4 sm:mb-6 overflow-hidden rounded-lg">
                            <img
                              src={category.bgImage}
                              alt={category.name}
                              className="w-full h-40 sm:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 p-2 sm:p-3 bg-white rounded-lg shadow-md">
                              <category.icon className="w-6 h-6 sm:w-8 sm:h-8 text-egyptian-blue" />
                            </div>
                          </div>
                          <h3 className="font-display font-semibold text-lg sm:text-xl lg:text-2xl text-eerie-black mb-2 sm:mb-3 group-hover:text-egyptian-blue transition-colors">
                            {capitalizeWords(category.name || "Category")}
                          </h3>
                          <p className="text-gray-600 text-sm sm:text-sm mb-3 sm:mb-4">
                            {category.tagline}
                          </p>
                          <div className="flex items-center justify-center text-egyptian-blue text-sm sm:text-base font-medium group-hover:text-violet-blue transition-colors">
                            <span>Explore Product Types</span>
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </section>
          ) : (
            <section className="py-8 sm:py-10">
              <div className="relative overflow-hidden mb-4 sm:mb-6 rounded-xl shadow-lg transform transition-all duration-500 ease-in-out hover:scale-[1.01] h-[160px] sm:h-[200px] lg:h-[240px]">
                <div className="absolute inset-0 opacity-50">
                  <img
                    src={currentCategory?.bgImage || "https://via.placeholder.com/1200x300"}
                    alt={currentCategory?.name ? `${currentCategory.name} background` : "Category background"}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="relative z-10 p-4 sm:p-6 lg:p-8 text-white h-full flex items-center">
                  <div className="max-w-xl sm:max-w-2xl">
                    <h3 className="font-display font-bold text-lg sm:text-xl lg:text-2xl mb-2 sm:mb-3 leading-tight">
                      {currentCategory?.name || "Category"}™
                    </h3>
                    <p className="text-sm sm:text-base lg:text-lg mb-3 sm:mb-4 opacity-90 leading-relaxed">
                      {currentCategory?.tagline || "Explore our range of products"}
                    </p>
                    <Button
                      variant="secondary"
                      className="bg-amber text-eerie-black hover:bg-amber/90 text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 w-auto min-w-[140px] sm:min-w-[160px]"
                    >
                      <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Download Category Brochure
                    </Button>
                  </div>
                </div>
              </div>

              {/* Filters Section */}
              <div className="mb-6 sm:mb-8">
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-2">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search products by name, description, or specifications..."
                          className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border border-gray-200 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-egyptian-blue focus:border-egyptian-blue transition-all duration-300 placeholder-gray-400 bg-gray-50 hover:bg-white focus:bg-white shadow-sm"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          aria-label="Search products"
                        />
                        <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      </div>
                    </div>
                    {searchTerm && (
                      <div className="pt-3 sm:pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                          <span className="text-xs sm:text-sm font-medium text-gray-700">
                            Active Filters
                          </span>
                          <button
                            onClick={() => setSearchTerm("")}
                            className="text-xs sm:text-sm font-medium text-egyptian-blue hover:text-violet-blue transition-colors px-2 sm:px-3 py-1 rounded-md hover:bg-blue-50"
                            aria-label="Clear all filters"
                          >
                            Clear All
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          <Badge
                            variant="secondary"
                            className="text-xs bg-blue-100 text-egyptian-blue hover:bg-blue-200 transition-colors cursor-pointer px-2 sm:px-3 py-1"
                            onClick={() => setSearchTerm("")}
                          >
                            Search: "{searchTerm}"
                            <span className="ml-1 font-bold">×</span>
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Results Header */}
              <div className="mb-4 sm:mb-6 bg-gray-50 rounded-md px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  {loading ? "Loading..." : `Showing ${products.length} of ${total} products`}
                </p>
              </div>

              {/* Products Grid */}
              {error && <div className="text-center text-red-500 text-sm sm:text-base py-8 sm:py-12">{error}</div>}
              {loading && page === 1 ? (
                <div className="text-center py-8 sm:py-12">
                  <Spinner size={8} border={3} />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {productCategories.map((category, index) => (
                      <Link
                        to={`/nature/${category.slug}`}
                        key={category.id}
                        className={`block group ${category.uiKey === "bitumen" ? "lg:col-span-2 lg:row-span-2" : ""
                          }`}
                      >
                        <div
                          className={`card-industrial p-3 sm:p-4 text-center hover-lift fade-in rounded-lg border border-yellow-500 bg-white shadow-sm hover:shadow-xl transition-all duration-300 
        ${category.uiKey === "bitumen" ? "h-[420px]" : "h-[340px]"}`}
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="relative mb-3 sm:mb-4 overflow-hidden rounded-lg">
                            <img
                              src={category.bgImage}
                              alt={category.name}
                              className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 
              ${category.uiKey === "bitumen" ? "h-56 sm:h-72" : "h-40 sm:h-48"}`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 p-2 sm:p-3 bg-white rounded-lg shadow-md">
                              <category.icon className="w-6 h-6 sm:w-8 sm:h-8 text-egyptian-blue" />
                            </div>
                          </div>
                          <h3
                            className={`font-display font-semibold text-lg sm:text-xl lg:text-2xl text-eerie-black mb-2 sm:mb-3 
          ${category.uiKey === "bitumen" ? "text-3xl" : ""}`}
                          >
                            {capitalizeWords(category.name || "Category")}
                          </h3>
                          <p className="text-gray-600 text-sm sm:text-sm mb-3 sm:mb-4">
                            {category.tagline}
                          </p>
                          <div className="flex items-center justify-center text-egyptian-blue text-sm sm:text-base font-medium group-hover:text-violet-blue transition-colors">
                            <span>Explore Product Types</span>
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {products.map((product) => (
                      <Card
                        key={product._id || product.id}
                        className="shadow-card hover:shadow-lg transition-shadow duration-300"
                      >
                        <CardContent className="p-0">
                          <div className="h-28 sm:h-32 bg-gradient-to-br from-platinum to-white border-b flex items-center justify-center">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0].url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-3xl sm:text-4xl text-egyptian-blue/20 font-bold">
                                {product.name?.charAt(0) || "P"}
                              </div>
                            )}
                          </div>

                          {/* 👇 internal section - compact */}
                          <div className="p-2 sm:p-3">
                            <div className="flex items-start justify-between mb-1 sm:mb-2">
                              <Badge variant="secondary" className="text-[10px] sm:text-xs">
                                {product.plantId?.name || "Plant"}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="text-[10px] sm:text-xs text-amber border-amber"
                              >
                                {product.certification || product.plantId?.certifications?.[0] || "Certified"}
                              </Badge>
                            </div>

                            <h3 className="font-display font-semibold text-sm sm:text-base mb-1">
                              {product.name}
                            </h3>
                            <p className="text-gray-600 text-xs leading-snug mb-2">
                              {product.description || product.shortDescription}
                            </p>

                            <div className="flex gap-2">
                              <Button
                                asChild
                                variant="enterprise"
                                size="xs"
                                className="min-w-[100px] px-2 py-1 text-xs"
                              >
                                <Link to={`/product/${product._id || product.id}`}>View</Link>
                              </Button>
                              {product.brochure?.url && (
                                <Button asChild variant="download" size="xs" className="px-2 py-1 text-xs">
                                  <a href={product.brochure.url} target="_blank" rel="noopener noreferrer">
                                    <Download className="h-3 w-3" />
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {hasMore && !loading && (
                      <div ref={sentinelRef} style={{ height: 1 }} />
                    )}
                    {loading && page > 1 && (
                      <div className="col-span-full flex justify-center py-6 sm:py-8 transition-opacity duration-300">
                        <Spinner size={8} border={3} />
                      </div>
                    )}
                  </div>
                </>
              )}
            </section>
          )}
        </div>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 bg-gradient-to-br from-egyptian-blue to-violet-blue text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-h2 mb-4 sm:mb-6">
              Need Custom Solutions?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 leading-relaxed max-w-xl sm:max-w-2xl mx-auto">
              Our technical team can develop specialized formulations tailored to
              your specific project requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center items-center">
              <Button variant="action" size="xl" asChild>
                <Link to="/contact">Request Custom Quote</Link>
              </Button>
              <Button variant="trust" size="xl" asChild>
                <Link to="/products">Speak with Technical Expert</Link>
              </Button>
            </div>
          </div>
        </section>
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
      </div>
    </>
  );
};

export default Products;