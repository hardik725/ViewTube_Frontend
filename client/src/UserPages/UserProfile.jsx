import React, { useEffect, useState } from 'react';

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
  } else {
    alert("Failed to update coverImage.");
  }
};


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setAvatar(user.avatar);
      setCoverImage(user.coverImage || 'https://via.placeholder.com/900x300'); // fallback
      setUsername(user.username || 'username');
      setFullName(user.fullname || 'Full Name');
    }
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
</div>

  );
};

export default UserProfile;
