import Header from "./Header";
import Footer from "./Footer";
import { useAuth } from "../../context/AuthContext";
import AuthModal from "../auth/AuthModal";

const Layout = ({ children }) => {
  const { authModalOpen, closeAuthModal, authModalMode } = useAuth();
  return (
    <>
      <div className="min-h-screen bg-white dark:bg-charcoal-900 transition-colors duration-300">
        <Header />
        <main className="relative">{children}</main>
        <Footer />
      </div>
      <AuthModal
        isOpen={authModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
      />
    </>
  );
};

export default Layout;
