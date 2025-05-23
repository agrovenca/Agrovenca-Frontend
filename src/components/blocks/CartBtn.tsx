import { ShoppingCartIcon } from 'lucide-react'
import { Button } from '../ui/button'

function CartBtn() {
  return (
    <Button size={'icon'} variant={'ghost'}>
      <ShoppingCartIcon />
    </Button>
  )
}

export default CartBtn
