import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import api from './services/api';
import Register from './pages/RegisterPage/Register';
import AdminLogin from './pages/LoginPage/AdminLogin';
import Dashboard from './pages/dashboardPage/Dashboard';
import DonorLogin from './pages/DonorLoginPage/DonorLogin';
import DonorSpace from './pages/DonorSpace/DonorSpace';

function App() {
  const [status, setStatus] = useState({ loading: true, connected: false });

  useEffect(() => {
    api.get('/stats')
      .then(() => setStatus({ loading: false, connected: true }))
      .catch(() => setStatus({ loading: false, connected: false }));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login-donneur" element={<DonorLogin />} />
        <Route path="/donor-space" element={<DonorSpace />} />
        <Route path="/login" element={<div className="p-10 text-center font-bold">Page Login (H+20)</div>} />
      </Routes>
    </Router>
  );
}

export default App;