import { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Download, CheckCircle, Factory, Shield, FileText, ChevronRight, X, Wrench } from "lucide-react";
import { handleWhatsAppRedirect } from '../helper/whatsapp';
import { toast } from "sonner";
import { createQuote } from "../services/quote";
// hi
const productCategories = [
  {
    id: "bituminous-products",
    name: "Bituminous Products",
    tagline:
      "Comprehensive range of CRMB, PMB, VG & PG grades for road construction and infrastructure projects.",
    bgImage:
      "https://www.constructionworld.in/assets/uploads/s_ae40e2939eb212f9b98fc628c69fbf5a.jpg",
    plantId: "68808208cf8dba209c5a0b1d",
  },
  {
    id: "gabion",
    name: "Gabion",
    tagline:
      "Advanced epoxy adhesives, sealants, admixtures, curing compounds and waterproofing solutions.",
    bgImage: "https://cdn.mos.cms.futurecdn.net/hFHLgTVFX6VJpwPDUzrEtL.jpg",
    plantId: "68808208cf8dba209c5a0b1e",
  },
  {
    id: "construct",
    name: "Construction Chemicals",
    tagline:
      "Engineered gabion mesh, boxes and rockfall netting systems for erosion control and stabilization.",
    bgImage:
      "https://backgroundimages.withfloats.com/actual/5bd1af4f3f02cc0001c0f035.jpg",
    plantId: "68808208cf8dba209c5a0b1f",
  },
];

