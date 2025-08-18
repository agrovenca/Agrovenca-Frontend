import Footer from './components/pages/Footer'
import Navbar from './components/pages/HomeNavbar'
import Benefits from './pages/home/Benefits'
import CategoryCarrousel from './pages/home/CategoryCarrousel'
import FeaturedProducts from './pages/home/FeaturedProducts'
import Testimonials from './pages/home/Testimonials'
import ActiveBannerDesktop from '@/assets/images/banners/Desktop.webp'
import ActiveBannerMobile from '@/assets/images/banners/Mobile.webp'

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {/* Hero Section */}
      <picture>
        <source media="(max-width: 768px)" srcSet={ActiveBannerMobile} />
        <source media="(min-width: 769px)" srcSet={ActiveBannerDesktop} />
        <img
          src={ActiveBannerDesktop}
          alt="Banner publicitario"
          className="w-full h-auto"
          loading="lazy"
        />
      </picture>

      {/* Categories Section */}
      <CategoryCarrousel />

      {/* Featured Products Section */}
      <FeaturedProducts />

      {/* Benefits Section */}
      <Benefits />

      {/* Testimonials Section */}
      <Testimonials />
      <Footer />
    </div>
  )
}

export default App
