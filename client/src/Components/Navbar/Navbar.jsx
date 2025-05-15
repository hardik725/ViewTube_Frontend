import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [username, setUsername] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const userDetail = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUsername(user.username);
      setUserAvatar(user.avatar);
    }
  }

  useEffect(() => {
    userDetail();
    const handleUserUpdate = () => {
    userDetail(); // refresh when event is triggered
  };

  window.addEventListener('userUpdated', handleUserUpdate);
  // Cleanup
  return () => {
    window.removeEventListener('userUpdated', handleUserUpdate);
  };

  }, []);

  return (
<div className="w-full bg-black shadow-md px-6 py-2 flex justify-between items-center">

  {/* Logo Section */}
  <div className="flex items-center">
    <img
      src="https://i.ibb.co/B5wvYWPN/Screenshot-2025-05-13-183427.png"
      alt="ViewTube Logo"
      className="h-20 w-auto"
    />
  </div>

  {/* Search Section */}
      <div className="flex-1 mx-10">
        <div className="flex items-center bg-[#111] text-white rounded-full px-4 py-2">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search videos..."
            className="bg-transparent outline-none flex-1 text-white placeholder-gray-400"
          />
          {searchText && (
            <button onClick={() => {setSearchText('')}} className="text-white p-2">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
          <button className="ml-2 text-white p-2">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </div>

  {/* User Info Section */}
  <div className="flex items-center gap-3">
    {userAvatar && (
      <img
        src={userAvatar}
        alt="User Avatar"
        className="w-10 h-10 rounded-full object-cover border-2 border-blue-400 hover:cursor-pointer"
        onClick={()=> {navigate("/user/userProfile")}}
      />
    )}
    <span className="text-white font-medium text-lg">
      Welcome, {username}
    </span>
  </div>
</div>


  );
};

export default Navbar;
