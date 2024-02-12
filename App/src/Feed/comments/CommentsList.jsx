import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Come faccio a passare lo squeal dal Feed a questa schermata
export default function CommentsList({ post }) {
  const navigate = useNavigate();
  const [comment, setComment] = useState(null);
  const [squealComments, setSquealComments] = useState([]);
  // squealComments è dove andrebbero salvati i commenti del post.

  // Appena carica la pagina, faccio un fetch dei commenti salvati nel database
  useEffect(function(){
    async function fetchComments(){
      try{
        // Logica per fetchare commenti dal database
        // setSquealComments(commenti fetchati)
      }catch(error){
        console.error(`Errore durante il caricamento dei commento ${error.message}`)
      }
    }
    fetchComments();
  }, [])

  async function handleAddComment(e){
    e.preventDefault();

    if(!comment) return;

    setSquealComments(current => [...current, comment]);

    try{
      // Logica per salvare il nuovo commento nel database
    }catch(error){
      console.error(`Errore durante la pubblicazione del commento ${error.message}`);
    }
  }

  return (
    <div className="comments-container"> 
      <div className="go-back" onClick={() => navigate("/Feed")}>
        <span>
          <i className="fa-solid fa-arrow-left"></i> Feed
        </span>
      </div>

      <div className="comments-list">
        {squealComments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </div>
      <TypeBar comment={comment} setComment={setComment} onAddComment={handleAddComment}/>
    </div>
  );
}

function Comment({ comment }) {
  return (
    // prettierignore
    <div className="item">
      <div className="item-pic">
        <img src={comment.userPicture} alt="Profile picture" />
      </div>
      <div className="item-body">
        <div className="item-namedate">
          <span className="item-username">
            <h>@</h>
            {comment.username}
          </span>
          <i className="fa-solid fa-feather"></i>
          <span className="item-date"> | {comment.date}</span>
        </div>
        <div className="item-content">{comment.commentBody}</div>
      </div>
    </div>
  );
}

function TypeBar({comment, setComment, onAddComment}){
  return (
    <form className="write-comment" onSubmit={onAddComment}>
        <input type="text" value={comment} onChange={e => setComment(e.target.value)}/>
        <i className="fa-solid fa-paper-plane"></i>
    </form>)
}