import React, { useEffect, useState } from 'react'
import moment from 'moment';
import {
  faHeart,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ChannelTweet = ({channel}) => {
  const [tweets, setTweets] = useState([]);
  const [likedStatus, setLikedStatus] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if(user){
      setUser(user);
      getTweets(user._id);
    }
  }, [])

const toggleLike = async (idx, tweetId) => {
  const params = new URLSearchParams({ type: "tweet" });

  try {
    const response = await fetch(
      `https://viewtube-xam7.onrender.com/api/v1/like/toggleLike/${tweetId}?${params}`,
      {
        method: 'POST',
        credentials: 'include',
      }
    );

    if (response.ok) {
      const output = await response.json();
      // Update tweetLiked state safely
      setLikedStatus(prev => {
        const updated = [...prev];
        updated[idx] = !updated[idx];
        return updated;
      });

      // Update tweets state safely
      setTweets(prevTweets => {
        const updated = [...prevTweets];
        const currentTweet = { ...updated[idx] }; // shallow copy of tweet
        const currentLikes = [...currentTweet.likes]; // copy of likes

        if (output.message === "New like has been added successfully.") {
          currentLikes.push({ owner: user._id });
        } else if (output.message === "Like has been removed successfully.") {
          // filter out the like from currentLikes, not original
          const filteredLikes = currentLikes.filter(like => like.owner !== user._id);
          currentTweet.likes = filteredLikes;
        }

        // Make sure to set the updated likes
        currentTweet.likes = currentLikes;
        updated[idx] = currentTweet;

        return updated;
      });
    }
  } catch (error) {
    console.log(error);
  }
};
  
const getTweets = async (userId) => {
  try {
    const params = new URLSearchParams({
      userId: channel._id,
    });

    const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/tweet/getAllTweets?${params}`);

    if (response.ok) {
      const output = await response.json();
      const fetchedTweets = output.data.reverse();

      // Check which tweets are liked by the current user
      const likedTweets = fetchedTweets.map(tweet =>
        tweet.likes?.some(like => like.owner === userId)
      );
      console.log(likedTweets);
      setTweets(fetchedTweets);
      setLikedStatus(likedTweets); // e.g., [true, false, true, ...]
    }
  } catch (error) {
    console.log(error);
  }
};
  return (
  <div>
    <h1 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-2 mt-4">
        User Tweets
    </h1>
          {/* Tweets List */}
    <div className="space-y-5">
      {tweets.length === 0 ? (
        <p className="text-gray-400 text-center">No tweets yet.</p>
      ) : (
        tweets.map((t, idx) => (
          <div key={t._id || idx}>
            <div className="bg-gray-900 p-4 rounded-xl shadow-md hover:shadow-lg transition border border-gray-800">
              {/* Header: Avatar + Name + Username + Time */}
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
    
              {/* Tweet Content */}
              <p className="text-white text-base leading-snug whitespace-pre-wrap">{t.content}</p>
            </div>
    
            {/* Like Icon */}
            <div className="mt-2 ml-2 text-xl">
              <FontAwesomeIcon
                icon={faHeart}
                className={`cursor-pointer transition-colors duration-200 ${likedStatus[idx] ? 'text-red-600' : 'text-gray-500'}`}
                onClick={() => toggleLike(idx, t._id)}
              />{" "}
              <span className="text-sm text-gray-300">{t.likes.length}</span>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
  )
}

export default ChannelTweet