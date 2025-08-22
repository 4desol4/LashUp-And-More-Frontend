import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiMenu,
  HiX,
  HiShoppingCart,
  HiUser,
  HiLogout,
  HiViewGrid,
  HiCog,
} from "react-icons/hi";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Button from "@/components/ui/Button";
import { cn } from "@/utils/helpers";
import AuthModal from "@/components/auth/AuthModal";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const location = useLocation();
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Gallery", href: "/gallery" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 1280) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setShowUserMenu(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-menu-container")) {
        setShowUserMenu(false);
      }
      if (!event.target.closest(".mobile-menu-container")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  
  const isMobileLayout = windowWidth <= 1024;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-lg shadow-lg border-b border-gray-200 dark:border-charcoal-700"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 md:h-20">
         
          <Link
            to="/"
            className="flex items-center space-x-2 group flex-shrink-0"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl md:text-3xl font-four font-bold text-gradient"
            >
              LashUp And More
            </motion.div>
          </Link>

          
          <nav className="hidden lg:flex items-center font-three space-x-6 2xl:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "relative px-2 2xl:px-3 py-2 font-medium text-base 2xl:text-lg transition-colors duration-200 whitespace-nowrap",
                  location.pathname === item.href
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                )}
              >
                {item.name}
                {location.pathname === item.href && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-600 to-burgundy-600"
                  />
                )}
              </Link>
            ))}
          </nav>

          
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 font-three text-sm md:text-base">
          
            <div className="flex-shrink-0">
              <ThemeToggle />
            </div>

            
            <Link
              to="/shop"
              className="relative p-1.5 sm:p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex-shrink-0"
            >
              <HiShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center font-medium"
                >
                  {itemCount > 99 ? "99+" : itemCount}
                </motion.span>
              )}
            </Link>

           
            {isAuthenticated ? (
              <div className="relative user-menu-container flex-shrink-0">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-charcoal-800 transition-colors"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-primary-600 to-burgundy-600 rounded-full flex items-center justify-center text-white font-medium text-xs sm:text-sm">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  {windowWidth >= 640 && windowWidth > 1280 && (
                    <span className="hidden sm:block font-medium text-gray-700 dark:text-gray-300 truncate max-w-20 md:max-w-none">
                      {user?.name}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-44 sm:w-48 bg-white dark:bg-charcoal-800 rounded-lg shadow-lg border border-gray-200 dark:border-charcoal-700 py-2 z-50"
                    >
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-charcoal-700"
                      >
                        <HiUser className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-charcoal-700"
                        >
                          <HiCog className="w-4 h-4" />
                          <span>Admin Panel</span>
                        </Link>
                      )}

                      <hr className="my-2 border-gray-200 dark:border-charcoal-600" />

                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
                      >
                        <HiLogout className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              
              <div className="hidden lg:flex items-center text-sm md:text-base space-x-2 md:space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-2 md:px-4 py-1.5 md:py-2 text-xs sm:text-sm"
                  onClick={() => {
                    setAuthMode("login");
                    setShowAuthModal(true);
                  }}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  className="px-2 md:px-4 py-1.5 md:py-2 text-xs sm:text-sm whitespace-nowrap"
                  onClick={() => {
                    setAuthMode("register");
                    setShowAuthModal(true);
                  }}
                >
                  Get Started
                </Button>
              </div>
            )}

            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-1.5 sm:p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mobile-menu-container flex-shrink-0"
            >
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? (
                  <HiX className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <HiMenu className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </motion.div>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t font-three border-gray-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-900 mobile-menu-container"
            >
              <div className="py-3 sm:py-4 space-y-1 sm:space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "block px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-lg mx-2 transition-colors",
                      location.pathname === item.href
                        ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-charcoal-800"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}

                
                {!isAuthenticated && (
                  <>
                    <hr className="my-3 border-gray-200 dark:border-charcoal-600 mx-2" />
                    <div className="px-3 sm:px-4 py-2 space-y-2 font-three">
                      <Button
                        variant="ghost"
                        className="w-full justify-center text-sm sm:text-base py-2.5"
                        onClick={() => {
                          setAuthMode("login");
                          setShowAuthModal(true);
                        }}
                      >
                        Sign In
                      </Button>
                      <Button
                        className="w-full justify-center text-sm sm:text-base py-2.5"
                        onClick={() => {
                          setAuthMode("register");
                          setShowAuthModal(true);
                        }}
                      >
                        Get Started
                      </Button>
                    </div>
                  </>
                )}

                
                {isAuthenticated && (
                  <>
                    <hr className="my-3 border-gray-200 dark:border-charcoal-600 mx-2" />
                    <div className="px-3 sm:px-4 py-2">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-burgundy-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                          {user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {user?.name}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <Link
                          to="/dashboard"
                          className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-charcoal-700 rounded-lg"
                        >
                          <HiUser className="w-4 h-4" />
                          <span>Dashboard</span>
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-charcoal-700 rounded-lg"
                          >
                            <HiCog className="w-4 h-4" />
                            <span>Admin Panel</span>
                          </Link>
                        )}

                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left rounded-lg"
                        >
                          <HiLogout className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode={authMode}
        />
      </div>
    </motion.header>
  );
};

export default Header;
