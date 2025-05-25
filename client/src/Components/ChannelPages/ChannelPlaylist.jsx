import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const ChannelPlaylist = ({channel}) => {
    const [channelId, setChannelId] = useState(channel._id);
    const [userPlaylist, setUserPlaylist] = useState([]);

    const getUserPlaylist = async () => {
        try{
            const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/playlist/userPlaylist/${channelId}`,{
                method: 'POST',
                credentials: 'include',
            });
            if(response.ok){
                const output = await response.json();
                setUserPlaylist(output.data);
            }
        }catch(error){
            console.log(error);
        }
    }
    useEffect(() => {
        getUserPlaylist();
    }, [channelId]);
  return (
          <div>
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
  <Link
    to={`/user/playlistBox/${playlist._id}`}
    className="text-blue-500 hover:underline font-medium inline-block pt-[2px]"
  >
    View full playlist
  </Link>
</div>

    </div>
  ))}
</div>
      </div>
  )
}

export default ChannelPlaylist