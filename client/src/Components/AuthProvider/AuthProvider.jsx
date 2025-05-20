// src/context/AuthContext.js
import React, { createContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
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
