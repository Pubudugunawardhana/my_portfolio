import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Section } from './Section';
import { ExternalLink, BookOpen, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

// Replace with actual Medium username
const MEDIUM_USERNAME = '@pubudugunawardhana23';

export function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const rssUrl = `https://medium.com/feed/${MEDIUM_USERNAME}`;
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
        
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch blogs');
        
        const data = await response.json();
        
        if (data.status === 'ok') {
          // Medium posts sometimes don't have a thumbnail field explicitly in rss2json, 
          // so we fallback to extracting the first img tag from the description
          const parsedBlogs = data.items.map(item => {
            let imageUrl = item.thumbnail;
            
            if (!imageUrl) {
              const imgMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
              if (imgMatch) imageUrl = imgMatch[1];
            }

            // Extract a clean text snippet from the HTML description
            const textSnippet = item.description
              .replace(/<[^>]+>/g, '') // Strip HTML tags
              .replace(/Continue reading on Medium.*/i, '') // Remove medium footer text
              .substring(0, 150) + '...';

            return {
              title: item.title,
              link: item.link,
              pubDate: new Date(item.pubDate).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
              }),
              thumbnail: imageUrl,
              description: textSnippet,
              categories: item.categories || []
            };
          });
          
          setBlogs(parsedBlogs);
        }
      } catch (err) {
        console.error("Error fetching Medium blogs:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (!isLoading && blogs.length === 0) {
    return null;
  }

  return (
    <Section id="blogs" title="Articles & Blogs" className="bg-slate-50 dark:bg-slate-950">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
           <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
           <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium tracking-wide animate-pulse">Fetching latest articles...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">
          <p>Failed to load blogs. Please check back later.</p>
        </div>
      ) : (
        <div className="relative group/slider">
          {/* Desktop Navigation Buttons */}
          <div className="absolute top-1/2 -left-4 lg:-left-6 transform -translate-y-1/2 z-10 hidden md:block opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300">
            <button 
              onClick={() => scroll('left')}
              className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-110 active:scale-95 transition-all"
            >
              <ChevronLeft size={24} />
            </button>
          </div>
          
          <div className="absolute top-1/2 -right-4 lg:-right-6 transform -translate-y-1/2 z-10 hidden md:block opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300">
            <button 
              onClick={() => scroll('right')}
              className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-110 active:scale-95 transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Scrolling Container */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-8 pb-8 pt-4 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden px-2 md:px-4"
          >
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.link}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="w-full sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-21.33px)] flex-shrink-0 snap-start group flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl border border-slate-100 dark:border-slate-800 transition-all duration-300"
              >
                {/* Blog Thumbnail */}
                <div className="relative h-56 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                  {blog.thumbnail ? (
                    <img
                      src={blog.thumbnail}
                      alt={blog.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-700 transform group-hover:scale-110 group-hover:text-blue-400 transition-all duration-500 ease-in-out" />
                    </div>
                  )}
                </div>
                
                {/* Blog Content */}
                <div className="flex flex-col flex-grow p-6 sm:p-8 space-y-4">
                  
                  {/* Meta details */}
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>{blog.pubDate}</span>
                    </div>
                    {blog.categories.length > 0 && (
                      <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full">
                        {blog.categories[0]}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-blue-500 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 flex-grow">
                    {blog.description}
                  </p>
                  
                  {/* Footer Link */}
                  <div className="pt-6 mt-auto border-t border-slate-100 dark:border-slate-800">
                    <a
                      href={blog.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      <span>Read on Medium</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
