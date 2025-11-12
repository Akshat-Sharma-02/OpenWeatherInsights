// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load from localStorage (for Mongo users)
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(true);

  // Handle Firebase & Mongo user persistence
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        localStorage.setItem("user", JSON.stringify(firebaseUser));
      } else {
        const localUser = localStorage.getItem("user");
        setUser(localUser ? JSON.parse(localUser) : null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Unified logout (Firebase + Mongo)
  const logout = async () => {
    try {
      await signOut(auth); // Firebase logout
    } catch (err) {
      console.warn("Firebase logout skipped:", err.message);
    }
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to access Auth context
export const useAuth = () => useContext(AuthContext);