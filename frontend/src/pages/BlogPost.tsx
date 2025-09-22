import { useParams, Link } from 'react-router-dom';
import { useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import LazyLoad from 'react-lazyload';
import { useQuery } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar, Clock, User, ArrowLeft, Share2, Instagram, MessageCircle, Twitter } from 'lucide-react';
import { fetchBlogBySlug, fetchBlogs } from '../services/blog';
import toast from 'react-hot-toast';
import { handleWhatsAppRedirect } from '../helper/whatsapp';

const Container = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

const LoadingSpinner = () => (
  <div className="min-h-screen bg-background">
    <Container className="py-8 sm:py-12">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-amber mx-auto"></div>
        <p className="text-gray-600 mt-3 sm:mt-4 text-sm sm:text-base">Loading article...</p>
      </div>
    </Container>
  </div>
);

const ErrorFallback = ({ error }: { error: string }) => (
  <div className="min-h-screen bg-background">
    <Container className="py-8 sm:py-12">
      <div className="text-center text-red-500 text-sm sm:text-base">
        <p>{error || 'Blog post not found'}</p>
        <Button variant="outline" asChild className="mt-3 sm:mt-4 text-sm sm:text-base">
          <Link to="/blog">Back to Blog</Link>
        </Button>
      </div>
    </Container>
  </div>
);

