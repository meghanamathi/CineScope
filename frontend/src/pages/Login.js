import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      if (res.data.success) {
        // ✅ Save token if backend sends it (optional)
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
        }

        setMessage('✅ Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/dashboard'); // 🔥 Redirect to Dashboard
        }, 1000);
      } else {
        setMessage(res.data.message || '❌ Login failed!');
      }
    } catch (err) {
      console.log(err);
      setMessage('❌ Error connecting to server');
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
      <p>
        Don’t have an account? <a href="/signup">Signup here</a>
      </p>
    </div>
  );
}

export default Login;