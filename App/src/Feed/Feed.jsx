import React, { useState, useEffect, useRef} from 'react';
import { Link, useLocation } from 'react-router-dom';
import './feed_style.css';
import '../style.css';
import condorIcon from '../assets/icon_condor.png'
import axios from 'axios';

function useIntersectionObserver(elementRef, callback, options) {
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback();
        }
      });
    }, options);

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [elementRef, callback, options]);
}


const Feed = () => {
  const [squeals, setSqueals] = useState([]);
  //Scrivo questa parte  fuori  dallo useEffect perché se lo mettessi dentro, verrebbe eseguito solo la prima volta che viene renderizzato il componente (perché ho messo "[]" come secondo parametro di useEffect")
  const savedData = sessionStorage.getItem('accountData');
  const accountData = JSON.parse(savedData);   // Se non ci sono dati di registrazione salvati in sessionStorage, salva un oggetto con un campo username:@guest
  const username=accountData.username;
  const refs = useRef([]);
  const [registeredImpressions, setRegisteredImpressions] = useState(new Set());
  

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
          .then(data => {
            setSqueals(data);
            // Inizializza refs per i nuovi squeals
            refs.current = data.map((_, i) => refs.current[i] || React.createRef());
        })
          .catch(error => console.error('Errore nel caricamento degli squeals:', error));
  }, [username]); // Il secondo parametro vuoto [] indicherebbe che useEffect verrà eseguito solo una volta alla creazione del componente, ho messo "username", così useffect viene eseguito ogni volta che cambia username (quindi ogni volta chen accedo al feed con un account diverso)



  const handleEmoticonGood = async (squeal) => {
    if(username!='@guest'){ //se l'utente non è guest, può mettere like/dislike
      //controllo se l'utente ha già dato un emoticon good a questo squeal e seleziono l'endpoint da chiamare
      const endpoint = squeal.emoticonGivenBy.good.includes(username) ? '/removeEmoticonGood' : '/addEmoticonGood';
      try {
          const response = await axios.post(`http://localhost:3001${endpoint}`, { "_id": squeal._id, "username": username });
          // Aggiorna lo stato locale con i dati aggiornati del squeal
          const updatedSqueals = squeals.map(s => {
              if (s._id === squeal._id) {
                  return response.data; // response.data dovrebbe contenere il squeal aggiornato
              }
              return s;
          });
          setSqueals(updatedSqueals);
      } catch (error) {
          console.error('Errore nel gestire il like:', error);
      }
  }
};

const handleEmoticonBad = async (squeal) => {
  if(username!='@guest'){
    //controllo se l'utente ha già dato un emoticon bad a questo squeal e seleziono l'endpoint da chiamare
  const endpoint = squeal.emoticonGivenBy.bad.includes(username) ? '/removeEmoticonBad' : '/addEmoticonBad';
  try {
      const response = await axios.post(`http://localhost:3001${endpoint}`, { "_id": squeal._id, "username": username });
      // Aggiorna lo stato locale con i dati aggiornati del squeal
      const updatedSqueals = squeals.map(s => {
          if (s._id === squeal._id) {
              return response.data; // response.data dovrebbe contenere il squeal aggiornato
          }
          return s;
      });
      setSqueals(updatedSqueals);
  } catch (error) {
      console.error('Errore nel gestire il like:', error);
    }
  }
}

const handleImpression = async (squealId) => {
  if (registeredImpressions.has(squealId)) {
    return; // Se l'impression è già stata registrata, non fare nulla
  }
    try {
      console.log("handleImpression");
      const response = await axios.post(`http://localhost:3001/addImpression`, { "_id": squealId, "username": username });
      // Aggiorna lo stato locale con i dati aggiornati del squeal
      const updatedSqueals = squeals.map(s => {
          if (s._id === squealId) {
              return response.data; // response.data dovrebbe contenere il squeal aggiornato
          }
          return s;
      });
      setSqueals(updatedSqueals);
      setRegisteredImpressions(new Set(registeredImpressions).add(squealId)); // Aggiorna l'elenco delle impressioni registrate
  } catch (error) {
      console.error('Errore nel gestire il like:', error);
    }
}

useEffect(() => {
  const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              handleImpression(entry.target.dataset.squealId);
          }
      });
  }, {});

  refs.current.forEach(ref => {
      if (ref.current) {
          observer.observe(ref.current);
      }
  });

  return () => {
      refs.current.forEach(ref => {
          if (ref.current) {
              observer.unobserve(ref.current);
          }
      });
  };
}, [squeals]); // Dipendenze: aggiorna l'observer quando la lista di squeals cambia


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
            
          {squeals.map((squeal, index) => (
                 <div className="user-post" key={squeal._id} ref={refs.current[index]} data-squeal-id={squeal._id}>
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
                        <div className="post-likes" onClick={() => handleEmoticonGood(squeal)}>
                          <i className={` ${squeal.emoticonGivenBy.good.includes(username) ? "fa-solid fa-thumbs-up" : "fa-regular fa-thumbs-up"}`}></i>
                          <span className="post-likes-number"> {squeal.emoticonNum.good}</span>
                        </div>
                        <div className="post-dislikes" onClick={() => handleEmoticonBad(squeal)}>
                          <i className={` ${squeal.emoticonGivenBy.bad.includes(username) ? "fa-solid fa-thumbs-down" : "fa-regular fa-thumbs-down"}`}></i>
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
