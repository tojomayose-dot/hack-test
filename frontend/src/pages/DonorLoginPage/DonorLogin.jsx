import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Phone, ArrowRight, Fingerprint, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import './DonorLogin.css';

const DonorLogin = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleDonorLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/login', { phone });
      if (response.data && response.data.user.role === 'donor') {
        navigate('/donor-space');
      } else {
        setError("Accès réservé aux donneurs.");
      }
    } catch (err) {
      // Simulation pour la démo
      if (phone) {
        navigate('/donor-space');
      } else {
        setError("Veuillez entrer votre numéro de téléphone.");
      }
    }
  };

  return (
    <div className="donor-container theme-donneur">

      {/* Barre statut */}
      <div className="donor-status-bar">
        <span style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px' }}>
          Espace Donneur
        </span>
        <span style={{ fontSize: '12px', fontWeight: '700', color: '#d32f2f', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Heart size={12} /> Donneur
        </span>
      </div>

      <div className="donor-card">

        {/* En-tête */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="donor-icon">
            <Heart size={32} color="white" className="pulse-icon" fill="white" />
          </div>
          <h1>Rakitra Ra</h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Prêt à sauver une vie aujourd'hui ?</p>
        </div>

        <form onSubmit={handleDonorLogin} className="donor-form">

          {/* Erreur */}
          {error && (
            <div className="donor-error">
              {error}
            </div>
          )}

          {/* Téléphone */}
          <div>
            <label>
              <Phone size={14} /> Numéro de téléphone
            </label>
            <input
              type="tel"
              placeholder="034 00 000 00"
              className="donor-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {/* Bouton connexion */}
          <button type="submit" className="donor-btn">
            Se connecter <ArrowRight size={18} />
          </button>

          {/* Liens */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); navigate('/register'); }}
              className="donor-link"
            >
              Pas encore inscrit ? S'inscrire
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); navigate('/'); }}
              className="donor-link"
            >
              <ArrowLeft size={14} /> Retour au portail public
            </a>
          </div>

        </form>

        {/* Footer */}
        <div className="donor-footer">
          <Fingerprint size={14} /> Connexion sécurisée
        </div>

      </div>
    </div>
  );
};

export default DonorLogin;