import { CheckIcon, Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Theme, useTheme } from '@/components/theme-provider'

const labels = {
  light: 'Claro',
  dark: 'Oscuro',
  system: 'Sistema',
}

function RenderItem({ mode, label }: { mode: Theme; label: string }) {
  const { theme, setTheme } = useTheme()
  return (
    <DropdownMenuItem onClick={() => setTheme(mode)} className="flex items-center justify-between">
      <span>{label}</span> {theme === mode && <CheckIcon />}
    </DropdownMenuItem>
  )
}

export function ModeToggle() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(labels).map(([mode, label]) => (
          <RenderItem key={mode} mode={mode as Theme} label={label} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
