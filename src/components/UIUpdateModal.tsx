import { useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useUIUpdateModalStore } from '@/store/useUIUpdateModalStore'
import { useNavigate } from 'react-router'

export function UIUpdateModal() {
  const navigate = useNavigate()
  const isChecked = useUIUpdateModalStore((state) => state.isChecked)
  const isVisible = useUIUpdateModalStore((state) => state.isVisible)
  const checkModalStatus = useUIUpdateModalStore((state) => state.checkModalStatus)
  const hideModalPermanently = useUIUpdateModalStore((state) => state.hideModalPermanently)

  const handleClick = () => {
    hideModalPermanently()
    navigate('/auth/forgot-password')
  }

  useEffect(() => {
    checkModalStatus()
  }, [checkModalStatus])

  if (!isChecked) return null

  return (
    <Dialog open={isVisible} onOpenChange={hideModalPermanently}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            🎉 ¡Bienvenido a nuestra nueva experiencia!
          </DialogTitle>
          <DialogDescription>
            Hemos realizado una importante actualización en nuestra tienda en línea.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm text-muted-foreground mx-2">
          <p>
            Hemos renovado por completo nuestra tienda para ofrecerte una experiencia más rápida,
            moderna y segura.
          </p>
          <p>
            <strong>Seguimos siendo la misma empresa de siempre</strong>, con el mismo compromiso
            contigo.
          </p>
          <p className="text-destructive font-medium">
            🔒 Hemos migrado nuestra base de datos y, por seguridad,{' '}
            <strong>tu contraseña anterior ya no es válida</strong>. Para acceder nuevamente a tu
            cuenta, es obligatorio que restablezcas tu contraseña.
          </p>
        </div>

        <DialogFooter className="pt-4 flex justify-center">
          <Button
            variant="default"
            className="w-full sm:w-auto cursor-pointer"
            onClick={handleClick}
          >
            Restablecer contraseña
          </Button>
          <Button
            variant="ghost"
            className="w-full sm:w-auto cursor-pointer"
            onClick={hideModalPermanently}
          >
            Entendido, no mostrar de nuevo.
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
