import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import HomePage from '../ChannelPages/HomePage';
import ChannelVideo from '../ChannelPages/ChannelVideo';
import ChannelPlaylist from '../ChannelPages/ChannelPlaylist';
import ChannelTweet from '../ChannelPages/ChannelTweet';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io("https://viewtube-xam7.onrender.com/api");
const ChannelPage = () => {
    const [channelData, setChannelData] = useState({});
    const {channelName} = useParams();
    const [subscribers, setSubscribers] = useState(0);
    const [channelSubscribed, setChannelSubscribed] = useState(0);
    const [fullScreen, setFullScreen] = useState(false);
    const [isSubscribed, setSubscribed] = useState(false);
    const [user, setUser] = useState({});
    const [isMobile, setIsMobile] = useState(window.innerWidth<768);
    const [options, setOptions] = useState([true,false,false,false]);
    const navigate = useNavigate();
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth<768);
      }
      window.addEventListener("resize",handleResize);
      return () => {
        window.removeEventListener("resize",handleResize);
      }
    }, [])
    const getChannelPage = async () => {
        try{
            const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/users/channeldata/${channelName}`,{
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const subChannels = JSON.parse(localStorage.getItem('sub-channels'));
            const user = JSON.parse(localStorage.getItem('user'));
            if(response.ok && subChannels && user){
                const output = await response.json();
                setUser(user);
                setChannelData(output.data);
                setSubscribers(output.data.subscribersCount);
                setChannelSubscribed(output.data.channelsSubscribedToCount);
                setSubscribed((subChannels || []).some(channel => channel._id === output.data._id));
            }
        }catch(error){
            console.log(error);
        }
    }

    const toggleSubscriber = async () => {
      const params = new URLSearchParams({
        purpose: "subscription",
      });
        try{
            const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/subscription/toggle/${channelData._id}`,{
                method: 'POST',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const response2 = await fetch(`https://viewtube-xam7.onrender.com/api/v1/notification/addNotification/${channelData._id}?${params}`,{
              method: 'POST',
              credentials: 'include',
            });
            if(response.ok && response2.ok){
                const data = await response.json();
                const note = await response2.json();
                setSubscribed(prev => !prev);
                window.dispatchEvent(new Event('updatedSubChannels'));
                
                if(data.message === "Channel Subscribed Successfully"){
                    setSubscribers(prev => prev+1);
                    socket.emit("notification",note.data);
                }else{
                    setSubscribers(prev => prev-1);
                }
            }
    }catch(error){
        console.log(error);
    }
    }

    useEffect(() => {
        getChannelPage();
    }, [channelName])
if (isMobile) {
  return (
    <>
  <div className={`fixed bottom-[150px] right-6 z-50 ${isSubscribed ? "" : "hidden"}`}>
    <button
      // onClick={openHealthCheckForm} // Replace with navigation or modal open logic
      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-full shadow-lg transition duration-300"
      onClick={() => {navigate(`/user/chatbox/${channelData._id}`)}}
    >
      <FontAwesomeIcon icon={faComment} className='mr-2'/>
      Chat
    </button>
  </div>    
    <div className="bg-black text-white rounded-lg shadow-md">
      {/* Cover Image */}
      <div className="relative h-40 w-full">
        <img
          src={channelData.coverImage}
          alt="Cover"
          className="w-full h-full object-cover rounded-t-lg"
        />
      </div>

      {/* Avatar and Info */}
      <div className="px-4 pb-4 relative">
        {/* Avatar */}
        <div className="absolute -top-8 left-4 z-20">
          <div className="w-[90px] h-[90px] rounded-full border-4 border-white overflow-hidden cursor-pointer">
            <img
              src={channelData.avatar}
              alt="Avatar"
              className="w-full h-full object-cover"
              onClick={() => setFullScreen(true)}
            />
          </div>
        </div>

        {fullScreen && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <button
              className="absolute top-5 right-5 text-white text-3xl"
              onClick={() => setFullScreen(false)}
            >
              &times;
            </button>
            <img
              src={channelData.avatar}
              alt="Full Avatar"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}

        {/* Channel Info */}
        <div className="text-left ml-[110px]">
          <h2 className="text-xl font-bold">{channelData.fullname}</h2>
          <p className="text-sm text-gray-300">@{channelData.username}</p>

          {/* Subscribers and Button */}
          <div className="flex flex-col">
            <p className="text-sm text-gray-300">
              {subscribers} subscribers
            </p>
            <p className="text-sm text-gray-300">
              {channelSubscribed} subscribed channels
            </p>
            <button
              className={`w-fit px-4 py-1 mt-1 rounded-full font-semibold self-start hover:bg-gray-200 transition ${isSubscribed ? "bg-red-700 text-white" : "bg-white text-black"}`}
              onClick={toggleSubscriber}
            >
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>
        </div>
      </div>
    <div className='grid grid-cols-4 w-full gap-2 text-white text-center'>
      <div id="home" onClick={() => setOptions([true,false,false,false])} className={`hover:bg-gray-500 cursor-pointer ${options[0] ? "bg-gray-500" : ""}`}>Home</div>
      <div id="videos" onClick={() => setOptions([false,true,false,false])} className={`hover:bg-gray-500 cursor-pointer ${options[1] ? "bg-gray-500" : ""}`}>Videos</div>
      <div id="playlist" onClick={() => setOptions([false,false,true,false])} className={`hover:bg-gray-500 cursor-pointer ${options[2] ? "bg-gray-500" : ""}`}>Playlist</div>
      <div id="tweets" onClick={() => setOptions([false,false,false,true])} className={`hover:bg-gray-500 cursor-pointer ${options[3] ? "bg-gray-500" : ""}`}>Tweets</div>
    </div>
    <div className="w-full my-2 border-t border-gray-700" />
    {
      options[0] && (
        <HomePage channel={channelData}/>
      )
    }
    {
      options[1] && (
        <ChannelVideo channel={channelData}/>
      )
    }
    {
      options[2] && (
        <ChannelPlaylist channel={channelData}/>
      )
    }
    {
      options[3] && (
        <ChannelTweet channel={channelData}/>
      )
    }
    </div>
    </>
  );
}
else{
return (
  <>
  <div className={`fixed bottom-[150px] right-6 z-50 ${isSubscribed ? "" : "hidden"}`}>
    <button
      // onClick={openHealthCheckForm} // Replace with navigation or modal open logic
      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-full shadow-lg transition duration-300"
      onClick={() => {navigate(`/user/chatbox/${channelData._id}`)}}
    >
      <FontAwesomeIcon icon={faComment} className='mr-2'/>
      Chat
    </button>
  </div>
  <div className="bg-black rounded-lg shadow-md text-white">
    {/* Cover Image */}
    <div className="relative h-80 w-full">
      <img
        src={channelData.coverImage}
        alt="Cover"
        className="w-full h-full object-cover rounded-t-lg"
      />
    </div>

    {/* Avatar and User Info */}
    <div className="px-4 pb-6 relative">
      {/* Avatar */}
      <div className="absolute -top-12 left-10 z-20">
        <div className="w-[120px] h-[120px] rounded-full border-4 border-white overflow-hidden cursor-pointer">
          <img
            src={channelData.avatar}
            alt="Avatar"
            className="w-full h-full object-cover"
            onClick={() => setFullScreen(true)}
          />
        </div>
      </div>

      {fullScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <button
            className="z-70 absolute right-1/3 top-[90px] text-red-900 bg-slate-600 text-3xl p-2"
            onClick={() => setFullScreen(false)}
          >
            X
          </button>
          <img
            src={channelData.avatar}
            alt="Full Avatar"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}

      {/* Channel Info */}
      <div className="pl-40 pt-4">
        <h2 className="text-2xl font-bold">{channelData.fullname}</h2>
        <p className="text-sm text-gray-300">@{channelData.username}</p>

        {/* Subscriber info + Subscribe button */}
        <div className="flex items-center gap-4 mt-2 flex-wrap">
          <p className="text-sm text-gray-300">
            {subscribers} subscribers
          </p>
          <p className={`text-sm text-gray-300`}>
            {channelSubscribed} subscribed channels
          </p>
          <button className={`px-4 py-1 rounded-full font-semibold hover:bg-gray-200 ${isSubscribed ? "bg-red-700 text-white" : "bg-white text-black"}`} onClick={toggleSubscriber}>
            {isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        </div>
      </div>
    </div>
    <div className='grid grid-cols-4 w-1/3 gap-2 text-white text-center'>
      <div id="home" onClick={() => setOptions([true,false,false,false])} className={`hover:bg-gray-500 cursor-pointer ${options[0] ? "bg-gray-500" : ""}`}>Home</div>
      <div id="videos" onClick={() => setOptions([false,true,false,false])} className={`hover:bg-gray-500 cursor-pointer ${options[1] ? "bg-gray-500" : ""}`}>Videos</div>
      <div id="playlist" onClick={() => setOptions([false,false,true,false])} className={`hover:bg-gray-500 cursor-pointer ${options[2] ? "bg-gray-500" : ""}`}>Playlist</div>
      <div id="tweets" onClick={() => setOptions([false,false,false,true])} className={`hover:bg-gray-500 cursor-pointer ${options[3] ? "bg-gray-500" : ""}`}>Tweets</div>
    </div>
    <div className="w-full my-2 border-t border-gray-700" />
    {
      options[0] && (
        <HomePage channel={channelData}/>
      )
    }
    {
      options[1] && (
        <ChannelVideo channel={channelData}/>
      )
    }
    {
      options[2] && (
        <ChannelPlaylist channel={channelData}/>
      )
    }
    {
      options[3] && (
        <ChannelTweet channel={channelData}/>
      )
    }
  </div>
  </>
);
    }
}

export default ChannelPage