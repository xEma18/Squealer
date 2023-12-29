import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import condorIcon from './assets/icon_condor.png'
import './style.css';

const InitialPageComponent = () => {
  const navigate = useNavigate();

  const handleGuestAccess = () => {
    // Naviga al componente Feed passando lo stato di guest
    sessionStorage.setItem('accountData', JSON.stringify({ username: "@guest" }));
    navigate('/Feed');
    //navigate('/Feed', { state: { guestUsername: "@guest" } });
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