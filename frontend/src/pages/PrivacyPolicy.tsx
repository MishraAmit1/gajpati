import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock, Eye, UserCheck, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { handleWhatsAppRedirect } from '../helper/whatsapp';

const Container = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

const PrivacyPolicy = () => {
    const lastUpdated = "January 15, 2025";
    const effectiveDate = "January 15, 2025";

    return (
        <>
            <Helmet>
                <title>Cookies Policy | Gajpati Industries</title>
                <meta
                    name="description"
                    content="Learn how Gajpati Industries collects, uses, and protects your personal information. Our Cookies Policy outlines our commitment to data security and transparency."
                />
                <meta
                    name="keywords"
                    content="Cookies Policy, data protection, personal information, Gajpati Industries, data security"
                />
                <meta property="og:title" content="Cookies Policy | Gajpati Industries" />
                <meta
                    property="og:description"
                    content="Learn how Gajpati Industries collects, uses, and protects your personal information."
                />
                <meta property="og:url" content="https://gajpatiindustries.com/privacy-policy" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content="Cookies Policy | Gajpati Industries" />
                <meta
                    name="twitter:description"
                    content="Learn how Gajpati Industries collects, uses, and protects your personal information."
                />
                <link rel="canonical" href="https://gajpatiindustries.com/privacy-policy" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": "Cookies Policy",
                        "description": "Cookies Policy for Gajpati Industries",
                        "url": "https://gajpatiindustries.com/privacy-policy",
                        "dateModified": lastUpdated,
                        "publisher": {
                            "@type": "Organization",
                            "name": "Gajpati Industries",
                            "url": "https://gajpatiindustries.com"
                        }
                    })}
                </script>
            </Helmet>

            <div className="min-h-screen bg-white">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-egyptian-blue to-violet-blue text-white py-12 sm:py-16">
                    <Container>
                        <div className="text-center">
                            <Shield className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-amber" />
                            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">
                                Cookies Policy
                            </h1>
                            <p className="text-base sm:text-lg max-w-2xl mx-auto">
                                Your privacy is important to us. This policy outlines how we collect, use, and protect your information.
                            </p>
                            <div className="mt-4 text-sm">
                                <span className="inline-flex items-center">
                                    <Clock className="h-4 w-4 mr-2" />
                                    Last Updated: {lastUpdated}
                                </span>
                            </div>
                        </div>
                    </Container>
                </section>

                {/* Main Content */}
                <section className="py-12 sm:py-16">
                    <Container>
                        <div className="max-w-4xl mx-auto">
                            {/* Introduction */}
                            <Card className="mb-8">
                                <CardContent className="p-6 sm:p-8">
                                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-egyptian-blue mb-4">
                                        Introduction
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        Gajpati Industries ("we," "our," or "us") is committed to protecting your privacy. This Cookies Policy explains how we collect, use, disclose, and safeguard your information when you visit our website gajpatiindustries.com or use our services.
                                    </p>
                                    <p className="text-gray-700 leading-relaxed">
                                        By using our website or services, you agree to the collection and use of information in accordance with this policy. If you do not agree with the terms of this Cookies Policy, please do not access the site.
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Information We Collect */}
                            <Card className="mb-8">
                                <CardContent className="p-6 sm:p-8">
                                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-egyptian-blue mb-6">
                                        Information We Collect
                                    </h2>

                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="font-semibold text-lg mb-3 flex items-center">
                                                <UserCheck className="h-5 w-5 mr-2 text-amber" />
                                                Personal Information
                                            </h3>
                                            <p className="text-gray-700 mb-3">
                                                We may collect personal information that you voluntarily provide to us when you:
                                            </p>
                                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                                <li>Fill out contact forms or request quotes</li>
                                                <li>Subscribe to our newsletter</li>
                                                <li>Create an account on our website</li>
                                                <li>Contact us via email, phone, or WhatsApp</li>
                                                <li>Participate in surveys or promotional activities</li>
                                            </ul>
                                            <p className="text-gray-700 mt-3">
                                                This information may include:
                                            </p>
                                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                                <li>Name and job title</li>
                                                <li>Company name and address</li>
                                                <li>Email address and phone number</li>
                                                <li>Project requirements and specifications</li>
                                                <li>Any other information you choose to provide</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-lg mb-3 flex items-center">
                                                <Eye className="h-5 w-5 mr-2 text-amber" />
                                                Automatically Collected Information
                                            </h3>
                                            <p className="text-gray-700 mb-3">
                                                When you visit our website, we may automatically collect certain information about your device, including:
                                            </p>
                                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                                <li>IP address and browser type</li>
                                                <li>Operating system and device information</li>
                                                <li>Pages visited and time spent on our site</li>
                                                <li>Referring website addresses</li>
                                                <li>Location data (country/region level)</li>
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* How We Use Your Information */}
                            <Card className="mb-8">
                                <CardContent className="p-6 sm:p-8">
                                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-egyptian-blue mb-6">
                                        How We Use Your Information
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        We use the information we collect for various purposes, including:
                                    </p>
                                    <ul className="space-y-3">
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span className="text-gray-700">To provide and maintain our services</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span className="text-gray-700">To respond to your inquiries and provide customer support</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span className="text-gray-700">To send you product information, quotes, and technical specifications</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span className="text-gray-700">To improve our website and user experience</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span className="text-gray-700">To send periodic emails about products, services, and company updates</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span className="text-gray-700">To comply with legal obligations and protect our rights</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Data Protection */}
                            <Card className="mb-8">
                                <CardContent className="p-6 sm:p-8">
                                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-egyptian-blue mb-6 flex items-center">
                                        <Lock className="h-6 w-6 mr-3 text-amber" />
                                        Data Protection & Security
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                                    </p>
                                    <ul className="space-y-2 text-gray-700">
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span>Secure SSL encryption for data transmission</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span>Regular security assessments and updates</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span>Limited access to personal information on a need-to-know basis</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span>Employee training on data protection practices</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Information Sharing */}
                            <Card className="mb-8">
                                <CardContent className="p-6 sm:p-8">
                                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-egyptian-blue mb-6">
                                        Information Sharing
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                                    </p>
                                    <ul className="space-y-3 text-gray-700">
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span>With service providers who assist us in operating our website and conducting our business</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span>When required by law or to respond to legal process</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span>To protect our rights, property, or safety, or that of our users or others</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span>With your consent or at your direction</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Your Rights */}
                            <Card className="mb-8">
                                <CardContent className="p-6 sm:p-8">
                                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-egyptian-blue mb-6">
                                        Your Rights
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        You have certain rights regarding your personal information:
                                    </p>
                                    <ul className="space-y-3 text-gray-700">
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span><strong>Access:</strong> Request a copy of the personal information we hold about you</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span><strong>Correction:</strong> Request correction of inaccurate or incomplete information</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span><strong>Deletion:</strong> Request deletion of your personal information, subject to legal requirements</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</span>
                                        </li>
                                    </ul>
                                    <p className="text-gray-700 mt-4">
                                        To exercise these rights, please contact us using the information provided below.
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Cookies */}
                            <Card className="mb-8">
                                <CardContent className="p-6 sm:p-8">
                                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-egyptian-blue mb-6">
                                        Cookies and Tracking Technologies
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        We use cookies and similar tracking technologies to enhance your experience on our website. Cookies are small data files stored on your device that help us:
                                    </p>
                                    <ul className="space-y-2 text-gray-700 mb-4">
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span>Remember your preferences and settings</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span>Analyze website traffic and usage patterns</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span>Improve website functionality and user experience</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span>Provide personalized content and recommendations</span>
                                        </li>
                                    </ul>
                                    <p className="text-gray-700">
                                        You can control cookies through your browser settings. However, disabling cookies may limit certain features of our website.
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Third-Party Links */}
                            <Card className="mb-8">
                                <CardContent className="p-6 sm:p-8">
                                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-egyptian-blue mb-6">
                                        Third-Party Links
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        Our website may contain links to third-party websites or services that are not operated by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
                                    </p>
                                    <p className="text-gray-700">
                                        We encourage you to review the privacy policies of any third-party sites you visit.
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Children's Privacy */}
                            <Card className="mb-8">
                                <CardContent className="p-6 sm:p-8">
                                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-egyptian-blue mb-6">
                                        Children's Privacy
                                    </h2>
                                    <p className="text-gray-700">
                                        Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information.
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Data Retention */}
                            <Card className="mb-8">
                                <CardContent className="p-6 sm:p-8">
                                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-egyptian-blue mb-6">
                                        Data Retention
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        We retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, including:
                                    </p>
                                    <ul className="space-y-2 text-gray-700">
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span>To provide our services and maintain business records</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span>To comply with legal, accounting, or reporting requirements</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span>To resolve disputes and enforce our agreements</span>
                                        </li>
                                    </ul>
                                    <p className="text-gray-700 mt-4">
                                        When your information is no longer required, we will securely delete or anonymize it.
                                    </p>
                                </CardContent>
                            </Card>

                            {/* International Data Transfers */}
                            <Card className="mb-8">
                                <CardContent className="p-6 sm:p-8">
                                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-egyptian-blue mb-6">
                                        International Data Transfers
                                    </h2>
                                    <p className="text-gray-700">
                                        Your information may be transferred to and maintained on servers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ. By using our services, you consent to such transfers.
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Changes to Cookies Policy */}
                            <Card className="mb-8">
                                <CardContent className="p-6 sm:p-8">
                                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-egyptian-blue mb-6">
                                        Changes to This Cookies Policy
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        We may update our Cookies Policy from time to time. We will notify you of any changes by:
                                    </p>
                                    <ul className="space-y-2 text-gray-700 mb-4">
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span>Posting the new Cookies Policy on this page</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span>Updating the "Last Updated" date at the top of this policy</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span>Sending an email notification for significant changes</span>
                                        </li>
                                    </ul>
                                    <p className="text-gray-700">
                                        We encourage you to review this Cookies Policy periodically for any changes.
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Contact Information */}
                            <Card className="mb-8 border-2 border-egyptian-blue">
                                <CardContent className="p-6 sm:p-8">
                                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-egyptian-blue mb-6">
                                        Contact Us
                                    </h2>
                                    <p className="text-gray-700 mb-6">
                                        If you have any questions, concerns, or requests regarding this Cookies Policy or our data practices, please contact us:
                                    </p>

                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <Mail className="h-5 w-5 text-amber mr-3 mt-1" />
                                            <div>
                                                <p className="font-semibold text-egyptian-blue">Email</p>
                                                <a href="mailto:info@gajpatiindustries.com" className="text-gray-700 hover:text-egyptian-blue">
                                                    info@gajpatiindustries.com
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <Phone className="h-5 w-5 text-amber mr-3 mt-1" />
                                            <div>
                                                <p className="font-semibold text-egyptian-blue">Phone</p>
                                                <a href="tel:+919528355555" className="text-gray-700 hover:text-egyptian-blue">
                                                    +91 952 835 5555
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <MapPin className="h-5 w-5 text-amber mr-3 mt-1" />
                                            <div>
                                                <p className="font-semibold text-egyptian-blue">Address</p>
                                                <p className="text-gray-700">
                                                    Gajpati Industries<br />
                                                    Manufacturing Plant<br />
                                                    Jammu & Kashmir, India
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <p className="text-sm text-gray-600">
                                            <strong>Data Protection Officer:</strong> For privacy-related matters, you may also contact our Data Protection Officer at <a href="mailto:info@gajpatiindustries.com" className="text-egyptian-blue hover:underline">info@gajpatiindustries.com</a>
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Consent */}
                            <Card className="bg-platinum/30">
                                <CardContent className="p-6 sm:p-8">
                                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-egyptian-blue mb-4">
                                        Your Consent
                                    </h2>
                                    <p className="text-gray-700">
                                        By using our website and services, you consent to our Cookies Policy and agree to its terms. If you do not agree to this policy, please do not use our services.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </Container>
                </section>
                {/* CTA Section */}
                <section className="py-12 sm:py-16 bg-gradient-hero text-white">
                    <Container>
                        <div className="text-center">
                            <h2 className="font-display font-bold text-2xl sm:text-3xl mb-4">
                                Have Questions About Our Privacy Practices?
                            </h2>
                            <p className="text-lg mb-8 max-w-2xl mx-auto">
                                We're committed to transparency and protecting your data. Contact us for any privacy-related concerns.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button variant="action" size="lg" asChild>
                                    <Link to="/contact">Contact Privacy Team</Link>
                                </Button>
                                <Button variant="trust" size="lg" onClick={() => window.print()}>
                                    Download Cookies Policy
                                </Button>
                            </div>
                        </div>
                    </Container>
                </section>

                {/* Floating WhatsApp CTA */}
                <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 bg-green-600">
                    <Button size="sm" className="shadow-xl bg-green-600 hover:bg-green-700" onClick={handleWhatsAppRedirect}>
                        <svg style={{ width: "20px", height: "20px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
                            <path
                                fill="white"
                                d="M 64 2 C 29.8 2 2 29.8 2 64 C 2 74.5 4.5992188 84.800391 9.6992188 93.900391 L 4.4003906 113.30078 C 3.5003906 116.40078 4.3992188 119.60039 6.6992188 121.90039 C 8.9992188 124.20039 12.200781 125.10078 15.300781 124.30078 L 35.5 119 C 44.3 123.6 54.099609 126 64.099609 126 C 98.299609 126 126.09961 98.2 126.09961 64 C 126.09961 47.4 119.7 31.899219 108 20.199219 C 96.2 8.4992187 80.6 2 64 2 z M 64 8 C 79 8 93.099609 13.800391 103.59961 24.400391 C 114.19961 35.000391 120.1 49.1 120 64 C 120 94.9 94.9 120 64 120 C 54.7 120 45.399219 117.59922 37.199219 113.19922 C 36.799219 112.99922 36.300781 112.80078 35.800781 112.80078 C 35.500781 112.80078 35.3 112.80039 35 112.90039 L 13.699219 118.5 C 12.199219 118.9 11.200781 118.09922 10.800781 117.69922 C 10.400781 117.29922 9.6 116.30078 10 114.80078 L 15.599609 94.199219 C 15.799609 93.399219 15.700781 92.600391 15.300781 91.900391 C 10.500781 83.500391 8 73.8 8 64 C 8 33.1 33.1 8 64 8 z M 64 17 C 38.1 17 17 38 17 64 C 17 72.3 19.200781 80.4 23.300781 87.5 C 24.900781 90.3 25.3 93.599219 24.5 96.699219 L 21.599609 107.19922 L 32.800781 104.30078 C 33.800781 104.00078 34.800781 103.90039 35.800781 103.90039 C 37.800781 103.90039 39.8 104.40039 41.5 105.40039 C 48.4 109.00039 56.1 111 64 111 C 89.9 111 111 89.9 111 64 C 111 51.4 106.09922 39.599219 97.199219 30.699219 C 88.399219 21.899219 76.6 17 64 17 z M 43.099609 36.699219 L 45.900391 36.699219 C 47.000391 36.699219 48.099219 36.799219 49.199219 39.199219 C 50.499219 42.099219 53.399219 49.399609 53.699219 50.099609 C 54.099219 50.799609 54.300781 51.699219 53.800781 52.699219 C 53.300781 53.699219 53.100781 54.299219 52.300781 55.199219 C 51.600781 56.099219 50.699609 57.100781 50.099609 57.800781 C 49.399609 58.500781 48.6 59.300781 49.5 60.800781 C 50.4 62.300781 53.299219 67.1 57.699219 71 C 63.299219 76 68.099609 77.600781 69.599609 78.300781 C 71.099609 79.000781 71.900781 78.900391 72.800781 77.900391 C 73.700781 76.900391 76.5 73.599609 77.5 72.099609 C 78.5 70.599609 79.500781 70.900391 80.800781 71.400391                 C 82.200781 71.900391 89.400391 75.499219 90.900391 76.199219 C 92.400391 76.899219 93.399219 77.300391 93.699219 77.900391 C 94.099219 78.700391 94.100391 81.599609 92.900391 85.099609 C 91.700391 88.499609 85.700391 91.899609 82.900391 92.099609 C 80.200391 92.299609 77.699219 93.300391 65.199219 88.400391 C 50.199219 82.500391 40.7 67.099609 40 66.099609 C 39.3 65.099609 34 58.100781 34 50.800781 C 34 43.500781 37.799219 40 39.199219 38.5 C 40.599219 37 42.099609 36.699219 43.099609 36.699219 z"
                            />
                        </svg>
                        Quick Quote
                    </Button>
                </div>
            </div>
        </>
    );
};

export default PrivacyPolicy;