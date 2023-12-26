import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './feed_style.css';
import '../style.css';
import condorIcon from '../assets/icon_condor.png'



const HostFeed = () => {
    // Component logic and JSX here
    return (
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
          {/* <!-- inizio post --> */}
          <div className="user-post" id="0001">
            <div className="profile-pic">
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Profile Picture"
              />
            </div>
            <div className="post-body">
              <div className="post-namedate">
                <span className="post-username"><h>@</h>Camzz</span>
                <i className="fa-solid fa-feather"></i>
                <span className="post-date"> | Dec 13</span>
              </div>
              <div className="post-content">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis eum eius quod, non ullam rem.
                <img
                  src="https://images.unsplash.com/photo-1604275689235-fdc521556c16?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt=""
                />
              </div>
              <div className="post-reactions">
                <div className="post-comments">
                  <i className="fa-regular fa-comment"></i>
                  <span className="post-comments-number">69</span>
                </div>
                <div className="post-likes">
                  <i className="fa-regular fa-thumbs-up"></i>
                  <span className="post-likes-number">227</span>
                </div>
                <div className="post-dislikes">
                  <i className="fa-regular fa-thumbs-down"></i>
                  <span className="post-dislikes-number">38</span>
                </div>
                <div className="post-impressions">
                  <i className="fa-regular fa-eye"></i>
                  <span className="post-impressions-number">3.148</span>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- fine post --> */}
          {/* <!-- inizio post --> */}
          <div className="user-post" id="0002">
            <div className="profile-pic">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Profile Picture"
              />
            </div>
            <div className="post-body">
              <div className="post-namedate">
                <span className="post-username"><h>@</h>Emrata</span>
                {/*<!-- <i className="fa-solid fa-feather"></i> -->*/}
                <span className="post-date"> | Dec 14</span>
              </div>
              <div className="post-content">
                Vorrei proprio farmi chiavare da un ligure.
              </div>
              <div className="post-reactions">
                <div className="post-comments">
                  <i className="fa-regular fa-comment"></i>
                  <span className="post-comments-number">134</span>
                </div>
                <div className="post-likes">
                  <i className="fa-regular fa-thumbs-up"></i>
                  <span className="post-likes-number">2</span>
                </div>
                <div className="post-dislikes">
                  <i className="fa-regular fa-thumbs-down"></i>
                  <span className="post-dislikes-number">198</span>
                </div>
                <div className="post-impressions">
                  <i className="fa-regular fa-eye"></i>
                  <span className="post-impressions-number">254</span>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- fine post --> */}
          {/* <!-- inizio post --> */}
          <div className="user-post" id="0003">
            <div className="profile-pic">
              <img
                src="https://images.unsplash.com/photo-1584999734482-0361aecad844?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Profile Picture"
              />
            </div>
            <div className="post-body">
              <div className="post-namedate">
                <span className="post-username"><h>@</h>DiGia</span>
                <i className="fa-solid fa-feather"></i>
                <span className="post-date"> | Dec 15</span>
              </div>
              <div className="post-content">
                La nev l'ha sembr fatt... Stetv a la cas.
                <img
                  src="https://static.sky.it/editorialimages/5a52e4808f8e230933693a55e5812d99d34e38cd/skytg24/it/cronaca/2023/01/23/-meteo-neve-oggi-foto/Neve_Norcia.jfif"
                  alt="Snow"
                />
              </div>
              <div className="post-reactions">
                <div className="post-comments">
                  <i className="fa-regular fa-comment"></i>
                  <span className="post-comments-number">13</span>
                </div>
                <div className="post-likes">
                  <i className="fa-regular fa-thumbs-up"></i>
                  <span className="post-likes-number">1.543</span>
                </div>
                <div className="post-dislikes">
                  <i className="fa-regular fa-thumbs-down"></i>
                  <span className="post-dislikes-number">12</span>
                </div>
                <div className="post-impressions">
                  <i className="fa-regular fa-eye"></i>
                  <span className="post-impressions-number">9.008</span>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- fine post --> */}
        </div>
        <div className="footer"></div>
        </div>
          </div>
      </div>
    );
};

export default HostFeed;
