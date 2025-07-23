import { useState } from 'react'
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
import { User, UserFilterParams } from '@/types/auth/user'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/store/auth/useAuthStore'
import Pagination from '@/components/blocks/pagination'
import AccountOptions from './SettingsAccount'
import UserFilters from './UserFilters'
import useUsers from '@/hooks/users/useUsers'

function UsersDashboardPage() {
  const [data, setData] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(10)
  const [isActive, setIsActive] = useState<UserFilterParams['isActive']>()

  const currentUser = useAuthStore((state) => state.user) as User

  const { usersQuery, setNextPage, setPrevPage, setPageNumber } = useUsers({
    search,
    limit,
    isActive,
  })

  const handleFilterSubmit = (params: UserFilterParams) => {
    setSearch(String(params.search))
    setLimit(Number(params.limit))
    setIsActive(params.isActive)
  }

  return (
    <>
      <div className="w-full flex justify-between gap-4 mb-4">
        <div className="pt-4 flex-1">
          <UserFilters
            initialSearch={search}
            initialLimit={limit}
            initialIsActive={isActive}
            handleSubmit={handleFilterSubmit}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={'outline'}
            onClick={() => usersQuery.refetch()}
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
          {usersQuery.isFetching && (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                <div className="flex items-center justify-center h-full w-full gap-2">
                  <Loader size="md" />
                  <span>Cargando...</span>
                </div>
              </TableCell>
            </TableRow>
          )}
          {usersQuery.isSuccess && usersQuery.data.objects.length ? (
            usersQuery.data.objects.map((user) => (
              <TableRow key={user.id} className="font-serif">
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

      {usersQuery.data?.objects && (
        <Pagination
          paginationData={usersQuery.data.pagination}
          currentItems={usersQuery.data.objects.length}
          setNextPage={setNextPage}
          setPrevPage={setPrevPage}
          setPageNumber={setPageNumber}
        />
      )}
    </>
  )
}

export default UsersDashboardPage
