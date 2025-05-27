import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { faComment, faThumbsUp, faTimes, faSliders, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const VideoPlayer = ({id}) => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [totalLikes, setTotalLikes] = useState([]);
  const [totalComments, setTotalComments] = useState([]);
  const [selfLike, setSelfLike] = useState(false);
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const [newComment, setNewComment] = useState('');
  const [updateCommentForm, setUpdateCommentForm] = useState(false);
  const [updatedComment, setUpdatedComment] = useState('');
  const [channelSubscribed, setChannelSubscribed] = useState(false);
  const [userPlaylist, setUserPlaylist] = useState([]);
  const [playlistForm, setPlaylistForm] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [addPlaylist, setAddPlaylist] = useState(false);
  const [subButton, setSubButton] = useState(false);
  const [addComment, setAddComment] = useState(false);
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


  useEffect(() => {
    const playlist = JSON.parse(localStorage.getItem('playlist'));
    if(playlist){
      setUserPlaylist(playlist);
    }
  }, [])

    const addToPlaylist = async (playlistId) => {
      setAddPlaylist(true);
      setPlaylistForm(false);
        try{
            const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/playlist/addVideo/${playlistId}`,{
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify({
                    videoId: videoId || id
                })
            });
            if(response.ok){
              alert("Video Succesfully added to the playlist");
              window.dispatchEvent(new Event('updatePlaylist'));
              setAddPlaylist(false);
            }else{
              alert("Unable to add Video to Playlist.")
              setAddPlaylist(false);
            }
        }catch(error){
            alert("Unable to add video to Playlist");
            setAddPlaylist(false);
        }
    }


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
  setAddComment(true);
  e.preventDefault();
  const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/comment/add/${videoId || id}`, {
    method: 'POST',
    credentials: 'include',
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
    setAddComment(false);
  }else{
    alert("Error while adding the comment.");
    setAddComment(false);
  }
};

const deleteComment = async ({ id }) => {
  try {
    const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/comment/delete/${id}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (response.ok) {
      setTotalComments(prevComments => prevComments.filter(comment => comment._id !== id));
      alert("Comment Deleted Successfully!");
    }
  } catch (error) {
    console.log(error);
  }
};



const toggleLike = async () => {
  const params = new URLSearchParams({ type: "video" });

  try {
    const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/like/toggleLike/${videoId || id}?${params.toString()}`, {
      method: 'POST',
      credentials: 'include',
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

  const toggleSubscription = async () => {
    setSubButton(true);
    try{
      const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/subscription/toggle/${video.owner_id}`,{
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
        }
      });

      if(response.ok){
        const data = await response.json();
        setChannelSubscribed(prev => !prev);
        window.dispatchEvent(new Event('updatedSubChannels'));
        alert(data.message);
        setSubButton(false);
      }else{
        alert("There was an Error.");
        setSubButton(false);
      }
    }catch(error){
      alert("There was an error");
      setSubButton(false);
    }
  }

  useEffect(() => {
    const getVideo = async () => {
      try {
        const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/video/getVideoById/${videoId || id}`);
        const response2 = await fetch(`https://viewtube-xam7.onrender.com/api/v1/video/incViewCound/${videoId || id}`,{
          credentials: 'include',
        });

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
        const subChannels = JSON.parse(localStorage.getItem('sub-channels'));
        if(subChannels){
          setChannelSubscribed((subChannels || []).some(channel => channel._id === data.owner_id));
          console.log("Users Subscribed channel: ",subChannels);
          console.log("Video Data is: ",data);
        }          
        } else {
          console.error('Failed to fetch video.');
        }
      } catch (error) {
        console.error('Error in fetch:', error);
      }
    };

    if (userId && (videoId || id)) getVideo();
  }, [userId, videoId, id]);

  if (!video) {
    return <div className="text-white text-center mt-10">Video is loading...</div>;
  }
  if(isMobile){
return (
  <div className="flex flex-col min-h-screen bg-black text-white px-2 py-3 space-y-4">
    {/* Video Player */}
<div className="w-full aspect-video rounded-md overflow-hidden">
  <video
    src={video.videoFile}
    controls
    autoPlay
    className="w-full h-full object-contain"
  />
</div>


    {/* Title and Add to Playlist */}
    <div className="flex flex-col gap-2">
      <h1 className="text-xl font-bold">{video.title}</h1>

      <div className="relative">
<button
  onClick={() => {
    if (!addPlaylist) setPlaylistForm(!playlistForm);
  }}
  disabled={addPlaylist}
  className={`w-full py-2 text-white rounded-md transition duration-300 ${
    addPlaylist ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700'
  }`}
>
  {addPlaylist ? (
    <span className="animate-pulse">Adding...</span>
  ) : (
    'Add to Playlist'
  )}
</button>


        {playlistForm && (
          <div className="absolute top-full left-0 z-50 bg-white border border-gray-300 shadow-lg rounded-sm w-full max-h-40 overflow-y-auto">
            {userPlaylist.length > 0 ? (
              userPlaylist.map((playlist) => (
                <div
                  key={playlist._id}
                  className="px-3 py-2 hover:bg-gray-100 text-black cursor-pointer"
                  onClick={() => addToPlaylist(playlist._id)}
                >
                  {playlist.name}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">No playlists found.</div>
            )}
          </div>
        )}
      </div>
    </div>

    {/* Channel Info */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img
          src={video.owner_avatar}
          alt="user_avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <Link to={`/user/channelPage/${video.owner}`}>
            <p className="text-base font-semibold">{video.owner}</p>
          </Link>
          <p className="text-xs text-gray-400">{video.owner_fullname}</p>
        </div>
      </div>

      <button
        className={`text-sm px-3 py-1 rounded ${
          channelSubscribed ? "bg-red-600" : "bg-gray-600"
        }`}
        onClick={toggleSubscription}
        disabled={subButton}
      >
        {channelSubscribed ? "Subscribed" : "Subscribe"}
      </button>
    </div>

    {/* Video Stats */}
<div className="flex items-center gap-6 text-sm text-gray-400 mt-4">
  {/* Views */}
  <div className="flex items-center gap-1">
    <span className="text-lg">{video.views}</span>
    <span className="text-xs">views</span>
  </div>

  {/* Likes */}
  <div
    className="flex items-center gap-2 cursor-pointer hover:text-white"
    onClick={toggleLike}
  >
    <FontAwesomeIcon
      icon={faThumbsUp}
      className={`text-2xl ${selfLike ? "text-blue-500" : "text-gray-500"}`}
    />
    <span className="text-lg">{totalLikes.length}</span>
  </div>

  {/* Comments */}
  <div className="flex items-center gap-2">
    <FontAwesomeIcon icon={faComment} className="text-2xl text-gray-400" />
    <span className="text-lg">{totalComments.length}</span>
  </div>
</div>


    {/* Description */}
    <p className="text-sm text-gray-300">{video.description}</p>

    {/* Comment Form */}
    <form className="flex flex-col gap-2" onSubmit={postComment}>
      <input
        type="text"
        name="newComment"
        placeholder="Write a comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      />
      {newComment && (
<button
  type="submit"
  disabled={addComment}
  className={`bg-blue-600 text-white rounded-md px-4 py-2 transition duration-200 ${
    addComment ? 'bg-blue-400 cursor-not-allowed' : 'hover:bg-blue-700'
  }`}
>
  {addComment ? 'Posting...' : 'Add Comment'}
</button>

      )}
    </form>

    {/* Comments */}
{totalComments?.length > 0 && (
  <div className="space-y-4">
    <h2 className="text-lg font-bold">Comments</h2>
    {totalComments.map((comment, idx) => (
      <div key={idx} className="bg-transparent p-2 rounded-lg space-y-1">
        <div className="flex items-center gap-2">
          <img
            src={comment.ownerAvatar}
            alt="user"
            className="w-6 h-6 rounded-full"
          />
          <div className="flex flex-col text-sm">
            <span className="font-semibold">{comment.owner}</span>
            <span className="text-xs text-gray-400">{comment.timeAgo}</span>
          </div>

          {/* Spacer */}
          <div className="flex items-center ml-auto gap-3">
            {/* Edit Button */}
            <button
              onClick={() => {
                setUpdateCommentForm(comment._id)
                setUpdatedComment(comment.content)
              }}
              className="text-yellow-400 hover:text-yellow-600"
            >
              <FontAwesomeIcon icon={faSliders} />
            </button>

            {/* Delete Button */}
            <button
              onClick={() => deleteComment({ id: comment._id })}
              className="text-red-400 hover:text-red-600"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>

        {/* Comment content or update input */}
        {updateCommentForm === comment._id ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={updatedComment}
              onChange={(e) => setUpdatedComment(e.target.value)}
              placeholder="Update your comment"
              className="w-full px-2 py-1 text-black rounded-md focus:outline-none"
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md"
              onClick={() => updateComment(comment._id)}
            >
              Save
            </button>
            <button
              className="text-white px-2 py-1"
              onClick={() => {
                setUpdatedComment('');
                setUpdateCommentForm(null);
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="text-sm text-white">{comment.content}</div>
        )}
      </div>
    ))}
  </div>
)}

  </div>
);

  }else{
  return (
    <div className="flex flex-col min-h-screen bg-black text-white px-4 py-4">
<>
  {/* Video Player */}
  <div className="w-full flex justify-center">
    <div className="w-full max-w-4xl rounded-lg overflow-hidden shadow-2xl mb-6">
      <video
        src={video.videoFile}
        controls
        autoPlay
        className="w-full h-[60vh] object-contain rounded-lg"
      />
    </div>
  </div>

  {/* Title & Description */}
  <div className="w-full max-w-4xl px-2 space-y-1 text-white flex items-center justify-between">
    <h1 className="text-3xl font-bold">{video.title}</h1>
  {/* here we will put a button add to playlist*/ }
<div className="relative inline-block">
<button
  onClick={() => {
    if (!addPlaylist) setPlaylistForm(!playlistForm);
  }}
  disabled={addPlaylist}
  className={`px-4 py-2 rounded-md text-white transition duration-200 ${
    addPlaylist ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700'
  }`}
>
  {addPlaylist ? (
    <span className="animate-pulse">Adding...</span>
  ) : (
    'Add to Playlist'
  )}
</button>


  {playlistForm && (
    <div className="absolute top-full left-0 z-50 bg-white border border-gray-300 shadow-lg rounded-sm p-1 w-[134px]">
      {userPlaylist.length > 0 ? (
        userPlaylist.map((playlist) => (
          <div
            key={playlist._id}
            className="px-1 py-1 hover:bg-gray-100 cursor-pointer text-black border-black"
            onClick={() => {
              addToPlaylist(playlist._id)
            }}
          >
            {playlist.name}
          </div>
        ))
      ) : (
        <div className="px-4 py-2 text-gray-500">No playlists found.</div>
      )}
    </div>
  )}
</div>

  </div>

  {/* Divider */}
  <div className="w-full max-w-4xl my-4 border-t border-gray-700" />

  {/* Channel Info */}
<div className="w-full max-w-4xl px-2 flex items-center justify-between text-white">
  {/* Left side: avatar and user info */}
  <div className="flex items-center gap-4">
    <img
      src={video.owner_avatar}
      alt="user_avatar"
      className="w-14 h-14 rounded-full object-cover"
    />
    <div className="flex flex-col justify-center">
      <Link to={`/user/channelPage/${video.owner}`}>
      <p className="text-lg font-semibold">{video.owner}</p>
      </Link>
      <p className="text-sm text-gray-400">{video.owner_fullname}</p>
    </div>
  </div>
  {/* Right side: subscribe button */}
  <button className={`${!channelSubscribed ? "bg-gray-600" : "bg-red-600"} p-3 rounded-sm`} onClick={toggleSubscription} disabled={subButton}>
    <p className="text-xl">{channelSubscribed ? "Subscribed" : "Subscribe"}</p>
  </button>
</div>
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
  {/* Divider */}
  <div className="w-full max-w-4xl my-4 border-t border-gray-700" />

    <div className="w-full max-w-4xl px-2 space-y-1 text-white">
    <p className="text-gray-300 text-base">{video.description}</p>
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
  disabled={addComment}
  className={`bg-blue-600 text-white rounded-md px-4 py-2 w-1/6 text-center transition duration-150 ${
    addComment ? 'bg-blue-400 cursor-not-allowed' : 'hover:bg-blue-700'
  }`}
>
  {addComment ? 'Posting...' : 'Add Comment'}
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
          <div className='flex flex-row space-x-3'>
          <div className='flex flex-col'>
          <span className="font-semibold text-white">{comment.owner}</span>
          <span className="text-[10px] text-white">{comment.timeAgo}</span>
          </div>
          <button
            onClick={() => deleteComment({ id: comment._id })}
            className="text-red-400 hover:text-red-600 transition"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
          </div>
        </div>
        <div className="text-gray-200 pl-1 flex flex-row space-x-8">
          <span>{comment.content}</span>
          <button
            onClick={() => setUpdateCommentForm(prev => !prev)}
            className="text-red-400 hover:text-red-600 transition"
          >
            <FontAwesomeIcon icon={faSliders} />
          </button>
        </div>
        { updateCommentForm && (
        <div className='flex flex-row'>
          <input
          type="text"
          value={updatedComment}
          onChange={(e) => setUpdatedComment(e.target.value)}
          placeholder='Write the Updated Comment'
          className="w-full border-b border-gray-500 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-white transition duration-300"
          />  
          { updatedComment && (
          <button className='text-white' onClick={() => setUpdatedComment('')}>X</button>
)}
        </div>
        )
}
      </div>
    ))}
  </div>
)}
    </div>
  );
}
};

export default VideoPlayer;
