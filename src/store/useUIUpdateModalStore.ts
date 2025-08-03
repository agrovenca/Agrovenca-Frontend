// store/useUIUpdateModalStore.ts
import { create } from 'zustand'

interface UIUpdateModalState {
  isChecked: boolean
  isVisible: boolean
  checkModalStatus: () => void
  hideModalPermanently: () => void
}

const STORAGE_KEY = 'ui_update_modal_dismissed'

export const useUIUpdateModalStore = create<UIUpdateModalState>((set) => ({
  isChecked: false,
  isVisible: false,
  checkModalStatus: () => {
    const dismissed = localStorage.getItem(STORAGE_KEY)
    set({
      isChecked: true,
      isVisible: !dismissed,
    })
  },
  hideModalPermanently: () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    set({ isVisible: false })
  },
}))
