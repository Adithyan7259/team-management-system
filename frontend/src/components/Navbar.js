import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/global.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link className="navbar-brand" to="/">
          Team Management
        </Link>
        
        <button 
          className="navbar-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggle-icon"></span>
        </button>

        <div className={`navbar-menu ${isMenuOpen ? 'show' : ''}`}>
          <Link className={`navbar-link ${isActive('/')}`} to="/">
            Home
          </Link>
          <Link className={`navbar-link ${isActive('/add-member')}`} to="/add-member">
            Add Member
          </Link>
          <Link className={`navbar-link ${isActive('/view-members')}`} to="/view-members">
            View Members
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
