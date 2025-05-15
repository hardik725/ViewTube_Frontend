import React, { useEffect, useState } from 'react';
import { faThumbsUp, faEye, faCommentDots, faUsers, faVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const UserProfile = () => {
  const [avatar, setAvatar] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [username, setUsername] = useState('');
  const [fullname, setFullName] = useState('');
  const [avatarForm, setAvatarForm] = useState(false);
  const [newAvatar, setNewAvatar] = useState(null);
  const [coverImageForm, setCoverImageForm] = useState(false);
  const [newCoverImage, setNewCoverImage] = useState(null);
  const [avatarDrop, setAvatarDrop] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [subChannel, setSubChannel] = useState([]);
  const [channelData, setChannelData] = useState({});

  const toggleAvatarForm = () => {
    setAvatarForm(prevValue => !prevValue);
  }
  const toggleCoverImageForm = () => {
    setCoverImageForm(prevValue => !prevValue);
  }
  const toggleAvatarDrop = () => {
    setAvatarDrop(prevValue => !prevValue);
  }

  

const updateAvatarForm = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('avatar', newAvatar);

  const response = await fetch('/api/users/update-avatar', {
    method: 'PATCH',
    body: formData,
  });

  if (response.ok) {
    const output = await response.json();
    const updatedUser = output.data;

    localStorage.setItem('user', JSON.stringify(updatedUser));
    setAvatar(updatedUser.avatar);

    alert("User avatar updated Successfully.");
    toggleAvatarForm();
    setNewAvatar(null);
    window.dispatchEvent( new Event('userUpdated'));

  } else {
    alert("Failed to update avatar.");
  }
};

const updateCoverImageForm = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('coverImage', newCoverImage);

  const response = await fetch('/api/users/update-coverImage', {
    method: 'PATCH',
    body: formData,
  });

  if (response.ok) {
    const output = await response.json();
    const updatedUser = output.data;

    localStorage.setItem('user', JSON.stringify(updatedUser));
    setCoverImage(updatedUser.coverImage);

    alert("User coverImage updated Successfully.");
    toggleCoverImageForm();
    setNewCoverImage(null);
    window.dispatchEvent( new Event('userUpdated'));
  } else {
    alert("Failed to update coverImage.");
  }
};

