import { deleteCategory } from '@/actions/categories'
import { Category } from '@/types/category'
import { useMutation, useQueryClient } from '@tanstack/react-query'

function useDeleteCategory() {
  const queryClient = useQueryClient()
  const deleteCategoryMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => deleteCategory({ id }),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ['categories'] })

      const previousCategories = queryClient.getQueryData<Category[]>(['categories'])

      queryClient.setQueryData<Category[]>(['categories'], (oldCategories) => {
        if (!oldCategories) return []
        return oldCategories.filter((category) => category.id !== id)
      })

      return { previousCategories }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData<Category[]>(['categories'], context.previousCategories)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  return { deleteCategoryMutation }
}

export default useDeleteCategory
