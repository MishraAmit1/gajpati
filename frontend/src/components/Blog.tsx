import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { fetchBlogs } from '../services/blog';

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
    const { data: blogs, isLoading, error } = useQuery({
        queryKey: ['blogs-homepage'],
        queryFn: () => fetchBlogs(), // Fetch all blogs
        staleTime: 5 * 60 * 1000,
        select: (data) => data?.slice(0, 3) || [], // Select only first 3 blogs
    });

    if (isLoading) {
        return (
            <section className="py-8 sm:py-16 bg-white">
                <Container>
                    <LoadingSpinner />
                </Container>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-8 sm:py-16 bg-white">
                <Container>
                    <ErrorFallback error={error.message} />
                </Container>
            </section>
        );
    }

    if (!blogs || blogs.length === 0) {
        return null; // Don't render anything if no blogs
    }

    return (
        <section className="py-8 sm:py-16 bg-white">
            <Container>
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="font-display font-bold text-2xl sm:text-4xl text-egyptian-blue mb-2 sm:mb-4">
                        Latest Industry Insights
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
                        Stay updated with expert knowledge, technical guides, and industry trends from our infrastructure specialists.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                    {blogs.map((post) => (
                        <Card
                            key={post._id}
                            className="shadow-card hover:shadow-xl transition-shadow duration-300 group h-full flex flex-col"
                            role="article"
                            aria-label={`Blog post: ${post.title}`}
                        >
                            <CardContent className="p-0 flex flex-col h-full">
                                {/* Blog Image - Fixed Height */}
                                <div className="h-48 sm:h-56 bg-gradient-to-br from-egyptian-blue to-violet-blue flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {post.image ? (
                                        <img
                                            src={`${post.image}?format=webp&quality=80`}
                                            alt={`Article: ${post.title}`}
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

                                {/* Blog Content - Flexible Height */}
                                <div className="p-4 sm:p-6 flex flex-col flex-grow">
                                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                                        <Badge variant="secondary" className="text-xs sm:text-sm">
                                            {post.category}
                                        </Badge>

                                    </div>

                                    {/* Title - Fixed Height with line clamp */}
                                    <h3 className="font-display font-bold text-lg sm:text-xl text-eerie-black mb-2 sm:mb-1 group-hover:text-egyptian-blue transition-colors line-clamp-2 min-h-[3.5rem] sm:min-h-[3rem]">
                                        {post.title}
                                    </h3>
                                    {/* Excerpt - Fixed Height with line clamp */}
                                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-3 sm:mb-1 line-clamp-3 min-h-[4.5rem] sm:min-h-[6rem]">
                                        {post.excerpt}
                                    </p>

                                    {/* Meta Information - Fixed Height */}
                                    <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 min-h-[2rem]">
                                        <div className="flex flex-wrap gap-3 sm:gap-4">
                                            <div className="flex items-center">
                                                <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                                <span className="truncate max-w-[80px]">{post.author}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                                {new Date(post.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                                {post.readTime}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tags - Fixed Height */}
                                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-1 min-h-[2rem] items-start">
                                        {post.tags.slice(0, 2).map((tag) => (
                                            <Badge key={tag} variant="outline" className="text-xs truncate max-w-[200px]">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>

                                    {/* Read More Button - Always at bottom */}
                                    <div className="mt-auto">
                                        <Button
                                            asChild
                                            variant="enterprise"
                                            size="sm"
                                            className="w-full group"
                                        >
                                            <Link to={`/${post.slug}`} className="flex items-center justify-center">
                                                Read Article
                                                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* View All Blogs Button */}
                <div className="text-center mt-8 sm:mt-12">
                    <Button variant="outline" size="lg" asChild>
                        <Link to="/blog" className="flex items-center">
                            View All Articles
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                    </Button>
                </div>
            </Container>
        </section>
    );
};

export default Blog;