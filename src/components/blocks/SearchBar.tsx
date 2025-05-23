import { Label } from '../ui/label'
import { Input } from '../ui/input'

type Props = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

function SearchBar({ value, onChange, placeholder }: Props) {
  return (
    <form>
      <div className="grid w-full max-w-sm items-center gap-1.5">
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
      </div>
    </form>
  )
}

export default SearchBar
