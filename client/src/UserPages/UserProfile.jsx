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
  const [userBio, setUserBio] = useState('');
  const [editBio, setEditBio] = useState(false);
  const [bioText, setBioText] = useState('');

  const handleSaveBio = async (e) => {
    e.preventDefault();
    try{
      const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/users/updateBio`,{
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({
          bio: bioText
        })
      });
      if(response.ok){
        const output = await response.json();
        alert("Bio has been Successfully Updated");
        setEditBio(false);
        setBioText('');
        setUserBio(output.data.bio);
        localStorage.removeItem('user');
        localStorage.setItem('user',JSON.stringify(output.data));
      }
    }catch(error){
      console.log(error);
    }
  }

  const toggleEditBio = () => {
    setBioText(userBio);
  }
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

  const response = await fetch('https://viewtube-xam7.onrender.com/api/v1/users/update-avatar', {
    method: 'PATCH',
    credentials: 'include',
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

  const response = await fetch('https://viewtube-xam7.onrender.com/api/v1/users/update-coverImage', {
    method: 'PATCH',
    credentials: 'include',
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
    const response = await fetch('https://viewtube-xam7.onrender.com/api/v1/dashboard/data',{
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
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
      setUserBio(user.bio || 'userBio');
    }

    const subChannels = JSON.parse(localStorage.getItem('sub-channels'));
    if(subChannels){
      setSubChannel(subChannels || []);
    }

    getChannelData();
  }, []);
if (isMobile) {
  return (
    <div className="bg-black text-white rounded-lg shadow-md overflow-hidden">
      {/* Cover Image with Edit */}
      <div className="relative h-40">
        <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
        <button
          onClick={toggleCoverImageForm}
          className="absolute top-2 right-2 text-xs bg-white bg-opacity-50 text-black px-2 py-1 rounded"
        >
          {coverImageForm ? "Close" : "Edit"}
        </button>
        {coverImageForm && (
          <div className="absolute top-12 right-2 bg-white p-2 rounded shadow-md text-black w-48">
            <form onSubmit={updateCoverImageForm} className="flex flex-col space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewCoverImage(e.target.files[0])}
                required
                className="text-xs"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white text-sm py-1 rounded"
              >
                Update
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Avatar + Info */}
      <div className="flex flex-col items-center mt-[-40px] z-10 relative">
        <div className="relative">
          <img
            src={avatar}
            alt="Avatar"
            className="w-20 h-20 object-cover rounded-full border-4 border-black cursor-pointer"
            onClick={toggleAvatarDrop}
          />

          {avatarDrop && (
            <div className="absolute top-24 w-44 bg-white text-black rounded shadow-lg p-2">
              <button className="absolute top-1 right-1 text-red-500" onClick={toggleAvatarDrop}>×</button>
              <button className="w-full text-left text-sm hover:bg-gray-100 px-2 py-1" onClick={() => { setFullScreen(true); setAvatarDrop(false); }}>
                View Avatar
              </button>
              <button className="w-full text-left text-sm hover:bg-gray-100 px-2 py-1" onClick={() => { setAvatarForm(true); setAvatarDrop(false); }}>
                Update Avatar
              </button>
            </div>
          )}

          {avatarForm && (
            <div className="absolute top-24 w-48 bg-white text-black rounded-md shadow-md p-2">
              <form onSubmit={updateAvatarForm} className="flex flex-col space-y-1 text-xs">
                <input type="file" accept="image/*" onChange={(e) => setNewAvatar(e.target.files[0])} required />
                <button type="submit" className="bg-green-500 text-white py-1 rounded">Save</button>
                <button type="button" className="text-red-500" onClick={() => setAvatarForm(false)}>Cancel</button>
              </form>
            </div>
          )}
        </div>

        {fullScreen && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <button className="absolute top-4 right-4 text-white text-2xl" onClick={() => setFullScreen(false)}>×</button>
            <img src={avatar} alt="Full Avatar" className="max-w-full max-h-full" />
          </div>
        )}

        <h2 className="text-lg font-bold mt-2">{fullname}</h2>
        <p className="text-sm text-gray-300">@{username}</p>
      </div>

      {/* Stats */}
      <div className="p-4 space-y-4">
        <h3 className="text-lg font-semibold border-b border-gray-700 pb-1">Channel Stats</h3>
        <div className="grid grid-cols-5 gap-3 text-center">
          <div className="bg-[#1e1e1e] p-2 rounded-md">
            <FontAwesomeIcon icon={faThumbsUp} className="text-blue-400 text-xl" />
            <p>{channelData.totalLikes}</p>
          </div>
          <div className="bg-[#1e1e1e] p-2 rounded-md">
            <FontAwesomeIcon icon={faEye} className="text-green-400 text-xl" />
            <p>{channelData.totalViews}</p>
          </div>
          <div className="bg-[#1e1e1e] p-2 rounded-md">
            <FontAwesomeIcon icon={faCommentDots} className="text-yellow-400 text-xl" />
            <p>{channelData.totalComments}</p>
          </div>
          <div className="bg-[#1e1e1e] p-2 rounded-md">
            <FontAwesomeIcon icon={faUsers} className="text-purple-400 text-xl" />
            <p>{channelData.totalSubsribers}</p>
          </div>
          <div className="bg-[#1e1e1e] p-2 rounded-md">
            <FontAwesomeIcon icon={faVideo} className="text-pink-400 text-xl" />
            <p>{channelData.videoCount}</p>
          </div>
        </div>
      </div>
      {/* User Bio */}
<div className="mt-2 px-6 py-5 rounded-2xl bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-md border border-white/10 text-gray-300 shadow-xl relative overflow-hidden">

  {/* Header */}
  <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-2">
    <svg
      className="w-5 h-5 text-purple-500"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M18 13v-2a6 6 0 10-12 0v2H4v3h2v2h8v-2h2v-3h-2z" />
    </svg>

    <div className="flex justify-between items-center w-full">
      <h2 className="text-md font-semibold text-white tracking-wide uppercase">
        About the Creator
      </h2>
      <button
        className="text-[12px] px-2 py-1 rounded-md bg-purple-600 hover:bg-purple-700 transition-colors text-white font-medium"
        onClick={() => {
          toggleEditBio();
          setEditBio(prev => !prev);
        }}
      >
        {editBio ? "Cancel" : "Edit"}
      </button>
    </div>
  </div>

  {/* Bio Display Mode */}
  {!editBio && (
    <>
  <p className="text-[11px] text-gray-300 leading-relaxed tracking-wide indent-4 ">
    {userBio || "This channel hasn't added a bio yet. Check back later for more info!"}
  </p>

  {/* Decorative Gradient Glow */}
  <div className="absolute -top-6 -right-8 w-32 h-32 bg-purple-600 opacity-10 blur-2xl rounded-full pointer-events-none"></div>
  </>
  )}

  {/* Bio Edit Mode */}
  {editBio && (
  <form
    onSubmit={handleSaveBio}
    className="flex flex-col gap-4"
  >
      <textarea
        rows={5}
        value={bioText}
        onChange={(e) => setBioText(e.target.value)}
        placeholder="Write something about your channel..."
        className="w-full text-sm p-3 rounded-lg bg-black/30 border border-white/10 text-gray-200 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <div className="flex gap-3 justify-end">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-1.5 rounded-md transition"
        >
          Save
        </button>
        <button
          type="button"
          className="bg-gray-700 hover:bg-gray-800 text-white text-sm px-4 py-1.5 rounded-md transition"
          onClick={() => {
            toggleEditBio();
            setEditBio(false);
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  )}
</div>
      {/* Subscribed Channels */}
      <div className="p-4">
        <h3 className="text-lg font-semibold border-b border-gray-700 pb-1">Subscribed</h3>
        {subChannel && subChannel.length > 0 ? (
          <div className="flex flex-wrap gap-3 mt-2">
            {subChannel.map((sub, idx) => (
              <div key={idx} className="w-24 p-2 bg-[#1f1f1f] border border-gray-700 rounded-lg flex flex-col items-center">
                <img src={sub.avatar} alt={sub.fullname} className="w-10 h-10 rounded-full" />
                <p className="text-xs text-center mt-1 truncate">{sub.fullname}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 mt-2">No subscriptions yet.</p>
        )}
      </div>
    </div>
  );
}
else{
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
<div className="mt-6 px-6 text-white">
  <h1 className="text-2xl font-semibold mb-6 border-b border-gray-700">
    Channel Statistics
  </h1>

  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-[80px]">
    {/* Likes */}
    <div className="flex flex-col items-center justify-center p-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-200">
      <FontAwesomeIcon icon={faThumbsUp} className="text-blue-400 text-2xl mb-2" />
      <p className="text-sm text-gray-400">Likes</p>
      <p className="text-lg font-bold text-white">{channelData.totalLikes}</p>
    </div>

    {/* Views */}
    <div className="flex flex-col items-center justify-center p-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-200">
      <FontAwesomeIcon icon={faEye} className="text-green-400 text-2xl mb-2" />
      <p className="text-sm text-gray-400">Views</p>
      <p className="text-lg font-bold text-white">{channelData.totalViews}</p>
    </div>

    {/* Comments */}
    <div className="flex flex-col items-center justify-center p-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-200">
      <FontAwesomeIcon icon={faCommentDots} className="text-yellow-300 text-2xl mb-2" />
      <p className="text-sm text-gray-400">Comments</p>
      <p className="text-lg font-bold text-white">{channelData.totalComments}</p>
    </div>

    {/* Subscribers */}
    <div className="flex flex-col items-center justify-center p-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-200">
      <FontAwesomeIcon icon={faUsers} className="text-purple-400 text-2xl mb-2" />
      <p className="text-sm text-gray-400">Subscribers</p>
      <p className="text-lg font-bold text-white">{channelData.totalSubsribers}</p>
    </div>

    {/* Videos */}
    <div className="flex flex-col items-center justify-center p-4 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-200">
      <FontAwesomeIcon icon={faVideo} className="text-pink-400 text-2xl mb-2" />
      <p className="text-sm text-gray-400">Videos</p>
      <p className="text-lg font-bold text-white">{channelData.videoCount}</p>
    </div>
  </div>

<div className="mt-6 px-6 py-5 rounded-2xl bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-md border border-white/10 text-gray-300 shadow-xl relative overflow-hidden">

  {/* Header */}
  <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-2">
    <svg
      className="w-5 h-5 text-purple-500"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M18 13v-2a6 6 0 10-12 0v2H4v3h2v2h8v-2h2v-3h-2z" />
    </svg>

    <div className="flex justify-between items-center w-full">
      <h2 className="text-lg font-semibold text-white tracking-wide uppercase">
        About the Creator
      </h2>
      <button
        className="text-sm px-3 py-1 rounded-md bg-purple-600 hover:bg-purple-700 transition-colors text-white font-medium"
        onClick={() => {
          toggleEditBio();
          setEditBio(prev => !prev);
        }}
      >
        {editBio ? "Cancel" : "Edit"}
      </button>
    </div>
  </div>

  {/* Bio Display Mode */}
  {!editBio && (
    <>
  <p className="text-sm text-gray-300 leading-relaxed tracking-wide indent-4">
    {userBio || "This channel hasn't added a bio yet. Check back later for more info!"}
  </p>

  {/* Decorative Gradient Glow */}
  <div className="absolute -top-6 -right-8 w-32 h-32 bg-purple-600 opacity-10 blur-2xl rounded-full pointer-events-none"></div>
  </>
  )}

  {/* Bio Edit Mode */}
  {editBio && (
  <form
    onSubmit={handleSaveBio}
    className="flex flex-col gap-4"
  >
      <textarea
        rows={5}
        value={bioText}
        onChange={(e) => setBioText(e.target.value)}
        placeholder="Write something about your channel..."
        className="w-full text-sm p-3 rounded-lg bg-black/30 border border-white/10 text-gray-200 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <div className="flex gap-3 justify-end">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-1.5 rounded-md transition"
        >
          Save
        </button>
        <button
          type="button"
          className="bg-gray-700 hover:bg-gray-800 text-white text-sm px-4 py-1.5 rounded-md transition"
          onClick={() => {
            toggleEditBio();
            setEditBio(false);
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  )}
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
}
};

export default UserProfile;
