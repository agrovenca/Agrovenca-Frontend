import { Link, NavLink } from 'react-router'
import { Button } from '../ui/button'
import { Leaf, LogIn, Menu, UserRound } from 'lucide-react'
import { useAuthStore } from '@/store/auth/useAuthStore'
import UserMenu from '../blocks/UserMenu'
import { ModeToggle } from '../mode-toggle'
import CartBtn from '../blocks/CartBtn'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

function Navbar() {
  const user = useAuthStore((state) => state.user)

  const menuItems = [
    {
      name: 'Inicio',
      link: '/',
    },
    {
      name: 'Productos',
      link: '/products',
    },
    {
      name: 'Categorías',
      link: '/categories',
    },
    {
      name: 'Contacto',
      link: '/contact',
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto">
        <Link to={'/'} className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-green-600" />
          <span className="text-xl font-bold">Agrovenca</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          {menuItems.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.link}
              viewTransition
              className="text-sm font-medium hover:text-primary"
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Button asChild variant={'outline'}>
                <Link
                  viewTransition
                  to="/auth/login"
                  className="text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  <span style={{ viewTransitionName: 'loginTransitionTitle' }}>Login</span>
                  <LogIn />
                </Link>
              </Button>
              <Button asChild variant={'default'}>
                <Link
                  viewTransition
                  to="/auth/register"
                  className="text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  <span style={{ viewTransitionName: 'registerTransitionTitle' }}>Register</span>
                  <UserRound />
                </Link>
              </Button>
            </>
          ) : (
            <>
              <CartBtn />
              <UserMenu user={user} />
            </>
          )}
          <div className="hidden md:block">
            <ModeToggle />
          </div>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menú</SheetTitle>
                  <SheetDescription>Navegue por nuestras secciones</SheetDescription>
                </SheetHeader>
                <div className="mt-6 flex flex-col space-y-4">
                  {menuItems.map((item, idx) => (
                    <NavLink
                      key={idx}
                      to={item.link}
                      viewTransition
                      className="px-3 py-2 text-sm font-medium hover:text-primary"
                    >
                      {item.name}
                    </NavLink>
                  ))}
                  <div className="md:hidden px-3 py-2">
                    <ModeToggle />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
