import { useState, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import LazyLoad from 'react-lazyload';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { fetchBlogs, type Blog } from '../services/blog';
import { subscribe } from '../services/subscriber';
import { toast } from 'react-hot-toast';
import { handleWhatsAppRedirect } from '../helper/whatsapp';

const Container = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

const LoadingSpinner = () => (
  <div className="text-center py-8 sm:py-12">
    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-amber mx-auto"></div>
    <p className="text-gray-600 mt-3 sm:mt-4 text-sm sm:text-base">Loading articles...</p>
  </div>
);

const ErrorFallback = ({ error }: { error: string }) => (
  <div className="text-center py-8 sm:py-12">
    <p className="text-red-500 text-sm sm:text-base">{error}</p>
    <Button variant="outline" onClick={() => window.location.reload()} className="mt-3 sm:mt-4 text-sm sm:text-base">
      Retry
    </Button>
  </div>
);

const Blog = () => {
  const categories = useMemo(
    () => ['All', 'Technical Guide', 'Application', 'Product Innovation', 'Sustainability', 'Quality Assurance', 'Case Study'],
    []
  );
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const { data: blogs, isLoading, error } = useQuery({
    queryKey: ['blogs', selectedCategory],
    queryFn: () => fetchBlogs(selectedCategory === 'All' ? undefined : selectedCategory),
    staleTime: 5 * 60 * 1000,
  });

  const featuredPosts = blogs?.filter(post => post.featured) || [];
  const regularPosts = blogs?.filter(post => !post.featured) || [];

  // Dynamic SEO metadata
  const seoTitle = selectedCategory === 'All'
    ? 'Blog | Gajpati Industries - Infrastructure Insights'
    : `${selectedCategory} Insights | Gajpati Industries Blog`;

  const seoDescription = selectedCategory === 'All'
    ? 'Explore expert technical guides, product updates, and industry insights from Gajpati Industries, India’s leading infrastructure chemicals manufacturer.'
    : `Discover ${selectedCategory} articles, technical guides, and industry insights from Gajpati Industries, India’s leading infrastructure chemicals manufacturer.`;

  const seoKeywords = useMemo(() => {
    const baseKeywords = ['infrastructure chemicals', 'Gajpati Industries', 'technical guides', 'product innovation', 'sustainability'];
    if (selectedCategory !== 'All') {
      baseKeywords.push(selectedCategory.toLowerCase());
    }
    // Aggregate unique keywords from blogs
    const blogKeywords = blogs?.flatMap(post => post.seoKeywords || []) || [];
    return [...new Set([...baseKeywords, ...blogKeywords])].slice(0, 10); // Limit to 10 keywords
  }, [blogs, selectedCategory]);

  const handleSubscribe = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter an email address.');
      return;
    }
    try {
      await subscribe({ email });
      setIsSubscribed(true);
      toast.success(`Thank you, ${email}! You have successfully subscribed to our newsletter.`, {
        duration: 5000,
      });
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 5000);
    } catch (err) {
      if (err.message.includes('11000')) {
        toast.error('This email is already subscribed. Please use a different email.');
      } else {
        toast.error(err.message || 'Failed to subscribe. Please try again.');
      }
      setIsSubscribed(false);
    }
  }, [email]);

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={seoKeywords.join(', ')} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content="https://gajpatiindustries.com/blog" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content="https://gajpatiindustries.com/images/blog-og.jpg" />
        <link rel="canonical" href="https://gajpatiindustries.com/blog" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            'name': 'Gajpati Industries Blog',
            'url': 'https://gajpatiindustries.com/blog',
            'description': seoDescription,
            'publisher': {
              '@type': 'Organization',
              'name': 'Gajpati Industries',
              'logo': { '@type': 'ImageObject', 'url': 'https://gajpatiindustries.com/images/logo.webp' },
            },
          })}
        </script>
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Rest of the component remains the same */}
        {/* Hero Section */}
        <section className="bg-gradient-hero text-white py-12 sm:py-16 lg:py-16" aria-labelledby="hero-heading">
          <Container>
            <div className="text-center">
              <h1 id="hero-heading" className="font-display font-bold text-3xl sm:text-4xl lg:text-hero mb-3 sm:mb-4">
                Infrastructure Insights
              </h1>
              <p className="text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl sm:max-w-3xl mx-auto">
                Expert knowledge, technical guides, and industry insights from India's leading
                infrastructure chemicals manufacturer
              </p>
            </div>
          </Container>
        </section>

        {/* Category Filter */}
        <section className="py-6 sm:py-8 bg-white border-b border-platinum">
          <Container>
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-start sm:justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'enterprise' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  aria-label={`Filter by ${category}`}
                  className="text-xs sm:text-sm px-3 sm:px-4"
                >
                  {category}
                </Button>
              ))}
            </div>
          </Container>
        </section>

        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorFallback error={error.message} />
        ) : (
          <>
            {/* Featured Posts */}
            {selectedCategory === 'All' && featuredPosts.length > 0 && (
              <LazyLoad height={200} offset={100}>
                <section className="py-8 sm:py-12 bg-platinum/20">
                  <Container>
                    <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-h2 text-egyptian-blue mb-6 sm:mb-8 text-center">
                      Featured Articles
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
                      {featuredPosts.map((post) => (
                        <Card
                          key={post._id}
                          className="shadow-card hover:shadow-xl transition-shadow duration-300 group"
                          role="article"
                          aria-label={`Blog post: ${post.title}`}
                        >
                          <CardContent className="p-0">
                            <div className="h-48 sm:h-64 bg-gradient-to-br from-egyptian-blue to-violet-blue flex items-center justify-center overflow-hidden">
                              {post.image ? (
                                <img
                                  src={`${post.image}?format=webp&quality=80`}
                                  alt={`Featured article: ${post.title}`}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="text-white text-center bg-gradient-to-br from-egyptian-blue to-violet-blue h-full flex flex-col items-center justify-center">
                                  <div className="text-3xl sm:text-4xl font-bold opacity-20 mb-2">📄</div>
                                  <div className="text-xs sm:text-sm opacity-75">No Image Available</div>
                                </div>
                              )}
                            </div>
                            <div className="p-4 sm:p-6">
                              <div className="flex items-center justify-between mb-2 sm:mb-3">
                                <Badge variant="secondary" className="text-xs sm:text-sm">{post.category}</Badge>
                                <Badge variant="outline" className="text-amber border-amber text-xs sm:text-sm">
                                  Featured
                                </Badge>
                              </div>
                              <h3 className="font-display font-bold text-lg sm:text-xl lg:text-xl text-eerie-black mb-2 sm:mb-3 group-hover:text-egyptian-blue transition-colors">
                                {post.title}
                              </h3>
                              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">{post.excerpt}</p>
                              <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                                <div className="flex flex-wrap gap-3 sm:gap-4">
                                  <div className="flex items-center">
                                    <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                    {post.author}
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                    })}
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                    {post.readTime}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                                {post.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <Button asChild variant="enterprise" className="w-auto min-w-[140px] px-3 sm:min-w-[160px] sm:px-4 py-2 group">
                                <Link to={`/${post.slug}`} className="flex items-center">
                                  Read Full Article
                                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </Container>
                </section>
              </LazyLoad>
            )}

            {/* Regular Posts */}
            <LazyLoad height={200} offset={100}>
              <section className="py-8 sm:py-12 bg-white">
                <Container>
                  <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
                    <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-h2 text-egyptian-blue mb-3 sm:mb-0">
                      {selectedCategory === 'All' ? 'Latest Articles' : selectedCategory}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-8">
                    {(selectedCategory === 'All' ? regularPosts : blogs || []).map((post) => (
                      <Card
                        key={post._id}
                        className="shadow-card hover:shadow-xl transition-shadow duration-300 group"
                        role="article"
                        aria-label={`Blog post: ${post.title}`}
                      >
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <Badge variant="outline" className="text-xs sm:text-sm">{post.category}</Badge>
                          </div>
                          <h3 className="font-semibold text-base sm:text-lg lg:text-lg text-eerie-black mb-2 sm:mb-3 group-hover:text-egyptian-blue transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">{post.excerpt}</p>
                          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              {new Date(post.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              {post.readTime}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                            {post.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <Button asChild variant="ghost" className="w-auto min-w-[120px] px-3 sm:min-w-[140px] sm:px-4 py-2 group h-auto justify-start">
                            <Link to={`/${post.slug}`} className="flex items-center text-egyptian-blue hover:text-violet-blue">
                              Read Article
                              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </Container>
              </section>
            </LazyLoad>
          </>
        )}

        {/* Newsletter CTA */}
        <section className="py-12 sm:py-16 bg-gradient-hero text-white">
          <Container>
            <div className="text-center">
              <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-h2 mb-4 sm:mb-6">
                Stay Updated with Industry Insights
              </h2>
              <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 leading-relaxed max-w-xl sm:max-w-2xl mx-auto">
                Get the latest technical guides, product updates, and industry trends delivered
                directly to your inbox.
              </p>
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col gap-3 sm:gap-4 justify-start sm:justify-center max-w-sm mx-auto"
                aria-label="Newsletter subscription form"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full sm:w-auto flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-gray-900 border-0 focus:ring-2 focus:ring-amber text-sm sm:text-base"
                  required

                  disabled={isSubscribed}
                  aria-label="Email address for newsletter subscription"
                />
                <Button
                  type="submit"
                  variant="action"
                  size="lg"
                  disabled={isSubscribed}
                  aria-label={isSubscribed ? 'Subscribed' : 'Subscribe to newsletter'}
                  className="w-auto min-w-[140px] px-3 sm:min-w-[160px] sm:px-4 py-2"
                >
                  {isSubscribed ? 'Subscribed!' : 'Subscribe'}
                </Button>
              </form>
              {isSubscribed && (
                <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-200">
                  You will receive a confirmation email soon. Check your inbox!
                </p>
              )}
            </div>
          </Container>
        </section>
      </div>
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
    </>
  );
};

export default Blog;