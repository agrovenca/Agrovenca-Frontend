import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowLeftIcon } from 'lucide-react'
import { Link } from 'react-router'

function TermsPage() {
  return (
    <section className="container mx-auto my-12 px-4 max-w-4xl">
      <Button asChild size={'icon'} variant={'ghost'} className="rounded-full mb-2 border">
        <Link to={'/'}>
          <ArrowLeftIcon size={22} />
        </Link>
      </Button>
      <h1 className="text-3xl font-bold mb-4">Términos y Condiciones</h1>
      <p className="mb-2 font-serif">
        Bienvenido a <strong>www.agrovenca.com</strong>. Al utilizar nuestro sitio web y realizar
        compras en nuestra tienda online, aceptas los siguientes términos y condiciones.
      </p>

      <Separator />

      <h2 className="text-xl font-semibold mt-4 mb-2">1. Identificación</h2>
      <p className="mb-2 font-serif">
        El sitio es operado por Agro Alimentos Venezuela C.A. (“Agrovenca”), con sede en Quíbor,
        Estado Lara, Venezuela.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">2. Uso del sitio</h2>
      <p className="mb-2 font-serif">
        El uso del sitio implica la aceptación de estos términos y la veracidad de los datos
        proporcionados por el cliente.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">3. Productos y disponibilidad</h2>
      <p className="mb-2 font-serif">
        Vendemos insumos y productos agropecuarios en Venezuela. Precios y disponibilidad pueden
        cambiar sin previo aviso.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">4. Pedidos y pagos</h2>
      <p className="mb-2 font-serif">
        Solo aceptamos transferencias bancarias. El pedido se procesa una vez confirmada la
        transferencia.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">5. Envíos</h2>
      <p className="mb-2 font-serif">
        Realizamos envíos a todo Venezuela. Tiempos de entrega pueden variar según zona y
        disponibilidad del servicio de mensajería.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">6. Devoluciones y reembolsos</h2>
      <p className="mb-2 font-serif">
        No aceptamos devoluciones ni reembolsos, salvo productos defectuosos comprobables.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">7. Propiedad intelectual</h2>
      <p className="mb-2 font-serif">
        Todo el contenido del sitio es propiedad de Agrovenca y está protegido por la ley. No se
        puede usar sin autorización.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">8. Limitación de responsabilidad</h2>
      <p className="mb-2 font-serif">
        Agrovenca no se responsabiliza por daños por mal uso de productos, interrupciones del sitio,
        o problemas de conexión de usuarios o terceros.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">9. Modificaciones</h2>
      <p className="mb-2 font-serif">
        Podemos modificar estos términos en cualquier momento, y las modificaciones entran en vigor
        desde su publicación.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">10. Contacto</h2>
      <p className="mb-1 font-serif">Correo: support@agrovenca.com</p>
      <p className="mb-1 font-serif">Teléfono: +58 412-2647923</p>
      <p className="mb-1 font-serif">Sitio web: www.agrovenca.com</p>

      <Separator className="my-4" />

      <section className="flex justify-center">
        <small>
          Última actualización: {new Date('2025-09-21T02:38:41.868Z').toLocaleDateString('es-VE')}
        </small>
      </section>
    </section>
  )
}

export default TermsPage
