import { useCallback, useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { RefreshCwIcon } from 'lucide-react'
import { getLocalDateTime, getUserRole } from '@/lib/utils'
import { Loader } from '@/components/ui/loader'
import { getAll } from '@/actions/settings/users'
import { User, UserFilterParams } from '@/types/auth/user'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/store/auth/useAuthStore'
import Pagination from '@/components/blocks/pagination'
import { usePaginationStore } from '@/store/shared/usePaginationStore'
import AccountOptions from './SettingsAccount'
import UserFilters from './UserFilters'

function UsersSettingsPage() {
  const [data, setData] = useState<User[]>([])
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(1)
  const [isActive, setIsActive] = useState<UserFilterParams['isActive']>()
  const paginationData = usePaginationStore((state) => state.paginationData)
  const setPaginationData = usePaginationStore((state) => state.setPaginationData)

  const [isLoading, setIsLoading] = useState(false)
  const currentUser = useAuthStore((state) => state.user) as User

  const fetchData = useCallback(
    async (page: number, search: string, limit: number, isActive: UserFilterParams['isActive']) => {
      setIsLoading(true)
      const res = await getAll({ page, search, limit, isActive })
      if ('data' in res) {
        setData(res.data.objects)
        setPaginationData({ ...res.data })
      } else {
        console.error('Error al obtener los usuarios:', res.error)
      }
      setIsLoading(false)
    },
    [setPaginationData]
  )

  useEffect(() => {
    fetchData(page, search, limit, isActive)
  }, [fetchData, page, search, limit, isActive])

  const handleFilterSubmit = ({ search, limit, isActive }: Omit<UserFilterParams, 'page'>) => {
    setPage(1)
    setSearch(search)
    setLimit(limit)
    setIsActive(isActive)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full gap-2">
        <Loader size="md" />
        <span>Cargando...</span>
      </div>
    )
  }

  return (
    <>
      <div className="w-full flex justify-between gap-4 mb-4">
        <div className="pt-4 flex-1">
          <UserFilters
            initialSearch={search}
            initialLimit={limit}
            initialIsActive={isActive}
            onSubmit={handleFilterSubmit}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={'outline'}
            onClick={() => fetchData(page, search, limit, isActive)}
            className="flex items-center gap-2"
          >
            <RefreshCwIcon />
            <span>Recargar</span>
          </Button>
        </div>
      </div>
      <Table className="my-4">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Creado</TableHead>
            <TableHead>Actualizado</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <span>{user.email}</span>
                  {user.id === currentUser.id && <Badge variant={'outline'}>Yo</Badge>}
                </TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? 'default' : 'outline'}>
                    {user.isActive ? 'Activa' : 'Inactiva'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge>{getUserRole(user)}</Badge>
                </TableCell>
                <TableCell>{getLocalDateTime(user.createdAt, ['es-ve'])}</TableCell>
                <TableCell>{getLocalDateTime(user.updatedAt, ['es-ve'])}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center gap-2">
                    {user.id !== currentUser.id &&
                      ['Admin', 'Mod'].includes(getUserRole(currentUser)) && (
                        <AccountOptions user={user} users={data} setUsers={setData} />
                      )}
                    {/* <Update user={user} categories={data} setData={setData} /> */}
                    {/* <DeleteDialog action={() => destroy(user.id)} callback={fetchData} /> */}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No existen usuarios
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {paginationData && (
        <Pagination paginationData={paginationData} onPageChange={(newPage) => setPage(newPage)} />
      )}
    </>
  )
}

export default UsersSettingsPage
