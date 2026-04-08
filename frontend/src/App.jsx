import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [message, setMessage] = useState("Connexion au serveur...")

  useEffect(() => {
    // On teste la communication avec le backend
    axios.get('http://localhost:5000/api/items')
      .then(res => {
        setMessage("✅ Connexion au Backend réussie !")
        console.log("Données reçues :", res.data)
      })
      .catch(err => {
        setMessage("❌ Erreur : Le Backend ne répond pas.")
        console.error(err)
      })
  }, [])

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
      <h1> Joyeuse apres paques les amis et bon dodo</h1>
      <p style={{ fontSize: '1.2rem', color: message.includes('✅') ? 'green' : 'red' }}>
        Status : {message}
      </p>
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', display: 'inline-block' }}>
        <h3>Membres de l'équipe :</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li> Tojo </li>
          <li> Max </li>
          <li> Lili </li>
          <li> Hans </li>
          <li> Rose</li>
        </ul>
      </div>
    </div>
  )
}

export default App