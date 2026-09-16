import { create } from 'zustand';

export const useMemoryStore = create((set) => ({
  memories: [],
  
  setMemories: (memories) => {
    set(() => ({ memories }));
  },
  
  addMemory: (userId, title, content) => {
    set((state) => {
      const newMemory = {
        id: Date.now().toString(),
        title,
        content,
        completed: false,
        createdAt: new Date().toISOString()
      };
      
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userIndex = users.findIndex((u) => u.id === userId);
      
      if (userIndex !== -1) {
        if (!users[userIndex].memories) {
          users[userIndex].memories = [];
        }
        users[userIndex].memories.push(newMemory);
        localStorage.setItem('users', JSON.stringify(users));
      }
      
      return { memories: [...state.memories, newMemory] };
    });
  },
  
  updateMemory: (userId, memoryId, updates) => {
    set((state) => {
      const updatedMemories = state.memories.map((m) =>
        m.id === memoryId ? { ...m, ...updates } : m
      );
      
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userIndex = users.findIndex((u) => u.id === userId);
      
      if (userIndex !== -1) {
        users[userIndex].memories = updatedMemories;
        localStorage.setItem('users', JSON.stringify(users));
      }
      
      return { memories: updatedMemories };
    });
  },
  
  deleteMemory: (userId, memoryId) => {
    set((state) => {
      const filteredMemories = state.memories.filter((m) => m.id !== memoryId);
      
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userIndex = users.findIndex((u) => u.id === userId);
      
      if (userIndex !== -1) {
        users[userIndex].memories = filteredMemories;
        localStorage.setItem('users', JSON.stringify(users));
      }
      
      return { memories: filteredMemories };
    });
  },
  
  loadUserMemories: (userId) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find((u) => u.id === userId);
    
    set(() => ({
      memories: user?.memories || []
    }));
  }
}));
