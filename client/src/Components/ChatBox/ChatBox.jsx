import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io("https://viewtube-xam7.onrender.com");

const ChatBox = () => {
  const { channelId } = useParams();
  const [channelChat, setChannelChat] = useState([]);
  const [user, setUser] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('user'));
    if (localUser) {
      setUser(localUser);
      getChannelChat(channelId);
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
    <div className='text-black p-4'>
      <h2 className='text-lg font-bold mb-4'>Chat with {channelId}</h2>
      <div className="chat-window text-white bg-gray-800 rounded p-4 mb-4 h-80 overflow-y-auto">
        {channelChat.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 my-1 rounded ${
              msg.sender === user._id ? 'bg-green-500 text-right' : 'bg-gray-600 text-left'
            }`}
          >
            {msg.content}
          </div>
        ))}
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
  );
};

export default ChatBox;
