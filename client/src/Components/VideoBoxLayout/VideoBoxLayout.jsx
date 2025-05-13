import React from 'react';

const VideoBoxLayout = ({ video }) => {
  const thumbnail = video.thumbnail;
  const duration = video.duration;
  const title = video.title;
  const owner = video.owner;
  const views = video.views;
  const avatar = video.avatar;
  const description = video.description;

  return (
<div className="w-96 text-white rounded-lg overflow-hidden">
  {/* Thumbnail with duration at bottom-right */}
  <div className="relative">
    <img
      src={thumbnail}
      alt="Thumbnail"
      className="w-full h-52 object-cover rounded-lg"
    />
    <span className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-sm px-2 py-0.5 rounded">
      {duration}
    </span>
  </div>

  {/* Info section */}
  <div className="flex items-start mt-1 px-2">
    {/* Avatar */}
    <img
      src={avatar}
      alt="Avatar"
      className="w-14 h-14 rounded-full mr-3 object-cover"
    />

    {/* Title and meta info */}
    <div className="flex flex-col">
      <h3 className="text-base text-gray-400 font-semibold truncate max-w-[300px]">
        {description}
      </h3>
      <p className="text-sm text-gray-400 truncate max-w-[300px]">
        {owner}
      </p>
      <p className="text-sm text-gray-500">{views} views</p>
    </div>
  </div>
</div>

  );
};

export default VideoBoxLayout;
