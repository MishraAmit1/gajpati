// SubcategoryListRow.jsx - True Horizontal Layout for Mobile
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const SubcategoryListRow = ({
    title,
    description,
    productCount,
    image,
    link,
    keyFeatures = [],
    applications = [],
    specs,
}) => (
    <div className="flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-3 sm:p-4 gap-3 sm:gap-4">

        {/* Image - Left Side (All Screen Sizes) */}
        <Link to={link} className="flex-shrink-0">
            <img
                src={image}
                alt={title}
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-cover rounded-md border transition-transform duration-300 hover:scale-105"
            />
        </Link>

        {/* Content - Middle Section */}
        <div className="flex-1 min-w-0 space-y-1 sm:space-y-2">
            <Link to={link}>
                <h3 className="text-sm sm:text-lg md:text-xl font-semibold text-zinc-900 dark:text-zinc-100 hover:text-primary transition-colors line-clamp-1 sm:line-clamp-2">
                    {title}
                </h3>
            </Link>

            <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm md:text-base line-clamp-2 sm:line-clamp-2">
                {description}
            </p>

            {/* Applications Tags */}
            <div className="flex flex-wrap gap-1 sm:gap-2 mt-1 sm:mt-2">
                {/* Mobile: Show 2 tags, Desktop: Show 4 tags */}
                <div className="flex flex-wrap gap-1 sm:gap-2 sm:hidden">
                    {applications.slice(0, 2).map((feature, idx) => (
                        <span
                            key={idx}
                            className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded font-medium"
                        >
                            {feature}
                        </span>
                    ))}
                    {applications.length > 2 && (
                        <span className="text-[10px] text-zinc-400 self-center">
                            +{applications.length - 2} more
                        </span>
                    )}
                </div>

                <div className="hidden sm:flex flex-wrap gap-2">
                    {applications.slice(0, 4).map((feature, idx) => (
                        <span
                            key={idx}
                            className="bg-primary/10 text-primary text-xs px-2 py-1 rounded font-medium"
                        >
                            {feature}
                        </span>
                    ))}
                    {applications.length > 4 && (
                        <span className="text-xs text-zinc-400 self-center">
                            +{applications.length - 4} more
                        </span>
                    )}
                </div>
            </div>
        </div>

        {/* Action Section - Right Side */}
        <div className="flex flex-col items-end justify-center min-w-[80px] sm:min-w-[120px] lg:min-w-[140px] space-y-2">
            <span className="text-[10px] sm:text-xs md:text-sm text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full text-center whitespace-nowrap">
                {productCount} product{productCount !== 1 ? "s" : ""}
            </span>

            <Link
                to={link}
                className="flex items-center text-primary font-medium text-xs sm:text-sm md:text-base hover:text-primary-dark transition-colors py-1.5 sm:py-2 px-2 sm:px-4 bg-primary/5 hover:bg-primary/10 rounded-md"
            >
                <span className="hidden sm:inline">Explore</span>
                <span className="sm:hidden">View</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ml-1" />
            </Link>
        </div>
    </div>
);