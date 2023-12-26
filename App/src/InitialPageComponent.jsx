import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import condorIcon from './assets/icon_condor.png'
import './style.css';

const InitialPageComponent = () => {
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
                <Link to="/HostFeed" className="btn" id="btn-pro-zone">Accedi come ospite</Link>
              </div>
            </div>
    );
  };
  
  export default InitialPageComponent;