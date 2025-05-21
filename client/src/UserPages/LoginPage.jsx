import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
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

    const handleLogin = async (e) => {
        e.preventDefault();
        // this ensures that the page is not reloaded when form is submitted
        try{
        const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/users/login`,{
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include', 
            body: JSON.stringify({
                username: username,
                password: password,
            })
        });
        console.log(response);
        if(response.ok){
            const output = await response.json();
            localStorage.setItem('user',JSON.stringify(output.data.user));
            alert("User logged In Successfully!");
            navigate('/user', {replace: true});
        }
    }catch(error){
        console.log(error);
    }
    }
    if(isMobile){
  return (
<div
  className="min-h-screen flex items-center justify-center bg-cover bg-center"
  style={{
    backgroundImage: "url('https://i.ibb.co/C53b51jn/Mobile-Login.jpg')",
  }}
>
  <div className="bg-opacity-30 bg-black p-6 rounded-2xl shadow-lg w-full max-w-sm text-white">
    <h2 className="text-3xl font-bold text-center mb-1">Login</h2>
    <p className="text-sm text-center mb-6 text-gray-300">Sign in to continue.</p>

    <form onSubmit={handleLogin} className="space-y-5">
      <div>
        <label htmlFor="username" className="block text-xs font-semibold uppercase mb-1">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 rounded-xl bg-gray-300 text-gray-900 placeholder-gray-600 focus:outline-none"
          placeholder="Your Name"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-xs font-semibold uppercase mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-xl bg-gray-300 text-gray-900 placeholder-gray-600 focus:outline-none"
          placeholder="example@email.com"
        />
      </div>

      <button
        type="submit"
        className="w-full border border-white text-white py-2 rounded-xl hover:bg-white hover:text-black transition duration-300 font-semibold"
      >
        sign in
      </button>
    </form>
    <div className="mt-6 text-center">
      <p className="text-sm text-gray-600">
        Don’t have an account?{' '}
        <button
          onClick={() => navigate('/signUp')}
          className="text-blue-600 hover:underline font-medium"
        >
          Sign up
        </button>
      </p>
    </div>
  </div>
</div>

  );
    }else{
  return (
<div
  className="min-h-screen flex items-center justify-end bg-cover bg-center"
  style={{
    backgroundImage:
      "url('https://i.ibb.co/Nn29jv3B/View-Tube-Login-Page.png')",
  }}
>
  <div className="bg-opacity-40 bg-white p-8 rounded-2xl shadow-lg w-full max-w-md mr-20">
    <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Sign in to continue</h2>

    <form onSubmit={handleLogin} className="space-y-5">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
      >
        Login
      </button>
    </form>

    <div className="mt-6 text-center">
      <p className="text-sm text-gray-600">
        Don’t have an account?{' '}
        <button
          onClick={() => navigate('/signUp')}
          className="text-blue-600 hover:underline font-medium"
        >
          Sign up
        </button>
      </p>
    </div>
  </div>
</div>

  )
}
}

export default LoginPage