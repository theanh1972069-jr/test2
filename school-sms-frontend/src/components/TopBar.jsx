// TopBar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const TopBar = ({ userName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <header className="top-bar">
      <div className="welcome-message">Welcome, {userName}</div>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
};

export default TopBar;