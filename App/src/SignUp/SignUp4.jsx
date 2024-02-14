import React, { useState } from 'react';
import '../style.css';
import { Link, useNavigate} from 'react-router-dom';
import axios from 'axios';



const SignUp4 = ({ updateRegistrationData, registrationData }) => {
    const navigate = useNavigate();
    const [description, setDescription]=useState('');
    const [warning, setWarning]=useState('');

    const handleChange = (e) => {
      const newText = e.target.value;
      if (newText.length > 150) {
      setWarning("Numero massimo di caratteri raggiunto.")
      } else {
      setDescription(newText);
      setWarning('');
      }
      };

    const handleTermina=async ()=>{
    const localRegistrationData = {
        ...registrationData, // Mantieni i dati esistenti
        description, // Aggiungi la nuova descrizione
        };

        //aggiorno RegistrationData
    await updateRegistrationData({
      description,
    });

    const response = await axios.post('/signup', localRegistrationData); //NB:non passo registrationData perché avendola passata come props, non è aggiornata con la descrizione
    
    //tolgo l'immagine da localRegistrationData per non salvarla in sessionStorage (è troppo pesante)
    delete localRegistrationData.image;
    console.log(localRegistrationData);

    // Salva i dati di registrazione in sessionStorage prima di navigare
    sessionStorage.setItem('accountData', JSON.stringify(localRegistrationData));

    navigate('/App/feed');
  }
  

  return (
    <>
    <div className="step">
    <span className="x-step"><Link to="/App/">x</Link></span>
        Passo 4 di 4
    </div>
    <form id="signup-form">
      <div className="title t-small">Descrivi te stesso</div>
      <div className="subtitle s-small">Cosa ti rende speciale?</div>
      <div className="t-area-container">
        <span className="word-counter">{description.length}/150</span>
        <textarea id="description-box" cols="30" rows="10" onChange={(e)=>handleChange(e)} value={description}></textarea>
        <div className="subtitle s-small">{warning}</div> 
      </div>
      <div className="btn btn-avanti" id="btn-signup-4" onClick={handleTermina}>Termina</div>
    </form>
    </>
  );
};

export default SignUp4;
