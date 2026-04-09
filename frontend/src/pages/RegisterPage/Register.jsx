import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [backendStatus, setBackendStatus] = useState("Vérification...");
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    role: 'donor',
    location: '',
    bloodGroup: '',
    isAvailable: true
  });

  useEffect(() => {
    api.get('/stats')
      .then(() => setBackendStatus("Connecté ✅"))
      .catch(() => setBackendStatus("Déconnecté ❌"));
  }, []);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      alert("Inscription réussie !");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || "Erreur serveur");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 flex flex-col items-center justify-center">
      <div className="max-w-md w-full mb-4 flex justify-between items-center bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Serveur</span>
        <span className={`text-xs font-bold ${backendStatus.includes('✅') ? 'text-green-500' : 'text-red-500'}`}>
          {backendStatus}
        </span>
      </div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 italic">Rakitra Ra</h1>
          <p className="text-slate-500 text-sm">Sauvez des vies en un clic</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Téléphone</label>
            <input
              type="text"
              placeholder="034 00 000 00"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Quartier</label>
            <input
              type="text"
              placeholder="Ex: Ankatso"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Groupe Sanguin</label>
            <div className="grid grid-cols-4 gap-2">
              {bloodGroups.map((group) => (
                <button
                  key={group}
                  type="button"
                  onClick={() => setFormData({...formData, bloodGroup: group})}
                  className={`py-2 rounded-lg border-2 font-bold transition ${
                    formData.bloodGroup === group 
                    ? 'border-blue-600 bg-blue-50 text-blue-600' 
                    : 'border-slate-100 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          <div className="text-center mt-6">
            <button 
              onClick={() => navigate('/admin')} 
              className="text-xs text-slate-400 hover:text-blue-500 underline transition"
            >
              Accès Administration Hôpital
            </button>
          </div>

          <button
            type="submit"
            disabled={backendStatus.includes('❌')}
            className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all mt-4 ${
                backendStatus.includes('❌') 
                ? 'bg-slate-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            S'inscrire comme donneur
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;