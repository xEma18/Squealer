import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./writeSqueal.css";
import "../../style.css";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const WriteSqueal = () => {
  const navigate = useNavigate();
  const savedData = sessionStorage.getItem("accountData");
  const accountData = JSON.parse(savedData);
  const username = accountData.username;
  const [userData, setUserData] = useState({});
  const [text, setText] = useState(""); //testo inserito dall'utente
  const [image, setImage] = useState(""); //immagine inserita dall'utente
  const [recipients, setRecipients] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef(null);
  const [mapInfo, setMapInfo] = useState({
    lat: null,
    lng: null,
    zoom: 13, // Imposta un valore di zoom di default
  });
  const [publicMode, setPublicMode] = useState(false);
  const [noDailyCharsLeft, setNoDailyCharsLeft] = useState(false);
  const [noWeeklyCharsLeft, setNoWeeklyCharsLeft] = useState(false);
  const [noMonthlyCharsLeft, setNoMonthlyCharsLeft] = useState(false);
  const [intervalloInvio, setIntervalloInvio] = useState(0); // In minuti
  const [numeroInvii, setNumeroInvii] = useState(1);
  const [isTemporizzato, setIsTemporizzato] = useState(false); // Stato per il pulsante Temporizzato

  //ottenere i dati dell'utente loggato (immagine profilo, numero caratteri rimanenti)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post(
          `http://localhost:3001/getUserImageAndCharLeft`,
          { username }
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Errore durante il recupero dei dati utente:", error);
      }
    };

    fetchUserData();
  }, [username]);

  const returnIfRecipientIsEmpty = () => {
    if (recipients.length === 0) {
      alert("Please specify at least one recipient before writing.");
      return true;
    }
  };

  const handleChangeText = (e) => {
    if(returnIfRecipientIsEmpty()) return;
    

    if(publicMode){
      if (e.target.value.length * numeroInvii + userData.caratteriGiornalieriUsati > userData.caratteriGiornalieri) {
          setNoDailyCharsLeft(true);
          if (e.target.value.length * numeroInvii + userData.caratteriSettimanaliUsati > userData.caratteriSettimanali) {
            setNoWeeklyCharsLeft(true);
          }
          if (e.target.value.length * numeroInvii + userData.caratteriMensiliUsati > userData.caratteriMensili) {
            setNoMonthlyCharsLeft(true);
          }
          return;
      } 
  }
    setNoDailyCharsLeft(false);
    setNoWeeklyCharsLeft(false);
    setNoMonthlyCharsLeft(false);
    setText(e.target.value);
  };

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
    if(returnIfRecipientIsEmpty()) return;
    if (userData.caratteriGiornalieri - userData.caratteriGiornalieriUsati >=125) {
      setShowMap(false);
      const file = e.target.files[0]; //prendo il primo file selezionato (siccome potrei selezionare più file)

      if (file) {
        //controlla che il file aggiunto non sia vuoto
        // Controlla la dimensione del file (10 MB = 10 * 1024 * 1024 bytes)
        const maxSize = 10 * 1024 * 1024; // 10 MB
        if (file.size > maxSize) {
          alert(
            "L'immagine è troppo grande. Carica un'immagine più piccola (massimo 10 MB)."
          );
          return;
        }

        const base64Image = await convertToBase64(file);
        setImage(base64Image);

        // Imposta la lunghezza di `text` a 125 caratteri
        let fixedLengthText = text.substring(0, 125);
        while (fixedLengthText.length < 125) {
          fixedLengthText += " "; // Aggiungi spazi per raggiungere 125 caratteri
        }
        setText(fixedLengthText);
      }

      setNoDailyCharsLeft(false);
      setNoWeeklyCharsLeft(false);
      setNoMonthlyCharsLeft(false);
    } else {
      alert("125 characters needed to upload an image");
    }
  };

  const handleRecipientsChange = (e) => {
    const inputText = e.target.value;
    const recipientsList = inputText.split(" ").filter((r) => r !== "");
    setRecipients(recipientsList);

    //recipientsList.some controlla se uno degli elementi dell'array rispetta la condizione
    const containsPublicModeTrigger = recipientsList.some(
      (recipient) => recipient === "@everyone" || recipient.startsWith("§")
    );

    setPublicMode(containsPublicModeTrigger);
  };

  const toggleTemporizzato = () => {
    setIsTemporizzato(!isTemporizzato); // Inverte lo stato di isTemporizzato
  };

  const handlePostSqueal = async () => {
    if(recipients.length === 0) {
        alert("Insert at least one recipient");
        return;
    }
    if(text.length * numeroInvii + userData.caratteriGiornalieriUsati > userData.caratteriGiornalieri){
      alert("You used too much characters")
      return;
    }

    const hasOfficialChannel = recipients.some(recipient => recipient.startsWith("§") && recipient.substring(1).toUpperCase() === recipient.substring(1));

    if (hasOfficialChannel) {
      alert("Cannot send squeal to an official channel (written in uppercase).");
      return; // Interrompe l'esecuzione se trovato un canale ufficiale
    }

    const newSqueal = {
      mittente: username,
      destinatari: recipients,
      text: image === "" ? text : "",
      emoticonNum: {
        verygood: 0,
        good: 0,
        bad: 0,
        verybad: 0,
      },
      impression: 0,
      commentsNum: 0,
      emoticonGivenBy: {
        verygood: [],
        good: [],
        bad: [],
        verybad: [],
      },
      impressionsGivenBy: {},
      bodyImage: image !== "" ? image : "",
      date: new Date(),
      profilePic: userData.image,
      mapLocation: showMap ? mapInfo : null,
      category: publicMode ? "Public" : "Private",
    };

    if (isTemporizzato) {
      const requestBody = {
        squeal: newSqueal,
        intervalloInvio: intervalloInvio, // In minuti
        numeroInvii: numeroInvii,
      };
      //non uso try perchè non posso aspettare la risposta
      axios
        .post(`http://localhost:3001/scheduleSqueal`, requestBody)
        .catch((error) => {
          console.error(
            "Errore durante la programmazione dello squeal:",
            error
          );
        });
      updateCharsLeft(numeroInvii);
    } else {
      try {
        const response = await axios.post(
          `http://localhost:3001/postSqueal`,
          newSqueal
        );
        updateCharsLeft(1);
        newSqueal._id = response.data._id;
      } catch (error) {
        console.error("Errore durante il salvataggio del post:", error);
      }
    }

    //controllo che: se nei recipients c'è un canale (ovvero §nomeCanale) allora fa un'api che mi aggiunge a quel canale l'id del post nel campo listofSqueals (che è un array di stringhe)
    const channelNames = recipients.filter(recipient => recipient.startsWith("§"));
    channelNames.forEach(async (channelName) => {
      try {
        // Include sia squealId che channelName nel body della richiesta POST
        await axios.post(`http://localhost:3001/addSquealToChannel`, {
          squealId: newSqueal._id,
          channelName: channelName // Invia il nome del canale, compreso il prefisso "§", nel body
        });
      } catch (error) {
        console.error(`Error updating channel ${channelName}:`, error);
      }
    });


    navigate("/App/Feed");
  };

  const updateCharsLeft = async (times) => {
    if (publicMode) {
      let newDailyCharsUsed;
      let newWeeklyCharsUsed;
      let newMonthlyCharsUsed;
      if (image || showMap) {
        newDailyCharsUsed = userData.caratteriGiornalieriUsati + times * 125;
        newWeeklyCharsUsed = userData.caratteriSettimanaliUsati + times * 125;
        newMonthlyCharsUsed = userData.caratteriMensiliUsati + times * 125;
      } else {
        newDailyCharsUsed =
          userData.caratteriGiornalieriUsati + times * text.length;
        newWeeklyCharsUsed =
          userData.caratteriSettimanaliUsati + times * text.length;
        newMonthlyCharsUsed =
          userData.caratteriMensiliUsati + times * text.length;
      }
      //api che aggiorna i caratteri rimanenti
      try {
        const response = await axios.post(
          `http://localhost:3001/updateCharsLeft`,
          {
            username: username,
            caratteriGiornalieriUsati: newDailyCharsUsed,
            caratteriSettimanaliUsati: newWeeklyCharsUsed,
            caratteriMensiliUsati: newMonthlyCharsUsed,
          }
        );
      } catch (error) {
        console.error(
          "Errore durante l'aggiornamento dei caratteri rimanenti:",
          error
        );
      }
    }
  };

  const handleLocationClick = () => {
    if(returnIfRecipientIsEmpty()) return;
    if (
      userData.caratteriGiornalieri - userData.caratteriGiornalieriUsati >=
      125
    ) {
      setImage("");
      setShowMap(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          initMap(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Errore nell'ottenere la posizione", error);
        }
      );

      setNoDailyCharsLeft(false);
      setNoWeeklyCharsLeft(false);
      setNoMonthlyCharsLeft(false);
    } else {
      alert("Per caricare la posizione sono necessari 125 caratteri");
    }
  };

  const initMap = (lat, lng) => {
    try {
      const map = L.map(mapRef.current).setView([lat, lng], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      L.marker([lat, lng]).addTo(map).bindPopup("Sei qui!").openPopup();

      // Update mapInfo state
      setMapInfo({ ...mapInfo, lat, lng });

      // Set text to 125 characters as before
      let fixedLengthText = text.substring(0, 125);
      while (fixedLengthText.length < 125) {
        fixedLengthText += " "; // Add spaces to reach 125 characters
      }
      setText(fixedLengthText);
    } catch (error) {
      console.error("Error initializing the map: ", error);
    }
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
    
const handleNumeroInviiChange = (e) => {
        if(text.length*parseInt(e.target.value)+userData.caratteriGiornalieriUsati > userData.caratteriGiornalieri) {
            alert("Non hai abbastanza caratteri rimanenti per inviare il messaggio così tante volte");
            return;
        }
        setNumeroInvii(e.target.value);
    };


        

    const handleRandomImage = async () => {
      if(returnIfRecipientIsEmpty()) return;
      if(publicMode){
        if (userData.caratteriGiornalieri - userData.caratteriGiornalieriUsati >=125) {
            setShowMap(false);
            try {
              const response = await axios.get('http://localhost:3001/randomImage');
              setImage(response.data.imageUrl);

              
            } catch (error) {
              console.error('Errore durante il recupero di un\'immagine casuale:', error);
            }

            let fixedLengthText = text.substring(0, 125);
            while (fixedLengthText.length < 125) {
              fixedLengthText += " "; // Aggiungi spazi per raggiungere 125 caratteri
            }
            setText(fixedLengthText);
          }
          else{
            alert("125 characters needed to upload an image")
          }
        } 
        else{
          setShowMap(false);
            try {
              const response = await axios.get('http://localhost:3001/randomImage');
              setImage(response.data.imageUrl);

              setText(''); // Rimuove il testo se presente
            } catch (error) {
              console.error('Errore durante il recupero di un\'immagine casuale:', error);
            }
        }
      
    };
      
    const handleRandomNews = async () => {
      if(returnIfRecipientIsEmpty()) return;
        setImage(''); 
        setShowMap(false);
        try {
            const response = await axios.get('http://localhost:3001/randomNews');
            const article = response.data;
            setText(`Titolo: ${article.title}\nDescrizione: ${article.description}\nURL: ${article.url}`);
        } catch (error) {
            console.error('Errore durante il recupero delle news:', error);
        }
    };
    



    
    return (

        <div className="write-container">
            <div className="header">
                <span className="x-step"><Link to="/App/Feed">x</Link></span>
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
                    <div className="randomNewsAndImage" onClick={handleRandomNews}>Random News</div>
                    <div className="randomNewsAndImage" onClick={handleRandomImage}>Random Image</div>
                </div>
                {/* Contiene il char counter e il tasto per comprare se si sfora */}
                {publicMode && <div className="char-interface">
                    
                    <div className="characterUsed">
                        <div>Daily characters used </div>
                        <div className={noDailyCharsLeft? "word-counterRed":"word-counter"}>{(text.length*numeroInvii)+userData.caratteriGiornalieriUsati}/{userData.caratteriGiornalieri}</div>
                    </div>

          <div className="characterUsed">
            <div>Weekly characters used </div>
            <div
              className={noWeeklyCharsLeft ? "word-counterRed" : "word-counter"}
            >
              {text.length * numeroInvii + userData.caratteriSettimanaliUsati}/
              {userData.caratteriSettimanali}
            </div>
          </div>

          <div className="characterUsed">
            <div>Monthly characters used </div>
            <div
              className={
                noMonthlyCharsLeft ? "word-counterRed" : "word-counter"
              }
            >
              {text.length * numeroInvii + userData.caratteriMensiliUsati}/
              {userData.caratteriMensili}
            </div>
          </div>
        </div>
      }
      {publicMode && (
        <div id="buy-char" className="inactive">
          Not enough? Buy it!
        </div>
      )}
      {/* Parte dedicata ai "recipients": titolo, paragrafo e textarea */}
      <div className="subtitle" style={{ width: "60%" }}>
        Who is it for?
      </div>
      <p>Add your recipients, each one separated by a space.</p>
      <textarea
        id="recipients-list"
        placeholder="@foo §foo"
        onChange={(e) => handleRecipientsChange(e)}
      ></textarea>

                <div className="automaticMessages">
                    <div id="temporizzato" style={{color: isTemporizzato ? 'green' : 'red', border: `2px solid ${isTemporizzato ? 'green' : 'red'}`}}  onClick={toggleTemporizzato}>Send Timed Message</div>
                    {isTemporizzato &&
                    <div id="repetition-parameters">
                        <p>Send </p>
                        <input id="input-temp" type="number" value={numeroInvii} onChange={(e) => handleNumeroInviiChange(e)} placeholder=""  />
                        <p> times</p> <p> every </p>
                        

                        <input id="input-temp" type="number" value={intervalloInvio} onChange={(e) => setIntervalloInvio(e.target.value)} placeholder=""  />
                        <p> min </p>
                    </div>}
                </div>
                

            
                
            </div>
        );
};

export default WriteSqueal;
