import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SIDEBAR_STORAGE_KEY } from "@/config/themeConfig";

interface UiState {
  activeModal: string | null;
  mobileMenuOpen: boolean;
  sidebarCollapsed: boolean;
  closeModal: () => void;
  closeMobileMenu: () => void;
  openModal: (modalId: string) => void;
  toggleMobileMenu: () => void;
  toggleSidebar: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      activeModal: null,
      mobileMenuOpen: false,
      sidebarCollapsed: false,
      closeModal: () => set({ activeModal: null }),
      closeMobileMenu: () => set({ mobileMenuOpen: false }),
      openModal: (modalId) => set({ activeModal: modalId }),
      toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    }),
    {
      name: SIDEBAR_STORAGE_KEY,
      partialize: (state) => ({ sidebarCollapsed: state.sidebarCollapsed }),
    },
  ),
);
