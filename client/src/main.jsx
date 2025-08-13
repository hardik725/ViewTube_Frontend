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
<Route
  path="/user"
  element={
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
  }
>
  <Route path="" element={<Home />} />
  <Route path="subscription" element={<Subscription />} />
  <Route path="userProfile" element={<UserProfile />} />
  <Route path="videoPlayer/:videoId" element={<VideoPlayer />} />
  <Route path="history" element={<WatchHistory />} />
  <Route path="myVideos" element={<UserVideos />} />
  <Route path="channelPage/:channelName" element={<ChannelPage />} />
  <Route path="settings" element={<Settings />} />
  <Route path="likedVideos" element={<LikedVideos />} />
  <Route path="playlist" element={<UserPlaylist />} />
  <Route path="playlistBox/:playlistId" element={<PlaylistBox />} />
  <Route path="tweetPage" element={<TweetsPage />} />
  <Route path="userTweets" element={<UserTweet />} />
  <Route path="chatbox/:channelId" element={<ChatBox />} />
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
