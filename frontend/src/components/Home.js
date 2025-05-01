import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/global.css';

function Home() {
  return (
    <div className="page-container">
      <div className="content-card home-content">
        <div className="home-text">
          <h1 className="page-title">Welcome to Team Management System</h1>
          <p className="page-subtitle">Manage your team members efficiently with our easy-to-use platform.</p>
        </div>
        <div className="button-container">
          <Link to="/add-member" className="btn btn-primary">
            Add Member
          </Link>
          <Link to="/view-members" className="btn btn-secondary">
            View Members
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home; 