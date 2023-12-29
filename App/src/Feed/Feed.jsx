import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './feed_style.css';
import '../style.css';
import condorIcon from '../assets/icon_condor.png'




const Feed = () => {
  const [squeals, setSqueals] = useState([]);
  //Scrivo questa parte  fuori  dallo useEffect perché se lo mettessi dentro, verrebbe eseguito solo la prima volta che viene renderizzato il componente (perché ho messo "[]" come secondo parametro di useEffect")
  const savedData = sessionStorage.getItem('accountData');
  const accountData = JSON.parse(savedData);   // Se non ci sono dati di registrazione salvati in sessionStorage, salva un oggetto con un campo username:@guest
  const username=accountData.username;
  



  useEffect(() => {
      
      // Effettua una richiesta GET al server per ottenere i gli squeals filtrati per username (ricevo solo gli squeals con "username" tra i destinatari)
      fetch("http://localhost:3001/squealsToUser", {
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({username})
        })
          .then(response => response.json())
          .then(data => setSqueals(data))
          .catch(error => console.error('Errore nel caricamento degli squeals:', error));
  }, [username]); // Il secondo parametro vuoto [] indicherebbe che useEffect verrà eseguito solo una volta alla creazione del componente, ho messo "username", così useffect viene eseguito ogni volta che cambia username (quindi ogni volta chen accedo al feed con un account diverso)


    return (
      //header
      <div id="feedBody">
          <div>
            <div className="feedContainer">
              <div className="feedHeader">
                <img
                  id="feedCondor-icon"
                  src={condorIcon}
                  alt="Condor Icon"
                />
              </div>
              <div className="feed">
            
          {squeals.map(squeal => (
                <div className="user-post" key={squeal._id}>
                  <div className="profile-pic">
                    <img
                    src={squeal.profilePic}
                    alt="Profile Picture"
                    />
                  </div>
                    <div className="post-body">
                      <div className="post-namedate">
                        <span className="post-username">{squeal.mittente} </span>
                      <i className="fa-solid fa-feather"></i>
                      <span className="post-date"> {new Date(squeal.data).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                      <div className="post-content">
                        {squeal.text}
                        {squeal.bodyImage && (
                        <img
                          src={squeal.bodyImage}
                          alt="bodyImage"
                        />
                        )}
                      </div>
                      <div className="post-reactions">
                        <div className="post-comments">
                          <i className="fa-regular fa-comment"></i>
                          <span className="post-comments-number"> {squeal.commentsNum}</span>
                        </div>
                        <div className="post-likes">
                          <i className="fa-regular fa-thumbs-up"></i>
                          <span className="post-likes-number"> {squeal.emoticonNum.good}</span>
                        </div>
                        <div className="post-dislikes">
                          <i className="fa-regular fa-thumbs-down"></i>
                          <span className="post-dislikes-number"> {squeal.emoticonNum.bad}</span>
                        </div>
                        <div className="post-impressions">
                          <i className="fa-regular fa-eye"></i>
                          <span className="post-impressions-number"> {squeal.impression}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                
              
            ))}        

          
        </div>
        <div className="footer"></div>
        </div>
          </div>
      </div>
    );
};

export default Feed;
