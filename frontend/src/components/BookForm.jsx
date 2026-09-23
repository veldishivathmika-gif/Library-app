import { useState, useEffect } from 'react';

const emptyForm = { title: '', author: '', category: '', status: 'Available' };

export default function BookForm({ onSubmit, editingBook, onCancelEdit }) {
  const [form, setForm] = useState(emptyForm);

  // When a book is selected for editing, populate the form
  useEffect(() => {
    if (editingBook) {
      setForm({
        title: editingBook.title,
        author: editingBook.author,
        category: editingBook.category,
        status: editingBook.status,
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingBook]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
    if (!editingBook) setForm(emptyForm);
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3>{editingBook ? 'Edit Book' : 'Add a New Book'}</h3>
      <div className="form-group">
        <label>Title</label>
        <input name="title" value={form.title} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Author</label>
        <input name="author" value={form.author} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Category</label>
        <input name="category" value={form.category} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Status</label>
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="Available">Available</option>
          <option value="Issued">Issued</option>
        </select>
      </div>
      <button className="btn" type="submit">
        {editingBook ? 'Save Changes' : 'Add Book'}
      </button>
      {editingBook && (
        <button type="button" className="btn btn-secondary btn-small" onClick={onCancelEdit}>
          Cancel
        </button>
      )}
    </form>
  );
}
