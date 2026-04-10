import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Phone, ArrowRight, Fingerprint } from 'lucide-react';
import api from '../../services/api';
import './DonorLogin.css';

const DonorLogin = () => {
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  // Gestion de la connexion du donneur
  // Simulation avec utilisateur de test pour la démo
  const handleDonorLogin = async (e) => {
    e.preventDefault();
    if (!phone) return;

    try {
      // Simulation d'une connexion avec l'utilisateur de test
      // En production, ceci serait un vrai appel API
      const testUser = {
        id: '69d8a1da379b426856e7f8ee', // ID du donneur de test créé
        name: 'Donneur Test',
        role: 'donor'
      };

      // Stocker l'ID utilisateur dans localStorage
      localStorage.setItem('userId', testUser.id);
      localStorage.setItem('userName', testUser.name);
      localStorage.setItem('userRole', testUser.role);

      navigate('/donor-space');
    } catch (error) {
      console.error('Erreur de connexion:', error);
      alert('Erreur de connexion. Veuillez réessayer.');
    }
  };

  return (
    <div className="donor-login-container">
      <div className="donor-card">
        <div className="donor-icon-header">
          <Heart size={40} className="pulse-icon" fill="#ef4444" color="#ef4444" />
        </div>
        
        <h1 className="donor-title">Rakitra Ra</h1>
        <p className="donor-subtitle">Prêt à sauver une vie aujourd'hui ?</p>

        <form onSubmit={handleDonorLogin} className="donor-form">
          <div className="input-box">
            <Phone size={18} className="icon-fade" />
            <input 
              type="tel" 
              placeholder="Votre numéro de téléphone" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="donor-btn">
            Se connecter <ArrowRight size={18} />
          </button>
        </form>

        <div className="donor-footer">
          <Fingerprint size={14} /> Connexion sécurisée
        </div>
      </div>
    </div>
  );
};

export default DonorLogin;