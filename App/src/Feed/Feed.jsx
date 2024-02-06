import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./feed_style.css";
import "../style.css";
import condorIcon from "../assets/icon_condor.png";
import axios from "axios";

function useIntersectionObserver(elementRef, callback, options) {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
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
  const navigate = useNavigate();
  const [squeals, setSqueals] = useState([]);
  //Scrivo questa parte  fuori  dallo useEffect perché se lo mettessi dentro, verrebbe eseguito solo la prima volta che viene renderizzato il componente (perché ho messo "[]" come secondo parametro di useEffect")
  const savedData = sessionStorage.getItem("accountData");
  const accountData = JSON.parse(savedData);
  const username = accountData.username;
  const refs = useRef([]);
  const [registeredImpressions, setRegisteredImpressions] = useState(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    // // Effettua una richiesta GET al server per ottenere i gli squeals filtrati per username (ricevo solo gli squeals con "username" tra i destinatari)
    // fetch("http://localhost:3001/squealsToUser", {
    //   method: "POST", //Da capire se get o post
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ username: username.split("_")[0] }), //nel caso in cui l'utente sia un guest, username è del tipo @guest_1, quindi splitto la stringa e prendo solo la prima parte, se nella stringa non ci sono "_" non cambia nulla
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setSqueals(data);
    //     // Inizializza refs per i nuovi squeals
    //     refs.current = data.map((_, i) => refs.current[i] || React.createRef());
    //   })
    //   .catch((error) =>
    //     console.error("Errore nel caricamento degli squeals:", error)
    //   );

    async function getSqueals() {
      try {
        const res = await fetch("http://localhost:3001/squealsToUser", {
          method: "POST", //Da capire se get o post
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: username.split("_")[0] }), //nel caso in cui l'utente sia un guest, username è del tipo @guest_1, quindi splitto la stringa e prendo solo la prima parte, se nella stringa non ci sono "_" non cambia nulla
        });

        const data = await res.json();
        setSqueals(data);
        refs.current = data.map((_, i) => refs.current[i] || React.createRef());
      } catch (e) {
        console.error("Errore nel caricamento degli squeals", e.message);
      }
    }
    getSqueals();
  }, [username]); // Il secondo parametro vuoto [] indicherebbe che useEffect verrà eseguito solo una volta alla creazione del componente, ho messo "username", così useffect viene eseguito ogni volta che cambia username (quindi ogni volta chen accedo al feed con un account diverso)

  const handleDeleteAccount = function () {
    setPopupOpen(true);
    setSidebarOpen(false);
  };

  const handleNoDelete = function () {
    setPopupOpen(false);
  };

  const handleYesDelete = async function () {
    setPopupOpen(false);
    try {
      const response = await axios.post(`http://localhost:3001/deleteAccount`, {
        username: username,
      });
    } catch (error) {
      console.error("Errore nel gestire l'eliminazione dell'account:", error);
    }
    sessionStorage.removeItem("accountData");
    navigate("/");
  };

  const handleEmoticonGood = async (squeal) => {
    // Uso un'espressione regolare per verificare se l'username è nel formato "guest_x". Se "username" soddisfa il pattern, allora isGuest sarà true
    const isGuest = /^@guest_\d+$/.test(username);
    if (!isGuest) {
      //se l'utente non è guest, può mettere like/dislike
      //controllo se l'utente ha già dato un emoticon good a questo squeal e seleziono l'endpoint da chiamare
      const endpoint = squeal.emoticonGivenBy.good.includes(username)
        ? "/removeEmoticonGood"
        : "/addEmoticonGood";
      try {
        const response = await axios.post(`http://localhost:3001${endpoint}`, {
          _id: squeal._id,
          username: username,
        });

        // Aggiorna lo stato locale con i dati aggiornati del squeal
        const updatedSqueals = squeals.map((s) => {
          if (s._id === squeal._id) {
            return response.data;
          }
          return s;
        });
        setSqueals(updatedSqueals);
      } catch (error) {
        console.error("Errore nel gestire il like:", error);
      }
    }
  };

  const handleEmoticonBad = async (squeal) => {
    const isGuest = /^@guest_\d+$/.test(username);
    if (!isGuest) {
      //controllo se l'utente ha già dato un emoticon bad a questo squeal e seleziono l'endpoint da chiamare
      const endpoint = squeal.emoticonGivenBy.bad.includes(username)
        ? "/removeEmoticonBad"
        : "/addEmoticonBad";
      try {
        const response = await axios.post(`http://localhost:3001${endpoint}`, {
          _id: squeal._id,
          username: username,
        });
        // Aggiorna lo stato locale con i dati aggiornati del squeal
        const updatedSqueals = squeals.map((s) => {
          if (s._id === squeal._id) {
            return response.data; // response.data dovrebbe contenere il squeal aggiornato
          }
          return s;
        });
        setSqueals(updatedSqueals);
      } catch (error) {
        console.error("Errore nel gestire il dislike:", error);
      }
    }
  };

  const handleImpression = async (squealId) => {
    if (registeredImpressions.has(squealId)) {
      return; // Se l'impression è già stata registrata, non fare nulla
    }
    try {
      const response = await axios.post(`http://localhost:3001/addImpression`, {
        _id: squealId,
        username: username,
      });
      // Aggiorna lo stato locale con i dati aggiornati del squeal
      const updatedSqueals = squeals.map((s) => {
        if (s._id === squealId) {
          return response.data; // response.data dovrebbe contenere il squeal aggiornato
        }
        return s;
      });
      setSqueals(updatedSqueals);
      setRegisteredImpressions((prevSet) => new Set([...prevSet, squealId])); // Aggiorna l'elenco delle impressioni registrate
    } catch (error) {
      console.error("Errore nel registrare l'impression:", error);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          handleImpression(entry.target.dataset.squealId);
        }
      });
    }, {});

    refs.current.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      refs.current.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [squeals]); // Dipendenze: aggiorna l'observer quando la lista di squeals cambia

  //inizializza le eventuali mappe presenti negli squeals (inserendo già latitudine, longitudine e zoom)
  useEffect(() => {
    squeals.forEach((squeal) => {
      if (squeal.mapLocation) {
        const mapId = `map-${squeal._id}`;
        const container = document.getElementById(mapId);

        // Controlla se la mappa è già stata inizializzata
        if (container && !container._leaflet_id) {
          const map = L.map(mapId, {
            zoomControl: false,
            attributionControl: false,
          }).setView(
            [squeal.mapLocation.lat, squeal.mapLocation.lng],
            squeal.mapLocation.zoom
          );

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
          }).addTo(map);

          const marker = L.marker([
            squeal.mapLocation.lat,
            squeal.mapLocation.lng,
          ]).addTo(map);
          marker.bindPopup("Sei qui!").openPopup();
        }
      }
    });
  }, [squeals]);

  //funzione che risconosce i link all'interno di un testo e li rende cliccabili
  const renderTextWithLinks = (text) => {
    // Questa regex cerca di identificare gli URL completi e quelli che iniziano con "www." seguiti da un dominio
    const urlRegex =
      /(\bhttps?:\/\/[^\s]+)|(\bwww\.[^\s]+)|(\b[a-z0-9]+([-\._][a-z0-9]+)*\.[a-z]{2,}(\/[^\s]*)?)/gi;
    return text.split(urlRegex).map((part, i) => {
      // Controlla se la parte è un URL
      const isURL = urlRegex.test(part);
      const isWWW = /^www\./.test(part);
      // Se è un URL che non inizia con http o https, e inizia con www, non aggiungere "http://"
      const href = isURL && !isWWW ? part : `http://${part}`;
      return isURL ? (
        <a
          className="link"
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {part}
        </a>
      ) : (
        part
      );
    });
  };

  const handleSearchButton = () => {
    navigate("/Feed/Search");
  };

  const handleWriteSquealButton = () => {
    //se l'utente è guest, non può scrivere uno squeal, mentre se non è guest, va a navigate a WriteSqueal
    const isGuest = /^@guest_\d+$/.test(username);
    if (!isGuest) {
      navigate("/Feed/WriteSqueal");
    }
  };

  const handleLogOut = () => {
    sessionStorage.removeItem("accountData");
    navigate("/");
  };

  return (
    //header
    <div id="feedBody">
      <div>
        <div className={`feedContainer ${popupOpen ? "not-scrollable" : ""}`}>
          {popupOpen && (
            <PopUp handleYes={handleYesDelete} handleNo={handleNoDelete} />
          )}

          <SideBar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            onDeleteAccount={handleDeleteAccount}
            onLogOut={handleLogOut}
          />

          <Header setSidebarOpen={setSidebarOpen} />

          {/* L'item "footer" ha posizione fixed. L'ho messo qui per comodità. */}
          <Footer
            onWriteSquealButton={handleWriteSquealButton}
            onSearchButton={handleSearchButton}
          />

          <FeedList>
            {squeals.map((squeal, index) => (
              <Squeal
                squeal={squeal}
                index={index}
                refs={refs}
                onEmoticonGood={handleEmoticonGood}
                onEmoticonBad={handleEmoticonBad}
                renderTextWithLinks={renderTextWithLinks}
                key={squeal._id}
              />
            ))}
          </FeedList>
        </div>
      </div>
    </div>
  );
};

