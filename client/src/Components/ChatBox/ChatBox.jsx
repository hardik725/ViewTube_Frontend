import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io("https://viewtube-xam7.onrender.com");

const ChatBox = () => {
  const { channelId } = useParams();
  const [channelChat, setChannelChat] = useState([]);
  const [user, setUser] = useState({});
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('user'));
    if (localUser) {
      setUser(localUser);
      getChannelChat(channelId);
    }
    const channelData = JSON.parse(localStorage.getItem('sub-channels')) || [];
    if(channelData){
        channelData.map((channel) => {
            if(channel._id === channelId){
                setChannel(channel);
            }
        })
    }
  }, [channelId]);

  useEffect(() => {
    if (!user._id) return;

    const handleMessage = (message) => {
      if (
        (message.sender === user._id && message.reciever === channelId) ||
        (message.sender === channelId && message.reciever === user._id)
      ) {
        setChannelChat(prev => [...prev, message]);
      }
    };

    socket.on("recievedMessage", handleMessage);

    return () => {
      socket.off("recievedMessage", handleMessage);
    };
  }, [user._id, channelId]);


  const getChannelChat = async (channelId) => {
    try {
      const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/message/getMessages/${channelId}`, {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        const output = await response.json();
        setChannelChat(output.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessageHandler = async () => {
    if (!message.trim()) return;
    try {
      const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/message/sendMessage`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
          recieverID: channelId,
          content: message,
        }),
      });
      if (response.ok) {
        const output = await response.json();
        socket.emit("sendMessage", output.data);
        setMessage('');
      }
    } catch (error) {
      alert("Unable to send the Message.");
      console.log(error);
    }
  };

  return (
    <div className='flex justify-center w-full'>
    <div className='text-black md:p-4 p-1 md:w-1/2'>
      <div className='flex flex-row px-2'>
      <div className='w-4/5 flex flex-row'>
      <img
      src={channel.avatar}
      alt="channel_Avatar"
      className='w-12 h-12'
      />
      <div className='flex flex-col ml-2'>
        <span className='text-lg font-bold text-white'>{channel.fullname}</span>
        <span className='text-sm font-thin mb-4 text-white'>@{channel.username}</span>
      </div>
      </div>
      <button className='text-white w-1/5 text-center'
      onClick={() => navigate(`/user/channelPage/${channel.username}`)}>
        Close
      </button>
      </div>
<div className="chat-window text-white bg-gray-800 rounded p-4 mb-4 h-80 overflow-y-auto">
  {channelChat.map((msg, idx) => {
    const isUser = msg.sender === user._id;
    const avatar = isUser ? user.avatar : channel.avatar;
    const time = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <div
        key={idx}
        className={`flex items-end gap-2 my-2 ${isUser ? 'justify-end' : 'justify-start'}`}
      >
        {!isUser && (
          <img
            src={avatar}
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
        )}
        <div className={`p-2 rounded-lg max-w-xs ${isUser ? 'bg-green-500 text-right' : 'bg-gray-600 text-left'}`}>
          <div>{msg.content}</div>
          <div className="text-xs text-gray-200 mt-1">{time}</div>
        </div>
        {isUser && (
          <img
            src={avatar}
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
        )}
      </div>
    );
  })}
</div>

      <div className='flex gap-2'>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className='flex-1 p-2 rounded border border-gray-300'
        />
        <button onClick={sendMessageHandler} className='bg-white text-black p-2 rounded'>
          Send
        </button>
      </div>
    </div>
    </div>
  );
};

export default ChatBox;
