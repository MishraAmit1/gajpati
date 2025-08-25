import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollText, Scale, AlertCircle, FileText, Gavel, Shield, Ban, Clock } from 'lucide-react';
import { handleWhatsAppRedirect } from '../helper/whatsapp';

const Container = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

const TermsOfService = () => {
    const lastUpdated = "January 15, 2025";
    const effectiveDate = "January 15, 2025";

    return (
        <>
            <Helmet>
                <title>Terms & Conditions | Gajpati Industries</title>
                <meta
                    name="description"
                    content="Read the terms and conditions for using Gajpati Industries' website and services. Understand your rights and obligations when purchasing our infrastructure materials."
                />
                <meta
                    name="keywords"
                    content="terms and conditions, terms of service, legal terms, Gajpati Industries"
                />
                <meta property="og:title" content="Terms & Conditions | Gajpati Industries" />
                <meta
                    property="og:description"
                    content="Read the terms and conditions for using Gajpati Industries' website and services."
                />
                <meta property="og:url" content="https://gajpatiindustries.com/terms-conditions" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content="Terms & Conditions | Gajpati Industries" />
                <meta
                    name="twitter:description"
                    content="Read the terms and conditions for using Gajpati Industries' website and services."
                />
                <link rel="canonical" href="https://gajpatiindustries.com/terms-conditions" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": "Terms & Conditions",
                        "description": "Terms and Conditions for Gajpati Industries",
                        "url": "https://gajpatiindustries.com/terms-conditions",
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
                            <ScrollText className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-amber" />
                            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">
                                Terms & Conditions
                            </h1>
                            <p className="text-base sm:text-lg max-w-2xl mx-auto">
                                Please read these terms carefully before using our website or purchasing our products.
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
                                        1. Agreement to Terms
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        These Terms and Conditions ("Terms") govern your use of the Gajpati Industries website (gajpatiindustries.com) and the purchase of our products and services. By accessing our website or purchasing our products, you agree to be bound by these Terms.
                                    </p>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        Gajpati Industries reserves the right to update these Terms at any time. Your continued use of our website or services after any modifications indicates your acceptance of the updated Terms.
                                    </p>
                                    <div className="bg-amber/10 border-l-4 border-amber p-4 mt-4">
                                        <p className="text-sm text-gray-700">
                                            <strong>Important:</strong> If you do not agree to these Terms, please do not use our website or purchase our products.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Definitions */}
                            <Card className="mb-8">
                                <CardContent className="p-6 sm:p-8">
                                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-egyptian-blue mb-6">
                                        2. Definitions
                                    </h2>
                                    <div className="space-y-3 text-gray-700">
                                        <p><strong>"Company," "we," "us," or "our"</strong> refers to Gajpati Industries.</p>
                                        <p><strong>"Customer," "you," or "your"</strong> refers to the individual or entity accessing our website or purchasing our products.</p>
                                        <p><strong>"Products"</strong> refers to all infrastructure materials, chemicals, and related items offered by Gajpati Industries.</p>
                                        <p><strong>"Services"</strong> refers to all services provided by Gajpati Industries, including but not limited to product consultation, technical support, and delivery.</p>
                                        <p><strong>"Website"</strong> refers to gajpatiindustries.com and all associated pages.</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Use of Website */}
                            <Card className="mb-8">
                                <CardContent className="p-6 sm:p-8">
                                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-egyptian-blue mb-6 flex items-center">
                                        <FileText className="h-6 w-6 mr-3 text-amber" />
                                        3. Use of Website
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-semibold text-lg mb-3">3.1 Acceptable Use</h3>
                                            <p className="text-gray-700 mb-3">You may use our website for lawful purposes only. You agree not to:</p>
                                            <ul className="space-y-2 text-gray-700 ml-4">
                                                <li className="flex items-start">
                                                    <span className="text-amber mr-2">•</span>
                                                    <span>Use the website in any way that violates applicable laws or regulations</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="text-amber mr-2">•</span>
                                                    <span>Attempt to gain unauthorized access to our systems or networks</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="text-amber mr-2">•</span>
                                                    <span>Interfere with or disrupt the website's operation</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="text-amber mr-2">•</span>
                                                    <span>Transmit viruses, malware, or other harmful code</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="text-amber mr-2">•</span>
                                                    <span>Collect or harvest user information without permission</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-lg mb-3">3.2 Account Responsibilities</h3>
                                            <p className="text-gray-700">
                                                If you create an account on our website, you are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Products and Services */}
                            <Card className="mb-8">
                                <CardContent className="p-6 sm:p-8">
                                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-egyptian-blue mb-6">
                                        4. Products and Services
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-semibold text-lg mb-3">4.1 Product Information</h3>
                                            <p className="text-gray-700">
                                                We strive to provide accurate product descriptions, specifications, and images. However, we do not warrant that product descriptions or other content on our website are accurate, complete, reliable, current, or error-free.
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-lg mb-3">4.2 Product Availability</h3>
                                            <p className="text-gray-700">
                                                All products are subject to availability. We reserve the right to limit quantities, discontinue products, or refuse any order at our discretion.
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-lg mb-3">4.3 Technical Specifications</h3>
                                            <p className="text-gray-700">
                                                While we ensure our products meet industry standards (IS/ASTM/BIS), customers are responsible for determining the suitability of products for their specific applications.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Shipping and Delivery */}
                            <Card className="mb-8">
                                <CardContent className="p-6 sm:p-8">
                                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-egyptian-blue mb-6">
                                        6. Shipping and Delivery
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-semibold text-lg mb-3">6.1 Delivery Terms</h3>
                                            <ul className="space-y-2 text-gray-700">
                                                <li className="flex items-start">
                                                    <span className="text-amber mr-2">•</span>
                                                    <span>Delivery times are estimates and not guaranteed</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="text-amber mr-2">•</span>
                                                    <span>Risk of loss transfers upon delivery to the carrier unless otherwise agreed</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="text-amber mr-2">•</span>
                                                    <span>Shipping charges are based on destination, weight, and volume</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-lg mb-3">6.2 Inspection Upon Delivery</h3>
                                            <p className="text-gray-700">
                                                Customers must inspect products immediately upon delivery and report any damages or discrepancies within 48 hours.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Returns and Refunds */}
                            <Card className="mb-8">
                                <CardContent className="p-6 sm:p-8">
                                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-egyptian-blue mb-6">
                                        7. Returns and Refunds
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-semibold text-lg mb-3">7.1 Return Policy</h3>
                                            <p className="text-gray-700 mb-3">
                                                Due to the nature of our products, returns are accepted only in the following circumstances:
                                            </p>
                                            <ul className="space-y-2 text-gray-700">
                                                <li className="flex items-start">
                                                    <span className="text-amber mr-2">•</span>
                                                    <span>Products delivered do not match the order specifications</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="text-amber mr-2">•</span>
                                                    <span>Products are damaged or defective upon delivery</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="text-amber mr-2">•</span>
                                                    <span>Quantity delivered differs from the order</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-lg mb-3">7.2 Return Process</h3>
                                            <ul className="space-y-2 text-gray-700">
                                                <li className="flex items-start">
                                                    <span className="text-amber mr-2">•</span>
                                                    <span>Returns must be initiated within 7 days of delivery</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="text-amber mr-2">•</span>
                                                    <span>Products must be in original, unopened condition</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="text-amber mr-2">•</span>
                                                    <span>Return shipping costs may apply depending on the reason for return</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Warranties and Disclaimers */}
                            <Card className="mb-8">
                                <CardContent className="p-6 sm:p-8">
                                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-egyptian-blue mb-6 flex items-center">
                                        <Shield className="h-6 w-6 mr-3 text-amber" />
                                        8. Warranties and Disclaimers
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-semibold text-lg mb-3">8.1 Product Warranty</h3>
                                            <p className="text-gray-700">
                                                We warrant that our products conform to applicable industry standards (IS/ASTM/BIS) at the time of delivery. This warranty is limited to replacement or refund of defective products.
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-lg mb-3">8.2 Disclaimer of Warranties</h3>
                                            <p className="text-gray-700 mb-3">
                                                EXCEPT AS EXPRESSLY PROVIDED, ALL PRODUCTS AND SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING:
                                            </p>
                                            <ul className="space-y-2 text-gray-700 uppercase text-sm">
                                                <li>• WARRANTIES OF MERCHANTABILITY</li>
                                                <li>• FITNESS FOR A PARTICULAR PURPOSE</li>
                                                <li>• NON-INFRINGEMENT</li>
                                            </ul>
                                        </div>

                                        <div className="bg-amber/10 border-l-4 border-amber p-4">
                                            <p className="text-sm text-gray-700">
                                                <strong>Note:</strong> Customers are responsible for ensuring products meet their specific project requirements and local regulations.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Limitation of Liability */}
                            <Card className="mb-8">
                                <CardContent className="p-6 sm:p-8">
                                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-egyptian-blue mb-6 flex items-center">
                                        <AlertCircle className="h-6 w-6 mr-3 text-amber" />
                                        9. Limitation of Liability
                                    </h2>
                                    <div className="space-y-4 text-gray-700">
                                        <p className="uppercase text-sm">
                                            TO THE MAXIMUM EXTENT PERMITTED BY LAW, GAJPATI INDUSTRIES SHALL NOT BE LIABLE FOR:
                                        </p>
                                        <ul className="space-y-2">
                                            <li className="flex items-start">
                                                <span className="text-amber mr-2">•</span>
                                                <span>Any indirect, incidental, special, consequential, or punitive damages</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-amber mr-2">•</span>
                                                <span>Loss of profits, revenue, data, or business opportunities</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-amber mr-2">•</span>
                                                <span>Damages arising from product misuse or improper application</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-amber mr-2">•</span>
                                                <span>Third-party claims arising from your use of our products</span>
                                            </li>
                                        </ul>
                                        <p className="mt-4">
                                            Our total liability shall not exceed the amount paid for the specific product giving rise to the claim.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Intellectual Property */}
                            <Card className="mb-8">
                                <CardContent className="p-6 sm:p-8">
                                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-egyptian-blue mb-6">
                                        10. Intellectual Property
                                    </h2>
                                    <div className="space-y-4">
                                        <p className="text-gray-700">
                                            All content on this website, including text, graphics, logos, images, product descriptions, and software, is the property of Gajpati Industries or its licensors and is protected by intellectual property laws.
                                        </p>
                                        <div>
                                            <h3 className="font-semibold text-lg mb-3">10.1 Limited License</h3>
                                            <p className="text-gray-700">
                                                You are granted a limited, non-exclusive, non-transferable license to access and use the website for personal or business purposes related to purchasing our products.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg mb-3">10.2 Restrictions</h3>
                                            <p className="text-gray-700">You may not:</p>
                                            <ul className="space-y-2 text-gray-700 mt-2">
                                                <li className="flex items-start">
                                                    <span className="text-amber mr-2">•</span>
                                                    <span>Reproduce, distribute, or create derivative works from our content</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="text-amber mr-2">•</span>
                                                    <span>Use our trademarks without written permission</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <span className="text-amber mr-2">•</span>
                                                    <span>Remove or alter any proprietary notices</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Indemnification */}
                            <Card className="mb-8">
                                <CardContent className="p-6 sm:p-8">
                                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-egyptian-blue mb-6">
                                        11. Indemnification
                                    </h2>
                                    <p className="text-gray-700">
                                        You agree to indemnify, defend, and hold harmless Gajpati Industries, its officers, directors, employees, agents, and affiliates from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
                                    </p>
                                    <ul className="space-y-2 text-gray-700 mt-4">
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span>Your use or misuse of our products or services</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span>Your violation of these Terms</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span>Your violation of any third-party rights</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span>Any content you submit to our website</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Governing Law */}
                            <Card className="mb-8">
                                <CardContent className="p-6 sm:p-8">
                                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-egyptian-blue mb-6 flex items-center">
                                        <Gavel className="h-6 w-6 mr-3 text-amber" />
                                        12. Governing Law and Dispute Resolution
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-semibold text-lg mb-3">12.1 Governing Law</h3>
                                            <p className="text-gray-700">
                                                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-lg mb-3">12.2 Jurisdiction</h3>
                                            <p className="text-gray-700">
                                                Any disputes arising from these Terms or your use of our products/services shall be subject to the exclusive jurisdiction of the courts in Jammu & Kashmir, India.
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-lg mb-3">12.3 Arbitration</h3>
                                            <p className="text-gray-700">
                                                At our discretion, disputes may be resolved through binding arbitration in accordance with the Arbitration and Conciliation Act, 1996.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Termination */}
                            <Card className="mb-8">
                                <CardContent className="p-6 sm:p-8">
                                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-egyptian-blue mb-6 flex items-center">
                                        <Ban className="h-6 w-6 mr-3 text-amber" />
                                        13. Termination
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        We reserve the right to terminate or suspend your access to our website and services at any time, without notice, for any reason, including:
                                    </p>
                                    <ul className="space-y-2 text-gray-700">
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span>Violation of these Terms</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span>Fraudulent or illegal activities</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span>Non-payment of outstanding invoices</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span>Actions harmful to our business interests</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* General Provisions */}
                            <Card className="mb-8">
                                <CardContent className="p-6 sm:p-8">
                                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-egyptian-blue mb-6">
                                        14. General Provisions
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-semibold text-lg mb-3">14.1 Entire Agreement</h3>
                                            <p className="text-gray-700">
                                                These Terms constitute the entire agreement between you and Gajpati Industries regarding the use of our website and services.
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-lg mb-3">14.2 Severability</h3>
                                            <p className="text-gray-700">
                                                If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-lg mb-3">14.3 Waiver</h3>
                                            <p className="text-gray-700">
                                                Our failure to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision.
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-lg mb-3">14.4 Force Majeure</h3>
                                            <p className="text-gray-700">
                                                We shall not be liable for any delay or failure to perform due to causes beyond our reasonable control, including natural disasters, war, terrorism, labor disputes, or government actions.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Contact Information */}
                            <Card className="mb-8 border-2 border-egyptian-blue">
                                <CardContent className="p-6 sm:p-8">
                                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-egyptian-blue mb-6">
                                        15. Contact Information
                                    </h2>
                                    <p className="text-gray-700 mb-6">
                                        For questions about these Terms & Conditions, please contact us:
                                    </p>

                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="font-semibold text-lg mb-4">Gajpati Industries</h3>
                                        <div className="space-y-2 text-gray-700">
                                            <p><strong>Email:</strong> <a href="mailto:info@gajpatiindustries.com" className="text-egyptian-blue hover:underline">info@gajpatiindustries.com</a></p>
                                            <p><strong>Phone:</strong> <a href="tel:+919528355555" className="text-egyptian-blue hover:underline">+91 952 835 5555</a></p>
                                            <p><strong>Address:</strong> Manufacturing Plant, Jammu & Kashmir, India</p>
                                            <p><strong>Business Hours:</strong> Monday - Saturday, 9:00 AM - 6:00 PM IST</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Acknowledgment */}
                            <Card className="bg-platinum/30">
                                <CardContent className="p-6 sm:p-8">
                                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-egyptian-blue mb-4">
                                        16. Acknowledgment
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        By using our website or purchasing our products, you acknowledge that:
                                    </p>
                                    <ul className="space-y-2 text-gray-700 mb-4">
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span>You have read and understood these Terms & Conditions</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span>You agree to be bound by these Terms</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span>You have the authority to enter into this agreement</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-amber mr-2">•</span>
                                            <span>You will comply with all applicable laws and regulations</span>
                                        </li>
                                    </ul>
                                    <div className="bg-egyptian-blue/10 border border-egyptian-blue p-4 rounded">
                                        <p className="text-sm text-gray-700">
                                            <strong>Effective Date:</strong> These Terms & Conditions are effective as of {effectiveDate} and will remain in effect until modified or terminated.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </Container>
                </section>

                {/* <section className="py-12 bg-white">
                    <Container>
                        <div className="max-w-4xl mx-auto">
                            <h2 className="font-display font-bold text-2xl sm:text-3xl text-egyptian-blue mb-8 text-center">
                                Need Help Understanding These Terms?
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="shadow-card">
                                    <CardContent className="p-6 text-center">
                                        <FileText className="h-12 w-12 text-amber mx-auto mb-4" />
                                        <h3 className="font-semibold text-lg mb-3">Download Terms</h3>
                                        <p className="text-gray-600 mb-4 text-sm">
                                            Download a PDF copy of our Terms & Conditions for your records.
                                        </p>
                                        <Button variant="outline" onClick={() => window.print()}>
                                            Download PDF
                                        </Button>
                                    </CardContent>
                                </Card>

                                <Card className="shadow-card">
                                    <CardContent className="p-6 text-center">
                                        <Scale className="h-12 w-12 text-amber mx-auto mb-4" />
                                        <h3 className="font-semibold text-lg mb-3">Legal Consultation</h3>
                                        <p className="text-gray-600 mb-4 text-sm">
                                            Have questions about our terms? Contact our legal team for clarification.
                                        </p>
                                        <Button variant="outline" asChild>
                                            <Link to="/contact">Contact Legal Team</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </Container>
                </section> */}

                {/* CTA Section */}
                <section className="py-12 sm:py-16 bg-gradient-hero text-white">
                    <Container>
                        <div className="text-center">
                            <h2 className="font-display font-bold text-2xl sm:text-3xl mb-4">
                                Ready to Start Your Project?
                            </h2>
                            <p className="text-lg mb-8 max-w-2xl mx-auto">
                                Now that you understand our terms, let's discuss how we can support your infrastructure needs.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button variant="action" size="lg" asChild>
                                    <Link to="/products">Browse Products</Link>
                                </Button>
                                <Button variant="trust" size="lg" asChild>
                                    <Link to="/contact">Request Quote</Link>
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

export default TermsOfService;