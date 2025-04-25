import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { HiOutlineNewspaper, HiOutlineSearch, HiArrowRight, HiOutlineRefresh } from 'react-icons/hi';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredPost, setFeaturedPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/post/getPosts');
        
        if (!res.ok) {
          throw new Error('Failed to fetch posts');
        }
        
        const data = await res.json();
        setPosts(data.posts);
        
        // Set the first post as featured if posts exist
        if (data.posts && data.posts.length > 0) {
          setFeaturedPost(data.posts[0]);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  const refreshPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/post/getPosts');
      const data = await res.json();
      setPosts(data.posts);
      setError(null);
    } catch (error) {
      setError('Failed to refresh posts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 min-h-screen pb-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-500 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col gap-6 md:gap-8 text-center md:text-left md:w-3/4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight transition-all duration-500 hover:scale-105 hover:text-teal-100">
              CricketFusion Blogs
            </h1>
            <p className="text-lg md:text-xl text-teal-100 max-w-3xl transition-all duration-300 hover:text-white">
              Dive into the world of cricket with expert analysis, match insights, and stories from around the cricketing world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
              <Link 
                to="/search" 
                className="bg-white text-teal-700 px-6 py-3 rounded-full font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:bg-teal-100 hover:scale-105 hover:shadow-lg"
              >
                <HiOutlineSearch className="text-xl" />
                Explore Articles
              </Link>
              <Link 
                to="/create-post" 
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:bg-white/10 hover:scale-105"
              >
                <HiOutlineNewspaper className="text-xl" />
                Write an Article
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Post Section (if available) */}
      {featuredPost && (
        <div className="max-w-6xl mx-auto px-4 -mt-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/5">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title} 
                  className="w-full h-64 md:h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 px-3 py-1 rounded-full text-xs font-medium">
                      Featured Post
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      {new Date(featuredPost.createdAt).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800 dark:text-white transition-colors duration-300 hover:text-teal-600 dark:hover:text-teal-400">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
                    {featuredPost.content.replace(/<[^>]*>/g, '').slice(0, 200)}...
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <Link 
                    to={`/post/${featuredPost.slug}`}
                    className="flex items-center text-teal-600 dark:text-teal-400 font-medium transition-all duration-300 hover:text-teal-800 dark:hover:text-teal-300 group"
                  >
                    Read Full Article
                    <HiArrowRight className="ml-2 transform transition-transform duration-300 group-hover:translate-x-2" />
                  </Link>
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <img 
                      src={featuredPost.user?.profilePicture || "https://api.dicebear.com/7.x/avataaars/svg?seed=cricket"} 
                      alt="Author" 
                      className="w-8 h-8 rounded-full mr-2 object-cover"
                    />
                    <span>{featuredPost.user?.username || "Cricket Expert"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Posts Section */}
      <div className="max-w-6xl mx-auto p-4 mt-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            <span className="border-b-4 border-teal-500 pb-1">Recent Posts</span>
          </h2>
          <button 
            onClick={refreshPosts} 
            className="flex items-center gap-2 text-teal-600 dark:text-teal-400 transition-all duration-300 hover:text-teal-800 hover:scale-105"
          >
            <HiOutlineRefresh className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-8">
            <p>{error}</p>
            <button 
              onClick={refreshPosts}
              className="mt-2 text-red-700 underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Posts Grid */}
        {!loading && !error && posts && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <div 
                key={post._id} 
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <Link to={`/post/${post.slug}`}>
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                  />
                </Link>
                <div className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs">
                      {post.category}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Link to={`/post/${post.slug}`}>
                    <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white transition-colors duration-300 hover:text-teal-600 dark:hover:text-teal-400 line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {post.content.replace(/<[^>]*>/g, '').slice(0, 100)}...
                  </p>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
                    <Link 
                      to={`/post/${post.slug}`}
                      className="text-teal-600 dark:text-teal-400 font-medium flex items-center gap-1 transition-all duration-300 hover:text-teal-800 group"
                    >
                      Read more
                      <HiArrowRight className="transform transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <span>{post.user?.username || "Cricket Expert"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Posts State */}
        {!loading && !error && (!posts || posts.length === 0) && (
          <div className="text-center py-16">
            <h3 className="text-xl text-gray-600 dark:text-gray-400 mb-4">No posts available yet</h3>
            <Link
              to="/create-post"
              className="inline-block bg-teal-600 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:bg-teal-700"
            >
              Create the first post
            </Link>
          </div>
        )}

        {/* View All Link */}
        {!loading && !error && posts && posts.length > 0 && (
          <div className="text-center mt-12">
            <Link
              to="/search"
              className="inline-flex items-center gap-2 text-teal-600 dark:text-teal-400 text-lg font-medium transition-all duration-300 hover:text-teal-800 dark:hover:text-teal-300"
            >
              View all articles
              <HiArrowRight className="transform transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}