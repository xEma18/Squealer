import React, { useState } from 'react';
import '../style.css';
import { Link, useNavigate} from 'react-router-dom';



const Login = ({}) => {
  const navigate = useNavigate();
  const [username, setUsername]=useState('');
  const [password, setPassword]=useState('');

  const handleLogin=async ()=>{
    const response=await fetch('/login',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username, password}),
    });
    const data=await response.json();
    console.log(data);
    if(data.status===200){
      navigate('/');
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
