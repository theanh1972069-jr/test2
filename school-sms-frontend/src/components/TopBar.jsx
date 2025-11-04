// TopBar.jsx
import React from 'react';

const TopBar = ({ userName }) => (
  <header className="top-bar">
    <div className="welcome-message">Welcome, {userName}</div>
    <button className="logout-btn">Logout</button>
  </header>
);

export default TopBar;