function PopUp({ handleYes, handleNo }) {
  return (
    <>
      <div className="overlay"></div>
      <div className="pop-up">
        <p>Are you sure about it?</p>
        <div>
          <button onClick={handleYes}>Yes</button>
          <button onClick={handleNo}>No</button>
        </div>
      </div>
    </>
  );
}

function SideBar({ sidebarOpen, setSidebarOpen, onDeleteAccount, onLogOut }) {
  return (
    <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <ul className="top-list">
        <li>
          <i
            className="fa-solid fa-arrow-left"
            onClick={() => setSidebarOpen(false)}
          ></i>
        </li>
        <li>
          <i className="fa-solid fa-user"></i> Profile
        </li>
        <li>
          <i className="fa-solid fa-address-book"></i> Manager
        </li>
      </ul>
      <ul className="bottom-list">
        <li onClick={onDeleteAccount}>
          <i className="fa-solid fa-trash"></i> Delete account
        </li>
        <li onClick={onLogOut}>
          <i className="fa-solid fa-right-from-bracket"></i> Log out
        </li>
      </ul>
    </div>
  );
}

function Header({ setSidebarOpen }) {
  return (
    <div className="feedHeader-container">
      <div className="feedHeader">
        <img id="feedCondor-icon" src={condorIcon} alt="Condor Icon" />
        <i
          className="fa-solid fa-user"
          onClick={() => setSidebarOpen(true)}
        ></i>
      </div>
    </div>
  );
}

