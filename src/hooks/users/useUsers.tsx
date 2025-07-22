import { getAllUsers } from '@/actions/users'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

interface Options {
  search: string
  limit: number
  isActive?: 'active' | 'inactive'
}

function useUsers({ search, limit, isActive }: Options) {
  const [page, setPage] = useState(1)

  const usersQuery = useQuery({
    queryKey: ['users', { page, search, limit, isActive }],
    queryFn: () => getAllUsers({ page, search, limit, isActive }),
    staleTime: 1000 * 60 * 60,
  })

  const setPrevPage = () => {
    if (page === 1) return
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
    page,
    setPrevPage,
    setNextPage,
    setPageNumber,
  }
}

export default useUsers
