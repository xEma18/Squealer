import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './feed_style.css';
import '../style.css';
import condorIcon from '../assets/icon_condor.png'
//import moment from 'moment';



const HostFeed = () => {
    
  const [squeals, setSqueals] = useState([]);

  useEffect(() => {
      // Effettua una richiesta GET al tuo server per ottenere i dati
      fetch('http://localhost:3001/squeal')
          .then(response => response.json())
          .then(data => setSqueals(data))
          .catch(error => console.error('Errore nel caricamento degli squeals:', error));
  }, []); // Il secondo parametro vuoto [] indica che useEffect verrà eseguito solo una volta alla creazione del componente


    return (
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
          {/* <!-- inizio post --> */}

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
                        <span className="post-username"><span>@</span>{squeal.mittente}</span>
                      <i className="fa-solid fa-feather"></i>
                      <span className="post-date">{squeal.data}</span>
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

export default HostFeed;
