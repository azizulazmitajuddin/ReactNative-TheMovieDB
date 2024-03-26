import { create } from "zustand";

type UserType = {
  avatar?: any;
  id?: number;
  include_adult?: boolean;
  iso_3166_1?: string;
  iso_639_1?: string;
  name?: string;
  username?: string;
};

type UserData = {
  user: UserType;
  session?: string;
  isLoggedIn: boolean;
  setUser?: (obj: UserType) => void;
  setSession?: (str: string) => void;
  reset?: () => void;
};

const useUserStore = create<UserData>()((set) => ({
  user: {},
  session: null,
  isLoggedIn: false,
  setUser: (obj) => set(() => ({ user: obj, isLoggedIn: true })),
  setSession: (obj) => set(() => ({ session: obj, isLoggedIn: true })),
  reset: () =>
    set(() => ({
      user: {},
      isLoggedIn: false,
    })),
}));

export default useUserStore;
