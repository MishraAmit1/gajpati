import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";
import { createQuote } from "../services/quote";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const products = [
  { value: "Bitumen", label: "Bitumen" },
  { value: "Gabion", label: "Gabion" },
  { value: "Construct", label: "Construction Chemicals" },
];

const QuoteModal = ({ isOpen, setIsOpen }) => {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    city: "",
    selectedProducts: [],
    additionalRequirement: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleProductChange = (productValue) => {
    setFormData((prev) => {
      const selectedProducts = prev.selectedProducts.includes(productValue)
        ? prev.selectedProducts.filter((p) => p !== productValue)
        : [...prev.selectedProducts, productValue];
      return { ...prev, selectedProducts };
    });
    setErrors((prev) => ({ ...prev, selectedProducts: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerName || formData.customerName.length < 3) {
      newErrors.customerName =
        "Full name is required and must be at least 3 characters";
    }
    if (
      !formData.customerEmail ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)
    ) {
      newErrors.customerEmail = "A valid email address is required";
    }
    if (!formData.city || formData.city.length < 3) {
      newErrors.city = "City is required and must be at least 3 characters";
    }
    if (formData.selectedProducts.length === 0) {
      newErrors.selectedProducts = "At least one product must be selected";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setSuccess("");
    setError("");
    setShowSuccess(false);

    try {
      const selectedProductLabels = products
        .filter((p) => formData.selectedProducts.includes(p.value))
        .map((p) => p.label);

      // 1. Backend save
      const payload = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        city: formData.city,
        selectedProducts: formData.selectedProducts,
        additionalRequirement: formData.additionalRequirement,
      };
      await createQuote(payload);

      // 2. 🔥 SIMPLE EMAIL
      try {
        const emailResponse = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: "95863a32-39e4-4218-be68-346273f0df06",
            subject: `Quote Request from ${formData.customerName}`,
            from_name: "Gajpati Website",
            name: "Gajpati Industries",
            email: formData.customerEmail,
            message: `
QUOTE REQUEST RECEIVED

Name: ${formData.customerName}
Email: ${formData.customerEmail}
Phone: ${formData.customerPhone}
City: ${formData.city}

Products: ${selectedProductLabels.join(", ")}

Additional Requirements:
${formData.additionalRequirement || "None"}

Submitted: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}

Reply to: ${formData.customerEmail}
          `,
          }),
        });

        const emailResult = await emailResponse.json();

        if (emailResult.success) {
          console.log("✅ Quote email sent");
        }
      } catch (emailError) {
        console.error("❌ Email error:", emailError);
      }

      // 3. Success message
      setSuccess(
        "Quote request submitted successfully! Our team will respond within 24 hours."
      );
      setShowSuccess(true);

      // 4. WhatsApp redirect
      const whatsappMessage = `New Quote Request:\n\nName: ${
        formData.customerName
      }\nEmail: ${formData.customerEmail}\nPhone: ${
        formData.customerPhone
      }\nCity: ${formData.city}\nProducts: ${selectedProductLabels.join(
        ", "
      )}\nAdditional Requirement: ${formData.additionalRequirement || "N/A"}`;

      const whatsappUrl = `https://wa.me/+917777909218?text=${encodeURIComponent(
        whatsappMessage
      )}`;

      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
      }, 1500);

      // 5. Reset form
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        city: "",
        selectedProducts: [],
        additionalRequirement: "",
      });

      setTimeout(() => setIsOpen(false), 3000);
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message || "Failed to submit quote request");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-egyptian-blue text-h2 font-display">
            Request a Quote
          </DialogTitle>
        </DialogHeader>
        <Card className="border-none shadow-none">
          <CardContent className="p-6 space-y-6 bg-gray-50 rounded-b-lg">
            {showSuccess && (
              <div
                className="flex items-center p-4 bg-green-100 border border-green-400 rounded-lg text-green-800 shadow-md transition-opacity duration-500 ease-in-out"
                style={{ opacity: showSuccess ? 1 : 0 }}
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">{success}</span>
              </div>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name & Email in one row */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="customerName" className="text-sm font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    disabled={loading}
                    className="w-full placeholder:text-gray-400"
                  />
                  {errors.customerName && (
                    <p className="text-red-600 text-sm">
                      {errors.customerName}
                    </p>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <Label
                    htmlFor="customerEmail"
                    className="text-sm font-medium"
                  >
                    Email Address *
                  </Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    placeholder="your.email@company.com"
                    disabled={loading}
                    className="w-full placeholder:text-gray-400"
                  />
                  {errors.customerEmail && (
                    <p className="text-red-600 text-sm">
                      {errors.customerEmail}
                    </p>
                  )}
                </div>
              </div>
              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="customerPhone" className="text-sm font-medium">
                  Phone Number *
                </Label>
                <Input
                  id="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  placeholder="+91 98756-XXXX"
                  disabled={loading}
                  className="w-full placeholder:text-gray-400"
                />
                {errors.customerPhone && (
                  <p className="text-red-600 text-sm">{errors.customerPhone}</p>
                )}
              </div>
              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium">
                  City/Site Location *
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City, State"
                  disabled={loading}
                  className="w-full placeholder:text-gray-400"
                />
                {errors.city && (
                  <p className="text-red-600 text-sm">{errors.city}</p>
                )}
              </div>
              {/* Products */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Project Details & Requirements *
                </Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {products.map((product) => (
                    <Badge
                      key={product.value}
                      variant="outline"
                      className={`cursor-pointer ${
                        formData.selectedProducts.includes(product.value)
                          ? "bg-egyptian-blue text-white"
                          : "hover:bg-egyptian-blue hover:text-white"
                      }`}
                      onClick={() => handleProductChange(product.value)}
                      disabled={loading}
                    >
                      {product.label}
                    </Badge>
                  ))}
                </div>
                {errors.selectedProducts && (
                  <p className="text-red-600 text-sm">
                    {errors.selectedProducts}
                  </p>
                )}
              </div>
              {/* Additional Requirement */}
              <div className="space-y-2">
                <Label
                  htmlFor="additionalRequirement"
                  className="text-sm font-medium"
                >
                  Additional Requirement (Optional)
                </Label>
                <textarea
                  id="additionalRequirement"
                  value={formData.additionalRequirement}
                  onChange={handleInputChange}
                  placeholder="Any other requirement or details"
                  disabled={loading}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                />
              </div>
              <DialogFooter>
                <Button
                  variant="cta"
                  size="xl"
                  type="submit"
                  className="w-full placeholder:text-gray-400"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Quote Request"}
                </Button>
              </DialogFooter>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteModal;
