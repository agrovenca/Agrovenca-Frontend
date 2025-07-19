import { updateCategory } from '@/actions/categories'
import { CategorySchema } from '@/schemas/category'
import { Category } from '@/types/category'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import z from 'zod'

function useUpdateCategory() {
  const queryClient = useQueryClient()
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, newData }: { id: string; newData: z.infer<typeof CategorySchema> }) =>
      updateCategory({ id, newData }),
    onMutate: async ({ id, newData }) => {
      await queryClient.cancelQueries({ queryKey: ['categories'] })

      const previousCategories = queryClient.getQueryData<Category[]>(['categories'])

      queryClient.setQueryData<Category[]>(['categories'], (oldCategories) => {
        if (!oldCategories) return []

        return oldCategories.map((category) =>
          category.id === id ? { ...category, ...newData } : category
        )
      })
      return { previousCategories }
    },
    onError: (_, __, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(['categories'], context.previousCategories)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  return { updateCategoryMutation }
}

export default useUpdateCategory
