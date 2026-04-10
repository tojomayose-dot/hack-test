import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Phone, ArrowRight, Fingerprint, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import api from '../../services/api';
import TechPatternBackground from '../../components/TechPatternBackground';
import './DonorLogin.css';

const DonorLogin = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Gestion de la connexion du donneur - Utilise la route backend sécurisée
  const handleDonorLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!phone || phone.trim() === '') {
      setError('Veuillez entrer votre numéro de téléphone');
      return;
    }

    if (!password || password === '') {
      setError('Veuillez entrer votre mot de passe');
      return;
    }

    setIsLoading(true);

    try {
      console.log('\n📱 TENTATIVE DE CONNEXION DONNEUR');
      console.log('   Phone:', phone);
      console.log('   Password:', '***');

      const response = await api.post('/auth/donor-login', {
        phone: phone.trim(),
        password: password
      });

      console.log('   ✅ Réponse serveur:', response.data);

      const user = response.data.user;

      // Stockage de l'utilisateur réel et de son ID dans localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userId', user._id);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userPhone', user.phone);
      localStorage.setItem('bloodGroup', user.bloodGroup);

      console.log('   ✅ Données stockées dans localStorage');
      console.log('   Redirection vers /donor-space...\n');

      // Redirection vers l'espace donneur
      navigate('/donor-space');
    } catch (err) {
      console.log('   ❌ Erreur:', err.response?.data || err.message);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        'Erreur de connexion. Veuillez réessayer.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="donor-container theme-donneur">
      <TechPatternBackground themeColor="red" />

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
          <p style={{ color: '#ffffff', fontSize: '14px' }}>Prêt à sauver une vie aujourd'hui ?</p>
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

          {/* Mot de passe */}
          <div>
            <label>
              <Fingerprint size={14} /> Mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="donor-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'rgba(148, 163, 184, 0.7)',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Bouton connexion */}
          <button type="submit" className="donor-btn" disabled={isLoading}>
            {isLoading ? 'Connexion en cours...' : 'Se connecter'} <ArrowRight size={18} />
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