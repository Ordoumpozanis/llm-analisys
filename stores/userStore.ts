// stores/userStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type UserState = {
  userData: Record<string, any> | null;
  isUserDataSaved: boolean;
  analysed: boolean; // Non-persistent state
  uuid: string | null; // Persistent UUID
  sessionID: string | null; // Non-persistent session ID
  tutorialOn: boolean;
  chatInfo: Record<string, any> | null;

  saveUserData: (data: Record<string, any>) => void;
  resetUserData: () => void;
  setAnalysed: (value: boolean) => void;
  setUuid: (id: string) => void; // Setter for UUID
  setTutorialON: (value: boolean) => void; // Setter for tutorial
  setSessionID: (id: string | null) => void; // Setter for session ID
  updateUserData: (
    updates: Partial<
      Pick<Record<string, any>, "chatType" | "chatPurpose" | "consent">
    >
  ) => void;
  saveChatInfo: (data: Record<string, any>) => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userData: null,
      isUserDataSaved: false,
      analysed: false, // Default value, will not be persisted
      uuid: null, // Default UUID value
      sessionID: null, // Default session ID value, non-persistent
      tutorialOn: true,
      chatInfo: null,

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
          tutorialOn: true,
        }),

      setAnalysed: (value) => set({ analysed: value }),
      setUuid: (id: string) =>
        set({
          uuid: id,
        }),
      setTutorialON: (value) => set({ tutorialOn: value }),
      setSessionID: (id: string | null) =>
        set({
          sessionID: id,
        }),
      updateUserData: (updates) =>
        set((state) => ({
          userData: {
            ...state.userData,
            ...updates,
          },
        })),
      saveChatInfo: (data) =>
        set({
          chatInfo: data,
        }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userData: state.userData,
        isUserDataSaved: state.isUserDataSaved,
        uuid: state.uuid,
      }),
    }
  )
);
