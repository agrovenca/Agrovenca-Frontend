import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Mail, MapPin, MessageCircle, Phone, Shield, Truck } from 'lucide-react'
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
              <p className="text-muted-foreground font-serif">+54 9 11 2345-6789</p>
              <p className="text-sm text-muted-foreground font-serif">Lun - Vie: 8:00 - 18:00</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Email</h3>
              <p className="text-muted-foreground font-serif">contacto@agroverde.com</p>
              <p className="text-sm text-muted-foreground font-serif">Respuesta en 24 horas</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Dirección</h3>
              <p className="text-muted-foreground font-serif">Ruta Nacional 9, Km 45</p>
              <p className="text-muted-foreground font-serif">Campana, Buenos Aires</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Horarios</h3>
              <p className="text-muted-foreground font-serif">Lunes a Viernes: 8:00 - 18:00</p>
              <p className="text-muted-foreground font-serif">Sábados: 8:00 - 13:00</p>
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
      <Card className="bg-muted border-border col-span-1 row-span-2">
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
      </Card>
    </>
  )
}

export default ContactInfo
