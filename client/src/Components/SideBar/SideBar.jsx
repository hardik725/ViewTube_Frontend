import React, { useEffect, useState } from 'react';
import {
  faHome,
  faHistory,
  faClock,
  faThumbsUp,
  faVideo,
  faList,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation } from 'react-router-dom';
const paths = ['/user','/user/subscription','/user/history','/user/playlist','/user/myVideos','/user/watchHistory','/user/likedVideos'];
import { Link } from 'react-router-dom';

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
        const response = await fetch('/api/subscription/sub-channel',{
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
            }
        });
        const output = await response.json();
        console.log(output);
        setSubChannel(output.data || []);
        
    }
    useEffect(() => {
        getSubChannels();
    }, [])
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
        <SidebarItem icon={faHistory} label="History" active={state[2]}/>
        <SidebarItem icon={faList} label="Playlists" active={state[3]}/>
        <SidebarItem icon={faVideo} label="Your videos" active={state[4]}/>
        <SidebarItem icon={faClock} label="Watch Later" active={state[5]}/>
        <SidebarItem icon={faThumbsUp} label="Liked videos" active={state[6]}/>
      </div>

      <hr className="border-gray-700 my-4" />

      {/* Subscriptions Section */}
      <div>
        <p className="text-gray-400 mb-2">Subscriptions</p>
        
        <div>
        {subChannel.map((sub, idx) => (
          <div key={idx} className="flex items-center gap-2 py-1">
            <img src={sub.avatar} alt={sub.fullname} className="w-6 h-6 rounded-full object-cover" />
            <span className="text-sm">{sub.fullname}</span>
          </div>
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
