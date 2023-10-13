import React, { useState } from 'react';
import './style.css';
import { Link, useNavigate} from 'react-router-dom';



const SignUp2 = ({ updateRegistrationData }) => {
  const navigate = useNavigate();
  const [email, setEmail]=useState('');
  const [password, setPassword]=('');

  const handleNext=async ()=>{
    updateRegistrationData({
      email,
      password,
    });
    navigate('/SignUp3');
  }
  

  return (
    <>
      <div className="step">
      <span className="x-step"><Link to="/">x</Link></span>
        Passo 2 di 4
      </div>
      <form id="signup-form">
        <div className="title t-small">Credenziali</div>
        <input type="email" id="email" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} value={email} />
        <input type="password" id="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} value={password} />
        <ul className="pw-requisites">
          <li>Minimo 8 caratteri</li>
          <li>Massimo 16 caratteri</li>
          <li>Deve contenere un numero</li>
          <li>Deve contenere un carattere speciale</li>
        </ul>
        <div className="btn btn-avanti" id="btn-signup-2" onClick={handleNext}>Avanti</div>
      </form>
    </>
  );
};

export default SignUp2;
