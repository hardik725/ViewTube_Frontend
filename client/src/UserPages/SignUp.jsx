import React, { useState } from "react";

const SignUp = () => {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

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
      const response = await fetch("/api/users/register", {
        method: "POST",
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
    <div>
        <h1>Sign Up Page</h1>
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <input 
      type="text" 
      placeholder="Full Name" 
      value={fullname} 
      onChange={(e) => setFullname(e.target.value)} 
      required />
      <input 
      type="text" 
      placeholder="Username" 
      value={username} 
      onChange={(e) => setUsername(e.target.value)} 
      required />
      <input 
      type="email" 
      placeholder="Email" 
      value={email} 
      onChange={(e) => setEmail(e.target.value)} 
      required />
      <input 
      type="password" 
      placeholder="Password" 
      value={password} 
      onChange={(e) => setPassword(e.target.value)} 
      required />

      <label>
        Avatar (required):
        <input type="file" 
        accept="image/*" 
        onChange={(e) => setAvatar(e.target.files[0])} required />
      </label>

      <label>
        Cover Image (optional):
        <input type="file" 
        accept="image/*" 
        onChange={(e) => setCoverImage(e.target.files[0])} />
      </label>

      <button type="submit" 
      className="bg-blue-500 text-white px-4 py-2 rounded">Sign Up</button>
    </form>
    </div>
  );
};

export default SignUp;
