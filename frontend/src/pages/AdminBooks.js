import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBooks } from '../contexts/BooksContext';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AdminBooks = () => {
  const { isAdmin } = useAuth();
  const { books, addBook, updateBook, deleteBook } = useBooks();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    stock: '',
    category: '',
    rating: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      price: '',
      stock: '',
      category: '',
      rating: '',
      imageUrl: ''
    });
    setEditingBook(null);
    setFormError('');
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      price: book.price.toString(),
      stock: book.stock.toString(),
      category: book.category,
      rating: book.rating.toString(),
      imageUrl: book.imageUrl
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const bookData = {
      title: formData.title,
      author: formData.author,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category: formData.category,
      rating: parseFloat(formData.rating),
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop'
    };

    const result = editingBook
      ? await updateBook(editingBook.id, bookData)
      : await addBook(bookData);

    if (!result.success) {
      setFormError(result.message || 'Unable to save book. Please check the backend connection.');
      return;
    }

    resetForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    const result = await deleteBook(id);
    if (!result.success) {
      setFormError(result.message || 'Unable to delete book. Please check the backend connection.');
    }
  };

  if (!isAdmin()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Book Management</h1>
            <p className="text-slate-600">Add, edit, or remove books from the store</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            data-testid="add-book-button"
            className="bg-slate-800 hover:bg-slate-900 text-white font-semibold px-6 py-3 rounded-lg transition-all flex items-center space-x-2 transform hover:scale-[1.02]"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Book</span>
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">
                  {editingBook ? 'Edit Book' : 'Add New Book'}
                </h2>
                <button
                  onClick={resetForm}
                  data-testid="close-form-button"
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {formError}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    data-testid="book-title-input"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter book title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Author *
                  </label>
                  <input
                    type="text"
                    name="author"
                    data-testid="book-author-input"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter author name"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      data-testid="book-price-input"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Stock *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      data-testid="book-stock-input"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Category *
                    </label>
                    <input
                      type="text"
                      name="category"
                      data-testid="book-category-input"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="e.g., Fiction, Self-Help"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Rating *
                    </label>
                    <input
                      type="number"
                      name="rating"
                      data-testid="book-rating-input"
                      value={formData.rating}
                      onChange={handleInputChange}
                      required
                      min="0"
                      max="5"
                      step="0.1"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="0.0 - 5.0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    data-testid="book-image-url-input"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-slate-500 mt-1">Leave empty for default image</p>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-3 px-4 rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    data-testid="save-book-button"
                    className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingBook ? 'Update Book' : 'Add Book'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Books Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Book</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Author</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Rating</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {books.map(book => (
                  <tr key={book.id} data-testid={`admin-book-row-${book.id}`} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={book.imageUrl}
                          alt={book.title}
                          className="w-12 h-16 object-cover rounded"
                        />
                        <span data-testid={`admin-book-title-${book.id}`} className="font-medium text-slate-800">{book.title}</span>
                      </div>
                    </td>
                    <td data-testid={`admin-book-author-${book.id}`} className="px-6 py-4 text-slate-600">{book.author}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {book.category}
                      </span>
                    </td>
                    <td data-testid={`admin-book-price-${book.id}`} className="px-6 py-4 text-slate-800 font-semibold">₹{book.price}</td>
                    <td data-testid={`admin-book-stock-${book.id}`} className="px-6 py-4">
                      <span className={`font-semibold ${
                        book.stock > 10 ? 'text-green-600' : book.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {book.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-800 font-medium">{book.rating}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleEdit(book)}
                          data-testid={`edit-book-button-${book.id}`}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          data-testid={`delete-book-button-${book.id}`}
                          className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminBooks;