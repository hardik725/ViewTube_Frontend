import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthProvider/AuthProvider';
import VideoBoxLayout from '../VideoBoxLayout/VideoBoxLayout';
import { Link } from 'react-router-dom';
import {
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const Home = () => {
  const [username, setUsername] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [videoFiles, setVideoFiles] = useState([]);
  const [page, setPage] = useState(1);
  const { logout } = useContext(AuthContext);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortType, setSortType] = useState('desc');
  const [loggingOut, setLoggingOut] = useState(false);
const handleLogout = () => {
  setLoggingOut(true);
  logout();
}

  const getVideoFiles = async () => {
    const givenQuery = JSON.parse(localStorage.getItem('query'));
    let query = '';
    if (givenQuery) {
      query = givenQuery;
      localStorage.removeItem('query');
    }

    const params = new URLSearchParams({
      query: query,
      page: page,
      limit: 12,
      sortBy: sortBy,
      sortType: sortType,
    });

    try {
      const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/video/getVideo?${params}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
        }
      });

      const output = await response.json();
      setVideoFiles(output.data);
    } catch (error) {
      console.error("Failed to fetch videos:", error);
    }
  };

  useEffect(() => {
    getVideoFiles();

    const updateVideoFiles = () => {
      getVideoFiles();
    };

    window.addEventListener('updatedQuery', updateVideoFiles);

    return () => {
      window.removeEventListener('updatedQuery', updateVideoFiles);
    };
  }, [page,sortBy,sortType]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUsername(user.username);
      setUserAvatar(user.avatar);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white md:px-4 px-2 py-6">
      {/* Header */}
<div className="relative w-full md:max-w-6xl mx-auto mb-4">
  <div className="flex items-center justify-between bg-white/5 backdrop-blur-md border border-white/10 shadow-md p-2 rounded-xl">
    <div className="flex items-center gap-4">
      {userAvatar && (
        <img
          src={userAvatar}
          alt="User Avatar"
          className="w-12 h-12 rounded-full border-2 border-purple-500 shadow-sm object-cover"
        />
      )}
      <div>
        <h2 className="md:text-lg text-sm font-semibold text-white">Explore Videos</h2>
        <p className="md:text-sm text-xs text-gray-400">Based on your interests</p>
      </div>
    </div>

<button
  onClick={handleLogout}
  className="relative inline-flex items-center justify-center overflow-hidden text-white rounded-xl px-2 py-2 text-[12px] font-semibold transition-all duration-300 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl group"
>
  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></span>
  {
    loggingOut ? (
      <>
      <FontAwesomeIcon
      icon={faSpinner}
      spin
      />
      Logging Out
      </>
    ) : (
      <>
      Logout 
      </>
    )
  }
</button>

  </div>
</div>

<div className="flex flex-row gap-4 md:gap-6 text-gray-800 mb-6 md:items-center">
  <div className="flex flex-col w-full md:w-auto">
    <label htmlFor="sortBy" className="mb-1 text-sm font-medium text-white">Sort By</label>
    <select
      id="sortBy"
      name="sortBy"
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      className="px-4 py-2 w-full md:w-48 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
    >
      <option value="duration">Duration</option>
      <option value="createdAt">Created At</option>
      <option value="views">Views</option>
    </select>
  </div>

  <div className="flex flex-col w-full md:w-auto">
    <label htmlFor="sortType" className="mb-1 text-sm font-medium text-white">Order</label>
    <select
      id="sortType"
      name="sortType"
      value={sortType}
      onChange={(e) => setSortType(e.target.value)}
      className="px-4 py-2 w-full md:w-48 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
    >
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
    </select>
  </div>
</div>

      {/* Videos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videoFiles.map((video, index) => (
          <VideoBoxLayout key={video._id || index} video={video} />
        ))}
      </div>

      {/* Pagination (optional) */}
      <div className="flex justify-center mt-10 gap-4">
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
        >
          Previous
        </button>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
