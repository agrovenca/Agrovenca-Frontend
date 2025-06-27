import Footer from './components/pages/Footer'
import Navbar from './components/pages/HomeNavbar'
import Benefits from './pages/home/Benefits'
import FeaturedProducts from './pages/home/FeaturedProducts'
import Testimonials from './pages/home/Testimonials'

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="container mx-auto flex-1">
        <p className="font-serif">Hola</p>
        <p className="font-decorative">Hola</p>
      </main>
      <FeaturedProducts />
      <Benefits />
      <Testimonials />
      <Footer />
    </div>
  )
}

export default App
