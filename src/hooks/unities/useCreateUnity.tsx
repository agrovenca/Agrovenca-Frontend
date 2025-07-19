import { createUnity } from '@/actions/unities'
import { Unity } from '@/types/unity'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const sampleUnity = {
  id: Math.random().toString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  _count: { products: 0 },
}

function useCreateUnity() {
  const queryClient = useQueryClient()

  const createUnityMutation = useMutation({
    mutationFn: createUnity,
    onMutate: ({ newData }) => {
      const optimisticUnity = {
        ...newData,
        ...sampleUnity,
      }
      queryClient.setQueryData<Unity[]>(['unities'], (oldUnities) => {
        if (!oldUnities) return []
        return [optimisticUnity, ...oldUnities]
      })
      return { optimisticUnity }
    },
    onSuccess: ({ unity: newUnity }, _variables, context) => {
      queryClient.setQueryData<Unity[]>(['unities'], (oldUnities) => {
        if (!oldUnities) return []
        return oldUnities.map((cachedUnity) =>
          cachedUnity.id === context.optimisticUnity.id ? newUnity : cachedUnity
        )
      })
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData<Unity[]>(['unities'], (oldUnities) => {
        if (!oldUnities) return []
        return oldUnities.filter((unity) => unity.id !== context?.optimisticUnity.id)
      })
    },
  })

  return { createUnityMutation }
}

export default useCreateUnity
