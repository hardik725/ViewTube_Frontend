import React, { useEffect, useState } from 'react';
import VideoBoxLayout from '../Components/VideoBoxLayout/VideoBoxLayout';

const WatchHistory = () => {
  const [watchHistory, setWatchHistory] = useState([]);

  const getWatchHistory = async () => {
    try {
      const response = await fetch('https://viewtube-xam7.onrender.com/api/v1/users/UserWatchHistory', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
      });
      if (response.ok) {
        const output = await response.json();
        setWatchHistory(output.data.reverse());
      }
    } catch (error) {
      console.error("Error fetching watch history:", error);
    }
  };

  useEffect(() => {
    getWatchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f] px-6 py-8">
      <h1 className="text-3xl text-white font-bold mb-6 border-b border-gray-700 pb-2">
        Watch History
      </h1>

      {watchHistory && watchHistory.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {watchHistory.map((video, index) => (
            <VideoBoxLayout key={video._id || index} video={video} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-lg mt-4">You haven't watched any videos yet.</p>
      )}
    </div>
  );
};

export default WatchHistory;
