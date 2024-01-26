import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../style.css";
import axios from "axios";

const Search=()=>{
    const savedData = sessionStorage.getItem("accountData");
    const accountData = JSON.parse(savedData);
    const username = accountData.username;
    const [profilePic, setProfilePic] = useState("");

    //faccio useEffect con api che dato username mi ritorna l'immagine del profilo
    useEffect(() => {
        // Definire una funzione asincrona all'interno di useEffect
        const fetchProfilePic = async () => {
            try {
                // Eseguire la richiesta POST e attendere la risposta
                const response = await axios.post(`http://localhost:3001/profilePicByUsername`, {
                    username: username,
                });
    
                // Impostare l'URL dell'immagine nello stato
                setProfilePic(response.data.image);
            } catch (error) {
                // Gestire eventuali errori
                console.error('Errore durante il recupero dell\'immagine del profilo:', error);
            }
        };
    
        // Chiamare la funzione asincrona
        fetchProfilePic();
    }, [username]); // Aggiungere `username` come dipendenza se cambia nel tempo
    



    return(
        <div>
            <div className="go-back">
                <span><i className="fa-solid fa-arrow-left"></i> Feed</span>
            </div>
            <form id="search-form">
                <img
                    src={profilePic}
                    alt="Profile picture"
                />
                <input type="text" placeholder="Search" />
                <i className="fa-solid fa-magnifying-glass"></i>
            </form>
        </div>
    );
};

export default Search;