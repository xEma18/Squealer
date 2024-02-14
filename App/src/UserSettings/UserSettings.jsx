import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import "../Feed/feed_style.css";
import "../style.css";
import L from "leaflet";
import axios from "axios";

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

export default function UserSettings() {
  const accountData = JSON.parse(sessionStorage.getItem("accountData"));
  const username = accountData.username;
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [squealsList, setSquealsList] = useState([]);
  const isStandard = useRef(true);
  const navigate = useNavigate();

  // Fetch dell'utente
  useEffect(function(){
    async function fetchUser(){
      try{
        const res = await axios.get(`/getUserByUsername/${username}`);
        setUser(res.data);
      }catch(error){
        console.error(`Errore durante il caricamento dell'utente: ${error.message}`);
      }
    }

    fetchUser();
  }, [username])

  // Fetch degli squeal inviati dall'utente
  useEffect(function(){
    async function fetchSqueals(){
      try{
        const res = await axios.get(`/getPublicSquealsBySender/${username}`);
        setSquealsList(res.data);
      }catch(error){
        console.error(`Errore nel caricamento degli squeal: ${error.message}`)
      }
    }

    fetchSqueals();
  }, [username]);

  // Dato uno squeal, verifica se il mittente è standard o meno  
  useEffect(function(){
    async function getUserType(){
      try{
        const res = await axios.get(`/getUserTypeByUsername/${username}`);
        isStandard.current = res.data === "Standard" ? true : false;
      }catch(error){
        console.error(`Errore durante il caricamento del tipo: ${error.message}`);
      }
    }
    getUserType();
  }, [username]);

  //inizializza le eventuali mappe presenti negli squeals (inserendo già latitudine, longitudine e zoom)
  useEffect(() => {
    squealsList.forEach((squeal) => {
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
  }, [squealsList]);

  const handleEmoticonGood = async (squeal) => {
    const isGuest = /^@guest_\d+$/.test(username);
    if (!isGuest) {
      const endpoint = squeal.emoticonGivenBy.good.includes(username)
        ? "/removeEmoticonGood"
        : "/addEmoticonGood";
      try {
        const response = await axios.post(`${endpoint}`, {
          _id: squeal._id,
          username: username,
        });
        
        setSquealsList(squeals => squeals.map((s) => {
          if (s._id === squeal._id) {
            return response.data;
          }
          return s;
        }));
      } catch (error) {
        console.error("Errore nel gestire il like:", error);
      }
    }
  };

  const handleEmoticonBad = async (squeal) => {
    const isGuest = /^@guest_\d+$/.test(username);
    if (!isGuest) {
      const endpoint = squeal.emoticonGivenBy.bad.includes(username)
        ? "/removeEmoticonBad"
        : "/addEmoticonBad";
      try {
        const response = await axios.post(`${endpoint}`, {
          _id: squeal._id,
          username: username,
        });

        setSquealsList(squeals => squeals.map((s) => {
          if (s._id === squeal._id) {
            return response.data;
          }
          return s;
        }));
      } catch (error) {
        console.error("Errore nel gestire il dislike:", error);
      }
    }
  };

  const handleOpenComments = function(squealId){
    navigate(`/App/Feed/comments?squeal_id=${squealId}&back=UserSettings`);
  }

  function handleShowEdit() {
    setIsEditing((cur) => !cur);
  }

  async function handleSubmitPassword(newPassword) {
    if(!newPassword) return;

    try{
        // da mettere
    }catch(error){
      console.error(`Errore nell'aggiornamento della password: ${error.message}`)
    }

    // Qui si dovrebbe validare la password inserita e aggiornare il profilo utente di conseguenza.
    setIsEditing(false);
  }

  return (
    <>
      <Utilities isEditing={isEditing} onShowEdit={handleShowEdit} navigate={navigate}/>

      {/* // <!-- SEZIONE 1: Contiene la presentazione, diviso in header e description --> */}
      <Presentation
        user={user}
        setUser={setUser}
        isStandard={isStandard}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onSubmitPassword={handleSubmitPassword}
        squealsList={squealsList}
      />

      {/* <!-- SEZIONE 2: Raccolta degli squeals dell'user. Organizzato esattamente come il feed --> */}
      <Squeals isStandard={isStandard} squealsList={squealsList} onOpenComments={handleOpenComments} onEmoticonGood={handleEmoticonGood} onEmoticonBad={handleEmoticonBad}/>
    </>
  );
}

function Button({ children, onClick }) {
  return (
    <div className="edit" role="button" onClick={onClick}>
      {children}
    </div>
  );
}

function Utilities({ isEditing, onShowEdit, navigate }) {
  return (
    <div className="utilities">
      <div className="go-back" onClick={() => navigate("/App/Feed")}>
        <span>
          <i className="fa-solid fa-arrow-left"></i> Feed
        </span>
      </div>
      {isEditing ? (
        <Button onClick={onShowEdit}>Done</Button>
      ) : (
        <Button onClick={onShowEdit}>Edit</Button>
      )}
    </div>
  );
}

function Presentation({ user, setUser, isStandard, isEditing, setIsEditing, onSubmitPassword, squealsList}) {
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const totalSqueals = squealsList.length;
  const totalLikes = squealsList.reduce(
    (acc, squeal) => acc + squeal.emoticonNum.good,
    0
  );
  const totalDislikes = squealsList.reduce(
    (acc, squeal) => acc + squeal.emoticonNum.bad,
    0
  );

  async function handleChangePassword(e){
    e.preventDefault();

    if(!newPassword) return;

    try {
      const res = await axios.post(`/modifyPassword`, {username: user.username, newPassword});
      setUser(res.data);
    } catch (error) {
      console.error(`Errore durante la modifica della password: ${error.message}`);
    }finally{
      setIsEditing(false);
      setNewPassword("");
    }
  }

  return (
    <div className="item-presentation">
      {/* <!-- Prima parte: profile-header (per motivi di riusabilità con la parte che riguarda i canali, 
              si chiama "item"-header. Lo stesso discorso vale per tutte le classNamei che si chiamano "item", 
              per essere generici e riusabili). Contiene foto, username --> */}
      <div className="item-header">
        <div className="img-container">
          <img
            src={user.image}
            alt="Profile picture"
          />
        </div>

        <div className="username">
          <h>@</h>{(user.username)?.split("@")[1]} {!isStandard.current && <i className="fa-solid fa-feather"></i>}
        </div>
      </div>
      {/* <!-- Seconda parte: profile-description. Contiene descrizione, data di iscrizione, luogo e counter di squeals, likes, dislikes --> */}
      <div className="item-description">
        <p>{user.description}</p>
        {isEditing ? (
          <span className="password">
            <i className="fa-solid fa-pen"></i>
            <form
              id="mod-password"
              onSubmit={handleChangePassword}
            >
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                pattern="(?=.*\d)(?=.*[!@#$%^&*]).{8,16}"
              />
            </form>
          </span>
        ) : (
          <span className="password">
            <i
              className={`fa-solid fa-eye${showPassword ? "-slash" : ""}`}
              onClick={() => setShowPassword((cur) => !cur)}
            ></i>
            {showPassword ? (
              user.password
            ) : (
              <>&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;</>
            )}
          </span>
        )}

        <span className="since">
          <i className="fa-solid fa-calendar"></i> {user.year}
        </span>
        {/* <span className="location">
          <i className="fa-solid fa-location-dot"></i> Bologna
        </span> */}

        <ActivityInfo
          totalSqueals={totalSqueals}
          totalLikes={totalLikes}
          totalDislikes={totalDislikes}
        />
      </div>
    </div>
  );
}

function ActivityInfo({ totalSqueals = 0, totalLikes = 0, totalDislikes = 0 }) {
  return (
    <div className="activity-info">
      <div className="num-squeals">
        <strong>{totalSqueals}</strong> Squeals
      </div>
      <div className="num-likes">
        <strong>{totalLikes}</strong> Likes
      </div>
      <div className="num-dislikes">
        <strong>{totalDislikes}</strong> Dislikes
      </div>
    </div>
  );
}

function Squeals({ isStandard, squealsList, onOpenComments, onEmoticonGood, onEmoticonBad}) {
  return (
    <div className="item-squeals">
      <div className="squeals-header">
        <span>Squeals</span>
      </div>
      {squealsList.map((squeal) => (
        <Squeal key={squeal._id} squeal={squeal} isStandard={isStandard} onOpenComments={onOpenComments} onEmoticonGood={onEmoticonGood} onEmoticonBad={onEmoticonBad}/>
      ))}
    </div>
  );
}

function Squeal({ squeal, isStandard, onOpenComments, onEmoticonGood, onEmoticonBad }) {
  return (
    <div
      className="user-post"
      key={squeal._id}
      data-squeal-id={squeal._id}
    >
      <div className="profile-pic">
        <img src={squeal.profilePic} alt="Profile Picture" />
      </div>
      <div className="post-body">
        <div className="post-namedate">
          <span className="post-username">{squeal.mittente} </span>
          {!isStandard.current && <i className="fa-solid fa-feather"></i>}
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
          <div className="post-comments" onClick={() => onOpenComments(squeal._id)}>
            <i className="fa-regular fa-comment"></i>
            <span className="post-comments-number"> {squeal.commentsNum}</span>
          </div>
          <div className="post-likes" onClick={() => onEmoticonGood(squeal)}>
            <i
              className={` ${
                squeal.emoticonGivenBy.good.includes(squeal.mittente) // mittente === username MA SOLO IN QUESTO CASO
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
                squeal.emoticonGivenBy.bad.includes(squeal.mittente)
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
  
  // return (
  //   <div className="user-post" id={squeal._id}>
  //     <div className="profile-pic">
  //       <img src={squeal.profilePic} alt="Profile Picture" />
  //     </div>
  //     <div className="post-body">
  //       <div className="post-namedate">
  //         <span className="post-username">
  //           <h>@</h>
  //           {squeal.mittente}
  //         </span>
  //         {squeal.isPro && <i className="fa-solid fa-feather"></i>}
  //         <span className="post-date"> | {squeal.date}</span>
  //       </div>
  //       <div className="post-content">
  //         {squeal.bodyImage ? (
  //           <img src={squeal.bodyImage} alt="Squeal content" />
  //         ) : (
  //           squeal.text
  //         )}
  //       </div>
  //       <div className="post-reactions">
  //         <div className="post-comments">
  //           <i className="fa-regular fa-comment"></i>
  //           <span className="post-comments-number">
  //             {squeal.commentsNum}
  //           </span>
  //         </div>
  //         <div className="post-likes">
  //           <i className="fa-regular fa-thumbs-up"></i>
  //           <span className="post-likes-number">{squeal.emoticonNum.good}</span>
  //         </div>
  //         <div className="post-dislikes">
  //           <i className="fa-regular fa-thumbs-down"></i>
  //           <span className="post-dislikes-number">
  //             {squeal.emoticonNum.bad}
  //           </span>
  //         </div>
  //         <div className="post-impressions">
  //           <i className="fa-regular fa-eye"></i>
  //           <span className="post-impressions-number">
  //             {squeal.impression}
  //           </span>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
}
