import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { faComment, faThumbsUp, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const VideoPlayer = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [totalLikes, setTotalLikes] = useState([]);
  const [totalComments, setTotalComments] = useState([]);
  const [selfLike, setSelfLike] = useState(false);
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const [newComment, setNewComment] = useState('');


  const clearComment = () => {
    setNewComment('');
  }
  const getTimeAgo = (createdAt) => {
  const now = new Date();
  const created = new Date(createdAt);
  const diff = Math.floor((now - created) / 1000); // in seconds

  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
  return `${Math.floor(diff / 31536000)} years ago`;
};

const postComment = async (e) => {
  e.preventDefault();
  const response = await fetch(`/api/comment/add/${videoId}`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      content: newComment,
    })
  });

  if (response.ok) {
    const output = await response.json();
    
    const newComm = {
      _id: output.data._id,
      content: output.data.content,
      createdAt: output.data.createdAt, // keep the original
      timeAgo: getTimeAgo(output.data.createdAt), // add readable time
      ownerId: userId,
      owner: username,
      ownerAvatar: avatar
    };

    setTotalComments(prev => [...prev, newComm]);
    setNewComment('');
    alert("Comment has been added.");
  }
};


const toggleLike = async () => {
  const params = new URLSearchParams({ type: "video" });

  try {
    const response = await fetch(`/api/like/toggleLike/${videoId}?${params.toString()}`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" }
    });

    if (response.ok) {
      const output = await response.json();
      setSelfLike(prev => !prev);

      if (output.message === "Like has been removed successfully.") {
        setTotalLikes(prev =>
          prev.filter(like => !(like.owner === userId && like.video === videoId))
        );
      } else {
        setTotalLikes(prev => [...prev, output.data]);
      }
    }
  } catch (err) {
    console.error("Error toggling like:", err);
  }
};


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserId(user._id);
      setUsername(user.username);
      setAvatar(user.avatar);
    }
  }, []);

  useEffect(() => {
    const getVideo = async () => {
      try {
        const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/video/getVideoById/${videoId}`);
        const response2 = await fetch(`/api/video/incViewCound/${videoId}`);
        if (response.ok && response2.ok) {
          const output = await response.json();
          const data = output.data[0]; // assume this is a single video object
          const updatedComments = (data.comments || []).map(comment => ({...comment,timeAgo: getTimeAgo(comment.commentcreated)
          }));
          data.views = data.views+1;
          console.log(updatedComments);
          setVideo(data);
          setTotalLikes(data.likes || []);
          setTotalComments(updatedComments);
          setSelfLike((data.likes || []).some(like => like.owner === userId));
        } else {
          console.error('Failed to fetch video.');
        }
      } catch (error) {
        console.error('Error in fetch:', error);
      }
    };

    if (userId && videoId) getVideo();
  }, [userId, videoId]);

  if (!video) {
    return <div className="text-white text-center mt-10">Video is loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white px-4 py-4">
<>
  {/* Video Player */}
  <div className="w-full flex justify-center">
    <div className="w-full max-w-4xl rounded-lg overflow-hidden shadow-2xl mb-6">
      <video
        src={video.videoFile}
        controls
        className="w-full h-[60vh] object-contain rounded-lg"
      />
    </div>
  </div>

  {/* Title & Description */}
  <div className="w-full max-w-4xl px-2 space-y-1 text-white">
    <h1 className="text-3xl font-bold">{video.title}</h1>
    <p className="text-gray-300 text-base">{video.description}</p>
  </div>

  {/* Divider */}
  <div className="w-full max-w-4xl my-4 border-t border-gray-700" />

  {/* Channel Info */}
  <div className="w-full max-w-4xl px-2 flex items-center gap-4 text-white">
    <img
      src={video.owner_avatar}
      alt="user_avatar"
      className="w-14 h-14 rounded-full object-cover"
    />
    <div className="flex flex-col justify-center">
      <p className="text-lg font-semibold">{video.owner}</p>
      <p className="text-sm text-gray-400">{video.owner_fullname}</p>
    </div>
  </div>

  {/* Divider */}
  <div className="w-full max-w-4xl my-4 border-t border-gray-700" />

  {/* Video Stats */}
  <div className="w-full max-w-4xl px-2 flex gap-10 items-center text-gray-400 text-lg">
    <div className="flex items-center gap-2">
      <span className="font-medium">{video.views}</span>
      <span className="text-sm text-gray-500">views</span>
    </div>

    <div className="flex items-center gap-2 cursor-pointer" onClick={toggleLike}>
      <FontAwesomeIcon
        icon={faThumbsUp}
        className={`${selfLike ? "text-blue-500" : "text-gray-500"} text-xl`}
      />
      <span className="font-medium">{totalLikes.length}</span>
    </div>

    <div className="flex items-center gap-2">
      <FontAwesomeIcon icon={faComment} className="text-xl" />
      <span className="font-medium">{totalComments.length}</span>
      <span className="text-sm text-gray-500">comments</span>
    </div>
  </div>
</>

<form className='mt-6 text-black flex flex-col items-center gap-2 w-full' onSubmit={postComment}>
  {/* Input wrapper */}
  <div className='relative w-1/2'>
    <input
      type="text"
      name="newComment"
      placeholder='Write your comment here...'
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
      className='w-full border border-gray-400 rounded-full px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500'
    />

    {newComment && (
      <button
        type="button"
        onClick={clearComment}
        className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500'
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
    )}
  </div>

  {/* Add Comment Button */}
  {newComment && (
    <button
      type="submit"
      className='bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 w-1/6 text-center transition duration-150'
    >
      Add Comment
    </button>
  )}
</form>
{totalComments && totalComments.length > 0 && (
  <div className="mt-6">
    <h1 className="text-xl font-bold mb-2">Comments</h1>
    {totalComments.map((comment, idx) => (
      <div key={idx} className="flex flex-col mb-4 p-1 bg-transparent rounded-lg">
        <div className="flex flex-row items-center gap-3 mb-2">
          <img
            src={comment.ownerAvatar}
            alt="user_avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className='flex flex-col'>
          <span className="font-semibold text-white">{comment.owner}</span>
          <span className="text-[10px] text-white">{comment.timeAgo}</span>
          </div>
        </div>
        <div className="text-gray-200 pl-1">
          <span>{comment.content}</span>
        </div>
      </div>
    ))}
  </div>
)}


    </div>
  );
};

export default VideoPlayer;
