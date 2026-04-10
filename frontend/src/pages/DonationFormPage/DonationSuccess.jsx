import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, CheckCircle, ArrowRight } from 'lucide-react';
import './DonationSuccess.css';

const DonationSuccess = ({ centerName, donationDate }) => {
  const navigate = useNavigate();

  // Animation de confettis (simple)
  useEffect(() => {
    // Animation d'apparition (gérée par CSS)
  }, []);

  const formattedDate = new Date(donationDate).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="success-container">
      {/* Illustration de cœur animée */}
      <div className="success-animation">
        <div className="heart-pulse">
          <Heart size={80} fill="#e63946" color="#e63946" />
        </div>
        <div className="checkmark-badge">
          <CheckCircle size={40} fill="#06b6d4" color="white" />
        </div>
      </div>

      {/* Message de succès */}
      <div className="success-content">
        <h1 className="success-title">Merci Ahmed !</h1>
        
        <p className="success-message">
          Votre promesse de don a été enregistrée avec succès.
        </p>

        <p className="success-subtitle">
          Le centre <strong>{centerName}</strong> est prévenu de votre arrivée.
        </p>

        {/* Détails du don */}
        <div className="donation-details">
          <div className="detail-item">
            <span className="detail-label">✓ Centre</span>
            <span className="detail-value">{centerName}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">✓ Date prévue</span>
            <span className="detail-value">{formattedDate}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">✓ Statut</span>
            <span className="detail-value status-confirmed">Confirmé</span>
          </div>
        </div>

        {/* Message inspirant */}
        <div className="inspiration-box">
          <p>
            🩸 Chaque don sauve jusqu'à <strong>3 vies</strong>. Grâce à vous, des patients en urgence recevront le sang dont ils ont besoin.
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="success-buttons">
          <button
            onClick={() => navigate('/donor-space')}
            className="secondary-button"
          >
            Revenir à mon espace
          </button>
          <button
            onClick={() => navigate('/')}
            className="primary-button"
          >
            Accueil <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Conseils avant le don */}
      <div className="tips-section">
        <h3 className="tips-title">Avant votre visite, n'oubliez pas :</h3>
        <ul className="tips-list">
          <li>✓ Apporter une pièce d'identité valide</li>
          <li>✓ Bien vous hydrater (eau ou jus)</li>
          <li>✓ Éviter l'alcool 24h avant le don</li>
          <li>✓ Manger équilibré la veille</li>
          <li>✓ Arriver 10 minutes en avance</li>
        </ul>
      </div>
    </div>
  );
};

export default DonationSuccess;