const getChannelData = async () => {
  try{
    const response = await fetch('/api/dashboard/data',{
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      }
    });
    if(response.ok){
      const output = await response.json();
      setChannelData(output.data[0]);
      console.log("ChannelData:" ,output.data[0]);
    }
  }catch(error){
    console.log(error);
  }
}


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setAvatar(user.avatar);
      setCoverImage(user.coverImage || 'https://via.placeholder.com/900x300'); // fallback
      setUsername(user.username || 'username');
      setFullName(user.fullname || 'Full Name');
    }

    const subChannels = JSON.parse(localStorage.getItem('sub-channels'));
    if(subChannels){
      setSubChannel(subChannels || []);
    }

    getChannelData();
  }, []);

  return (
<div className="bg-black rounded-lg shadow-md text-black">
  {/* Cover Image */}
  <div className="relative h-80 w-full">
    <img
      src={coverImage}
      alt="Cover"
      className="w-full h-full object-cover rounded-t-lg"
    />
    {/* Edit Cover Image Button */}
    <div className="absolute top-2 right-2 bg-white bg-opacity-45 p-1 rounded-sm cursor-pointer shadow">
      <button onClick={toggleCoverImageForm} className='font-bold flex flex-row-reverse'>
        {coverImageForm ? "Close" : "Edit Cover"}
      </button>

      {coverImageForm && (
        <div className="mt-2 p-2 bg-white rounded shadow-md text-black">
          <p className="font-semibold mb-2">Update Cover Image</p>
          <form onSubmit={updateCoverImageForm} className="flex flex-col space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewCoverImage(e.target.files[0])}
              required
              className="text-sm"
            />
            <button type="submit" className="bg-blue-500 text-white py-1 rounded hover:bg-blue-600">
              Update
            </button>
          </form>
        </div>
      )}
    </div>
  </div>

  {/* Avatar and User Info */}
  <div className="px-4 pb-4 relative text-white">
    {/* Avatar */}
    <div className="absolute -top-10 left-10 z-20">
      <div className="relative">
        <div
          className="w-[120px] h-[120px] rounded-full border-4 border-white overflow-hidden cursor-pointer"
          onClick={toggleAvatarDrop}
        >
          <img
            src={avatar}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Dropdown Menu */}
        {avatarDrop && (
          <div className="absolute top-[130px] left-0 w-[140px] bg-white text-black rounded-md shadow-md px-2 z-30">
<button
  className="w-8 h-8 absolute right-0 flex items-center justify-center text-red-600 hover:bg-red-400 rounded-bl-lg bg-red-200 text-2xl transition"
  onClick={toggleAvatarDrop}
>
  X
</button>

            <button
              className="w-full text-left hover:bg-gray-100 px-2 py-1 rounded mt-4"
              onClick={() => {
                setFullScreen(true);
                setAvatarDrop(false);
              }}
            >
              View Avatar
            </button>
            <button
              className="w-full text-left hover:bg-gray-100 px-2 py-1 rounded"
              onClick={() => {
                setAvatarForm(true);
                setAvatarDrop(false);
              }}
            >
              Update Avatar
            </button>
          </div>
        )}
        {
            fullScreen && (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
    >
        <button className='z-70 absolute right-1/3 top-[90px] text-red-900 bg-slate-600 text-3xl p-2' onClick={() => {setFullScreen(false)}}>X</button>
      <img
        src={avatar}
        alt="Full Avatar"
        className="max-w-full max-h-full object-contain"
      />
    </div>                    
            )
        }

        {/* Avatar Update Form */}
        {avatarForm && (
          <div className="absolute top-[130px] left-0 w-60 bg-white text-black rounded-md shadow-md p-4 z-30">
            <form onSubmit={updateAvatarForm} className="flex flex-col space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewAvatar(e.target.files[0])}
                required
                className="text-sm"
              />
              <button
                type="submit"
                className="bg-green-500 text-white py-1 rounded hover:bg-green-600"
              >
                Save Avatar
              </button>
              <button
                type="button"
                className="text-red-600 hover:underline text-sm"
                onClick={() => setAvatarForm(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>
    </div>

    {/* Name and Username */}
    <div className="pl-40 pt-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold">{fullname}</h2>
      </div>
      <p className="text-sm text-gray-300">{username}</p>
    </div>
  </div>
<div className="mt-12 px-6 text-white">
  <h1 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-2">
    Channel Statistics
  </h1>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12">
    {/* Likes */}
    <div className="flex flex-row items-center justify-center gap-3 p-4 bg-[#1e1e1e] rounded-xl border border-gray-700 shadow-md">
      <FontAwesomeIcon icon={faThumbsUp} className="text-blue-500 text-3xl" />
      <p className="text-xl font-semibold">{channelData.totalLikes}</p>
    </div>

    {/* Views */}
    <div className="flex flex-row items-center justify-center gap-3 p-4 bg-[#1e1e1e] rounded-xl border border-gray-700 shadow-md">
      <FontAwesomeIcon icon={faEye} className="text-green-500 text-3xl" />
      <p className="text-xl font-semibold">{channelData.totalViews}</p>
    </div>

    {/* Comments */}
    <div className="flex flex-row items-center justify-center gap-3 p-4 bg-[#1e1e1e] rounded-xl border border-gray-700 shadow-md">
      <FontAwesomeIcon icon={faCommentDots} className="text-yellow-400 text-3xl" />
      <p className="text-xl font-semibold">{channelData.totalComments}</p>
    </div>

    {/* Subscribers */}
    <div className="flex flex-row items-center justify-center gap-3 p-4 bg-[#1e1e1e] rounded-xl border border-gray-700 shadow-md">
      <FontAwesomeIcon icon={faUsers} className="text-purple-500 text-3xl" />
      <p className="text-xl font-semibold">{channelData.totalSubsribers}</p>
    </div>

    {/* Videos */}
    <div className="flex flex-row items-center justify-center gap-3 p-4 bg-[#1e1e1e] rounded-xl border border-gray-700 shadow-md">
      <FontAwesomeIcon icon={faVideo} className="text-pink-500 text-3xl" />
      <p className="text-xl font-semibold">{channelData.videoCount}</p>
    </div>
  </div>
</div>

<div className="mt-6 px-6">
  <h1 className="text-2xl font-semibold text-white mb-4 border-b border-gray-600 pb-2">
    Subscribed Channels
  </h1>

  {subChannel && subChannel.length > 0 ? (
    <div className="flex flex-wrap gap-6">
      {subChannel.map((sub, idx) => (
        <div
          key={idx}
          className="w-40 p-4 bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-gray-700 rounded-xl flex flex-col items-center shadow-md transition-all duration-200"
        >
          <img
            src={sub.avatar}
            alt={sub.fullname}
            className="w-16 h-16 rounded-full object-cover border border-gray-500"
          />
          <span className="mt-2 text-white text-center text-sm font-medium truncate w-full">
            {sub.fullname}
          </span>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-400 mt-4">You haven’t subscribed to any channels yet.</p>
  )}
</div>

</div>

  );
};

export default UserProfile;
