import React, { useEffect, useState } from 'react';
import VideoBoxLayout from '../Components/VideoBoxLayout/VideoBoxLayout';

const LikedVideos = () => {
  const [likedVideos, setLikedVideos] = useState({}); // Object: { date: [videos] }

  const getLikedVideos = async () => {
    try {
      const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/like/getVideos`, {
        method: 'POST',
        credentials: 'include'
      });
      if (response.ok) {
        const output = await response.json();
        const groupedByDate = {};

        output.data.forEach(video => {
          const date = new Date(video.createdAt).toLocaleDateString('en-CA'); // format: YYYY-MM-DD
          if (!groupedByDate[date]) {
            groupedByDate[date] = [];
          }
          groupedByDate[date].push(video);
        });

        setLikedVideos(groupedByDate);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLikedVideos();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f] px-6 py-8 text-white">
      <h1 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-2">
        Liked Videos
      </h1>

      {Object.keys(likedVideos)
        .sort((a, b) => new Date(b) - new Date(a)) // Sort by latest date first
        .map(date => (
          <div key={date} className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 border-b border-gray-600 pb-1">
              {new Date(date).toDateString()}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {likedVideos[date].map((video, index) => (
                <VideoBoxLayout key={video._id || index} video={video} />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default LikedVideos;