const BlogPost = () => {
  const { slug } = useParams();

  const { data: post, isLoading: postLoading, error: postError } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => fetchBlogBySlug(slug!),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

  const { data: relatedPosts, isLoading: relatedLoading } = useQuery({
    queryKey: ['relatedBlogs', slug],
    queryFn: () => fetchBlogs(undefined, undefined, 10, post?.slug),
    enabled: !!post,
    select: (blogs) => blogs.sort(() => 0.5 - Math.random()).slice(0, 3),
    staleTime: 5 * 60 * 1000,
  });

  // Process HTML content - Fix URLs and sanitize
  const processedContent = useMemo(() => {
    if (!post?.content) return '';

    let content = post.content;

    // Fix localhost URLs in production
    if (import.meta.env.PROD) {
      content = content.replace(
        /http:\/\/localhost:\d+\/Uploads\//g,
        'https://gajpatiindustries.com/Uploads/'
      );
    }

    // Sanitize HTML to prevent XSS attacks
    const cleanHtml = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ol', 'ul', 'li', 'blockquote', 'a', 'img',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'pre', 'code', 'span', 'div', 'figure', 'figcaption'
      ],
      ALLOWED_ATTR: [
        'href', 'src', 'alt', 'title', 'width', 'height',
        'target', 'rel', 'id'
      ],
      // Remove all inline styles from TinyMCE
      FORBID_ATTR: ['style', 'class']
    });
    return cleanHtml;
  }, [post?.content]);

  const handleInstagramShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success('Link copied! Paste it in your Instagram Story or post.', {
        duration: 3000,
        position: 'bottom-center',
      });
    });
  };
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const id = hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);
  // Second useEffect ko ye se replace karo:
  useEffect(() => {
    const handleHashClick = (e: Event) => {  // MouseEvent ki jagah Event use karo
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link) {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const id = href.substring(1);
          const element = document.getElementById(id);

          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            window.history.pushState(null, '', href);
          }
        }
      }
    };

    // Content div find karo
    const contentDiv = document.querySelector('.prose');
    if (contentDiv) {
      contentDiv.addEventListener('click', handleHashClick);

      return () => {
        contentDiv.removeEventListener('click', handleHashClick);
      };
    }
  }, [processedContent]);
  const handleWhatsAppShare = () => {
    const shareUrl = window.location.href;
    const encodedUrl = encodeURIComponent(shareUrl);
    window.open(`https://api.whatsapp.com/send?text=${encodedUrl}`, '_blank');
  };

  const handleTwitterShare = () => {
    const shareUrl = window.location.href;
    const encodedUrl = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}`, '_blank');
  };

  if (postLoading || relatedLoading) return <LoadingSpinner />;
  if (postError || !post) return <ErrorFallback error={postError?.message || 'Blog post not found'} />;

  return (
    <>
      <Helmet>
        <title>{post.seoTitle || post.title || 'Blog Post | Gajpati Industries'}</title>
        <meta name="description" content={post.seoDescription || post.excerpt} />
        <meta name="keywords" content={post.seoKeywords?.join(', ')} />
        <link rel="canonical" href={`https://gajpatiindustries.com/${post.slug}`} />
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="bg-platinum/30 py-3 sm:py-4">
          <Container>
            <div className="flex items-center text-xs sm:text-sm text-gray-600 flex-wrap">
              <Link to="/blog" className="hover:text-egyptian-blue">Blog</Link>
              <span className="mx-1 sm:mx-2">/</span>
              <span>{post.category}</span>
              <span className="mx-1 sm:mx-2">/</span>
              <span className="text-egyptian-blue">{post.title.substring(0, 30)}...</span>
            </div>
          </Container>
        </div>

        {/* Article Header */}
        <article className="py-8 sm:py-12">
          <Container>
            <Button asChild variant="ghost" className="mb-4 sm:mb-6">
              <Link to="/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Link>
            </Button>

            {/* Featured Image */}
            {post.image && (
              <div className="mb-6 sm:mb-8 relative overflow-hidden rounded-xl shadow-lg">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            {/* Title and Meta */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                <Badge variant="secondary">{post.category}</Badge>
                {post.featured && (
                  <Badge variant="outline" className="text-amber border-amber">
                    Featured
                  </Badge>
                )}
              </div>

              <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-eerie-black mb-4 sm:mb-6 leading-tight">
                {post.title}
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed mb-4 sm:mb-6">
                {post.excerpt}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-4 border-t border-b border-platinum gap-3">
                <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center">
                    <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    {post.readTime}
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Share
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="bg-white shadow-lg rounded-lg p-3 sm:p-4 flex gap-3">
                      <Button variant="ghost" size="sm" onClick={handleInstagramShare}>
                        <Instagram className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleWhatsAppShare}>
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleTwitterShare}>
                        <Twitter className="h-4 w-4" />
                      </Button>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 sm:gap-2 mt-3 sm:mt-4">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Blog Content - Main Part with Automatic Styling */}
            <LazyLoad height={200} offset={100}>
              <div
                className="prose prose-lg max-w-none
                  prose-headings:font-display prose-headings:text-egyptian-blue
                  prose-h1:text-3xl sm:prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8
                  prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-6 prose-h2:mb-4
                  prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-5 prose-h3:mb-3
                  prose-p:text-gray-700 prose-p:leading-relaxed
                  prose-strong:text-eerie-black prose-strong:font-semibold
                  prose-a:text-egyptian-blue prose-a:underline hover:prose-a:text-violet-blue
                  prose-img:rounded-xl prose-img:shadow-lg prose-img:my-6
                  prose-ul:list-disc prose-ul:ml-6
                  prose-ol:list-decimal prose-ol:ml-6
                  prose-li:text-gray-700
                  prose-blockquote:border-l-4 prose-blockquote:border-egyptian-blue 
                  prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:bg-platinum/20
                  prose-table:border-collapse
                  prose-th:bg-egyptian-blue prose-th:text-white prose-th:px-4 prose-th:py-2
                  prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-2"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
            </LazyLoad>
          </Container>
        </article>

        {/* Related Articles */}
        {relatedPosts && relatedPosts.length > 0 && (
          <section className="py-8 sm:py-12 bg-white">
            <Container>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-egyptian-blue mb-6 sm:mb-8 text-center">
                Related Articles
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost._id} className="shadow-card hover:shadow-xl transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <Badge variant="outline" className="mb-2 sm:mb-3">
                        {relatedPost.category}
                      </Badge>
                      <h4 className="font-semibold text-base sm:text-lg text-eerie-black mb-3 sm:mb-4">
                        {relatedPost.title}
                      </h4>
                      <Button asChild variant="ghost" size="sm" className="p-0 h-auto">
                        <Link to={`/${relatedPost.slug}`}>
                          Read Article →
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Container>
          </section>
        )}

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

export default BlogPost;