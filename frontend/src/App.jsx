import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import api from './services/api';
import Register from './pages/RegisterPage/Register';
import AdminLogin from './pages/LoginPage/AdminLogin';
import Dashboard from './pages/dashboardPage/Dashboard';
import DonorLogin from './pages/DonorLoginPage/DonorLogin';
import DonorSpace from './pages/DonorSpace/DonorSpace';
import DonationForm from './pages/DonationFormPage/DonationForm';

function App() {
  const [status, setStatus] = useState({ loading: true, connected: false });

  // Vérifie la connexion au backend une seule fois au chargement de l'application
  useEffect(() => {
    api.get('/stats')
      .then(() => setStatus({ loading: false, connected: true }))
      .catch(() => setStatus({ loading: false, connected: false }));
  }, []);

  return (
    <Router>
      <Routes>
        {/* Page principale d'inscription des donneurs */}
        <Route path="/" element={<Register />} />
        {/* Page login pour l'administration */}
        <Route path="/admin" element={<AdminLogin />} />
        {/* Tableau de bord de l'hôpital */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Page de connexion spécifique au donneur */}
        <Route path="/login-donneur" element={<DonorLogin />} />
        {/* Espace dédié au donneur après connexion */}
        <Route path="/donor-space" element={<DonorSpace />} />
        {/* Formulaire de don avec centre sélectionné */}
        <Route path="/formulaire-don" element={<DonationForm />} />
        {/* Page de test / futur login */}
        <Route path="/login" element={<div className="p-10 text-center font-bold">Page Login (H+20)</div>} />
      </Routes>
    </Router>
  );
}

export default App;