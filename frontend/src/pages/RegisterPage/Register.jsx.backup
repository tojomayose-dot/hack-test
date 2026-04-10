import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, User, Phone, MapPin, Lock, Droplets, UserCheck, Hospital } from 'lucide-react';
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

  useEffect(() => {
    api.get('/stats')
      .then(() => setBackendStatus("Connecté ✅"))
      .catch(() => setBackendStatus("Déconnecté ❌"));
  }, []);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

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

      {/* Barre statut */}
      <div className="auth-status-bar">
        <span style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px' }}>
          Serveur
        </span>
        <span style={{ fontSize: '12px', fontWeight: '700', color: backendStatus.includes('✅') ? '#22c55e' : '#ef4444' }}>
          {backendStatus}
        </span>
      </div>

      <div className="auth-card">

        {/* En-tête */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="auth-icon">
            <Heart size={32} color="white" className="pulse-icon" fill="white" />
          </div>
          <h1>Rakitra Ra</h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Sauvez des vies en un clic</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">

          {/* Nom complet */}
          <div>
            <label><User size={14} /> Nom complet</label>
            <div className="input-with-icon">
              <User size={16} color="#94a3b8" />
              <input
                type="text"
                placeholder="Ex: Jean Rakoto"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Téléphone */}
          <div>
            <label><Phone size={14} /> Téléphone</label>
            <div className="input-with-icon">
              <Phone size={16} color="#94a3b8" />
              <input
                type="text"
                placeholder="034 00 000 00"
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Quartier */}
          <div>
            <label><MapPin size={14} /> Quartier</label>
            <div className="input-with-icon">
              <MapPin size={16} color="#94a3b8" />
              <input
                type="text"
                placeholder="Ex: Ankatso"
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Groupe sanguin */}
          <div>
            <label><Droplets size={14} /> Groupe Sanguin</label>
            <select
              value={formData.bloodGroup || ''}
              onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
              className="auth-select"
            >
              <option value="" disabled>-- Sélectionner --</option>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
              <option value="inconnu">Je ne connais pas mon groupe sanguin</option>
            </select>
          </div>

          {/* Mot de passe */}
          <div>
            <label> <Lock size={14} /> Mot de passe</label>
            <div className="input-with-icon">
              <Lock size={16} color="#94a3b8" />
              <input
                type="password"
                placeholder="••••••••"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>          
          </div>

          {/* Bouton S'inscrire */}
          <button
            type="submit"
            disabled={backendStatus.includes('❌')}
            className="submit-btn"
          >
            <Heart size={18} fill="white" />
            S'inscrire comme donneur
          </button>

          {/* Liens du bas */}
          <div className="auth-links">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); navigate('/login-donneur'); }}
              className="auth-link-donor"
            >
              <UserCheck size={14} /> Accès Espace Donneur
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); navigate('/admin'); }}
              className="auth-link-admin"
            >
              <Hospital size={14} /> Accès Administration Hôpital
            </a>
          </div>

        </form>

        {/* Liens alternatifs vers les autres pages */}
        <div className="mt-6 flex flex-col gap-3">
        </div>
      </div>
    </div>
  );
};

export default Register;