import React, { useEffect, useState } from 'react'
import { Pencil } from 'lucide-react';
import {
  faXmark,
  faUpload
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Settings = () => {

    const [fullname, setFullname] = useState('');
    const [fullnameForm, setFullnameForm] = useState(false);
    const [username,setUsername] = useState('');
    const [usernameForm, setUsernameForm] = useState(false);
    const [email, setEmail] = useState('');
    const [emailForm, setEmailForm] = useState(false);
    const [password, setPassword] = useState('');
    const [user, setUserDetails] = useState({});

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        setUserDetails(user);
    }, []);

    const submitForm = async ({atrib}) => {

    const dataToSend = {};

    if (atrib === "username") {
        dataToSend.username = username;
    } else if (atrib === "fullname") {
        dataToSend.fullname = fullname;
    } else if (atrib === "email") {
        dataToSend.email = email;
    }
        console.log(atrib);

        try{
            const response = await fetch('/api/users/change-accDetails',{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataToSend)
            });
            if(response.ok){
                const output = await response.json();
                localStorage.removeItem('user');
                localStorage.setItem('user',JSON.stringify(output.data));
                setUserDetails(output.data);
                window.dispatchEvent(new Event('userUpdated'));
                alert(`${atrib} has been successfully updated.`);
            }
        }catch(error){
            console.log(error);
        }
    }
  return (
    <div className="text-white p-6 space-y-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold">⚙️ Account Settings</h1>

      <div className="bg-zinc-900 p-6 rounded-2xl shadow-lg space-y-6">
        <h2 className="text-xl font-semibold border-b border-zinc-700 pb-2">User Account</h2>

        {/* Fullname */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400">Full Name</p>
              <p className="text-lg font-medium">{user.fullname}</p>
            </div>
            <button
              className="text-gray-300 hover:text-white transition"
              onClick={() => setFullnameForm(!fullnameForm)}
            >
              <Pencil size={18} />
            </button>
          </div>
          {fullnameForm && (
            <div className="relative">
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full bg-zinc-800 text-white rounded-xl px-4 py-2 pr-10 outline-none focus:ring-2 ring-white transition"
                placeholder="Enter new name"
              />
              {fullname && (
                <FontAwesomeIcon
                icon={faXmark}
                  className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                  size={18}
                  onClick={() => setFullname("")}
                />
              )}
              {fullname && (
                <FontAwesomeIcon
                icon={faUpload}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                  size={18}
                  onClick={() => submitForm({atrib:"fullname"})}
                />
              )}
            </div>
          )}
        </div>

        {/* Username */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400">Username</p>
              <p className="text-lg font-medium">{user.username}</p>
            </div>
            <button
              className="text-gray-300 hover:text-white transition"
              onClick={() => setUsernameForm(!usernameForm)}
            >
              <Pencil size={18} />
            </button>
          </div>
          {usernameForm && (
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-zinc-800 text-white rounded-xl px-4 py-2 pr-10 outline-none focus:ring-2 ring-white transition"
                placeholder="Enter new username"
              />
              {username && (
                <FontAwesomeIcon
                icon={faXmark}
                  className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                  size={18}
                  onClick={() => setUsername("")}
                />
              )}
              {username && (
                <FontAwesomeIcon
                icon={faUpload}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                  size={18}
                  onClick={() => submitForm({atrib:"username"})}
                />
              )}
            </div>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-lg font-medium">{user.email}</p>
            </div>
            <button
              className="text-gray-300 hover:text-white transition"
              onClick={() => setEmailForm(!emailForm)}
            >
              <Pencil size={18} />
            </button>
          </div>
          {emailForm && (
            <div className="relative">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-800 text-white rounded-xl px-4 py-2 pr-10 outline-none focus:ring-2 ring-white transition"
                placeholder="Enter new email"
              />
              {email && (
                <FontAwesomeIcon
                icon={faXmark}
                  className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                  size={18}
                  onClick={() => setEmail("")}
                />
              )}
              {email && (
                <FontAwesomeIcon
                icon={faUpload}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                  size={18}
                  onClick={() => submitForm({atrib:"email"})}
                />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-zinc-900 p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold border-b border-zinc-700 pb-2">🔐 Security</h2>
        <p className="mt-4 text-gray-300">Change Password functionality coming here...</p>
      </div>
    </div>
  );
}

export default Settings