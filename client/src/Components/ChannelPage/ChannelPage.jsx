import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const ChannelPage = () => {
    const [channelData, setChannelData] = useState({});
    const {channelName} = useParams();
    const [subscribers, setSubscribers] = useState(0);
    const [channelSubscribed, setChannelSubscribed] = useState(0);
    const [fullScreen, setFullScreen] = useState(false);
    const [isSubscribed, setSubscribed] = useState(false);
    const [user, setUser] = useState({});

    const getChannelPage = async () => {
        try{
            const response = await fetch(`/api/users/channeldata/${channelName}`,{
                method: "POST",
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
        try{
            const response = await fetch(`/api/subscription/toggle/${channelData._id}`,{
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if(response.ok){
                const data = await response.json();
                setSubscribed(prev => !prev);
                window.dispatchEvent(new Event('updatedSubChannels'));
                if(data.message === "Channel Subscribed Successfully"){
                    setSubscribers(prev => prev+1);
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
    }, [])
return (
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
  </div>
);

}

export default ChannelPage