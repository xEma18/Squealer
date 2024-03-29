import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import L from 'leaflet'; 
import BackButton from './components/BackButton';

const ChannelProfile = () => {
    const savedData = sessionStorage.getItem("accountData");
    const accountData = JSON.parse(savedData);
    const username = accountData.username;
    const { channelName } = useParams();
    const [userData, setUserData] = useState(null);
    const [userSqueals, setUserSqueals] = useState([]);
    const [userActivity, setUserActivity] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        fetchUserData();
        fetchUserPublicSqueals();
        fetchChannelActivity();
    }, [channelName]);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`/getChannelByChannelName/${channelName}`);
            setUserData(response.data);

            const followResponse = await axios.post(`/isUserFollowingChannel`, {
            username,
            channelName
        });
        setIsFollowing(followResponse.data.isUserFollowing);
        } catch (error) {
            console.error('Errore durante il recupero dei dati utente:', error);
        }
    };

    const followChannel = async () => {
        try {
            const response = await axios.post(`/followChannel`, { username: username, channelName: channelName });
            setIsFollowing(true);
        } catch (error) {
            console.error('Errore durante il follow del canale:', error);
        }
    };

    const unfollowChannel = async () => {
        try {
            const response = await axios.post(`/unfollowChannel`, { username: username, channelName: channelName });
            setIsFollowing(false);
        } catch (error) {
            console.error('Errore durante l\'unfollow del canale:', error);
        }
    };

    const fetchUserPublicSqueals = async () => {
        if(channelName === "§RANDOM") {
            try {
                const response = await axios.get(`/randomSqueals`);
                setUserSqueals(response.data);
            } catch (error) {
                console.error('Errore durante il recupero degli squeals del canale:', error);
            }
            return;
        }
        try {
            // Assumendo che esista un endpoint `/squealsByChannelName` che accetta il nome del canale e ritorna gli squeal associati
            const response = await axios.get(`/squealsByChannelName/${channelName}`);
            setUserSqueals(response.data);
        } catch (error) {
            console.error('Errore durante il recupero degli squeals del canale:', error);
        }
    };


    const fetchChannelActivity = async () => {
        try {
            const response = await axios.get(`/getChannelActivity/${channelName}`);
            console.log(response.data);
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
        
        return (
            <div className="item-presentation">
                <div className="item-header">
                    <div className="img-container">
                        <img src={userData.profilePic} alt="Profile picture" />
                    </div>
                    {channelName !== "§RANDOM" && (isFollowing ? (
                    <span role="button" onClick={unfollowChannel} className="follow-btn">Unfollow <i className="fa-solid fa-minus"></i></span>
                    ) : (
                        <span role="button" onClick={followChannel} className="follow-btn">Follow <i className="fa-solid fa-plus"></i></span>
                    ))}
                    <div className="username">
                        {userData.name}
                    </div>
                </div>
                <div className="item-description">
                    <p>{userData.description}</p>
                    {channelName!=="§RANDOM"?<div className="activity-info">
                        <div className="num-squeals"><strong>{userActivity.squeals}</strong> Squeals</div>
                        <div className="num-likes"><strong>{userActivity.likes}</strong> Likes</div>
                        <div className="num-dislikes"><strong>{userActivity.dislikes}</strong> Dislikes</div>
                    </div>:<div></div>}
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
    );;
};

export default ChannelProfile;