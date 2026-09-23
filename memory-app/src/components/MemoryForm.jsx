import { useState, useEffect } from 'react'
import '../styles/MemoryForm.css'

export default function MemoryForm({ onSubmit, initialMemory, onCancel }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('general')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialMemory) {
      setTitle(initialMemory.title)
      setContent(initialMemory.content)
      setCategory(initialMemory.category)
    }
  }, [initialMemory])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      alert('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      await onSubmit({ title, content, category })
      setTitle('')
      setContent('')
      setCategory('general')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="memory-form">
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Memory title"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your memory here..."
          rows="5"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select 
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="general">General</option>
          <option value="personal">Personal</option>
          <option value="work">Work</option>
          <option value="ideas">Ideas</option>
          <option value="goals">Goals</option>
        </select>
      </div>

      <div className="form-actions">
        <button 
          type="submit" 
          disabled={loading}
          className="btn-submit"
        >
          {loading ? 'Saving...' : initialMemory ? 'Update Memory' : 'Create Memory'}
        </button>
        <button 
          type="button"
          onClick={onCancel}
          className="btn-cancel"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
