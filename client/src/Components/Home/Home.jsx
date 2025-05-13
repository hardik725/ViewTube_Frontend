import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthProvider/AuthProvider';
import VideoBoxLayout from '../VideoBoxLayout/VideoBoxLayout';
import { Link } from 'react-router-dom';

const Home = () => {
  const [username, setUsername] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [videoFiles, setVideoFiles] = useState([]);
  const [page, setPage] = useState(1);
  const { logout } = useContext(AuthContext);

  const getVideoFiles = async () => {
    const params = new URLSearchParams({
      page: page,
      limit: 12,
    });

    try {
      const response = await fetch(`/api/video/getVideo?${params}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        }
      });

      const output = await response.json();
      setVideoFiles(output.data); // Correct: no stringify
    } catch (error) {
      console.error("Failed to fetch videos:", error);
    }
  };

  useEffect(() => {
    getVideoFiles();
  }, [page]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUsername(user.username);
      setUserAvatar(user.avatar);
    }
  }, []);

  return (
    <>
      <div>
        <div className='flex flex-wrap gap-4 pl-10 bg-black'>
        {videoFiles.map((video, index) => (
          <VideoBoxLayout key={index} video={video} />
        ))}
        </div>
      </div>
      <button onClick={logout} className='text-white bg-slate-800 rounded-lg p-4'>Logout</button>
    </>
  );
};

export default Home;
