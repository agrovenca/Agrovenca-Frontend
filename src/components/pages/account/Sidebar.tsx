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
import { ArrowLeftIcon, Ellipsis, SettingsIcon, User2Icon } from 'lucide-react'
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
    name: 'Profile',
    path: '/account/profile',
    icon: <User2Icon />,
    asLink: true,
  },
  {
    name: 'Change Password',
    path: '/account/change-password',
    icon: <Ellipsis />,
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
            {(user?.isMod || user?.isAdmin) && (
              <SidebarMenuButton
                asChild
                className={`flex items-center gap-2 ${
                  isActive(location.pathname, '/settings') ? activeClassName : ''
                }`}
              >
                <Link to="/settings">
                  <SettingsIcon />
                  <span>Configuración</span>
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex-row items-center justify-between gap-4">
        <ModeToggle />
        <LogoutBtn showIcon={true} />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
