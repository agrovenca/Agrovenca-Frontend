import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import FormCreate from './FormCreate'

function CreateShippingAddress() {
  const [isOpen, setIsOpen] = useState(false)
  // const [isLoading, setIsLoading] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="ms-auto bg-blue-500 text-white dark:hover:bg-blue-600 cursor-pointer flex gap-2 items-center">
          <PlusIcon />
          <span>Añadir dirección</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear una dirección de envío</DialogTitle>
          <DialogDescription>Estás a punto de crear una nueva dirección de envío</DialogDescription>
        </DialogHeader>
        <FormCreate />
      </DialogContent>
    </Dialog>
  )
}

export default CreateShippingAddress
