import React, { useState } from 'react';
import '../style.css';
import { Link, useNavigate} from 'react-router-dom';
 
const SignUp3=({updateRegistrationData})=>{
    const navigate = useNavigate();
    const [image, setImage]=useState('');

    //funzione copiata che mi converte un file in base64 in modo  da poter salvare l'immagine nel db come stringa
    const convertToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    const handleImageChange = async (e) => {
      const file = e.target.files[0]; //prendo il primo file selezionato (siccome potrei selezionare più file)
  
      if (file) { //controlla che il file aggiunto non sia vuoto
        // Controlla la dimensione del file (10 MB = 10 * 1024 * 1024 bytes)
        const maxSize = 10 * 1024 * 1024; // 10 MB
        if (file.size > maxSize) {
          alert("L'immagine è troppo grande. Carica un'immagine più piccola (massimo 10 MB).");
          return;
        }
    
        const base64Image = await convertToBase64(file);
        setImage(base64Image);
      }
    };

    const handleNext=async ()=>{
        updateRegistrationData({
          image,
        });
        navigate('/SignUp4');
      }



    return(
        <>  
            <div className="step">
               <span className="x-step"><Link to="/">x</Link></span>
                Passo 3 di 4
            </div>
            <form id="signup-form">
            <div className="title t-small">Scegli un immagine profilo</div>
            <div className="subtitle">Hai un'immagine che ti rappresenta? Caricala.</div>
            <input type="file" accept="image/*" onChange={handleImageChange}  />
            {/* Visualizzare l'immagine selezionata */}
            {image && <img src={image} alt="Immagine profilo" style={{ maxWidth: '100%', maxHeight: '200px' }} />}
            <div className="btn btn-avanti" id="btn-signup-2" onClick={handleNext}>Avanti</div>
            </form>
        </>
    );
};
export default SignUp3;