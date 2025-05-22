import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthProvider/AuthProvider';
import VideoBoxLayout from '../VideoBoxLayout/VideoBoxLayout';
import { Link } from 'react-router-dom';

const Home = () => {
  const [username, setUsername] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [videoFiles, setVideoFiles] = useState([]);
  const [page, setPage] = useState(1);
  const { logout } = useContext(AuthContext);

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
  }, [page]);

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
<div className="relative w-full md:max-w-6xl mx-auto mb-8">
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
  onClick={logout}
  className="relative inline-flex items-center justify-center overflow-hidden text-white rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl group"
>
  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></span>
  Logout
</button>

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
