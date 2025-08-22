import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import BackToTop from "@/components/ui/BackToTop";
import LoadingSpinner from "../components/ui/Spinner";
import SnowfallEffect from '@/components/animations/SnowfallEffect';
const ServicesSection = lazy(() => import("@/components/home/ServicesSection"));
const ProductsSection = lazy(() => import("@/components/home/ProductsSection"));
const GalleryPreview = lazy(() => import("@/components/home/GalleryPreview"));
const TestimonialsSection = lazy(() =>
  import("@/components/home/TestimonialsSection")
);
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

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-x-hidden"
    >
      {/* Hero Section */}
      {/* Snowfall Effect */}
      <SnowfallEffect count={40} />
      <HeroSection />

      {/* Services Section */}
      <Suspense fallback={<PageLoader />}>
        <ServicesSection />
      </Suspense>

      {/* About Section */}

      <AboutSection />

      <Suspense fallback={<PageLoader />}>
        <ProductsSection />
      </Suspense>

      <Suspense fallback={<PageLoader />}>
        <GalleryPreview />
      </Suspense>

      <Suspense fallback={<PageLoader />}>
        <TestimonialsSection />
      </Suspense>

      <BackToTop />
    </motion.div>
  );
};

export default Home;
