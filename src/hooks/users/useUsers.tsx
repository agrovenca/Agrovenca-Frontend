import { getAllUsers } from '@/actions/users'
import { useQuery } from '@tanstack/react-query'
import { useUsersFilterSetters, useUsersQueryKey } from './useUsersQueryKey'

interface Props {
  fetchAll?: boolean
}

function useUsers({ fetchAll }: Props) {
  const filters = useUsersQueryKey()
  const { setPage } = useUsersFilterSetters()

  const usersQuery = useQuery({
    queryKey: ['users', filters],
    queryFn: () => getAllUsers(fetchAll ? { search: '', limit: 0 } : filters),
    staleTime: 1000 * 60 * 60,
  })

  const setPrevPage = () => {
    if (filters.page === 1) return

    setPage(Number(usersQuery.data?.pagination.previousPage))
  }

  const setNextPage = () => {
    if (!usersQuery.data?.pagination.hasNextPage) return
    setPage(Number(usersQuery.data?.pagination.nextPage))
  }

  const setPageNumber = (page: number) => {
    setPage(page)
  }

  return {
    usersQuery,
    page: filters.page,
    setPrevPage,
    setNextPage,
    setPageNumber,
  }
}

export default useUsers
