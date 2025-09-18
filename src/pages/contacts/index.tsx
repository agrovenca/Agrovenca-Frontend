import Footer from '@/components/pages/Footer'
import Navbar from '@/components/pages/HomeNavbar'

import ContactForm from './Form'
import ContactInfo from './Info'
import ContactMap from './Map'

function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <section className="my-12 min-h-screen mx-2">
        <div className="mx-auto max-w-xl">
          <h1 className="text-4xl font-bold text-center">Contáctanos</h1>
          <p className="mt-4 text-center font-serif text-gray-500">
            Estamos aquí para ayudarte. Contáctanos para cualquier consulta sobre nuestros productos
            agrícolas y servicios especializados.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-5 gap-8 max-w-7xl mx-auto my-8">
          <ContactForm />
          <ContactInfo />
        </div>
        <ContactMap />
      </section>
      <Footer />
    </div>
  )
}

export default ContactPage
