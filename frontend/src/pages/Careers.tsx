import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
    Briefcase, MapPin, Clock, Users, TrendingUp, Heart, Award, Building2,
    GraduationCap, Mail, ChevronRight, CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Container = ({ children, className = '' }) => (
    <div className={`max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 ${className}`}>{children}</div>
);

const Careers = () => {
    const [selectedDepartment, setSelectedDepartment] = useState('all');

    // Job openings data
    const jobOpenings = [
        {
            id: 1,
            title: "Production Manager",
            department: "Manufacturing",
            location: "Jammu & Kashmir",
            type: "Full-time",
            experience: "5-8 years",
            salary: "₹8-12 LPA",
            openings: 2,
            postedDate: "15 Jan 2025",
            description: "Lead our bitumen production facility with focus on quality control and operational efficiency.",
            detailedDescription: "We are seeking an experienced Production Manager to oversee our state-of-the-art bitumen manufacturing facility in Jammu & Kashmir. The ideal candidate will be responsible for managing daily production operations, ensuring quality standards, and driving continuous improvement initiatives.",
            requirements: [
                "B.Tech/M.Tech in Chemical Engineering",
                "Experience in bitumen/chemical manufacturing",
                "Strong leadership and safety management skills",
                "Knowledge of ISO / BIS and safety standards",
                "Excellent problem-solving abilities"
            ],
            responsibilities: [
                "Oversee daily production operations and ensure targets are met",
                "Implement and maintain quality control procedures",
                "Lead a team of 20+ production staff and technicians",
                "Coordinate with R&D for new product development",
                "Ensure compliance with safety and environmental regulations",
                "Optimize production processes for efficiency and cost-effectiveness",
                "Prepare production reports and analyze performance metrics"
            ],
            preferredSkills: [
                "Six Sigma certification",
                "Experience with SAP or similar ERP systems",
                "Knowledge of polymer modified bitumen",
                "Previous experience in infrastructure chemicals industry"
            ]
        },
        {
            id: 2,
            title: "Quality Control Chemist",
            department: "Quality Assurance",
            location: "Jammu & Kashmir",
            type: "Full-time",
            experience: "2-4 years",
            salary: "₹4-6 LPA",
            openings: 3,
            postedDate: "18 Jan 2025",
            description: "Ensure product quality standards for our construction chemicals and bitumen products.",
            detailedDescription: "Join our quality assurance team to maintain the highest standards of product quality. You will be responsible for conducting various tests on bitumen and construction chemicals, ensuring compliance with IS/ASTM standards, and contributing to our commitment to excellence.",
            requirements: [
                "B.Sc/M.Sc in Chemistry",
                "Experience with IS/ASTM testing standards",
                "Knowledge of construction chemical testing",
                "Attention to detail and analytical skills",
                "Good documentation practices"
            ],
            responsibilities: [
                "Conduct routine quality tests on raw materials and finished products",
                "Maintain laboratory equipment and ensure calibration",
                "Document test results and prepare quality reports",
                "Investigate quality issues and recommend corrective actions",
                "Collaborate with production team for quality improvements",
                "Ensure compliance with IS/ASTM standards",
                "Train junior staff on testing procedures"
            ],
            preferredSkills: [
                "Experience with spectroscopy and chromatography",
                "Knowledge of bitumen testing methods",
                "Familiarity with NABL accreditation",
                "Statistical analysis skills"
            ]
        },
        {
            id: 3,
            title: "Sales Engineer",
            department: "Sales",
            location: "Delhi NCR",
            type: "Full-time",
            experience: "3-5 years",
            salary: "₹6-9 LPA + Incentives",
            openings: 4,
            postedDate: "20 Jan 2025",
            description: "Drive B2B sales for infrastructure chemicals across North India region.",
            detailedDescription: "We're looking for a dynamic Sales Engineer to expand our market presence in North India. You'll be responsible for developing new business opportunities, managing key accounts, and providing technical support to clients in the infrastructure sector.",
            requirements: [
                "B.Tech in Civil/Chemical Engineering",
                "Experience in construction chemical sales",
                "Strong client relationship skills",
                "Willingness to travel extensively",
                "Excellent communication and presentation skills"
            ],
            responsibilities: [
                "Identify and develop new business opportunities",
                "Manage existing client relationships and key accounts",
                "Provide technical support and product demonstrations",
                "Achieve monthly and quarterly sales targets",
                "Prepare technical proposals and quotations",
                "Conduct market research and competitor analysis",
                "Coordinate with technical team for customer solutions"
            ],
            preferredSkills: [
                "Knowledge of road construction industry",
                "Experience with government tenders",
                "CRM software proficiency",
                "Technical writing skills"
            ]
        },
        {
            id: 4,
            title: "R&D Executive",
            department: "Research",
            location: "Jammu & Kashmir",
            type: "Full-time",
            experience: "2-5 years",
            salary: "₹5-8 LPA",
            openings: 2,
            postedDate: "22 Jan 2025",
            description: "Develop innovative formulations for construction chemicals and bitumen products.",
            detailedDescription: "Be part of our innovative R&D team working on next-generation construction chemicals. You'll contribute to developing new formulations, improving existing products, and supporting our vision of sustainable infrastructure solutions.",
            requirements: [
                "M.Sc/M.Tech in Chemistry/Chemical Engineering",
                "Experience in polymer/bitumen research",
                "Patent filing experience preferred",
                "Strong analytical and research skills",
                "Knowledge of formulation chemistry"
            ],
            responsibilities: [
                "Develop new product formulations",
                "Conduct laboratory trials and pilot studies",
                "Analyze competitive products and market trends",
                "Collaborate with production for scale-up activities",
                "Document research findings and prepare reports",
                "Support patent filing activities",
                "Work on sustainable and eco-friendly solutions"
            ],
            preferredSkills: [
                "Experience with polymer chemistry",
                "Knowledge of nanotechnology applications",
                "Statistical design of experiments",
                "Project management skills"
            ]
        },
        {
            id: 5,
            title: "Plant Maintenance Engineer",
            department: "Operations",
            location: "Jammu & Kashmir",
            type: "Full-time",
            experience: "4-6 years",
            salary: "₹6-9 LPA",
            openings: 1,
            postedDate: "25 Jan 2025",
            description: "Maintain and optimize manufacturing equipment for continuous production.",
            detailedDescription: "We need a skilled Maintenance Engineer to ensure smooth operation of our manufacturing facility. You'll be responsible for preventive maintenance, troubleshooting, and optimization of plant equipment to minimize downtime and maximize efficiency.",
            requirements: [
                "B.Tech in Mechanical Engineering",
                "Experience in chemical plant maintenance",
                "Knowledge of preventive maintenance systems",
                "Understanding of hydraulic and pneumatic systems",
                "Safety-first mindset"
            ],
            responsibilities: [
                "Plan and execute preventive maintenance schedules",
                "Troubleshoot equipment failures and minimize downtime",
                "Manage spare parts inventory",
                "Coordinate with external vendors for repairs",
                "Implement equipment upgrades and modifications",
                "Maintain maintenance records and documentation",
                "Train operators on equipment handling"
            ],
            preferredSkills: [
                "PLC programming knowledge",
                "Experience with CMMS software",
                "Welding and fabrication skills",
                "Energy efficiency optimization"
            ]
        }
    ];

    const departments = ['all', 'Manufacturing', 'Quality Assurance', 'Sales', 'Research', 'Operations'];

    const benefits = [
        {
            icon: Heart,
            title: "Health & Wellness",
            description: "Comprehensive health insurance for employees and family"
        },
        {
            icon: GraduationCap,
            title: "Learning & Development",
            description: "Continuous training programs and skill development initiatives"
        },
        {
            icon: TrendingUp,
            title: "Career Growth",
            description: "Clear career progression paths and internal mobility opportunities"
        },
        {
            icon: Users,
            title: "Work Culture",
            description: "Collaborative environment fostering innovation and teamwork"
        },
        {
            icon: Award,
            title: "Recognition",
            description: "Performance-based rewards and employee recognition programs"
        },
        {
            icon: Building2,
            title: "Infrastructure",
            description: "Modern facilities with state-of-the-art equipment and technology"
        }
    ];

    const values = [
        "Safety First - Zero compromise on workplace safety",
        "Quality Excellence - Delivering superior products consistently",
        "Innovation - Pioneering solutions for infrastructure challenges",
        "Sustainability - Committed to environmental responsibility",
        "Integrity - Transparent and ethical business practices",
        "Customer Focus - Building lasting partnerships"
    ];

    const applicationSteps = [
        { step: "1", title: "Apply Online", description: "Submit your application through email or job portals" },
        { step: "2", title: "Initial Screening", description: "Our HR team reviews your profile and qualifications" },
        { step: "3", title: "Technical Interview", description: "Discussion with department heads about your expertise" },
        { step: "4", title: "Final Interview", description: "Meet with senior management and receive offer" }
    ];

    const filteredJobs = selectedDepartment === 'all'
        ? jobOpenings
        : jobOpenings.filter(job => job.department === selectedDepartment);

    return (
        <>
            <Helmet>
                <title>Careers at Gajpati Industries | Join Our Team</title>
                <meta name="description" content="Build your career with Gajpati Industries. Explore opportunities in manufacturing, R&D, sales, and quality control in India's leading infrastructure chemicals company." />
                <meta name="keywords" content="careers, jobs, chemical industry jobs, manufacturing careers, Gajpati Industries careers" />
            </Helmet>

            <div className="min-h-screen bg-background">
                {/* Hero Section */}
                <section className="bg-gradient-hero text-white py-12 sm:py-16 lg:py-16" aria-labelledby="hero-heading">
                    <Container>
                        <div className="text-center">
                            <h1 id="hero-heading" className="font-display font-bold text-3xl sm:text-4xl lg:text-hero mb-3 sm:mb-4">
                                Build Your Career with  <span className="text-amber"> Gajpati Industries</span>
                            </h1>
                            <p className="text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl sm:max-w-3xl mx-auto">
                                Join a team of innovators shaping India's infrastructure with cutting-edge chemical solutions.
                                Grow with us as we build a stronger tomorrow.
                            </p>
                        </div>
                    </Container>
                </section>

                {/* Why Join Us Section */}
                <section className="py-12 sm:py-16 bg-gray-50">
                    <Container>
                        <div className="text-center mb-12">
                            <h2 className="font-display font-bold text-2xl sm:text-4xl text-egyptian-blue mb-4">
                                Why Join Gajpati Industries?
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Be part of a legacy backed by A&T Infracon's 25+ years of excellence.
                                We offer more than just a job – we offer a career with purpose.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {benefits.map((benefit, index) => (
                                <Card key={index} className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 rounded-full bg-amber/10 flex items-center justify-center flex-shrink-0">
                                                <benefit.icon className="h-6 w-6 text-amber" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                                                <p className="text-gray-600 text-sm">{benefit.description}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </Container>
                </section>

                {/* Our Values */}
                <section className="py-12 sm:py-16 bg-white">
                    <Container>
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="font-display font-bold text-2xl sm:text-3xl text-egyptian-blue mb-6">
                                    Our Values Define Us
                                </h2>
                                <p className="text-gray-600 mb-8">
                                    At Gajpati Industries, we believe in creating an environment where talent thrives,
                                    innovation flourishes, and every team member contributes to building India's infrastructure.
                                </p>
                                <div className="space-y-3">
                                    {values.map((value, index) => (
                                        <div key={index} className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative">
                                <img
                                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600"
                                    alt="Team collaboration"
                                    className="rounded-lg shadow-xl"
                                />
                                <div className="absolute -bottom-6 -left-6 bg-amber text-egyptian-blue p-6 rounded-lg shadow-lg">
                                    <div className="text-3xl font-bold">25+</div>
                                    <div className="text-sm">Years of Excellence</div>
                                </div>
                            </div>
                        </div>
                    </Container>
                </section>

                {/* Current Openings */}
                <section id="openings" className="py-12 sm:py-16 bg-gray-50">
                    <Container>
                        <div className="text-center mb-12">
                            <h2 className="font-display font-bold text-2xl sm:text-4xl text-egyptian-blue mb-4">
                                Current Openings
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                                Explore opportunities across our manufacturing facility and offices.
                                Find the role that matches your expertise and aspirations.
                            </p>
                        </div>

                        {/* Department Filter */}
                        <div className="flex flex-wrap justify-center gap-2 mb-8">
                            {departments.map((dept) => (
                                <Button
                                    key={dept}
                                    variant={selectedDepartment === dept ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedDepartment(dept)}
                                    className={selectedDepartment === dept ? "bg-egyptian-blue" : ""}
                                >
                                    {dept === 'all' ? 'All Departments' : dept}
                                </Button>
                            ))}
                        </div>

                        {/* Job Listings */}
                        <div className="space-y-4">
                            {filteredJobs.map((job) => (
                                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="font-semibold text-xl text-egyptian-blue">
                                                        {job.title}
                                                    </h3>
                                                    <Badge variant="secondary" className="ml-2 lg:hidden">
                                                        {job.department}
                                                    </Badge>
                                                </div>
                                                <p className="text-gray-600 mb-4">{job.description}</p>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <MapPin className="h-4 w-4 mr-1" />
                                                        {job.location}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Briefcase className="h-4 w-4 mr-1" />
                                                        {job.type}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Clock className="h-4 w-4 mr-1" />
                                                        {job.experience}
                                                    </div>
                                                    <div className="flex items-center">
                                                        {job.salary}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col items-start lg:items-end space-y-2">
                                                <Badge variant="secondary" className="hidden lg:inline-flex">
                                                    {job.department}
                                                </Badge>
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-black bg-amber hover:bg-amber hover:text-egyptian-blue"
                                                >
                                                    <Link to={`/careers/${job.id}`}>
                                                        View Details
                                                        <ChevronRight className="ml-1 h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {filteredJobs.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No openings found in this department.</p>
                            </div>
                        )}
                    </Container>
                </section>

                {/* Application Process */}
                <section className="py-12 sm:py-16 bg-white">
                    <Container>
                        <div className="text-center mb-12">
                            <h2 className="font-display font-bold text-2xl sm:text-4xl text-egyptian-blue mb-4">
                                Our Application Process
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                We value transparency and efficiency. Here's what you can expect after applying:
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {applicationSteps.map((step, idx) => (
                                <Card key={idx} className="h-full">
                                    <CardContent className="p-6 flex flex-col items-center text-center">
                                        <div className="w-12 h-12 rounded-full bg-egyptian-blue/10 flex items-center justify-center mb-4">
                                            <span className="text-egyptian-blue font-bold text-xl">{step.step}</span>
                                        </div>
                                        <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                                        <p className="text-gray-600 text-sm">{step.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </Container>
                </section>

                {/* Contact / CTA Section */}
                <section className="py-12 sm:py-16 bg-gradient-to-br from-egyptian-blue via-violet-blue to-egyptian-blue text-white">
                    <Container>
                        <div className="max-w-2xl mx-auto text-center">
                            <h2 className="font-display font-bold text-2xl sm:text-4xl mb-4">
                                Ready to Join Us?
                            </h2>
                            <p className="mb-8 text-white/90">
                                If you have questions or want to know more about careers at Gajpati Industries, reach out to our HR team.
                            </p>
                            <Button asChild variant="cta" size="lg">
                                <a href="mailto:careers@gajpatiindustries.com">
                                    <Mail className="mr-2 h-5 w-5" />
                                    Contact HR
                                </a>
                            </Button>
                        </div>
                    </Container>
                </section>
            </div>
        </>
    );
};

export default Careers;