import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, MapPin, Beaker, ChevronRight, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Spinner } from "./Products";
import QuoteModal from "../components/QuoteModal";
import { handleWhatsAppRedirect } from '../helper/whatsapp';
import { toast } from "sonner";
import { createQuote } from "../services/quote";
import bitumen from "../assets/bitumen1.jpg";
import constructChemical from "../assets/construct.jpg";

const productCategories = [
    {
        id: "bituminous-products",
        name: "Bituminous Products",
        tagline:
            "Comprehensive range of CRMB, PMB, VG & PG grades for road construction and infrastructure projects.",
        bgImage: bitumen,
        gradient: "from-indigo-900/90 via-blue-800/70 to-cyan-400/20",
        linkPdf: "https://gajpati.in/wp-content/uploads/2023/10/Bitumen-Product-Catalogue.pdf",
        plantId: "68808208cf8dba209c5a0b1d",
    },
    {
        id: "gabion",
        name: "Gabion",
        tagline:
            "Advanced epoxy adhesives, sealants, admixtures, curing compounds and waterproofing solutions.",
        bgImage: "https://cdn.mos.cms.futurecdn.net/hFHLgTVFX6VJpwPDUzrEtL.jpg",
        gradient: "from-gray-500/70 via-blue-800/80 to-gray-400/70",
        linkPdf: "https://gajpati.in/wp-content/uploads/2023/10/Gabion-Product-Catalogue.pdf",
        plantId: "68808208cf8dba209c5a0b1e",
    },
    {
        id: "construct",
        name: "Construct Chemicals",
        tagline:
            "Engineered gabion mesh, boxes and rockfall netting systems for erosion control and stabilization.",
        bgImage: constructChemical,
        gradient: "from-yellow-500/70 via-blue-800/50 to-yellow-400/70",
        linkPdf: "https://gajpati.in/wp-content/uploads/2023/10/Construct-Product-Catalogue.pdf",
        plantId: "68808208cf8dba209c5a0b1f",
    },
];

interface Product {
    _id?: string;
    id?: string;
    name: string;
    abbreviation?: string;
    slug?: string;
    description?: string;
    shortDescription?: string;
    category?: string;
    certification?: string;
    images?: { _id?: string; url: string; alt: string; isPrimary?: boolean }[];
    brochure?: { url: string; title: string };
    tds?: { url: string; title: string };
    plantId?: { _id?: string; name?: string; certifications?: string[] } | null;
    natureId?: { _id?: string; name?: string; slug?: string };
    plants?: string[];
    plantNames?: string[];
    plantAvailability?: { state: string; _id?: { $oid: string } }[];
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    technicalSpecifications?: { key: string; value: string; _id?: { $oid: string } }[];
    applications?: string[];
    isActive?: boolean;
}

interface Nature {
    _id?: string;
    name?: string;
    description?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return <div className="text-red-500 text-center py-4">Something went wrong. Please try again.</div>;
        }
        return this.props.children;
    }
}

