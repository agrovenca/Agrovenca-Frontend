import { Card, CardContent } from '@/components/ui/card'

function TestimonialCard({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <Card>
      <CardContent className="p-6 flex flex-col gap-4">
        <p className="italic text-muted-foreground">"{quote}"</p>
        <div>
          <p className="font-medium">{author}</p>
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
              What Our Customers Say
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Hear from our satisfied customers about their experience
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <TestimonialCard
              quote="The quality of produce I receive is consistently excellent. It's like having a farmers market delivered to my doorstep!"
              author="Sarah Johnson"
              role="Home Gardener"
            />
            <TestimonialCard
              quote="As a restaurant owner, I rely on fresh ingredients. AgriMarket has never disappointed me with their quality and timely delivery."
              author="Michael Chen"
              role="Restaurant Owner"
            />
            <TestimonialCard
              quote="Their farming tools are top-notch and reasonably priced. I've seen a significant improvement in my crop yield since using their products."
              author="Robert Miller"
              role="Farmer"
            />
          </div>
        </div>
      </section>
    </>
  )
}

export default Testimonials
