import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import faqData from '@/assets/files/faq.json'

function FaqPage() {
  return (
    <section className="w-full py-12 md:py-24 bg-muted/50">
      <div className="max-w-2xl space-y-12 mx-auto">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Preguntas Frecuentes
          </h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Aquí respondemos las dudas más comunes de nuestros clientes
          </p>
        </div>
        <Accordion type="single" collapsible>
          {faqData.map((faq) => (
            <AccordionItem value={faq.id} key={faq.id}>
              <AccordionTrigger className="cursor-pointer">{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

export default FaqPage
