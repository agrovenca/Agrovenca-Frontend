import { Unity } from '@/types/unity'
import { create } from 'zustand'

interface UnitiesState {
  unities: Unity[]
  setUnities: (data: Unity[]) => void
  updateUnity: (updatedUnity: Unity) => void
}

export const useUnitiesStore = create<UnitiesState>((set) => ({
  unities: [],
  setUnities: (data) => set({ unities: data }),
  updateUnity: (updatedUnity) =>
    set((state) => ({
      unities: state.unities.map((unity) => (unity.id === updatedUnity.id ? updatedUnity : unity)),
    })),
}))
