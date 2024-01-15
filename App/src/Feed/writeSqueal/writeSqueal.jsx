import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./writeSqueal.css";
import "../../style.css";
import axios from "axios";



const WriteSqueal = () => {
    const savedData = sessionStorage.getItem("accountData");
    const accountData = JSON.parse(savedData);
    const username = accountData.username;
    const [userData, setUserData] = useState({});
    const [text, setText] = useState(''); //testo inserito dall'utente

    //ottenere i dati dell'utente loggato (immagine profilo, numero caratteri rimanenti)
    useEffect(() => {
        const fetchUserData = async () => {
        try {
            const response = await axios.post(`http://localhost:3001/getUserImageAndCharLeft`, {username} );
            setUserData(response.data);
        } catch (error) {
            console.error('Errore durante il recupero dei dati utente:', error);
        }
    };

    fetchUserData();
  }, [username]);


  const handleChangeText = (e) => {
    if(e.target.value.length > 200) {
        return;
        }
    setText(e.target.value);
  }
    
    return (

            <div>
                <div className="header">
                    <span className="x-step"><Link to="/Feed">x</Link></span>
                    <div id="post-squeal">Squeal</div>
                </div>
                {/* Contiene la profile pic e la textarea dove scrivere */}
                <form className="squeal-body">
                    <div className="profile-pic">
                        <img
                            src={userData.image}
                            alt="Profile Picture"
                        />
                    </div>
                    <textarea className="text-content" placeholder="Squeal about it!" onChange={(e) => handleChangeText(e)} value={text}></textarea>
                </form>
                {/* Contiene i tasti "media" ovvero foto, video, luogo */}
                <div className="media-container">
                    <i className="fa-solid fa-image"></i>
                    <i className="fa-solid fa-video"></i>
                    <i className="fa-solid fa-location-dot"></i>
                </div>
                {/* Contiene il char counter e il tasto per comprare se si sfora */}
                <div className="char-interface">
                    <div className="word-counter">{text.length}/200</div>
                    <div id="buy-char" className="inactive">Not enough? Buy it!</div>
                </div>
                {/* Parte dedicata ai "recipients": titolo, paragrafo e textarea */}
                <div className="subtitle">Who is it for?</div>
                <p>Add your recipients, each one separated by a space.</p>
                <textarea id="recipients-list" placeholder="@foo §foo §BAR"></textarea>
            </div>
        );
};

export default WriteSqueal;