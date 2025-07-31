// client/src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          SurveySphere
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/login" className="nav-links">
              Admin Login
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/register" className="nav-links">
              Admin Register
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
