import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import BookForm from '../components/BookForm';
import BookList from '../components/BookList';

export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [editingBook, setEditingBook] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchBooks = useCallback(async (searchTerm = '') => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/books', { params: searchTerm ? { search: searchTerm } : {} });
      setBooks(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load books');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  async function handleAddOrUpdate(form) {
    try {
      if (editingBook) {
        await api.put(`/books/${editingBook._id}`, form);
        setEditingBook(null);
      } else {
        await api.post('/books', form);
      }
      fetchBooks(search);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save book');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this book?')) return;
    try {
      await api.delete(`/books/${id}`);
      fetchBooks(search);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete book');
    }
  }

  async function handleToggleStatus(book) {
    try {
      const newStatus = book.status === 'Available' ? 'Issued' : 'Available';
      await api.put(`/books/${book._id}`, { status: newStatus });
      fetchBooks(search);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    fetchBooks(search);
  }

  return (
    <div className="container">
      <BookForm
        onSubmit={handleAddOrUpdate}
        editingBook={editingBook}
        onCancelEdit={() => setEditingBook(null)}
      />

      <form className="search-row" onSubmit={handleSearchSubmit}>
        <input
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn" type="submit">Search</button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setSearch('');
            fetchBooks('');
          }}
        >
          Clear
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p>Loading books...</p>
      ) : (
        <BookList
          books={books}
          onEdit={setEditingBook}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      )}
    </div>
  );
}
