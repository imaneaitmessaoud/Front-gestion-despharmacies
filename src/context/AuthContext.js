// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const email = localStorage.getItem("email");

    if (token && email) {
      setUser({ token, email });
    }
  }, []);

  const login = (accessToken, email) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("email", email);
    setUser({ token: accessToken, email });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
