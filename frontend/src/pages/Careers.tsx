import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import emailjs from 'emailjs-com';
import {
    Briefcase, MapPin, Clock, Users, TrendingUp, Heart, Award, Building2,
    GraduationCap, Mail, ChevronRight, CheckCircle, X
} from 'lucide-react';

const Container = ({ children, className = '' }) => (
    <div className={`max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 ${className}`}>{children}</div>
);


const Careers = () => {
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const formRef = useRef();
    // Job openings data
    const jobOpenings = [
        {
            id: 1,
            title: "Production Manager",
            department: "Manufacturing",
            location: "Jammu & Kashmir",
            type: "Full-time",
            experience: "5-8 years",
            description: "Lead our bitumen production facility with focus on quality control and operational efficiency.",
            requirements: [
                "B.Tech/M.Tech in Chemical Engineering",
                "Experience in bitumen/chemical manufacturing",
                "Strong leadership and safety management skills"
            ]
        },
        {
            id: 2,
            title: "Quality Control Chemist",
            department: "Quality Assurance",
            location: "Jammu & Kashmir",
            type: "Full-time",
            experience: "2-4 years",
            description: "Ensure product quality standards for our construction chemicals and bitumen products.",
            requirements: [
                "B.Sc/M.Sc in Chemistry",
                "Experience with IS/ASTM testing standards",
                "Knowledge of construction chemical testing"
            ]
        },
        {
            id: 3,
            title: "Sales Engineer",
            department: "Sales",
            location: "Delhi NCR",
            type: "Full-time",
            experience: "3-5 years",
            description: "Drive B2B sales for infrastructure chemicals across North India region.",
            requirements: [
                "B.Tech in Civil/Chemical Engineering",
                "Experience in construction chemical sales",
                "Strong client relationship skills"
            ]
        },
        {
            id: 4,
            title: "R&D Executive",
            department: "Research",
            location: "Jammu & Kashmir",
            type: "Full-time",
            experience: "2-5 years",
            description: "Develop innovative formulations for construction chemicals and bitumen products.",
            requirements: [
                "M.Sc/M.Tech in Chemistry/Chemical Engineering",
                "Experience in polymer/bitumen research",
                "Patent filing experience preferred"
            ]
        },
        {
            id: 5,
            title: "Plant Maintenance Engineer",
            department: "Operations",
            location: "Jammu & Kashmir",
            type: "Full-time",
            experience: "4-6 years",
            description: "Maintain and optimize manufacturing equipment for continuous production.",
            requirements: [
                "B.Tech in Mechanical Engineering",
                "Experience in chemical plant maintenance",
                "Knowledge of preventive maintenance systems"
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 1024 * 1024) { // 1MB
            setFormError('File size should be less than 1MB.');
            e.target.value = '';
            return;
        }
        setFormError('');
    };
    const handleApplyClick = (job) => {
        setSelectedJob(job);
        setFormError('');
        setFormSuccess('');
        setShowModal(true);
    };
    // heelo hoe are you 
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedJob(null);
    };
    // Form change handler
    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError('');
        setFormSuccess('Submitting...');

        emailjs.sendForm(
            'service_a69cmrl', // Your Service ID
            'template_8xdw0wg', // Your Template ID
            formRef.current,
            'tuMby3K1-jT62DW4C' // <-- Replace with your EmailJS public key
        ).then(
            (result) => {
                setFormSuccess('Application submitted! We will contact you soon.');
                setTimeout(() => setShowModal(false), 2000);
            },
            (error) => {
                setFormError('Failed to send application. Please try again.');
            }
        );
    };


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
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
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
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-gray-700">Key Requirements:</p>
                                                    <ul className="text-sm text-gray-600 space-y-1">
                                                        {job.requirements.map((req, index) => (
                                                            <li key={index} className="flex items-start">
                                                                <span className="text-amber mr-2">•</span>
                                                                {req}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col items-start lg:items-end space-y-2">
                                                <Badge variant="secondary" className="hidden lg:inline-flex">
                                                    {job.department}
                                                </Badge>
                                                <Button variant="action" size="sm" onClick={() => handleApplyClick(job)}>
                                                    Apply Now
                                                    <ChevronRight className="ml-1 h-4 w-4" />
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

                <section className="py-12 sm:py-16 bg-white">
                    <Container>
                        <div className="text-center mb-12">
                            <h2 className="font-display font-bold text-2xl sm:text-4xl text-egyptian-blue mb-4">
                                Our Application Process
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                We value transparency and efficiency. Here’s what you can expect after applying:
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
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 relative">
                            <button
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                                onClick={handleCloseModal}
                                aria-label="Close"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <div className="p-6">
                                <h2 className="text-xl font-bold mb-2 text-egyptian-blue">Apply for {selectedJob?.title}</h2>
                                <form
                                    ref={formRef}
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                    encType="multipart/form-data"
                                >
                                    <input type="hidden" name="position" value={selectedJob?.title || ''} />
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-egyptian-blue"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-egyptian-blue"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-egyptian-blue"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Resume (PDF/DOC)</label>
                                        <input
                                            type="file"
                                            name="resume"
                                            accept=".pdf,.doc,.docx"
                                            className="w-full"
                                            required
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    {formError && <div className="text-red-600 text-sm">{formError}</div>}
                                    {formSuccess && <div className="text-green-600 text-sm">{formSuccess}</div>}
                                    <div className="pt-2">
                                        <Button type="submit" variant="cta" className="w-full">
                                            Submit Application
                                        </Button>
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

export default Careers;