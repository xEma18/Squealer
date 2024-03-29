import React, { useState } from 'react';
import '../style.css';
import { Link, useNavigate } from 'react-router-dom';

const SignUp1 = ({ updateRegistrationData }) => {
  const navigate = useNavigate();//uso "useNavigate" per navigare alla pagina del signUp2 quando schiaccio il pulsante avanti

  // Stati per memorizzare i valori dei campi del form
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [day, setDay]=useState('');
  const [month, setMonth]=useState('');
  const [year, setYear]=useState('');
  const [tipoUtente, setTipoUtente]=useState('');

  const handleNext=async ()=>{
    //aggiorno i dati nello stato registrationData
    updateRegistrationData({
      name,
      lastname,
      day,
      month,
      year,
      tipoUtente,
    });

    //navigo alla componente SignUp2
    navigate('/App/SignUp2');
  }
  

  return (
    <><div className="step">
      <span className="x-step"><Link to="/App/">x</Link></span>Passo 1 di 4
    </div><form id="signup-form">
        <div className="title">Crea il tuo account</div>
        <input type="text" id="name" placeholder="Nome" onChange={(e)=>setName(e.target.value)} value={name} />
        <input type="text" id="cognome" placeholder="Cognome" onChange={(e)=>setLastname(e.target.value)} value={lastname} />
        <div className="form-text">Data di nascita</div>
        <div className="birth-container">
          <input type="text" id="b-day" placeholder="gg" onChange={(e)=>setDay(e.target.value)} value={day} />
          <input type="text" id="b-month" placeholder="mm" onChange={(e)=>setMonth(e.target.value)} value={month} />
          <input type="text" id="b-year" placeholder="aaaa" onChange={(e)=>setYear(e.target.value)} value={year} />
        </div>
        <div className="pro-box">
          <label htmlFor="accountType" className="form-text">Tipologia account</label>
          <select id="accountType" onChange={(e) => setTipoUtente(e.target.value)} value={tipoUtente}>
            <option value="" disabled>Seleziona un'opzione</option>
            <option value="Standard">Standard</option>
            <option value="VIP">VIP</option>
            <option value="SMM">SMM</option>
          </select>
        </div>
        <div className="pro-note">
          <span>Nota:</span> prima di poter usufruire delle funzionalità VIP o SMM, un
          moderatore dovrà valutare la tua richiesta.
        </div>
        <div className="btn btn-avanti" id="btn-signup-1" onClick={handleNext}>Avanti</div>
      </form></>
  );
};

export default SignUp1;