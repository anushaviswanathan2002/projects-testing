import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useMemoryStore } from '../store/memoryStore';
import '../styles/MemoryForm.css';

export default function MemoryForm({ onClose }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const user = useAuthStore((state) => state.user);
  const addMemory = useMemoryStore((state) => state.addMemory);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      alert('Please fill in all fields');
      return;
    }

    addMemory(user.id, title, content);
    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <form className="memory-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Memory title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={100}
      />
      <textarea
        placeholder="What do you want to remember?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
      />
      <button type="submit" className="submit-btn">
        Save Memory
      </button>
    </form>
  );
}
