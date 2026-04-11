import React, { useState, useEffect, useMemo } from 'react';
import { Heart, User, MapPin, Phone, LogOut, Calendar, Droplet, Search, Clock, Loader, X, Trophy, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './DonorSpace.css';

// Système de badges de progression
const getBadgeInfo = (nombre_dons) => {
  if (nombre_dons >= 20) {
    return {
      emoji: '🏆',
      titre: 'Le Héros',
      message: 'Statut Légendaire : Le don de sang fait partie de ton identité.',
      classe: 'badge-hero',
    };
  } else if (nombre_dons >= 10) {
    return {
      emoji: '🔥',
      titre: 'Le Phénix',
      message: 'Prestige : Ton sang a potentiellement sauvé 30 vies !',
      classe: 'badge-phoenix',
    };
  } else if (nombre_dons >= 5) {
    return {
      emoji: '🏛️',
      titre: 'Le Pilier',
      message: 'La constance ! Tu es quelqu\'un sur qui le système de santé peut compter.',
      classe: 'badge-pillar',
    };
  } else if (nombre_dons >= 3) {
    return {
      emoji: '🛡️',
      titre: 'Le Gardien',
      message: 'Le plus dur est fait, le don est devenu une habitude chez toi.',
      classe: 'badge-guardian',
    };
  } else if (nombre_dons >= 1) {
    return {
      emoji: '🌱',
      titre: "L'Éveilleur",
      message: 'Félicitations, tu fais désormais partie de la communauté.',
      classe: 'badge-awakener',
    };
  } else {
    return {
      emoji: '🆕',
      titre: 'Newbie',
      message: 'Bienvenue ! Prêt pour ton premier acte héroïque ?',
      classe: 'badge-newbie',
    };
  }
};

const DonorSpace = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [searchTerm, setSearchTerm] = useState('');

  // États pour les données dynamiques
  const [donor, setDonor] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdatingAvailability, setIsUpdatingAvailability] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState(null);
  const [availabilityMessageType, setAvailabilityMessageType] = useState('success');
  const [showAllDonations, setShowAllDonations] = useState(false);
  const [showBadgeToast, setShowBadgeToast] = useState(false);
  const [estPublic, setEstPublic] = useState(false);
  const [isTogglingPrivacy, setIsTogglingPrivacy] = useState(false);
  const [privacyMessage, setPrivacyMessage] = useState(null);
  const [privacyMessageType, setPrivacyMessageType] = useState('success');

  // Récupération des données du donneur connecté
  const storedUserJson = localStorage.getItem('user');
  const storedUser = storedUserJson ? JSON.parse(storedUserJson) : null;
  const donorId = storedUser?._id || localStorage.getItem('userId') || '';

  // Récupération des données depuis l'API
  useEffect(() => {
    const fetchDonorData = async () => {
      if (!donorId) {
        setError('Utilisateur non connecté');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Récupération de l'historique des dons
        const donationsResponse = await api.get(`/donations/${donorId}`);
        const donationsData = donationsResponse.data || [];

        // Vérifier le statut public du profil depuis la table PublicProfile
        try {
          const privacyResponse = await api.get(`/classement/confidentialite/${donorId}`);
          setEstPublic(privacyResponse.data.est_public);
        } catch (err) {
          console.error('Erreur vérification confidentialité:', err);
          setEstPublic(false);
        }

        // CRITIQUE : Ne compter que les dons COMPLÉTÉS pour le total et le badge
        // Cela doit correspondre exactement à la logique du classement public
        const completedDonations = donationsData.filter(d => String(d.status).toLowerCase() === 'completed');
        const count = completedDonations.length;

        // Configuration des données du donneur
        setDonor({
          name: storedUser?.name || 'Donneur',
          bloodGroup: storedUser?.bloodGroup || 'Non défini',
          location: storedUser?.location || 'Antananarivo',
          isAvailable: storedUser?.isAvailable !== false, // true par défaut
          lastDonation: count > 0
            ? [...completedDonations].sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate))[0].donationDate
            : null,
          totalDonations: count
        });

        setDonations(donationsData);

      } catch (err) {
        console.error('Erreur lors de la récupération des données:', err);
        setError('Erreur lors du chargement des données');

        // Données de fallback en cas d'erreur
        setDonor({
          name: storedUser?.name || 'Donneur',
          bloodGroup: storedUser?.bloodGroup || 'Non défini',
          location: storedUser?.location || 'Antananarivo',
          isAvailable: true,
          lastDonation: null,
          totalDonations: 0
        });
        setEstPublic(false);
        setDonations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDonorData();
  }, [donorId]);

  // Effet pour détecter un upgrade de badge et afficher la notification une seule fois
  const badgeInfo = donor ? getBadgeInfo(donor.totalDonations) : null;

  useEffect(() => {
    if (!badgeInfo || !donor) return;

    const lastSeenBadge = localStorage.getItem('lastSeenBadge');

    // Afficher le toast seulement si le badge a changé (upgrade)
    if (lastSeenBadge !== badgeInfo.classe) {
      setShowBadgeToast(true);
      localStorage.setItem('lastSeenBadge', badgeInfo.classe);
    }
  }, [badgeInfo?.classe]);

  // Logique de cooldown de 56 jours après un don
  const COOLDOWN_DAYS = 56;
  const cooldownInfo = useMemo(() => {
    if (!donor?.lastDonation) return { isInCooldown: false, daysRemaining: 0, cooldownEndDate: null };

    const lastDonDate = new Date(donor.lastDonation);
    const cooldownEnd = new Date(lastDonDate);
    cooldownEnd.setDate(cooldownEnd.getDate() + COOLDOWN_DAYS);

    const now = new Date();
    const isInCooldown = now < cooldownEnd;
    const daysRemaining = isInCooldown ? Math.ceil((cooldownEnd - now) / (1000 * 60 * 60 * 24)) : 0;

    return { isInCooldown, daysRemaining, cooldownEndDate: cooldownEnd };
  }, [donor?.lastDonation]);

  // Auto-désactiver la disponibilité si en période de cooldown
  useEffect(() => {
    if (cooldownInfo.isInCooldown && donor?.isAvailable) {
      setDonor(prev => prev ? { ...prev, isAvailable: false } : prev);
      // Synchroniser avec le serveur
      if (donorId) {
        api.patch(`/donors/${donorId}/availability`, { isAvailable: false }).catch(() => {});
        const currentUserJson = localStorage.getItem('user');
        if (currentUserJson) {
          const currentUser = JSON.parse(currentUserJson);
          localStorage.setItem('user', JSON.stringify({ ...currentUser, isAvailable: false }));
        }
      }
    }
  }, [cooldownInfo.isInCooldown, donor?.isAvailable]);

  const donorBloodGroup = donor?.bloodGroup || storedUser?.bloodGroup || 'O+';

  const handleAvailabilityToggle = async () => {
    if (!donorId || !donor) return;

    // Bloquer la réactivation si en période de cooldown
    if (cooldownInfo.isInCooldown && !donor.isAvailable) {
      setAvailabilityMessage(
        `⏳ Vous ne pouvez pas vous rendre disponible avant ${cooldownInfo.daysRemaining} jour${cooldownInfo.daysRemaining > 1 ? 's' : ''}. Prochaine date d'éligibilité : ${cooldownInfo.cooldownEndDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}.`
      );
      setAvailabilityMessageType('error');
      return;
    }

    const nextAvailability = !donor.isAvailable;
    const currentUserJson = localStorage.getItem('user');
    const currentUser = currentUserJson ? JSON.parse(currentUserJson) : storedUser;

    setDonor(prev => prev ? { ...prev, isAvailable: nextAvailability } : prev);
    setAvailabilityMessage('Mise à jour en cours...');
    setAvailabilityMessageType('info');
    setIsUpdatingAvailability(true);

    try {
      const response = await api.patch(`/donors/${donorId}/availability`, { isAvailable: nextAvailability });
      const updatedDonor = response.data?.donor;
      const newAvailability = updatedDonor?.isAvailable ?? nextAvailability;

      setDonor(prev => prev ? { ...prev, isAvailable: newAvailability } : prev);

      const mergedUser = currentUser ? { ...currentUser, isAvailable: newAvailability } : { isAvailable: newAvailability };
      localStorage.setItem('user', JSON.stringify(mergedUser));

      setAvailabilityMessage(
        newAvailability
          ? 'Vous êtes maintenant disponible. Les centres s’affichent normalement.'
          : 'Vous êtes actuellement indisponible. Réactivez votre disponibilité pour voir les points de collecte.'
      );
      setAvailabilityMessageType('success');
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la disponibilité :', err);
      setDonor(prev => prev ? { ...prev, isAvailable: !nextAvailability } : prev);
      setAvailabilityMessage('Impossible de mettre à jour votre disponibilité. Réessayez.');
      setAvailabilityMessageType('error');
    } finally {
      setIsUpdatingAvailability(false);
    }
  };

  // Fonction de déconnexion avec confirmation
  const handleLogout = () => {
    const confirmLogout = window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?');
    if (confirmLogout) {
      // Supprimer les données utilisateur du localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userPhone');
      localStorage.removeItem('bloodGroup');

      // Rediriger vers la page d'accueil public
      navigate('/');
    }
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

  const filteredCenters = centers.filter(center =>
    center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    center.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="donor-space">
      {/* Onglets */}
      <div className="tabs-container">
        <div className="tabs-left">
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
          <button
            className={`tab-button ${activeTab === 'classement' ? 'active' : ''}`}
            onClick={() => navigate('/classement')}
          >
            <Trophy size={20} />
            Classement
          </button>
        </div>
        <div className="tabs-right">
          <button
            onClick={handleLogout}
            className="logout-btn"
            title="Se déconnecter"
          >
            <LogOut size={18} />
            <span className="logout-text">Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Contenu Mon Profil */}
      {activeTab === 'profile' && (
        <div className="profile-view">
          {loading ? (
            <div className="loading-state">
              <Loader size={48} className="loading-spinner" />
              <p>Chargement de vos données...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>❌ {error}</p>
              <button onClick={() => window.location.reload()} className="retry-btn">
                Réessayer
              </button>
            </div>
          ) : donor ? (
            <>
              {/* Bento Grid: Gauche - Header Card, Droite - Deux cartes */}
              <div className="bento-grid">
                {/* Header Card (Gauche - Grand) */}
                <div className="header-card">
                  <div className="header-top">
                    {/* Bouton de déconnexion déplacé dans les onglets */}
                  </div>

                  <div className="avatar">
                    <User size={70} />
                  </div>

                  <div className="header-info">
                    <div className="donor-name-row">
                      <h1 className="donor-name">{donor.name}</h1>
                      {badgeInfo && (
                        <span className={`badge-label ${badgeInfo.classe}`} title={badgeInfo.message}>
                          <span className="badge-emoji">{badgeInfo.emoji}</span>
                          <span className="badge-titre">{badgeInfo.titre}</span>
                        </span>
                      )}
                    </div>
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
                <div className={`status-card ${donor.isAvailable ? 'available' : 'unavailable'}`}>
                  <div className="card-header">
                    <Heart size={32} className="icon-heart" />
                  </div>
                  <p className="card-label">Disponibilité</p>
                  <h2 className="card-value">
                    {cooldownInfo.isInCooldown
                      ? '⏳ En repos'
                      : donor.isAvailable ? '✓ Disponible' : 'Indisponible'
                    }
                  </h2>

                  {cooldownInfo.isInCooldown && (
                    <div className="cooldown-info">
                      <p className="cooldown-days">{cooldownInfo.daysRemaining} jour{cooldownInfo.daysRemaining > 1 ? 's' : ''} restant{cooldownInfo.daysRemaining > 1 ? 's' : ''}</p>
                      <p className="cooldown-date">Éligible le {cooldownInfo.cooldownEndDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  )}

                  <label className={`availability-switch ${cooldownInfo.isInCooldown ? 'switch-locked' : ''}`}>
                    <input
                      type="checkbox"
                      checked={donor.isAvailable}
                      onChange={handleAvailabilityToggle}
                      disabled={isUpdatingAvailability || cooldownInfo.isInCooldown}
                    />
                    <span className="switch-slider" />
                    <span className="availability-label">
                      {cooldownInfo.isInCooldown
                        ? 'Verrouillé'
                        : donor.isAvailable ? 'Actif' : 'Indisponible'
                      }
                    </span>
                  </label>

                  {availabilityMessage && (
                    <p className={`availability-feedback ${availabilityMessageType}`}>
                      {availabilityMessage}
                    </p>
                  )}
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
                    {donor.lastDonation
                      ? new Date(donor.lastDonation).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })
                      : 'Aucun don enregistré'
                    }
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
                {donations.length === 0 ? (
                  <div className="empty-state">
                    <Heart size={64} className="empty-icon" />
                    <h3>Vous n'avez pas encore fait de don</h3>
                    <p>Chaque don compte ! Votre première contribution peut sauver des vies.</p>
                  </div>
                ) : (
                  <div className="donations-list">
                    {(showAllDonations ? donations : donations.slice(0, 3)).map(donation => (
                      <div key={donation._id} className="donation-card">
                        <div className="donation-left">
                          <h3 className="donation-hospital">
                            {donation.hospitalId?.hospitalName || donation.hospitalId?.name || 'Hôpital'}
                          </h3>
                          <div className="donation-meta">
                            <span>
                              <Calendar size={14} />
                              {new Date(donation.donationDate).toLocaleDateString('fr-FR')}
                            </span>
                            <span>
                              <Droplet size={14} />
                              {donation.volume || donation.amount || 0} ml
                            </span>
                          </div>
                        </div>
                        <div className={`donation-status ${donation.status === 'completed' ? 'status-completed' : donation.status === 'pending' ? 'status-pending' : ''}`}>
                          {donation.status === 'completed' || donation.status === 'pending'
                            ? (donation.status === 'completed' ? 'Complété' : 'En attente')
                            : donation.status
                          }
                        </div>
                      </div>
                    ))}
                    {donations.length > 3 && !showAllDonations && (
                      <button
                        onClick={() => setShowAllDonations(true)}
                        className="see-more-btn"
                      >
                        Voir plus ({donations.length - 3} autres)
                      </button>
                    )}
                    {showAllDonations && donations.length > 3 && (
                      <button
                        onClick={() => setShowAllDonations(false)}
                        className="see-less-btn"
                      >
                        Voir moins
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Section Confidentialité & Classement */}
              <div className="privacy-section">
                <div className="privacy-card">
                  <div className="privacy-header">
                    <Trophy size={22} className="privacy-icon" />
                    <h3 className="privacy-title">Classement des Héros</h3>
                  </div>
                  <p className="privacy-description">
                    Rendez votre profil visible dans le classement public pour inspirer d'autres donneurs.
                  </p>
                  <div className="privacy-toggle-row">
                    <label className="privacy-switch">
                      <input
                        type="checkbox"
                        checked={estPublic}
                        onChange={async () => {
                          if (isTogglingPrivacy) return;
                          
                          setPrivacyMessage('Mise à jour...');
                          setPrivacyMessageType('info');
                          setIsTogglingPrivacy(true);
                          
                          try {
                            console.log('Tentative toggle confidentialité pour:', donorId);
                            const response = await api.patch('/classement/confidentialite', { donorId });
                            const nouvelEtat = response.data.est_public;
                            setEstPublic(nouvelEtat);
                            setPrivacyMessage(response.data.message);
                            setPrivacyMessageType('success');
                          } catch (err) {
                            console.error('Erreur toggle confidentialité:', err);
                            const errorMsg = err.response?.data?.message || 'Erreur de communication avec le serveur.';
                            setPrivacyMessage(errorMsg);
                            setPrivacyMessageType('error');
                          } finally {
                            setIsTogglingPrivacy(false);
                            // Cacher le message après 3 secondes
                            setTimeout(() => setPrivacyMessage(null), 3000);
                          }
                        }}
                        disabled={isTogglingPrivacy}
                      />
                      <span className="switch-slider" />
                      <span className="privacy-label-text">
                        {estPublic ? (
                          <><Eye size={14} /> Profil public</>
                        ) : (
                          <><EyeOff size={14} /> Profil privé</>
                        )}
                      </span>
                    </label>
                  </div>
                  
                  {privacyMessage && (
                    <p className={`privacy-feedback ${privacyMessageType}`}>
                      {privacyMessage}
                    </p>
                  )}

                  <button
                    className="classement-link-btn"
                    onClick={() => navigate('/classement')}
                  >
                    <Trophy size={16} />
                    Voir le classement
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="error-state">
              <p>Données du donneur non disponibles</p>
            </div>
          )}
        </div>
      )}

      {/* Contenu Points de Collecte */}
      {activeTab === 'centers' && (
        <div className="centers-view">
          {!donor ? (
            <div className="loading-state">
              <Loader size={48} className="loading-spinner" />
              <p>Chargement des centres...</p>
            </div>
          ) : donor.isAvailable === false ? (
            <div className="unavailable-state">
              <Heart size={48} className="unavailable-icon" />
              <h3>Vous êtes actuellement indisponible.</h3>
              <p>Réactivez votre disponibilité pour voir les points de collecte proches de vous.</p>
            </div>
          ) : (
            <>
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
                    const offersBloodType = center.acceptedBloodTypes.includes(donorBloodGroup);
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
            </>
          )}
        </div>
      )}

      {/* Toast notification de badge */}
      {showBadgeToast && badgeInfo && (
        <div className="badge-toast-overlay">
          <div className={`badge-toast ${badgeInfo.classe}`}>
            <div className="badge-toast-icon">{badgeInfo.emoji}</div>
            <div className="badge-toast-content">
              <h3 className="badge-toast-title">{badgeInfo.titre}</h3>
              <p className="badge-toast-message">{badgeInfo.message}</p>
            </div>
            <button
              className="badge-toast-close"
              onClick={() => setShowBadgeToast(false)}
            >
              <X size={18} />
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorSpace;