import React from 'react'
import "./Navbar.css"
import navlogo from "../../assets/Admin Panel Assets/nav-logo.svg"
import navProfile from "../../assets/Admin Panel Assets/nav-profile.svg"

export default function Navbar() {
  return (
    <div className='navbar'>
      <img src={navlogo} className="nav-logo" alt=""  />
      <img src={navProfile} className='nav-profile' alt="" />
    </div>
  )
}
