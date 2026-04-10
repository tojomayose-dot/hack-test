import React, { useState, useEffect } from 'react';
import { Heart, User, MapPin, Phone, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './DonorSpace.css';

const DonorSpace = () => {
  const navigate = useNavigate();
  const [donor, setDonor] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Chargement des données du donneur et de son historique
    // Pour le moment, cela reste une simulation de démonstration.
    const fetchDonorData = async () => {
      try {
        // Supposons que l'ID du donneur est stocké en localStorage après authentification
        const donorId = localStorage.getItem('donorId');
        if (donorId) {
          const res = await api.get(`/donations/${donorId}`);
          setDonations(res.data);
          // Affichage temporaire des informations du donneur
          setDonor({ name: 'Donneur Exemple', bloodGroup: 'A+', location: 'Antananarivo' });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonorData();
  }, []);

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="donor-space">
      <div className="header">
        <div className="header-title">
          <Heart size={32} color="#ef4444" />
          <h1>Espace Donneur</h1>
        </div>
        <button 
          onClick={() => navigate('/login-donneur')}
          className="logout-btn"
          title="Déconnexion"
        >
          <LogOut size={20} />
        </button>
      </div>

      {donor && (
        <div className="profile-card">
          <User size={24} />
          <div>
            <h2>{donor.name}</h2>
            <p>Groupe sanguin: {donor.bloodGroup}</p>
            <p><MapPin size={16} /> {donor.location}</p>
          </div>
        </div>
      )}

      <div className="history-section">
        <h3>Historique des Dons</h3>
        {donations.length === 0 ? (
          <p>Aucun don enregistré.</p>
        ) : (
          <ul className="donation-list">
            {donations.map((donation, index) => (
              <li key={index} className="donation-item">
                <div>
                  <strong>{donation.hospitalId?.name || 'Hôpital'}</strong>
                  <p>{new Date(donation.date).toLocaleDateString()}</p>
                  <p>Volume: {donation.volume} ml - État: {donation.healthNote}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DonorSpace;