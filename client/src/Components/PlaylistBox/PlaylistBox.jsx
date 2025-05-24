import React, { useEffect, useState } from 'react';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import { useParams } from 'react-router-dom';

const PlaylistBox = () => {
  const { playlistId } = useParams();
  const [playlistData, setPlaylistData] = useState(null);
  const [videoId, setVideoId] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showPlaylist, setShowPlaylist] = useState(false);
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
  const PlaylistSidebar = () => (
    <div className="bg-black h-full overflow-y-auto pr-2 pt-4 w-full sm:w-[300px]">
      <div className="flex justify-between items-center px-2 mb-3">
        <h2 className="text-white text-lg font-semibold">Playlist</h2>
        {isMobile && (
          <button
            onClick={() => setShowPlaylist(false)}
            className="text-white text-sm bg-gray-700 px-2 py-1 rounded"
          >
            Close
          </button>
        )}
      </div>
      {playlistData?.[0]?.videos_details?.map((video, index) => (
        <div
          key={video._id || index}
          onClick={() => {
            setVideoId(video._id);
            if (isMobile) setShowPlaylist(false);
          }}
          className={`mb-3 p-2 rounded-md cursor-pointer transition ${
            video._id === videoId ? 'bg-gray-700' : 'hover:bg-gray-800'
          }`}
        >
          <div className="w-full aspect-video relative rounded overflow-hidden">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1 right-2 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">
              {formatDuration(video.duration)}
            </span>
          </div>
          <p className="text-white text-sm mt-1 truncate">{video.title}</p>
        </div>
      ))}
    </div>
  );

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.ceil(seconds % 60);
    return hrs > 0
      ? `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      : `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const getPlaylistData = async () => {
    try {
      const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/playlist/getData/${playlistId}`);
      if (response.ok) {
        const output = await response.json();
        setPlaylistData(output.data);

        const firstVideo = output.data[0].videos_details?.[0];
        if (firstVideo?._id) setVideoId(firstVideo._id);
      } else {
        console.error('Failed to fetch playlist data');
      }
    } catch (error) {
      console.error('Error fetching playlist:', error);
    }
  };

  useEffect(() => {
    getPlaylistData();
  }, []);

  if(isMobile){
    return(
      <div className="flex flex-col bg-black min-h-screen relative">
        {videoId ? (
          <VideoPlayer id={videoId} />
        ) : (
          <p className="text-white p-4">Loading video...</p>
        )}
        <button
          onClick={() => setShowPlaylist(true)}
          className="bg-gray-800 text-white p-2 m-4 rounded-md self-start absolute top-1 left-1"
        >
          Show Playlist
        </button>

        {showPlaylist && (
          <div className="absolute top-0 left-0 right-0 bottom-0 z-50 bg-black bg-opacity-95 overflow-y-auto">
            <PlaylistSidebar />
          </div>
        )}
      </div>
    )
  }else{
  return (
    <div className="grid grid-cols-5 bg-black min-h-screen">
      {/* Video Player */}
      <div className="col-span-4">
        {videoId ? (
          <VideoPlayer id={videoId} />
        ) : (
          <p className="text-white p-4">Loading video...</p>
        )}
      </div>

      {/* Playlist Menu */}
      <div className="col-span-1 h-full overflow-y-auto pr-2 pt-4">
        <h2 className="text-white text-lg font-semibold mb-3 px-2">Playlist</h2>
        {playlistData?.[0]?.videos_details?.map((video, index) => (
          <div
            key={video._id || index}
            onClick={() => setVideoId(video._id)}
            className={`mb-3 p-2 rounded-md cursor-pointer transition ${
              video._id === videoId ? 'bg-gray-700' : 'hover:bg-gray-800'
            }`}
          >
            <div className="w-full aspect-video relative rounded overflow-hidden">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-2 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">
                {formatDuration(video.duration)}
              </span>
            </div>
            <p className="text-white text-sm mt-1 truncate">{video.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
};

export default PlaylistBox;
