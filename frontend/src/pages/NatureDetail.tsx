import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Download, CheckCircle, Factory, Shield, FileText, MessageCircleCode } from "lucide-react";
import { handleWhatsAppRedirect } from '../helper/whatsapp';

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
}
console.log(import.meta.env.VITE_API_URL);

const NatureDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mainImageIdx, setMainImageIdx] = useState(0);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        fetch(`${import.meta.env.VITE_API_URL || "https://gajpati-backend.onrender.com"}/api/v1/products/by-nature?productId=${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch product");
                return res.json();
            })
            .then(data => {
                const found = data.data?.products?.find((p: any) => p._id === id) || data.data;
                setProduct(found || null);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="text-center py-12">Loading...</div>;
    if (error || !product) return <div className="text-center text-red-500 py-12">{error || "Product not found."}</div>;

    // Prepare images for gallery
    const images = product.images && product.images.length > 0
        ? [...product.images].sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0)).slice(0, 5)
        : [];
    const mainImage = images[mainImageIdx] || images[0];

    return (
        <div className="min-h-screen bg-background">
            {/* Breadcrumb */}
            <div className="bg-platinum/30 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-sm text-gray-600">
                        <Link to="/" className="hover:underline text-egyptian-blue font-medium">Products</Link>
                        {product.plantId?.name && (product.natureId?._id || product.natureId?.id) && (
                            <>
                                {" / "}
                                <Link
                                    to={`/product-list?nature=${product.natureId._id || product.natureId.id}`}
                                    className="hover:underline text-egyptian-blue font-medium"
                                >
                                    {product.plantId.name}
                                </Link>
                            </>
                        )}
                        {" / "}
                        <span className="text-eerie-black font-semibold">{product.abbreviation} {product.name}</span>
                    </div>
                </div>
            </div>

            {/* Product Header */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Product Image & Gallery */}
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
                            {/* Thumbnails */}
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
                        {/* Product Info */}
                        <div className="space-y-6">
                            <div>
                                <Badge variant="secondary" className="mb-3">{product.plantId?.name || "Plant"}</Badge>
                                <h1 className="font-display font-bold text-h1 text-eerie-black mb-4">
                                    {product.plantId?.name} {product.name}
                                </h1>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    {product.description}
                                </p>
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
                            {/* CTA Buttons */}
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    {product.tds?.url && (
                                        <Button asChild variant="cta" size="lg" className="flex-1">
                                            <a href={product.tds.url} target="_blank" rel="noopener noreferrer">
                                                <Download className="h-4 w-4 mr-2" />
                                                Download TDS
                                            </a>
                                        </Button>
                                    )}
                                    {product.brochure?.url && (
                                        <Button asChild variant="action" size="lg" className="flex-1">
                                            <a href={product.brochure.url} target="_blank" rel="noopener noreferrer">
                                                <Download className="h-4 w-4 mr-2" />
                                                Download Brochure
                                            </a>
                                        </Button>
                                    )}
                                </div>
                                <Button variant="trust" size="lg" className="w-full">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Request Technical Support
                                </Button>
                            </div>
                            {/* Quick Info */}
                            <Card className="shadow-card">
                                <CardContent className="p-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500">Category:</span>
                                            <div className="font-medium">{product.natureId?.name || '-'}</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Setting Time:</span>
                                            <div className="font-medium">2-5 minutes</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Shelf Life:</span>
                                            <div className="font-medium">6 months</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Packaging:</span>
                                            <div className="font-medium">200L, 1000L</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Technical Specifications */}
            <section className="py-12 bg-platinum/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Technical Specs */}
                        <div className="lg:col-span-2">
                            <Card className="shadow-card">
                                <CardHeader>
                                    <CardTitle className="text-egyptian-blue">Technical Specifications</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {product.technicalSpecifications && product.technicalSpecifications.length > 0 ? (
                                        <div className="space-y-3">
                                            {product.technicalSpecifications.map((spec, idx) => (
                                                <div key={idx} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                                                    <span className="text-gray-600 font-medium">{spec.key}</span>
                                                    <span className="text-eerie-black font-semibold">{spec.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-gray-500">No technical specifications available.</div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Plant Availability */}
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
            {/* Applications & Projects */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Applications */}
                        <Card className="shadow-card">
                            <CardHeader>
                                <CardTitle className="text-egyptian-blue">Applications</CardTitle>
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

                        {/* Reference Projects */}
                        <Card className="shadow-card">
                            <CardHeader>
                                <CardTitle className="text-egyptian-blue">Reference Projects</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {/* This section will need to be populated with actual projects */}
                                    <li className="p-3 bg-amber/5 rounded-lg border-l-4 border-amber">
                                        <span className="text-gray-700 text-sm">Delhi Metro Phase 4 - Access Roads</span>
                                    </li>
                                    <li className="p-3 bg-amber/5 rounded-lg border-l-4 border-amber">
                                        <span className="text-gray-700 text-sm">Mumbai-Pune Expressway - Maintenance</span>
                                    </li>
                                    <li className="p-3 bg-amber/5 rounded-lg border-l-4 border-amber">
                                        <span className="text-gray-700 text-sm">Chennai Port Connectivity - New Construction</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Certifications */}
            <section className="py-12 bg-platinum/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Card className="shadow-card">
                        <CardHeader>
                            <CardTitle className="text-egyptian-blue text-center">Certifications & Compliance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* This section will need to be populated with actual certifications */}
                                <div className="text-center p-4 bg-white rounded-lg border">
                                    <Shield className="h-8 w-8 text-amber mx-auto mb-2" />
                                    <div className="text-sm font-medium text-eerie-black">IS 8887:2004 Compliant</div>
                                </div>
                                <div className="text-center p-4 bg-white rounded-lg border">
                                    <Shield className="h-8 w-8 text-amber mx-auto mb-2" />
                                    <div className="text-sm font-medium text-eerie-black">ASTM D977 Tested</div>
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

            {/* Bottom CTA */}
            <section className="py-16 bg-gradient-hero text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="font-display font-bold text-h2 mb-6">
                        Ready to Use {product.abbreviation} in Your Project?
                    </h2>
                    <p className="text-xl mb-8 leading-relaxed">
                        Get technical specifications, pricing, and delivery details for your specific requirements.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button variant="action" size="xl">
                            Request Detailed Quote
                        </Button>
                        <Button variant="trust" size="xl">
                            Schedule Site Visit
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
    );
};

export default NatureDetail;