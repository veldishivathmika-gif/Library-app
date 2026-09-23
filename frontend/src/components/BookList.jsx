export default function BookList({ books, onEdit, onDelete, onToggleStatus }) {
  if (books.length === 0) {
    return <p>No books found. Add one above to get started.</p>;
  }

  return (
    <div className="card">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book._id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.category}</td>
              <td>
                <span
                  className={`status-badge ${
                    book.status === 'Available' ? 'status-available' : 'status-issued'
                  }`}
                  onClick={() => onToggleStatus(book)}
                  style={{ cursor: 'pointer' }}
                  title="Click to toggle status"
                >
                  {book.status}
                </span>
              </td>
              <td>
                <button className="btn btn-small" onClick={() => onEdit(book)}>Edit</button>
                <button className="btn btn-danger btn-small" onClick={() => onDelete(book._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
