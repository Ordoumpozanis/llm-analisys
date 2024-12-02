// stores/userStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type UserState = {
  userData: Record<string, any> | null;
  isUserDataSaved: boolean;
  saveUserData: (data: Record<string, any>) => void;
  resetUserData: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userData: null,
      isUserDataSaved: false,
      saveUserData: (data) =>
        set({
          userData: data,
          isUserDataSaved: true,
        }),
      resetUserData: () =>
        set({
          userData: null,
          isUserDataSaved: false,
        }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
