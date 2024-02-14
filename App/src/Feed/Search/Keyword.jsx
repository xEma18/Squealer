import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import BackButton from './components/BackButton';

const Keyword = () => {
    const { keyword } = useParams();
    const [keywordSqueals, setKeywordSqueals] = useState([]);

    useEffect(() => {
        fetchKeywordSqueals();
    }, [keyword]);

    const fetchKeywordSqueals = async () => {
        try {
            const response = await axios.get(`/getPublicSquealsByKeyword/${keyword}`);
            setKeywordSqueals(response.data);
        } catch (error) {
            console.error('Errore durante il recupero degli squeals per la keyword:', error);
        }
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
            <div className="squeals-header"><span>#{keyword}</span></div>
            <div className="squeals-list">
                {keywordSqueals.map(squeal => (
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

    return (
        <div>
            <BackButton />
            <UserSqueals />
        </div>
    );
};

export default Keyword;