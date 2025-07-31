// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar'; // <-- Import Navbar
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar /> {/* <-- Add Navbar here, outside of the Routes */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
