import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  users: JSON.parse(localStorage.getItem('users')) || [],
  isAuthenticated: !!localStorage.getItem('currentUser'),
  
  signup: (email, password) => {
    set((state) => {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userExists = users.some((u) => u.email === email);
      
      if (userExists) {
        throw new Error('User already exists');
      }
      
      const newUser = { 
        id: Date.now().toString(), 
        email, 
        password,
        memories: []
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      return { 
        user: { id: newUser.id, email: newUser.email }, 
        isAuthenticated: true,
        users 
      };
    });
  },
  
  login: (email, password) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find((u) => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    localStorage.setItem('currentUser', JSON.stringify({ id: user.id, email: user.email }));
    set(() => ({
      user: { id: user.id, email: user.email },
      isAuthenticated: true,
      users
    }));
  },
  
  logout: () => {
    localStorage.removeItem('currentUser');
    set(() => ({
      user: null,
      isAuthenticated: false
    }));
  },
  
  setUser: (user) => {
    set(() => ({
      user,
      isAuthenticated: !!user
    }));
  }
}));
