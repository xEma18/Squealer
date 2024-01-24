import { useState } from "react";
import "../Feed/feed_style.css";
import "../style.css";

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const squealsList = [
    {
      id: 1,
      profilePicture:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      userName: "Camzz",
      isPro: true,
      squealDate: "Dec 13",
      squealContent:
        "https://images.unsplash.com/photo-1604275689235-fdc521556c16?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      isImage: true,
      squealComments: "69",
      squealLikes: "121",
      squealDislikes: "21",
      squealImpressions: "3222",
    },
  ];

  function handleShowEdit() {
    setIsEditing((cur) => !cur);
  }

  function handleSubmitPassword(newPassword) {
    // Qui si dovrebbe validare la password inserita e aggiornare il profilo utente di conseguenza.
    setIsEditing(false);
  }

  return (
    <>
      <Utilities isEditing={isEditing} onShowEdit={handleShowEdit} />

      {/* // <!-- SEZIONE 1: Contiene la presentazione, diviso in header e description --> */}
      <Presentation
        isEditing={isEditing}
        onSubmitPassword={handleSubmitPassword}
        squealsList={squealsList}
      />

      {/* <!-- SEZIONE 2: Raccolta degli squeals dell'user. Organizzato esattamente come il feed --> */}
      <Squeals squealsList={squealsList} />
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

function Utilities({ isEditing, onShowEdit }) {
  return (
    <div className="utilities">
      <div className="go-back">
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

function Presentation({ isEditing, onSubmitPassword, squealsList }) {
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const totalSqueals = squealsList.length;
  const totalLikes = squealsList.reduce(
    (acc, squeal) => acc + squeal.squealLikes,
    0
  );
  const totalDislikes = squealsList.reduce(
    (acc, squeal) => acc + squeal.squealDisLikes,
    0
  );

  return (
    <div className="item-presentation">
      {/* <!-- Prima parte: profile-header (per motivi di riusabilità con la parte che riguarda i canali, 
              si chiama "item"-header. Lo stesso discorso vale per tutte le classNamei che si chiamano "item", 
              per essere generici e riusabili). Contiene foto, username --> */}
      <div className="item-header">
        <div className="img-container">
          <img
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Profile picture"
          />
        </div>

        <div className="username">
          <h>@</h>Camzz <i className="fa-solid fa-feather"></i>
        </div>
      </div>
      {/* <!-- Seconda parte: profile-description. Contiene descrizione, data di iscrizione, luogo e counter di squeals, likes, dislikes --> */}
      <div className="item-description">
        <p>
          Lorem ipsum dolor, sit amet consectetur adasd elit. Modi fuga, facere
          ab nobis veniam corporis et labore dicta ut officia earum autem
          laboriosam provident ipsa eum numquam atque vitae mollitia!
        </p>
        {isEditing ? (
          <span className="password">
            <i className="fa-solid fa-pen"></i>
            <form
              id="mod-password"
              onSubmit={(e) => {
                e.preventDefault();
                onSubmitPassword(newPassword);
              }}
            >
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
              "ForzaInter10"
            ) : (
              <>&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;</>
            )}
          </span>
        )}

        <span className="since">
          <i className="fa-solid fa-calendar"></i> Since 2023
        </span>
        <span className="location">
          <i className="fa-solid fa-location-dot"></i> Bologna
        </span>

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

function Squeals({ squealsList }) {
  return (
    <div className="item-squeals">
      <div className="squeals-header">
        <span>Squeals</span>
      </div>
      {squealsList.map((squeal) => (
        <Squeal key={squeal.id} squeal={squeal} />
      ))}
    </div>
  );
}

function Squeal({ squeal }) {
  return (
    <div className="user-post" id={squeal.id}>
      <div className="profile-pic">
        <img src={squeal.profilePicture} alt="Profile Picture" />
      </div>
      <div className="post-body">
        <div className="post-namedate">
          <span className="post-username">
            <h>@</h>
            {squeal.userName}
          </span>
          {squeal.isPro && <i className="fa-solid fa-feather"></i>}
          <span className="post-date"> | {squeal.squealDate}</span>
        </div>
        <div className="post-content">
          {squeal.isImage ? (
            <img src={squeal.squealContent} alt="Squeal content" />
          ) : (
            squeal.squealContent
          )}
        </div>
        <div className="post-reactions">
          <div className="post-comments">
            <i className="fa-regular fa-comment"></i>
            <span className="post-comments-number">
              {squeal.squealComments}
            </span>
          </div>
          <div className="post-likes">
            <i className="fa-regular fa-thumbs-up"></i>
            <span className="post-likes-number">{squeal.squealLikes}</span>
          </div>
          <div className="post-dislikes">
            <i className="fa-regular fa-thumbs-down"></i>
            <span className="post-dislikes-number">
              {squeal.squealDislikes}
            </span>
          </div>
          <div className="post-impressions">
            <i className="fa-regular fa-eye"></i>
            <span className="post-impressions-number">
              {squeal.squealImpressions}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
