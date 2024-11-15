import React from 'react'
import { useContext } from 'react'
import { UserContext } from '../App'
import Navbar from './Navbar'
import '../assets/css/navbar.css'

const Profile = () => {
    const {user}=useContext(UserContext)
  return (

    <div>
        <Navbar/>
        <div className='home'>
            <h1 className="user">Hello, {user.name}</h1>
      <h1 className='home-title'>
              Welcome To Contact Management System
      </h1>
      <p className='home-description'>
        Start collecting your contacts in very smarter way.
      </p>
    </div>
    </div>
      
    
    
  )
}

export default Profile
