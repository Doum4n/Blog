import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SharedPost = ({ id, title, image, description }) => {

    const navigate = useNavigate();
    const PostHandler = () => {
        navigate(`/post/${id}`);
    }

    return (
        <div style={{position: 'relative', left: '200px'}}>
            <h1>Shared</h1>
            <div onClick={PostHandler}>
                <img src={image} alt={title} className="img-fluid"/>
                <h2 className="post-title">{title}</h2>
            </div>
        </div>
    );
};

export default SharedPost;
