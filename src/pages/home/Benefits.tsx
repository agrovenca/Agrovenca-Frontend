import { Card, CardContent } from '@/components/ui/card'
import { ShieldCheck, Truck, Users } from 'lucide-react'

function BenefitCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Card className="transition-all hover:scale-95">
      <CardContent className="p-6 flex flex-col items-center text-center gap-4">
        {icon}
        <h3 className="text-xl font-bold text-primary uppercase">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function Benefits() {
  return (
    <>
      {/* Benefits Section */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container space-y-12 mx-auto">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              ¿Por qué elegirnos?
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Estamos comprometidos en ofrecer los mejores productos con un servicio excepcional
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mx-4 md:mx-0">
            <BenefitCard
              icon={<Truck className="h-10 w-10 text-primary" />}
              title="Entrega rápida"
              description="Recibe tus productos en un plazo de 24 a 48 horas después de tu pedido"
            />
            <BenefitCard
              icon={<ShieldCheck className="h-10 w-10 text-primary" />}
              title="Garantía de calidad"
              description="Todos nuestros productos son verificados y cuentan con certificación de calidad"
            />
            <BenefitCard
              icon={<Users className="h-10 w-10 text-primary" />}
              title="Directo del productor"
              description="Trabajamos directamente con productores locales para garantizar precios justos"
            />
          </div>
        </div>
      </section>
    </>
  )
}

export default Benefits
