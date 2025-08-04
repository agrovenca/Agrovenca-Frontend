import { Link, NavLink } from 'react-router'
import { Button } from '../ui/button'
import { Leaf, LogIn, Menu, UserRound } from 'lucide-react'
import { useAuthStore } from '@/store/auth/useAuthStore'
import UserMenu from '../blocks/UserMenu'
import { ModeToggle } from '../mode-toggle'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import CartPage from '@/pages/cart'
import SavedProductsPage from '@/pages/products/Saved'

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
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bgprimary/60 bg-primary/95">
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
              // className={"text-sm font-medium hover:text-primary"}
              className={({ isActive }) =>
                (isActive ? 'text-primary-foreground' : 'text-secondary') +
                ' text-sm font-medium hover:text-primary-foreground'
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <CartPage />
            <SavedProductsPage />
          </div>
          <div className="hidden md:block">
            <ModeToggle />
          </div>
          {!user ? (
            <Button
              asChild
              variant={'outline'}
              className="hidden sm:flex"
              size={'icon'}
              title="Iniciar sesión"
            >
              <Link viewTransition to="/auth/login" className="text-sm font-medium">
                <UserRound />
              </Link>
            </Button>
          ) : (
            <UserMenu user={user} />
          )}
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
                <div className="mt-6 flex flex-col space-y-4 mx-4">
                  {menuItems.map((item, idx) => (
                    <NavLink
                      key={idx}
                      to={item.link}
                      viewTransition
                      // className="px-3 py-2 text-sm font-medium hover:text-primary"
                      className={({ isActive }) =>
                        (isActive ? 'text-primary' : 'text-muted-foreground') +
                        ' text-sm font-medium hover:text-primary'
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
                <SheetFooter>
                  <div className="md:hidden py-2 ms-auto">
                    <ModeToggle />
                  </div>
                  <div className="flex flex-col gap-4">
                    <Button asChild variant={'outline'}>
                      <Link
                        viewTransition
                        to="/auth/login"
                        className="text-sm font-medium text-muted-foreground hover:text-primary"
                      >
                        <LogIn />
                        <span style={{ viewTransitionName: 'loginTransitionTitle' }}>
                          Iniciar sesión
                        </span>
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link
                        viewTransition
                        to="/auth/register"
                        className="button-primary text-sm font-medium "
                      >
                        <UserRound />
                        <span style={{ viewTransitionName: 'registerTransitionTitle' }}>
                          Registrarse
                        </span>
                      </Link>
                    </Button>
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
