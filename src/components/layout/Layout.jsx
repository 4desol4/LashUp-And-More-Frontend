import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-charcoal-900 transition-colors duration-300">
      <Header />
      <main className="relative">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;