import React, { useEffect, useState, useRef } from 'react'
import { Pencil } from 'lucide-react';
import {
  faXmark,
  faUpload,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Settings = () => {

    const [fullname, setFullname] = useState('');
    const [fullnameForm, setFullnameForm] = useState(false);
    const [username,setUsername] = useState('');
    const [usernameForm, setUsernameForm] = useState(false);
    const [email, setEmail] = useState('');
    const [emailForm, setEmailForm] = useState(false);
    const [oldpassword, setOldPassword] = useState('');
    const [newpassword, setNewPassword] = useState('');
    const [user, setUserDetails] = useState({});
    const [avatar, setAvatar] = useState(null);
    const [ava, setAva] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [covIm, setCovIm] = useState(null);
    const avatarRef = useRef(null);
    const coverImageRef = useRef(null);
    const [changing, setChanging] = useState(Array(6).fill(false));

    const handleButton = (index,type) => {
      if(type==="on"){
      setChanging((prev) => {
        const updated = Array(6).fill(false);
        updated[index] = true;
        return updated;
      })
    }else if(type==="off"){
      setChanging((prev) => {
        const updated = Array(6).fill(false);
        return updated;
      })
    }
    }

    const avatarPreview = (e) => {
        const avat = e.target.files[0];
        if(avat){
            setAva(avat);
            const aPreview = URL.createObjectURL(avat);
            setAvatar(aPreview);
        }
    }

    const coverImagePreview = (e) => {
        const cover = e.target.files[0];
        if(cover){
            setCovIm(cover);
            const covPreview = URL.createObjectURL(cover);
            setCoverImage(covPreview);
        }
    }

const uploadAvatar = async (e) => {
  handleButton(4,"on");
  e.preventDefault();
  

  try {
    const formData = new FormData();
    formData.append("avatar",ava);
    const response = await fetch('https://viewtube-xam7.onrender.com/api/v1/users/update-avatar', {
      method: 'PATCH',
      credentials: 'include',
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      localStorage.removeItem('user');
      localStorage.setItem('user', JSON.stringify(result.data));
      setAvatar(null);
      setAva(null);
      setUserDetails(result.data);
      alert('✅ Avatar updated successfully!');
      window.dispatchEvent(new Event('userUpdated'));
      handleButton(4,"off");
    } else {
      alert(`❌ Failed to update avatar: ${result.message || 'Unknown error'}`);
      handleButton(4,"off");
    }
  } catch (error) {
    console.error('Upload Avatar Error:', error);
    alert('❌ An error occurred while updating the avatar.');
    handleButton(4,"off");
  }
};

const uploadCover = async (e) => {
  e.preventDefault();
  handleButton(5,"on");
  try {
    const formData = new FormData();
    formData.append("coverImage",covIm);
    const response = await fetch('https://viewtube-xam7.onrender.com/api/v1/users/update-coverImage', {
      method: 'PATCH',
      credentials: 'include',
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      localStorage.removeItem('user');
      localStorage.setItem('user', JSON.stringify(result.data));
      setCoverImage(null);
      setCovIm(null);
      setUserDetails(result.data);
      alert('✅ CoverImage updated successfully!');
      window.dispatchEvent(new Event('userUpdated'));
      handleButton(5,"off");
    } else {
      alert(`❌ Failed to update coverImage: ${result.message || 'Unknown error'}`);
      handleButton(5,"off");
    }
  } catch (error) {
    console.error('Upload CoverImage Error:', error);
    alert('❌ An error occurred while updating the coverImage.');
    handleButton(5,"off");
  }
};


    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        setUserDetails(user);
    }, []);
    // account Details Update Form

    const submitForm = async ({atrib}) => {

    const dataToSend = {};

    if (atrib === "username") {
        dataToSend.username = username;
        handleButton(1,"on");
    } else if (atrib === "fullname") {
        dataToSend.fullname = fullname;
        handleButton(0,"on");
    } else if (atrib === "email") {
        dataToSend.email = email;
        handleButton(2,"on");
    }
        console.log(atrib);

        try{
            const response = await fetch('https://viewtube-xam7.onrender.com/api/v1/users/change-accDetails',{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify(dataToSend)
            });
            if(response.ok){
                const output = await response.json();
                localStorage.removeItem('user');
                localStorage.setItem('user',JSON.stringify(output.data));
                setUserDetails(output.data);
                window.dispatchEvent(new Event('userUpdated'));
                alert(`${atrib} has been successfully updated.`);
                handleButton(1,"off");
            }else{
              handleButton(1,"off");
              alert("There was an error while updating the details of the user");
            }
        }catch(error){
            console.log(error);
            alert("There was an error while updated the details of the user");
            handleButton(1,"off");
        }
    }

    // User Password Change Function
    const changePassword = async (e) => {
        handleButton(3,"on");
        try{
            const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/users/change-password`,{
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify({
                    oldPassword: oldpassword,
                    newPassword: newpassword
                })
            });
            if(response.ok){
                alert("User Password has been Successfully Changed");
                setOldPassword('');
                setNewPassword('');
                handleButton(3,"off");
            }else{
              alert("There was an error while changing the password");
              handleButton(3,"off");
            }
        }catch(error){
            console.log(error);
            alert("There was an error while changing the Password");
            handleButton(3,"off");
        }
    }
  return (
<div className="text-white px-4 py-6 sm:px-6 lg:px-8 space-y-8 max-w-5xl mx-auto">
  <h1 className="text-2xl sm:text-3xl font-semibold">⚙️ Account Settings</h1>

  {/* User Account Section */}
  <div className="bg-zinc-900 p-4 sm:p-6 rounded-2xl shadow space-y-6">
    <h2 className="text-lg sm:text-xl font-semibold border-b border-zinc-700 pb-2">User Account</h2>

    {/* Fullname */}
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-400">Full Name</p>
          <p className="text-base sm:text-lg font-medium">{user.fullname}</p>
        </div>
        <button className="text-gray-300 hover:text-white transition" onClick={() => setFullnameForm(!fullnameForm)}>
          <Pencil size={18} />
        </button>
      </div>
      {fullnameForm && (
        <div className="relative">
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 pr-10 outline-none focus:ring-2 ring-white transition"
            placeholder="Enter new name"
          />
          {fullname && (
            <>
              <FontAwesomeIcon icon={faXmark} className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer" onClick={() => setFullname("")} />
<div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
  <FontAwesomeIcon
    icon={changing[0] ? faSpinner : faUpload}
    spin={changing[0]}
    className="text-gray-400 hover:text-white cursor-pointer"
    onClick={() => {
      if (!changing[0]) submitForm({ atrib: "fullname" });
    }}
  />
</div>


            </>
          )}
        </div>
      )}
    </div>

    {/* Username */}
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-400">Username</p>
          <p className="text-base sm:text-lg font-medium">{user.username}</p>
        </div>
        <button className="text-gray-300 hover:text-white transition" onClick={() => setUsernameForm(!usernameForm)}>
          <Pencil size={18} />
        </button>
      </div>
      {usernameForm && (
        <div className="relative">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 pr-10 outline-none focus:ring-2 ring-white transition"
            placeholder="Enter new username"
          />
          {username && (
            <>
              <FontAwesomeIcon icon={faXmark} className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer" onClick={() => setUsername("")} />
<div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
  <FontAwesomeIcon
    icon={changing[1] ? faSpinner : faUpload}
    spin={changing[1]}
    className="text-gray-400 hover:text-white cursor-pointer"
    onClick={() => {
      if (!changing[1]) submitForm({ atrib: "username" });
    }}
  />
</div>
            </>
          )}
        </div>
      )}
    </div>

    {/* Email */}
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-400">Email</p>
          <p className="text-base sm:text-lg font-medium">{user.email}</p>
        </div>
        <button className="text-gray-300 hover:text-white transition" onClick={() => setEmailForm(!emailForm)}>
          <Pencil size={18} />
        </button>
      </div>
      {emailForm && (
        <div className="relative">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 pr-10 outline-none focus:ring-2 ring-white transition"
            placeholder="Enter new email"
          />
          {email && (
            <>
              <FontAwesomeIcon icon={faXmark} className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer" onClick={() => setEmail("")} />
<div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
  <FontAwesomeIcon
    icon={changing[2] ? faSpinner : faUpload}
    spin={changing[2]}
    className="text-gray-400 hover:text-white cursor-pointer"
    onClick={() => {
      if (!changing[2]) submitForm({ atrib: "email" });
    }}
  />
</div>
            </>
          )}
        </div>
      )}
    </div>
  </div>

  {/* Security Section */}
  <div className="bg-zinc-900 p-4 sm:p-6 rounded-2xl shadow space-y-4">
    <h2 className="text-lg sm:text-xl font-semibold border-b border-zinc-700 pb-2">🔐 Security</h2>
    <div className="space-y-4">
      <div className="relative">
        <input
          type="password"
          value={oldpassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 pr-10 outline-none focus:ring-2 ring-white transition"
          placeholder="Enter old password"
        />
        {oldpassword && (
          <FontAwesomeIcon icon={faXmark} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer" onClick={() => setOldPassword("")} />
        )}
      </div>
      <div className="relative">
        <input
          type="password"
          value={newpassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 pr-10 outline-none focus:ring-2 ring-white transition"
          placeholder="Enter new password"
        />
        {newpassword && (
          <>
            <FontAwesomeIcon icon={faXmark} className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer" onClick={() => setNewPassword("")} />
<div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
  <FontAwesomeIcon
    icon={changing[3] ? faSpinner : faUpload}
    spin={changing[3]}
    className="text-gray-400 hover:text-white cursor-pointer"
    onClick={() => {
      if (!changing[3]) changePassword();
    }}
  />
</div>

          </>
        )}
      </div>
    </div>
  </div>

  {/* Avatar & Cover Image Section */}
  <div className="bg-zinc-900 p-4 sm:p-8 rounded-2xl shadow space-y-8">
    <h2 className="text-lg sm:text-2xl font-bold text-white border-b border-zinc-700 pb-2 sm:pb-4">🖼 Avatar & Cover Image</h2>

    {/* Avatar */}
    <div className="space-y-4">
      <div className="flex flex-wrap justify-center gap-6 sm:gap-12">
        <div className="flex flex-col items-center">
          <img src={user.avatar} alt="current_avatar" className="w-24 sm:w-32 h-24 sm:h-32 object-cover rounded-full border-4 border-zinc-800 shadow" />
          <span className="text-sm text-gray-400 mt-2">Current Avatar</span>
        </div>
        <div className="flex flex-col items-center cursor-pointer group">
          <input type="file" accept="image/*" ref={avatarRef} className="hidden" onChange={avatarPreview} />
          <div onClick={() => avatarRef.current.click()} className="transition hover:scale-105">
            <img src={avatar} alt="new_avatar" className="w-24 sm:w-32 h-24 sm:h-32 object-cover rounded-full border-4 border-blue-500/60 shadow group-hover:border-blue-600" />
          </div>
          <span className="mt-2 text-blue-400 group-hover:underline">Upload New Avatar</span>
        </div>
      </div>
{avatar && (
  <div className="text-center">
    <button
      onClick={!changing[4] ? uploadAvatar : null}
      className="px-3 py-2 bg-white hover:bg-gray-600 hover:text-white text-black rounded-lg transition flex items-center justify-center gap-2"
      disabled={changing[4]}
    >
      {changing[4] ? (
        <>
          <FontAwesomeIcon icon={faSpinner} spin />
          Uploading...
        </>
      ) : (
        "Submit Avatar"
      )}
    </button>
  </div>
)}

    </div>

    <hr className="border-zinc-700" />

    {/* Cover */}
    <div className="space-y-4">
      <div className="flex flex-wrap justify-center gap-6 sm:gap-12">
        <div className="flex flex-col items-center">
          <img src={user.coverImage} alt="current_cover" className="w-[160px] sm:w-[200px] h-[80px] sm:h-[100px] object-cover rounded-xl border-4 border-zinc-800 shadow" />
          <span className="text-sm text-gray-400 mt-2">Current Cover</span>
        </div>
        <div className="flex flex-col items-center cursor-pointer group">
          <input type="file" accept="image/*" ref={coverImageRef} className="hidden" onChange={coverImagePreview} />
          <div onClick={() => coverImageRef.current.click()} className="transition hover:scale-105">
            <img src={coverImage} alt="new_cover" className="w-[160px] sm:w-[200px] h-[80px] sm:h-[100px] object-cover rounded-xl border-4 border-blue-500/60 shadow group-hover:border-blue-600" />
          </div>
          <span className="mt-2 text-blue-400 group-hover:underline">Upload New Cover</span>
        </div>
      </div>
      {coverImage && (
        <div className="text-center">
          <button onClick={changing[5] ? null : uploadCover} className="px-3 py-2 bg-white hover:bg-gray-600 hover:text-white text-black rounded-lg transition"
          disabled={changing[5]}>
      {changing[5] ? (
        <>
          <FontAwesomeIcon icon={faSpinner} spin />
          Uploading...
        </>
      ) : (
        "Submit CoverImage"
      )}
          </button>
        </div>
      )}
    </div>
  </div>
</div>

  );
}

export default Settings