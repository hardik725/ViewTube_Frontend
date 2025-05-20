// src/context/AuthContext.js
import React, { createContext } from 'react';
const api = import.meta.env.api;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const logout = async () => {
    try{
    const response = await fetch(`${api}/users/logout`,{
        method: 'POST',
        headers: {
            "content-Type": "application/json"
        },
    });
    if (response.ok){
        localStorage.removeItem('user');
        window.location.href = '/'; // Or use navigate if inside component
    }else{
        alert("Unable to logout");
    }
    }
    catch(error){
        console.log(error);
    }
  };

  return (
    <AuthContext.Provider value={{ logout }}>
      {children}
    </AuthContext.Provider>
  );
};
