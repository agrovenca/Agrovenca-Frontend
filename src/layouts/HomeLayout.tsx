import { Outlet } from 'react-router-dom'
import WhatsAppBtn from '@/components/blocks/WhatsAppBtn'

export const HomeLayout = () => {
  return (
    <section className="relative">
      <Outlet />
      <WhatsAppBtn />
    </section>
  )
}
