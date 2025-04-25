import React, { useEffect, useState } from "react";
import { ChevronRight, Calendar, User } from "lucide-react";
import { newsApiHomePage } from "../apis/api.js";

const NewsSection = () => {
  const [newsItems, setNewsItems] = useState([]); // ✅ State to store news

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const fetchedNews = await newsApiHomePage(); // Fetch data from API
        setNewsItems(fetchedNews.topics || []); // ✅ Extract topics from API response
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Cricket Fusion Top Highlights
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.length > 0 ? (
            newsItems.map((topic) =>
              topic.articles.map((news) => (
                <div
                  key={news.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={news.cover_image_url}
                      alt={news.header}
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                    />
                    <div className="absolute top-0 right-0 m-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {topic.title}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                      {news.header}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{news.excerpt}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          {news.publ_date
                            ? new Date(news.publ_date).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true,
                                timeZone: "Asia/Kolkata",
                              })
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center ml-4">
                        <User className="h-4 w-4 mr-1" />
                        <span>{news.assigned_by_name || "Unknown"}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <a
                        href={`https://cricket.one${news.newsUrl}`}
                        className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Read more
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )
          ) : (
            <p className="text-gray-500 text-center col-span-3">
              Loading news...
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
