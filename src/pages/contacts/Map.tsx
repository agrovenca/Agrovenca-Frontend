import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin } from 'lucide-react'

function ContactMap() {
  return (
    <Card className="bg-card border-border max-w-7xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          Nuestra ubicación
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-muted rounded-lg border border-border overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            allowFullScreen
            style={{ border: 0 }}
            title="Ubicación de Agrovenca"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1965.0623728227406!2d-69.62180825957573!3d9.923567519255272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e7d811fb0e15ed5%3A0xb6b3897f68d223ee!2sAgroalimentos%20Venezuela%20C.A.!5e0!3m2!1ses-419!2sec!4v1758385579758!5m2!1ses-419!2sec"
          />
        </div>
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Cómo llegar:</strong> Detrás de la parada de buses
            que van a Barquisimeto.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default ContactMap
