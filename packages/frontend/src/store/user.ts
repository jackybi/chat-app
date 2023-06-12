import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import userAxios from '../axios/user';
interface UserStore {
  username: string | null;
  authToken: string | null;
  logout: () => void;
  isValid: () => Promise<boolean>;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<boolean>;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      username: null,
      authToken: null,
      logout() {
        set(() => ({
          username: null,
          authToken: null,
        }));
      },
      async isValid() {
        if (get().authToken) {
          const res = await userAxios.get('/auth/profile', {
            headers: {
              Authorization: `Bearer ${get().authToken}`,
            },
          });
          if (res.data.data?.username === get().username) return true;
          else {
            set({
              username: null,
              authToken: null,
            });
          }
        }
        return false;
      },
      async login(username: string, password: string) {
        try {
          const res = await userAxios.post('/auth/login', {
            username,
            password,
          });
          if (res.data.data?.token) {
            set({
              username,
              authToken: res.data.data?.token,
            });
          } else {
            throw new Error(res.data.msg);
          }
        } catch (e: any) {
          throw new Error(e.message);
        }
      },
      async register(username: string, password: string) {
        try {
          const res = await userAxios.post('/users/register', {
            username,
            password,
          });
          if (res.data.msg === 'success') {
            return true;
          } else {
            throw new Error(res.data.msg);
          }
        } catch (e: any) {
          throw new Error(e.message);
        }
      },
    }),
    { name: '@APP/CHAT_APP', version: 2 }
  )
);
