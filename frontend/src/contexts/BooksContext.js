import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const BooksContext = createContext();

export const useBooks = () => {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error('useBooks must be used within BooksProvider');
  }
  return context;
};

const initialBooks = [
  {
    id: 1,
    title: 'Atomic Habits',
    author: 'James Clear',
    price: 499,
    stock: 20,
    category: 'Self-Help',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop'
  },
  {
    id: 2,
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    price: 399,
    stock: 15,
    category: 'Fiction',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop'
  },
  {
    id: 3,
    title: 'Deep Work',
    author: 'Cal Newport',
    price: 450,
    stock: 12,
    category: 'Productivity',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop'
  },
  {
    id: 4,
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    price: 599,
    stock: 18,
    category: 'History',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop'
  },
  {
    id: 5,
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    price: 425,
    stock: 25,
    category: 'Finance',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop'
  },
  {
    id: 6,
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    price: 550,
    stock: 10,
    category: 'Psychology',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop'
  }
];

export const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);

  const transformBook = (book) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    price: Number(book.price),
    stock: Number(book.stock_quantity ?? book.stock ?? 0),
    category: book.category_name || book.category || 'General',
    rating: book.rating ?? 4.5,
    imageUrl: book.cover_image_url || book.imageUrl || book.image_url || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
    description: book.description || '',
  });

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const response = await api.get('/books');
        const fetchedBooks = (response.data.books || []).map(transformBook);
        setBooks(fetchedBooks);
        localStorage.setItem('bookHubBooks', JSON.stringify(fetchedBooks));
      } catch (error) {
        const storedBooks = localStorage.getItem('bookHubBooks');
        if (storedBooks) {
          setBooks(JSON.parse(storedBooks));
        } else {
          setBooks(initialBooks);
          localStorage.setItem('bookHubBooks', JSON.stringify(initialBooks));
        }
      }
    };

    loadBooks();
  }, []);

  const addBook = (book) => {
    const newBook = {
      ...book,
      id: Date.now(),
    };
    const updatedBooks = [...books, newBook];
    setBooks(updatedBooks);
    localStorage.setItem('bookHubBooks', JSON.stringify(updatedBooks));
    return newBook;
  };

  const updateBook = (id, updatedBook) => {
    const updatedBooks = books.map(book =>
      book.id === id ? { ...book, ...updatedBook } : book
    );
    setBooks(updatedBooks);
    localStorage.setItem('bookHubBooks', JSON.stringify(updatedBooks));
  };

  const deleteBook = (id) => {
    const updatedBooks = books.filter(book => book.id !== id);
    setBooks(updatedBooks);
    localStorage.setItem('bookHubBooks', JSON.stringify(updatedBooks));
  };

  const getBookById = (id) => {
    return books.find(book => book.id === id);
  };

  return (
    <BooksContext.Provider value={{
      books,
      addBook,
      updateBook,
      deleteBook,
      getBookById
    }}>
      {children}
    </BooksContext.Provider>
  );
};
