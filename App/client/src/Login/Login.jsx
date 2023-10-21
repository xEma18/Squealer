import React, { useState } from 'react';
import '../style.css';
import { Link, useNavigate} from 'react-router-dom';
import axios from 'axios';



const Login = ({}) => {
  const navigate = useNavigate();
  const [username, setUsername]=useState('');
  const [password, setPassword]=useState('');

  const handleLogin=async ()=>{
    const response=await axios.post('http://localhost:3001/login', {username, password}) 
    if(response.status===200){//response.status indica che la richiesta è andata a buon fine (a prescindere dal contenuto della risposta)
      if(response.data){//qui controllo che la risposta contenga effettivamente un utente (se non c'è, vuol dire che le credenziali sono sbagliate)
        navigate('/');
      }
      else{
        alert('Credenziali errate');
      }
    }
  }
  

  return (
    <>
      <div className="step">
      <span className="x-step"><Link to="/">x</Link></span>
        Passo 1 di 1
      </div>
      <form id="signup-form">
        <div className="title t-small">Inserisci le credenziali</div>
        <input type="text" id="username" placeholder="Username" onChange={(e)=>setUsername(e.target.value)} value={username} />
        <input type="password" id="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} value={password} />
        <div className="btn btn-avanti" id="btn-signup-2" onClick={handleLogin}>Accedi</div>
      </form>
    </>
  );
};

export default Login;
