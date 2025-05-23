import React, { useEffect, useState } from 'react'
import VideoBoxLayout from '../VideoBoxLayout/VideoBoxLayout';

const ChannelVideo = ({channel}) => {
    const [channelId, setChannelId] = useState(channel._id);
    const [videos, setVideos] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth<768);
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth<768);
      }
      window.addEventListener("resize",handleResize);
      return () => {
        window.removeEventListener("resize",handleResize);
      }
    }, []);

    const getChannelVideos = async () => {
        const params = new URLSearchParams({
            userId: channelId,
            limit: 12,
        });
        try{
            const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/video/getVideo?${params}`,{
                method: 'POST',
                credentials: 'include'
            });
            if(response.ok){
                const output = await response.json();
                setVideos(output.data);
            }
        }catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        getChannelVideos();
    }, [channelId]);
    if(isMobile){
        return(
    <div className="min-h-screen bg-[#0f0f0f] px-4 py-2">
      <h1 className="text-2xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
        Channel Videos
      </h1>

      {videos.length > 0 ? (
        <div className="flex flex-col gap-4">
          {videos.map((video, index) => (
            <VideoBoxLayout key={video._id || index} video={video} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-base mt-4">
          User haven't uploaded any videos yet.
        </p>
      )}
    </div>
        )
    }else{
  return (
    <div className="min-h-screen bg-[#0f0f0f] px-6 py-8">
      <h1 className="text-3xl text-white font-bold mb-6 border-b border-gray-700 pb-2">
        Channel Videos
      </h1>

      {videos.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video, index) => (
            <VideoBoxLayout key={video._id || index} video={video} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-lg mt-4">User has not uploaded any videos yet.</p>
      )}
    </div>
  )
}
}

export default ChannelVideo