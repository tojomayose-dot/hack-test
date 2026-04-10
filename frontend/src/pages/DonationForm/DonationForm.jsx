import React, { useState, useEffect } from 'react';
import { Heart, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import api from '../../services/api';
import './DonationForm.css';

const DonationForm = () => {
  // États du formulaire - récupérer depuis localStorage si disponible
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('donationForm');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      hospitalName: '',
      amount: 450,
      healthNote: 'Normal'
    };
  });

  const [submitting, setSubmitting] = useState(false);

  // États pour les retours utilisateur
  const [feedback, setFeedback] = useState({
    type: null, // 'success', 'error', 'info'
    message: ''
  });

  // Initialisation au montage - vérifier que l'utilisateur est connecté
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user._id) {
      setFeedback({
        type: 'error',
        message: 'Vous devez être connecté en tant que donneur pour accéder à ce formulaire.'
      });
    } else {
      setFeedback({
        type: 'info',
        message: 'Formulaire prêt. Remplissez tous les champs.'
      });
    }
  }, []);

  // Gestion des changements de champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = {
      ...formData,
      [name]: name === 'amount' ? Number(value) : value
    };
    setFormData(updatedData);
    
    // Sauvegarder dans localStorage à chaque changement
    localStorage.setItem('donationForm', JSON.stringify(updatedData));

    // Réinitialiser les messages de feedback lors de la modification
    setFeedback({ type: null, message: '' });
  };

  // Validation du formulaire
  const validateForm = () => {
    if (!formData.donorId) {
      setFeedback({
        type: 'error',
        message: '⚠️ Erreur: ID du donneur non trouvé. Veuillez vous reconnecter.'
      });
      return false;
    }

    if (!formData.hospitalId) {
      setFeedback({
        type: 'error',
        message: '⚠️ Veuillez sélectionner un hôpital.'
      });
      return false;
    }

    if (formData.amount < 100 || formData.amount > 1000) {
      setFeedback({
        type: 'error',
        message: '⚠️ Le volume doit être entre 100 ml et 1000 ml.'
      });
      return false;
    }

    return true;
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setFeedback({ type: 'info', message: 'Envoi en cours...' });

      const response = await api.post('/api/donations', {
        donorId: formData.donorId,
        hospitalId: formData.hospitalId,
        bloodGroup: formData.bloodGroup,
        amount: formData.amount
      });

      setFeedback({
        type: 'success',
        message: `✓ Don enregistré avec succès! ID: ${response.data._id}`
      });

      // Réinitialiser le formulaire et localStorage
      const resetData = {
        donorId: '',
        hospitalId: '',
        amount: 450,
        healthNote: 'Normal',
        bloodGroup: ''
      };
      setFormData(resetData);
      localStorage.removeItem('donationForm');

      // Masquer le message après 5 secondes
      setTimeout(() => {
        setFeedback({ type: null, message: '' });
      }, 5000);

    } catch (err) {
      setFeedback({
        type: 'error',
        message: `✗ Erreur: ${err.response?.data?.error || err.message}`
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Rendu conditionnel pour le chargement
  if (loading) {
    return (
      <div className="donation-form-container">
        <div className="donation-form-card">
          <div className="loading-state">
            <Loader className="spinner" />
            <p>Chargement des données...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="donation-form-container">
      <div className="donation-form-card">
        {/* En-tête */}
        <div className="donation-form-header">
          <Heart size={32} className="heart-icon" />
          <h1>Enregistrer un Don de Sang</h1>
          <p className="subtitle">Aidez-nous à sauver des vies</p>
        </div>

        {/* Messages de feedback */}
        {feedback.message && (
          <div className={`feedback-message feedback-${feedback.type}`}>
            {feedback.type === 'success' && (
              <CheckCircle size={20} className="feedback-icon" />
            )}
            {feedback.type === 'error' && (
              <AlertCircle size={20} className="feedback-icon" />
            )}
            {feedback.type === 'info' && (
              <Loader size={20} className="feedback-icon" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="donation-form">
          {/* Sélection de l'hôpital */}
          <div className="form-group">
            <label htmlFor="hospitalId" className="form-label">
              Hôpital Receveur <span className="required">*</span>
            </label>
            <select
              id="hospitalId"
              name="hospitalId"
              value={formData.hospitalId}
              onChange={handleChange}
              className="form-input"
              required
              disabled={loading}
            >
              <option value="">
                {loading ? 'Chargement des hôpitaux...' : '-- Sélectionner un hôpital --'}
              </option>
              {hospitals.map(hospital => (
                <option key={hospital._id} value={hospital._id}>
                  {hospital.hospitalName || hospital.name} - {hospital.location}
                </option>
              ))}
            </select>
            <small className="form-help">
              Sélectionnez l'hôpital destinataire
            </small>
          </div>

          {/* Quantité de sang */}
          <div className="form-group">
            <label htmlFor="amount" className="form-label">
              Volume (ml) <span className="required">*</span>
            </label>
            <div className="volume-input-group">
              <input
                type="range"
                id="amountRange"
                name="amountRange"
                min="100"
                max="1000"
                step="50"
                value={formData.amount}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    amount: Number(e.target.value)
                  }));
                  setFeedback({ type: null, message: '' });
                }}
                className="form-range"
                disabled={loading}
              />
              <input
                type="number"
                id="amount"
                name="amount"
                min="100"
                max="1000"
                value={formData.amount}
                onChange={handleChange}
                className="form-input volume-number"
                disabled={loading}
              />
              <span className="volume-unit">ml</span>
            </div>
            <small className="form-help">
              Entre 100 ml et 1000 ml (standard: 450 ml)
            </small>
          </div>

          {/* État de santé */}
          <div className="form-group">
            <label htmlFor="healthNote" className="form-label">
              État de Santé du Donneur
            </label>
            <select
              id="healthNote"
              name="healthNote"
              value={formData.healthNote}
              onChange={handleChange}
              className="form-input"
              disabled={loading}
            >
              <option value="Normal">Normal</option>
              <option value="Fatigue">Fatigue</option>
              <option value="Tension Basse">Tension Basse</option>
              <option value="Autre">Autre</option>
            </select>
            <small className="form-help">
              Sélectionnez l'état du donneur après le don
            </small>
          </div>

          {/* Boutons d'action */}
          <div className="form-actions">
            <button
              type="submit"
              disabled={submitting || loading}
              className="btn btn-primary"
            >
              {submitting ? (
                <>
                  <Loader size={18} className="btn-icon spinner" />
                  Enregistrement en cours...
                </>
              ) : (
                <>
                  <Heart size={18} className="btn-icon" />
                  Enregistrer le Don
                </>
              )}
            </button>
            <button
              type="reset"
              onClick={() => {
                const resetData = {
                  donorId: '',
                  hospitalId: '',
                  amount: 450,
                  healthNote: 'Normal',
                  bloodGroup: ''
                };
                setFormData(resetData);
                localStorage.removeItem('donationForm');
                setFeedback({ type: null, message: '' });
              }}
              className="btn btn-secondary"
            >
              Réinitialiser
            </button>
          </div>
        </form>

        {/* Information supplémentaire */}
        <div className="donation-info">
          <h3>📋 Information Importante</h3>
          <ul>
            <li>Le volume standard est de 450 ml</li>
            <li>Le donneur connecté est automatiquement sélectionné</li>
            <li>Vos données sont sauvegardées automatiquement</li>
            <li>Tous les champs avec * sont obligatoires</li>
            <li>Les données sont sauvegardées dans MongoDB</li>
            <li>Vous recevrez une confirmation immédiate</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DonationForm;
