import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Filter, Grid, List, ArrowRight, Download, Mail, Building2, Shield, Beaker } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { fetchPlantsWithStats } from "../services/plantStats";
import { Spinner } from "./Products";
import { SubcategoryListRow } from "./SubcategoryListRow";
import QuoteModal from "../components/QuoteModal";
import { handleWhatsAppRedirect } from '../helper/whatsapp';
import bitumen from "../assets/bitumen.jpg";
import constructChemical from "../assets/construct_chemical.jpg";

// --- Interfaces ---
interface Nature {
    _id: string;
    name: string;
    image?: string;
    description: string;
    technicalOverview: string;
    keyFeatures: string[];
    applications: string[];
    plantId: { _id: string; name: string };
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string[];
}

function capitalizeWords(str: string) {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Helper to generate slug if backend slug not present
// Helper to generate slug if backend slug not present
const toSlug = (s?: string) =>
    (s || "")
        .toLowerCase()
        .trim()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

// Singular/Plural helpers for tolerant matching
const toSingular = (s: string) => (s.endsWith("s") ? s.slice(0, -1) : s);
const toPlural = (s: string) => (s.endsWith("s") ? s : `${s}s`);

// --- Static Category Configurations (UI only) ---
const categoryConfigs: {
    [key: string]: {
        tagline: string;
        icon: any;
        filters: { title: string; options: string[] }[];
        bgImage: string;
        gradient: string;
        linkPdf: string;
    }
} = {
    "bituminous-products": {
        tagline: "Trusted Bitumen Technologies for Every Road",
        icon: Building2,
        bgImage: bitumen,
        gradient: "from-gray-500/40 via-blue-800/80 to-gray-500/40",
        linkPdf: "https://gajpati.com/wp-content/uploads/2023/10/Bitumen-Product-Catalogue.pdf",
        filters: [
            { title: "Grade Type", options: ["CRMB", "PMB", "VG", "PG", "PR", "CB", "BM"] },
            { title: "Application", options: ["Road Construction", "Waterproofing", "Industrial"] },
            { title: "Packaging", options: ["50kg Drums", "200kg Drums", "Bulk"] },
        ],
    },
    gabion: {
        tagline: "Advanced epoxy adhesives, sealants, admixtures, curing compounds and waterproofing solutions.",
        icon: Shield,
        bgImage: "https://cdn.mos.cms.futurecdn.net/hFHLgTVFX6VJpwPDUzrEtL.jpg",
        gradient: "from-gray-500/70 via-blue-800/80 to-gray-400/70",
        linkPdf: "https://gajpati.in/wp-content/uploads/2023/10/Gabion-Product-Catalogue.pdf",
        filters: [
            { title: "Product Type", options: ["Gabion Structures", "Rockfall Protection"] },
            { title: "Application", options: ["Retaining Walls", "Rockfall Protection", "Slope Stabilization", "Highway Protection"] },
            { title: "Packaging", options: ["1m x 1m", "2m x 1m", "3m x 1m"] },
        ],
    },
    construct: {
        tagline: "Engineered gabion mesh, boxes and rockfall netting systems for erosion control and stabilization.",
        icon: Beaker,
        bgImage: constructChemical,
        gradient: "from-yellow-500/20 via-blue-800/80 to-yellow-400/70",
        linkPdf: "https://gajpati.in/wp-content/uploads/2023/10/Construct-Product-Catalogue.pdf",
        filters: [
            { title: "Product Type", options: ["Admixture", "Curing Compound", "Epoxy", "Sealants", "Waterproofing"] },
            { title: "Application", options: ["Ready-mix concrete", "Industrial flooring", "Concrete repair"] },
            { title: "Size", options: ["5L Cans", "20L Drums", "200L Drums"] },
        ],
    },
    default: {
        tagline: "Explore our range of products",
        icon: Building2,
        bgImage: "https://via.placeholder.com/1200x300",
        gradient: "from-egyptian-blue to-violet-blue",
        linkPdf: "#",
        filters: [{ title: "Category", options: [] }],
    },
};

// --- Mapping for Short Forms to Full Names ---
const gradeTypeMapping: { [key: string]: string[] } = {
    CRMB: ["Crumb Rubber Modified Bitumen", "CRMB Bitumen"],
    BM: ["Bitumen Emulsion", "Bitumen Emulsions"],
    CB: ["Cutback Bitumen", "CUT Bitumen"],
    PMB: ["Polymer Modified Bitumen", "PMB Bitumen"],
    VG: ["Viscosity Grade Bitumen", "VG Bitumen", "Viscosity Bitumen"],
    PG: ["Performance Grade Bitumen", "PG Bitumen", "Performance Bitumen"],
    PR: ["Pothole Repair", "PR Bitumen", "Pothole Bitumen"],
};

// Detect a UI key from plant name (for icons/bg/filters only)
function detectCategoryKey(name?: string) {
    const s = (name || "").toLowerCase();
    if (s.includes("gabion")) return "gabion";
    if (s.includes("bituminous")) return "bituminous-products"; // <<< NEW key
    if (s.includes("bitumen")) return "bitumen"; // fallback if old legacy comes in
    if (s.includes("construction") || s.includes("chemical")) return "construct";
    return "other";
}

// --- FilterSidebar Component ---
const FilterSidebar = ({
    mobile = false,
    categoryId,
    selectedFilters,
    onFilterChange,
}: {
    mobile?: boolean;
    categoryId: string; // UI key: bitumen/gabion/construct/default
    selectedFilters: { [filterTitle: string]: string[] };
    onFilterChange: (filterTitle: string, option: string) => void;
}) => {
    const filters = categoryConfigs[categoryId]?.filters || [
        { title: "Category", options: [] },
    ];

    const FilterContent = () => (
        <div className="space-y-6">
            <h3 className="font-heading font-semibold text-lg">Filters</h3>
            {filters.map((filter) => (
                <div key={filter.title} className="space-y-3">
                    <h4 className="font-medium text-foreground">{filter.title}</h4>
                    <div className="space-y-2">
                        {filter.options.map((option) => (
                            <label
                                key={option}
                                className="flex items-center space-x-2 cursor-pointer relative group"
                            >
                                <input
                                    type="checkbox"
                                    className="rounded border-border focus-industrial"
                                    checked={selectedFilters[filter.title]?.includes(option) || false}
                                    onChange={() => onFilterChange(filter.title, option)}
                                />
                                <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    {option}
                                </span>
                                {/* Tooltip */}
                                <span className="absolute left-0 top-full mt-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                                    {filter.title === "Grade Type" && gradeTypeMapping[option]
                                        ? gradeTypeMapping[option][0]
                                        : option}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    if (mobile) {
        return (
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="md:hidden">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <SheetHeader>
                        <SheetTitle>Product Filters</SheetTitle>
                        <SheetDescription>
                            Filter products by specifications and features
                        </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                        <FilterContent />
                    </div>
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <div className="hidden md:block w-64 bg-card rounded-xl p-6 h-fit sticky top-6">
            <FilterContent />
        </div>
    );
};

// --- SubcategoryCard Component ---
const SubcategoryCard = ({
    title,
    description,
    productCount,
    image,
    link,
    keyFeatures = [],
    applications = [],
    specs,
}: {
    title: string;
    description: string;
    productCount: number;
    image: any;
    link: string;
    keyFeatures?: string[];
    applications?: string[];
    specs: string[];
}) => {
    return (
        <Link to={link} className="block group h-full">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-5 flex flex-col h-[480px]">
                {/* Image - Fixed height */}
                <div className="relative mb-4 overflow-hidden rounded-lg h-48 flex-shrink-0">
                    <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow overflow-hidden">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {title}
                    </h3>

                    <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-3 line-clamp-3">
                        {description}
                    </p>

                    {applications.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
                            {applications.slice(0, 3).map((feature, idx) => (
                                <span
                                    key={idx}
                                    className="bg-primary/10 text-primary text-xs px-2 py-1 rounded font-medium"
                                >
                                    {feature}
                                </span>
                            ))}
                            {applications.length > 3 && (
                                <span className="text-xs text-zinc-400 self-center">+{applications.length - 3} more</span>
                            )}
                        </div>
                    )}

                    <div className="flex-grow" />

                    <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
                        <span className="text-xs text-zinc-400">
                            {productCount} product{productCount !== 1 ? "s" : ""}
                        </span>
                        <div className="flex items-center text-primary font-medium text-sm group-hover:text-primary-dark transition-colors">
                            <span>Explore</span>
                            <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

// --- Main NatureProducts Component ---
export const NatureProducts = () => {
    const { slug } = useParams<{ slug: string }>(); // slug-based route
    const [natures, setNatures] = useState<Nature[]>([]);
    const [natureProductCounts, setNatureProductCounts] = useState<{ [key: string]: number }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const normalizedSlug = useMemo(
        () => toSlug(decodeURIComponent(slug || "")),
        [slug]
    );
    // Fetch plant data for breadcrumb and heading
    const { data: plants, isLoading: plantsLoading, error: plantsError } = useQuery({
        queryKey: ['plants'],
        queryFn: fetchPlantsWithStats,
        staleTime: 5 * 60 * 1000,
    });

    // Find the plant using slug (prefer backend slug field, fallback to generated slug from name)
    const currentPlant = useMemo(() => {
        if (!plants || !normalizedSlug) return null;

        // 1) Exact backend slug match (case-insensitive)
        const byBackendSlug = plants.find(
            (p: any) => (p.slug || "").toLowerCase() === normalizedSlug
        );
        if (byBackendSlug) return byBackendSlug;

        // 2) Exact name-based slug match
        const byNameSlug = plants.find((p) => toSlug(p.name) === normalizedSlug);
        if (byNameSlug) return byNameSlug;

        // 3) Singular/Plural tolerant match
        const singular = toSingular(normalizedSlug);
        const plural = toPlural(normalizedSlug);
        const bySingularPlural = plants.find(
            (p) => toSlug(p.name) === singular || toSlug(p.name) === plural
        );
        if (bySingularPlural) return bySingularPlural;

        // 4) Loose fallback (startsWith either side)
        const byLoose = plants.find((p) => {
            const s = toSlug(p.name);
            return s.startsWith(normalizedSlug) || normalizedSlug.startsWith(s);
        });
        if (byLoose) return byLoose;

        return null;
    }, [plants, normalizedSlug]);
    useEffect(() => {
        if (plants && normalizedSlug && !currentPlant) {
            console.warn("No plant matched slug:", normalizedSlug, {
                available: plants.map((p: any) => p.slug || toSlug(p.name)),
            });
        }
    }, [plants, normalizedSlug, currentPlant]);

    // UI Config from plant name
    const cfgKey = detectCategoryKey(currentPlant?.name);
    const cfg = categoryConfigs[cfgKey] || categoryConfigs.default;
    const IconComponent = cfg.icon;

    // --- Filter State for Frontend Filtering ---
    const [selectedFilters, setSelectedFilters] = useState<{ [filterTitle: string]: string[] }>({});

    const handleFilterChange = (filterTitle: string, option: string) => {
        setSelectedFilters((prev) => {
            const options = prev[filterTitle] || [];
            return {
                ...prev,
                [filterTitle]: options.includes(option)
                    ? options.filter((o) => o !== option)
                    : [...options, option],
            };
        });
    };

    // Fetch natures when slug or currentPlant changes
    useEffect(() => {
        if (!slug) {
            setError("No category provided in URL");
            setLoading(false);
            return;
        }

        if (plantsLoading) {
            setLoading(true);
            return;
        }

        if (!currentPlant?._id) {
            setError("Plant not found for this category");
            setLoading(false);
            return;
        }

        setLoading(true);
        const plantId = currentPlant._id;

        fetch(
            `${import.meta.env.VITE_API_URL || "https://gajpati-backend.onrender.com"}/api/v1/natures/search?plantId=${plantId}`
        )
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch natures");
                }
                return res.json();
            })
            .then((data) => {
                const naturesData = data.data?.natures || [];
                setNatures(naturesData);

                // Fetch product counts per nature (optional)
                const fetchNatureCounts = async () => {
                    const counts: { [key: string]: number } = {};
                    for (const nature of naturesData) {
                        try {
                            const response = await fetch(
                                `${import.meta.env.VITE_API_URL || "https://gajpati-backend.onrender.com"}/api/v1/products/search?plantId=${plantId}&natureId=${nature._id}&limit=1`
                            );
                            if (!response.ok) throw new Error(`Failed to fetch products for nature ${nature._id}`);
                            const result = await response.json();
                            counts[nature._id] = result.data?.total || 0;
                        } catch (err) {
                            counts[nature._id] = 0;
                        }
                    }
                    setNatureProductCounts(counts);
                };

                fetchNatureCounts();
            })
            .catch((err) => {
                console.error("Fetch natures error:", err);
                setNatures([]);
                setNatureProductCounts({});
                setError("Failed to load product types. Please try again later.");
            })
            .finally(() => setLoading(false));
    }, [slug, currentPlant, plantsLoading]);

    // --- Filtering Logic ---
    const filteredNatures = natures.filter((nature) => {
        return Object.entries(selectedFilters).every(([filterTitle, options]) => {
            if (options.length === 0) return true;

            if (filterTitle === "Application") {
                const applications = (nature.applications || []).map((a) => a.toLowerCase());
                return options.some((opt) => applications.includes(opt.toLowerCase()));
            }

            if (filterTitle === "Grade Type") {
                const fullNames = options
                    .map((opt) => gradeTypeMapping[opt] || [opt])
                    .flat()
                    .map((name) => name.toLowerCase());
                return fullNames.some((fullName) =>
                    nature.name.toLowerCase().includes(fullName)
                );
            }

            if (filterTitle === "Product Type") {
                return options.some((opt) => nature.name.toLowerCase() === opt.toLowerCase());
            }

            return true;
        });
    });

    // Dynamic SEO metadata
    const seoTitle = currentPlant
        ? `${capitalizeWords(currentPlant.name)} Products | Gajpati Industries`
        : `Products | Gajpati Industries`;

    const seoDescription = currentPlant?.description
        ? `${currentPlant.description.slice(0, 157)}...`
        : `${cfg.tagline.slice(0, 157)}...`;

    const seoKeywords = useMemo(() => {
        const baseKeywords = [
            'Gajpati Industries',
            currentPlant?.name || 'products',
            ...(cfg?.filters?.flatMap(f => f.options) || []),
        ];
        const natureKeywords = natures.flatMap(nature => nature.seoKeywords || []);
        return [...new Set([...baseKeywords, ...natureKeywords])].slice(0, 10);
    }, [natures, currentPlant, cfg]);

    // Early returns
    if (plantsLoading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container-industrial py-8 text-center">
                    <Spinner />
                </div>
            </div>
        );
    }

    if (plantsError) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container-industrial py-8 text-center text-red-500">
                    {plantsError.message}
                    <div className="mt-4">
                        <Button asChild variant="action">
                            <Link to="/products">Return to Products</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentPlant) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container-industrial py-8 text-center">
                    <p className="text-red-500">Plant not found</p>
                    <div className="mt-4">
                        <Button asChild variant="action">
                            <Link to="/products">Return to Products</Link>
                        </Button>
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
                <meta property="og:image" content={cfg?.bgImage || 'https://yourdomain.com/images/default-og.jpg'} />
                <meta property="og:url" content={`https://yourdomain.com/nature/${slug}`} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={seoTitle} />
                <meta name="twitter:description" content={seoDescription} />
                <meta name="twitter:image" content={cfg?.bgImage || 'https://yourdomain.com/images/default-og.jpg'} />
                <link rel="canonical" href={`https://yourdomain.com/nature/${slug}`} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'CollectionPage',
                        'name': seoTitle,
                        'description': seoDescription,
                        'url': `https://yourdomain.com/nature/${slug}`,
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
                            { '@type': 'ListItem', 'position': 3, 'name': capitalizeWords(currentPlant?.name || ''), 'item': `https://yourdomain.com/nature/${slug}` },
                        ],
                    })}
                </script>
            </Helmet>

            <div className="min-h-screen bg-background">
                {/* Breadcrumb */}
                <nav className="container py-4 bg-white border-b border-gray-200">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
                        <span>&gt;</span>
                        <Link to="/products" className="hover:text-gray-900 transition-colors">Products</Link>
                        <span>&gt;</span>
                        <span className="text-gray-900 font-medium">{currentPlant?.name || "Category"}™</span>
                    </div>
                </nav>

                {/* Hero Section */}
                <section
                    className="relative flex items-center justify-center min-h-[60vh] bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${cfg.bgImage})`,
                    }}
                >
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${cfg.gradient}`}></div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto px-4 py-16">
                        {/* Icon */}
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 shadow-lg">
                            <span className="text-3xl text-white">
                                {IconComponent ? <IconComponent /> : <Building2 />}
                            </span>
                        </div>
                        {/* Heading */}
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                            {capitalizeWords(currentPlant?.name || "Category")}™
                        </h1>
                        {/* Tagline */}
                        <p className="text-xl text-white/95 mb-4 drop-shadow-md">
                            {currentPlant?.description || "Explore our range of products in this category. Each product is designed to meet the highest standards of quality and performance."}
                        </p>
                        {/* Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <Link to={cfg.linkPdf} target="_blank" className="flex items-center">
                                <Button size="lg" variant="secondary" className="bg-amber text-deep-gray hover:bg-amber/90">
                                    <Download className="h-5 w-5 mr-2" />
                                    Download Technical Data Sheet
                                </Button>
                            </Link>
                            <Button onClick={() => setIsModalOpen(true)} size="lg" variant="outline" className="border-white text-black hover:bg-white hover:text-deep-gray">
                                <Mail className="h-5 w-5 mr-2" />
                                Request Quote
                            </Button>
                        </div>
                    </div>
                </section>
            </div>

            <div className="min-h-screen bg-background mb-20 md:-mt-32 mt-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="container-industrial">
                        {/* Controls */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 mb-8">
                                <FilterSidebar
                                    mobile={true}
                                    categoryId={cfgKey}
                                    selectedFilters={selectedFilters}
                                    onFilterChange={handleFilterChange}
                                />
                                <span className="text-sm text-muted-foreground">
                                    {filteredNatures.length} subcategories
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant={viewMode === "grid" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setViewMode("grid")}
                                >
                                    <Grid className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={viewMode === "list" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setViewMode("list")}
                                >
                                    <List className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex gap-8">
                            <FilterSidebar
                                categoryId={cfgKey}
                                selectedFilters={selectedFilters}
                                onFilterChange={handleFilterChange}
                            />
                            <div className="flex-1">
                                {loading ? (
                                    <div className="text-center py-12">
                                        <Spinner />
                                    </div>
                                ) : error ? (
                                    <div className="text-center text-red-500 py-12">
                                        {error}
                                        <div className="mt-4">
                                            <Button asChild variant="action">
                                                <Link to="/products">Return to Products</Link>
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                                        {filteredNatures.map((nature, index) => (
                                            <div
                                                key={nature._id}
                                                className="fade-in"
                                                style={{ animationDelay: `${index * 100}ms` }}
                                            >
                                                {viewMode === "grid" ? (
                                                    <SubcategoryCard
                                                        title={nature.name}
                                                        description={nature.description || "Explore products in this category"}
                                                        productCount={natureProductCounts[nature._id] || 0}
                                                        image={nature.image || "https://via.placeholder.com/1200x300"}
                                                        // IMPORTANT: Go to products with IDs for fetching
                                                        link={`/nature/${nature._id}/products?categoryId=${currentPlant._id}`}
                                                        // link={`/nature/${nature._id}/products?categoryId=${id}`}

                                                        specs={
                                                            nature.technicalOverview
                                                                ? nature.technicalOverview.split(",").map((spec) => spec.trim())
                                                                : ["No specifications available"]
                                                        }
                                                        keyFeatures={nature.keyFeatures || []}
                                                        applications={nature.applications || []}
                                                    />
                                                ) : (
                                                    <SubcategoryListRow
                                                        title={nature.name}
                                                        description={nature.description || "Explore products in this category"}
                                                        productCount={natureProductCounts[nature._id] || 0}
                                                        image={nature.image || "https://via.placeholder.com/1200x300"}
                                                        // IMPORTANT: Go to products with IDs for fetching
                                                        link={`/nature/${nature._id}/products?categoryId=${currentPlant._id}`}
                                                        specs={
                                                            nature.technicalOverview
                                                                ? nature.technicalOverview.split(",").map((spec) => spec.trim())
                                                                : ["No specifications available"]
                                                        }
                                                        keyFeatures={nature.keyFeatures || []}
                                                        applications={nature.applications || []}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
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
        </>
    );
};

export default NatureProducts;