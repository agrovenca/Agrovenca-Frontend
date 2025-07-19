import { createCategory } from '@/actions/categories'
import { User } from '@/types/auth/user'
import { Category } from '@/types/category'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface Props {
  user: User
}

function useCreateCategory({ user }: Props) {
  const queryClient = useQueryClient()

  const sampleCategory = {
    id: Math.random().toString(),
    active: true,
    user,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    _count: { products: 0 },
  }

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onMutate: ({ newData }) => {
      const optimisticCategory = {
        ...newData,
        ...sampleCategory,
      }
      queryClient.setQueryData<Category[]>(['categories'], (oldCategories) => {
        if (!oldCategories) return [optimisticCategory]
        return [optimisticCategory, ...oldCategories]
      })
      return { optimisticCategory }
    },
    onSuccess: (newCategory, _variables, context) => {
      queryClient.setQueryData<Category[]>(['categories'], (oldCategories) => {
        if (!oldCategories) return []

        return oldCategories.map((cachedCategory) =>
          cachedCategory.id === context.optimisticCategory.id ? newCategory : cachedCategory
        )
      })
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData<Category[]>(['categories'], (oldCategories) => {
        if (!oldCategories) return []

        return oldCategories.filter((category) => category.id !== context?.optimisticCategory.id)
      })
    },
  })

  return { createCategoryMutation }
}

export default useCreateCategory
