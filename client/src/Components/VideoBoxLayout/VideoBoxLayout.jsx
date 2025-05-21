import React from 'react';
import { Link } from 'react-router-dom';

const VideoBoxLayout = ({ video }) => {
  const thumbnail = video.thumbnail;
  const duration = video.duration;
  const title = video.title;
  const owner = video.owner;
  const views = video.views;
  const avatar = video.avatar;
  const description = video.description;
  const videoId = video._id;

  if (!video) {
    return <div>Video is Loading</div>;
  }

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.ceil(seconds % 60);

    if (hrs > 0) {
      return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    } else {
      return `${mins}:${String(secs).padStart(2, '0')}`;
    }
  };

  return (
<Link to={`/user/videoPlayer/${videoId}`} className="block w-full">
  <div className="text-white rounded-lg overflow-hidden hover:bg-gray-800 transition w-full sm:w-84">
    {/* Thumbnail */}
    <div className="relative">
      <img
        src={thumbnail}
        alt="Thumbnail"
        className="w-full h-48 sm:h-52 object-cover rounded-t-lg"
      />
      <span className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-xs px-2 py-0.5 rounded">
        {formatDuration(duration)}
      </span>
    </div>

    {/* Info */}
    <div className="flex items-start px-2 py-2 gap-2">
      <img
        src={avatar}
        alt="Avatar"
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
      />
      <div className="flex flex-col overflow-hidden">
        <h3 className="text-sm sm:text-base text-gray-200 font-semibold truncate max-w-full">
          {description}
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 truncate max-w-full">
          {owner}
        </p>
        <p className="text-xs sm:text-sm text-gray-500">{views} views</p>
      </div>
    </div>
  </div>
</Link>

  );
};

export default VideoBoxLayout;
