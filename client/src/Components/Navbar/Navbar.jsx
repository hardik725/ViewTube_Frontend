import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes, faBars, faBell } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthProvider/AuthProvider';
import { io } from 'socket.io-client';

const socket = io("https://viewtube-xam7.onrender.com");
const Navbar = () => {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const {showSideBar, setShowSideBar, toggleSideBar} = useAuth();
  const [notification, setNotification] = useState([]);
  const [unread, setUnread] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

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

const getNotification = async (userId) => {
  try {
    const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/notification/getNotification`, {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      const output = await response.json();
      setNotification(output.data.reverse());

      // Filter unread notifications and update the unread state
      const unread = output.data.filter(notification => notification.read === false);
      setUnread(unread); // Assuming setUnread is defined
    }
  } catch (error) {
    console.log(error);
  }
};

const handleRead = async (notId, index) => {
  try {
    const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/notification/mark/${notId}`, {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      setNotification((prev) => {
        const updated = [...prev];
        if (updated?.[index]) {
          updated[index] = { ...updated[index], read: true };
        }
        return updated;
      });

      setUnread((prev) => prev.filter(note => note._id !== notId));
      alert("Notification has been marked Read");
    }
  } catch (error) {
    alert("Unable to mark the Notification as read");
    console.error(error);
  }
};



  const userDetail = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUsername(user.username);
      setUserAvatar(user.avatar);
      setUserId(user._id);
      getNotification(user._id);
    }
  }
  
  const setQuery = async (e) => {
    e.preventDefault();
    localStorage.setItem('query',JSON.stringify(searchText));
    setSearchText('');
    window.dispatchEvent(new Event('updatedQuery'));
    navigate("/user");
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

useEffect(() => {

  const handleMessage = (message) => {
    if(message.reciever === userId){
      getNotification(userId);
    }
  };

  socket.on("rnotification", handleMessage);

  return () => {
    socket.off("rnotification", handleMessage);
  };
}, [username]);
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
          onClick={() => {navigate("/user")}}
        />
      </div>

      {/* Right Side: User Info */}
      <div className="flex items-center gap-2">
  <div className="relative">
    <FontAwesomeIcon
      icon={faBell}
      className="text-white w-8 h-8"
      onClick={() => setShowNotification(prev => !prev)}
    />
    {unread.length > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
        {unread.length}
      </span>
    )}
  </div>
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
{showNotification && (
  <div className="absolute top-[100%] right-0 w-full bg-[#111] text-white px-2 py-4 shadow-lg z-50">
    <h2 className="text-xl font-semibold mb-4">Notifications</h2>
    {notification.length === 0 ? (
      <p className="text-gray-400">No notifications found.</p>
    ) : (
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
<table className="min-w-full table-auto border-collapse text-sm">
  <tbody>
    {notification.map((note, index) => (
      <tr key={note._id} className="hover:bg-gray-700">
        <td className="px-1 py-2 border-b border-gray-700 flex gap-2 items-center">
          <img
            src={note.senderAvatar}
            alt="user_avatar"
            className="w-6 h-6 rounded-full"
          />
          {note.senderName}
        </td>
        <td className="px-1 py-2 border-b border-gray-700">
          {note.purpose === "subscription" && (
            <Link to={`/user/channelPage/${note.senderUsername}`}>
            <div>
              <span className="font-medium">{note.senderUsername},</span> has
              subscribed to your channel
            </div>
            </Link>
          )}
          {note.purpose === "message" && (
            <Link to={`/user/chatbox/${note.senderId}`}>
            <div>
              <span className="font-medium">{note.senderUsername},</span> has
              messaged you.
            </div>
            </Link>
          )}
        </td>
        <td className="px-1 py-2 border-b border-gray-700">
          {note.read ? (
            <span className="text-green-400">Read</span>
          ) : (
            <span
              className="text-red-400 hover:underline cursor-pointer"
              onClick={() => handleRead(note._id, index)}
            >
              Mark Read
            </span>
          )}
        </td>
      </tr>
    ))}
  </tbody>
</table>
      </div>
    )}
  </div>
)}
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
      onClick={() => {navigate("/user")}}
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
<div className="flex items-center gap-3 relative">
  <div className="relative">
    <FontAwesomeIcon
      icon={faBell}
      className="text-white w-8 h-8"
      onClick={() => setShowNotification(prev => !prev)}
    />
    {unread.length > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
        {unread.length}
      </span>
    )}
  </div>

  {userAvatar && (
    <img
      src={userAvatar}
      alt="User Avatar"
      className="w-10 h-10 rounded-full object-cover border-2 border-blue-400 hover:cursor-pointer"
      onClick={() => navigate("/user/userProfile")}
    />
  )}

  <span className="text-white font-medium text-lg">
    Welcome, {username}
  </span>
</div>
{showNotification && (
  <div className="absolute top-[100%] right-0 w-2/5 bg-[#111] text-white px-6 py-4 shadow-lg z-50">
    <h2 className="text-xl font-semibold mb-4">Notifications</h2>
    {notification.length === 0 ? (
      <p className="text-gray-400">No notifications found.</p>
    ) : (
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
<table className="min-w-full table-auto border-collapse">
  <tbody>
    {notification.map((note, index) => (
      <tr key={note._id} className="hover:bg-gray-700">
        <td className="px-1 py-2 border-b border-gray-700 flex gap-2 items-center">
          <img
            src={note.senderAvatar}
            alt="user_avatar"
            className="w-6 h-6 rounded-full"
          />
          {note.senderName}
        </td>
        <td className="px-1 py-2 border-b border-gray-700">
          {note.purpose === "subscription" && (
            <Link to={`/user/channelPage/${note.senderUsername}`}>
            <div>
              <span className="font-medium">{note.senderUsername},</span> has
              subscribed to your channel
            </div>
            </Link>
          )}
          {note.purpose === "message" && (
            <Link to={`/user/chatbox/${note.senderId}`}>
            <div>
              <span className="font-medium">{note.senderUsername},</span> has
              messaged you.
            </div>
            </Link>
          )}
        </td>
        <td className="px-1 py-2 border-b border-gray-700">
          {note.read ? (
            <span className="text-green-400">Read</span>
          ) : (
            <span
              className="text-red-400 hover:underline cursor-pointer"
              onClick={() => handleRead(note._id, index)}
            >
              Mark Read
            </span>
          )}
        </td>
      </tr>
    ))}
  </tbody>
</table>
      </div>
    )}
  </div>
)}

</div>
  );
}
};

export default Navbar;
