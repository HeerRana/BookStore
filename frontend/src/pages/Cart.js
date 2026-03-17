import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, Package } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleQuantityChange = (bookId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(bookId, newQuantity);
    }
  };

  const handleShippingChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    // Here you would typically send the order to backend
    setOrderPlaced(true);
    clearCart();
    setTimeout(() => {
      setOrderPlaced(false);
      setShowCheckout(false);
      setShippingInfo({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: ''
      });
    }, 3000);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-2xl mx-auto px-4 py-16">
          <div data-testid="order-success-message" className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-6 rounded-full">
                <Package className="w-16 h-16 text-green-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Order Placed Successfully!</h2>
            <p className="text-slate-600 text-lg mb-2">Thank you for your purchase.</p>
            <p className="text-slate-500">Your order will be delivered to your address soon.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-2xl mx-auto px-4 py-16">
          <div data-testid="empty-cart-message" className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-slate-100 p-6 rounded-full">
                <ShoppingBag className="w-16 h-16 text-slate-400" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Your cart is empty</h2>
            <p className="text-slate-600 mb-6">Add some books to get started!</p>
            <a
              href="/"
              data-testid="continue-shopping-link"
              className="inline-block bg-slate-800 hover:bg-slate-900 text-white font-semibold px-8 py-3 rounded-lg transition-all"
            >
              Continue Shopping
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Checkout</h2>
            <p className="text-slate-600 mb-8">Please provide your shipping details</p>

            <form onSubmit={handleCheckout} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    data-testid="checkout-fullname-input"
                    value={shippingInfo.fullName}
                    onChange={handleShippingChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    data-testid="checkout-email-input"
                    value={shippingInfo.email}
                    onChange={handleShippingChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  data-testid="checkout-phone-input"
                  value={shippingInfo.phone}
                  onChange={handleShippingChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Address *
                </label>
                <textarea
                  name="address"
                  data-testid="checkout-address-input"
                  value={shippingInfo.address}
                  onChange={handleShippingChange}
                  required
                  rows="3"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Enter your full address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    data-testid="checkout-city-input"
                    value={shippingInfo.city}
                    onChange={handleShippingChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    data-testid="checkout-state-input"
                    value={shippingInfo.state}
                    onChange={handleShippingChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="State"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    data-testid="checkout-zipcode-input"
                    value={shippingInfo.zipCode}
                    onChange={handleShippingChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="ZIP Code"
                  />
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-slate-50 rounded-xl p-6 mt-8">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Order Summary</h3>
                <div className="space-y-2">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-slate-600">{item.title} x {item.quantity}</span>
                      <span className="text-slate-800 font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-200 pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-slate-800">Total</span>
                      <span data-testid="checkout-total-price" className="text-lg font-bold text-slate-800">₹{getCartTotal()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCheckout(false)}
                  data-testid="checkout-back-button"
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-3 px-4 rounded-lg transition-all"
                >
                  Back to Cart
                </button>
                <button
                  type="submit"
                  data-testid="checkout-place-order-button"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all"
                >
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div
                key={item.id}
                data-testid={`cart-item-${item.id}`}
                className="bg-white rounded-xl shadow-md p-6 flex flex-col sm:flex-row gap-6"
              >
                {/* Book Image */}
                <div className="w-full sm:w-32 h-48 sm:h-40 flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Book Details */}
                <div className="flex-1">
                  <h3 data-testid={`cart-item-title-${item.id}`} className="text-xl font-bold text-slate-800 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-3">by {item.author}</p>
                  <p data-testid={`cart-item-price-${item.id}`} className="text-2xl font-bold text-slate-800 mb-4">
                    ₹{item.price}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        data-testid={`decrease-quantity-${item.id}`}
                        className="bg-slate-200 hover:bg-slate-300 p-2 rounded-lg transition-colors"
                      >
                        <Minus className="w-4 h-4 text-slate-700" />
                      </button>
                      <span data-testid={`cart-item-quantity-${item.id}`} className="text-lg font-semibold text-slate-800 w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        data-testid={`increase-quantity-${item.id}`}
                        className="bg-slate-200 hover:bg-slate-300 p-2 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4 text-slate-700" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      data-testid={`remove-from-cart-${item.id}`}
                      className="text-red-500 hover:text-red-700 font-medium flex items-center space-x-2 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{getCartTotal()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="border-t border-slate-200 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-xl font-bold text-slate-800">Total</span>
                    <span data-testid="cart-total-price" className="text-xl font-bold text-slate-800">₹{getCartTotal()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowCheckout(true)}
                data-testid="proceed-to-checkout-button"
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] mb-3"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={clearCart}
                data-testid="clear-cart-button"
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3 px-4 rounded-lg transition-all"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;