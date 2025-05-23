import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { GhostIcon, RefreshCwIcon } from 'lucide-react'
// import { getLocalDateTime, getUserRole } from '@/lib/utils'
import { Loader } from '@/components/ui/loader'
// import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDebouncedCallback } from 'use-debounce'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function ProductsSettingsPage() {
  const [data, setData] = useState([1, 2, 3, 4, 5, 6])
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const fetchData = async (page: number, search: string) => {}

  const debounced = useDebouncedCallback((value) => {
    fetchData(1, value)
  }, 500)

  const handleSearchChange = (value: string) => {
    setSearch(value)
    debounced(value)
  }

  const SortableItem = ({ id }: { id: number }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    }

    return (
      <TableRow key={id} style={style} ref={setNodeRef} {...attributes} {...listeners}>
        <TableCell>{id}</TableCell>

        <TableCell className="text-right">
          <div className="flex items-center gap-2">
            {/* <Update user={user} categories={data} setData={setData} /> */}
            {/* <DeleteDialog action={() => destroy(user.id)} callback={fetchData} /> */}
          </div>
        </TableCell>
      </TableRow>
    )
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => console.log(data), [data])

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (active.id !== over?.id) {
      setData((items) => {
        const oldIndex = items.indexOf(Number(active.id))
        const newIndex = items.indexOf(Number(over?.id))
        const newOrder = arrayMove(items, oldIndex, newIndex)

        return newOrder
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full gap-2">
        <Loader size="md" />
        <span>Cargando...</span>
      </div>
    )
  }

  if (data.length <= 0) {
    return (
      <div className="p-4 w-full flex justify-center items-center flex-col">
        <div>
          <GhostIcon className="w-16 h-16 animate-bounce" />
        </div>
        <span>No existen productos</span>
      </div>
    )
  }

  return (
    <>
      <div className="w-full flex justify-between gap-4 mb-4">
        <div className="pt-4 flex-1">
          <form>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="search" className="sr-only">
                Buscar
              </Label>
              <Input
                type="search"
                id="search"
                placeholder="Buscar usuarios"
                value={search}
                autoFocus
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </form>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={'outline'}
            onClick={() => fetchData(page, search)}
            className="flex items-center gap-2"
          >
            <RefreshCwIcon />
            <span>Recargar</span>
          </Button>
        </div>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <Table className="my-4">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Producto</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <SortableContext items={data} strategy={verticalListSortingStrategy}>
              {data.map((id) => (
                <SortableItem id={id} key={id} />
              ))}
            </SortableContext>
          </TableBody>
        </Table>
      </DndContext>
    </>
  )
}

export default ProductsSettingsPage
