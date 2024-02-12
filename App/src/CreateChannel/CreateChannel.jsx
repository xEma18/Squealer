import React, { useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style.css";
import "./createChannelStyle.css";
import axios from "axios";

const CreateChannel = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const savedData = sessionStorage.getItem("accountData");
    const accountData = JSON.parse(savedData);
    const username = accountData.username;
    const [showErrorName, setShowErrorName] = useState(false);


    const handleChangeName=(e)=>{
        
        if (!e.target.value.startsWith('§')) { //qui non ci posso mettere "username.startsWith('@') perché lo state non vine aggiornato subito, quindi non è aggiornato quando viene eseguito questo if"
            setShowErrorName(true);
            setName('');
          }
          else if(!/\s/.test(e.target.value)){
            setName(e.target.value);
            setShowErrorName(false);
          }
    };


    const handleChangeDescription = (e) => {
        const newText = e.target.value;
        if (newText.length > 50) {
        } else {
        setDescription(newText);
        }
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

    const createChannel = async () => {
        //api a /addChannelWithProfilePic inviando i dati del form e l'immagine con try e catch
        try {
            const response = await axios.post('http://localhost:3001/addChannelWithProfilePic', {name: name, type:"Unofficial", description: description, profilePic: image, creator: username});
            console.log(response);
        } catch (error) {
            console.error('Errore durante la creazione del canale:', error);
        }

        navigate("/Feed")

    };
    return(
        <div>
            <div className="step">
                <span className="x-step"><Link to="/Feed">x</Link></span>Feed
            </div>
            <form id="signup-form">
                <div className="title title-create-channel">Create your Channel</div>
                <input type="text" id="name" placeholder="Name" onChange={(e)=>handleChangeName(e)} value={name} />
                {showErrorName && <span style={{fontWeight:"bold", fontSize:"115%", color:"red"}}>Channel's name must start width "§". </span>}

                <div className="subtitle s-small optional">Optional:</div>
                <div className="t-area-container">
                    <span className="word-counter">{description.length}/50</span>
                    <textarea placeholder="Insert Description" id="description-box" cols="15" rows="5" onChange={(e)=>handleChangeDescription(e)} value={description}></textarea>
                </div>
                <div className="imageContainer">
                    {image && <img src={image} alt="Immagine profilo" style={{ maxWidth: '100%', maxHeight: '150px' }} />}
                    <label htmlFor="fileInput" className=" postSqueal profilePicButton">Select Profile Picture</label>
                </div>
                <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    />
                
                <div className="btn btn-avanti" id="btn-signup-2" onClick={createChannel}>Create Channel</div>
            </form>
            
        </div>
    )
};

export default CreateChannel;