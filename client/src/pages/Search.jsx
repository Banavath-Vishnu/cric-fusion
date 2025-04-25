import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { Search as SearchIcon } from 'lucide-react';
import { HiArrowRight } from 'react-icons/hi';

export default function Search() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const location = useLocation();

  useEffect(() => {
    // Extract search term from URL if present
    const urlParams = new URLSearchParams(location.search);
    const searchQuery = urlParams.get('searchTerm');
    const category = urlParams.get('category');
    
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
    
    if (category) {
      setSelectedCategory(category);
    }

    fetchPosts();
    fetchCategories();
  }, [location.search]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    const urlParams = new URLSearchParams(location.search);
    
    try {
      const res = await fetch(`/api/post/getposts?${urlParams}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
        setShowMore(data.posts.length === 9);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowMore = async () => {
    setLoadingMore(true);
    const numberOfPosts = posts.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', numberOfPosts);
    
    try {
      const res = await fetch(`/api/post/getposts?${urlParams}`);
      if (res.ok) {
        const data = await res.json();
        setPosts([...posts, ...data.posts]);
        setShowMore(data.posts.length === 9);
      }
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    
    if (searchTerm) {
      urlParams.set('searchTerm', searchTerm);
    }
    
    if (selectedCategory) {
      urlParams.set('category', selectedCategory);
    }
    
    window.location.href = `/search?${urlParams.toString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 bg-white shadow rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      {/* Search header */}
      <div className="bg-white shadow rounded-lg p-6 mb-8 mt-5">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Search Blog Posts</h1>
        
        <form onSubmit={handleSearch} className="space-y-4 md:space-y-0 md:flex md:gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            />
          </div>
          
          <div className="md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <button
            type="submit"
            className="w-full md:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Search
          </button>
        </form>
      </div>

      {/* Search results */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {searchTerm || selectedCategory ? 'Search Results' : 'Recent Posts'}
          </h2>
          {(searchTerm || selectedCategory) && (
            <p className="text-sm text-gray-500 mt-1">
              {searchTerm && `Searching for "${searchTerm}"`}
              {searchTerm && selectedCategory && ' in '}
              {selectedCategory && `category "${selectedCategory}"`}
            </p>
          )}
        </div>

        <div className="px-6 py-4">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 shadow-lg"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-xl text-gray-500">No posts found.</p>
              <p className="text-gray-400 mt-2">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="flex gap-4 ">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* Show more button */}
        {showMore && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleShowMore}
              disabled={loadingMore}
              className="w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex items-center justify-center"
            >
              {loadingMore ? (
                <>
                  <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-teal-500 rounded-full"></span>
                  Loading more...
                </>
              ) : (
                'Show More Posts'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}