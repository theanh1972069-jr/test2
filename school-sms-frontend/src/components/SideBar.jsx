// Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import Link và useLocation

const navItems = [
  { name: 'Dashboard', icon: 'fas fa-tachometer-alt', link: '/' },
  { name: 'Students', icon: 'fas fa-graduation-cap', link: '/students' },
  { name: 'Teachers', icon: 'fas fa-chalkboard-teacher', link: '/teachers' },
  { name: 'Classes/Grades', icon: 'fas fa-school', link: '/classes' },
  { name: 'Subjects', icon: 'fas fa-book', link: '/subjects' },
  { name: 'School Years/Semesters', icon: 'fas fa-calendar-alt', link: '/semesters' },
  { name: 'Settings', icon: 'fas fa-cog', link: '/settings' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <header className="sidebar-header">
        <h1 className="logo">SMS API</h1>
      </header>
      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li
              key={item.name}
              className={
                location.pathname === item.link ||
                  (item.link === '/' && location.pathname === '/dashboard')
                  ? 'active'
                  : ''
              }
            >
              <Link to={item.link}>
                <i className={item.icon}></i> {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
