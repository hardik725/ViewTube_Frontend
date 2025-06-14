import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LoginPage from './UserPages/LoginPage'
import SignUp from './UserPages/SignUp'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
import Layout from './Components/Layout/Layout'
import Home from './Components/Home/Home'
import { AuthProvider } from './Components/AuthProvider/AuthProvider'
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
          <Route path="subscription" element={<Subscription/>}></Route>
          <Route path="userProfile" element={<UserProfile/>}></Route>
          <Route path="videoPlayer/:videoId" element={<VideoPlayer/>}></Route>
          <Route path="history" element={<WatchHistory/>}></Route>
          <Route path="myVideos" element={<UserVideos/>}></Route>
          <Route path="channelPage/:channelName" element={<ChannelPage/>}></Route>
          <Route path="settings" element={<Settings/>}></Route>
          <Route path="likedVideos" element={<LikedVideos/>}></Route>
          <Route path="playlist" element={<UserPlaylist/>}></Route>
          <Route path="playlistBox/:playlistId" element={<PlaylistBox/>}></Route>
          <Route path="tweetPage" element={<TweetsPage/>}></Route>
          <Route path="userTweets" element={<UserTweet/>}></Route>
          <Route path="chatbox/:channelId" element={<ChatBox/>}></Route>
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
