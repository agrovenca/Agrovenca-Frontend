import { Card, CardContent } from '@/components/ui/card'

function TestimonialCard({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <Card className="transition-all hover:scale-95">
      <CardContent className="p-6 flex flex-col gap-4">
        <p className="italic text-muted-foreground">"{quote}"</p>
        <div>
          <p className="font-medium text-primary">{author}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function Testimonials() {
  return (
    <>
      {/* Testimonials */}
      <section className="w-full py-12 md:py-24">
        <div className="container space-y-12 mx-auto">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Lo que opinan nuestros clientes
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Conoce cómo nuestros insumos y equipos ayudan a mejorar el trabajo en el campo
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mx-4 md:mx-0">
            <TestimonialCard
              quote="Los productos veterinarios que compré aquí han sido efectivos y seguros. Mis animales están mejor cuidados y con insumos confiables."
              author="María González"
              role="Ganadera"
            />
            <TestimonialCard
              quote="Las etiquetas y envases que adquirí son de excelente calidad. Me han facilitado mucho la organización y presentación de mis productos."
              author="Carlos Pérez"
              role="Productor agrícola"
            />
            <TestimonialCard
              quote="Las herramientas y equipos que conseguí en la tienda son resistentes y a buen precio. He notado un gran ahorro de tiempo en mis labores."
              author="Juan Ramírez"
              role="Agricultor"
            />
          </div>
        </div>
      </section>
    </>
  )
}

export default Testimonials
