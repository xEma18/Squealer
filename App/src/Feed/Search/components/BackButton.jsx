import {Link } from 'react-router-dom';

const BackButton = () => (
    <Link to="/Feed/Search">
        <div className="go-back">
            <span><i className="fa-solid fa-arrow-left"></i> Search</span>
        </div>
    </Link>
);

export default BackButton;