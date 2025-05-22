import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes, faBars } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider/AuthProvider';


const Navbar = () => {
  const [username, setUsername] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const {showSideBar, setShowSideBar, toggleSideBar} = useAuth();

  const handleSideBar = () => {
    toggleSideBar();
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const userDetail = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUsername(user.username);
      setUserAvatar(user.avatar);
    }
  }
  
  const setQuery = async (e) => {
    e.preventDefault();
    localStorage.setItem('query',JSON.stringify(searchText));
    setSearchText('');

    window.dispatchEvent(new Event('updatedQuery'));
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
  if(isMobile){
return (
  <div className="w-full bg-black shadow-md px-4 py-2 flex flex-col gap-2">
    {/* Top Row: Logo + Bars and Welcome */}
    <div className="flex justify-between items-center">
      {/* Left Side: Bars + Logo */}
      <div className="flex items-center gap-1">
        <FontAwesomeIcon
          icon={faBars}
          onClick={handleSideBar}
          className="w-5 h-5 text-white"
        />
        <img
          src="https://i.ibb.co/B5wvYWPN/Screenshot-2025-05-13-183427.png"
          alt="ViewTube Logo"
          className="h-12 w-auto"
        />
      </div>

      {/* Right Side: User Info */}
      <div className="flex items-center gap-2">
        {userAvatar && (
          <img
            src={userAvatar}
            alt="User Avatar"
            className="w-9 h-9 rounded-full object-cover border-2 border-blue-400 cursor-pointer"
            onClick={() => navigate("/user/userProfile")}
          />
        )}
        <div className='flex flex-col'>
        <span className="text-white font-medium text-xs truncate max-w-[100px]">
          Welcome,
        </span>
        <span className="text-white font-medium text-xs truncate max-w-[100px]">
          {username}
        </span>
        </div>
      </div>
    </div>

    {/* Search Bar Below */}
    <div className="w-full">
      <div className="flex items-center bg-[#111] text-white rounded-full px-3 py-1">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search videos..."
          className="bg-transparent outline-none flex-1 text-sm text-white placeholder-gray-400"
        />
        {searchText && (
          <button onClick={() => setSearchText("")} className="text-white p-1">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
        <button className="ml-1 text-white p-1" onClick={setQuery}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
    </div>
  </div>
);

  }else{
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
          <button className="ml-2 text-white p-2" onClick={setQuery}>
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
}
};

export default Navbar;
