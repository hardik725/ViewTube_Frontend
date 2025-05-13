import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const VideoPlayer = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [selfLike, setSelfLike] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user._id) {
      setUserId(user._id);
    }
  }, []);

  const getVideo = async () => {
    try {
      const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/video/getVideoById/${videoId}`);
      if (response.ok) {
        const output = await response.json();
        const data = output.data;
        setVideo(data);
        setTotalLikes(data.likes.length);
        setTotalComments(data.comments.length);
        setSelfLike(data.likes.some(like => like.owner === userId));
      } else {
        console.error('Failed to fetch video.');
      }
    } catch (error) {
      console.error('Error in fetch:', error);
    }
  };

  useEffect(() => {
    getVideo();
  }, [videoId, userId]);

  if (!video) {
    return <div className="text-white text-center mt-10">Video is loading...</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white px-4 py-8">
      <div className="relative w-full max-w-4xl rounded-lg overflow-hidden shadow-2xl mb-6">
        <video
          src={video.videoFile}
          controls
          className="w-full h-[60vh] object-contain rounded-lg"
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="w-full max-w-4xl space-y-4 px-2">
        <h1 className="text-2xl font-bold">{video.title}</h1>
        <p className="text-gray-300">{video.description}</p>

        <div className="flex gap-6 items-center text-sm text-gray-400">
          <span>{video.views} views</span>
          <span>{totalLikes} likes</span>
          <span>{totalComments} comments</span>
          {selfLike && <span className="text-green-400">You liked this video</span>}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
