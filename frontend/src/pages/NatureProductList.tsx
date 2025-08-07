import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, NavLink, useSearchParams } from "react-router-dom"; // Added useSearchParams
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, MapPin, Beaker, ChevronRight, MessageCircleCode } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Spinner } from "./Products";
import QuoteModal from "../components/QuoteModal";
import { handleWhatsAppRedirect } from '../helper/whatsapp';
import bitumen from "../assets/bitumen.jpg";
import constructChemical from "../assets/construct.jpg";
// Define productCategories here or import it if it's in a separate file
const productCategories = [
    {
        id: "bitumen",
        name: "Bitumen Solutions",
        tagline:
            "Comprehensive range of CRMB, PMB, VG & PG grades for road construction and infrastructure projects.",
        bgImage:
            "https://www.shutterstock.com/image-photo/construction-site-laying-new-asphalt-600nw-1679316820.jpg",
        gradient: "from-indigo-900/90 via-blue-800/70 to-cyan-400/20", // Deep blue to sky blue
        linkPdf: "https://gajpati.in/wp-content/uploads/2023/10/Bitumen-Product-Catalogue.pdf",
        plantId: "68808208cf8dba209c5a0b1d",
    },
    {
        id: "gabion",
        name: "Gabion",
        tagline:
            "Advanced epoxy adhesives, sealants, admixtures, curing compounds and waterproofing solutions.",
        bgImage: "https://cdn.mos.cms.futurecdn.net/hFHLgTVFX6VJpwPDUzrEtL.jpg",
        gradient: "from-green-500/70 via-blue-800/70 to-green-400/70", // Dark gray to light gray
        linkPdf: "https://gajpati.in/wp-content/uploads/2023/10/Gabion-Product-Catalogue.pdf",
        plantId: "68808208cf8dba209c5a0b1e",
    },
    {
        id: "construct",
        name: "Construct Chemicals",
        tagline:
            "Engineered gabion mesh, boxes and rockfall netting systems for erosion control and stabilization.",
        bgImage: constructChemical,
        gradient: "from-yellow-500/70 via-blue-800/50 to-yellow-400/70", // Dark yellow to bright yellow
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

}

// Error Boundary Component
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
    const [searchParams] = useSearchParams(); // Added to get categoryId
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [nature, setNature] = useState<Nature>({ name: "Nature", description: "" });
    const [currentCategory, setCurrentCategory] = useState<any>(null); // To store the category
    const PAGE_SIZE = 10;
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


    // Get categoryId from URL and set currentCategory
    useEffect(() => {
        const categoryId = searchParams.get("categoryId");
        if (categoryId) {
            const foundCategory = productCategories.find((cat) => cat.id === categoryId);
            setCurrentCategory(foundCategory || null);
        }
    }, [searchParams]);

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

    // Fetch nature details
    useEffect(() => {
        fetch(
            `${import.meta.env.VITE_API_URL || "https://gajpati-backend.onrender.com"
            }/api/v1/natures/${natureId}`
        )
            .then((res) => {
                if (!res.ok) throw new Error(`Failed to fetch nature: ${res.statusText}`);
                return res.json();
            })
            .then((data) => {
                setNature({ name: data.data?.name || "Nature", description: data.data?.description || "" });
            })
            .catch((err) => {
                setError(err.message);
            });
    }, [natureId]);

    // Fetch products
    useEffect(() => {
        setLoading(true);
        setError(null);
        const url = `${import.meta.env.VITE_API_URL || "https://gajpati-backend.onrender.com"
            }/api/v1/products/search?natureId=${natureId}&page=${page}&limit=${PAGE_SIZE}`;

        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error(`Failed to fetch products: ${res.statusText}`);
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
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [natureId, page]);

    // Infinite scroll
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

    return (
        <div className="min-h-screen bg-background">
            {/* Navigation Bar */}
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-card border-b border-border">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Link to="/" className="hover:text-foreground transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link to="/products" className="hover:text-foreground transition-colors">
                        Products
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link
                        to={`/nature/${searchParams.get("categoryId")}`}
                        className="hover:text-foreground transition-colors"
                    >
                        {currentCategory?.name || "Category"}
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-foreground font-medium">
                        {nature.name}
                    </span>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="relative rounded-lg overflow-hidden mb-8">
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 w-full h-full bg-cover bg-center"
                        style={{
                            backgroundImage: `url('${currentCategory?.bgImage || "https://cdn.mos.cms.futurecdn.net/hFHLgTVFX6VJpwPDUzrEtL.jpg"}')`,
                        }}
                        aria-hidden="true"
                    />
                    {/* Gradient Overlay */}

                    <div className={`absolute inset-0 bg-gradient-to-br ${currentCategory?.gradient || 'from-gray-900/90 via-gray-700/80 to-gray-400/70'}`} />

                    {/* Content */}
                    <div className="relative z-10 p-6 md:p-12 text-white">
                        <div className="max-w-3xl">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <Badge variant="secondary" className="bg-accent text-accent-foreground">
                                    IS Certified
                                </Badge>
                                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                                    Construction
                                </Badge>
                                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                                    Eco-Safe
                                </Badge>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">
                                {nature.name}
                            </h1>
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

                {/* Results Header */}
                <div className="mb-6 bg-gray-50 rounded-md px-4 py-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-600">
                        {loading ? "Loading..." : `Showing ${products.length} of ${total} products`}
                    </p>
                </div>

                {/* Products Accordion */}
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
                            <Accordion type="single" collapsible className="space-y-4">
                                {products.map((product) => (
                                    <AccordionItem
                                        key={product._id || product.id}
                                        value={product._id || product.id || `product-${Math.random().toString(36).substring(2)}`}
                                        className="border rounded-lg bg-card shadow-sm"
                                    >
                                        <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 rounded-t-lg">
                                            <div className="flex items-center justify-between w-full mr-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="text-left">
                                                        <h3 className="text-lg font-semibold text-foreground">Gajpati {product.abbreviation}</h3>
                                                        <p className="text-sm text-gray-500 mt-1 mb-3">
                                                            {product.name}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground mt-1 mr-24">
                                                            {product.shortDescription}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="bg-primary/10 text-primary">
                                                        {product.certification || "IS Certified"}
                                                    </Badge>
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-secondary/20 text-secondary"
                                                    >
                                                        {product.natureId?.name || "Construction"}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-6 pb-6">
                                            <div className="grid md:grid-cols-3 gap-10 mt-4">
                                                {/* Specifications */}
                                                <div className="space-y-4 min-h-[120px]">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Beaker className="h-5 w-5 text-primary" />
                                                        <h4 className="font-semibold text-foreground">Specifications</h4>
                                                    </div>
                                                    <div className="space-y-2 text-sm">
                                                        {product.technicalSpecifications && product.technicalSpecifications.length > 0 ? (
                                                            product.technicalSpecifications.map((spec, index) => (
                                                                <div key={spec._id?.$oid || index} className="flex justify-between py-1 border-b border-border">
                                                                    <span className="text-muted-foreground">{spec.key || `Spec ${index + 1}`}</span>
                                                                    <span className="font-medium">{spec.value}</span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-sm text-muted-foreground">No specifications available</p>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* Applications */}
                                                <div className="space-y-4 min-h-[120px]">
                                                    <h4 className="font-semibold text-foreground">Applications</h4>
                                                    <ul className="space-y-2 text-sm">
                                                        {product.applications && product.applications.length > 0 ? (
                                                            product.applications.map((app, index) => (
                                                                <li key={index} className="flex items-start gap-2">
                                                                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                                                    <span className="text-muted-foreground">{app}</span>
                                                                </li>
                                                            ))
                                                        ) : (
                                                            <li className="text-sm text-muted-foreground">No applications listed</li>
                                                        )}
                                                    </ul>
                                                </div>
                                                {/* Plant Availability */}
                                                <div className="space-y-4 min-h-[120px]">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <MapPin className="h-4 w-4 text-primary" />
                                                        <h5 className="font-medium text-foreground">Plant Availability</h5>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {product.plantAvailability && product.plantAvailability.length > 0 ? (
                                                            product.plantAvailability.map((pa, index) => (
                                                                <Badge
                                                                    key={pa._id?.$oid || `plant-${index}`}
                                                                    variant="outline"
                                                                    className="bg-green-50 text-green-700 border-green-200"
                                                                >
                                                                    {pa.state || "Unknown"}
                                                                </Badge>
                                                            ))
                                                        ) : (
                                                            <Badge variant="outline" className="text-xs">
                                                                N/A
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Action Buttons */}
                                            <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-border">
                                                {product.tds?.url && (
                                                    <Button asChild variant="default" size="sm" className="bg-primary hover:bg-primary/90">
                                                        <a href={product.tds.url} target="_blank" rel="noopener noreferrer">
                                                            <Download className="h-4 w-4 mr-2" />
                                                            Download TDS
                                                        </a>
                                                    </Button>
                                                )}
                                                <Button asChild variant="outline" size="sm">
                                                    <Link to={`/product/${product.slug || product.id}`}>View Details</Link>
                                                </Button>
                                                <Button variant="ghost" size="sm" className="text-primary">
                                                    Technical Support
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
            <QuoteModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
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
    );
};

export default NatureProductList;