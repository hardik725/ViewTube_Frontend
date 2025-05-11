import React, { useState } from 'react'

const LoginPage = () => {
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        // this ensures that the page is not reloaded when form is submitted
        try{
        const response = await fetch('/api/users/login',{
            method: 'POST',
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password,
            })
        });
        console.log(response);
        if(response.ok){
            alert("User logged In Successfully!");
        }
        const output = await response.json();
        console.log(output);
    }catch(error){
        console.log(error);
    }
    }

  return (
    <div className='login-form'>
        <h1>Login Form for Youtube</h1>
        <form onSubmit={handleLogin}>
            <div>
                <label htmlFor='username'>Username</label>
                <input
                type='text'
                id='username'
                name='username'
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor='password'>Password</label>
                <input
                type='text'
                id='password'
                name='password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button type="submit">Login</button>
        </form>
    </div>
  )
}

export default LoginPage