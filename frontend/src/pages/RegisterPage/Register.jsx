import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [backendStatus, setBackendStatus] = useState("Vérification...");
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    role: 'donor',
    location: '',
    bloodGroup: '',
    isAvailable: true
  });

  // Vérifier si le backend est disponible pour éviter les inscriptions sans serveur
  useEffect(() => {
    api.get('/stats')
      .then(() => setBackendStatus("Connecté ✅"))
      .catch(() => setBackendStatus("Déconnecté ❌"));
  }, []);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Envoi du formulaire d'inscription vers le backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      alert("Inscription réussie !");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || "Erreur serveur");
    }
  };

  return (
    <div className="auth-container theme-donneur">
      {/* Indicateur de connexion au backend */}
      <div className="max-w-md w-full mb-4 flex justify-between items-center bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Serveur</span>
        <span className={`text-xs font-bold ${backendStatus.includes('✅') ? 'text-green-500' : 'text-red-500'}`}>
          {backendStatus}
        </span>
      </div>

      <div className="auth-card">
        <div className="text-center mb-8">
          <h1>Rakitra Ra</h1>
          <p className="text-slate-500 text-sm">Sauvez des vies en un clic</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nom complet</label>
            <input
              type="text"
              placeholder="Ex: Jean Rakoto"
              className="auth-form-input"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Téléphone</label>
            <input
              type="text"
              placeholder="034 00 000 00"
              className="auth-form-input"
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Quartier</label>
            <input
              type="text"
              placeholder="Ex: Ankatso"
              className="auth-form-input"
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Groupe Sanguin</label>
            <div className="grid grid-cols-4 gap-2">
              {bloodGroups.map((group) => (
                <button
                  key={group}
                  type="button"
                  onClick={() => setFormData({...formData, bloodGroup: group})}
                  className={`py-2 rounded-lg border-2 font-bold transition ${
                    formData.bloodGroup === group
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-slate-100 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              className="auth-form-input"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button
            type="submit"
            disabled={backendStatus.includes('❌')}
            className="submit-btn"
            style={{
              background: backendStatus.includes('❌') ? '#cbd5e1' : 'var(--primary-color)',
              cursor: backendStatus.includes('❌') ? 'not-allowed' : 'pointer'
            }}
          >
            S'inscrire comme donneur
          </button>
        </form>

        {/* Liens alternatifs vers les autres pages */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => navigate('/login-donneur')}
            className="block w-full text-sm font-semibold text-white bg-red-500 hover:bg-red-600 py-2 rounded-lg transition"
          >
            Accès Espace Donneur
          </button>
          <button
            onClick={() => navigate('/admin')}
            className="text-sm text-slate-400 hover:text-blue-500 underline transition text-center"
          >
            Accès Administration Hôpital
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;