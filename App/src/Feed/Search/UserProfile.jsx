import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import L from 'leaflet'; 
import BackButton from './components/BackButton';

const UserProfile = () => {
    const { username } = useParams();
    const [userData, setUserData] = useState(null);
    const [userSqueals, setUserSqueals] = useState([]);
    const [userActivity, setUserActivity] = useState([]);

    useEffect(() => {
        fetchUserData();
        fetchUserSqueals();
        fetchUserActivity();
    }, [username]);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/getUserByUsername/${username}`);
            setUserData(response.data);
        } catch (error) {
            console.error('Errore durante il recupero dei dati utente:', error);
        }
    };

    const fetchUserSqueals = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/getPublicSquealsBySender/${username}`);
            setUserSqueals(response.data);
        } catch (error) {
            console.error('Errore durante il recupero degli squeals dell\'utente:', error);
        }
    };

    const fetchUserActivity = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/getUserActivity/${username}`);
            setUserActivity(response.data);
        } catch (error) {
            console.error('Errore durante il recupero dei dati utente:', error);
        }
    };

    useEffect(() => {
        initializeMaps();
    }, [userSqueals]);

    const initializeMaps = () => {
        userSqueals.forEach(squeal => {
            if (squeal.mapLocation) {
                createMapForSqueal(squeal);
            }
        });
    };

    const createMapForSqueal = (squeal) => {
        const mapId = `map-${squeal._id}`;
        const container = document.getElementById(mapId);

        if (container && !container._leaflet_id) {
            const map = L.map(mapId, {zoomControl: false, attributionControl: false}).setView([squeal.mapLocation.lat, squeal.mapLocation.lng], squeal.mapLocation.zoom);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            L.marker([squeal.mapLocation.lat, squeal.mapLocation.lng]).addTo(map).bindPopup('Sei qui!');
        }
    };


    const UserPresentation = () => {
        const formattedDate = userData ? `${userData.day}/${userData.month}/${userData.year}` : '';
        return (
            <div className="item-presentation">
                <div className="item-header">
                    <div className="img-container">
                        <img src={userData.image} alt="Profile picture" />
                    </div>
                    <div className="username">
                        {userData.username} {userData.proCheck ? <i className="fa-solid fa-feather"></i> : ""}
                    </div>
                </div>
                <div className="item-description">
                    <p>{userData.description}</p>
                    <span className="since"><i className="fa-solid fa-calendar"></i> Since {formattedDate}</span>
                    <div className="activity-info">
                        <div className="num-squeals"><strong>{userActivity.squeals}</strong> Squeals</div>
                        <div className="num-likes"><strong>{userActivity.likes}</strong> Likes</div>
                        <div className="num-dislikes"><strong>{userActivity.dislikes}</strong> Dislikes</div>
                    </div>
                </div>
            </div>
        );
    };

    const SquealReactions = ({ squeal }) => (
        <div className="post-reactions">
            <div className="post-comments">
                <i className="fa-regular fa-comment"></i>
                <span className="post-comments-number"> {squeal.commentsNum}</span>
            </div>
            <div className="post-likes">
                <i className="fa-regular fa-thumbs-up"></i>
                <span className="post-likes-number"> {squeal.emoticonNum.good}</span>
            </div>
            <div className="post-dislikes">
                <i className="fa-regular fa-thumbs-down"></i>
                <span className="post-dislikes-number"> {squeal.emoticonNum.bad}</span>
            </div>
            {squeal.category !== 'private' && (
                <div className="post-impressions">
                    <i className="fa-regular fa-eye"></i>
                    <span className="post-impressions-number"> {squeal.impression}</span>
                </div>
            )}
        </div>
    );

    const isBase64 = (data) => {
        return data.startsWith('data:');
      };
      
      const isBase64Image = (data) => {
        return data.startsWith('data:image/');
      };
      
      const isBase64Video = (data) => {
        return data.startsWith('data:video/');
      };
    
      const renderMedia = (data) => {
        if (isBase64(data)) {
          // If it's a base64-encoded data
          if (isBase64Image(data)) {
            return <img src={data} alt="Media content" style={{ maxWidth: '100%', maxHeight: '400px' }} />;
          } else if (isBase64Video(data)) {
            return <video controls src={data} style={{ maxWidth: '100%', maxHeight: '400px' }} />;
          }
        } 
        else {
            return <img src={data} alt="Media content" style={{ maxWidth: '100%', maxHeight: '400px' }} />;
        }
    };

    const UserSqueals = () => (
        <div className="item-squeals">
            <div className="squeals-header"><span>Squeals</span></div>
            <div className="squeals-list">
                {userSqueals.map(squeal => (
                    <div className="user-post" key={squeal._id}>
                        <div className="profile-pic">
                            <img src={squeal.profilePic} alt="Profile Picture" />
                        </div>
                        <div className="post-body">
                            <div className="post-namedate">
                                <span className="post-username">{squeal.mittente}</span>
                                <span className="post-date"> | {new Date(squeal.date).toLocaleDateString()}</span>
                            </div>
                            <div className="post-content">
                                {squeal.text}
                                {squeal.bodyImage && renderMedia(squeal.bodyImage)}
                                {squeal.mapLocation && (
                                    <div id={`map-${squeal._id}`} style={{ height: '200px', width: '100%' }}></div>
                                )}
                            </div>
                            <SquealReactions squeal={squeal} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    if (!userData) {
        return <div>Caricamento...</div>;
    }

    return (
        <div>
            <BackButton />
            <UserPresentation />
            <UserSqueals />
        </div>
    );
};

export default UserProfile;
