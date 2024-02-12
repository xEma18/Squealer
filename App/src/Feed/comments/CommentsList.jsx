import { useNavigate } from "react-router-dom";

export default function CommentsList({ post }) {
  const navigate = useNavigate();
  // postComments è vuoto ma è dove andrebbero salvati i commenti del post.
  // Qui ci va tutta la parte di logica per fetchare i commenti di un determinato post
  const postComments = [];

  return (
    <div className="comments-container"> 
      <div className="go-back" onClick={() => navigate("/Feed")}>
        <span>
          <i className="fa-solid fa-arrow-left"></i> Feed
        </span>
      </div>

      <div className="comments-list">
        {postComments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </div>
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
