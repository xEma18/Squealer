import React, { useState, useEffect, useRef,  } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./writeSqueal.css";
import "../../style.css";
import axios from "axios";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';



const WriteSqueal = () => {
    const navigate = useNavigate();
    const savedData = sessionStorage.getItem("accountData");
    const accountData = JSON.parse(savedData);
    const username = accountData.username;
    const [userData, setUserData] = useState({});
    const [text, setText] = useState(''); //testo inserito dall'utente
    const [image, setImage] = useState(''); //immagine inserita dall'utente
    const [recipients, setRecipients] = useState([]);
    const [showMap, setShowMap] = useState(false);
    const mapRef = useRef(null);
    const [mapInfo, setMapInfo] = useState({
        lat: null,
        lng: null,
        zoom: 13 // Imposta un valore di zoom di default
    });

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
    setShowMap(false);
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

const handleRecipientsChange = (e) => {
    const recipients = e.target.value.split(' ').filter(r => r !== ''); //splitta la stringa in base agli spazi e rimuove eventuali spazi vuoti in più
    setRecipients(recipients);
}

const handlePostSqueal = async () => {

    const newSqueal = {
        mittente: username,
        destinatari: recipients,
        text: image === '' ? text : '',
        emoticonNum: {
            verygood: 0,
            good: 0,
            bad: 0,
            verybad: 0,
        },
        impression:0,
        commentsNum:0,
        emoticonGivenBy: {
            verygood: [],
            good: [],
            bad: [],
            verybad: [],
        },
        impressionsGivenBy:{},
        bodyImage: image !== '' ? image : '',
        date: new Date(),
        profilePic: userData.image,
        mapLocation: showMap ? mapInfo : null,

    };

        //api che salva il post nel db
        try {
            const response = await axios.post(`http://localhost:3001/postSqueal`, newSqueal );
            console.log(response.data);
        } catch (error) {
            console.error('Errore durante il salvataggio del post:', error);
        }

        navigate('/Feed');
    }


    const handleLocationClick = () => {
        setImage('');
        setShowMap(true);
        navigator.geolocation.getCurrentPosition((position) => {
           
            initMap(position.coords.latitude, position.coords.longitude);
        }, (error) => {
            console.error("Errore nell'ottenere la posizione", error);
        });
    };


    const initMap = (lat, lng) => {
        const map = L.map(mapRef.current).setView([lat, lng], 13);
    
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
    
        L.marker([lat, lng]).addTo(map)
            .bindPopup('Sei qui!')
            .openPopup();
        
        //aggiorno lo stato della mappa
        setMapInfo({ ...mapInfo, lat, lng });
    };


    const renderContent = () => {
        if (image) {
            
            return (
                <img 
                    src={image} 
                    alt="Uploaded" 
                    style={{ maxWidth: '80%', maxHeight: '165px' }} 
                />
            );
        } else if (showMap) {
            return (
                <div ref={mapRef} style={{ height: '400px', width: '100%' }}></div>
            );
        } else {
            return (
                <textarea 
                    className="text-content" 
                    placeholder="Squeal about it!" 
                    onChange={handleChangeText} 
                    value={text}
                    style={{ marginLeft: '10px' }}
                ></textarea>
            );
        }
    };
    








    
    return (

        <div>
            <div className="header">
                <span className="x-step"><Link to="/Feed">x</Link></span>
                <div id="post-squeal" onClick={handlePostSqueal}>Squeal</div>
            </div>
            {/* Contiene la profile pic e la textarea dove scrivere */}
            <form className="squeal-body">
                <div className="profile-pic" >
                    <img
                        src={userData.image}
                        alt="Profile Picture"
                    />
                </div>
                {renderContent()}
            </form>
                {/* Contiene i tasti "media" ovvero foto, video, luogo */}
                <div className="media-container">
                    <label htmlFor="fileInput"><i className="fa-solid fa-image"></i></label>
                    <input
                        id="fileInput"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
            />
                    <i className="fa-solid fa-video"></i>
                    <i className="fa-solid fa-location-dot" onClick={handleLocationClick}></i>
                </div>
                {/* Contiene il char counter e il tasto per comprare se si sfora */}
                <div className="char-interface">
                    {!image && <div className="word-counter">{text.length}/200</div>}
                    <div id="buy-char" className="inactive">Not enough? Buy it!</div>
                </div>
                {/* Parte dedicata ai "recipients": titolo, paragrafo e textarea */}
                <div className="subtitle">Who is it for?</div>
                <p>Add your recipients, each one separated by a space.</p>
                <textarea id="recipients-list" placeholder="@foo §foo §BAR" onChange={(e)=>handleRecipientsChange(e)}></textarea>
            </div>
        );
};

export default WriteSqueal;