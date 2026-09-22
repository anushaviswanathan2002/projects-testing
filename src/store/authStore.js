import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  users: [], // In-memory user database
  login: (email, password) => {
    set((state) => {
      const user = state.users.find(u => u.email === email && u.password === password);
      if (user) {
        return { user: { email: user.email, username: user.username } };
      }
      return { user: null };
    });
  },
  signup: (username, email, password) => {
    set((state) => {
      const userExists = state.users.find(u => u.email === email);
      if (!userExists) {
        const newUser = { username, email, password };
        return { 
          users: [...state.users, newUser],
          user: { email, username }
        };
      }
      return { user: null };
    });
  },
  logout: () => set({ user: null }),
}));
