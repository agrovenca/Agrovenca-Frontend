import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowLeftIcon } from 'lucide-react'
import { Link } from 'react-router'

function PolicyPage() {
  return (
    <section className="container mx-auto my-12 px-4 max-w-4xl">
      <Button asChild size={'icon'} variant={'ghost'} className="rounded-full mb-2 border">
        <Link to={'/'}>
          <ArrowLeftIcon size={22} />
        </Link>
      </Button>
      <h1 className="text-3xl font-bold mb-4">Política de Privacidad</h1>
      <p className="mb-2 font-serif">
        En <strong>Agro Alimentos Venezuela C.A. (“Agrovenca”)</strong>, respetamos la privacidad de
        nuestros usuarios y clientes. Esta Política de Privacidad explica cómo recopilamos, usamos y
        protegemos tu información al utilizar nuestro sitio web <strong>www.agrovenca.com</strong> y
        nuestra tienda física ubicada en Quíbor, Estado Lara, Venezuela.
      </p>
      <Separator />
      <h2 className="text-xl font-semibold mt-4 mb-2">1. Información que recopilamos</h2>
      <ul className="list-disc list-inside mb-2 font-serif">
        <li>Nombre completo</li>
        <li>Correo electrónico</li>
        <li>Número de teléfono</li>
        <li>Dirección de envío</li>
        <li>Información de pago (transferencias bancarias)</li>
        <li>Información técnica básica (cookies, dirección IP, navegador)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4 mb-2">2. Uso de la información</h2>
      <p className="mb-2 font-serif">
        Utilizamos tu información para procesar pedidos, enviarte notificaciones, mejorar la
        seguridad del sitio y ofrecer soporte al cliente.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">3. Uso de cookies y tecnologías</h2>
      <p className="mb-2 font-serif">
        Usamos cookies y herramientas como JWT y Cloudflare para proteger tus datos, recordar
        preferencias y mejorar tu experiencia. Puedes desactivarlas en tu navegador, aunque algunas
        funciones podrían no funcionar.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">4. Compartición de datos</h2>
      <p className="mb-2 font-serif">No compartimos ni vendemos tu información a terceros.</p>

      <h2 className="text-xl font-semibold mt-4 mb-2">5. Seguridad de la información</h2>
      <p className="mb-2 font-serif">
        Implementamos medidas razonables para proteger tus datos, aunque no podemos garantizar
        seguridad absoluta.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">6. Derechos del usuario</h2>
      <p className="mb-2 font-serif">
        Puedes acceder, corregir o eliminar tus datos contactándonos en{' '}
        <strong>support@agrovenca.com</strong>.
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">7. Contacto</h2>
      <p className="mb-1 font-serif">Correo: support@agrovenca.com</p>
      <p className="mb-1 font-serif">Teléfono: +58 414-5363248</p>
      <p className="mb-1 font-serif">Redes sociales:</p>
      <ul className="list-disc list-inside font-serif">
        <li>
          <a
            href="https://www.instagram.com/carnetoday/"
            target="_blank"
            className="text-blue-600 underline"
          >
            Instagram
          </a>
        </li>
        <li>
          <a
            href="https://www.facebook.com/agroaliven/"
            target="_blank"
            className="text-blue-600 underline"
          >
            Facebook
          </a>
        </li>
        <li>
          <a
            href="https://www.tiktok.com/@carnetoday"
            target="_blank"
            className="text-blue-600 underline"
          >
            TikTok
          </a>
        </li>
      </ul>
      <Separator className="my-4" />

      <section className="flex justify-center">
        <small>
          Última actualización: {new Date('2025-09-21T02:38:41.868Z').toLocaleDateString('es-VE')}
        </small>
      </section>
    </section>
  )
}

export default PolicyPage
