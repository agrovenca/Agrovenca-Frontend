import Footer from '@/components/pages/Footer'
import Navbar from '@/components/pages/HomeNavbar'

function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <section className="my-12 min-h-screen mx-2">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-foreground mb-6 text-balance">Sobre Nosotros</h1>
            <p className="text-xl text-muted-foreground text-pretty">
              Comprometidos con el campo y su gente
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-16">
            {/* First Section */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Nuestra Historia</h2>
                <p className="font-serif text-muted-foreground leading-relaxed">
                  AGROVENCA nació con la visión de convertirse en un aliado estratégico para los
                  productores agropecuarios de Venezuela, especialmente en la región de Quíbor –
                  Estado Lara, donde tenemos nuestras raíces. Desde nuestros primeros pasos, nos
                  hemos dedicado a la venta de productos e insumos agropecuarios, atendiendo
                  directamente en nuestra tienda física ubicada en la Av. 5 entre calles 12 y 13, y
                  extendiendo nuestra presencia a nivel nacional a través de canales digitales como
                  WhatsApp, Facebook, Instagram y Mercado Libre.
                </p>
                <p className="font-serif text-muted-foreground leading-relaxed">
                  Con el paso del tiempo, hemos construido una reputación basada en la cercanía, la
                  atención personalizada y la confianza, consolidándonos como una empresa que
                  entiende y responde a las necesidades del productor en cada etapa de su labor.
                </p>
              </div>
              <div className="relative h-80 rounded-lg overflow-hidden">
                <img
                  src="/familia-de-agricultores-trabajando-en-el-campo-con.jpg"
                  alt="Familia de agricultores trabajando en el campo"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Second Section */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative h-80 rounded-lg overflow-hidden md:order-1">
                <img
                  src="/almac-n-moderno-con-productos-agr-colas-organizado.jpg"
                  alt="Almacén con productos agrícolas frescos"
                  className="object-cover"
                />
              </div>
              <div className="space-y-6 md:order-2">
                <h2 className="text-2xl font-semibold text-foreground">Nuestro Compromiso</h2>
                <p className="font-serif text-muted-foreground leading-relaxed">
                  En AGROVENCA, creemos firmemente que el éxito del campo es también el éxito de
                  nuestra comunidad. Por eso, hemos desarrollado un catálogo amplio y diverso que
                  abarca desde productos de identificación y control ganadero, jeringas y material
                  médico, hasta medicinas veterinarias, equipos agroindustriales, insumos para
                  diferentes especies animales, sistemas de cerco eléctrico, radios de comunicación
                  y elementos de seguridad laboral.
                </p>
                <p className="font-serif text-muted-foreground leading-relaxed">
                  Cada producto ha sido seleccionado cuidadosamente para garantizar su calidad,
                  confiabilidad y utilidad en el día a día del productor. Nuestro compromiso es
                  acompañar con soluciones prácticas, modernas y efectivas que impulsen la
                  productividad, protejan el bienestar animal y fortalezcan el trabajo agropecuario
                  en Venezuela.
                </p>
              </div>
            </div>

            {/* Third Section */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Mirando al Futuro</h2>
                <p className="font-serif text-muted-foreground leading-relaxed">
                  Sabemos que los retos del campo requieren innovación y adaptación constante. Por
                  eso, en AGROVENCA nos proyectamos hacia el futuro con la misión de seguir
                  creciendo junto a los productores, expandiendo nuestra cobertura, ampliando
                  nuestro catálogo y ofreciendo siempre nuevas alternativas que respondan a las
                  exigencias del mercado agropecuario moderno.
                </p>
                <p className="font-serif text-muted-foreground leading-relaxed">
                  Continuaremos fortaleciendo nuestras alianzas con empresas de envíos como MRW y
                  ZOOM para asegurar que nuestros clientes reciban sus pedidos de manera rápida,
                  segura y sin costos adicionales. Además, esta página web oficial será un punto
                  clave para explorar promociones exclusivas, mantenerse informado con las últimas
                  novedades y acceder a un servicio cada vez más cercano y eficiente. Nuestro
                  objetivo es ser más que una tienda, convertirnos en un socio confiable y duradero
                  para el futuro del agro en Venezuela.
                </p>
              </div>
              <div className="relative h-80 rounded-lg overflow-hidden">
                <img
                  src="/tecnolog-a-agr-cola-moderna--drones-sobre-cultivos.jpg"
                  alt="Tecnología agrícola moderna"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default AboutPage
