// src/pages/DashboardPage/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Phone, 
  LogOut, 
  Droplet, 
  Zap, 
  BellDot, 
  Activity,
  HeartHandshake
} from 'lucide-react';
import api from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [donors, setDonors] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [searchQuartier, setSearchQuartier] = useState('');
  const [loading, setLoading] = useState(false);

  // Simulation de données pour le design (à enlever quand le backend est prêt)
  useEffect(() => {
    setDonors([
      { _id: '1', name: 'Jean R.', bloodGroup: 'O+', location: 'Ampefiloha', phone: '+261 34 12 345 67', lastDonation: '3 mois' },
      { _id: '2', name: 'Hery T.', bloodGroup: 'A-', location: 'Analakely', phone: '+261 33 98 765 43', lastDonation: '6 mois' },
      { _id: '3', name: 'Rova S.', bloodGroup: 'B+', location: 'Anosy', phone: '+261 32 11 222 33', lastDonation: '1 mois' },
    ]);
  }, []);

  const handleSearch = async (group = '') => {
    if (!api) return; // Sécurité si api n'est pas configuré
    setLoading(true);
    try {
      const url = group ? `/donors/search?bloodGroup=${encodeURIComponent(group)}` : '/donors/search';
      const response = await api.get(url);
      setDonors(response.data);
    } catch (err) {
      console.error("Erreur de recherche:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleGroup = (group) => {
    const newGroup = selectedGroup === group ? '' : group;
    setSelectedGroup(newGroup);
    handleSearch(newGroup);
  };

  return (
    <div className="rakitra-dashboard">
      {/* BARRE DE NAVIGATION HAUTE (GLASSMORPHISM) */}
      <header className="top-nav">
        <div className="nav-brand">
          <Droplet className="brand-icon" size={28} fill="currentColor" />
          <span>Rakitra Ra</span>
        </div>
        <div className="nav-actions">
          <div className="hospital-badge">
            <HeartHandshake size={18} />
            HJRA Ampefiloha
          </div>
          <button onClick={() => navigate('/admin')} className="logout-icon-btn" title="Déconnexion">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* SECTION GAUCHE : RECHERCHE & STATS RAPIDES */}
        <aside className="control-panel">
          <div className="panel-card search-card">
            <h3 className="card-title">
              <Zap size={20} className="text-primary" />
              Recherche d'Urgence
            </h3>
            
            <div className="blood-selector-grid">
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                <button
                  key={group}
                  onClick={() => toggleGroup(group)}
                  className={`blood-pill ${selectedGroup === group ? 'active' : ''}`}
                >
                  {group}
                </button>
              ))}
            </div>

            <div className="search-field">
              <MapPin className="field-icon" size={18} />
              <input 
                type="text" 
                placeholder="Filtrer par quartier (ex: Anosy...)" 
                className="field-input"
                value={searchQuartier}
                onChange={(e) => setSearchQuartier(e.target.value)}
              />
            </div>
          </div>

          <div className="panel-card stats-card">
            <h3 className="card-title">
              <Activity size={20} className="text-success" />
              Aperçu du Stock
            </h3>
            <div className="mini-stats">
              <div className="stat-item critical">
                <span className="stat-value">O-</span>
                <span className="stat-label">Critique</span>
              </div>
              <div className="stat-item ok">
                <span className="stat-value">B+</span>
                <span className="stat-label">Stable</span>
              </div>
            </div>
          </div>
        </aside>

        {/* SECTION DROITE : RÉSULTATS (LISTE MODERNE) */}
        <main className="results-panel">
          <div className="panel-header">
            <h1 className="main-title">Base de Donneurs</h1>
            <span className="results-count">{donors.length} profils trouvés</span>
          </div>

          {loading ? (
            <div className="loading-spinner">Connexion au réseau...</div>
          ) : (
            <div className="donors-list">
              {donors
                .filter(d => d.location?.toLowerCase().includes(searchQuartier.toLowerCase()))
                .map(donor => (
                  <div key={donor._id} className="donor-list-item">
                    <div className={`blood-type-avatar ${donor.bloodGroup?.includes('-') ? 'type-neg' : ''}`}>
                      {donor.bloodGroup}
                    </div>
                    
                    <div className="donor-core-info">
                      <h4>{donor.hospitalName || donor.name || "Donneur Anonyme"}</h4>
                      <div className="info-meta">
                        <MapPin size={14} /> {donor.location}
                      </div>
                    </div>

                    <div className="donor-contact-info">
                      <div className="info-meta">
                        <Phone size={14} /> {donor.phone || '+261 -- --- --'}
                      </div>
                      <div className="info-meta text-muted">
                        Dernier don : {donor.lastDonation || 'Inconnu'}
                      </div>
                    </div>

                    <div className="donor-actions">
                      <button className="action-btn sms-btn">
                        <BellDot size={16} /> Alerter
                      </button>
                    </div>
                  </div>
                ))}
              
              {!loading && donors.length === 0 && (
                <div className="empty-state-card">
                  <Droplet size={48} className="text-muted" />
                  <p>Aucun donneur ne correspond à vos critères d'urgence.</p>
                  <span className="text-muted">Essayez d'élargir la zone géographique.</span>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;