// client/src/pages/AdminDashboardPage.js
// =================================================================

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboardPage = () => {
  const [surveys, setSurveys] = useState([]);
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [timer, setTimer] = useState(10);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchSurveys = async (token) => {
    try {
      // Use a relative path.
      const res = await axios.get('/api/surveys', { headers: { 'x-auth-token': token } });
      setSurveys(res.data);
    } catch (err) {
      setError('Could not fetch surveys.');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    else fetchSurveys(token);
  }, [navigate]);

  const handleOptionChange = (index, event) => {
    const newOptions = [...options];
    newOptions[index] = event.target.value;
    setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, '']);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');
    try {
      const surveyData = { title, options: options.filter(opt => opt.trim() !== ''), timer };
      // Use a relative path.
      await axios.post('/api/surveys', surveyData, { headers: { 'x-auth-token': token } });
      setTitle('');
      setOptions(['', '']);
      setTimer(10);
      fetchSurveys(token);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create survey.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="btn logout-btn">Logout</button>
      </div>
      <div className="form-container">
        <h2>Create a New Survey</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Survey Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Options</label>
            {options.map((option, index) => (
              <input key={index} type="text" value={option} onChange={(e) => handleOptionChange(index, e)} placeholder={`Option ${index + 1}`} style={{ marginBottom: '10px' }} required />
            ))}
            <button type="button" onClick={addOption} className="btn-secondary">Add Option</button>
          </div>
          <div className="form-group">
            <label>Timer (in minutes)</label>
            <input type="number" value={timer} onChange={(e) => setTimer(e.target.value)} min="1" required />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn">Create Survey</button>
        </form>
      </div>
      <div className="surveys-list">
        <h2>Your Surveys</h2>
        {surveys.length > 0 ? (
          surveys.map(survey => (
            <div key={survey._id} className="survey-item">
              <h3>{survey.title}</h3>
              <p>Expires: {new Date(survey.expiresAt).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p>You haven't created any surveys yet.</p>
        )}
      </div>
    </div>
  );
};
export default AdminDashboardPage;
