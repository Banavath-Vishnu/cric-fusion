import React, { useEffect, useState } from "react";
import { newsApi } from "../apis/api.js";
import { ChevronRight, Calendar, User } from "lucide-react";

const NewsPage = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get darkMode value from a theme context (assumed to be provided by parent)
  const { darkMode } = React.useContext(ThemeContext) || { darkMode: false };

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const fetchedNews = await newsApi();
        setNewsItems(fetchedNews.articles || []);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <section className={`py-12 px-4 sm:px-6 transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-6xl mx-auto">
        <h2 className={`text-2xl font-medium mb-8 ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
          Cricket Fusion Top Highlights
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className={`h-2 w-24 rounded-full ${darkMode ? "bg-gray-800" : "bg-gray-200"}`}>
              <div className="h-full w-1/2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((news) => (
              <div
                key={news.id}
                className={`group transition-all duration-300 hover:translate-y-px ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } rounded-lg overflow-hidden shadow-sm hover:shadow`}
              >
                {/* Image container with minimalist styling */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={news.cover_image_url}
                    alt={news.header}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div 
                    className={`absolute top-3 right-3 px-2.5 py-0.5 text-xs font-medium rounded-full ${
                      darkMode ? "bg-gray-900/70 text-gray-100" : "bg-white/80 text-gray-800"
                    }`}
                  >
                    {news.category}
                  </div>
                </div>
                
                <div className="p-5">
                  {/* Simple, clean typography */}
                  <h3 className={`text-lg font-medium mb-2 transition-colors ${
                    darkMode ? "text-gray-100 group-hover:text-blue-400" : "text-gray-800 group-hover:text-blue-600"
                  }`}>
                    {news.header}
                  </h3>
                  
                  <p className={`text-sm leading-relaxed mb-4 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                    {news.excerpt}
                  </p>
                  
                  {/* Minimalist metadata with subtle separators */}
                  <div className={`flex items-center text-xs space-x-4 ${
                    darkMode ? "text-gray-500" : "text-gray-500"
                  }`}>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1.5" />
                      <span>
                        {news.closed_on
                          ? new Date(Number(news.closed_on)).toLocaleString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1.5" />
                      <span>{news.assigned_to_name}</span>
                    </div>
                  </div>
                  
                  {/* Simple read more link with minimal styling */}
                  <div className={`mt-4 pt-4 border-t ${
                    darkMode ? "border-gray-700/50" : "border-gray-100"
                  }`}>
                    <a
                      href={`https://cricket.one/${news.newsUrl}`}
                      className={`inline-flex items-center text-sm ${
                        darkMode 
                          ? "text-blue-400 hover:text-blue-300" 
                          : "text-blue-600 hover:text-blue-700"
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read more
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Minimal, elegant empty state */}
        {!loading && newsItems.length === 0 && (
          <div className={`text-center py-16 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            <p>No news articles available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

// Theme context - assumed to be provided by parent component
const ThemeContext = React.createContext({ darkMode: false });

export default NewsPage;