interface Product {
  _id: string;
  name: string;
  abbreviation: string;
  description: string;
  images?: { url: string; alt: string; isPrimary?: boolean }[];
  brochure?: { url: string; title: string };
  tds?: { url: string; title: string };
  plantId: { name: string; certifications: string[] };
  natureId: { name: string; _id?: string; id?: string };
  technicalSpecifications?: { key: string; value: string }[];
  plantAvailability?: { state: string }[];
  applications?: string[];
  status?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  settingTime?: string;
  shelfLife?: string;
  packaging?: string[];
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImageIdx, setMainImageIdx] = useState(0);
  const [currentCategory, setCurrentCategory] = useState<any>(null);

  // Technical Support Modal State
  const [showTechnicalSupportModal, setShowTechnicalSupportModal] = useState(false);
  const [technicalSupportData, setTechnicalSupportData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: '',
    technicalQuery: '',
    urgency: ''
  });

  // TDS Modal State
  const [showTDSModal, setShowTDSModal] = useState(false);
  const [tdsFormData, setTdsFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    city: '',
    selectedProducts: [],
  });
  const [tdsErrors, setTdsErrors] = useState({});
  const [tdsLoading, setTdsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const categoryId = searchParams.get("categoryId");
    if (categoryId) {
      const foundCategory =
        productCategories.find(cat => cat.plantId === categoryId) || // backend Mongo id
        productCategories.find(cat => cat.id === categoryId);        // fallback on slug
      setCurrentCategory(foundCategory || null);
    }

    fetch(`${import.meta.env.VITE_API_URL || "https://gajpati-backend.onrender.com"}/api/v1/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch product");
        return res.json();
      })
      .then(data => {
        setProduct(data.data || null);

        if (!categoryId && data.data?.plantId?._id) {
          const foundCategory = productCategories.find(cat => cat.plantId === data.data.plantId._id);
          setCurrentCategory(foundCategory || productCategories[0]);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, searchParams]);

  // Technical Support Modal Functions
  const handleTechnicalSupportClick = () => {
    setTechnicalSupportData({
      name: '',
      email: '',
      company: '',
      projectType: '',
      technicalQuery: '',
      urgency: ''
    });
    setShowTechnicalSupportModal(true);
  };

  const handleCloseTechnicalSupportModal = () => {
    setShowTechnicalSupportModal(false);
  };

  const handleTechnicalSupportInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTechnicalSupportData({
      ...technicalSupportData,
      [e.target.name]: e.target.value
    });
  };

  const handleTechnicalSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const message = `Hello! I need technical support for *${product?.name}* (${product?.abbreviation}).

*Technical Support Request Details:*
Name: ${technicalSupportData.name}
Email: ${technicalSupportData.email}
Company: ${technicalSupportData.company}
Project Type: ${technicalSupportData.projectType}
Urgency: ${technicalSupportData.urgency}

*Technical Query:*
${technicalSupportData.technicalQuery}

*Product Details:*
Product: ${product?.name}
Abbreviation: ${product?.abbreviation}
Category: ${product?.natureId?.name}

Please provide technical assistance and guidance for this product.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = '919528355555';
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, '_blank');

    setTimeout(() => {
      setShowTechnicalSupportModal(false);
    }, 1000);
  };

  // TDS Modal Functions
  const handleTDSClick = () => {
    setTdsFormData({
      customerName: '',
      customerEmail: '',
      city: '',
      selectedProducts: [product?.name || ''], // Current product auto-fill
    });
    setTdsErrors({});
    setShowTDSModal(true);
  };

  const handleCloseTDSModal = () => {
    setShowTDSModal(false);
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
      // Quote API call करें
      await createQuote(tdsFormData);

      // Success toast
      toast.success("✅ Success!", {
        description: "TDS request submitted successfully! Download will start shortly.",
        duration: 3000,
      });

      // TDS download करें
      if (product?.tds?.url) {
        setTimeout(() => {
          window.open(product.tds.url, '_blank');
        }, 1000);
      }

      // Modal close करें
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

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error || !product) return <div className="text-center text-red-500 py-12">{error || "Product not found."}</div>;

  const images = product.images && product.images.length > 0
    ? [...product.images].sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0)).slice(0, 5)
    : [];
  const mainImage = images[mainImageIdx] || images[0];

  // Dynamic SEO metadata
  const seoTitle = product.seoTitle || `Gajpati ${product.abbreviation} - ${product.name} | Gajpati Industries`;
  const seoDescription = product.seoDescription ||
    (product.description ? `${product.description.slice(0, 157)}...` :
      `Explore Gajpati ${product.abbreviation} (${product.name}), a high-quality ${product.natureId?.name || 'product'} for construction projects.`);
  const seoKeywords = [
    ...(product.seoKeywords || []),
    product.abbreviation.toLowerCase(),
    product.name.toLowerCase(),
    product.natureId?.name.toLowerCase() || '',
    currentCategory?.name.toLowerCase() || '',
    'Gajpati Industries',
    ...(product.applications?.map(app => app.toLowerCase()) || []),
  ].filter(Boolean).slice(0, 10);

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={seoKeywords.join(', ')} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={mainImage?.url || currentCategory?.bgImage || 'https://yourdomain.com/images/default-og.jpg'} />
        <meta property="og:url" content={`https://yourdomain.com/product/${id}?categoryId=${searchParams.get("categoryId") || currentCategory?.id || ''}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={mainImage?.url || currentCategory?.bgImage || 'https://yourdomain.com/images/default-og.jpg'} />
        <link rel="canonical" href={`https://yourdomain.com/product/${id}?categoryId=${searchParams.get("categoryId") || currentCategory?.id || ''}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            'name': `Gajpati ${product.abbreviation} - ${product.name}`,
            'description': seoDescription,
            'image': mainImage?.url || currentCategory?.bgImage || 'https://yourdomain.com/images/default-og.jpg',
            'brand': { '@type': 'Brand', 'name': 'Gajpati Industries' },
            'category': product.natureId?.name || currentCategory?.name || 'Construction Materials',
            'url': `https://yourdomain.com/product/${id}?categoryId=${searchParams.get("categoryId") || currentCategory?.id || ''}`,
            'offers': {
              '@type': 'Offer',
              'availability': product.status === 'In Stock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              'priceCurrency': 'INR',
              'price': 'Contact for pricing',
              'url': `https://yourdomain.com/product/${id}?categoryId=${searchParams.get("categoryId") || currentCategory?.id || ''}`,
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
              { '@type': 'ListItem', 'position': 3, 'name': currentCategory?.name || 'Category', 'item': `https://yourdomain.com/products/${searchParams.get("categoryId") || currentCategory?.id || ''}` },
              { '@type': 'ListItem', 'position': 4, 'name': product.natureId?.name || 'Nature', 'item': `https://yourdomain.com/nature/${product.natureId?._id || product.natureId?.id || ''}/products?categoryId=${searchParams.get("categoryId") || currentCategory?.id || ''}` },
              { '@type': 'ListItem', 'position': 5, 'name': product.name, 'item': `https://yourdomain.com/product/${id}?categoryId=${searchParams.get("categoryId") || currentCategory?.id || ''}` },
            ],
          })}
        </script>
      </Helmet>
      <div className="min-h-screen bg-background">
        <div className="bg-platinum/30 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 bg-card border-b border-border">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
                <ChevronRight className="w-4 h-4" />
                <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
                <ChevronRight className="w-4 h-4" />
                <Link to={`/nature/${currentCategory?.id || "bitumen"}`}
                  className="hover:text-foreground transition-colors"
                >
                  {currentCategory?.name || "Category"}
                </Link>
                <ChevronRight className="w-4 h-4" />
                <Link
                  to={`/nature/${product.natureId?._id}/products?categoryId=${currentCategory?.plantId}`}
                  className="hover:text-foreground transition-colors"
                >
                  <span className="text-foreground font-medium">{product.natureId?.name || "Nature"}</span>
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-eerie-black font-semibold">{product.name}</span>
              </div>
            </nav>
          </div>
        </div>
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <div className="aspect-square bg-gradient-to-br from-platinum to-white rounded-lg shadow-card flex items-center justify-center mb-6 overflow-hidden">
                  {mainImage ? (
                    <img
                      src={mainImage.url}
                      alt={mainImage.alt}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-8xl text-egyptian-blue/30 font-bold">
                      {product.abbreviation && typeof product.abbreviation === 'string' && product.abbreviation.length > 0
                        ? product.abbreviation.charAt(0)
                        : (product.name && typeof product.name === 'string' && product.name.length > 0
                          ? product.name.charAt(0)
                          : '?')}
                    </div>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((img, idx) => (
                      <button
                        key={img.url}
                        className={`aspect-square bg-platinum/50 rounded border ${mainImageIdx === idx ? 'ring-2 ring-egyptian-blue' : ''}`}
                        onClick={() => setMainImageIdx(idx)}
                      >
                        <img src={img.url} alt={img.alt} className="w-full h-full object-cover rounded" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-6">
                <div>
                  <Badge variant="secondary" className="mb-3">{product.plantId?.name || "Plant"}</Badge>
                  <h1 className="font-display font-bold text-h1 text-eerie-black mb-4">
                    Gajpati {product.abbreviation} ®
                  </h1>
                  <p className="text-gray-700 leading-relaxed text-lg mb-4">{product.name}</p>
                  <p className="text-gray-600 leading-relaxed text-base">{product.description}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="outline" className="text-amber border-amber">
                    <Shield className="h-3 w-3 mr-1" />
                    {product.plantId?.certifications?.[0] || "Certification"}
                  </Badge>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Quality Assured
                  </Badge>
                </div>
                <div className="space-y-3 w-full">
                  <div className="flex gap-3 w-full">
                    {product.tds?.url && (
                      <Button
                        variant="cta"
                        size="lg"
                        className="flex-1 px-3 sm:px-8"
                        onClick={handleTDSClick}
                      >
                        <Download className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">Download TDS</span>
                      </Button>
                    )}
                    {product.brochure?.url && (
                      <Button
                        asChild
                        variant="action"
                        size="lg"
                        className="flex-1 px-3 sm:px-8"
                      >
                        <a href={product.brochure.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                          <Download className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">Download MSDS</span>
                        </a>
                      </Button>
                    )}
                  </div>
                  <Button
                    variant="trust"
                    size="lg"
                    className="w-full"
                    onClick={handleTechnicalSupportClick}
                  >
                    <Wrench className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">Request Technical Support</span>
                  </Button>
                </div>
                <Card className="shadow-card">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Category:</span>
                        <div className="font-medium">{product.natureId?.name || '-'}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Setting Time:</span>
                        <div className="font-medium">{product.settingTime || '-'}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Shelf Life:</span>
                        <div className="font-medium">{product.shelfLife || '-'}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Packaging:</span>
                        <div className="font-medium">
                          {product.packaging && product.packaging.length > 0
                            ? product.packaging.join(", ")
                            : "-"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 bg-platinum/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-egyptian-blue">Technical Specifications</CardTitle>
                    <h5>{product.name}</h5>
                  </CardHeader>
                  <CardContent>
                    {product.technicalSpecifications && product.technicalSpecifications.length > 0 ? (
                      <div className="space-y-3">
                        {product.technicalSpecifications.map((spec, idx) => (
                          <div key={idx} className="grid grid-cols-2 gap-3 py-2 border-b border-gray-100 last:border-0">
                            <span className="text-gray-600 font-medium break-words">{spec.key}</span>
                            <span className="text-eerie-black font-semibold break-words text-right">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500">No technical specifications available.</div>
                    )}
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-egyptian-blue flex items-center">
                      <Factory className="h-5 w-5 mr-2" />
                      Plant Availability
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {product.plantAvailability && product.plantAvailability.length > 0 ? (
                      <div className="space-y-3">
                        {product.plantAvailability.map((pa, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium text-sm">{pa.state}</div>
                            </div>
                            <Badge variant="default" className="text-xs">
                              {product.status || "In Stock"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500">No plant availability data.</div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-egyptian-blue">Applications</CardTitle> <h4>{product.name}</h4>
                </CardHeader>
                <CardContent>
                  {product.applications && product.applications.length > 0 ? (
                    <ul className="space-y-2">
                      {product.applications.map((app, idx) => (
                        <li key={idx} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{app}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-500">No applications listed.</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="py-12 bg-platinum/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-egyptian-blue text-center">Certifications & Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <Shield className="h-8 w-8 text-amber mx-auto mb-2" />
                    <div className="text-sm font-medium text-eerie-black">IS 8887:2004 Compliant</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <Shield className="h-8 w-8 text-amber mx-auto mb-2" />
                    <div className="text-sm font-medium text-eerie-black">ASTM D977 Compliant</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <Shield className="h-8 w-8 text-amber mx-auto mb-2" />
                    <div className="text-sm font-medium text-eerie-black">ISO / BIS Certified</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <Shield className="h-8 w-8 text-amber mx-auto mb-2" />
                    <div className="text-sm font-medium text-eerie-black">BIS License No. CM/L-7891234</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        <section className="py-12 sm:py-16 bg-gradient-hero text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl mb-4 sm:mb-6">
              Ready to Use {product.abbreviation} in Your Project?
            </h2>
            <p className="text-base sm:text-xl mb-6 sm:mb-8 leading-relaxed">
              Get technical specifications, pricing, and delivery details for your specific requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="action"
                className="h-11 px-6 text-base sm:h-12 sm:px-8 sm:text-lg"
              >
                Request Detailed Quote
              </Button>
              <Button
                variant="trust"
                className="h-11 px-6 text-base sm:h-12 sm:px-8 sm:text-lg"
              >
                Schedule Site Visit
              </Button>
            </div>
          </div>
        </section>


        {/* TDS Download Modal */}
        {showTDSModal && (
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
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-egyptian-blue truncate">Download TDS</h2>
                  <p className="text-gray-600 text-sm">
                    Technical Data Sheet for {product.name}
                  </p>
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

                  {/* Hidden field for current product */}
                  <input
                    type="hidden"
                    value={product?.name || ''}
                    onChange={() => { }}
                  />

                  {/* Show current product name (read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                    <div className="w-full border border-gray-200 rounded px-3 py-2 bg-gray-50 text-gray-700">
                      {product?.name}
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

                {/* OR Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                {/* Direct Download Button */}
                {product.tds?.url && (
                  <Button
                    variant="action"
                    className="w-full"
                    onClick={() => window.open(product.tds.url, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Direct Download
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Technical Support Modal */}
        {showTechnicalSupportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full h-full flex items-center justify-center p-4 sm:p-6">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-full overflow-y-auto relative">
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                  onClick={handleCloseTechnicalSupportModal}
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-bold mb-2 text-egyptian-blue">
                    Request Technical Support
                  </h2>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">
                    Get expert technical assistance for {product.name} ({product.abbreviation})
                  </p>

                  <form onSubmit={handleTechnicalSupportSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={technicalSupportData.name}
                          onChange={handleTechnicalSupportInputChange}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-egyptian-blue"
                          required
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={technicalSupportData.email}
                          onChange={handleTechnicalSupportInputChange}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-egyptian-blue"
                          required
                          placeholder="your.email@company.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company/Organization *</label>
                        <input
                          type="text"
                          name="company"
                          value={technicalSupportData.company}
                          onChange={handleTechnicalSupportInputChange}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-egyptian-blue"
                          required
                          placeholder="Your company name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Type *</label>
                        <select
                          name="projectType"
                          value={technicalSupportData.projectType}
                          onChange={handleTechnicalSupportInputChange}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-egyptian-blue"
                          required
                        >
                          <option value="">Select project type</option>
                          <option value="Road Construction">Road Construction</option>
                          <option value="Bridge Construction">Bridge Construction</option>
                          <option value="Building Construction">Building Construction</option>
                          <option value="Infrastructure Development">Infrastructure Development</option>
                          <option value="Maintenance & Repair">Maintenance & Repair</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Urgency Level *</label>
                      <select
                        name="urgency"
                        value={technicalSupportData.urgency}
                        onChange={handleTechnicalSupportInputChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-egyptian-blue"
                        required
                      >
                        <option value="">Select urgency level</option>
                        <option value="Low - General Inquiry">Low - General Inquiry</option>
                        <option value="Medium - Project Planning">Medium - Project Planning</option>
                        <option value="High - Active Project">High - Active Project</option>
                        <option value="Urgent - Critical Issue">Urgent - Critical Issue</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Technical Query *</label>
                      <textarea
                        name="technicalQuery"
                        value={technicalSupportData.technicalQuery}
                        onChange={handleTechnicalSupportInputChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-egyptian-blue"
                        rows={4}
                        required
                        placeholder="Please describe your technical query, application requirements, or specific challenges..."
                      />
                    </div>

                    <div className="pt-2">
                      <Button type="submit" variant="cta" className="w-full">
                        <Wrench className="h-4 w-4 mr-2" />
                        Request Technical Support via WhatsApp
                      </Button>
                    </div>

                    <div className="text-xs text-gray-500 text-center">
                      Our technical experts will respond within 4-6 hours during business days
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 bg-green-600">
          <Button size="sm" className="shadow-xl bg-green-600 hover:bg-green-700" onClick={handleWhatsAppRedirect}>
            <svg style={{ width: "20px", height: "20px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
              <path
                fill="white"
                d="M 64 2 C 29.8 2 2 29.8 2 64 C 2 74.5 4.5992188 84.800391 9.6992188 93.900391 L 4.4003906 113.30078 C 3.5003906 116.40078 4.3992188 119.60039 6.6992188 121.90039 C 8.9992188 124.20039 12.200781 125.10078 15.300781 124.30078 L 35.5 119 C 44.3 123.6 54.099609 126 64.099609 126 C 98.299609 126 126.09961 98.2 126.09961 64 C 126.09961 47.4 119.7 31.899219 108 20.199219 C 96.2 8.4992187 80.6 2 64 2 z M 64 8 C 79 8 93.099609 13.800391 103.59961 24.400391 C 114.19961 35.000391 120.1 49.1 120 64 C 120 94.9 94.9 120 64 120 C 54.7 120 45.399219 117.59922 37.199219 113.19922 C 36.799219 112.99922 36.300781 112.80078 35.800781 112.80078 C 35.500781 112.80078 35.3 112.80039 35 112.90039 L 13.699219 118.5 C 12.199219 118.9 11.200781 118.09922 10.800781 117.69922 C 10.400781 117.29922 9.6 116.30078 10 114.80078 L 15.599609 94.199219 C 15.799609 93.399219 15.700781 92.600391                 15.300781 91.900391 C 10.500781 83.500391 8 73.8 8 64 C 8 33.1 33.1 8 64 8 z M 64 17 C 38.1 17 17 38 17 64 C 17 72.3 19.200781 80.4 23.300781 87.5 C 24.900781 90.3 25.3 93.599219 24.5 96.699219 L 21.599609 107.19922 L 32.800781 104.30078 C 33.800781 104.00078 34.800781 103.90039 35.800781 103.90039 C 37.800781 103.90039 39.8 104.40039 41.5 105.40039 C 48.4 109.00039 56.1 111 64 111 C 89.9 111 111 89.9 111 64 C 111 51.4 106.09922 39.599219 97.199219 30.699219 C 88.399219 21.899219 76.6 17 64 17 z M 43.099609 36.699219 L 45.900391 36.699219 C 47.000391 36.699219 48.099219 36.799219 49.199219 39.199219 C 50.499219 42.099219 53.399219 49.399609 53.699219 50.099609 C 54.099219 50.799609 54.300781 51.699219 53.800781 52.699219 C 53.300781 53.699219 53.100781 54.299219 52.300781 55.199219 C 51.600781 56.099219 50.699609 57.100781 50.099609 57.800781 C 49.399609 58.500781 48.6 59.300781 49.5 60.800781 C 50.4 62.300781 53.299219 67.1 57.699219 71 C 63.299219 76 68.099609 77.600781 69.599609 78.300781 C 71.099609 79.000781 71.900781 78.900391 72.800781 77.900391 C 73.700781 76.900391 76.5 73.599609 77.5 72.099609 C 78.5 70.599609 79.500781 70.900391 80.800781 71.400391 C 82.200781 71.900391 89.400391 75.499219 90.900391 76.199219 C 92.400391 76.899219 93.399219 77.300391 93.699219 77.900391 C 94.099219 78.700391 94.100391 81.599609 92.900391 85.099609 C 91.700391 88.499609 85.700391 91.899609 82.900391 92.099609 C 80.200391 92.299609 77.699219 93.300391 65.199219 88.400391 C 50.199219 82.500391 40.7 67.099609 40 66.099609 C 39.3 65.099609 34 58.100781 34 50.800781 C 34 43.500781 37.799219 40 39.199219 38.5 C 40.599219 37 42.099609 36.699219 43.099609 36.699219 z"
              />
            </svg>
            Quick Quote
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;