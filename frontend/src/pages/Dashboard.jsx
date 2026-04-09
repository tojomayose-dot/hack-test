import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; //

const Dashboard = () => {
  const navigate = useNavigate();
  const [donors, setDonors] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [searchQuartier, setSearchQuartier] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (group = '') => {
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

  useEffect(() => {
    handleSearch();
  }, []);

  const toggleGroup = (group) => {
    const newGroup = selectedGroup === group ? '' : group;
    setSelectedGroup(newGroup);
    handleSearch(newGroup);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar simplified pour le test */}
      <div className="w-64 bg-white border-r p-6 hidden md:block">
        <h2 className="font-bold text-xl mb-8">Rakitra Ra</h2>
        <button onClick={() => navigate('/admin')} className="text-red-500">Déconnexion</button>
      </div>

      <div className="flex-1 p-10">
        <h1 className="text-2xl font-bold mb-8 italic">HJRA Ampefiloha</h1>

        <section className="bg-white p-6 rounded-2xl shadow-sm mb-8 border border-slate-100">
          <div className="flex flex-wrap gap-2 mb-6">
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
              <button
                key={group}
                onClick={() => toggleGroup(group)}
                className={`w-12 h-12 rounded-lg font-bold border transition-all ${
                  selectedGroup === group ? 'bg-red-600 text-white' : 'bg-white border-slate-200'
                }`}
              >
                {group}
              </button>
            ))}
          </div>

          <input 
            type="text" 
            placeholder="📍 Filtrer par quartier..." 
            className="w-full p-4 rounded-xl bg-slate-100 outline-none focus:ring-2 focus:ring-red-400"
            onChange={(e) => setSearchQuartier(e.target.value)}
          />
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {donors
            .filter(d => d.location?.toLowerCase().includes(searchQuartier.toLowerCase()))
            .map(donor => (
              <div key={donor._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold mb-2">
                  {donor.bloodGroup}
                </div>
                <h4 className="font-bold">{donor.hospitalName || donor.name}</h4>
                <p className="text-sm text-slate-500">{donor.location}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;