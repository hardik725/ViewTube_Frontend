import React, { useEffect, useState } from 'react';
import {
  faHome,
  faHistory,
  faThumbsUp,
  faVideo,
  faList
} from '@fortawesome/free-solid-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useLocation } from 'react-router-dom';
const paths = ['/user','/user/subscription','/user/history','/user/playlist','/user/myVideos','/user/settings','/user/likedVideos','/user/tweetPage'];
import { Link } from 'react-router-dom';
import { faGear } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {

    const [subChannel, setSubChannel] = useState([]);
    const location = useLocation();

    const [state, setState] = useState(Array(paths.length).fill(false));
    useEffect(() => {
        const updatedState = paths.map((path) => location.pathname === path ? true : false
    );
    setState(updatedState);
}, [location.pathname, paths]);

    const getSubChannels = async () => {
        const response = await fetch('https://viewtube-xam7.onrender.com/api/v1/subscription/sub-channel',{
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': "application/json",
            }
        });
        const output = await response.json();
        console.log(output);
        const channels = output.data || [];
        setSubChannel(channels);
        localStorage.setItem('sub-channels', JSON.stringify(channels));
      }

      const getUserPlaylist = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if(user){
          const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/playlist/userPlaylist/${user._id}`,{
            method: 'POST',
            credentials: 'include',
        });
        if(response.ok){
          const output = await response.json();
          localStorage.setItem("playlist",JSON.stringify(output.data));
        }
      }
      }

      useEffect(() => {
        getUserPlaylist();
        const reloadPlaylist = () => {
          getUserPlaylist();
        }
        window.addEventListener("updatePlaylist",reloadPlaylist);

        return () => {
          window.removeEventListener("updatePlaylist",reloadPlaylist);
        }
      }, [])
useEffect(() => {
  getSubChannels(); // initial fetch

  const handleChannelUpdate = () => {
    getSubChannels();
  }

  window.addEventListener('updatedSubChannels', handleChannelUpdate);

  return () =>  {
    window.removeEventListener('updatedSubChannels', handleChannelUpdate);
  }
}, []);

  return (
    <div className="w-64 bg-black text-white h-screen px-4 py-4 space-y-4 text-sm">

      {/* Primary Menu */}
      <div className="space-y-3 bg-transparent">
        <Link to="/user">
        <SidebarItem icon={faHome} label="Home" active={state[0]}/>
        </Link>
        <Link to="/user/subscription">
        <SidebarItem icon={faVideo} label="Subscriptions" active={state[1]} />
        </Link>
      </div>

      <hr className="border-gray-700 my-4" />

      {/* You Section */}
      <div className="space-y-2">
        <p className="text-gray-400">You</p>
        <Link to="/user/history">
        <SidebarItem icon={faHistory} label="History" active={state[2]}/>
        </Link>
        <Link to="/user/playlist">
        <SidebarItem icon={faList} label="Playlists" active={state[3]}/>
        </Link>
        <Link to="/user/myVideos">
        <SidebarItem icon={faVideo} label="Your videos" active={state[4]}/>
        </Link>
        <Link to="/user/settings">
        <SidebarItem icon={faGear} label="Settings" active={state[5]}/>
        </Link>
        <Link to="/user/likedVideos">
        <SidebarItem icon={faThumbsUp} label="Liked videos" active={state[6]}/>
        </Link>
        <Link to="/user/tweetPage">
        <SidebarItem icon={faTwitter} label="Tweets" active={state[7]}/>
        </Link>
      </div>

      <hr className="border-gray-700 my-4" />

      {/* Subscriptions Section */}
      <div>
        <p className="text-gray-400 mb-2">Subscriptions</p>
        
        <div>
        {subChannel.map((sub, idx) => (
          <Link to={`/user/channelPage/${sub.username}`}>
          <div key={idx} className="flex items-center gap-2 py-1">
            <img src={sub.avatar} alt={sub.fullname} className="w-6 h-6 rounded-full object-cover" />
            <span className="text-sm">{sub.fullname}</span>
          </div>
          </Link>
        ))}
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, dot }) => (
  <div
    className={`group flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer 
      ${active ? 'bg-gray-800 font-semibold' : 'hover:bg-gray-800'}`}
  >
    <FontAwesomeIcon
      icon={icon}
      className={`w-5 h-5 ${active ? 'bg-gray-800' : 'bg-black'} group-hover:bg-gray-800`}
    />
    <div className="flex items-center gap-1">
      <span className={`${active ? 'bg-gray-800' : 'bg-black'} group-hover:bg-gray-800`}>
        {label}
      </span>
      {dot && <span className="text-blue-500 text-xs">•</span>}
    </div>
  </div>
);



export default Sidebar;
