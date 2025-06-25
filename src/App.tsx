import Footer from './components/pages/Footer'
import Navbar from './components/pages/HomeNavbar'

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="container mx-auto flex-1">
        <p className="font-serif">Hola</p>
        <p className="font-decorative">Hola</p>
      </main>
      <Footer />
    </div>
  )
}

export default App
