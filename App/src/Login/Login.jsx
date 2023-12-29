import React, { useState } from 'react';
import '../style.css';
import { Link, useNavigate} from 'react-router-dom';
import axios from 'axios';



const Login = ({}) => {
  const navigate = useNavigate();
  const [username, setUsername]=useState('');
  const [password, setPassword]=useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorDot, setShowErrorDot]=useState(false);
  const [showWrongCredentials, setShowWrongCredentials]=useState(false);

  const handleLogin=async ()=>{
    const response=await axios.post('http://localhost:3001/login', {username, password}) 
    if(response.status===200){//response.status indica che la richiesta è andata a buon fine (a prescindere dal contenuto della risposta)
      if(response.data){//qui controllo che la risposta contenga effettivamente un utente (se non c'è, vuol dire che le credenziali sono sbagliate)
        sessionStorage.setItem('accountData', JSON.stringify(response.data));
        navigate('/Feed');
      }
      else{
        setShowWrongCredentials(true);
      }
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }
  

  const handleChangeUsername=async (e)=>{
    setShowWrongCredentials(false);
    setUsername(e.target.value);
    if (!e.target.value.startsWith('@')) { //qui non ci posso mettere "username.startsWith('@') perché lo state non vine aggiornato subito, quindi non è aggiornato quando viene eseguito questo if"
      setShowErrorDot(true);
      setUsername('');
    }
    else{
      setShowErrorDot(false);
    }
}

const handleChangePassword=async(e)=>{
  setPassword(e.target.value);
  setShowWrongCredentials(false);
}


  return (
    <>
      <div className="step">
      <span className="x-step"><Link to="/">x</Link></span>
        Passo 1 di 1
      </div>
      <form id="signup-form">
        <div className="title t-small">Inserisci le credenziali</div>
        <input type="text" id="username" placeholder="Username (es: @MarioRossi)" onChange={(e)=>handleChangeUsername(e)} value={username} />
        {showErrorDot && <span style={{fontWeight:"bold", fontSize:"115%", color:"red"}}>L'Username deve iniziare con "@".</span>}
        <div className="input-wrapper">
          <input type={showPassword ? "text" : "password"} id="password" placeholder="Password" onChange={(e)=>{handleChangePassword(e)}} value={password} className="password-input" />
          <img 
          src={showPassword ? "https://www.pngitem.com/pimgs/m/495-4950508_show-password-show-password-icon-png-transparent-png.png" : "https://www.pngitem.com/pimgs/m/600-6000108_modify-the-password-small-eyes-eye-password-png.png"} 
          onClick={togglePasswordVisibility} 
          className="toggle-password"
          alt="Mostra/Nascondi Password"
          
        />
        </div>
        {showWrongCredentials && 
        <div style={{marginTop:"5%"}}>
          <span style={{fontWeight:"bold", fontSize:"125%", color:"red"}}> Username o password sono errati.</span>
        </div>
        }
        <div className="btn btn-avanti" id="btn-signup-2" onClick={handleLogin}>Accedi</div>
      </form>
    </>
  );
};

export default Login;
