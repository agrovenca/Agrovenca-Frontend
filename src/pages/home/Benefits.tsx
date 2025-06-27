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
    <Card>
      <CardContent className="p-6 flex flex-col items-center text-center gap-4">
        {icon}
        <h3 className="text-xl font-bold">{title}</h3>
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
              Why Choose Us
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              We're committed to providing the best agricultural products with exceptional service
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <BenefitCard
              icon={<Truck className="h-10 w-10 text-green-600" />}
              title="Fast Delivery"
              description="We deliver your products within 24-48 hours of ordering"
            />
            <BenefitCard
              icon={<ShieldCheck className="h-10 w-10 text-green-600" />}
              title="Quality Guarantee"
              description="All our products are quality checked and certified"
            />
            <BenefitCard
              icon={<Users className="h-10 w-10 text-green-600" />}
              title="Direct from Farmers"
              description="We source directly from local farmers, ensuring fair prices"
            />
          </div>
        </div>
      </section>
    </>
  )
}

export default Benefits
