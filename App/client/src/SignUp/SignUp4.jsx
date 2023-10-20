import React, { useState } from 'react';
import '../style.css';
import { Link, useNavigate} from 'react-router-dom';
import axios from 'axios';



const SignUp4 = ({ updateRegistrationData, registrationData }) => {
    const navigate = useNavigate();
    const [description, setDescription]=useState('');



    const handleTermina=async ()=>{
    const localRegistrationData = {
        ...registrationData, // Mantieni i dati esistenti
        description, // Aggiungi la nuova descrizione
        };

        //aggiorno RegistrationData
    await updateRegistrationData({
      description,
    });

    const response = await axios.post('http://localhost:3001/signup', localRegistrationData); //NB:non passo registrationData perché avendola passata come props, non è aggiornata con la descrizione
    
    navigate('/');
  }
  

  return (
    <>
    <div className="step">
    <span className="x-step"><Link to="/">x</Link></span>
        Passo 4 di 4
    </div>
    <form id="signup-form">
      <div className="title t-small">Descrivi te stesso</div>
      <div className="subtitle s-small">Cosa ti rende speciale?</div>
      <div className="t-area-container">
        <span className="word-counter">0/150</span>
        <textarea id="description-box" cols="30" rows="10" onChange={(e)=>setDescription(e.target.value)} value={description}></textarea>
      </div>
      <div className="btn btn-avanti" id="btn-signup-4" onClick={handleTermina}>Termina</div>
    </form>
    </>
  );
};

export default SignUp4;
