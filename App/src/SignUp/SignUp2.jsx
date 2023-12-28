import React, { useState } from 'react';
import '../style.css';
import { Link, useNavigate} from 'react-router-dom';



const SignUp2 = ({ updateRegistrationData }) => {
  const navigate = useNavigate();
  const [email, setEmail]=useState('');
  const [password, setPassword]=useState('');
  const [username, setUsername]=useState('');
  const [showErrorDot, setShowErrorDot]=useState(false);
  const [isPasswordShort, setIsPasswordShort]=useState(true);
  const [isPasswordLong, setIsPasswordLong]=useState();
  const [isPasswordWithNumber, setIsPasswordWithNumber]=useState(false);
  const [isPasswordWithSpecialChar, setIsPasswordWithSpecialChar]=useState(false);
  const [showErrorPassword, setShowErrorPassword]=useState(false);

  const handleNext=async ()=>{
    if(isPasswordShort===false && isPasswordLong===false && isPasswordWithNumber===true && isPasswordWithSpecialChar===true && username.startsWith('@')){
      updateRegistrationData({
        email,
        password,
        username,
      });
      navigate('/SignUp3');
    }
    else{
      setShowErrorPassword(true);
    }
  }

  const handleChangeUsername=async (e)=>{
    setUsername(e.target.value);
    if (!e.target.value.startsWith('@')) { //qui non ci posso mettere "username.startsWith('@') perché lo state non vine aggiornato subito, quindi non è aggiornato quando viene eseguito questo if"
      setShowErrorDot(true);
      setUsername('');
    }
    else{
      setShowErrorDot(false);
    }
}

  const handleChangePassword=async (e)=>{
    setPassword(e.target.value);
    if (e.target.value.length<8){
      setIsPasswordShort(true);
    }
    else{
      setIsPasswordShort(false);
    }

    if (e.target.value.length>16){
      setIsPasswordLong(true);
  }
  else{
    setIsPasswordLong(false);
  }

  if (e.target.value.match(/[0-9]/g)){
    setIsPasswordWithNumber(true);
  }
  else{
    setIsPasswordWithNumber(false);
  }
  if (e.target.value.match(/[!@#$%^&*(),.?":{}|<>]/g)){
    setIsPasswordWithSpecialChar(true);
  }
  else{
    setIsPasswordWithSpecialChar(false);
  }
}


  

  return (
    <>
      <div className="step">
      <span className="x-step"><Link to="/">x</Link></span>
        Passo 2 di 4
      </div>
      <form id="signup-form">
        <div className="title t-small">Credenziali</div>
        <input type="text" id="username" placeholder="Username (es: @MarioRossi)" onChange={(e)=>handleChangeUsername(e)} value={username} />
        {showErrorDot && <span style={{fontWeight:"bold", fontSize:"115%"}}>L'Username deve iniziare con "@".</span>}
        <input type="email" id="email" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} value={email} />
        <input type="password" id="password" placeholder="Password" onChange={(e)=>handleChangePassword(e)} value={password} />
        <ul className="pw-requisites">
          <li style={{ color: isPasswordShort ? 'red':'green'}}>Minimo 8 caratteri</li>
          <li style={{ color: isPasswordLong ? 'red':'green'}}>Massimo 16 caratteri</li>
          <li style={{ color: isPasswordWithNumber ? 'green':'red'}}>Deve contenere un numero</li>
          <li style={{ color: isPasswordWithSpecialChar ? 'green':'red'}}>Deve contenere un carattere speciale</li>
        </ul>
        {showErrorPassword && 
        <div style={{marginTop:"5%"}}>
          <span style={{fontWeight:"bold", fontSize:"150%"}}>La tua password non rispetta i requisiti.</span>
        </div>
        }
        <div className="btn btn-avanti" id="btn-signup-2" onClick={handleNext}>Avanti</div>
      </form>
    </>
  );
};

export default SignUp2;
