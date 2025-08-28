import { Helmet } from 'react-helmet-async';
import LazyLoad from 'react-lazyload';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRef, useState } from 'react';
import { PopupButton } from 'react-calendly';
import auotmatedImage from "../assets/automated.jpg"
import facility1 from "../assets/facility1.jpg"
import facility2 from "../assets/facility2.jpg"

import {
    Factory,
    Shield,
    Award,
    CheckCircle,
    Microscope,
    Truck,
    Users,
    Cog,
    FlaskConical,
    Package,
    MapPin,
    Zap,
    Gauge,
    Thermometer,
    Layers,
    Beaker,
    Leaf,
    TestTube
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { handleWhatsAppRedirect } from '../helper/whatsapp';
import ourFacilityImage from '../assets/about.jpg';

const Container = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

const FacilityFeature = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
    <Card className="shadow-card hover:shadow-xl transition-all duration-300 group">
        <CardContent className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-egyptian-blue/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-egyptian-blue/20 transition-colors">
                <Icon className="h-8 w-8 text-egyptian-blue" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
        </CardContent>
    </Card>
);

const qaHighlights = [
    { Icon: Gauge, label: 'Viscosity, Sieve, Softening Point & Residue' },
    { Icon: Thermometer, label: 'Coating adhesion checks (Gabions)' },
    { Icon: Layers, label: 'Admixture performance tests' },
    { Icon: Beaker, label: 'Batch-wise COA issuance with full traceability' },
];
const stats = [
    "1 Lkh+ Sq.ft Area",
    "1000+ MT/Month Capacity",
    "ISO / BIS Certified",
    "100+ Skilled Workforce"
];

