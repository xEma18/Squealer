import React, { useState } from 'react';
import './style.css';
import { Link, useNavigate} from 'react-router-dom';
 
const SignUp3=()=>{
    return(
        <>  
            <div className="step">
               <span className="x-step"><Link to="/">x</Link></span>
                Passo 3 di 4
            </div>
            <form id="signup-form">
            <div className="title t-small">Scegli un immagine profilo</div>
            <div className="subtitle">Hai un'immagine che ti rappresenta? Caricala.</div>
            <div className="btn btn-avanti" id="btn-signup-2">Avanti</div>
            </form>
        </>
    );
};
export default SignUp3;