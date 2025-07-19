import { updateUnity } from '@/actions/unities'
import { UnitySchema } from '@/schemas/unity'
import { Unity } from '@/types/unity'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'

function useUpdateUnity() {
  const queryClient = useQueryClient()
  const updateUnityMutation = useMutation({
    mutationFn: ({ id, newData }: { id: string; newData: z.infer<typeof UnitySchema> }) =>
      updateUnity({ id, newData }),
    onMutate: async ({ id, newData }) => {
      await queryClient.cancelQueries({ queryKey: ['unities'] })
      const previousUnities = queryClient.getQueryData<Unity[]>(['unities'])

      queryClient.setQueryData<Unity[]>(['unities'], (oldUnities) => {
        if (!oldUnities) return []

        return oldUnities.map((unity) => (unity.id === id ? { ...unity, ...newData } : unity))
      })
      return { previousUnities }
    },
    onError: (_, __, context) => {
      if (context?.previousUnities) {
        queryClient.setQueryData<Unity[]>(['unities'], context.previousUnities)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['unities'] })
    },
  })

  return { updateUnityMutation }
}

export default useUpdateUnity
