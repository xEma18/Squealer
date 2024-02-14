import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SmmList() {
  const accountData = JSON.parse(sessionStorage.getItem("accountData"));
  const username = accountData.username;
  const [user, setUser] = useState({});
  const [currentManager, setCurrentManger] = useState({});
  const [managers, setManagers] = useState([]);
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

  // Faccio il fetch dei manager disponibili
  useEffect(
    function () {
      async function fetchAvailableManagers() {
        try{
          const res = await axios.get("/getAvailableManagers");

          setManagers(res.data);
        }catch(error){
          console.error(`Errore nel caricamento dei manager ${error.message}`)
        } 
      }

      fetchAvailableManagers();
    },
    [user]
  );

  // Faccio il fetch del manager attuale dell'utente, se esiste
  useEffect(function(){
    async function fetchCurrentManager(){
      try{
        const res = await axios.get(`/getUserByUsername/${user.manager}`);
        setCurrentManger(res.data);
      }catch(error){
        console.error(`Errore durante il caricamento dell'utente: ${error.message}`);
      }
    }

    if(!user.manager) return setCurrentManger({});

    fetchCurrentManager();
  }, [user])

  

  async function handleRemoveManager() {
    try{
      await axios.post("/removeCurrentVIP", {username: currentManager.username});
      const res = await axios.post("/removeCurrentManager", {username});

      setUser(res.data);
    }catch(error){
      console.error(`Errore nella rimozione del manager ${error.message}`)
    }
  }

  async function handleSelectManager(managerUsername) {
    try{
      await axios.post("/removeCurrentManager", {username});
      await axios.post("/removeCurrentVIP", {username: currentManager.username});

      const res3 = await axios.post("/linkManagerAndVIP", {vipUsername: username, managerUsername});

      setUser(res3.data.vipUser);
      setCurrentManger(res3.data.managerUser);
    }catch(error){
      console.error(`Errore nella selezione del manager ${error.message}`)
    }
  }

  return (
    <>
      {/* <!-- Tasto per tornare al feed --> */}
      <div className="go-back" onClick={() => navigate("/App/Feed")}>
        <span>
          <i className="fa-solid fa-arrow-left"></i> Feed
        </span>
      </div>

      {/* <!-- SEZIONE 1: Contiene la presentazione, diviso in header e description --> */}
      {currentManager._id && (
        <CurrentManager
          currentManager={currentManager}
          onRemoveManager={handleRemoveManager}
        />
      )}

      {/* <!-- SEZIONE 2: contiene la lista degli smm disponibili --> */}
      <AvailableManagers
        managers={managers}
        onSelectManager={handleSelectManager}
      />
    </>
  );
}

function CurrentManager({ currentManager, onRemoveManager }) {
  return (
    <>
      <h2>Current Manager</h2>

      <div className="item-presentation smm-presentation">
        {/* <!-- Prima parte: smm-header, fatto riutilizzando la classe item-header, in comune con user-profile e profile-settings- --> */}
        <div className="item-header smm-header">
          <div className="img-container">
            <img src={currentManager.image} alt="Profile picture" />
          </div>
          <span role="button" id="toggle-btn" onClick={onRemoveManager}>
            Remove <i className="fa-solid fa-plus"></i>
          </span>
          <div className="username">
            <h>@</h>
            {currentManager?.username.split("@")[1]} <i className="fa-solid fa-feather"></i>
          </div>
        </div>
        {/* <!-- Seconda parte: smm-description. Contiene solo la descrizione dell'smm--> */}
        <div className="item-description smm-desription">
          <p>{currentManager.description}</p>
        </div>
      </div>
    </>
  );
}

function AvailableManagers({ managers, onSelectManager }) {
  return (
    <div className="smm-list">
      <h2>Available Managers</h2>
      {managers.map((manager) => (
        <Manager
          manager={manager}
          key={manager._id}
          onSelectManager={onSelectManager}
        />
      ))}
    </div>
  );
}

function Manager({ manager, onSelectManager }) {
  return (
    <div className="smm-item" onClick={() => onSelectManager(manager.username)}>
      <div className="item">
        <div className="item-pic">
          <img src={manager.image} alt="Profile picture" />
        </div>
        <div className="item-body">
          <div className="item-namedate">
            <span className="item-username">
              <h>@</h>
              {manager.username?.split("@")[1]}
            </span>
            <i className="fa-solid fa-feather"></i>
          </div>
          <div className="item-content">{manager.description}</div>
        </div>
      </div>
      <div className="button" id="select-smm-btn" role="button">
        Select
      </div>
    </div>
  );
}
