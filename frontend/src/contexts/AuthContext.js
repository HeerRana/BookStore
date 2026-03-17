import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(() => {
    // Initialize users synchronously
    const storedUsers = localStorage.getItem('bookHubUsers');
    if (storedUsers) {
      return JSON.parse(storedUsers);
    } else {
      // Initialize with admin user
      const defaultUsers = [
        { email: 'admin@gmail.com', password: 'admin', name: 'Admin User' }
      ];
      localStorage.setItem('bookHubUsers', JSON.stringify(defaultUsers));
      return defaultUsers;
    }
  });

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('bookHubUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const register = (email, password, name) => {
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return { success: false, message: 'User already exists' };
    }

    const newUser = { email, password, name };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('bookHubUsers', JSON.stringify(updatedUsers));
    
    return { success: true, message: 'Registration successful' };
  };

  const login = (email, password) => {
    console.log('Login attempt:', { email, password, usersCount: users.length });
    console.log('Available users:', users);
    const foundUser = users.find(u => u.email === email && u.password === password);
    console.log('Found user:', foundUser);

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('bookHubUser', JSON.stringify(foundUser));
      console.log('Login successful');
      return { success: true, user: foundUser };
    }
    console.log('Login failed');
    return { success: false, message: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bookHubUser');
  };

  const isAdmin = () => {
    return user?.email === 'admin@gmail.com';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};