import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, MapPin, Phone, Mail, Clock, FileText, MessageSquare, AlertCircle, X, Calendar } from 'lucide-react';
import { createInquiry } from '../services/inquiry';
import { toast } from "sonner";

const Container = ({ children, className = '' }) => (
  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

const handleRequestSample = () => {
  const phoneNumber = "9528355555";
  const message = "Hi, my name is ____ I want a sample";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank");
};

const InteractiveMap = () => (
  <section className="py-0">
    <div className="w-full h-96">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3363.66593850005!2d75.1203227!3d32.53506799999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391c192d60165219%3A0x9a6921bc9ffe5a89!2sGajpati%20Industries%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1754547734807!5m2!1sen!2sin"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        title="Gajpati Industries Manufacturing Locations"
        aria-label="Map showing Gajpati Industries manufacturing locations across India"
      ></iframe>
    </div>
  </section>
);

const Contact = () => {
  const products = useMemo(
    () => [
      { value: "Bitumen", label: "Bitumen" },
      { value: "Gabion", label: "Gabion" },
      { value: "Construct", label: "Construction Chemicals" },
    ],
    []
  );

  const purposes = useMemo(() => ['Tender', 'Site Use', 'Resale', 'Other'], []);

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    companyName: '',
    designation: '',
    city: '',
    purpose: '',
    selectedProducts: [],
    description: '',
    consent: false,
  });
  const [errors, setErrors] = useState({});

  // Plant Visit Modal State
  const [showPlantVisitModal, setShowPlantVisitModal] = useState(false);
  const [plantVisitData, setPlantVisitData] = useState({
    name: '',
    email: '',
    company: '',
    preferredDate: '',
    purpose: ''
  });

  const mutation = useMutation({
    mutationFn: createInquiry,
    onSuccess: async (data, variables) => {
      console.log("Success! Showing toast...");

      toast.success("✅ Success!", {
        description: "Inquiry submitted successfully! Our team will respond within 24 hours.",
        duration: 3000,
      });

      const selectedProductLabels = products
        .filter((p) => variables.selectedProducts.includes(p.value))
        .map((p) => p.label);

      // 🔥 SIMPLE EMAIL FORMAT
      try {
        const emailResponse = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: "17b8be4f-19fa-4a8f-8017-33fd56187fb9",
            subject: `New Inquiry from ${variables.customerName}`,
            from_name: "Gajpati Website",
            name: "Gajpati Industries",
            email: variables.customerEmail,
            message: `
NEW INQUIRY RECEIVED

Name: ${variables.customerName}
Email: ${variables.customerEmail}
Phone: ${variables.customerPhone}
Company: ${variables.companyName}
Designation: ${variables.designation || 'Not provided'}
City: ${variables.city}

Purpose: ${variables.purpose}
Products: ${selectedProductLabels.join(', ')}

Additional Details:
${variables.description || 'No additional details'}

Submitted: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

Reply to: ${variables.customerEmail}
          `,
          }),
        });

        const emailResult = await emailResponse.json();

        if (emailResult.success) {
          console.log("✅ Email sent successfully");
          toast.success("📧 Email Sent!", {
            description: "Inquiry forwarded to our team",
            duration: 2000,
          });
        } else {
          console.error("❌ Email failed:", emailResult.message);
        }
      } catch (emailError) {
        console.error("❌ Email error:", emailError);
      }

      // WhatsApp redirect (existing code)
      const message = `New Inquiry Submission:\n\nName: ${variables.customerName}\nEmail: ${variables.customerEmail}\nPhone: ${variables.customerPhone}\nCompany: ${variables.companyName}\nCity: ${variables.city}\nPurpose: ${variables.purpose}\nProducts: ${selectedProductLabels.join(', ')}\nDescription: ${variables.description || 'N/A'}`;

      setTimeout(() => {
        const whatsappUrl = `https://wa.me/9528355555?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      }, 2000);

      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        companyName: '',
        designation: '',
        city: '',
        purpose: '',
        selectedProducts: [],
        description: '',
        consent: false,
      });
    },
    onError: (err) => {
      toast.error("❌ Error", {
        description: err.message || "Failed to submit inquiry.",
        duration: 3000,
      });
    },
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: '' }));
  };

  const handleProductChange = (productValue) => {
    setFormData((prev) => {
      const selectedProducts = prev.selectedProducts.includes(productValue)
        ? prev.selectedProducts.filter((p) => p !== productValue)
        : [...prev.selectedProducts, productValue];
      return { ...prev, selectedProducts };
    });
    setErrors((prev) => ({ ...prev, selectedProducts: '' }));
  };

  const handleConsentChange = (checked) => {
    setFormData((prev) => ({ ...prev, consent: checked }));
    setErrors((prev) => ({ ...prev, consent: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerName || formData.customerName.length < 3) {
      newErrors.customerName = 'Full name is required and must be at least 3 characters';
    }
    if (!formData.customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'A valid email address is required';
    }
    if (!formData.customerPhone || !/^\+?\d{10,12}$/.test(formData.customerPhone)) {
      newErrors.customerPhone = 'Phone number must be 10-12 digits, optionally starting with +';
    }
    if (!formData.companyName || formData.companyName.length < 3) {
      newErrors.companyName = 'Company name is required';
    }
    if (!formData.city || formData.city.length < 3) {
      newErrors.city = 'City is required';
    }
    if (!formData.purpose) {
      newErrors.purpose = 'Purpose of request is required';
    }
    if (formData.selectedProducts.length === 0) {
      newErrors.selectedProducts = 'At least one product must be selected';
    }
    if (!formData.consent) {
      newErrors.consent = 'You must consent to data processing';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    mutation.mutate(formData);
  };

  // Plant Visit Modal Functions
  const handlePlantVisitClick = () => {
    setPlantVisitData({
      name: '',
      email: '',
      company: '',
      preferredDate: '',
      purpose: ''
    });
    setShowPlantVisitModal(true);
  };

  const handleClosePlantVisitModal = () => {
    setShowPlantVisitModal(false);
  };

  const handlePlantVisitInputChange = (e) => {
    setPlantVisitData({
      ...plantVisitData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlantVisitSubmit = (e) => {
    e.preventDefault();

    const message = `Hello! I would like to schedule a plant visit.

*Plant Visit Request Details:*
Name: ${plantVisitData.name}
Email: ${plantVisitData.email}
Company: ${plantVisitData.company}
Preferred Date: ${plantVisitData.preferredDate}
Purpose: ${plantVisitData.purpose}

Please confirm the visit schedule and provide any additional requirements.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = '919528355555';
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, '_blank');

    setTimeout(() => {
      setShowPlantVisitModal(false);
    }, 1000);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Gajpati Industries - We're Here for You</title>
        <meta
          name="description"
          content="Connect with Gajpati Industries for project consultations, product specifications, and customized chemical solutions. Submit your inquiry or contact our experts today."
        />
        <meta
          name="keywords"
          content="contact Gajpati Industries, infrastructure chemicals, project inquiry, technical support, manufacturing locations"
        />
        <meta property="og:title" content="Contact Us | Gajpati Industries - We're Here for You" />
        <meta
          property="og:description"
          content="Connect with Gajpati Industries for project consultations, product specifications, and customized chemical solutions. Submit your inquiry or contact our experts today."
        />
        <meta property="og:image" content="https://gajpatiindustries.com/images/contact-og.jpg" />
        <meta property="og:url" content="https://gajpatiindustries.com/contact" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Us | Gajpati Industries - We're Here for You" />
        <meta
          name="twitter:description"
          content="Connect with Gajpati Industries for project consultations, product specifications, and customized chemical solutions. Submit your inquiry or contact our experts today."
        />
        <meta name="twitter:image" content="https://gajpatiindustries.com/images/contact-og.jpg" />
        <link rel="canonical" href="https://gajpatiindustries.com/contact" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            'name': 'Gajpati Industries Pvt. Ltd.',
            'url': 'https://gajpatiindustries.com',
            'contactPoint': [
              {
                '@type': 'ContactPoint',
                'telephone': '+91 95283 55555',
                'contactType': 'Sales Hotline',
                'availableLanguage': ['English', 'Hindi'],
                'areaServed': 'IN',
              },
              {
                '@type': 'ContactPoint',
                'telephone': '+91 95283 55555',
                'contactType': 'Technical Support',
                'availableLanguage': ['English', 'Hindi'],
                'areaServed': 'IN',
              },
              {
                '@type': 'ContactPoint',
                'email': 'sales@gajpatiindustries.com',
                'contactType': 'Sales',
                'areaServed': 'IN',
              },
            ],
            'address': {
              '@type': 'PostalAddress',
              'streetAddress': 'Near Power Grid, SIDCO IGC Phase III',
              'addressLocality': 'Samba',
              'addressRegion': 'Jammu',
              'postalCode': '184121',
              'addressCountry': 'IN',
            },
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://gajpatiindustries.com' },
              { '@type': 'ListItem', 'position': 2, 'name': 'Contact', 'item': 'https://gajpatiindustries.com/contact' },
            ],
          })}
        </script>
      </Helmet>
      <div className="min-h-screen bg-background">
        <section className="bg-gradient-hero text-white py-16" aria-labelledby="contact-heading">
          <Container>
            <div className="text-center">
              <h1 id="contact-heading" className="font-display font-bold text-3xl sm:text-4xl lg:text-hero mb-3 sm:mb-4">
                We're Here for You
              </h1>
              <p className="text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl sm:max-w-3xl mx-auto">
                Connect with our technical experts for project consultations, product specifications,
                and customized chemical solutions
              </p>
            </div>
          </Container>
        </section>
        <section className="py-16 bg-white">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-egyptian-blue text-h2 font-display" id="inquiry-form-title">
                      Project Inquiry Form
                    </CardTitle>
                    <p className="text-gray-600">
                      Share your project details and our experts will respond within 24 hours
                    </p>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6 bg-gray-50 rounded-b-lg">
                    <form onSubmit={handleSubmit} className="space-y-6" aria-labelledby="inquiry-form-title">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <Label htmlFor="customerName" className="text-sm font-medium">
                            Full Name <span aria-hidden="true">*</span>
                          </Label>
                          <Input
                            id="customerName"
                            value={formData.customerName}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            disabled={mutation.isLoading}
                            className="w-full placeholder:text-gray-400"
                            aria-required="true"
                            aria-invalid={!!errors.customerName}
                            aria-describedby={errors.customerName ? 'customerName-error' : undefined}
                          />
                          {errors.customerName && (
                            <p id="customerName-error" className="text-red-600 text-sm">
                              {errors.customerName}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="designation" className="text-sm font-medium">
                            Designation
                          </Label>
                          <Input
                            id="designation"
                            value={formData.designation}
                            onChange={handleInputChange}
                            placeholder="e.g., Project Manager, Civil Engineer"
                            disabled={mutation.isLoading}
                            className="w-full placeholder:text-gray-400"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <Label htmlFor="customerEmail" className="text-sm font-medium">
                            Email Address <span aria-hidden="true">*</span>
                          </Label>
                          <Input
                            id="customerEmail"
                            type="email"
                            value={formData.customerEmail}
                            onChange={handleInputChange}
                            placeholder="your.email@company.com"
                            disabled={mutation.isLoading}
                            className="w-full placeholder:text-gray-400"
                            aria-required="true"
                            aria-invalid={!!errors.customerEmail}
                            aria-describedby={errors.customerEmail ? 'customerEmail-error' : undefined}
                          />
                          {errors.customerEmail && (
                            <p id="customerEmail-error" className="text-red-600 text-sm">
                              {errors.customerEmail}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="customerPhone" className="text-sm font-medium">
                            Phone Number <span aria-hidden="true">*</span>
                          </Label>
                          <Input
                            id="customerPhone"
                            value={formData.customerPhone}
                            onChange={handleInputChange}
                            placeholder="e.g., +91 9528355555"
                            disabled={mutation.isLoading}
                            className="w-full placeholder:text-gray-400"
                            aria-required="true"
                            aria-invalid={!!errors.customerPhone}
                            aria-describedby={errors.customerPhone ? 'customerPhone-error' : undefined}
                          />
                          {errors.customerPhone && (
                            <p id="customerPhone-error" className="text-red-600 text-sm">
                              {errors.customerPhone}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <Label htmlFor="companyName" className="text-sm font-medium">
                            Company/Organization <span aria-hidden="true">*</span>
                          </Label>
                          <Input
                            id="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            placeholder="Your company name"
                            disabled={mutation.isLoading}
                            className="w-full placeholder:text-gray-400"
                            aria-required="true"
                            aria-invalid={!!errors.companyName}
                            aria-describedby={errors.companyName ? 'companyName-error' : undefined}
                          />
                          {errors.companyName && (
                            <p id="companyName-error" className="text-red-600 text-sm">
                              {errors.companyName}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city" className="text-sm font-medium">
                            City/Site Location <span aria-hidden="true">*</span>
                          </Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="City, State"
                            disabled={mutation.isLoading}
                            className="w-full placeholder:text-gray-400"
                            aria-required="true"
                            aria-invalid={!!errors.city}
                            aria-describedby={errors.city ? 'city-error' : undefined}
                          />
                          {errors.city && (
                            <p id="city-error" className="text-red-600 text-sm">{errors.city}</p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="purpose" className="text-sm font-medium">
                          Purpose of Request <span aria-hidden="true">*</span>
                        </Label>
                        <Select
                          value={formData.purpose}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, purpose: value }))}
                          disabled={mutation.isLoading}
                          aria-required="true"
                          aria-invalid={!!errors.purpose}
                          aria-describedby={errors.purpose ? 'purpose-error' : undefined}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select purpose" />
                          </SelectTrigger>
                          <SelectContent>
                            {purposes.map((p) => (
                              <SelectItem key={p} value={p}>
                                {p}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.purpose && (
                          <p id="purpose-error" className="text-red-600 text-sm">{errors.purpose}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Project Details & Requirements <span aria-hidden="true">*</span>
                        </Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {products.map((product) => (
                            <Badge
                              key={product.value}
                              variant="outline"
                              className={`cursor-pointer ${formData.selectedProducts.includes(product.value)
                                ? 'bg-egyptian-blue text-white'
                                : 'hover:bg-egyptian-blue hover:text-white'
                                }`}
                              onClick={() => handleProductChange(product.value)}
                              disabled={mutation.isLoading}
                            >
                              {product.label}
                            </Badge>
                          ))}
                        </div>
                        {errors.selectedProducts && (
                          <p className="text-red-600 text-sm">{errors.selectedProducts}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium">
                          Description (Optional)
                        </Label>
                        <textarea
                          id="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Provide additional details about your inquiry (e.g., project scope, timeline, or specific requirements)"
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-egyptian-blue focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                          rows={4}
                          disabled={mutation.isLoading}
                          aria-describedby={errors.description ? 'description-error' : undefined}
                        />
                        {errors.description && (
                          <p id="description-error" className="text-red-600 text-sm">{errors.description}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="consent"
                            checked={formData.consent}
                            onCheckedChange={handleConsentChange}
                            disabled={mutation.isLoading}
                            aria-required="true"
                            aria-invalid={!!errors.consent}
                            aria-describedby={errors.consent ? 'consent-error' : undefined}
                          />
                          <Label htmlFor="consent" className="text-sm">
                            I agree to the processing of my above data for this inquiry{' '}
                            <span aria-hidden="true">*</span>
                          </Label>
                        </div>
                        {errors.consent && (
                          <p id="consent-error" className="text-red-600 text-sm">{errors.consent}</p>
                        )}
                      </div>
                      <div className="space-y-4">
                        <Button
                          variant="cta"
                          size="xl"
                          type="submit"
                          className="w-full placeholder:text-gray-400"
                          disabled={mutation.isLoading}
                          aria-label="Submit inquiry form"
                        >
                          {mutation.isLoading ? 'Submitting...' : 'Submit Inquiry'}
                        </Button>
                        <div className="text-center text-sm text-gray-600">
                          <span className="flex items-center justify-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Typical response time: 4-6 hours during business days
                          </span>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-egyptian-blue flex items-center">
                      <Phone className="h-5 w-5 mr-2" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <Phone className="h-5 w-5 text-amber mt-0.5" />
                        <div>
                          <div className="font-semibold">Sales Hotline</div>
                          <div className="text-gray-600">+91 95283 55555</div>
                          <div className="text-sm text-gray-500">Mon-Sat, 9 AM - 7 PM</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Mail className="h-5 w-5 text-amber mt-0.5" />
                        <div>
                          <div className="font-semibold">Email</div>
                          <div className="text-gray-600">sales@gajpatiindustries.com</div>
                          <div className="text-sm text-gray-500">Response within 4 hours</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <MessageSquare className="h-5 w-5 text-amber mt-0.5" />
                        <div>
                          <div className="font-semibold">WhatsApp Business</div>
                          <div className="text-gray-600">+91 95283 55555</div>
                          <div className="text-sm text-gray-500">Quick queries & updates</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-egyptian-blue flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Technical Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div>
                          <div className="font-semibold">Technical Helpline</div>
                          <div className="text-gray-600">+91 95283 55555</div>
                          <div className="text-sm text-gray-500">Mon-Sat, 9 AM - 7 PM</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div>
                          <div className="font-semibold">Email</div>
                          <div className="text-gray-600">sales@gajpatiindustries.com</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div>
                          <div className="font-semibold">Available</div>
                          <div className="text-sm text-gray-500">Mon-Fri, 9 AM - 6 PM</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-egyptian-blue flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Head Office
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div>
                          <div className="font-semibold">Gajpati Industries Pvt. Ltd.</div>
                          <div className="text-sm text-gray-500">Near Power Grid, SIDCO IGC Phase III
                            Samba, Jammu, J&K 184121, India</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div>
                          <div className="text-gray-500 text-sm">ISO / BIS Certified</div>
                          <div className="text-gray-500 text-sm">NDA Available on Request</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  <Button
                    variant="variants"
                    size="lg"
                    className="w-full rounded-md bg-amber text-black py-3 px-4 text-sm font-medium hover:bg-amber-dark focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2"
                    onClick={handlePlantVisitClick}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Plant Visit
                  </Button>
                  <Button
                    variant="enterprise"
                    size="lg"
                    className="w-full"
                    onClick={handleRequestSample}
                  >
                    Request Product Samples
                  </Button>
                  <Button variant="trust" size="lg" asChild className="w-full">
                    <a href="/downloads/company-profile.pdf" download>
                      Download Company Profile
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </section>
        <section className="py-0">
          <InteractiveMap />
        </section>

        {/* Plant Visit Modal - Phone Number field removed */}
        {showPlantVisitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                onClick={handleClosePlantVisitModal}
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2 text-egyptian-blue">Schedule Plant Visit</h2>
                <p className="text-gray-600 mb-4 text-sm">
                  Visit our state-of-the-art manufacturing facility in Jammu & Kashmir
                </p>
                <form onSubmit={handlePlantVisitSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={plantVisitData.name}
                      onChange={handlePlantVisitInputChange}
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
                      value={plantVisitData.email}
                      onChange={handlePlantVisitInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-egyptian-blue"
                      required
                      placeholder="your.email@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company/Organization *</label>
                    <input
                      type="text"
                      name="company"
                      value={plantVisitData.company}
                      onChange={handlePlantVisitInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-egyptian-blue"
                      required
                      placeholder="Your company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date *</label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={plantVisitData.preferredDate}
                      onChange={handlePlantVisitInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-egyptian-blue"
                      required
                      min={new Date().toISOString().split('T')[0]} // Prevent past dates
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purpose of Visit</label>
                    <textarea
                      name="purpose"
                      value={plantVisitData.purpose}
                      onChange={handlePlantVisitInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-egyptian-blue"
                      rows={3}
                      placeholder="e.g., Product evaluation, technical discussion, business partnership..."
                    />
                  </div>
                  <div className="pt-2">
                    <Button type="submit" variant="cta" className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      Request Plant Visit via WhatsApp
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    Our team will confirm the visit schedule within 24 hours
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Contact;