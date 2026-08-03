import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './signup.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage('❌ Please fill all fields');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', {
        email,
        password,
      });

      // If signup successful
      if (res.data.success) {
        setMessage('✅ Signup successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login'); // redirect to login after 2 seconds
        }, 2000);
      } else {
        setMessage(res.data.message || '❌ Signup failed!');
      }
    } catch (err) {
      console.log(err);
      setMessage('❌ Error connecting to server');
    }
  };

  return (
    <div className="form-container">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
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
        <button type="submit">Signup</button>
      </form>
      <p>{message}</p>
      <p>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
}

export default Signup;
