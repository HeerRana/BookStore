import React, { useState } from 'react';
import { useBooks } from '../contexts/BooksContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Search, Star, ShoppingCart, Filter } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  const { books } = useBooks();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(books.map(book => book.category))];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (book) => {
    if (book.stock > 0) {
      addToCart(book);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <Navbar />
      
      {/* Main Content */}
      <div className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 text-white py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Discover Your Next Read
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-8">
                Premium collection of books ready for purchase.
              </p>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  data-testid="search-books-input"
                placeholder="Search by title, author, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-none outline-none text-slate-800 text-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-800">Filter by Category</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category}
                data-testid={`category-filter-${category.toLowerCase()}`}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-slate-800 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div data-testid="no-books-message" className="text-center py-16">
            <p className="text-xl text-slate-500">No books found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map(book => (
              <div
                key={book.id}
                data-testid={`book-card-${book.id}`}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
              >
                {/* Book Image */}
                <div className="h-64 overflow-hidden bg-slate-100">
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    data-testid={`book-image-${book.id}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Book Details */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Category Badge */}
                  <div className="mb-3">
                    <span data-testid={`book-category-${book.id}`} className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                      {book.category}
                    </span>
                  </div>

                  {/* Title & Author */}
                  <h3 data-testid={`book-title-${book.id}`} className="text-xl font-bold text-slate-800 mb-2 line-clamp-2">
                    {book.title}
                  </h3>
                  <p data-testid={`book-author-${book.id}`} className="text-slate-600 text-sm mb-3">
                    by {book.author}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span data-testid={`book-rating-${book.id}`} className="ml-1 text-sm font-semibold text-slate-700">
                      {book.rating}
                    </span>
                  </div>

                  <div className="mt-auto">
                    {/* Price & Stock */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p data-testid={`book-price-${book.id}`} className="text-2xl font-bold text-slate-800">
                          ₹{book.price}
                        </p>
                        <p data-testid={`book-stock-${book.id}`} className={`text-xs ${
                          book.stock > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
                        </p>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    {user && (
                      <button
                        onClick={() => handleAddToCart(book)}
                        data-testid={`add-to-cart-button-${book.id}`}
                        disabled={book.stock === 0}
                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${
                          book.stock > 0
                            ? 'bg-slate-800 hover:bg-slate-900 text-white transform hover:scale-[1.02] active:scale-[0.98]'
                            : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>{book.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Home;