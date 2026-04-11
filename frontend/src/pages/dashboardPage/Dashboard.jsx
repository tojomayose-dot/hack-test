// src/pages/dashboardPage/Dashboard.jsx
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
  X,
  Container,
  Stethoscope
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
  const [stocks, setStocks] = useState([]);
  
  // États pour l'alerte URGENCE (Groupe)
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertGroupSelected, setAlertGroupSelected] = useState('O+');
  const [sendingAlert, setSendingAlert] = useState(false);

  // États pour l'alerte INDIVIDUELLE (SMS)
  const [showIndividualModal, setShowIndividualModal] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [individualMessage, setIndividualMessage] = useState('');
  const [sendingSms, setSendingSms] = useState(false);

  const hospitalId = localStorage.getItem('hospitalId') || 'default-hospital-id';

  useEffect(() => {
    fetchStats();
    fetchDonors();
    fetchAlerts();
    fetchStocks();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/stats');
      setStats(response.data);
    } catch (err) {
      console.error("Erreur stats:", err);
    }
  };

  const fetchDonors = async (group = '', location = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/donors/search', {
        params: { bloodGroup: group, location: location }
      });
      setDonors(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Serveur indisponible");
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const res = await api.get('/alerts');
      setAlerts(res.data);
    } catch (err) {
      console.error("Erreur alerts:", err);
    }
  };

  const fetchStocks = async () => {
    try {
      const res = await api.get(`/stock/${hospitalId}`);
      setStocks(res.data);
    } catch (err) {
      console.error("Erreur stocks:", err);
    }
  };

  // Alerte d'urgence groupée
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
        hospitalId: hospitalId
      });
      
      fetchAlerts();
      setShowAlertModal(false);
      setAlertMessage('');
      alert(`✅ Alerte envoyée aux donneurs ${alertGroupSelected}!`);
    } catch (err) {
      console.error("Erreur alerte:", err);
      alert('❌ Erreur lors de l\'envoi');
    } finally {
      setSendingAlert(false);
    }
  };

  // Alerte individuelle (SIMULATION SMS)
  const handleSendIndividualSms = async () => {
    if (!individualMessage.trim()) {
      alert('Veuillez entrer un message pour le donneur');
      return;
    }
    setSendingSms(true);
    try {
      await api.post('/alerts/individual', {
        hospitalId,
        donorId: selectedDonor._id,
        message: individualMessage
      });
      
      fetchAlerts();
      setShowIndividualModal(false);
      setIndividualMessage('');
      alert(`✅ SMS de sécurité envoyé à ${selectedDonor.name}!`);
    } catch (err) {
      console.error("Erreur SMS:", err);
      alert("❌ Échec de l'envoi du SMS");
    } finally {
      setSendingSms(false);
    }
  };

  const updateStockManual = async (bloodGroup, newQuantity) => {
    try {
      const res = await api.patch('/stock/update', {
        hospitalId,
        bloodGroup,
        quantity: newQuantity
      });
      fetchStocks();
      if (res.data.autoAlertSent) {
        alert(`🚨 STOCK ÉPUISÉ ! Une alerte automatique a été envoyée aux donneurs compatibles pour le groupe ${bloodGroup}.`);
        fetchAlerts();
      }
    } catch (err) {
      console.error("Erreur update stock:", err);
    }
  };

  const toggleGroup = (group) => {
    const newGroup = selectedGroup === group ? '' : group;
    setSelectedGroup(newGroup);
    fetchDonors(newGroup, searchQuartier);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchDonors(selectedGroup, searchQuartier);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchQuartier]);

  return (
    <div className="rakitra-dashboard">
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
        {/* SECTION GAUCHE : RECHERCHE & STOCK */}
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
                placeholder="Filtrer par quartier..." 
                className="field-input"
                value={searchQuartier}
                onChange={(e) => setSearchQuartier(e.target.value)}
              />
            </div>
          </div>

          <div className="panel-card stats-card">
            <h3 className="card-title">
              <Activity size={20} className="text-success" />
              État du Stock Sanguin
            </h3>
            <div className="stock-grid">
              {stocks.map(s => (
                <div key={s.bloodGroup} className="stock-item">
                  <div className="stock-header">
                    <span>Groupe {s.bloodGroup}</span>
                    <span>{s.quantity} ml</span>
                  </div>
                  <div className="stock-bar-bg">
                    <div 
                      className={`stock-bar-fill ${s.status}`} 
                      style={{ width: `${Math.min((s.quantity / 5000) * 100, 100)}%` }}
                    ></div>
                  </div>
                  {s.quantity < 1000 && s.quantity > 0 && (
                    <button 
                      className="stock-near-btn"
                      onClick={() => {
                        setAlertGroupSelected(s.bloodGroup);
                        setAlertMessage(`⚠️ STOCK BAS : Notre réserve de ${s.bloodGroup} est presque vide. Si vous êtes disponible, merci de passer au HJRA.`);
                        setShowAlertModal(true);
                      }}
                    >
                      Alerter (Stock Bas)
                    </button>
                  )}
                  <div style={{marginTop: '5px', display: 'flex', gap: '5px'}}>
                      <button onClick={() => updateStockManual(s.bloodGroup, Math.max(0, s.quantity - 500))} style={{fontSize: '10px'}}>-500ml</button>
                      <button onClick={() => updateStockManual(s.bloodGroup, s.quantity + 500)} style={{fontSize: '10px'}}>+500ml</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => setShowAlertModal(true)} className="alert-emergency-btn">
            <Zap size={20} /> Alerte GÉNÉRALE (Groupe)
          </button>

          <div className="panel-card alerts-history">
            <h3 className="card-title">
              <Clock size={20} /> Alerte stockage (Historique)
            </h3>
            <div className="alerts-list">
              {alerts.length === 0 ? <p style={{fontSize: '12px', color: '#999'}}>Aucune alerte envoyée.</p> : 
               alerts.slice(0, 5).map(alert => (
                <div key={alert._id} className={`alert-item ${alert.urgencyLevel === 'critical' ? 'critical' : ''}`}>
                  <div className="alert-group-badge">{alert.bloodGroupNeeded}</div>
                  <div className="alert-info">
                    <span className="alert-time">{new Date(alert.createdAt).toLocaleTimeString()}</span>
                    <span className="alert-count">{alert.donorsNotified} contactés</span>
                  </div>
                  <div className={`alert-status ${alert.status}`}>
                    <CheckCircle size={16} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* SECTION DROITE : LISTE DONNEURS */}
        <main className="results-panel">
          <div className="panel-header">
            <h1 className="main-title">Donneurs disponibles</h1>
            <span className="results-count">{donors.length} profils trouvés</span>
          </div>

          {loading ? (
            <div className="loading-spinner">Mise à jour de la liste...</div>
          ) : (
            <div className="donors-list">
              {donors.map(donor => (
                <div key={donor._id} className="donor-list-item">
                  <div className={`blood-type-avatar ${donor.bloodGroup?.includes('-') ? 'type-neg' : ''}`}>
                    {donor.bloodGroup}
                  </div>
                  <div className="donor-core-info">
                    <h4>{donor.name}</h4>
                    <div className="info-meta"><MapPin size={14} /> {donor.location}</div>
                  </div>
                  <div className="donor-contact-info">
                    <div className="info-meta"><Phone size={14} /> {donor.phone}</div>
                    <div className="info-meta text-muted">Disponible</div>
                  </div>
                  <div className="donor-actions">
                    <button 
                      onClick={() => {
                        setSelectedDonor(donor);
                        setIndividualMessage(`Bonjour ${donor.name}, votre groupe ${donor.bloodGroup} est requis en urgence au HJRA. Êtes-vous disponible ?`);
                        setShowIndividualModal(true);
                      }}
                      className="sms-btn"
                    >
                      <BellDot size={16} /> Alerter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* MODAL ALERTE GÉNÉRALE */}
      {showAlertModal && (
        <div className="modal-overlay" onClick={() => setShowAlertModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>🚨 Alerte URGENCE</h2>
                <p>Envoyer à tous les donneurs {alertGroupSelected} compatibles</p>
              </div>
              <button onClick={() => setShowAlertModal(false)} className="modal-close-btn"><X size={24} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Groupe Sanguin Requis</label>
                <div className="blood-selector-grid">
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                    <button key={group} onClick={() => setAlertGroupSelected(group)} className={`blood-pill ${alertGroupSelected === group ? 'active' : ''}`}>{group}</button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea className="form-textarea" value={alertMessage} onChange={(e) => setAlertMessage(e.target.value)} rows={4} />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowAlertModal(false)} className="btn-secondary">Annuler</button>
              <button onClick={handleSendAlert} disabled={sendingAlert} className="btn-primary">
                {sendingAlert ? "Envoi..." : "Diffuser l'alerte"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ALERTE INDIVIDUELLE (SIMULATION SMS) */}
      {showIndividualModal && selectedDonor && (
        <div className="modal-overlay" onClick={() => setShowIndividualModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>📱 Alerte Individuelle (SMS)</h2>
                <p>Confirmer l'envoi d'un message de sécurité</p>
              </div>
              <button onClick={() => setShowIndividualModal(false)} className="modal-close-btn"><X size={24} /></button>
            </div>
            <div className="modal-body">
              <div className="individual-modal-info">
                <div className="info-row"><span>Donneur :</span> <span>{selectedDonor.name}</span></div>
                <div className="info-row"><span>Groupe :</span> <span className="blood-badge-inline">{selectedDonor.bloodGroup}</span></div>
                <div className="info-row"><span>Téléphone :</span> <span>{selectedDonor.phone}</span></div>
              </div>
              <div className="form-group">
                <label>Contenu du SMS</label>
                <textarea className="form-textarea" value={individualMessage} onChange={(e) => setIndividualMessage(e.target.value)} rows={3} />
              </div>
              <p style={{fontSize: '11px', color: '#666', fontStyle: 'italic'}}>
                * Par mesure de sécurité, vérifiez que le groupe sanguin ({selectedDonor.bloodGroup}) correspond au besoin avant d'envoyer.
              </p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowIndividualModal(false)} className="btn-secondary">Annuler</button>
              <button onClick={handleSendIndividualSms} disabled={sendingSms} className="btn-primary">
                {sendingSms ? "Envoi SMS..." : "Confirmer & Envoyer SMS"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;