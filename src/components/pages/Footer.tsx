import { Link } from 'react-router-dom'
import { ModeToggle } from '../mode-toggle'
import ContactSocials from '@/pages/contacts/Socials'

function Footer() {
  return (
    <>
      {/* Footer */}
      <footer className="w-full border-t py-6 md:py-12">
        <div className="container flex flex-col gap-8 px-8 md:flex-row md:gap-12 md:mx-auto">
          <div className="flex flex-col gap-2 md:w-1/4">
            <figure className="w-32 overflow-hidden">
              <Link to={'/'} className="flex items-center gap-2">
                <img src="/logo.webp" alt="Agrovenca Logo" className="w-full h-full" />
              </Link>
            </figure>
            <p className="text-sm text-muted-foreground">
              La mejor tienda de productos agrícolas y ganaderos de Venezuela.
            </p>
            <div className="hidden md:block">
              <ModeToggle />
            </div>
          </div>
          <div className="grid flex-1 sm:grid-cols-2 gap-8 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <h3 className="font-medium font-sans">Comprar</h3>
              <nav className="flex flex-col gap-2">
                <Link to="/products" className="text-sm text-muted-foreground hover:text-primary">
                  Todos los productos
                </Link>
              </nav>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-medium font-sans">Compañia</h3>
              <nav className="flex flex-col gap-2">
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary">
                  Acerca de nosotros
                </Link>
                <Link to="/team" className="text-sm text-muted-foreground hover:text-primary">
                  Nuestro equipo
                </Link>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">
                  Contacto
                </Link>
              </nav>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-medium font-sans">Soporte</h3>
              <nav className="flex flex-col gap-2">
                <Link to="/faqs" className="text-sm text-muted-foreground hover:text-primary">
                  Preguntas frecuentes
                </Link>
                <Link
                  to="/shippingPolicy"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Política de envíos
                </Link>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">
                  Términos y condiciones
                </Link>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                  Política de privacidad
                </Link>
              </nav>
            </div>
          </div>
        </div>
        <div className="container mt-8 border-t pt-6 mx-auto">
          <p className="text-center text-sm text-muted-foreground flex gap-2 justify-center flex-wrap">
            <span>
              © 2023 - {new Date().getFullYear()} Agrovenca. Todos los derechos reservados.
            </span>
            <span>
              Desarrollado por{' '}
              <a
                href="https://junior-dev.vercel.app/"
                target="_blank"
                className="transition text-blue-600 dark:text-blue-500 hover:underline"
              >
                Junior Ruiz
              </a>
            </span>
          </p>
          <div className="flex justify-center mt-4">
            <ContactSocials size={6} />
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