// Auto Scroll Gallery Component with Drag Functionality and Hover Effects
const AutoScrollGallery = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const images = [
        { src: auotmatedImage, alt: 'Manufacturing Unit 1', caption: 'Automated Production Line' },
        { src: facility2, alt: 'Quality Control Lab', caption: 'Advanced Testing Equipment' },
        { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5Nae8ydDvYVhs2TdA-QboBN-P6zketluOWQ&s', alt: 'Storage Facility', caption: 'Climate-Controlled Warehouse' },
        { src: 'https://plus.unsplash.com/premium_photo-1661962318201-c7faa790617b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8SW5ub3ZhdGlvbiUyMENlbnRlcnxlbnwwfHwwfHx8MA%3D%3D', alt: 'R&D Laboratory', caption: 'Innovation Center' },
        { src: 'https://images.unsplash.com/photo-1582190506824-ef3bd95a956e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG1hbnVmYWN0dXJlfGVufDB8fDB8fHww', alt: 'Packaging Unit', caption: 'Automated Packaging Line' },
        { src: 'https://cdn.pixabay.com/photo/2013/09/27/12/18/company-186980_1280.jpg', alt: 'Solar Panels', caption: 'Renewable Energy Systems' },
        { src: facility1, alt: 'Loading Bay', caption: '' },
        { src: 'https://media.istockphoto.com/id/1213564048/photo/equipment-for-production-of-asphalt-cement-and-concrete-concrete-plant.webp?a=1&b=1&s=612x612&w=0&k=20&c=MRebTAUnu-I4FUKRAhuyAIXKmD-QIEWHQA9-MQDJ26E=', alt: 'Control Room', caption: 'Central Monitoring System' },
    ];

    // Duplicate images for seamless loop
    const duplicatedImages = [...images, ...images];

    // Handle mouse down
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setIsPaused(true);
        setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
        setScrollLeft(scrollRef.current?.scrollLeft || 0);
        if (scrollRef.current) {
            scrollRef.current.style.cursor = 'grabbing';
        }
    };

    // Handle touch start
    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        setIsPaused(true);
        setStartX(e.touches[0].pageX - (scrollRef.current?.offsetLeft || 0));
        setScrollLeft(scrollRef.current?.scrollLeft || 0);
    };

    // Handle mouse leave
    const handleMouseLeave = () => {
        setIsDragging(false);
        if (scrollRef.current) {
            scrollRef.current.style.cursor = 'grab';
        }
    };

    // Handle mouse up
    const handleMouseUp = () => {
        setIsDragging(false);
        if (scrollRef.current) {
            scrollRef.current.style.cursor = 'grab';
        }
        // Resume auto-scroll after a delay
        setTimeout(() => setIsPaused(false), 3000);
    };

    // Handle touch end
    const handleTouchEnd = () => {
        setIsDragging(false);
        // Resume auto-scroll after a delay
        setTimeout(() => setIsPaused(false), 3000);
    };

    // Handle mouse move
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
        const walk = (x - startX) * 2; // Scroll speed multiplier
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    // Handle touch move
    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        const x = e.touches[0].pageX - (scrollRef.current?.offsetLeft || 0);
        const walk = (x - startX) * 2; // Scroll speed multiplier
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    // Handle hover
    const handleMouseEnter = () => {
        setIsPaused(true);
    };

    const handleMouseLeaveContainer = () => {
        if (!isDragging) {
            setIsPaused(false);
        }
    };

    return (
        <section className="py-12 sm:py-16 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
            <Container>
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-h1 text-egyptian-blue mb-3 sm:mb-4">
                        Facility Gallery
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base max-w-xl sm:max-w-2xl mx-auto">
                        Take a visual tour of our state-of-the-art manufacturing facility
                    </p>
                </div>
            </Container>

            <div
                className="relative cursor-grab select-none overflow-hidden"
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseOut={handleMouseLeaveContainer}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove}
            >
                <div className={`flex gap-6 ${!isPaused ? 'animate-scroll' : ''}`}>
                    {duplicatedImages.map((image, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-[300px] sm:w-[400px] group"
                        >
                            <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105">
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    className="w-full h-[225px] sm:h-[300px] object-cover select-none"
                                    draggable={false}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                        <p className="text-sm font-semibold">{image.caption}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                
                .animate-scroll {
                    animation: scroll 20s linear infinite;
                }
                
                .cursor-grab {
                    cursor: grab;
                }
                
                .cursor-grab:active {
                    cursor: grabbing;
                }
                
                /* Hide scrollbar for all browsers */
                .overflow-hidden {
                    overflow: hidden !important;
                }
                
                /* Additional scrollbar hiding for specific browsers */
                .relative::-webkit-scrollbar {
                    display: none !important;
                }
                
                .relative {
                    -ms-overflow-style: none !important;  /* IE and Edge */
                    scrollbar-width: none !important;  /* Firefox */
                }
                
                /* Prevent text selection while dragging */
                .select-none {
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }
            `}</style>
        </section>
    );
};

const OurFacility = () => {
    return (
        <>
            <Helmet>
                <title>Our Facility | Gajpati Industries Manufacturing Excellence</title>
                <meta
                    name="description"
                    content="Explore Gajpati Industries' state-of-the-art manufacturing facility in Jammu & Kashmir, equipped with advanced technology and quality control systems."
                />
                <meta
                    name="keywords"
                    content="Gajpati Industries facility, manufacturing plant, Jammu Kashmir, infrastructure chemicals production"
                />
                <meta
                    property="og:title"
                    content="Our Facility | Gajpati Industries Manufacturing Excellence"
                />
                <meta
                    property="og:description"
                    content="Explore Gajpati Industries' state-of-the-art manufacturing facility in Jammu & Kashmir, equipped with advanced technology and quality control systems."
                />
                <meta property="og:image" content="https://gajpatiindustries.com/images/facility-og.jpg" />
                <meta property="og:url" content="https://gajpatiindustries.com/facility" />
                <meta name="twitter:card" content="summary_large_image" />
                <link rel="canonical" href="https://gajpatiindustries.com/facility" />
            </Helmet>

            <div className="min-h-screen">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-egyptian-blue to-violet-blue text-white py-12 sm:py-16 lg:py-16">
                    <Container>
                        <div className="text-center">
                            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-hero mb-3 sm:mb-4">
                                Our Manufacturing Excellence
                            </h1>
                            <p className="text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl sm:max-w-3xl mx-auto">
                                State-of-the-art ENH Plant in Jammu & Kashmir, delivering advanced bitumen solutions and infrastructure materials across India
                            </p>
                        </div>
                    </Container>
                </section>



                <section className="py-8 bg-white overflow-hidden">
                    <div className="flex whitespace-nowrap gap-12 animate-marquee font-bold text-gray-700 text-sm sm:text-base">
                        {/* Duplicate list items to avoid gap */}
                        {[...stats, ...stats].map((text, i) => (
                            <span key={i}>{text}</span>
                        ))}
                    </div>

                    <style>{`
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-marquee {
      animation: marquee 15s linear infinite;
    }
    .animate-marquee:hover {
      animation-play-state: paused;
    }
  `}</style>
                </section>

                {/* Facility Overview */}
                <section className="py-12 sm:py-16 lg:py-20 bg-platinum/30">
                    <Container>
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 items-center">
                            <div>
                                <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-h1 text-egyptian-blue mb-4 sm:mb-6">
                                    Manufacturing Facility Overview
                                </h2>
                                <div className="space-y-4 text-gray-700 text-sm sm:text-base leading-relaxed">
                                    <p>
                                        Located in the industrial hub of Jammu & Kashmir, our plant is among India’s most advanced production facilities for infrastructure materials. Spread across 50,000 square feet, it integrates ENH (Energy-Efficient, Noise-Controlled, High-Performance) production technology for Bitumen Emulsions and Modified Bitumen, ensuring superior product performance and environmental responsibility.
                                    </p>
                                    <p>
                                        Our facility is designed for efficiency, precision, and sustainability:
                                    </p>
                                    <ul className="space-y-3">
                                        <li className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                                            <span>ENH , Denmark Supplied Fully Automatic Plants for both Emulsions & Modified Bitumen</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                                            <span>Advanced blending and emulsification units for consistent product quality</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                                            <span>Technology equipped raw material sourcing and processing to improve efficiency, sustainability, and performance.e</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                                            <span>Dedicated R&D laboratory for formulation development and testing</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                                            <span>Fully automated quality control systems</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                                            <span>Eco-friendly waste management and energy recovery</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="relative">
                                <LazyLoad height={400} offset={100}>
                                    <div className="rounded-lg overflow-hidden shadow-xl">
                                        <img
                                            src={ourFacilityImage}
                                            alt="Gajpati Industries Manufacturing Facility"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </LazyLoad>
                                <Badge className="absolute top-4 right-4 bg-egyptian-blue text-white">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    Jammu & Kashmir
                                </Badge>
                            </div>
                        </div>
                    </Container>
                </section>

                {/* Production Capabilities */}
                <section className="py-12 sm:py-16 bg-white">
                    <Container>
                        <div className="text-center mb-8 sm:mb-12">
                            <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-h1 text-egyptian-blue mb-3 sm:mb-4">
                                Production Capabilities
                            </h2>
                            <p className="text-gray-600 text-sm sm:text-base max-w-xl sm:max-w-2xl mx-auto">
                                Our facility is equipped to handle diverse production requirements with precision and scale
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <FacilityFeature
                                icon={Cog}
                                title="Bitumen Products"
                                description="ENH plants for producing all grades of Bitumen Emulsions (RS, MS, SS, PMBE, Micro-Surfacing)"
                            />
                            <FacilityFeature
                                icon={Shield}
                                title="Gabion & Rockfall Systems"
                                description="Automated wire mesh production lines with zinc/galfan coating facilities for durability in extreme environments"
                            />
                            <FacilityFeature
                                icon={FlaskConical}
                                title="Construction Chemicals"
                                description="Precision mixing units for admixtures, sealants, waterproofing, and curing compounds"
                            />
                            <FacilityFeature
                                icon={Microscope}
                                title="Quality & Compliance"
                                description="We follow ISO / BIS aligned SOPs to ensure every batch meets national and international standards."
                            />
                            <FacilityFeature
                                icon={TestTube}
                                title="Testing Capabilities"
                                description="NABL Pan India Accredited Labs"
                            />
                            <FacilityFeature
                                icon={Zap}
                                title="Energy Efficient"
                                description="Solar-powered operations and energy recovery systems"
                            />
                        </div>
                    </Container>
                </section>

                {/* Auto Scroll Gallery - NEW SECTION */}
                <AutoScrollGallery />

                {/* Quality & Compliance */}
                <LazyLoad height={200} offset={100}>
                    <section className="py-10 sm:py-16 bg-platinum/30">
                        <Container>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                                <div>
                                    <h2 className="font-display font-bold text-2xl sm:text-4xl text-egyptian-blue mb-4 sm:mb-6">
                                        Quality & Compliance
                                    </h2>
                                    <p className="text-gray-700 mb-3">
                                        We follow ISO / BIS aligned SOPs to ensure every batch meets national and international standards.
                                    </p>
                                    <p className="text-gray-700 mb-6">Testing Capabilities:</p>
                                    <div className="space-y-3">
                                        {qaHighlights.map(({ Icon, label }, i) => (
                                            <div key={i} className="flex items-center">
                                                <Icon className="h-5 w-5 text-green-600 mr-2" />
                                                <span className="text-sm">{label}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-3 mt-6">
                                        <Button variant="action" asChild>
                                            <Link to="/contact">Request COA Sample</Link>
                                        </Button>
                                        <Button variant="outline" asChild>
                                            <Link to="/about">Know Our Process</Link>
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Card className="shadow-card p-5 text-center">
                                        <Award className="h-10 w-10 text-amber mx-auto mb-3" />
                                        <div className="font-semibold text-egyptian-blue">ISO-aligned System</div>
                                        <div className="text-gray-600 text-sm">Standardized SOPs & audits</div>
                                    </Card>
                                    <Card className="shadow-card p-5 text-center">
                                        <MapPin className="h-10 w-10 text-egyptian-blue mx-auto mb-3" />
                                        <div className="font-semibold text-egyptian-blue">Strategic Location</div>
                                        <div className="text-gray-600 text-sm">Efficient Pan-India supply</div>
                                    </Card>
                                    <Card className="shadow-card p-5 text-center">
                                        <Leaf className="h-10 w-10 text-green-600 mx-auto mb-3" />
                                        <div className="font-semibold text-egyptian-blue">EHS Focus</div>
                                        <div className="text-gray-600 text-sm">Safety, environment & compliance</div>
                                    </Card>
                                    <Card className="shadow-card p-5 text-center">
                                        <Package className="h-10 w-10 text-violet-600 mx-auto mb-3" />
                                        <div className="font-semibold text-egyptian-blue">Packing Options</div>
                                        <div className="text-gray-600 text-sm">20/50/200 kg & bulk tanker</div>
                                    </Card>
                                </div>
                            </div>
                        </Container>
                    </section>
                </LazyLoad>

                {/* Sustainability Initiatives */}
                <section className="py-12 sm:py-16 bg-white">
                    <Container>
                        <div className="text-center mb-8 sm:mb-12">
                            <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-h1 text-egyptian-blue mb-3 sm:mb-4">
                                Sustainability & Environment
                            </h2>
                            <p className="text-gray-600 text-sm sm:text-base max-w-xl sm:max-w-2xl mx-auto">
                                We are committed to a low-carbon, high-efficiency manufacturing approach.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {[
                                {
                                    title: 'Zero Liquid Discharge',
                                    desc: '100% water treatment and reuse',
                                },
                                {
                                    title: 'Solar Power Integration',
                                    desc: '30% of energy needs from renewable sources',
                                },
                                {
                                    title: 'Waste Minimization',
                                    desc: '95% raw material utilization',
                                },
                                {
                                    title: 'Low-Emission Processes',
                                    desc: 'Eco-friendly materials and manufacturing methods Technology & Innovation',
                                },
                            ].map((item, index) => (
                                <Card key={index} className="shadow-card">
                                    <CardContent className="p-4 sm:p-6 text-center">
                                        <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-egyptian-blue">{item.title}</h3>
                                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </Container>
                </section>

                {/* Technology & Innovation */}
                <LazyLoad height={200} offset={100}>
                    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-trust">
                        <Container>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                                <div>
                                    <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-h1 text-egyptian-blue mb-4 sm:mb-6">
                                        Technology & Innovation
                                    </h2>
                                    <p className="text-gray-700 mb-6">
                                        Our facility combines PLC-based process automation with IoT-enabled monitoring to deliver unmatched consistency and efficiency.
                                    </p>
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <div className="w-12 h-12 rounded-full bg-egyptian-blue/10 flex items-center justify-center mr-4 flex-shrink-0">
                                                <Cog className="h-6 w-6 text-egyptian-blue" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1">Automated Control Systems</h3>
                                                <p className="text-sm text-gray-600">PLC-based automation for precise process control</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="w-12 h-12 rounded-full bg-egyptian-blue/10 flex items-center justify-center mr-4 flex-shrink-0">
                                                <Microscope className="h-6 w-6 text-egyptian-blue" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1">R&D Laboratory</h3>
                                                <p className="text-sm text-gray-600">Dedicated team for product development and customization</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="w-12 h-12 rounded-full bg-egyptian-blue/10 flex items-center justify-center mr-4 flex-shrink-0">
                                                <Zap className="h-6 w-6 text-egyptian-blue" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1">Smart Manufacturing</h3>
                                                <p className="text-sm text-gray-600">IoT-enabled equipment for real-time monitoring</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Card className="shadow-card text-center p-4 sm:p-6">
                                        <div className="text-3xl sm:text-4xl font-bold text-egyptian-blue">24/7</div>
                                        <div className="text-gray-600 text-sm sm:text-base mt-2">Production Monitoring</div>
                                    </Card>
                                    <Card className="shadow-card text-center p-4 sm:p-6">
                                        <div className="text-3xl sm:text-4xl font-bold text-egyptian-blue">100%</div>
                                        <div className="text-gray-600 text-sm sm:text-base mt-2">in-process quality tracking</div>
                                    </Card>
                                    <Card className="shadow-card text-center p-4 sm:p-6">
                                        <div className="text-3xl sm:text-4xl font-bold text-egyptian-blue">5+</div>
                                        <div className="text-gray-600 text-sm sm:text-base mt-2">Patents Filed</div>
                                    </Card>
                                    <Card className="shadow-card text-center p-4 sm:p-6">
                                        <div className="text-3xl sm:text-4xl font-bold text-egyptian-blue">15+</div>
                                        <div className="text-gray-600 text-sm sm:text-base mt-2">R&D projects in progress</div>
                                    </Card>
                                </div>
                            </div>
                        </Container>
                    </section>
                </LazyLoad>

                {/* Visit Our Facility CTA */}
                <section className="py-12 sm:py-16 bg-gradient-hero text-white">
                    <Container>
                        <div className="text-center">
                            <h2 className="font-display font-bold text-2xl sm:text-h2 mb-4 sm:mb-6">
                                Experience Our Manufacturing Excellence
                            </h2>
                            <p className="text-base sm:text-xl mb-6 sm:mb-8 leading-relaxed max-w-xl sm:max-w-2xl mx-auto">
                                Schedule a facility visit to see how Gajpati Industries combines technology, quality, and sustainability to create India’s most trusted infrastructure solutions.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <PopupButton
                                    url="https://calendly.com/amsmisho/30min"
                                    rootElement={document.getElementById('root')!}
                                    text="Schedule Facility Visit"
                                    className="w-auto min-w-[160px] px-3 py-2 sm:min-w-[200px] sm:px-4 sm:py-2 bg-yellow-500 text-black hover:bg-yellow-600 rounded-md"
                                />
                                <Button variant="trust" size="lg" className="w-auto min-w-[160px] px-3 py-2 sm:min-w-[200px] sm:px-4 sm:py-2">
                                    Download Facility Brochure
                                </Button>
                            </div>
                        </div>
                    </Container>
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
        </>
    );
};

export default OurFacility;