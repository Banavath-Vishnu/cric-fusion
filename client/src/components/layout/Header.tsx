import React, { useState, useEffect } from "react";
import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";
import { Link } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../redux/theme/themeSlice";
import { signoutSuccess } from "../../redux/user/userSlice";
import {
  Menu,
  X,
  ChevronDown,
  Home,
  TrendingUp,
  Newspaper,
  Archive,
  Users,
  ShoppingBag,
  Trophy,
  Plus,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useIsMobile } from "../../hooks/use-mobile";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Live Scores", href: "/scores", icon: TrendingUp },
  { name: "News", href: "/news", icon: Newspaper },
  { name: "Archives", href: "/archives", icon: Archive },
  { name: "Fantasy Cricket", href: "/fantasy", icon: Trophy },
  { name: "Community", href: "/community", icon: Users },
  { name: "NFT Market", href: "/marketplace", icon: ShoppingBag }
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignout = () => {
    dispatch(signoutSuccess());
  };

  return (
    <Navbar
      fluid
      className={cn(
        "sticky top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out backdrop-blur-md",
        isScrolled ? "bg-white/80 shadow-sm py-4" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="relative flex h-10 w-10 overflow-hidden rounded-full bg-gradient-to-r from-cricket-600 to-cricket-400">
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
              CF
            </div>
          </div>
          <span className="font-semibold text-xl tracking-tight">
            CricketFusion
          </span>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="hidden md:flex space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  "hover:bg-cricket-50 hover:text-cricket-700",
                  "focus:outline-none focus:ring-2 focus:ring-cricket-500 focus:ring-offset-2"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        )}

        {/* User Controls */}
        <div className="flex gap-2 md:order-2">
          {/* Theme Toggle */}
          <Button
            className="w-12 h-10 hidden sm:inline"
            color="gray"
            pill
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === "light" ? <FaSun /> : <FaMoon />}
          </Button>

          {/* "Create Post" Button - Visible only when logged in */}
          {currentUser && (
            <Link to="/create-post">
              <Button className="hidden md:flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Create Post</span>
              </Button>
            </Link>
          )}

          {/* User Profile Dropdown */}
          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={<Avatar alt="user" img={currentUser.profilePicture} rounded />}
            >
              <Dropdown.Header>
                <span className="block text-sm">@{currentUser.username}</span>
                <span className="block text-sm font-medium truncate">
                  {currentUser.email}
                </span>
              </Dropdown.Header>
              <Link to={"/dashboard?tab=profile"}>
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
            </Dropdown>
          ) : (
            <Link to="/sign-in">
              <Button gradientDuoTone="purpleToBlue" outline>
                Sign In
              </Button>
            </Link>
          )}

          {/* Mobile Menu Toggle inside Navbar */}
          <Button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white w-full py-4 shadow-md absolute top-full left-0 z-50">
          <nav className="space-y-2 px-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-cricket-50 hover:text-cricket-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          
          {/* Mobile "Create Post" Button */}
          {currentUser && (
            <div className="px-4 mt-2">
              <Link to="/create-post">
                <Button className="w-full flex items-center justify-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Create Post</span>
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Authentication Links */}
          <div className="px-4 mt-4 space-y-2">
            {!currentUser ? (
              <>
                <Link to="/sign-in">
                  <Button className="w-full text-center">Log in</Button>
                </Link>
                <Link to="/sign-up">
                  <Button className="w-full text-center bg-cricket-600 hover:bg-cricket-700">
                    Sign up
                  </Button>
                </Link>
              </>
            ) : (
              <Button className="w-full text-center bg-red-500" onClick={handleSignout}>
                Sign out
              </Button>
            )}
          </div>
        </div>
      )}
    </Navbar>
  );
};

export default Header;
