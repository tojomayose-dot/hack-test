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
  HeartHandshake,
  Loader,
  SendHorizontal,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import api from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [donors, setDonors] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [searchQuartier, setSearchQuartier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ totalDonors: 0, availableDonors: 0, totalDonations: 0 });
  const [alerts, setAlerts] = useState([]);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertGroupSelected, setAlertGroupSelected] = useState('O+');
  const [sendingAlert, setSendingAlert] = useState(false);

  // Charger les stats et donneurs au montage
  useEffect(() => {
    fetchStats();
    fetchDonors();
    loadSampleAlerts();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/stats');
      setStats(response.data);
    } catch (err) {
      console.error("Erreur stats:", err);
    }
  };

  const fetchDonors = async (group = '') => {
    setLoading(true);
    setError(null);
    try {
      const url = group ? `/donors/search?bloodGroup=${encodeURIComponent(group)}` : '/donors/search';
      const response = await api.get(url);
      setDonors(response.data || []);
    } catch (err) {
      console.error("Erreur recherche:", err);
      setError('❌ Le serveur n\'est pas disponible. Vérifiez que le backend est lancé.');
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSampleAlerts = () => {
    setAlerts([
      { id: 1, group: 'O+', count: 5, timestamp: 'Il y a 30 min', status: 'sent' },
      { id: 2, group: 'AB-', count: 2, timestamp: 'Il y a 2 heures', status: 'failed' },
      { id: 3, group: 'B+', count: 8, timestamp: 'Hier à 14h', status: 'sent' },
    ]);
  };

  const handleSendAlert = async () => {
    if (!alertMessage.trim()) {
      alert('Veuillez entrer un message');
      return;
    }
    
    setSendingAlert(true);
    try {
      const compatibleDonors = donors.filter(d => d.bloodGroup === alertGroupSelected);
      await api.post('/alerts/send', {
        bloodGroupNeeded: alertGroupSelected,
        message: alertMessage,
        hospitalId: 'hospital123' // À remplacer par l'ID réel de l'hôpital
      });
      
      setAlerts([{
        id: Math.random(),
        group: alertGroupSelected,
        count: compatibleDonors.length,
        timestamp: 'À l\'instant',
        status: 'sent'
      }, ...alerts]);
      
      setShowAlertModal(false);
      setAlertMessage('');
      alert(`✅ Alerte envoyée à ${compatibleDonors.length} donneurs ${alertGroupSelected}!`);
    } catch (err) {
      console.error("Erreur alerte:", err);
      alert('❌ Erreur lors de l\'envoi de l\'alerte');
    } finally {
      setSendingAlert(false);
    }
  };

  const toggleGroup = (group) => {
    const newGroup = selectedGroup === group ? '' : group;
    setSelectedGroup(newGroup);
    fetchDonors(newGroup);
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
              Situation en Direct
            </h3>
            <div className="mini-stats">
              <div className="stat-item">
                <div className="stat-value" style={{color: '#0ea5e9'}}>👥 {stats.totalDonors || 0}</div>
                <span className="stat-label">Total donneurs</span>
              </div>
              <div className="stat-item">
                <div className="stat-value" style={{color: '#10b981'}}>✅ {stats.availableDonors || 0}</div>
                <span className="stat-label">Disponibles</span>
              </div>
              <div className="stat-item">
                <div className="stat-value" style={{color: '#ef4444'}}>💉 {stats.totalDonations || 0}</div>
                <span className="stat-label">Dons effectués</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setShowAlertModal(true)}
            className="alert-emergency-btn"
          >
            <Zap size={20} />
            Alerte URGENCE
          </button>

          <div className="panel-card alerts-history">
            <h3 className="card-title">
              <Clock size={20} />
              Alertes Récentes
            </h3>
            <div className="alerts-list">
              {alerts.slice(0, 3).map(alert => (
                <div key={alert.id} className="alert-item">
                  <div className="alert-group-badge">{alert.group}</div>
                  <div className="alert-info">
                    <span className="alert-time">{alert.timestamp}</span>
                    <span className="alert-count">{alert.count} donneurs</span>
                  </div>
                  <div className={`alert-status ${alert.status}`}>
                    {alert.status === 'sent' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  </div>
                </div>
              ))}
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
          ) : error ? (
            <div className="error-card">
              <AlertCircle size={48} style={{color: '#ef4444'}} />
              <p style={{color: '#991b1b', fontWeight: 600}}>{error}</p>
              <span style={{color: '#64748b', fontSize: '14px'}}>Démarrez le backend avec: <code>node backend/server.js</code></span>
            </div>
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
                      <button 
                        onClick={() => {
                          setAlertGroupSelected(donor.bloodGroup);
                          setShowAlertModal(true);
                        }}
                        className="action-btn alert-btn"
                        title="Envoyer une alerte pour ce groupe sanguin"
                      >
                        <BellDot size={16} /> Alerter
                      </button>
                      <button className="action-btn call-btn" title="Appeler">
                        <Phone size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              
              {!loading && !error && donors.length === 0 && (
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

      {/* MODAL D'ALERTE URGENCE */}
      {showAlertModal && (
        <div className="modal-overlay" onClick={() => setShowAlertModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>🚨 Alerte URGENCE</h2>
                <p>Envoyez une alerte aux donneurs {alertGroupSelected}</p>
              </div>
              <button 
                onClick={() => setShowAlertModal(false)}
                className="modal-close-btn"
              >
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Groupe Sanguin Requis</label>
                <div className="blood-selector-grid">
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                    <button
                      key={group}
                      onClick={() => setAlertGroupSelected(group)}
                      className={`blood-pill ${alertGroupSelected === group ? 'active' : ''}`}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Message d'Urgence</label>
                <textarea
                  placeholder="Ex: URGENCE AB+ - Patient critique. Besoin immédiat. Compensation: 1500 Ar"
                  className="form-textarea"
                  value={alertMessage}
                  onChange={(e) => setAlertMessage(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="alert-preview">
                <strong>Aperçu :</strong> Cette alerte sera envoyée à <span className="highlight">{donors.filter(d => d.bloodGroup === alertGroupSelected).length} donneurs</span> disponibles du groupe <span className="highlight">{alertGroupSelected}</span>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                onClick={() => setShowAlertModal(false)}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button 
                onClick={handleSendAlert}
                disabled={sendingAlert}
                className="btn-primary"
              >
                {sendingAlert ? (<><Loader size={16} className="spin" /> Envoi...</>) : (<><SendHorizontal size={16} /> Envoyer Alerte</>)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;