import { deleteUnity } from '@/actions/unities'
import { Unity } from '@/types/unity'
import { useMutation, useQueryClient } from '@tanstack/react-query'

function useDeleteUnity() {
  const queryClient = useQueryClient()
  const deleteUnityMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => deleteUnity({ id }),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ['unities'] })
      const previousUnities = queryClient.getQueryData<Unity[]>(['unities'])

      queryClient.setQueryData<Unity[]>(['unities'], (oldUnities) => {
        if (!oldUnities) return []
        return oldUnities.filter((unity) => unity.id !== id)
      })

      return { previousUnities }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousUnities) {
        queryClient.setQueryData<Unity[]>(['unities'], context.previousUnities)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['unities'] })
    },
  })
  return { deleteUnityMutation }
}

export default useDeleteUnity
