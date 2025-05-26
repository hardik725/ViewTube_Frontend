import React, { useEffect, useState } from 'react';
import moment from 'moment';
import {
  faPenToSquare,
  faUpload,
  faBan,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const UserTweet = () => {
  const [user, setUser] = useState({});
  const [tweets, setTweets] = useState([]);
  const [tweetEditStatus, setTweetEditStatus] = useState([]);
  const [editedTweet, setEditedTweet] = useState("");

  const handleEdit = (idx) => {
    setEditedTweet(tweets[idx].content);
    openEditStatus(idx);
  };

  const openEditStatus = (index) => {
    setTweetEditStatus(() => {
      const updated = Array(tweets.length).fill(false);
      updated[index] = true;
      return updated;
    });
  };

const closeEdit = () => {
  setTweetEditStatus(() => Array(tweets.length).fill(false));
  setEditedTweet('');
};

const setTweet = (index, content) => {
  setTweets((prev) => {
    const updated = [...prev];
    updated[index].content = content;
    return updated;
  });
};

const updatedTweet = async (tweetId, idx) => {
  try {
    const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/tweet/update/${tweetId}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify({
        content: editedTweet,
      }),
    });

    if (response.ok) {
      const output = await response.json();
      alert("Tweet updated Successfully");
      setTweet(idx, output.data.content); // Update the local tweet content
      closeEdit(); // Exit edit mode
    } else {
      alert("Failed to update tweet.");
    }
  } catch (error) {
    console.error("Update error:", error);
  }
};


  const getUserTweet = async (userId) => {
    try {
      const params = new URLSearchParams({ userId });
      const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/tweet/getAllTweets?${params}`);
      if (response.ok) {
        const output = await response.json();
        setTweets(output.data);
        setTweetEditStatus(Array(output.data.length).fill(false));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUser(user);
      getUserTweet(user._id);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f] px-6 py-8 text-white">
      <h1 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-2">
        User Tweets
      </h1>
      <div className="space-y-5">
        {tweets.length === 0 ? (
          <p className="text-gray-400 text-center">No tweets yet.</p>
        ) : (
          tweets.map((t, idx) => (
            <div key={t._id || idx}>
              <div className="bg-gray-900 p-4 rounded-xl shadow-md hover:shadow-lg transition border border-gray-800">
                {/* Header */}
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={t.avatar}
                    alt={t.username}
                    className="w-10 h-10 rounded-full object-cover border border-gray-700"
                  />
                  <div className="flex flex-col">
                    <span className="text-white font-semibold text-sm">{t.fullname}</span>
                    <span className="text-gray-400 text-xs">@{t.username} • {moment(t.createdAt).fromNow()}</span>
                  </div>
                </div>

                {/* Tweet Content or Input */}
                {!tweetEditStatus[idx] ? (
                  <p className="text-white text-base leading-snug whitespace-pre-wrap">{t.content}</p>
                ) : (
                  <input
                    type="text"
                    value={editedTweet}
                    onChange={(e) => setEditedTweet(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>

              {/* Action Buttons */}
              {!tweetEditStatus[idx] ? (
                <div className="mt-2 ml-2 text-xl flex flex-row space-x-4">
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    className="cursor-pointer hover:text-yellow-400"
                    onClick={() => handleEdit(idx)}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="cursor-pointer hover:text-red-500"
                    onClick={() => console.log('Handle delete here')}
                  />
                </div>
              ) : (
                <div className="mt-2 ml-2 text-xl flex flex-row space-x-4">
                    <FontAwesomeIcon
                    icon={faUpload}
                    className="cursor-pointer hover:text-green-400"
                    onClick={() => updatedTweet(t._id, idx)}
                    />

                  <FontAwesomeIcon
                    icon={faBan}
                    className="cursor-pointer hover:text-red-400"
                    onClick={() => closeEdit()}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserTweet;
