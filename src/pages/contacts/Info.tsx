import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import ContactSocials from './Socials'

function ContactInfo() {
  return (
    <>
      <Card className="bg-muted border-border col-span-1 row-span-3">
        <CardHeader>
          <CardTitle className="text-2xl text-foreground">Información de contacto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Teléfono</h3>
              <p className="text-muted-foreground font-serif">+58 412-2647923</p>
              <p className="text-sm text-muted-foreground font-serif">Lun - Sab: 8:00AM - 5:00PM</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Email</h3>
              <p className="text-muted-foreground font-serif">support@agrovenca.com</p>
              <p className="text-sm text-muted-foreground font-serif">Respuesta en 24 horas</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Dirección</h3>
              <p className="text-muted-foreground font-serif">Av. 5 entre calle 12 y 13</p>
              <p className="text-muted-foreground font-serif">Quíbor - Lara</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Horarios</h3>
              <p className="text-muted-foreground font-serif">Lunes a Sábado</p>
              <p className="text-muted-foreground font-serif">8:00AM - 5:00PM</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Redes sociales</h3>
              <p className="text-muted-foreground font-serif mb-3">
                Síguenos para novedades y consejos
              </p>
              <ContactSocials />
            </div>
          </div>
        </CardContent>
      </Card>
      {/* <Card className="bg-muted border-border col-span-1 row-span-2">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">Nuestros servicios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-foreground">Envío a todo el país</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-foreground">Productos certificados</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <span className="text-foreground">Asesoramiento técnico</span>
            </div>
          </CardContent>
        </Card> */}
    </>
  )
}

export default ContactInfo
