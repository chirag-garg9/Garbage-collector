import React, { useEffect, useState } from 'react';
import './navbar.css'
import { Link } from 'react-router-dom';

const Navbar = () => {
 const [open, setOpen] = useState(false);

 const handleClick = () => {
    setOpen(!open);
 };

 return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo"><img src="../../../public/logo.png" alt="logo" /></Link>
      <ul className={`navbar-menu ${open ? 'navbar-open' : ''}`}>
        <li className="navbar-item">
          <Link to="/" className="navbar-link">Home</Link>
        </li>
        <li className="navbar-item">
          <Link to="/map" className="navbar-link">Map</Link>
        </li>
        <li className="navbar-item">
          <Link to="/uploadvideo" className="navbar-link">Add Camera</Link>
        </li>
        <li className="navbar-item">
          <Link to="/Login-signup" className="navbar-link">Login/Signup</Link>
        </li>
      </ul>
      <div className="navbar-hamburger" onClick={handleClick}>
        <div className={`hamburger-line ${open ? 'hamburger-open' : ''}`}></div>
        <div className={`hamburger-line ${open ? 'hamburger-open' : ''}`}></div>
        <div className={`hamburger-line ${open ? 'hamburger-open' : ''}`}></div>
      </div>
    </nav>
 );
};

export default Navbar;