import React, { useEffect, useState, useRef } from 'react';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import { useParams } from 'react-router-dom';
import {
  faPlay,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
  <div className="bg-black h-full overflow-y-auto w-full sm:w-[360px] px-4 py-5 border-t sm:border-t-0 sm:border-l border-gray-700">
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-white text-xl font-semibold tracking-tight">Up Next</h2>
      {isMobile && (
        <button
          onClick={() => setShowPlaylist(false)}
          className="text-white text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full transition"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      )}
    </div>

    {/* Video List */}
    {playlistData?.[0]?.videos_details?.map((video, index) => (
      <div
        key={video._id || index}
        onClick={() => {
          setVideoId(video._id);
          if (isMobile) setShowPlaylist(false);
        }}
        className={`flex gap-3 mb-5 cursor-pointer rounded-lg p-2 transition-all duration-200 shadow-sm ${
          video._id === videoId ? 'bg-gray-800' : 'hover:bg-gray-800'
        }`}
      >
        {/* Fixed-size Thumbnail */}
        <div className="relative w-[160px] h-[90px] rounded-md overflow-hidden shrink-0">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1.5 py-0.5 rounded-sm">
            {formatDuration(video.duration)}
          </span>
        </div>

        {/* Title & Meta */}
        <div className="flex flex-col justify-center w-full">
          <p className="text-white text-sm font-medium leading-tight line-clamp-2">
            {video.title}
          </p>
          <p className="text-gray-400 text-xs mt-1">Video {index + 1}</p>
        </div>
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
          className={`bg-gray-800 text-white p-2 m-4 rounded-md self-start absolute top-1 left-1 ${showPlaylist ? "hidden" : "" }`}
        >
          <FontAwesomeIcon icon={faPlay} className='mr-1'/> {playlistData?.[0]?.videos_details.length}
        </button>

        {showPlaylist && (
          <div className="absolute left-0 top-[30vh] right-0 bottom-0 z-50 bg-black bg-opacity-95 overflow-y-auto">
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
