import React, { useEffect, useState } from 'react';
import VideoBoxLayout from '../Components/VideoBoxLayout/VideoBoxLayout';
import {
  faPenToSquare,
  faUpload,
  faBan,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const UserVideos = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoFilePreview, setVideoFilePreview] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [userVideos, setUserVideos] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);

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
  const [editedVideo, setEditedVideo] = useState({ title: '', description: '' });
  const handleEditClick = (video, index) => {
    setEditIndex(index);
    setEditedVideo({ title: video.title, description: video.description });
  };

  const handleCancel = () => {
    setEditIndex(null);
    setEditedVideo({ title: '', description: '' });
  };

  const handleSave = async (id) => {
    try{
        const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/video/update-video/${id}`,{
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: editedVideo.title,
                description: editedVideo.description,
            })
        });

        if(response.ok){
            setEditIndex(null);
            window.dispatchEvent(new Event('updateVideo'));
            alert("Video has been updated Successfully!");
        }
    }catch(error){
        console.log(error);
    }
  };  

  const deleteVideo = async (id) => {
    try{
        const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/video/delete-video/${id}`,{
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include'
        });
        if(response.ok){
            const output = await response.json();
            alert("Video Delete Successfully!");
            window.dispatchEvent(new Event('updateVideo'));
        }
    }catch(error){
        console.log(error);
    }
  }

  const getUserVideos = async ({user}) => {
        const params = new URLSearchParams({
            userId: user._id,
            limit: 12,
        });

        const response = await fetch(`https://viewtube-xam7.onrender.com/api/v1/video/getVideo?${params}`,{
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            }
        });
        if(response.ok){
            const output = await response.json();
            setUserVideos(output.data);
            console.log(output.data);
        }
  }

useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        getUserVideos({ user });
    }

    const reloadVideo = () => {
        getUserVideos({ user });
    };

    window.addEventListener('updateVideo', reloadVideo);

    // Cleanup on unmount
    return () => {
        window.removeEventListener('updateVideo', reloadVideo);
    };
}, []);


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
    if (uploadingVideo) return;
    setUploadingVideo(true);

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
            alert("Video Uploaded Successfully");
            setUploadingVideo(false);
        }
    }catch(error){
        console.log(error);
        alert("Video was not able Uploaded");
        setUploadingVideo(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] md:px-6 px-3 py-8 text-white">
      <h1 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-2">
        Upload Your Video
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-[#1c1c1c] md:p-6 p-2 rounded-xl shadow-xl max-w-4xl mx-auto"
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
  className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md ${
    uploadingVideo
      ? "bg-purple-300 cursor-not-allowed"
      : "bg-purple-600 hover:bg-purple-700"
  }`}
  disabled={uploadingVideo}
>
  {uploadingVideo ? "Video is being Uploaded" : "Upload Video"}
</button>

      </form>
      <div>
      <h1 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-2 mt-6">
        Your Uploaded Video
      </h1>
      <div className="flex flex-col md:mx-6 gap-4">
{userVideos &&
  userVideos.map((video, ind) => (
    <div
      key={video._id || ind}
      className={`${
        isMobile ? 'flex flex-col gap-2' : 'grid grid-cols-3 gap-4 items-start'
      }`}
    >
      <div className={`${isMobile ? '' : ''}`}>
        <VideoBoxLayout video={video} />
      </div>

      <div
        className={`${
          isMobile
            ? 'mt-2 bg-gray-800 bg-opacity-40 p-3 rounded-md shadow'
            : 'col-span-2 bg-gray-800 bg-opacity-40 p-4 rounded-md shadow'
        }`}
      >
        {editIndex === ind ? (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              className="w-full border-b border-gray-500 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-white transition duration-300"
              value={editedVideo.title}
              onChange={(e) =>
                setEditedVideo((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
            />
            <textarea
              rows={3}
              className="w-full border-b border-gray-500 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-white transition duration-300"
              value={editedVideo.description}
              onChange={(e) =>
                setEditedVideo((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
            <div className="flex gap-2">
              <FontAwesomeIcon
                icon={faUpload}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                onClick={() => handleSave(video._id)}
              />
              <FontAwesomeIcon
                icon={faBan}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleCancel}
              />
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold">{video.title}</h2>
            <p className="text-gray-400 mb-2">{video.description}</p>
            <div className="flex flex-row space-x-2">
              <FontAwesomeIcon
                icon={faPenToSquare}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                onClick={() => handleEditClick(video, ind)}
              />
              <FontAwesomeIcon
                icon={faTrash}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                onClick={() => deleteVideo(video._id)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  ))}

      </div>
      </div>
    </div>
  );
};

export default UserVideos;
