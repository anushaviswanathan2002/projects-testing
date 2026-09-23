import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MemoryForm.css';

function MemoryForm({ memory, onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (memory) {
      setTitle(memory.title);
      setContent(memory.content);
    }
  }, [memory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (memory) {
        const response = await axios.put(`/api/memories/${memory.id}`, { title, content }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onSave({ ...response.data, id: memory.id, user_id: memory.user_id });
      } else {
        const response = await axios.post('/api/memories', { title, content }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onSave(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save memory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="memory-form-container">
      <form className="memory-form" onSubmit={handleSubmit}>
        <h2>{memory ? 'Edit Memory' : 'Create New Memory'}</h2>
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter memory title"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your memory here..."
            rows="8"
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="save-btn">
            {loading ? 'Saving...' : memory ? 'Update Memory' : 'Save Memory'}
          </button>
          <button type="button" onClick={onCancel} disabled={loading} className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default MemoryForm;
