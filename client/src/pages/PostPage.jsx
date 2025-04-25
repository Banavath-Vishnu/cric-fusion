import { Button, Spinner, Modal, Avatar } from 'flowbite-react';
import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';
import { useSelector } from 'react-redux';
import { HiThumbUp, HiThumbDown, HiOutlineShare, HiOutlineBookmark, HiClock } from 'react-icons/hi';
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

export default function PostPage() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showShareIcons, setShowShareIcons] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false); 
  const [showModal, setShowModal] = useState(false);  
  const [likesDislikesDetails, setLikesDislikesDetails] = useState(null);
  const [tableOfContents, setTableOfContents] = useState([]);

  // Track reading progress
  useEffect(() => {
    const scrollListener = () => {
      if (!contentRef.current) return;
      
      const element = contentRef.current;
      const totalHeight = element.clientHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      if (totalHeight - windowHeight > 0) {
        const progress = (scrollTop / (totalHeight - windowHeight)) * 100;
        setReadingProgress(Math.min(Math.max(progress, 0), 100));
      }
    };

    window.addEventListener('scroll', scrollListener);
    return () => window.removeEventListener('scroll', scrollListener);
  }, [post]);
  
  // Extract headings for table of contents
  useEffect(() => {
    if (post && contentRef.current) {
      const headings = contentRef.current.querySelectorAll('h2, h3');
      const toc = Array.from(headings).map((heading, index) => {
        // Add IDs to headings if they don't have
        if (!heading.id) {
          heading.id = `heading-${index}`;
        }
        return {
          id: heading.id,
          text: heading.textContent,
          level: heading.tagName === 'H2' ? 2 : 3
        };
      });
      setTableOfContents(toc);
    }
  }, [post]);

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLikes(data.posts[0].likes.length);
          setDislikes(data.posts[0].dislikes.length);
          setUserLiked(data.posts[0].likes.includes(currentUser?._id)); 
          setUserDisliked(data.posts[0].dislikes.includes(currentUser?._id));
          setLoading(false);
          setError(false);
          
          // Fetch recent posts
          fetchRecentPosts(data.posts[0].category, data.posts[0]._id);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug, currentUser]);

  const fetchRecentPosts = async (category, currentPostId) => {
    try {
      const res = await fetch(`/api/post/getposts?category=${category}&limit=3`);
      const data = await res.json();
      if (res.ok) {
        // Filter out the current post from recent posts
        const filteredPosts = data.posts.filter(post => post._id !== currentPostId);
        setRecentPosts(filteredPosts.slice(0, 3));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleLike = async () => {
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      const res = await fetch(`/api/post/like/${post._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (res.ok) {
        setLikes(data.likes.length);
        setDislikes(data.dislikes.length);
        setUserLiked(!userLiked); 
        if (userDisliked) setUserDisliked(false); 
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDislike = async () => {
    if (!currentUser) {
      navigate('/sign-in');
      return;
    }
    try {
      const res = await fetch(`/api/post/dislike/${post._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (res.ok) {
        setLikes(data.likes.length);
        setDislikes(data.dislikes.length);
        setUserDisliked(!userDisliked);
        if (userLiked) setUserLiked(false); 
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchLikesDislikesDetails = async () => {
    try {
      const res = await fetch(`/api/post/likes-dislikes/${post._id}`);
      const data = await res.json();
      if (res.ok) {
        setLikesDislikesDetails(data);
        setShowModal(true); 
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleShare = () => {
    setShowShareIcons(!showShareIcons);
  };

  const handleSavePost = () => {
    if (!currentUser) {
      navigate('/sign-in');
      return;
    }
    setIsSaved(!isSaved);
    // Implement actual save functionality here
  };

  const shareToSocial = (platform) => {
    if (!post) return;
    
    const url = window.location.href;
    const title = post.title;
    let shareUrl = '';
    
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
      default:
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const scrollToHeading = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  };

  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );

  if (error)
    return (
      <div className='flex justify-center items-center min-h-screen flex-col'>
        <p className='text-2xl font-bold mb-4 text-red-500'>Something went wrong</p>
        <Button onClick={() => navigate('/')}>Go back to home</Button>
      </div>
    );

  return (
    <main className='bg-slate-50 dark:bg-gray-900 min-h-screen'>
      {/* Reading progress bar */}
      <div 
        className='fixed top-0 left-0 z-50 h-1 bg-indigo-600' 
        style={{ width: `${readingProgress}%` }}
      />
      
      <div className='max-w-6xl mx-auto px-4 py-6 lg:py-12'>
        {/* Header section */}
        <div className='max-w-3xl mx-auto mb-8'>
          <Link
            to={`/search?category=${post && post.category}`}
            className='inline-block mb-4'
          >
            <Button color='gray' pill size='xs' className='bg-opacity-50 hover:bg-opacity-70'>
              {post && post.category}
            </Button>
          </Link>
          
          <h1 className='text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4 dark:text-white'>
            {post && post.title}
          </h1>
          
          <div className='flex items-center space-x-4 mb-4'>
            <div className='flex-shrink-0'>
              <Avatar rounded size="md" />
            </div>
            <div>
              <p className='font-medium dark:text-white'>Author Name</p>
              <div className='flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400'>
                <span>{post && new Date(post.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
                <span>•</span>
                <span className='flex items-center'>
                  <HiClock className='mr-1' />
                  {post && (post.content.length / 1000).toFixed(0)} min read
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Featured image */}
        <div className='w-full max-w-5xl mx-auto mb-10 rounded-lg overflow-hidden shadow-lg'>
          <img
            src={post && post.image}
            alt={post && post.title}
            className='w-full h-auto max-h-[600px] object-cover'
          />
        </div>
        
        <div className='flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto'>
          {/* Social sharing sidebar - visible on desktop */}
          <div className='hidden lg:flex flex-col items-center sticky top-20 h-fit space-y-4 w-12'>
            <Button pill color={userLiked ? 'success' : 'gray'} onClick={handleLike} size='sm' className='w-10 h-10 flex items-center justify-center'>
              <HiThumbUp className='w-5 h-5' />
            </Button>
            <span className='text-sm font-medium'>{likes}</span>
            
            <Button pill color={userDisliked ? 'failure' : 'gray'} onClick={handleDislike} size='sm' className='w-10 h-10 flex items-center justify-center'>
              <HiThumbDown className='w-5 h-5' />
            </Button>
            <span className='text-sm font-medium'>{dislikes}</span>
            
            <div className='relative'>
              <Button pill color='gray' onClick={handleShare} size='sm' className='w-10 h-10 flex items-center justify-center'>
                <HiOutlineShare className='w-5 h-5' />
              </Button>
              
              {showShareIcons && (
                <div className='absolute left-12 top-0 bg-white dark:bg-gray-800 shadow-md rounded-lg p-2 flex flex-col space-y-2'>
                  <Button color='light' size='xs' onClick={() => shareToSocial('facebook')}>
                    <FaFacebook className='w-4 h-4 text-blue-600' />
                  </Button>
                  <Button color='light' size='xs' onClick={() => shareToSocial('twitter')}>
                    <FaTwitter className='w-4 h-4 text-blue-400' />
                  </Button>
                  <Button color='light' size='xs' onClick={() => shareToSocial('linkedin')}>
                    <FaLinkedin className='w-4 h-4 text-blue-800' />
                  </Button>
                  <Button color='light' size='xs' onClick={() => shareToSocial('whatsapp')}>
                    <FaWhatsapp className='w-4 h-4 text-green-500' />
                  </Button>
                </div>
              )}
            </div>
            
            <Button pill color={isSaved ? 'warning' : 'gray'} onClick={handleSavePost} size='sm' className='w-10 h-10 flex items-center justify-center'>
              <HiOutlineBookmark className='w-5 h-5' />
            </Button>
          </div>
          
          {/* Main content */}
          <div className='lg:flex-1 w-full max-w-3xl mx-auto'>
            {/* Table of contents - desktop */}
            {tableOfContents.length > 0 && (
              <div className='hidden lg:block bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-8 shadow-sm'>
                <h3 className='font-bold text-lg mb-2 dark:text-white'>Table of Contents</h3>
                <ul className='space-y-1'>
                  {tableOfContents.map((heading) => (
                    <li 
                      key={heading.id} 
                      className={`cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 ${heading.level === 3 ? 'ml-4' : ''}`}
                      onClick={() => scrollToHeading(heading.id)}
                    >
                      {heading.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Post content */}
            <div 
              ref={contentRef}
              className='prose prose-lg max-w-none dark:prose-invert prose-headings:font-serif prose-headings:font-bold prose-a:text-indigo-600 prose-img:rounded-lg prose-img:mx-auto mb-8'
              dangerouslySetInnerHTML={{ __html: post && post.content }}
            ></div>
            
            {/* Mobile interaction bar */}
            <div className='lg:hidden flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-8'>
              <div className='flex items-center space-x-2'>
                <Button pill color={userLiked ? 'success' : 'gray'} onClick={handleLike} size='xs'>
                  <HiThumbUp className='mr-1' /> {likes}
                </Button>
                <Button pill color={userDisliked ? 'failure' : 'gray'} onClick={handleDislike} size='xs'>
                  <HiThumbDown className='mr-1' /> {dislikes}
                </Button>
              </div>
              <div className='flex items-center space-x-2'>
                <Button pill color='gray' onClick={handleShare} size='xs'>
                  <HiOutlineShare className='mr-1' /> Share
                </Button>
                <Button pill color={isSaved ? 'warning' : 'gray'} onClick={handleSavePost} size='xs'>
                  <HiOutlineBookmark className='mr-1' /> Save
                </Button>
              </div>
            </div>
            
            {/* Mobile share options */}
            {showShareIcons && (
              <div className='lg:hidden flex justify-center space-x-2 mb-8'>
                <Button color='light' size='sm' onClick={() => shareToSocial('facebook')}>
                  <FaFacebook className='w-4 h-4 text-blue-600' />
                </Button>
                <Button color='light' size='sm' onClick={() => shareToSocial('twitter')}>
                  <FaTwitter className='w-4 h-4 text-blue-400' />
                </Button>
                <Button color='light' size='sm' onClick={() => shareToSocial('linkedin')}>
                  <FaLinkedin className='w-4 h-4 text-blue-800' />
                </Button>
                <Button color='light' size='sm' onClick={() => shareToSocial('whatsapp')}>
                  <FaWhatsapp className='w-4 h-4 text-green-500' />
                </Button>
              </div>
            )}
            
            {/* Author info section */}
            <div className='flex items-start space-x-4 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-8 shadow-md'>
              <Avatar rounded size="lg" />
              <div>
                <h3 className='font-bold text-lg mb-1 dark:text-white'>About the Author</h3>
                <p className='text-gray-600 dark:text-gray-300 mb-2 text-sm'>Cricket enthusiast and sports analyst with over 10 years of experience covering major tournaments.</p>
                <div className='flex space-x-2'>
                  <Button size='xs' color='light'>
                    <span className='text-xs'>Follow</span>
                  </Button>
                  <Button size='xs' color='light'>
                    <span className='text-xs'>View all posts</span>
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Comments section */}
            {post && <CommentSection postId={post._id} />}
          </div>
        </div>
        
        {/* Recent posts section */}
        <div className='mt-12 border-t border-gray-200 dark:border-gray-700 pt-8'>
          <h2 className='text-2xl font-serif font-bold text-center mb-8 dark:text-white'>You might also like</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {recentPosts && recentPosts.length > 0 ? (
              recentPosts.map((post) => <PostCard key={post._id} post={post} />)
            ) : (
              <p className='text-center col-span-3 text-gray-500 dark:text-gray-400'>No related posts found</p>
            )}
          </div>
        </div>
      </div>

      {/* Likes/Dislikes Modal for Admin */}
      <Modal show={showModal} onClose={() => setShowModal(false)} size="lg">
        <Modal.Header>
          Engagement Details
        </Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Liked Users */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-green-600">Users who liked: {likesDislikesDetails?.likes?.length || 0}</h3>
              {likesDislikesDetails?.likes?.length > 0 ? (
                <ul className="space-y-4 max-h-96 overflow-y-auto">
                  {likesDislikesDetails.likes.map((user) => (
                    <li key={user._id} className="flex items-center space-x-4 p-2 bg-green-50 rounded-lg">
                      <Avatar rounded size="sm" />
                      <div>
                        <p className="font-medium">{user.username}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No likes yet</p>
              )}
            </div>

            {/* Disliked Users */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-red-600">Users who disliked: {likesDislikesDetails?.dislikes?.length || 0}</h3>
              {likesDislikesDetails?.dislikes?.length > 0 ? (
                <ul className="space-y-4 max-h-96 overflow-y-auto">
                  {likesDislikesDetails.dislikes.map((user) => (
                    <li key={user._id} className="flex items-center space-x-4 p-2 bg-red-50 rounded-lg">
                      <Avatar rounded size="sm" />
                      <div>
                        <p className="font-medium">{user.username}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No dislikes yet</p>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
}
