import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Kiểm tra email và password (có thể thay bằng API call thực tế)
    if (email && password) {
      // Lưu trạng thái đăng nhập
      localStorage.setItem('isAuthenticated', 'true');
      
      // Có thể lưu thêm thông tin user nếu cần
      if (rememberMe) {
        localStorage.setItem('userEmail', email);
      }

      // Chuyển hướng đến trang dashboard
      navigate('/dashboard');
    } else {
      // Thông báo lỗi nếu cần
      alert('Please enter email and password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className='momo-signature-regular'>Student Management System</h1>
        <div className="login-form">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="*****"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <a href="/forgot-password">Forgot password?</a>
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;