import React, { useState, useEffect } from 'react';
import { Trophy, ArrowLeft, Loader, Crown, Medal, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Classement.css';

const Classement = () => {
  const navigate = useNavigate();
  const [classement, setClassement] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    const chargerClassement = async () => {
      try {
        setLoading(true);
        const response = await api.get('/classement');
        setClassement(response.data);
      } catch (err) {
        console.error('Erreur chargement classement:', err);
        setErreur('Impossible de charger le classement.');
      } finally {
        setLoading(false);
      }
    };

    chargerClassement();
  }, []);

  // Icône spéciale pour le top 3
  const getRangIcon = (rang) => {
    if (rang === 1) return <Crown size={22} className="rang-icon rang-or" />;
    if (rang === 2) return <Medal size={22} className="rang-icon rang-argent" />;
    if (rang === 3) return <Shield size={22} className="rang-icon rang-bronze" />;
    return <span className="rang-numero">{rang}</span>;
  };

  return (
    <div className="classement-page">
      {/* Header */}
      <div className="classement-header">
        <button className="back-btn" onClick={() => navigate('/donor-space')}>
          <ArrowLeft size={20} />
          Retour
        </button>
        <div className="header-title">
          <Trophy size={28} className="trophy-icon" />
          <h1>Classement des Héros</h1>
        </div>
        <p className="header-subtitle">
          Les donneurs qui ont choisi de partager leur engagement
        </p>
      </div>

      {/* Contenu */}
      <div className="classement-content">
        {loading ? (
          <div className="classement-loading">
            <Loader size={48} className="loading-spinner" />
            <p>Chargement du classement...</p>
          </div>
        ) : erreur ? (
          <div className="classement-erreur">
            <p>❌ {erreur}</p>
            <button onClick={() => window.location.reload()} className="retry-btn">
              Réessayer
            </button>
          </div>
        ) : classement.length === 0 ? (
          <div className="classement-vide">
            <Trophy size={64} className="empty-trophy" />
            <h3>Aucun héros pour le moment</h3>
            <p>Soyez le premier à rendre votre profil public et à apparaître dans le classement !</p>
          </div>
        ) : (
          <>
            {/* Podium top 3 */}
            {classement.length >= 3 && (
              <div className="podium">
                {/* 2e place */}
                <div className="podium-item podium-2">
                  <div className="podium-avatar">
                    <span className="podium-emoji">{classement[1].emoji}</span>
                  </div>
                  <p className="podium-nom">{classement[1].nom}</p>
                  <p className="podium-titre">{classement[1].titre}</p>
                  <p className="podium-dons">{classement[1].nombre_dons} dons</p>
                  <div className="podium-bar podium-bar-2">2</div>
                </div>
                {/* 1re place */}
                <div className="podium-item podium-1">
                  <div className="podium-crown">👑</div>
                  <div className="podium-avatar podium-avatar-1">
                    <span className="podium-emoji">{classement[0].emoji}</span>
                  </div>
                  <p className="podium-nom">{classement[0].nom}</p>
                  <p className="podium-titre">{classement[0].titre}</p>
                  <p className="podium-dons">{classement[0].nombre_dons} dons</p>
                  <div className="podium-bar podium-bar-1">1</div>
                </div>
                {/* 3e place */}
                <div className="podium-item podium-3">
                  <div className="podium-avatar">
                    <span className="podium-emoji">{classement[2].emoji}</span>
                  </div>
                  <p className="podium-nom">{classement[2].nom}</p>
                  <p className="podium-titre">{classement[2].titre}</p>
                  <p className="podium-dons">{classement[2].nombre_dons} dons</p>
                  <div className="podium-bar podium-bar-3">3</div>
                </div>
              </div>
            )}

            {/* Liste complète */}
            <div className="classement-liste">
              <div className="liste-header">
                <span className="col-rang">Rang</span>
                <span className="col-nom">Donneur</span>
                <span className="col-titre">Titre</span>
                <span className="col-dons">Dons</span>
              </div>

              {classement.map((hero) => (
                <div
                  key={hero._id}
                  className={`liste-row ${hero.rang <= 3 ? `top-${hero.rang}` : ''}`}
                >
                  <span className="col-rang">{getRangIcon(hero.rang)}</span>
                  <span className="col-nom">
                    <span className="hero-name">{hero.nom}</span>
                    <span className="hero-blood">{hero.groupe_sanguin}</span>
                  </span>
                  <span className="col-titre">
                    <span className="titre-emoji">{hero.emoji}</span>
                    {hero.titre}
                  </span>
                  <span className="col-dons">
                    <span className="dons-value">{hero.nombre_dons}</span>
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Classement;
