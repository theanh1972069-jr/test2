// App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Sidebar from './SideBar';
import TopBar from './TopBar';
import Dashboard from './Dashboard';
import StudentsPage from './Student/StudentsPage';
import TeachersPage from './Teacher/TeachersPage';
import ClassesPage from './Classes/ClassesPage';
//import AddClassPage from './Classes/AddClassesPage';
import SemestersPage from './SemestersPage';
import '../style/Dashboard.css';

//ProtectedRoute: chỉ cho phép truy cập nếu đã đăng nhập
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

//Các trang phụ
const SubjectsPage = () => (
  <div className="dashboard-content">
    <h2>Subjects Management</h2>
    <p>Content for managing subjects will go here.</p>
  </div>
);

const SettingsPage = () => (
  <div className="dashboard-content">
    <h2>Settings</h2>
    <p>Content for system settings will go here.</p>
  </div>
);

//App chính
const App = () => {
  return (
    <Routes>
      {/* Route Login không cần sidebar */}
      <Route path="/login" element={<Login />} />

      {/* Các route yêu cầu đăng nhập */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="app-container">
              <Sidebar />
              <main className="main-content">
                <TopBar userName="Admin" />
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/students" element={<StudentsPage />} />
                  <Route path="/teachers" element={<TeachersPage />} />
                  <Route path="/classes" element={<ClassesPage />} />

                  <Route path="/subjects" element={<SubjectsPage />} />
                  <Route path="/semesters" element={<SemestersPage />} />
                  <Route path="/settings" element={<SettingsPage />} />

                  {/* Route 404 */}
                  <Route
                    path="*"
                    element={
                      <div className="dashboard-content">
                        <h2>404 Not Found</h2>
                        <p>The page you are looking for does not exist.</p>
                      </div>
                    }
                  />
                </Routes>
              </main>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
