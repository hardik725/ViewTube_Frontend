import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const navigate = useNavigate();

    const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Constructing FormData for file + text upload
    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    if (avatar) formData.append("avatar", avatar);
    if (coverImage) formData.append("coverImage", coverImage);

    try {
      const response = await fetch("https://viewtube-xam7.onrender.com/api/v1/users/register", {
        method: "POST",
        credentials: 'include',
        body: formData, // No need to set content-type manually
      });

      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Something went wrong.");
    }
  };

  return (
<div
  className="min-h-screen flex items-center justify-end bg-cover bg-center"
  style={{
    backgroundImage:
      "url('https://i.ibb.co/Nn29jv3B/View-Tube-Login-Page.png')",
  }}
>
      <div className="bg-white bg-opacity-40 p-8 rounded-3xl shadow-2xl w-full max-w-md mr-20">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">Sign Up</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Input box style */}
          <input 
            type="text"
            placeholder="Full Name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            required
            className="designer-input p-1 rounded-md"
          />

          <input 
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="designer-input p-1 rounded-md"
          />

          <input 
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="designer-input p-1 rounded-md"
          />

          <input 
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="designer-input p-1 rounded-md"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar (required):</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              required
              className="text-sm"
            />
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="w-24 h-24 rounded-full mt-2 object-cover border-2 border-blue-400 shadow-md"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image (optional):</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="text-sm"
            />
            {coverPreview && (
              <img
                src={coverPreview}
                alt="Cover Preview"
                className="w-full h-32 mt-2 rounded-lg object-cover border border-gray-300 shadow-sm"
              />
            )}
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition duration-300"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:underline font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
