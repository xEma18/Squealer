import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Componenti ausiliari per organizzare la visualizzazione
const UserItem = ({ user }) => (
    <div className="item" key={user.username}>
        <div className="item-pic">
            <img src={user.image} alt="Profile picture" />
        </div>
        <div className="item-body">
            <div className="item-namedate">
                <span className="item-username">{user.username}</span>
                {user.tipoUtente === "PRO" ? <i className="fa-solid fa-feather"></i> : ""}
            </div>
            <div className="item-description">
                {user.description}
            </div>
        </div>
    </div>
);

const ChannelItem = ({ channel }) => (
    <div className="item" key={channel.name}>
        <div className="item-pic">
            <img src={channel.profilePic} alt="Profile picture" />
        </div>
        <div className="item-body">
            <div className="item-namedate">
                <span className="item-username">{channel.name}</span>
            </div>
            <div className="item-description">
                {channel.description}
            </div>
        </div>
    </div>
);

const KeywordItem = ({ keywordObj }) => (
    <div className="item" key={keywordObj.keyword}>
        <div className="item-pic">
            <img src="https://plus.unsplash.com/premium_photo-1681487872232-fa622a6dd59e?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Profile picture" />
        </div>
        <div className="item-body">
            <div className="item-namedate">
                <span className="item-username">{keywordObj.keyword}</span>
            </div>
            <div className="item-description">{keywordObj.count} squeals</div>
        </div>
    </div>
);

const Search = () => {
    const savedData = sessionStorage.getItem("accountData");
    const accountData = JSON.parse(savedData);
    const username = accountData.username;
    const [profilePic, setProfilePic] = useState("");
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState({ users: [], channels: [], keywords: [] });

    useEffect(() => {
        const fetchProfilePic = async () => {
            try {
                const response = await axios.post(`http://localhost:3001/profilePicByUsername`, { username });
                setProfilePic(response.data.image);
            } catch (error) {
                console.error('Errore durante il recupero dell\'immagine del profilo:', error);
            }
        };
        fetchProfilePic();
    }, [username]);

    useEffect(() => {
        const fetchData = async () => {
            if (searchTerm) {
                try {
                    const response = await axios.post('http://localhost:3001/search', { searchTerm, username });
                    setSearchResults(response.data);
                } catch (error) {
                    console.error('Errore durante la ricerca:', error);
                }
            }
        };
        fetchData();
    }, [searchTerm]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchTerm(e.target.value);
    };

    return (
        <div>
            <div className="go-back">
                <Link to="/Feed"><span><i className="fa-solid fa-arrow-left"></i> Feed</span></Link>
            </div>
            <form id="search-form">
                <img src={profilePic} alt="Profile picture" />
                <input type="text" placeholder="Search" onChange={handleSearch} />
                <i className="fa-solid fa-magnifying-glass"></i>
            </form>

            {searchTerm.startsWith('@') && (
                <div className="users-list">
                    <h2>Users</h2>
                    {searchResults.users.map(user => <UserItem key={user.username }user={user} />)}
                </div>
            )}

            {searchTerm.startsWith('§') && (
                <div className="channels-list">
                    <h2>Channels</h2>
                    {searchResults.channels.map(channel => <ChannelItem key={channel.name} channel={channel} />)}
                </div>
            )}

            {searchTerm.startsWith('#') && (
                <div className="keywords-list">
                    <h2>Keywords</h2>
                    {searchResults.keywords.map((keywordObj, index) => <KeywordItem key={index} keywordObj={keywordObj} />)}
                </div>
            )}
        </div>
    );
};

export default Search;
