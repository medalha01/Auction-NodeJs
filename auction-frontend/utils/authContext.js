// utils/authContext.js

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setAuthToken(token);
  }, []);

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}