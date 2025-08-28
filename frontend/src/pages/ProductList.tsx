import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Download, MessageCircleCode } from "lucide-react";
import { handleWhatsAppRedirect } from '../helper/whatsapp';

interface Product {
  _id: string;
  name: string;
  shortDescription: string;
  images?: { url: string; alt: string; isPrimary?: boolean }[];
  brochure?: { url: string; title: string };
  plantId: { name: string; certifications: string[] };
  plantAvailability?: { state: string }[];
}

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const natureId = searchParams.get("nature");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!natureId) {
      setError("No nature selected.");
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL || "https://gajpati-backend.onrender.com"}/api/v1/products/by-nature?natureId=${natureId}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then(data => setProducts(data.data?.products || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [natureId]);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-12">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="font-display font-bold text-h1 text-egyptian-blue mb-8">
        Products
      </h2>
      {products.length === 0 ? (
        <div className="text-center text-gray-500">No products found for this nature.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(product => (
            <Card key={product._id} className="shadow-card hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-0">
                {/* Product Image */}
                <div className="w-full h-48 bg-gradient-to-br from-platinum to-white border-b border-gray-200 overflow-hidden flex items-center justify-center">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images.find(img => img.isPrimary)?.url || product.images[0].url}
                      alt={product.images.find(img => img.isPrimary)?.alt || product.images[0].alt}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-6xl text-egyptian-blue/20 font-bold">
                      {product.name.charAt(0)}
                    </div>
                  )}
                </div>
                {/* Product Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {product.plantId?.name || "Plant"}
                    </Badge>
                    <Badge variant="outline" className="text-xs text-amber border-amber">
                      {product.plantId?.certifications?.[0] || "Certification"}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg text-eerie-black mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 leading-relaxed">
                    {product.shortDescription}
                  </p>
                  {/* Plant Availability */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Available at:</p>
                    <div className="flex flex-wrap gap-1">
                      {product.plantAvailability && product.plantAvailability.length > 0 ? (
                        product.plantAvailability.map((pa, idx) => (
                          <Badge key={pa.state || idx} variant="outline" className="text-xs">
                            {pa.state}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline" className="text-xs">N/A</Badge>
                      )}
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      asChild
                      variant="enterprise"
                      size="sm"
                      className="flex-1"
                    >
                      <Link to={`/product/${product._id}`}>
                        View Details
                      </Link>
                    </Button>
                    {product.brochure?.url && (
                      <Button asChild variant="download" size="sm">
                        <a href={product.brochure.url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
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

export default ProductList;