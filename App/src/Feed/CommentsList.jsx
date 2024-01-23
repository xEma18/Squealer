// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import "./feed_style.css";
// import "../style.css";

export default function CommentsList({ post }) {
  // postComments è vuoto ma è dove andrebbero salvati i commenti del post.
  // Qui ci va tutta la parte di logica per fetchare i commenti di un determinato post
  const postComments = [];

  return (
    <div class="comments-container">
      <div class="go-back">
        <span>
          <i class="fa-solid fa-arrow-left"></i> Feed
        </span>
      </div>

      <div class="comments-list">
        {postComments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </div>
    </div>
  );
}

function Comment({ comment }) {
  return (
    <div class="item">
      <div class="item-pic">
        <img src={comment.userPicture} alt="Profile picture" />
      </div>
      <div class="item-body">
        <div class="item-namedate">
          <span class="item-username">
            <h>@</h>
            {comment.username}
          </span>
          <i class="fa-solid fa-feather"></i>
          <span class="item-date"> | {comment.date}</span>
        </div>
        <div class="item-content">{comment.commentBody}</div>
      </div>
    </div>
  );
}
