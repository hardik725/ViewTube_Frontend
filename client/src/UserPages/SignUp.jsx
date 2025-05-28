import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SignUp = () => {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [signUp, setSignUp] = useState(false);
  const navigate = useNavigate();
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
    setSignUp(true);
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
      if(response.ok){
             const data = await response.json();
             alert("User created Successfully");
             setSignUp(false);
             navigate("/");
      }else{
        setSignUp(false);
        alert("There was an error while creating an account");
      }
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Something went wrong.");
      setSignUp(false);
    }
  };
  if(isMobile){
    return(
<div
  className="min-h-screen flex items-center justify-center bg-cover bg-center pt-[180px]"
  style={{
    backgroundImage: "url('https://i.ibb.co/C53b51jn/Mobile-Login.jpg')",
  }}
>
  <div className="bg-white bg-opacity-10 px-4 py-6 rounded-2xl shadow-2xl w-full max-w-sm">
    <h1 className="text-3xl font-bold text-center text-white mb-1">Sign Up</h1>
    <p className="text-center text-white text-xs mb-4">Create your account</p>

    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Full Name"
        value={fullname}
        onChange={(e) => setFullname(e.target.value)}
        required
        className="w-full p-2.5 rounded-lg bg-white bg-opacity-30 placeholder-white text-white text-sm outline-none"
      />

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="w-full p-2.5 rounded-lg bg-white bg-opacity-30 placeholder-white text-white text-sm outline-none"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-2.5 rounded-lg bg-white bg-opacity-30 placeholder-white text-white text-sm outline-none"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full p-2.5 rounded-lg bg-white bg-opacity-30 placeholder-white text-white text-sm outline-none"
      />

<div className="flex flex-row gap-2 w-full">
  {/* Avatar Upload Box */}
  <label className="flex-1 cursor-pointer flex flex-col items-center">
    <div className="w-20 h-20 rounded-full border border-white flex items-center justify-center text-white text-xs bg-white bg-opacity-10 overflow-hidden">
      {avatarPreview ? (
        <img
          src={avatarPreview}
          alt="Avatar Preview"
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <span>Avatar</span>
      )}
    </div>
    <input
      type="file"
      accept="image/*"
      onChange={handleAvatarChange}
      required
      className="hidden"
    />
  </label>

  {/* Cover Image Upload Box */}
  <label className="flex-1 cursor-pointer flex flex-col items-center">
    <div className="w-full h-20 rounded-md border border-white flex items-center justify-center text-white text-xs bg-white bg-opacity-10 overflow-hidden">
      {coverPreview ? (
        <img
          src={coverPreview}
          alt="Cover Preview"
          className="w-full h-full object-cover rounded-md"
        />
      ) : (
        <span>Cover Image</span>
      )}
    </div>
    <input
      type="file"
      accept="image/*"
      onChange={handleCoverChange}
      className="hidden"
    />
  </label>
</div>

<button
  type="submit"
  disabled={signUp}
  className={`w-full text-sm font-medium py-2 rounded-lg transition duration-200 ${
    signUp
      ? 'bg-gray-200 text-black cursor-not-allowed'
      : 'bg-white text-black hover:bg-opacity-90'
  }`}
>
  {signUp ? (
    <>
    <FontAwesomeIcon
    icon={faSpinner}
    spin
    className='mr-1'
    />
    Creating Account
    </>
  ) : (
    "Create Account"
  )}
</button>

    </form>

    <div className="mt-4 text-center">
      <p className="text-xs text-white">
        Already have an account?{' '}
        <button
          onClick={() => navigate('/')}
          className="text-white underline"
        >
          Sign in
        </button>
      </p>
    </div>
  </div>
</div>
    )
  }else{
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
  disabled={signUp}
  className={`font-semibold py-2 rounded-lg transition duration-300 w-full ${
    signUp
      ? 'bg-gradient-to-r from-blue-400 to-indigo-400 text-white cursor-not-allowed'
      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90'
  }`}
>
  {signUp ? (
    <>
    <FontAwesomeIcon
    icon={faSpinner}
    spin
    className='mr-1'
    />
    Creating Account
    </>
  ) : (
    "Create Account"
  )}
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
}
};

export default SignUp;
