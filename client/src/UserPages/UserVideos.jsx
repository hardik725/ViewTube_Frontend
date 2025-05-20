import React, { useState } from 'react';

const UserVideos = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoFilePreview, setVideoFilePreview] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleVideoFile = (e) => {
    const file = e.target.files[0];
    if(file){
        setVideoFile(file);
        setVideoFilePreview(URL.createObjectURL(file));
    }
  }

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    if(file){
        setThumbnail(file);
        setThumbnailPreview(URL.createObjectURL(file));
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
        const formData = new FormData();
        formData.append('title',title);
        formData.append('description',description);
        if(thumbnail){
            formData.append('thumbnail',thumbnail);
        }
        if(videoFile){
            formData.append('videoFile',videoFile);
        }
        const response = await fetch('https://viewtube-xam7.onrender.com/api/v1/video/upload',{
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        if(response.ok){
            setThumbnail(null);
            setVideoFile(null);
            setThumbnailPreview(null);
            setVideoFilePreview(null);
            setTitle('');
            setDescription('');
        }
    }catch(error){
        console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] px-6 py-8 text-white">
      <h1 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-2">
        Upload Your Video
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-[#1c1c1c] p-6 rounded-xl shadow-xl max-w-4xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Video File Preview */}
          <div className="flex flex-col items-center border border-gray-700 rounded-2xl p-4">
            {videoFilePreview ? (
              <video
                src={videoFilePreview}
                controls
                className="rounded-xl w-full h-52 object-cover"
              />
            ) : (
              <div className="w-full h-52 rounded-xl flex items-center justify-center bg-gray-800 text-gray-500">
                Video Preview
              </div>
            )}
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoFile}
              className="mt-4 w-full text-sm text-gray-300"
            />
          </div>

          {/* Thumbnail Preview */}
          <div className="flex flex-col items-center border border-gray-700 rounded-2xl p-4">
            {thumbnailPreview ? (
              <img
                src={thumbnailPreview}
                alt="Thumbnail"
                className="rounded-xl w-full h-52 object-cover"
              />
            ) : (
              <div className="w-full h-52 rounded-xl flex items-center justify-center bg-gray-800 text-gray-500">
                Thumbnail Preview
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnail}
              className="mt-4 w-full text-sm text-gray-300"
            />
          </div>
        </div>

        {/* Title and Description */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">Title</label>
<input
  type="text"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  className="w-full border-b border-gray-500 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-white transition duration-300"
/>

        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-300 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border-b border-gray-500 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-white transition duration-300"
            rows="1"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md"
        >
          Upload Video
        </button>
      </form>
    </div>
  );
};

export default UserVideos;
