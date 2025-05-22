import React, { useEffect, useState } from 'react';
import VideoBoxLayout from '../VideoBoxLayout/VideoBoxLayout';

const Subscription = () => {
  const [subChannelId, setSubChannelId] = useState([]);
  const [videos, setVideos] = useState([]);
  const [subscribedChannel, setSubscribedChannel] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
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

  const getVideos = async (channelIds) => {
    try {
      const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/video/getChannelVideo`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ channels: channelIds })
      });

      if (response.ok) {
        const output = await response.json();
        setVideos(output.data);
        console.log("Subscribed channel videos: ", output.data);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  useEffect(() => {
    const subChannels = JSON.parse(localStorage.getItem('sub-channels'));
    if (subChannels) {
      const ids = subChannels.map(channel => channel._id);
      setSubChannelId(ids);
      setSubscribedChannel(subChannels);
    }
  }, []);

  useEffect(() => {
    if (subChannelId.length > 0) {
      getVideos(subChannelId);
    }
  }, [subChannelId]);

if (isMobile) {
  return (
    <div className="min-h-screen bg-[#0f0f0f] px-4 py-4 text-white overflow-y-auto">
      <h1 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">
        Subscribed Channels
      </h1>

      {videos && videos.length > 0 ? (
        <div className="space-y-6">
          {videos.map((channel, idx) => (
            <div key={idx} className="bg-[#1a1a1a] rounded-xl p-4 shadow-md">
              {subscribedChannel[idx] && (
                <div className="flex items-center mb-3">
                  <img
                    src={subscribedChannel[idx].avatar}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover border border-white shadow-sm"
                  />
                  <div className="ml-3">
                    <h2 className="text-base font-semibold text-white truncate">{subscribedChannel[idx].fullname}</h2>
                    <p className="text-xs text-gray-400">@{subscribedChannel[idx].username}</p>
                  </div>
                </div>
              )}

              {channel.videos && channel.videos.length > 0 && (
                <div className="space-y-4">
                  {channel.videos.map((video, index) => (
                    <VideoBoxLayout key={video._id || index} video={video} compact />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-base mt-6">No subscriptions yet.</p>
      )}
    </div>
  );
}else{
  return (
    <div className="min-h-screen bg-[#0f0f0f] px-6 py-8 text-white">
      <h1 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-2">
        Subscribed Channels
      </h1>

      {videos && videos.length > 0 ? (
        <div className="space-y-10">
          {videos.map((channel, idx) => (
            <div key={idx} className="bg-[#1a1a1a] rounded-2xl p-6 shadow-md transition hover:shadow-xl duration-300 ease-in-out">
              {subscribedChannel[idx] && (
                <div className="flex items-center mb-4">
                  <img
                    src={subscribedChannel[idx].avatar}
                    alt="Avatar"
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm hover:scale-105 transition"
                  />
                  <div className="ml-4">
                    <h2 className="text-xl font-semibold text-white">{subscribedChannel[idx].fullname}</h2>
                    <p className="text-sm text-gray-400">@{subscribedChannel[idx].username}</p>
                  </div>
                </div>
              )}

              {channel.videos && channel.videos.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {channel.videos.map((video, index) => (
                    <VideoBoxLayout key={video._id || index} video={video} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-lg mt-8">You're not subscribed to any channels yet.</p>
      )}
    </div>
  );
}
};

export default Subscription;
