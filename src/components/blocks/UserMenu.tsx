import { User } from '@/types/auth/user'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Link } from 'react-router'
import LogoutBtn from './LogoutBtn'
import { HeartIcon, LayersIcon, SettingsIcon, UserIcon } from 'lucide-react'

type Props = {
  user: User
}

const navItems = [
  {
    name: 'Perfil',
    link: '/account/profile',
    icon: <UserIcon />,
  },
  {
    name: 'Guardados',
    link: '',
    icon: <HeartIcon />,
  },
  {
    name: 'Ordenes',
    link: '',
    icon: <LayersIcon />,
  },
]

export default function UserMenu({ user }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {navItems.map((item, idx) => (
          <DropdownMenuItem key={idx}>
            <Link to={item.link} className="flex gap-2 items-center">
              {item.icon}
              <span>{item.name}</span>
            </Link>
          </DropdownMenuItem>
        ))}
        {(user.isMod || user.isAdmin) && (
          <DropdownMenuItem>
            <Link to="/dashboard" className="flex gap-2 items-center">
              <SettingsIcon />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogoutBtn />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
