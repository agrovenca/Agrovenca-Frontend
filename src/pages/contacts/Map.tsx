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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3285.8947!2d-58.9567!3d-34.1667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDEwJzAwLjEiUyA1OMKwNTcnMjQuMSJX!5e0!3m2!1ses!2sar!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación de Agrovenca"
          />
        </div>
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Cómo llegar:</strong> Desde Buenos Aires, tomar la
            Ruta Nacional 9 hacia el norte. Nuestras instalaciones se encuentran en el Km 45, con
            amplio estacionamiento disponible.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default ContactMap