const NatureProductList = () => {
    const { natureId } = useParams<{ natureId: string }>();
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [nature, setNature] = useState<Nature>({ name: "Nature", description: "" });
    const [currentCategory, setCurrentCategory] = useState<any>(null);
    const PAGE_SIZE = 10;
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // TDS Modal State
    const [showTDSModal, setShowTDSModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [tdsFormData, setTdsFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        city: '',
        selectedProducts: [],
    });
    const [tdsErrors, setTdsErrors] = useState<any>({});
    const [tdsLoading, setTdsLoading] = useState(false);

    useEffect(() => {
        const categoryId = searchParams.get("categoryId");
        if (categoryId) {
            const foundCategory = productCategories.find(
                (cat) => cat.plantId === categoryId  // ✅ Match plantId, not id
            );
            setCurrentCategory(foundCategory || null);
        }
    }, [searchParams]);

    useEffect(() => {
        if (!natureId) return;
        fetch(
            `${import.meta.env.VITE_API_URL || "https://gajpati-backend.onrender.com"}/api/v1/natures/${natureId}`
        )
            .then((res) => {
                if (!res.ok) throw new Error(`Failed to fetch nature: ${res.statusText}`);
                return res.json();
            })
            .then((data) => {
                setNature({
                    name: data.data?.name || "Nature",
                    description: data.data?.description || "",
                    seoTitle: data.data?.seoTitle,
                    seoDescription: data.data?.seoDescription,
                    seoKeywords: data.data?.seoKeywords,
                });
            })
            .catch((err) => {
                setError(err.message);
            });
    }, [natureId]);

    useEffect(() => {
        if (!natureId) return;
        setLoading(true);
        setError(null);
        const url = `${import.meta.env.VITE_API_URL || "https://gajpati-backend.onrender.com"}/api/v1/products/search?natureId=${natureId}&page=${page}&limit=${PAGE_SIZE}`;

        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error(`Failed to fetch products: ${res.statusText}`);
                return res.json();
            })
            .then((data) => {
                let newProducts = data.data?.products || [];

                newProducts = newProducts.sort((a, b) => {
                    const nId = typeof natureId === 'object' ? natureId._id : natureId;

                    if (nId === '688f7e61ea6a047e4ffea4ec') {
                        const exactMatch = {
                            'PMB 64-10': 1, 'PMB PG 64-10': 1, 'PG 64-10': 1,
                            'PMB 70-10': 2, 'PMB PG 70-10': 2, 'PG 70-10': 2,
                            'PMB 76-10': 3, 'PMB PG 76-10': 3, 'PG 76-10': 3,
                            'PMB 82-10': 4, 'PMB PG 82-10': 4, 'PG 82-10': 4,
                            'PMB 76-22': 5, 'PMB PG 76-22': 5, 'PG 76-22': 5
                        };

                        const cleanAbbr = (abbr) => {
                            if (!abbr) return '';
                            return abbr.replace(/^(BITMIX|Bitmix)\s+/i, '').trim();
                        };

                        const cleanA = cleanAbbr(a.abbreviation);
                        const cleanB = cleanAbbr(b.abbreviation);

                        const orderA = exactMatch[cleanA] || 999;
                        const orderB = exactMatch[cleanB] || 999;

                        return orderA - orderB;
                    }

                    const normalizeAbbr = (abbr) => {
                        if (!abbr) return '';
                        let result = abbr.replace(/^(BITMIX|Bitmix)\s+/i, '').trim();
                        if (result === 'RS 1') return 'RS-1';
                        if (result === 'SS-1 ASTM') return 'SS-1 (ASTM)';
                        if (result === 'SS-2 ASTM') return 'SS-2 (ASTM)';
                        return result;
                    };

                    const normA = normalizeAbbr(a.abbreviation);
                    const normB = normalizeAbbr(b.abbreviation);

                    const orderMap = {
                        '688086bbcf8dba209c5a0b25': {
                            'RS-1': 1, 'RS-2': 2, 'MS': 3, 'SS-1': 4,
                            'SS-1 (ASTM)': 5, 'SS-2 (ASTM)': 6, 'CME': 7,
                            'Micro': 8, 'PMBE': 9
                        },
                        '688086bbcf8dba209c5a0b29': {
                            'CRMB 60': 1, 'CRMB 55': 2, 'CRMB 50': 3
                        },
                        '688086bbcf8dba209c5a0b2c': {
                            'MC-30': 1, 'MC-70': 2, 'MC-800': 3
                        },
                        '688f7e61ea6a047e4ffea4ec': {
                            'PMB PG 64-10': 1, 'PMB PG 70-10': 2, 'PMB PG 76-10': 3,
                            'PMB PG 82-10': 4, 'PMB PG 76-22': 5
                        },
                        '688f7641800886493051d5c1': {
                            'PMB 40': 1, 'PMB 70': 2, 'PMB 120': 3
                        },
                        '688f80e9ea6a047e4ffea52d': {
                            'VG-10': 1, 'VG-30': 2, 'VG-40': 3
                        }
                    };

                    const natureOrder = orderMap[nId] || {};
                    const orderA = natureOrder[normA] || 999;
                    const orderB = natureOrder[normB] || 999;

                    return orderA - orderB;
                });

                setTotal(data.data?.total || 0);
                if (page === 1) {
                    setProducts(newProducts);
                } else {
                    setProducts((prev) => {
                        const combined = [...prev, ...newProducts];
                        return combined.sort((a, b) => {
                            const nId = typeof natureId === 'object' ? natureId._id : natureId;

                            if (nId === '688f7e61ea6a047e4ffea4ec') {
                                const exactMatch = {
                                    'PMB 64-10': 1, 'PMB PG 64-10': 1, 'PG 64-10': 1,
                                    'PMB 70-10': 2, 'PMB PG 70-10': 2, 'PG 70-10': 2,
                                    'PMB 76-10': 3, 'PMB PG 76-10': 3, 'PG 76-10': 3,
                                    'PMB 82-10': 4, 'PMB PG 82-10': 4, 'PG 82-10': 4,
                                    'PMB 76-22': 5, 'PMB PG 76-22': 5, 'PG 76-22': 5
                                };

                                const cleanAbbr = (abbr) => {
                                    if (!abbr) return '';
                                    return abbr.replace(/^(BITMIX|Bitmix)\s+/i, '').trim();
                                };

                                const cleanA = cleanAbbr(a.abbreviation);
                                const cleanB = cleanAbbr(b.abbreviation);

                                const orderA = exactMatch[cleanA] || 999;
                                const orderB = exactMatch[cleanB] || 999;

                                return orderA - orderB;
                            }

                            const normalizeAbbr = (abbr) => {
                                if (!abbr) return '';
                                let result = abbr.replace(/^(BITMIX|Bitmix)\s+/i, '').trim();
                                if (result === 'RS 1') return 'RS-1';
                                if (result === 'SS-1 ASTM') return 'SS-1 (ASTM)';
                                if (result === 'SS-2 ASTM') return 'SS-2 (ASTM)';
                                return result;
                            };

                            const normA = normalizeAbbr(a.abbreviation);
                            const normB = normalizeAbbr(b.abbreviation);

                            const orderMap = {
                                '688086bbcf8dba209c5a0b25': {
                                    'RS-1': 1, 'RS-2': 2, 'MS': 3, 'SS-1': 4,
                                    'SS-1 (ASTM)': 5, 'SS-2 (ASTM)': 6, 'CME': 7,
                                    'Micro': 8, 'PMBE': 9
                                }
                            };

                            const natureOrder = orderMap[nId] || {};
                            const orderA = natureOrder[normA] || 999;
                            const orderB = natureOrder[normB] || 999;

                            return orderA - orderB;
                        });
                    });
                }
                setHasMore(page * PAGE_SIZE < (data.data?.total || 0));
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [natureId, page]);

    useEffect(() => {
        if (!hasMore || loading) return;
        const observer = new IntersectionObserver(
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
    // TDS Modal Functions
    const handleTDSClick = (product: Product) => {
        setSelectedProduct(product);
        setTdsFormData({
            customerName: '',
            customerEmail: '',
            customerPhone: '',
            city: '',
            selectedProducts: [product?.name || ''],
        });
        setTdsErrors({});
        setShowTDSModal(true);
    };

    const handleCloseTDSModal = () => {
        setShowTDSModal(false);
        setSelectedProduct(null);
    };

    const handleTdsInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setTdsFormData((prev) => ({ ...prev, [id]: value }));
        setTdsErrors((prev) => ({ ...prev, [id]: '' }));
    };

    const validateTdsForm = () => {
        const newErrors: any = {};
        if (!tdsFormData.customerName || tdsFormData.customerName.length < 3) {
            newErrors.customerName = 'Full name is required and must be at least 3 characters';
        }
        if (!tdsFormData.customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tdsFormData.customerEmail)) {
            newErrors.customerEmail = 'A valid email address is required';
        }
        if (!tdsFormData.customerPhone || tdsFormData.customerPhone.length < 10) {
            newErrors.customerPhone = 'A valid phone number is required';
        }
        if (!tdsFormData.city || tdsFormData.city.length < 3) {
            newErrors.city = 'City is required and must be at least 3 characters';
        }
        return newErrors;
    };

    const handleTdsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateTdsForm();
        if (Object.keys(validationErrors).length > 0) {
            setTdsErrors(validationErrors);
            return;
        }

        setTdsLoading(true);

        try {
            await createQuote(tdsFormData);
            toast.success("✅ Success!", {
                description: "TDS request submitted successfully! Download will start shortly.",
                duration: 3000,
            });

            if (selectedProduct?.tds?.url) {
                setTimeout(() => {
                    window.open(selectedProduct.tds.url, '_blank');
                }, 1000);
            }

            setTimeout(() => {
                setShowTDSModal(false);
            }, 2000);

        } catch (err: any) {
            toast.error("❌ Error", {
                description: err.message || "Failed to submit request. Please try again.",
                duration: 3000,
            });
        } finally {
            setTdsLoading(false);
        }
    };
    // Dynamic SEO metadata
    const seoTitle = nature.seoTitle || `${nature.name || 'Products'} | Gajpati Industries`;
    const seoDescription = nature.seoDescription ||
        (nature.description ? `${nature.description.slice(0, 157)}...` :
            `Discover high-quality ${nature.name || 'products'} from Gajpati Industries, designed for superior performance.`);
    const seoKeywords = [
        ...(nature.seoKeywords || []),
        ...(products.flatMap(p => p.seoKeywords || [])),
        currentCategory?.name.toLowerCase() || '',
        'Gajpati Industries'
    ].filter(Boolean).slice(0, 10);

    if (!natureId) {
        return (
            <div className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center text-red-500 py-12">
                        Error: No nature ID provided in the URL.
                        <div className="mt-4">
                            <Button asChild variant="action">
                                <Link to="/products">Return to Products</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{seoTitle}</title>
                <meta name="description" content={seoDescription} />
                <meta name="keywords" content={seoKeywords.join(', ')} />
                <meta property="og:title" content={seoTitle} />
                <meta property="og:description" content={seoDescription} />
                <meta property="og:image" content={currentCategory?.bgImage || 'https://yourdomain.com/images/default-og.jpg'} />
                <meta property="og:url" content={`https://yourdomain.com/nature/${natureId}/products?categoryId=${searchParams.get("categoryId") || ''}`} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={seoTitle} />
                <meta name="twitter:description" content={seoDescription} />
                <meta name="twitter:image" content={currentCategory?.bgImage || 'https://yourdomain.com/images/default-og.jpg'} />
                <link rel="canonical" href={`https://yourdomain.com/nature/${natureId}/products?categoryId=${searchParams.get("categoryId") || ''}`} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'CollectionPage',
                        'name': seoTitle,
                        'description': seoDescription,
                        'url': `https://yourdomain.com/nature/${natureId}/products?categoryId=${searchParams.get("categoryId") || ''}`,
                        'publisher': {
                            '@type': 'Organization',
                            'name': 'Gajpati Industries',
                            'logo': { '@type': 'ImageObject', 'url': 'https://yourdomain.com/images/logo.png' },
                        },
                    })}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BreadcrumbList',
                        'itemListElement': [
                            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://yourdomain.com' },
                            { '@type': 'ListItem', 'position': 2, 'name': 'Products', 'item': 'https://yourdomain.com/products' },
                            { '@type': 'ListItem', 'position': 3, 'name': currentCategory?.name || 'Category', 'item': `https://yourdomain.com/products/${searchParams.get("categoryId") || ''}` },
                            { '@type': 'ListItem', 'position': 4, 'name': nature.name || 'Nature', 'item': `https://yourdomain.com/nature/${natureId}/products?categoryId=${searchParams.get("categoryId") || ''}` },
                        ],
                    })}
                </script>
            </Helmet>
            <div className="min-h-screen bg-background">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 bg-card border-b border-border">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                        <Link to="/" className="hover:text-foreground transition-colors">
                            Home
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link to="/products" className="hover:text-foreground transition-colors">
                            Products
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link to={`/nature/${currentCategory?.id || "products"}`}>
                            {currentCategory?.name || "Category"}
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-foreground font-medium">
                            {nature.name}
                        </span>
                    </div>
                </nav>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="relative rounded-lg overflow-hidden mb-8">
                        <div
                            className="absolute inset-0 w-full h-full bg-cover bg-center"
                            style={{
                                backgroundImage: `url('${currentCategory?.bgImage || "https://cdn.mos.cms.futurecdn.net/hFHLgTVFX6VJpwPDUzrEtL.jpg"}')`,
                            }}
                            aria-hidden="true"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-br ${currentCategory?.gradient || 'from-gray-900/90 via-gray-700/80 to-gray-400/70'}`} />
                        <div className="relative z-10 p-6 md:p-12 text-white">
                            <div className="max-w-3xl">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge variant="secondary" className="bg-accent text-accent-foreground">IS Certified</Badge>
                                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">Construction</Badge>
                                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">Eco-Safe</Badge>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold mb-4">{nature.name}</h1>
                                <p className="text-lg md:text-xl mb-6 text-white/90 leading-relaxed">
                                    {nature.description || "Explore our range of products under this category."}
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Link to={currentCategory?.linkPdf || "#"} target="_blank" className="flex items-center">
                                        <Button variant="secondary" size="lg" className="bg-accent hover:bg-accent/90 text-black">
                                            Download Complete Catalog
                                        </Button>
                                    </Link>
                                    <Button onClick={() => setIsModalOpen(true)} variant="outline" size="lg" className="border-white text-black hover:bg-white hover:text-primary">
                                        Technical Support
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mb-6 bg-gray-50 rounded-md px-4 py-2 flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-600">
                            {loading ? "Loading..." : `Showing ${products.length} of ${total} products`}
                        </p>
                    </div>
                    {error && (
                        <div className="text-center text-red-500 py-12">
                            {error}
                            <div className="mt-4">
                                <Button asChild variant="action">
                                    <Link to="/products">Return to Products</Link>
                                </Button>
                            </div>
                        </div>
                    )}
                    {loading && page === 1 ? (
                        <div className="text-center py-12">
                            <Spinner />
                        </div>
                    ) : products.length === 0 && !loading ? (
                        <div className="text-center text-gray-600 py-12">
                            No products found for this category.
                        </div>
                    ) : (
                        <div className="mb-8">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-foreground mb-2">Product Range</h2>
                                <p className="text-muted-foreground">
                                    Choose from our comprehensive range of products designed for specific applications
                                </p>
                            </div>
                            <ErrorBoundary>
                                <Accordion type="single" collapsible className="space-y-4 w-full">
                                    {products.map((product) => (
                                        <AccordionItem
                                            key={product._id || product.id}
                                            value={product._id || product.id || `product-${Math.random().toString(36).substring(2)}`}
                                            className="border rounded-lg bg-card shadow-sm w-full overflow-hidden"
                                        >
                                            <AccordionTrigger className="px-3 sm:px-6 py-3 sm:py-4 hover:no-underline hover:bg-muted/50 rounded-t-lg w-full">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-3 pr-2">
                                                    {/* Product Info */}
                                                    <div className="flex-1 min-w-0 text-left">
                                                        <h3 className="text-base sm:text-lg font-semibold text-foreground line-clamp-1">
                                                            Gajpati {product.abbreviation}
                                                        </h3>
                                                        <p className="text-xs sm:text-sm text-gray-500 mt-1 mb-1 sm:mb-3 line-clamp-1">
                                                            {product.name}
                                                        </p>
                                                        <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2 sm:line-clamp-none sm:pr-24">
                                                            {product.shortDescription}
                                                        </p>
                                                    </div>

                                                    {/* Badges - Stack on mobile */}
                                                    <div className="flex flex-wrap gap-1 sm:gap-2 justify-start sm:justify-end">
                                                        <Badge variant="outline" className="bg-primary/10 text-primary text-xs">
                                                            {product.certification || "IS Certified"}
                                                        </Badge>
                                                        <Badge
                                                            variant="outline"
                                                            className="bg-secondary/20 text-secondary text-xs"
                                                        >
                                                            {product.natureId?.name || "Construction"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </AccordionTrigger>

                                            <AccordionContent className="px-3 sm:px-6 pb-4 sm:pb-6 w-full">
                                                {/* Grid - Stack on mobile */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10 mt-4">
                                                    {/* Specifications */}
                                                    <div className="space-y-3 sm:space-y-4">
                                                        <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                                            <Beaker className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                                                            <h4 className="font-semibold text-foreground text-sm sm:text-base">
                                                                Specifications
                                                            </h4>
                                                        </div>
                                                        <div className="space-y-2 text-xs sm:text-sm">
                                                            {product.technicalSpecifications && product.technicalSpecifications.length > 0 ? (
                                                                product.technicalSpecifications.slice(0, 3).map((spec, index) => (
                                                                    <div
                                                                        key={spec._id?.$oid || index}
                                                                        className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-border gap-1"
                                                                    >
                                                                        <span className="text-muted-foreground">
                                                                            {spec.key || `Spec ${index + 1}`}
                                                                        </span>
                                                                        <span className="font-medium break-all">
                                                                            {spec.value}
                                                                        </span>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <p className="text-xs sm:text-sm text-muted-foreground">
                                                                    No specifications available
                                                                </p>
                                                            )}
                                                            {product.technicalSpecifications && product.technicalSpecifications.length > 3 && (
                                                                <p className="text-xs text-muted-foreground pt-1">
                                                                    +{product.technicalSpecifications.length - 3} more
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Applications */}
                                                    <div className="space-y-3 sm:space-y-4">
                                                        <h4 className="font-semibold text-foreground text-sm sm:text-base">
                                                            Applications
                                                        </h4>
                                                        <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                                                            {product.applications && product.applications.length > 0 ? (
                                                                product.applications.slice(0, 3).map((app, index) => (
                                                                    <li key={index} className="flex items-start gap-2">
                                                                        <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-primary rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                                                                        <span className="text-muted-foreground line-clamp-2">
                                                                            {app}
                                                                        </span>
                                                                    </li>
                                                                ))
                                                            ) : (
                                                                <li className="text-xs sm:text-sm text-muted-foreground">
                                                                    No applications listed
                                                                </li>
                                                            )}
                                                            {product.applications && product.applications.length > 3 && (
                                                                <li className="text-xs text-muted-foreground pl-3">
                                                                    +{product.applications.length - 3} more
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </div>

                                                    {/* Plant Availability */}
                                                    <div className="space-y-3 sm:space-y-4">
                                                        <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                                                            <h5 className="font-medium text-foreground text-sm sm:text-base">
                                                                Plant Availability
                                                            </h5>
                                                        </div>
                                                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                                            {product.plantAvailability && product.plantAvailability.length > 0 ? (
                                                                product.plantAvailability.slice(0, 4).map((pa, index) => (
                                                                    <Badge
                                                                        key={pa._id?.$oid || `plant-${index}`}
                                                                        variant="outline"
                                                                        className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-0.5"
                                                                    >
                                                                        {pa.state || "Unknown"}
                                                                    </Badge>
                                                                ))
                                                            ) : (
                                                                <Badge variant="outline" className="text-xs">
                                                                    N/A
                                                                </Badge>
                                                            )}
                                                            {product.plantAvailability && product.plantAvailability.length > 4 && (
                                                                <Badge variant="outline" className="text-xs px-2 py-0.5">
                                                                    +{product.plantAvailability.length - 4}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Buttons - Stack on mobile */}
                                                <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-border">
                                                    {product.tds?.url && (
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
                                                            onClick={() => handleTDSClick(product)}
                                                        >
                                                            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                                            <span className="text-xs sm:text-sm">Download TDS</span>
                                                        </Button>
                                                    )}
                                                    <Button
                                                        asChild
                                                        variant="outline"
                                                        size="sm"
                                                        className="w-full sm:w-auto"
                                                    >
                                                        <Link to={`/product/${product.slug || product.id}`}>
                                                            <span className="text-xs sm:text-sm">View Details</span>
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-primary w-full sm:w-auto"
                                                        onClick={() => setIsModalOpen(true)}
                                                    >
                                                        <span className="text-xs sm:text-sm">Technical Support</span>
                                                    </Button>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}

                                    {hasMore && !loading && <div ref={sentinelRef} style={{ height: 1 }} />}

                                    {loading && page > 1 && (
                                        <div className="col-span-full flex justify-center py-8 transition-opacity duration-300">
                                            <Spinner size={10} border={4} />
                                        </div>
                                    )}
                                </Accordion>
                            </ErrorBoundary>
                        </div>
                    )}
                </div>
                {/* TDS Download Modal */}
                {showTDSModal && selectedProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 relative">
                            <button
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                                onClick={handleCloseTDSModal}
                                aria-label="Close"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-egyptian-blue">Download TDS</h2>
                                        <p className="text-gray-600 text-sm">
                                            Technical Data Sheet for {selectedProduct.name}
                                        </p>
                                    </div>
                                    {/* Direct Download Button */}
                                    {selectedProduct.tds?.url && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(selectedProduct.tds.url, '_blank')}
                                        >
                                            <Download className="h-4 w-4 mr-1" />
                                            Direct Download
                                        </Button>
                                    )}
                                </div>

                                <form onSubmit={handleTdsSubmit} className="space-y-4">
                                    {/* Name & Email */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                            <input
                                                type="text"
                                                id="customerName"
                                                value={tdsFormData.customerName}
                                                onChange={handleTdsInputChange}
                                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-egyptian-blue"
                                                required
                                                placeholder="Enter your full name"
                                            />
                                            {tdsErrors.customerName && (
                                                <p className="text-red-600 text-xs mt-1">{tdsErrors.customerName}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                            <input
                                                type="email"
                                                id="customerEmail"
                                                value={tdsFormData.customerEmail}
                                                onChange={handleTdsInputChange}
                                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-egyptian-blue"
                                                required
                                                placeholder="your.email@company.com"
                                            />
                                            {tdsErrors.customerEmail && (
                                                <p className="text-red-600 text-xs mt-1">{tdsErrors.customerEmail}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                        <input
                                            type="tel"
                                            id="customerPhone"
                                            value={tdsFormData.customerPhone}
                                            onChange={handleTdsInputChange}
                                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-egyptian-blue"
                                            required
                                            placeholder="+91 98765 43210"
                                        />
                                        {tdsErrors.customerPhone && (
                                            <p className="text-red-600 text-xs mt-1">{tdsErrors.customerPhone}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                        <input
                                            type="text"
                                            id="city"
                                            value={tdsFormData.city}
                                            onChange={handleTdsInputChange}
                                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-egyptian-blue"
                                            required
                                            placeholder="City, State"
                                        />
                                        {tdsErrors.city && (
                                            <p className="text-red-600 text-xs mt-1">{tdsErrors.city}</p>
                                        )}
                                    </div>

                                    {/* Show current product name (read-only) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                                        <div className="w-full border border-gray-200 rounded px-3 py-2 bg-gray-50 text-gray-700">
                                            {selectedProduct?.name}
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="pt-2">
                                        <Button
                                            type="submit"
                                            variant="cta"
                                            className="w-full"
                                            disabled={tdsLoading}
                                        >
                                            {tdsLoading ? 'Submitting...' : 'Submit & Download TDS'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                <QuoteModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
                <QuoteModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
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

export default NatureProductList;
