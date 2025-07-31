// client/src/pages/RegisterPage.js
// =================================================================

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Use a relative path. The proxy will handle routing in development.
      await axios.post('/api/auth/register', { email, password });
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred.');
    }
  };

  return (
    <div className="form-container">
      <h2>Admin Registration</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" name="email" value={email} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={password} onChange={onChange} minLength="6" required />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="btn">Register</button>
      </form>
    </div>
  );
};
export default RegisterPage;