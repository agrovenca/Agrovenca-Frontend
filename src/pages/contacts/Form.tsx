import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader } from '@/components/ui/loader'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SendIcon } from 'lucide-react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ContactSchema } from '@/schemas/contact'
import z from 'zod'

function ContactForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const [description, setDescription] = useState('')

  const form = useForm<z.infer<typeof ContactSchema>>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      fullname: '',
      message: '',
      email: '',
      phone: '',
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof ContactSchema>> = async (_data) => {
    setIsLoading(true)
  }

  return (
    <Card className="bg-muted border-border col-span-1 row-span-full">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground">Envíanos un mensaje</CardTitle>
        <CardDescription>
          Completa el formulario y nos pondremos en contacto contigo lo antes posible.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-col-1 md:grid-cols-2 gap-4 items-baseline">
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="fullname">Nombre completo</FormLabel>
                    <Input
                      id="fullname"
                      type="text"
                      maxLength={180}
                      className="font-serif"
                      placeholder="Tu nombre completo"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="phone">Número de teléfono</FormLabel>
                    <Input
                      id="phone"
                      type="text"
                      maxLength={15}
                      className="font-serif"
                      placeholder="Tu número de teléfono"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Correo electrónico</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    maxLength={180}
                    className="font-serif"
                    placeholder="Tu correo electrónico"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="message">Mensaje</FormLabel>
                  <div className="flex flex-col">
                    <FormControl className="rounded-lg">
                      <Textarea
                        placeholder="Escribe un mensaje"
                        className="resize-none font-serif"
                        maxLength={800}
                        {...field}
                        value={description}
                        onChange={(e) => {
                          setCharCount(e.target.value.length)
                          setDescription(e.target.value)
                          field.onChange(e)
                        }}
                      />
                    </FormControl>
                  </div>
                  <p className="text-sm text-muted-foreground" id="description-count">
                    {charCount}/800
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={!form.formState.isValid || isLoading}
              className={`${
                !form.formState.isValid || isLoading ? 'cursor-not-allowed' : 'cursor-pointer'
              } w-full font-serif`}
            >
              {isLoading ? (
                <Loader size="sm" variant="spinner" />
              ) : (
                <div className="flex items-center gap-2">
                  <SendIcon size={16} />
                  <span>Enviar mensaje</span>
                </div>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default ContactForm
