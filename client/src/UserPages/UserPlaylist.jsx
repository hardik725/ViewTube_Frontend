import React, { useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const UserPlaylist = () => {

    const [playlistForm, setPlaylistForm] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [user, setUser] = useState({});
    const [userPlaylist, setUserPlaylist] = useState([]);
    const [isPublic, setIsPublic] = useState(true); 
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);  

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if(user){
            setUser(user);
        }
    }, []);

    const loadPlaylist = async () => {
        try{
            const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/playlist/userPlaylist/${user._id}`,{
                method: 'POST',
                credentials: 'include',
            });
            if(response.ok){
                const output = await response.json();
                setUserPlaylist(output.data);
                console.log(output.data);
            }
        }catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        if(user){
        loadPlaylist();
        }
    }, [user]);


    const handleSubmit = async (e) => {
        e.preventDefault();      
        try{
            const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/playlist/create`,{
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify({
                    name: name,
                    description: description,
                    isPublic: isPublic
                }),
            });
            if(response.ok){
                alert("Playlist has been successfully created.");
                setName('');
                setDescription('');
                setIsPublic(true);
                window.dispatchEvent(new Event('updatePlaylist'))
                loadPlaylist();
            }
        }catch(error){
        }
    }
if (isMobile) {
  return (
    <div className="min-h-screen bg-[#0f0f0f] px-2 py-6 text-white space-y-6">
      <h1 className="text-2xl font-bold border-b border-gray-700 pb-2">
        User Playlist
      </h1>

      {/* Playlist Banner and Create Button */}
      <div className="relative w-full mx-auto">
        <img
          src="https://i.ibb.co/Z1HCSgDh/Neutral-Simple-Minimalist-Lifestyle-Blogger-You-Tube-Channel-Art.png"
          alt="Playlist Banner"
          className="w-full h-auto rounded-lg"
        />

        {/* Button positioned at vertical center, right side */}
<button
  className="absolute bottom-2 right-2 text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
  onClick={() => setPlaylistForm(true)}
>
  Create Playlist
</button>

      </div>

      {/* Form */}
      {playlistForm && (
        <div className="text-white bg-[#1f1f1f] p-4 rounded shadow relative">
          <button
            onClick={() => setPlaylistForm(false)}
            className="absolute top-0 right-0 text-white bg-red-600 hover:bg-red-700 px-2 py-1 rounded-bl-md text-sm"
          >
            Close
          </button>

          <form onSubmit={handleSubmit} className="space-y-3 mt-6">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[#2b2b2b] rounded text-sm"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[#2b2b2b] rounded text-sm"
            />
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4"
              />
              <span>Make Public</span>
            </label>
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium"
            >
              Create Playlist
            </button>
          </form>
        </div>
      )}

      {/* Created Playlist */}
      <div>
        <h1 className="text-2xl font-bold border-b border-gray-700 pb-2 mt-4">
          Created Playlist
        </h1>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {userPlaylist.map((playlist) => (
            <div
              key={playlist._id}
              className="bg-transparent text-white rounded-lg shadow-lg overflow-hidden relative transition-transform duration-300"
            >
              <div className="relative">
                <img
                  src={
                    playlist.playlist_videos?.[0]?.thumbnail ||
                    "https://via.placeholder.com/300x170"
                  }
                  alt="Playlist thumbnail"
                  className="w-full h-20 object-cover rounded-lg"
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-xs px-2 py-1 rounded flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 4h16v2H4zm0 14h10v2H4zm0-7h16v2H4z" />
                  </svg>
                  {playlist.playlist_videos.length.toLocaleString()} videos
                </div>
              </div>

              <div className="px-2 pt-2 pb-3 space-y-[1px] text-sm">
                <h2 className="font-semibold truncate">{playlist.name}</h2>
                <p className="text-gray-500">{playlist.isPublic ? "Public" : "Private"} · Playlist</p>
                <p className="text-gray-500">Updated {new Date(playlist.updatedAt).toLocaleDateString()}</p>
                <p className="text-gray-500">Total: {Math.ceil(playlist.totalDuration / 60)} mins</p>
                <Link to={`/user/playlistBox/${playlist._id}`}>
                <div
                  className="text-blue-500 hover:underline inline-block pt-[2px]"
                >
                  View full playlist
                </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
else{
  return (
    <div className="min-h-screen bg-[#0f0f0f] px-6 py-8 text-white">
      <h1 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-2">
        User Playlist
      </h1>

      <div className="relative w-full max-w-4xl mx-auto">
        <img
          src="https://i.ibb.co/Z1HCSgDh/Neutral-Simple-Minimalist-Lifestyle-Blogger-You-Tube-Channel-Art.png"
          alt="Playlist Banner"
          className="w-full h-auto rounded-lg"
        />

        {/* Button positioned at vertical center, right side */}
        <button className="absolute right-[120px] top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded"
        onClick={() => {setPlaylistForm(true)}}>
          Create Playlist
        </button>
      </div>
{
  playlistForm && (
    <div className="text-white p-6 bg-[#1f1f1f] max-w-xl mx-auto rounded shadow mt-2 relative">
      {/* Close Button at top-right */}
      <button
        onClick={() => setPlaylistForm(false)}
        className="absolute top-0 right-0 text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-bl-md"
      >
        Close
      </button>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 bg-[#2b2b2b] rounded outline-none"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full px-4 py-2 bg-[#2b2b2b] rounded outline-none"
        />

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="w-4 h-4"
          />
          <span>Make Public</span>
        </label>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Create Playlist
        </button>
      </form>
    </div>
  )
}
    <h1 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-2 mt-4">
        Created Playlist
    </h1>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-4">
  {userPlaylist.map((playlist) => (
    <div key={playlist._id} className="bg-transparent text-white rounded-lg shadow-lg overflow-hidden relative group transition-transform duration-300">
      
      {/* Thumbnail */}
      <div className="relative">
        <img
          src={playlist.playlist_videos?.[0]?.thumbnail || "https://via.placeholder.com/300x170"}
          alt="Playlist thumbnail"
          className="w-full h-32 object-cover rounded-lg"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-40 text-xs px-2 py-1 rounded flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16v2H4zm0 14h10v2H4zm0-7h16v2H4z"/></svg>
          {playlist.playlist_videos.length.toLocaleString()} videos
        </div>
      </div>

      {/* Info */}
<div className="px-2 pt-1 space-y-[1px] text-sm leading-snug">
  <h2 className="text-base font-semibold truncate text-white">{playlist.name}</h2>
  <p className="text-gray-500">
    {playlist.isPublic ? "Public" : "Private"} · Playlist
  </p>
  <p className="text-gray-500">
    Updated {new Date(playlist.updatedAt).toLocaleDateString()}
  </p>
  <p className="text-gray-500">
    Total: {Math.ceil(playlist.totalDuration / 60)} mins
  </p>
<button onClick={() => navigate(`/user/playlistBox/${playlist._id}`)}>
  View full playlist
</button>
</div>

    </div>
  ))}
</div>


    </div>
  );
}
};

export default UserPlaylist;
