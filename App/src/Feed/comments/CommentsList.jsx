import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

// Come faccio a passare lo squeal dal Feed a questa schermata
export default function CommentsList() {
  const navigate = useNavigate();
  const [queryParams] = useSearchParams();
  const [comment, setComment] = useState("");
  const [squealComments, setSquealComments] = useState([]);
  const accountData = JSON.parse(sessionStorage.getItem("accountData"));

  // Appena carica la pagina, faccio un fetch dei commenti salvati nel database
  useEffect(function(){
    async function fetchComments(){
      const squealId = queryParams.get("squeal_id");
      if(!squealId) return;

      try{
        // Logica per fetchare commenti dal database
        const res = await axios.get(`http://localhost:3001/squealComments/${squealId}`);

        setSquealComments(res.data);
      }catch(error){
        console.error(`Errore durante il caricamento dei commento ${error.message}`)
      }
    }

    fetchComments();
  }, [queryParams])

  async function handleAddComment(e){
    e.preventDefault();

    const squealId = queryParams.get("squeal_id");

    if(!comment) return;

    try{
      const res = await axios.post("http://localhost:3001/profilePicByUsername", {username: accountData.username});

      const newComment = {
        _id: crypto.randomUUID(),
        mittente: accountData.username,
        text: comment,
        date: Date.now(), 
        profilePic: res.data.image,
      }
  
      setSquealComments(current => [...current, newComment]);

      await axios.post(`http://localhost:3001/squealComments`, {squealId, comment: newComment});
    }catch(error){
      console.error(`Errore durante la pubblicazione del commento ${error.message}`);
    }

    setComment("");
  }

  function handleGoBack(){
    const location = queryParams.get("back") || "Feed";
    navigate(`/App/${location}`)
  }

  return (
    <div className="comments-container"> 
      <div className="go-back" onClick={handleGoBack}>
        <span>
          <i className="fa-solid fa-arrow-left"></i> Feed
        </span>
      </div>

      <div className="comments-list">
        {squealComments.map((comment) => (
          <Comment comment={comment} key={comment._id} />
        ))}
      </div>
      <TypeBar comment={comment} setComment={setComment} onAddComment={handleAddComment}/>
    </div>
  );
}

function Comment({ comment }) {
  // Dato uno squeal, verifica se il mittente è standard o meno  
  const [isStandard, setIsStandard] = useState(true);

  useEffect(function(){
    async function getUserType(){
      try{
        const res = await axios.get(`http://localhost:3001/getUserTypeByUsername/${comment.mittente}`);
        setIsStandard(res.data === "Standard" ? true : false);
      }catch(error){
        console.error(`Errore durante il caricamento del tipo: ${error.message}`);
      }
    }
    getUserType();
  }, [comment]);

  return (
    // prettierignore
    <div className="item">
      <div className="item-pic">
        <img src={comment.profilePic} alt="Profile picture" />
      </div>
      <div className="item-body">
        <div className="item-namedate">
          <span className="item-username">
            <h>@</h>
            {comment.mittente.split("@").at(1)}
          </span> {!isStandard && <i className="fa-solid fa-feather"></i>}
          <span className="item-date"> | {new Date(comment.date).toDateString()}</span>
        </div>
        <div className="item-content">{comment.text}</div>
      </div>
    </div>
  );
}

function TypeBar({comment, setComment, onAddComment}){
  return (
    <form className="write-comment" onSubmit={onAddComment}>
        <input type="text" value={comment} onChange={e => setComment(e.target.value)}/>
        <i role="button" className="fa-solid fa-paper-plane" onClick={onAddComment}></i>
    </form>)
}