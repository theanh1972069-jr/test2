import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Gửi dữ liệu đến FastAPI backend
      const response = await axios.post(
        'http://127.0.0.1:8000/login',
        new URLSearchParams({
          username: username,
          password: password,
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );

      // ✅ Nếu đăng nhập thành công
      console.log('Login success:', response.data);

      // Lưu trạng thái đăng nhập
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', response.data.role);
      localStorage.setItem('userId', response.data.user_id);
      if (rememberMe) {
        localStorage.setItem('username', username);
      }

      // Chuyển hướng đến dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      setError('Sai tên đăng nhập hoặc mật khẩu!');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="momo-signature-regular">Student Management System</h1>
        <div className="login-form">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tên đăng nhập</label>
              <input
                type="text"
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Mật khẩu</label>
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
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
