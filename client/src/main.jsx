import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LoginPage from './UserPages/LoginPage'
import SignUp from './UserPages/SignUp'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Navigate } from 'react-router-dom'
import Layout from './Components/Layout/Layout'
import Home from './Components/Home/Home'
import { AuthProvider } from './Components/AuthProvider/AuthProvider'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'
import Subscription from './Components/Subscription/Subscription'
import UserProfile from './UserPages/UserProfile'
import VideoPlayer from './Components/VideoPlayer/VideoPlayer'
import WatchHistory from './UserPages/WatchHistory'
import UserVideos from './UserPages/UserVideos'
import ChannelPage from './Components/ChannelPage/ChannelPage'
import Settings from './UserPages/Settings'
import LikedVideos from './UserPages/LikedVideos'
import UserPlaylist from './UserPages/UserPlaylist'
import PlaylistBox from './Components/PlaylistBox/PlaylistBox'
import TweetsPage from './Components/TweetsPage/TweetsPage'
import UserTweet from './UserPages/UserTweet'
import ChatBox from './Components/ChatBox/ChatBox'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<LoginPage/>}>
    </Route>
    <Route path="/signUp" element={<SignUp/>}></Route>
    <Route path="/user" element={<Layout/>}>
          <Route path="" element={<Home/>}></Route>
        <Route path="subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
        <Route path="userProfile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="videoPlayer/:videoId" element={<ProtectedRoute><VideoPlayer /></ProtectedRoute>} />
        <Route path="history" element={<ProtectedRoute><WatchHistory /></ProtectedRoute>} />
        <Route path="myVideos" element={<ProtectedRoute><UserVideos /></ProtectedRoute>} />
        <Route path="channelPage/:channelName" element={<ProtectedRoute><ChannelPage /></ProtectedRoute>} />
        <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="likedVideos" element={<ProtectedRoute><LikedVideos /></ProtectedRoute>} />
        <Route path="playlist" element={<ProtectedRoute><UserPlaylist /></ProtectedRoute>} />
        <Route path="playlistBox/:playlistId" element={<ProtectedRoute><PlaylistBox /></ProtectedRoute>} />
        <Route path="tweetPage" element={<ProtectedRoute><TweetsPage /></ProtectedRoute>} />
        <Route path="userTweets" element={<ProtectedRoute><UserTweet /></ProtectedRoute>} />
        <Route path="chatbox/:channelId" element={<ProtectedRoute><ChatBox /></ProtectedRoute>} />
    </Route>
    </>   
  )
)

createRoot(document.getElementById('root')).render(
  // this is not important as app can run without the strictmode also
  <StrictMode>
    <AuthProvider>
    <RouterProvider router={router}/>
    </AuthProvider>
  </StrictMode>,
)
