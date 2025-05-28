import React, { useEffect, useState } from 'react';
import moment from 'moment';
import {
  faHeart,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

const TweetsPage = () => {
  const [tweet, setTweet] = useState('');
  const [tweets, setTweets] = useState([]);
  const [page, setPage] = useState(1);
  const [user, setUser] = useState({});
  const [tweetLiked, setTweetLiked] = useState([]);
  const [postTweet, setPostTweet] = useState(false);

  // here a function to toggle Like
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
      setTweetLiked(prev => {
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


 
  // here this is function to post a tweet
const handlePost = async (e) => {
  e.preventDefault();
  setPostTweet(true);
  
  if (!tweet.trim()) {
    alert("Please Write a Tweet to Post");
    return;
  }

  try {
    const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/tweet/post`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify({
        content: tweet.trim(),
      })
    });

    if (response.ok) {
      const output = await response.json();
      alert("Tweet has been posted Successfully");
      setTweet('');

      const newTweet = {
        _id: output.data._id,
        content: output.data.content,
        createdAt: output.data.createdAt,
        fullname: user.fullname,
        username: user.username,
        avatar: user.avatar,
        likes: []
      };

      // Add new tweet to the start of the list (newest on top)
      setTweets(prev => [newTweet, ...prev]);

      // Also add `false` to tweetLiked
      setTweetLiked(prev => [false, ...prev]);
      setPostTweet(false);
    }else{
      alert("Tweet was not Posted.");
      setPostTweet(false);
    }
  } catch (error) {
    alert("Tweet was not Posted");
    setPostTweet(false);
  }
};


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if(user){
        setUser(user);
        getTweet(user._id);
    }
  }, []);

const getTweet = async (userId) => {
  try {
    const params = new URLSearchParams({
      page: page,
      limit: 12,
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
      setTweetLiked(likedTweets); // e.g., [true, false, true, ...]
    }
  } catch (error) {
    console.log(error);
  }
};


  return (
    <div className="text-white min-h-screen bg-black px-4 py-6 max-w-2xl mx-auto">
      {/* Slogan */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Post It. Read It. Repeat.
      </h1>

      {/* Tweet Input */}
      <div className="mb-8">
        <textarea
          value={tweet}
          onChange={(e) => setTweet(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={handlePost}
            className={`text-white font-semibold px-4 py-2 rounded transition
              ${
                postTweet
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
              }`}
            disabled={postTweet}
          >
            {postTweet ? (
            <>
          <FontAwesomeIcon icon={faSpinner} spin />
          Posting...
          </>
            )
            :(
            "Post"
          )}
          </button>
        </div>
      </div>
      <div className="flex justify-start mb-2">
          <Link to="/user/userTweets"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition"
          >
            My Tweets
          </Link>
      </div>

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
            className={`cursor-pointer transition-colors duration-200 ${tweetLiked[idx] ? 'text-red-600' : 'text-gray-500'}`}
            onClick={() => toggleLike(idx, t._id)}
          />{" "}
          <span className="text-sm text-gray-300">{t.likes.length}</span>
        </div>
      </div>
    ))
  )}
</div>
    </div>
  );
};

export default TweetsPage;
