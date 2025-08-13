// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [showSideBar, setShowSideBar] = useState(false);
  const [user, setUser] = useState(null);
  const toggleSideBar = () => setShowSideBar(prev => !prev);
  const login = (userData) => {
    setUser(userData);
  };  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const logout = async () => {
    try{
    const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/users/logout`,{
        method: 'POST',
        credentials: 'include',
        headers: {
            "content-Type": "application/json"
        },
    });
    if (response.ok){
        setUser(null);
        localStorage.removeItem('user');
        window.location.href = '/';
    }else{
        alert("Unable to logout");
    }
    }
    catch(error){
        console.log(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        logout,
        showSideBar,
        setShowSideBar,
        toggleSideBar,
        user,
        login
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
