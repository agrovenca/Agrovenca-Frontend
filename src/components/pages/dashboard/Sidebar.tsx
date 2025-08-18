import { User } from '@/types/auth/user'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  ArrowLeftIcon,
  GalleryVerticalIcon,
  LayersIcon,
  LayoutTemplateIcon,
  PackageIcon,
  RulerIcon,
  SettingsIcon,
  TagIcon,
  UsersIcon,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { ReactNode } from 'react'
import { ModeToggle } from '@/components/mode-toggle'
import LogoutBtn from '@/components/blocks/LogoutBtn'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Props {
  user: User | null
}

interface MenuItem {
  name: string
  icon: ReactNode
  asLink: boolean
  path: string
  callBack?: () => void
  isReady: boolean
}

const menuItems: MenuItem[] = [
  {
    name: 'Configuración',
    path: '/dashboard',
    icon: <SettingsIcon />,
    asLink: true,
    isReady: true,
  },
  {
    name: 'Usuarios',
    path: '/dashboard/users',
    icon: <UsersIcon />,
    asLink: true,
    isReady: true,
  },
  {
    name: 'Categorías',
    path: '/dashboard/categories',
    icon: <LayoutTemplateIcon />,
    asLink: true,
    isReady: true,
  },
  {
    name: 'Unidades',
    path: '/dashboard/unities',
    icon: <RulerIcon />,
    asLink: true,
    isReady: true,
  },
  {
    name: 'Productos',
    path: '/dashboard/products',
    icon: <PackageIcon />,
    asLink: true,
    isReady: true,
  },
  {
    name: 'Cupones',
    path: '/dashboard/coupons',
    icon: <TagIcon />,
    asLink: true,
    isReady: true,
  },
  {
    name: 'Ordenes',
    path: '/dashboard/orders',
    icon: <LayersIcon />,
    asLink: true,
    isReady: true,
  },
  {
    name: 'Anuncios',
    path: '/dashboard/ads',
    icon: <GalleryVerticalIcon />,
    asLink: true,
    isReady: false,
  },
]

const activeClassName =
  'font-bold bg-blue-300/20 dark:bg-blue-400/30 border-r-4 border-blue-600 transition hover:bg-blue-400/20 text-blue-500 dark:text-blue-500 hover:text-blue-700'

function RenderItem({ item }: { item: MenuItem }) {
  const location = useLocation()

  const isActive = (currentPath: string, itemPath: string) => {
    return currentPath === itemPath
  }

  return (
    <SidebarMenuItem>
      {item.asLink ? (
        <SidebarMenuButton
          asChild
          className={cn(
            'font-serif tracking-wide flex items-center gap-2 relative hover:bg-blue-300/20 text-black dark:text-white py-5',
            isActive(location.pathname, item.path) && activeClassName,
            !item.isReady &&
              ' cursor-not-allowed bg-slate-100 dark:bg-gray-700/30 dark:text-gray-500 pointer-events-none'
          )}
        >
          <Link to={item.path}>
            {item.icon}
            <span>{item.name}</span>
            {!item.isReady && (
              <Badge className="absolute right-2 text-gray-400" variant={'outline'}>
                Pronto
              </Badge>
            )}
          </Link>
        </SidebarMenuButton>
      ) : (
        <SidebarMenuButton className="flex items-center gap-2">
          {item.icon}
          <span>{item.name}</span>
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  )
}

function AppSidebar({ user }: Props) {
  return (
    <Sidebar>
      <SidebarContent className="bg-white dark:bg-black">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuButton asChild className={`flex items-center gap-2`}>
              <Link to="/">
                <ArrowLeftIcon />
                <span>Inicio</span>
              </Link>
            </SidebarMenuButton>
            <Separator />
            {menuItems.map((item, idx) => (
              <RenderItem key={idx} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex-row items-center justify-evenly gap-2">
        <ModeToggle />
        <Link to={'/account/profile'} className="flex-1">
          <small className="py-2 px-4 w-full block text-center rounded-lg transition hover:bg-white dark:hover:bg-gray-700/50">
            {user?.name}
          </small>
        </Link>
        <LogoutBtn showIcon={true} />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
