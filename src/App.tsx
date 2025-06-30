import Footer from './components/pages/Footer'
import Navbar from './components/pages/HomeNavbar'
import { Button } from './components/ui/button'
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
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-[url('/placeholder.svg?height=800&width=1600')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="container mx-auto relative z-10 flex flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl">
            Fresh From Farm to Your Table
          </h1>
          <p className="max-w-[700px] text-white md:text-xl">
            Discover premium quality agricultural products sourced directly from local farmers.
          </p>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Shop Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-black"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
      <FeaturedProducts />
      <Benefits />
      <Testimonials />
      <Footer />
    </div>
  )
}

export default App
