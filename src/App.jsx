import { Suspense, lazy, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/layout/Layout";
import LoadingSpinner from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

const Home = lazy(() => import("@/pages/Home"));
const Services = lazy(() => import("@/pages/Services"));
const Gallery = lazy(() => import("@/pages/Gallery"));
const Shop = lazy(() => import("@/pages/Shop"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const PaymentSuccess = lazy(() => import("@/pages/PaymentSuccess"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const AdminPanel = lazy(() => import("@/pages/AdminPanel"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 font-three text-gray-600 dark:text-gray-400">
        Loading...
      </p>
    </div>
  </div>
);

// Protected route component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <PageLoader />;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please login to access this page.
          </p>
        </div>
      </div>
    );
  }

  if (adminOnly && !isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Admin Access Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

// Page transition wrapper
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

function App() {
  const { theme } = useTheme();

  // Force update on theme changes
  useEffect(() => {
    const forceThemeUpdate = () => {
      // Force recalculation of all computed styles
      const elements = document.querySelectorAll("*");
      elements.forEach((element) => {
        if (element.style) {
          element.style.display = "none";
          element.offsetHeight; // Trigger reflow
          element.style.display = "";
        }
      });
    };

    // Run after theme change
    const timeoutId = setTimeout(forceThemeUpdate, 50);
    return () => clearTimeout(timeoutId);
  }, [theme]);

  return (
    <div className="App">
      <Layout>
        <AnimatePresence mode="wait">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route
                path="/"
                element={
                  <PageTransition>
                    <Home />
                  </PageTransition>
                }
              />
              <Route
                path="/services"
                element={
                  <PageTransition>
                    <Services />
                  </PageTransition>
                }
              />
              <Route
                path="/gallery"
                element={
                  <PageTransition>
                    <Gallery />
                  </PageTransition>
                }
              />
              <Route
                path="/shop"
                element={
                  <PageTransition>
                    <Shop />
                  </PageTransition>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <PageTransition>
                      <Checkout />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment/success"
                element={
                  <ProtectedRoute>
                    <PageTransition>
                      <PaymentSuccess />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/about"
                element={
                  <PageTransition>
                    <About />
                  </PageTransition>
                }
              />
              <Route
                path="/contact"
                element={
                  <PageTransition>
                    <Contact />
                  </PageTransition>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <PageTransition>
                      <Dashboard />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <PageTransition>
                      <AdminPanel />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="*"
                element={
                  <PageTransition>
                    <NotFound />
                  </PageTransition>
                }
              />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </Layout>
    </div>
  );
}

export default App;
