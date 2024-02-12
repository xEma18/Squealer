import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Dovresti importare i file css (servono feed_style.css e style.css, ma penso convenga importarli direttamente in main.jsx)

// Qui come al solito sto definendo un array di manager "finto", sarebbero da prendere dal database. Comunque come test funziona.
const managersList = [
  {
    id: "001",
    userName: "Michele",
    profilePicture:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Let's make you famous 🚀",
  },
  {
    id: "002",
    userName: "Manuel",
    profilePicture:
      "https://plus.unsplash.com/premium_photo-1661374927471-24a90ebd5737?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "On to the next one... ✈️",
  },
  {
    id: "003",
    userName: "Lorenzo",
    profilePicture:
      "https://images.unsplash.com/photo-1601233749202-95d04d5b3c00?q=80&w=2876&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Money baby 💰",
  },
];

export default function SmmList() {
  const navigate = useNavigate();
  const [currentManager, setCurrentManger] = useState(null);
  const [managers, setManagers] = useState(managersList);

  // // //
  // AGGIUNGERE LOGICA SELEZIONE SMM //
  // // //
  // useEffect(
  //   function () {
  //     fetchAvailableManagers();
  //   },
  //   [setManagers]
  // );

  async function fetchAvailableManagers() {
    //...
    setManagers();
  }

  function handleRemoveManager() {
    setManagers((managers) => [...managers, currentManager]);
    setCurrentManger(null);
  }

  function handleSelectManager(selectedManager) {
    setManagers((managers) =>
      managers.filter((manager) => manager.id !== selectedManager.id)
    );

    if (currentManager !== null)
      setManagers((managers) => [...managers, currentManager]);

    setCurrentManger(selectedManager);
  }

  return (
    <>
      {/* <!-- Tasto per tornare al feed --> */}
      <div className="go-back" onClick={() => navigate("/Feed")}>
        <span>
          <i className="fa-solid fa-arrow-left"></i> Feed
        </span>
      </div>

      {/* <!-- SEZIONE 1: Contiene la presentazione, diviso in header e description --> */}
      {currentManager && (
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
            <img src={currentManager.profilePicture} alt="Profile picture" />
          </div>
          <span role="button" id="toggle-btn" onClick={onRemoveManager}>
            Remove <i className="fa-solid fa-plus"></i>
          </span>
          <div className="username">
            <h>@</h>
            {currentManager.userName} <i className="fa-solid fa-feather"></i>
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
          key={manager.id}
          onSelectManager={onSelectManager}
        />
      ))}
    </div>
  );
}

function Manager({ manager, onSelectManager }) {
  return (
    <div className="smm-item" onClick={() => onSelectManager(manager)}>
      <div className="item">
        <div className="item-pic">
          <img src={manager.profilePicture} alt="Profile picture" />
        </div>
        <div className="item-body">
          <div className="item-namedate">
            <span className="item-username">
              <h>@</h>
              {manager.userName}
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
