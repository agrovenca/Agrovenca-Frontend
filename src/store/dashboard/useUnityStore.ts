import { Unity } from '@/types/unity'
import { create } from 'zustand'

interface UnityState {
  unities: Unity[]
  setUnities: (data: Unity[]) => void
  hasUnities: () => boolean
}

export const useUnityStore = create<UnityState>((set, get) => ({
  unities: [],
  setUnities: (data) => set({ unities: data }),
  hasUnities: () => get().unities.length > 0,
}))
