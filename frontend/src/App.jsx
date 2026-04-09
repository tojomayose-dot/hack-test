import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import api from './services/api';
import Register from './pages/Register';

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
        <Route path="/login" element={<div className="p-10 text-center font-bold">Page Login (H+20)</div>} />
      </Routes>
    </Router>
  );
}

export default App;