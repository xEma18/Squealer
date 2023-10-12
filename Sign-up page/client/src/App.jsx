import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import condorIcon from './assets/icon_condor.png'

const initialPage = () => {
    return (
            <div class="container">
              <img
                id="condor-icon"
                src={condorIcon}
                alt="Condor Icon"
              />
              <div class="title">Storming news</div>
              <div class="subtitle">Join us today.</div>
              <div class="btns-container">
                <div class="btn" id="btn-registrati">Registrati</div>
                <div class="btn" id="btn-accedi">Accedi</div>
              </div>
              <div class="divider">
                <div class="divider-line"></div>
                <div class="divider-text">oppure</div>
                <div class="divider-line"></div>
              </div>
              <div class="btm-title">Sei un PRO?</div>
              <div class="btns-container">
                <div class="btn" id="btn-pro-zone">Area PRO</div>
              </div>
            </div>
    );
  };
  
  export default initialPage;