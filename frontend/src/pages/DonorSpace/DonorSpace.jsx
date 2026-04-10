import React, { useState } from 'react';
import { Heart, User, MapPin, Phone, LogOut, Calendar, Droplet, Search, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './DonorSpace.css';

const DonorSpace = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [searchTerm, setSearchTerm] = useState('');

  // Données simulées du donneur
  const donor = {
    name: 'Ahmed Rakoto',
    bloodGroup: 'O+',
    location: 'Antananarivo',
    isAvailable: true,
    lastDonation: '2024-03-15',
    totalDonations: 8
  };

  // Centres de collecte simulés (avec IDs d'hôpitaux réels)
  const centers = [
    {
      id: '69d8a1db379b426856e7f8ef', // ID réel de l'hôpital de test
      name: 'HJRA Ampefiloha',
      address: 'Rue Razanajato, Ampefiloha',
      phone: '+261 20 23 456 789',
      hours: 'Lun-Sam: 8h-16h',
      acceptedBloodTypes: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    {
      id: '69d8a1db379b426856e7f8ef', // Même hôpital pour tous les centres de test
      name: 'Centre Befelatanana',
      address: 'Avenue de la Solidarité, Befelatanana',
      phone: '+261 20 23 567 890',
      hours: 'Lun-Dim: 9h-17h',
      acceptedBloodTypes: ['O+', 'O-', 'B+']
    },
    {
      id: '69d8a1db379b426856e7f8ef', // Même hôpital pour tous les centres de test
      name: 'Centre Ambatoroka',
      address: 'Boulevard 26 Juin, Ambatoroka',
      phone: '+261 20 23 678 901',
      hours: 'Lun-Ven: 10h-18h',
      acceptedBloodTypes: ['A+', 'B+', 'AB+', 'O+']
    },
    {
      id: '69d8a1db379b426856e7f8ef', // Même hôpital pour tous les centres de test
      name: 'Clinique Centrale Tsaralalana',
      address: 'Rue Ranavalona, Centre-Ville',
      phone: '+261 20 23 789 012',
      hours: 'Lun-Sam: 7h-19h',
      acceptedBloodTypes: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    {
      id: '69d8a1db379b426856e7f8ef', // Même hôpital pour tous les centres de test
      name: 'Centre Anosy',
      address: 'Avenue Pasteur, Anosy',
      phone: '+261 20 23 890 123',
      hours: 'Lun-Sam: 8h-17h',
      acceptedBloodTypes: ['O+', 'A+', 'B+']
    }
  ];

  const donations = [
    { id: 1, date: '2024-03-15', hospital: 'HJRA Ampefiloha', volume: 450, status: 'Complété' },
    { id: 2, date: '2024-01-20', hospital: 'Clinique Centrale', volume: 450, status: 'Complété' },
    { id: 3, date: '2023-11-10', hospital: 'Centre Befelatanana', volume: 450, status: 'Complété' },
    { id: 4, date: '2023-09-05', hospital: 'HJRA Ampefiloha', volume: 450, status: 'Complété' },
    { id: 5, date: '2023-07-12', hospital: 'Centre Anosy', volume: 500, status: 'Complété' }
  ];

  const filteredCenters = centers.filter(center =>
    center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    center.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="donor-space">
      {/* Onglets */}
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={20} />
          Mon Profil
        </button>
        <button
          className={`tab-button ${activeTab === 'centers' ? 'active' : ''}`}
          onClick={() => setActiveTab('centers')}
        >
          <MapPin size={20} />
          Points de Collecte
        </button>
      </div>

      {/* Contenu Mon Profil */}
      {activeTab === 'profile' && (
        <div className="profile-view">
          {/* Bento Grid: Gauche - Header Card, Droite - Deux cartes */}
          <div className="bento-grid">
            {/* Header Card (Gauche - Grand) */}
            <div className="header-card">
              <div className="header-top">
                <button
                  onClick={() => {
                    localStorage.removeItem('donorId');
                    navigate('/login-donneur');
                  }}
                  className="logout-icon-btn"
                  title="Déconnexion"
                >
                  <LogOut size={22} />
                </button>
              </div>

              <div className="avatar">
                <User size={56} />
              </div>

              <div className="header-info">
                <h1 className="donor-name">{donor.name}</h1>
                <p className="donor-location">
                  <MapPin size={16} /> {donor.location}
                </p>
              </div>
            </div>

            {/* Cartes Droite - Haut: Groupe Sanguin */}
            <div className="blood-card">
              <div className="card-header">
                <Droplet size={32} className="icon-blood" />
              </div>
              <p className="card-label">Groupe Sanguin</p>
              <h2 className="card-value">{donor.bloodGroup}</h2>
            </div>

            {/* Cartes Droite - Bas: Statut */}
            <div className="status-card">
              <div className="card-header">
                <Heart size={32} className="icon-heart" />
              </div>
              <p className="card-label">Disponibilité</p>
              <h2 className="card-value">
                {donor.isAvailable ? '✓ Disponible' : 'Indisponible'}
              </h2>
            </div>
          </div>

          {/* Section Infos Supplémentaires */}
          <div className="info-section">
            <div className="info-box">
              <div className="info-icon">
                <Calendar size={24} />
              </div>
              <p className="info-label">Dernier Don</p>
              <p className="info-value">
                {new Date(donor.lastDonation).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>

            <div className="info-box">
              <div className="info-icon">
                <Heart size={24} />
              </div>
              <p className="info-label">Total de Dons</p>
              <p className="info-value">{donor.totalDonations}</p>
            </div>
          </div>

          {/* Historique des Dons */}
          <div className="history-section">
            <h2 className="section-title">Historique de Vos Dons</h2>
            <div className="donations-list">
              {donations.map(donation => (
                <div key={donation.id} className="donation-card">
                  <div className="donation-left">
                    <h3 className="donation-hospital">{donation.hospital}</h3>
                    <div className="donation-meta">
                      <span>
                        <Calendar size={14} />
                        {new Date(donation.date).toLocaleDateString('fr-FR')}
                      </span>
                      <span>
                        <Droplet size={14} />
                        {donation.volume} ml
                      </span>
                    </div>
                  </div>
                  <div className="donation-status">{donation.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contenu Points de Collecte */}
      {activeTab === 'centers' && (
        <div className="centers-view">
          {/* Barre de Recherche */}
          <div className="search-box">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Rechercher un centre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Grille des Centres */}
          {filteredCenters.length === 0 ? (
            <div className="no-results">
              <MapPin size={48} />
              <p>Aucun centre trouvé</p>
            </div>
          ) : (
            <div className="centers-grid">
              {filteredCenters.map(center => {
                const offersBloodType = center.acceptedBloodTypes.includes(donor.bloodGroup);
                return (
                  <div key={center.id} className="center-card">
                    <div className="center-badge">
                      {offersBloodType && <span className="match-badge">✓ Pour vous</span>}
                    </div>
                    <h3 className="center-name">{center.name}</h3>

                    <div className="center-details">
                      <div className="detail">
                        <MapPin size={16} />
                        <span>{center.address}</span>
                      </div>
                      <div className="detail">
                        <Phone size={16} />
                        <span>{center.phone}</span>
                      </div>
                      <div className="detail">
                        <Clock size={16} />
                        <span>{center.hours}</span>
                      </div>
                    </div>

                    <button 
                      className="visit-button"
                      onClick={() => navigate('/formulaire-don', { state: { hospitalId: center.id, centerName: center.name } })}
                    >
                      → S'y rendre
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DonorSpace;