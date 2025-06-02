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

type Props = {
  user: User | null
}

type MenuItem = {
  name: string
  icon: ReactNode
  asLink: boolean
  path: string
  callBack?: () => void
}

const menuItems: MenuItem[] = [
  {
    name: 'Configuración',
    path: '/dashboard',
    icon: <SettingsIcon />,
    asLink: true,
  },
  {
    name: 'Usuarios',
    path: '/dashboard/users',
    icon: <UsersIcon />,
    asLink: true,
  },
  {
    name: 'Categorías',
    path: '/dashboard/categories',
    icon: <LayoutTemplateIcon />,
    asLink: true,
  },
  {
    name: 'Unidades',
    path: '/dashboard/unities',
    icon: <RulerIcon />,
    asLink: true,
  },
  {
    name: 'Productos',
    path: '/dashboard/products',
    icon: <PackageIcon />,
    asLink: true,
  },
  {
    name: 'Cupones',
    path: '/dashboard/coupons',
    icon: <TagIcon />,
    asLink: true,
  },
  {
    name: 'Ordenes',
    path: '/dashboard/orders',
    icon: <LayersIcon />,
    asLink: true,
  },
  {
    name: 'Anuncios',
    path: '/dashboard/ads',
    icon: <GalleryVerticalIcon />,
    asLink: true,
  },
]

function AppSidebar({ user }: Props) {
  const location = useLocation()
  const isActive = (currentPath: string, itemPath: string) => {
    return currentPath === itemPath
  }
  const activeClassName = 'font-bold underline'

  return (
    <Sidebar>
      <SidebarContent>
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
              <SidebarMenuItem key={idx}>
                {item.asLink ? (
                  <SidebarMenuButton
                    asChild
                    className={`flex items-center gap-2 ${
                      isActive(location.pathname, item.path) ? activeClassName : ''
                    }`}
                  >
                    <Link to={item.path}>
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
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
