import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import L from 'leaflet'; 
import BackButton from './components/BackButton';

const ChannelProfile = () => {
    const { channelName } = useParams();
    const [userData, setUserData] = useState(null);
    const [userSqueals, setUserSqueals] = useState([]);
    const [userActivity, setUserActivity] = useState([]);

    useEffect(() => {
        fetchUserData();
        fetchUserPublicSqueals();
        fetchUserActivity();
    }, [channelName]);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/getChannelByChannelName/${channelName}`);
            setUserData(response.data);
        } catch (error) {
            console.error('Errore durante il recupero dei dati utente:', error);
        }
    };

    const fetchUserPublicSqueals = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/getPublicSquealsBySender/${channelName}`);
            setUserSqueals(response.data);
        } catch (error) {
            console.error('Errore durante il recupero degli squeals dell\'utente:', error);
        }
    };

    const fetchUserActivity = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/getUserActivity/${channelName}`);
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
                    <div className="username">
                        {userData.name}
                    </div>
                </div>
                <div className="item-description">
                    <p>{userData.description}</p>
                    <div className="activity-info">
                        <div className="num-squeals"><strong>{userActivity.squeals}</strong> Squeals</div>
                        <div className="num-likes"><strong>{userActivity.likes}</strong> Likes</div>
                        <div className="num-dislikes"><strong>{userActivity.dislikes}</strong> Dislikes</div>
                    </div>
                </div>
            </div>
        );
        console.log(userData);
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
                                {squeal.bodyImage && (
                                    <img src={squeal.bodyImage} alt="" />
                                )}
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