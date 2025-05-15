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
      const response = await fetch(`/api/video/getVideo?${params}`, {
        method: 'POST',
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
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 py-6">
      {/* Header */}
<div className="relative w-full max-w-6xl mx-auto mb-8 px-4">
  <div className="flex items-center justify-between bg-white/5 backdrop-blur-md border border-white/10 shadow-md p-4 rounded-xl">
    <div className="flex items-center gap-4">
      {userAvatar && (
        <img
          src={userAvatar}
          alt="User Avatar"
          className="w-12 h-12 rounded-full border-2 border-purple-500 shadow-sm object-cover"
        />
      )}
      <div>
        <h2 className="text-lg font-semibold text-white">Explore Videos</h2>
        <p className="text-sm text-gray-400">Based on your interests</p>
      </div>
    </div>

    <button
      onClick={logout}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow"
    >
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
