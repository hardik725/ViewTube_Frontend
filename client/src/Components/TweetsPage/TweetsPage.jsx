import React, { useEffect, useState } from 'react';
import moment from 'moment';

const TweetsPage = () => {
  const [tweet, setTweet] = useState('');
  const [tweets, setTweets] = useState([]);
  const [page, setPage] = useState(1);
  const [user, setUser] = useState({});
 
  // here this is function to post a tweet
  const handlePost = async (e) => {
    e.preventDefault();
    if(tweet.trim()){
        alert("Please Write a Tweet to Post");
    }else{
        try{
            const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/tweet/post`,{
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({
                    content: tweet.trim(),
                })
            });
            if(response.ok){
                alert("Tweet has been posted Successfully");
                setTweet('');
            }
        }catch(error){
            console.log(error);
        }
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if(user){
        setUser(user);
    }
    getTweet();
  }, []);

  const getTweet = async () => {
    try{
        const params = new URLSearchParams({
            page: page,
            limit: 12,
        });
        const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/tweet/getAllTweets?${params}`);
        if(response.ok){
            const output = await response.json();
            setTweets(output.data);
        }
    }catch(error){
        console.log(error);
    }
  }

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
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition"
          >
            Post
          </button>
        </div>
      </div>

      {/* Tweets List */}
<div className="space-y-5">
  {tweets.length === 0 ? (
    <p className="text-gray-400 text-center">No tweets yet.</p>
  ) : (
    tweets.map((t, idx) => (
      <div
        key={t._id || idx}
        className="bg-gray-900 p-4 rounded-xl shadow-md hover:shadow-lg transition border border-gray-800"
      >
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

        {/* Content */}
        <p className="text-white text-base leading-snug whitespace-pre-wrap">{t.content}</p>
      </div>
    ))
  )}
</div>
    </div>
  );
};

export default TweetsPage;
