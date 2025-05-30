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
  const [editButton, setEditButton] = useState([]);
  const [newMessage, setNewMessage] = useState('');
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

  const openEditButton = (ind) => {
    setNewMessage(channelChat[ind].content);
    setEditButton((prev) => {
        const updated = [...prev];
        updated[ind] = true;
        return updated;
    })
  }

  const closeEditButton = () => {
    setEditButton(Array(channelChat.length).fill(false));
  }

  useEffect(() => {
    setEditButton(Array(channelChat.length).fill(false));
  }, [channelChat.length]);

useEffect(() => {
  if (!user._id) return;

  const handleMessage = (message) => {
    setChannelChat((prev) =>
      prev.map((msg) =>
        msg._id === message._id ? { ...msg, content: message.content } : msg
      )
    );
  };

  socket.on("rupdatedMessage", handleMessage);

  return () => {
    socket.off("rupdatedMessage", handleMessage);
  };
}, [user._id, channelId]);


  useEffect(() => {
    if(!user._id) return;

    const handleMessage = (messageId) => {
        setChannelChat(prev => prev.filter(msg => msg._id !== messageId));
    }

    socket.on("rdeletedMessage",handleMessage);

    return () => {
        socket.off("rdeletedMessage", handleMessage);
    }
  }, [user._id, channelId]);

  useEffect(() => {
    if(!user._id) return; 
  })

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

  const delMessage = async (messageId) => {
    try{
        const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/message/delete/${messageId}`,{
            method: 'POST',
            credentials: 'include',
        });
        if(response.ok){
            const output = await response.json();
            socket.emit("deleteMessage",output.data.messageId);
            setChannelChat(prev => prev.filter(msg => msg._id !== messageId));
        }else{
            alert("Unable to delete the Message.");
        }
    }catch(error){
        alert("Unable to delete the Message.");
    }
  };

  // function to update the message

  const handleUpdateMessage = async (messageId, idx) => {
    try{
        const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/message/update/${messageId}`,{
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({
                content: newMessage,
            })
        });
        if(response.ok){
            alert("Message has been updated Successfully");
            const output = await response.json();
            const updMsg = output.data;
            socket.emit("updateMessage",output.data);
            setChannelChat((prev) => {
                const updated = [...prev];
                updated[idx] = updMsg;
                return updated;
            });
            setEditButton(Array(channelChat.length).fill(false));
        }
    }catch(error){
        alert("Unable to update the user Message.");
    }
  }


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
      <div key={idx} className={`flex flex-col gap-1 my-3 ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <img src={avatar} alt="avatar" className="w-8 h-8 rounded-full" />
          <div className={`p-1 rounded-lg max-w-xs ${isUser ? 'bg-blue-400 text-right' : 'bg-gray-600 text-left'}`}>
            {editButton[idx] ? (
              <>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className='text-black w-full p-1 rounded'
                />
              </>
            ) : (
              <div className='text-center'>{msg.content}</div>
            )}
            <div className="text-xs text-gray-200 mt-[2px]">{time}</div>
          </div>
        </div>

        {isUser && (
          <div className="flex gap-2 text-sm">
            {!editButton[idx] ? (
              <>
                <button className="bg-yellow-500 px-1 py-[2px] rounded" onClick={() => openEditButton(idx)}>
                  Edit
                </button>
                <button className="bg-red-500 px-1 py-[2px] rounded" onClick={() => delMessage(msg._id)}>
                  Delete
                </button>
              </>
            ) : (
              <>
                <button
                  className="bg-green-600 px-1 py-[2px] rounded"
                  onClick={() => handleUpdateMessage(msg._id, idx)}
                >
                  Save
                </button>
                <button
                  className="bg-gray-500 px-1 py-[2px] rounded"
                  onClick={() => closeEditButton()}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
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
