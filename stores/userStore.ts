// stores/userStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type UserState = {
  userData: Record<string, any> | null;
  isUserDataSaved: boolean;
  analysed: boolean; // Non-persistent state
  uuid: string | null; // Persistent UUID
  saveUserData: (data: Record<string, any>) => void;
  resetUserData: () => void;
  setAnalysed: (value: boolean) => void;
  setUuid: (id: string) => void; // Setter for UUID
  updateUserData: (
    updates: Partial<
      Pick<Record<string, any>, "chatType" | "chatPurpose" | "consent">
    >
  ) => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userData: null,
      isUserDataSaved: false,
      analysed: false, // Default value, will not be persisted
      uuid: null, // Default UUID value
      saveUserData: (data) =>
        set({
          userData: data,
          isUserDataSaved: true,
        }),
      resetUserData: () =>
        set({
          userData: null,
          isUserDataSaved: false,
          analysed: false,
          uuid: null,
        }),

      setAnalysed: (value) => set({ analysed: value }),
      setUuid: (id: string) =>
        set({
          uuid: id,
        }),
      updateUserData: (updates) =>
        set((state) => ({
          userData: {
            ...state.userData,
            ...updates,
          },
        })),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userData: state.userData,
        isUserDataSaved: state.isUserDataSaved,
        uuid: state.uuid, // Include UUID for persistence
      }),
    }
  )
);
