import React, { useState } from 'react';
import {
  Heart, User, MapPin, Phone, LogOut,
  Calendar, Droplet, Search, Clock,
  ArrowRight, History
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './DonorSpace.css';

const DonorSpace = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [searchTerm, setSearchTerm] = useState('');

  const donor = {
    name: 'Ahmed Rakoto',
    bloodGroup: 'O+',
    location: 'Antananarivo',
    isAvailable: true,
    lastDonation: '2024-03-15',
    totalDonations: 8
  };

  const centers = [
    {
      id: '69d8a1db379b426856e7f8ef',
      name: 'HJRA Ampefiloha',
      address: 'Rue Razanajato, Ampefiloha',
      phone: '+261 20 23 456 789',
      hours: 'Lun-Sam: 8h-16h',
      acceptedBloodTypes: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    {
      id: '69d8a1db379b426856e7f8ef',
      name: 'Centre Befelatanana',
      address: 'Avenue de la Solidarité, Befelatanana',
      phone: '+261 20 23 567 890',
      hours: 'Lun-Dim: 9h-17h',
      acceptedBloodTypes: ['O+', 'O-', 'B+']
    },
    {
      id: '69d8a1db379b426856e7f8ef',
      name: 'Centre Ambatoroka',
      address: 'Boulevard 26 Juin, Ambatoroka',
      phone: '+261 20 23 678 901',
      hours: 'Lun-Ven: 10h-18h',
      acceptedBloodTypes: ['A+', 'B+', 'AB+', 'O+']
    },
    {
      id: '69d8a1db379b426856e7f8ef',
      name: 'Clinique Centrale Tsaralalana',
      address: 'Rue Ranavalona, Centre-Ville',
      phone: '+261 20 23 789 012',
      hours: 'Lun-Sam: 7h-19h',
      acceptedBloodTypes: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    {
      id: '69d8a1db379b426856e7f8ef',
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

      {/* Topbar */}
      <div className="donor-topbar">
        <div className="topbar-brand">
          <div className="topbar-icon-wrap">
            <Heart size={20} fill="white" color="white" />
          </div>
          <div className="topbar-brand-text">
            <h2>Rakitra Ra</h2>
            <span>Espace Donneur</span>
          </div>
        </div>
        <div className="topbar-right">
          <span className="topbar-name">
            <User size={13} style={{ display: 'inline', marginRight: 4 }} />
            {donor.name}
          </span>
          <button
            onClick={() => {
              localStorage.removeItem('donorId');
              navigate('/login-donneur');
            }}
            className="logout-icon-btn"
          >
            <LogOut size={15} /> Déconnexion
          </button>
        </div>
      </div>

      <div className="donor-content">

        {/* Tabs */}
        <div className="tabs-container">
          <button
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={16} /> Mon Profil
          </button>
          <button
            className={`tab-button ${activeTab === 'centers' ? 'active' : ''}`}
            onClick={() => setActiveTab('centers')}
          >
            <MapPin size={16} /> Points de Collecte
          </button>
        </div>

        {/* Profil */}
        {activeTab === 'profile' && (
          <div className="profile-view">

            <div className="bento-grid">

              {/* Header Card */}
              <div className="header-card">
                <div className="avatar">
                  <User size={44} color="white" />
                </div>
                <div className="header-info">
                  <h1 className="donor-name">{donor.name}</h1>
                  <p className="donor-location">
                    <MapPin size={13} /> {donor.location}
                  </p>
                </div>
              </div>

              {/* Groupe Sanguin */}
              <div className="blood-card">
                <div className="card-header">
                  <Droplet size={30} className="icon-blood" />
                </div>
                <p className="card-label">Groupe Sanguin</p>
                <h2 className="card-value">{donor.bloodGroup}</h2>
              </div>

              {/* Statut */}
              <div className="status-card">
                <div className="card-header">
                  <Heart size={30} className="icon-heart" />
                </div>
                <p className="card-label">Disponibilité</p>
                <h2 className="card-value" style={{
                  color: donor.isAvailable ? '#22c55e' : '#ff6b6b',
                  fontSize: '18px'
                }}>
                  {donor.isAvailable ? '✓ Disponible' : '✗ Indisponible'}
                </h2>
              </div>

            </div>

            {/* Infos */}
            <div className="info-section">
              <div className="info-box">
                <div className="info-icon"><Calendar size={22} /></div>
                <p className="info-label">Dernier Don</p>
                <p className="info-value">
                  {new Date(donor.lastDonation).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
              </div>
              <div className="info-box">
                <div className="info-icon"><Heart size={22} /></div>
                <p className="info-label">Total de Dons</p>
                <p className="info-value">{donor.totalDonations} dons</p>
              </div>
            </div>

            {/* Historique */}
            <div className="history-section">
              <h2 className="section-title">
                <History size={18} /> Historique de Vos Dons
              </h2>
              <div className="donations-list">
                {donations.map(donation => (
                  <div key={donation.id} className="donation-card">
                    <div className="donation-left">
                      <h3 className="donation-hospital">{donation.hospital}</h3>
                      <div className="donation-meta">
                        <span><Calendar size={12} />{new Date(donation.date).toLocaleDateString('fr-FR')}</span>
                        <span><Droplet size={12} />{donation.volume} ml</span>
                      </div>
                    </div>
                    <div className="donation-status">{donation.status}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Centres */}
        {activeTab === 'centers' && (
          <div className="centers-view">
            <div className="search-box">
              <Search size={17} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Rechercher un centre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

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
                        <div className="detail"><MapPin size={14} /><span>{center.address}</span></div>
                        <div className="detail"><Phone size={14} /><span>{center.phone}</span></div>
                        <div className="detail"><Clock size={14} /><span>{center.hours}</span></div>
                      </div>
                      <button
                        className="visit-button"
                        onClick={() => navigate('/formulaire-don', {
                          state: { hospitalId: center.id, centerName: center.name }
                        })}
                      >
                        S'y rendre <ArrowRight size={15} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default DonorSpace;