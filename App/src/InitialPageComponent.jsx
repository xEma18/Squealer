import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import condorIcon from './assets/icon_condor.png'
import './style.css';
import axios from 'axios';

const InitialPageComponent = () => {
  const navigate = useNavigate();

  const handleGuestAccess = async () => {
    try {
      // Esegui una richiesta al server per ottenere il numero unico del guest
      const response = await axios.get('http://localhost:3001/generateGuestNumber');
      const guestNumber = response.data.guestNumber; // Assumi che la risposta abbia una struttura del genere
  
      // Componi lo username del guest
      const guestUsername = `@guest_${guestNumber}`;
  
      // Salva nel sessionStorage
      sessionStorage.setItem('accountData', JSON.stringify({ username: guestUsername }));
  
      // Naviga al componente Feed
      navigate('/Feed');
    } catch (error) {
      console.error("Errore nell'accesso come guest:", error);
    }
  };
  
    return (
            <div className="container">
              <img
                id="condor-icon"
                src={condorIcon}
                alt="Condor Icon"
              />
              <div className="title">Storming news</div>
              <div className="subtitle">Join us today.</div>
              <div className="btns-container">
                
                <Link to="/SignUpPage1" className="btn" id="btn-registrati">
                  Registrati
                </Link>
                <Link to ="/Login" className="btn" id="btn-accedi">Accedi</Link>
              </div>
              <div className="divider">
                <div className="divider-line"></div>
                <div className="divider-text">oppure</div>
                <div className="divider-line"></div>
              </div>
              <div className="btm-title">Senza account?</div>
              <div className="btns-container">
              <div onClick={handleGuestAccess} className="btn" id="btn-pro-zone">
                    Accedi come ospite
                </div>
              </div>
            </div>
    );
  };
  
  export default InitialPageComponent;