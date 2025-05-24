import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { SearchIcon } from 'lucide-react'
import { Button } from '../ui/button'

type Props = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

function SearchBar({ value, onChange, placeholder }: Props) {
  return (
    <form>
      <div className="grid w-full max-w-sm items-center gap-1.5 relative">
        <Label htmlFor="search" className="sr-only">
          Buscar
        </Label>
        <Input
          type="search"
          id="search"
          placeholder={placeholder || 'Buscar'}
          value={value}
          autoFocus
          onChange={(e) => onChange(e.target.value)}
        />
        <Button
          className="absolute right-0 top-1/2 -translate-y-1/2"
          variant={'ghost'}
          size={'icon'}
          disabled
        >
          <SearchIcon className="w-5" />
        </Button>
      </div>
    </form>
  )
}

export default SearchBar
