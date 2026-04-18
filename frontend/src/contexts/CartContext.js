import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user, loading } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  const storageKey = user ? `bookHubCart:${user.id}` : null;

  const transformItems = (items) => {
    return items.map(item => ({
      id: item.book_id,
      title: item.title,
      author: item.author,
      price: Number(item.price),
      quantity: item.quantity,
      imageUrl: item.imageUrl || item.cover_image_url || item.image_url || '',
    }));
  };

  useEffect(() => {
    const loadCart = async () => {
      if (loading) {
        return;
      }

      if (!user) {
        setCartItems([]);
        localStorage.removeItem('bookHubCart');
        return;
      }

      try {
        const response = await api.get('/cart');
        setCartItems(transformItems(response.data.items || []));
      } catch (error) {
        const storedCart = storageKey ? localStorage.getItem(storageKey) : null;
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        } else {
          setCartItems([]);
        }
      }
    };

    loadCart();
  }, [loading, storageKey, user]);

  useEffect(() => {
    if (!storageKey) {
      return;
    }

    localStorage.setItem(storageKey, JSON.stringify(cartItems));
  }, [cartItems, storageKey]);

  const refreshCart = async () => {
    try {
      const response = await api.get('/cart');
      setCartItems(transformItems(response.data.items || []));
    } catch (error) {
      console.error('Failed to refresh cart:', error);
    }
  };

  const addToCart = async (book) => {
    try {
      await api.post('/cart/add', { book_id: book.id, quantity: 1 });
      await refreshCart();
      return { success: true };
    } catch (error) {
      console.error('Add to cart error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Could not add to cart',
      };
    }
  };

  const removeFromCart = async (bookId) => {
    try {
      await api.delete(`/cart/remove/${bookId}`);
      await refreshCart();
      return { success: true };
    } catch (error) {
      console.error('Remove from cart error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Could not remove item',
      };
    }
  };

  const updateQuantity = async (bookId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(bookId);
      return;
    }

    try {
      await api.put(`/cart/update/${bookId}`, { quantity });
      await refreshCart();
      return { success: true };
    } catch (error) {
      console.error('Update cart quantity error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Could not update quantity',
      };
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart/clear');
      setCartItems([]);
      return { success: true };
    } catch (error) {
      console.error('Clear cart error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Could not clear cart',
      };
    }
  };

  const placeOrder = async ({ shipping_address, billing_address, payment_method }) => {
    try {
      await api.post('/orders/create', { shipping_address, billing_address, payment_method });
      await refreshCart();
      return { success: true };
    } catch (error) {
      console.error('Place order error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Could not place order',
      };
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      placeOrder
    }}>
      {children}
    </CartContext.Provider>
  );
};