function Footer({ onWriteSquealButton, onSearchButton }) {
  return (
    <div className="feedFooter">
      <i className="fa-solid fa-house fa-1x"></i>
      <i
        className="fa-solid fa-feather fa-1x"
        onClick={onWriteSquealButton}
      ></i>
      <i
        className="fa-solid fa-magnifying-glass fa-1x"
        onClick={onSearchButton}
      ></i>
    </div>
  );
}

function FeedList({ children }) {
  return <div className="feed">{children}</div>;
}

function Squeal({
  refs,
  squeal,
  index,
  onEmoticonGood,
  onEmoticonBad,
  renderTextWithLinks,
}) {
  return (
    <div
      className="user-post"
      key={squeal._id}
      ref={refs.current[index]}
      data-squeal-id={squeal._id}
    >
      <div className="profile-pic">
        <img src={squeal.profilePic} alt="Profile Picture" />
      </div>
      <div className="post-body">
        <div className="post-namedate">
          <span className="post-username">{squeal.mittente} </span>
          <i className="fa-solid fa-feather"></i>
          <span className="post-date">
            {" "}
            {new Date(squeal.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="post-content">
          {renderTextWithLinks(squeal.text)}
          {squeal.bodyImage && <img src={squeal.bodyImage} alt="bodyImage" />}
          {squeal.mapLocation && (
            <div
              id={`map-${squeal._id}`}
              style={{ height: "200px", width: "100%" }}
            ></div>
          )}
        </div>
        <div className="post-reactions">
          <div className="post-comments">
            <i className="fa-regular fa-comment"></i>
            <span className="post-comments-number"> {squeal.commentsNum}</span>
          </div>
          <div className="post-likes" onClick={() => onEmoticonGood(squeal)}>
            <i
              className={` ${
                squeal.emoticonGivenBy.good.includes(username)
                  ? "fa-solid fa-thumbs-up"
                  : "fa-regular fa-thumbs-up"
              }`}
            ></i>
            <span className="post-likes-number">
              {" "}
              {squeal.emoticonNum.good}
            </span>
          </div>
          <div className="post-dislikes" onClick={() => onEmoticonBad(squeal)}>
            <i
              className={` ${
                squeal.emoticonGivenBy.bad.includes(username)
                  ? "fa-solid fa-thumbs-down"
                  : "fa-regular fa-thumbs-down"
              }`}
            ></i>
            <span className="post-dislikes-number">
              {" "}
              {squeal.emoticonNum.bad}
            </span>
          </div>
          {squeal.category !== "private" && (
            <div className="post-impressions">
              <i className="fa-regular fa-eye"></i>
              <span className="post-impressions-number">
                {" "}
                {squeal.impression}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Feed;
