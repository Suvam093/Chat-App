import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import HomePage from './pages/HomePage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import { useAuthStore } from './store/useAuthStore.js'
import { useThemeStore } from './store/useThemeStore.js'
import { useEffect } from 'react'
import {Loader} from 'lucide-react'
import { Toaster } from 'react-hot-toast'           //to make the error messages look nice on the screen


const App = () => {

  const {authUser,checkAuth, isCheckingAuth, onlineUsers } = useAuthStore()
  console.log("onlineUsers" , onlineUsers)

  const { theme } = useThemeStore();


  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  console.log({authUser})

  if(isCheckingAuth && !authUser) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Loader className='size-10 animate-spin' />
      </div>
    )
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to ="/login" />} />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to ="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to ="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to ="/login" />} />

      </Routes>

      <Toaster />
    </div>
  )
}

export default App
