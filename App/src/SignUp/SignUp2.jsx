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
  const [showErrorEmail, setShowErrorEmail]=useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorUserAndEmailAlreadyRegistered, setShowErrorUserAndEmailAlreadyRegistered]=useState(false);
  const [showErrorUnderscore, setShowErrorUnderscore]=useState(false);


  const handleNext=async ()=>{
    if(isPasswordShort===false && isPasswordLong===false && isPasswordWithNumber===true && isPasswordWithSpecialChar===true && username.startsWith('@')&& isEmailValid(email)){
      try {
        const response = await fetch("http://localhost:3001/checkIfUserAndEmailAlreadyRegistered", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, username })
        });

        const data = await response.json();
        
        if (data.exists) {
            setShowErrorUserAndEmailAlreadyRegistered(true);
        } else {
            updateRegistrationData({ email, password, username });
            navigate('/App/SignUp3');
          }
    } catch (error) {
        console.error('Errore:', error);
      }
    }
    else{
      if(!isEmailValid(email)){
        setShowErrorEmail(true);
        setShowErrorPassword(false);
      }
      else{
        setShowErrorEmail(false);
        setShowErrorPassword(true);
      }
    }
  }



  const handleChangeUsername=async (e)=>{
    setUsername(e.target.value);
    setShowErrorUserAndEmailAlreadyRegistered(false);
    
    if (!e.target.value.startsWith('@')) { //qui non ci posso mettere "username.startsWith('@') perché lo state non vine aggiornato subito, quindi non è aggiornato quando viene eseguito questo if"
      setShowErrorDot(true);
      setUsername('');
    }
    else{
      setShowErrorDot(false);
    }

    //faccio in modo che non si possano mettere "_" perché mi servono per splittare "guest" dal numero che lo segue
    if (e.target.value.includes('_')) {
      setShowErrorUnderscore(true);
      //inputValue = inputValue.replace(/_/g, '');
      setUsername(e.target.value.replace(/_/g, ''));
    }
    else{
      setShowErrorUnderscore(false);
    }

  }

  const handleChangePassword=async (e)=>{
    setPassword(e.target.value);
    setShowErrorPassword(false);
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


const isEmailValid = (email) => {
  // Utilizza un' espressione regolare per validare l'email
  return /\S+@\S+\.\S+/.test(email);
}

const handleEmailChange = (e) => {
  setEmail(e.target.value);
  setShowErrorUserAndEmailAlreadyRegistered(false);
  setShowErrorEmail(false);
}


const togglePasswordVisibility = () => {
  setShowPassword(!showPassword);
}

  return (
    <>
      <div className="step">
      <span className="x-step"><Link to="/App">x</Link></span>
        Passo 2 di 4
      </div>
      <form id="signup-form">
        <div className="title t-small">Credenziali</div>
        
        <input type="text" id="username" placeholder="Username (es: @MarioRossi)" onChange={(e)=>handleChangeUsername(e)} value={username} />
        {showErrorDot && <span style={{fontWeight:"bold", fontSize:"115%", color:"red"}}>L'Username deve iniziare con "@". </span>}

        {showErrorUnderscore && <span style={{fontWeight:"bold", fontSize:"115%", color:"red"}}><br/> L'Username non può contenere "_".</span>}

        <input type="email" id="email" placeholder="Email" onChange={(e)=>handleEmailChange(e)} value={email} />
        {showErrorEmail && <span style={{fontWeight:"bold", fontSize:"115%", color:"red"}}>La tua email non è valida.</span>}
        
        <div className="input-wrapper">
          <input type={showPassword ? "text" : "password"} id="password" placeholder="Password" onChange={(e)=>handleChangePassword(e)} value={password} className="password-input" />
          <img 
          src={showPassword ? "https://www.pngitem.com/pimgs/m/495-4950508_show-password-show-password-icon-png-transparent-png.png" : "https://www.pngitem.com/pimgs/m/600-6000108_modify-the-password-small-eyes-eye-password-png.png"} 
          onClick={togglePasswordVisibility} 
          className="toggle-password"
          alt="Mostra/Nascondi Password"
          
        />
        </div>
        <ul className="pw-requisites">
          <li style={{ color: isPasswordShort ? 'red':'green'}}>Minimo 8 caratteri</li>
          <li style={{ color: isPasswordLong ? 'red':'green'}}>Massimo 16 caratteri</li>
          <li style={{ color: isPasswordWithNumber ? 'green':'red'}}>Deve contenere un numero</li>
          <li style={{ color: isPasswordWithSpecialChar ? 'green':'red'}}>Deve contenere un carattere speciale</li>
        </ul>
        {showErrorPassword && 
        <div style={{marginTop:"5%"}}>
          <span style={{fontWeight:"bold", fontSize:"125%", color:"red"}}>La tua password non rispetta i requisiti.</span>
        </div>
        }
        {showErrorUserAndEmailAlreadyRegistered && 
        <div style={{marginTop:"5%"}}>
          <span style={{fontWeight:"bold", fontSize:"125%", color:"red"}}>L'Username e/o l'email che hai inserito sono già in uso.</span>
        </div>
        }
        <div className="btn btn-avanti" id="btn-signup-2" onClick={handleNext}>Avanti</div>
      </form>
    </>
  );
};

export default SignUp2;
