const express = require('express');
const Book = require('../models/Book');
const protect = require('../middleware/auth');

const router = express.Router();

// All book routes require a logged-in user
router.use(protect);

// @route  GET /api/books?search=term
// Returns all books, or filtered by title/author if ?search= is provided
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};
    if (search && search.trim() !== '') {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const books = await Book.find(query).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch books', error: err.message });
  }
});

// @route  GET /api/books/:id
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch book', error: err.message });
  }
});

// @route  POST /api/books
router.post('/', async (req, res) => {
  try {
    const { title, author, category, status } = req.body;

    if (!title || !author || !category) {
      return res.status(400).json({ message: 'Title, author, and category are required' });
    }

    const book = await Book.create({
      title,
      author,
      category,
      status: status === 'Issued' ? 'Issued' : 'Available',
      addedBy: req.userId,
    });

    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add book', error: err.message });
  }
});

// @route  PUT /api/books/:id
router.put('/:id', async (req, res) => {
  try {
    const { title, author, category, status } = req.body;

    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (category !== undefined) book.category = category;
    if (status !== undefined) book.status = status;

    await book.save();
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update book', error: err.message });
  }
});

// @route  DELETE /api/books/:id
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete book', error: err.message });
  }
});

module.exports = router;
