import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Activity, Droplet, CheckCircle, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import TechPatternBackground from '../../components/TechPatternBackground';
import './DonationForm.css';

const DonationForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hospitalId = location.state?.hospitalId || '';
  const centerName = location.state?.centerName || 'Centre de Collecte';

  // Vérification de sécurité : hospitalId doit être présent
  React.useEffect(() => {
    if (!hospitalId) {
      alert('Veuillez sélectionner un centre de collecte.');
      navigate('/donor-space');
    }
  }, [hospitalId, navigate]);

  // Récupération de l'ID du donneur connecté (via localStorage)
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  const donorId = localStorage.getItem('userId') || storedUser?._id || '';
  const [lastDonationDate, setLastDonationDate] = useState(undefined);
  const [lastDonationLoading, setLastDonationLoading] = useState(true);

  // Vérification d'authentification : rediriger si non connecté
  useEffect(() => {
    if (!donorId) {
      alert('Veuillez vous connecter pour enregistrer un don.');
      navigate('/login-donneur');
      return;
    }
  }, [donorId, navigate]);

  useEffect(() => {
    const fetchLastDonation = async () => {
      if (!donorId) {
        setLastDonationDate(null);
        setLastDonationLoading(false);
        return;
      }

      setLastDonationLoading(true);
      try {
        const response = await api.get(`/donations/${donorId}`);
        const donations = response.data || [];
        if (donations.length > 0) {
          const sorted = donations.sort(
            (a, b) => new Date(b.donationDate) - new Date(a.donationDate)
          );
          setLastDonationDate(sorted[0].donationDate);
        } else {
          setLastDonationDate(null);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération du dernier don :', err);
        setLastDonationDate(null);
      } finally {
        setLastDonationLoading(false);
      }
    };

    fetchLastDonation();
  }, [donorId]);

  const [formData, setFormData] = useState({
    donationDate: new Date().toISOString().split('T')[0], // Date d'aujourd'hui par défaut
    healthNote: '',
    amount: 450, // Quantité par défaut
    status: 'pending'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Gestion du changement de champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'amount' ? parseInt(value) || 0 : value
    });
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation de base
    if (!formData.donationDate || !formData.healthNote.trim() || formData.amount <= 0) {
      setError('Veuillez remplir tous les champs correctement.');
      return;
    }

    if (lastDonationLoading) {
      setError('Vérification de votre dernier don en cours. Veuillez patienter quelques instants.');
      return;
    }

    if (lastDonationDate) {
      const dateActuelle = new Date();
      const derniereDateDon = new Date(lastDonationDate);
      const daysSinceLastDonation = Math.floor(
        (dateActuelle - derniereDateDon) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceLastDonation < 56) {
        const joursRestants = 56 - daysSinceLastDonation;
        setError(
          `Désolé, vous ne pouvez pas encore participer. Votre dernier don est trop récent. Prenez un repos en attendant que vos réserves se régénèrent (Minimum 56 jours). Il reste ${joursRestants} jour${joursRestants > 1 ? 's' : ''} avant votre prochaine éligibilité.`
        );
        return;
      }
    }

    setIsLoading(true);

    try {
      // Préparation des données avec les bons types pour MongoDB
      const donationData = {
        donorId: donorId,
        hospitalId: hospitalId,
        donationDate: new Date(formData.donationDate).toISOString(), // Format ISO pour MongoDB
        healthNote: formData.healthNote.trim(),
        amount: Number(formData.amount), // Conversion explicite en nombre
        status: formData.status
      };

      // Debugging : afficher les données envoyées
      console.log('Données envoyées :', donationData);

      await api.post('/donations', donationData);
      setIsSubmitted(true);
    } catch (err) {
      // Afficher l'erreur précise du serveur
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Erreur serveur inconnue';
      setError(`Erreur lors de l'enregistrement : ${errorMessage}`);
      console.error('Erreur API détaillée:', err);
      alert(`Erreur lors de l'enregistrement : ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Affichage de la confirmation après soumission réussie
  if (isSubmitted) {
    return (
      <div className="donation-form-container">
        <TechPatternBackground themeColor="red" />
        <div className="success-message">
          <CheckCircle size={64} className="success-icon" />
          <h2>Don enregistré avec succès !</h2>
          <p>Votre don a été programmé pour le {new Date(formData.donationDate).toLocaleDateString('fr-FR')}.</p>
          <button
            className="btn-primary"
            onClick={() => navigate('/donor-space')}
          >
            Retour à mon espace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="donation-form-container">
      <TechPatternBackground themeColor="red" />
      {/* Header */}
      <div className="form-header">
        <button
          className="back-btn"
          onClick={() => navigate('/donor-space')}
        >
          <ArrowLeft size={20} />
          Retour
        </button>

      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="donation-form">
        {/* Date du don */}
        <div className="form-group">
          <h1 style={{ color: '#1e293b' }}>Enregistrer un Don</h1>
          <p>Centre : {centerName}</p>
          <label className="form-label">
            <Calendar size={20} />
            Date du don
          </label>
          <input
            type="date"
            name="donationDate"
            value={formData.donationDate}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        {/* Note de santé */}
        <div className="form-group">
          <label className="form-label">
            <Activity size={20} />
            Comment vous sentez-vous ?
          </label>
          <input
            type="text"
            name="healthNote"
            value={formData.healthNote}
            onChange={handleChange}
            placeholder="Ex: Normal, En forme, Fatigué..."
            className="form-input"
            required
          />
        </div>

        {/* Quantité */}
        <div className="form-group">
          <label className="form-label">
            <Droplet size={20} />
            Quantité (ml)
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            min="1"
            className="form-input"
            required
          />
        </div>

        {/* Message d'erreur */}
        {error && <div className="error-message">{error}</div>}

        {/* Boutons */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/donor-space')}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Enregistrement...' : 'Enregistrer le don'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DonationForm;