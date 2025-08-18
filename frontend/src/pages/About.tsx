import { Helmet } from 'react-helmet-async';
import LazyLoad from 'react-lazyload';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Factory, Award, Calendar, Package, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { handleWhatsAppRedirect } from '../helper/whatsapp';

const Container = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

const LeaderImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-4 overflow-hidden">
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover"
      loading="lazy"
      onError={() => (
        <div className="w-full h-full bg-gradient-hero flex items-center justify-center text-white">
          {alt[0]}
        </div>
      )}
    />
  </div>
);
const About = () => {
  return (
    <>
      <Helmet>
        <title>About Gajpati Industries | Leading Infrastructure Chemicals Manufacturer</title>
        <meta
          name="description"
          content="Learn about Gajpati Industries, India's trusted infrastructure chemicals manufacturer since 1998, with 5 plants and 5000+ projects completed."
        />
        <meta
          name="keywords"
          content="Gajpati Industries, about us, infrastructure chemicals, manufacturing, India"
        />
        <meta
          property="og:title"
          content="About Gajpati Industries | Infrastructure Chemicals Manufacturer"
        />
        <meta
          property="og:description"
          content="Learn about Gajpati Industries, India's trusted infrastructure chemicals manufacturer since 1998, with 5 plants and 5000+ projects completed."
        />
        <meta property="og:image" content="https://gajpatiindustries.com/images/about-og.jpg" />
        <meta property="og:url" content="https://gajpatiindustries.com/about" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="About Gajpati Industries | Infrastructure Chemicals Manufacturer"
        />
        <meta
          name="twitter:description"
          content="Learn about Gajpati Industries, India's trusted infrastructure chemicals manufacturer since 1998, with 5 plants and 5000+ projects completed."
        />
        <meta name="twitter:image" content="https://gajpatiindustries.com/images/about-og.jpg" />
        <link rel="canonical" href="https://gajpatiindustries.com/about" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Gajpati Industries",
            "url": "https://gajpatiindustries.com",
            "logo": "https://gajpatiindustries.com/images/logo.webp",
            "description": "India's premier infrastructure chemicals manufacturer since 1998, trusted by 5000+ projects.",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-123-456-7890",
              "contactType": "Customer Service",
            },
            "sameAs": ["https://twitter.com/yourtwitter", "https://linkedin.com/company/yourlinkedin"],
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://gajpatiindustries.com" },
              { "@type": "ListItem", "position": 2, "name": "About", "item": "https://gajpatiindustries.com/about" },
            ],
          })}
        </script>
      </Helmet>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-egyptian-blue to-violet-blue text-white py-12 sm:py-16 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-hero mb-3 sm:mb-4">
                Building India's Infrastructure
              </h1>
              <h5 className="text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl sm:max-w-3xl mx-auto mb-2">
                ( A Sister Company of A&T Infracon – Trusted Since  1998 )
              </h5>
              <p className="text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl sm:max-w-3xl mx-auto">
                India's Trusted Partner in Infrastructure Material Solutions
                From National Highways to Slope Protections, from Urban Projects to Industrial Developments.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 sm:py-16 bg-white">
          <Container>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-4 text-center font-bold">
              <div className="group">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full  flex items-center justify-center mb-3 
                  group-hover:bg-egyptian-blue/20 transition-colors duration-300">
                    <Calendar className="h-8 w-8 sm:h-10 sm:w-10 text-egyptian-blue" />
                  </div>
                  {/* <div className="text-3xl sm:text-4xl font-bold text-egyptian-blue">5+</div> */}
                  <div className="text-gray-600 mt-2 text-sm sm:text-base">5+ Years Experience</div>
                </div>
              </div>
              <div className="group">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full  flex items-center justify-center mb-3 group-hover:bg-egyptian-blue/20 transition-colors duration-300">
                    <Factory className="h-8 w-8 sm:h-10 sm:w-10 text-egyptian-blue" />
                  </div>
                  {/* <div className="text-3xl sm:text-4xl font-bold text-egyptian-blue">1</div> */}
                  <div className="text-gray-600 mt-2 text-sm sm:text-base">Pan-India Supply</div>
                </div>
              </div>
              <div className="group">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full  flex items-center justify-center mb-3 group-hover:bg-egyptian-blue/20 transition-colors duration-300">
                    <Package className="h-8 w-8 sm:h-10 sm:w-10 text-egyptian-blue" />
                  </div>
                  {/* <div className="text-3xl sm:text-4xl font-bold text-egyptian-blue">70+</div> */}
                  <div className="text-gray-600 mt-2 text-sm sm:text-base">70+ Products</div>
                </div>
              </div>
              <div className="group">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full  flex items-center justify-center mb-3 group-hover:bg-egyptian-blue/20 transition-colors duration-300">
                    <Wrench className="h-8 w-8 sm:h-10 sm:w-10 text-egyptian-blue" />
                  </div>
                  {/* <div className="text-3xl sm:text-4xl font-bold text-egyptian-blue">50+</div> */}
                  <div className="text-gray-600 mt-2 text-sm sm:text-base">50+ Projects completed</div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Story Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-platinum/30">
          <Container>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-h1 text-egyptian-blue mb-4 sm:mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-gray-700 text-sm sm:text-base leading-relaxed">
                  <p>
                    Founded in 2020, Gajpati Industries began as a vision to simplify and modernize the infrastructure material supply chain in India. Backed by the legacy and leadership of A&T Infracon, our sister concern, we've rapidly evolved into a trusted brand known for quality, scalability, and innovation.
                  </p>
                  <p>
                    Our expertise spans across critical categories such as:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Bitumen & Emulsions</li>
                    <li>Gabion Wire Structures
                    </li>
                    <li>Construction Chemicals</li>
                    <li>Waterproofing & Sealants</li>
                    <li>Concrete Admixtures</li>
                    <li>Curing Compounds & Epoxy Systems</li>
                  </ul>
                  <p>
                    With strategically placed stock points, field engineers, and a responsive support network, Gajpati ensures that infrastructure developers, government agencies, and contractors get the right material, at the right time, anywhere in India.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="shadow-card">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <Factory className="h-10 w-10 sm:h-12 sm:w-12 text-egyptian-blue mx-auto mb-3 sm:mb-4" />
                    <h3 className="font-semibold text-base sm:text-lg mb-2">Manufacturing Excellence</h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      State-of-the-art facilities with automated quality control
                    </p>
                  </CardContent>
                </Card>
                <Card className="shadow-card">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <Award className="h-10 w-10 sm:h-12 sm:w-12 text-amber mx-auto mb-3 sm:mb-4" />
                    <h3 className="font-semibold text-base sm:text-lg mb-2">Quality Certified</h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      ISO / BIS, IS, and ASTM certified products
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Container>
        </section>

        {/* Leadership Section */}
        <LazyLoad height={200} offset={100}>
          <section className="py-12 sm:py-16 lg:py-20 bg-white">
            <Container>
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-h1 text-egyptian-blue mb-3 sm:mb-4">
                  Leadership Team
                </h2>
                <p className="text-gray-600 text-sm sm:text-base max-w-xl sm:max-w-2xl mx-auto">
                  Guided by experienced leaders with a strong commitment to excellence and client success.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                {[
                  {
                    name: 'Mr. Ashok Kumar Doshi:',
                    role: 'Managing Director',
                    experience: 'A distinguished veteran with profound industry insight, Mr. Doshi leads with a focus on innovation and strategic business expansion.',
                    image: 'https://your-supabase-url/storage/v1/object/public/leaders/rajesh-gajpati.jpg?format=webp&quality=80',
                  },
                  {
                    name: 'Mr. Punit Doshi',
                    role: 'Managing Director',
                    experience: ' An expert in operational efficiency and sophisticated supply chain logistics, Mr. Punit Doshi is instrumental in ensuring seamless pan-India material delivery.',
                    image: 'https://your-supabase-url/storage/v1/object/public/leaders/priya-sharma.jpg?format=webp&quality=80',
                  },
                  {
                    name: 'Mr. Mohit A. Doshi',
                    role: 'Managing Director',
                    experience: `A highly accomplished professional who contributes to the company's strategic direction and commitment to client success`,
                    image: 'https://your-supabase-url/storage/v1/object/public/leaders/amit-kumar.jpg?format=webp&quality=80',
                  },
                ].map((leader, index) => (
                  <Card key={index} className="shadow-card text-center" role="region" aria-label={`Team member ${leader.name}`}>
                    <CardContent className="p-6 sm:p-8">
                      <LeaderImage src={leader.image} alt={`${leader.name}, ${leader.role}`} />
                      <h3 className="font-semibold text-lg sm:text-xl mb-2">{leader.name}</h3>
                      <p className="text-egyptian-blue font-medium text-sm sm:text-base mb-2">{leader.role}</p>
                      <p className="text-xs sm:text-sm text-gray-600">{leader.experience}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Container>
          </section>
        </LazyLoad>

        {/* Values Section */}
        <LazyLoad height={200} offset={100}>
          <section className="py-12 sm:py-16 lg:py-20 bg-platinum/30">
            <Container>
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-h1 text-egyptian-blue mb-3 sm:mb-4">
                  Our Core Values
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                  {
                    title: 'Quality First',
                    desc: 'An uncompromising commitment to product excellence and customer satisfaction.',
                  },
                  {
                    title: 'Innovation',
                    desc: 'Continuous research and development to stay ahead of industry trends',
                  },
                  {
                    title: 'Integrity',
                    desc: 'Transparent business practices and ethical operations in all dealings',
                  },
                  {
                    title: 'Sustainability',
                    desc: 'Environmental responsibility and sustainable manufacturing practices',
                  },
                ].map((value, index) => (
                  <Card key={index} className="shadow-card" role="region" aria-label={`Core value ${value.title}`}>
                    <CardContent className="p-4 sm:p-6 text-center">
                      <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-egyptian-blue">{value.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{value.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Container>
          </section>
        </LazyLoad>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 bg-gradient-hero text-white">
          <Container>
            <div className="text-center">
              <h2 className="font-display font-bold text-2xl sm:text-h2 mb-4 sm:mb-6">
                Ready to Partner with India's Infrastructure Leader?
              </h2>
              <p className="text-base sm:text-xl mb-6 sm:mb-8 leading-relaxed max-w-xl sm:max-w-2xl mx-auto">
                Join our growing list of satisfied customers who trust Gajpati Industries for their most critical infrastructure projects.
              </p>
              <div className="flex justify-center">
                <Button variant="action" size="lg" asChild className="w-auto min-w-[160px] px-3 py-2 sm:min-w-[200px] sm:px-4 sm:py-2">
                  <Link to="/contact">Start Your Project Today</Link>
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

export default About;