import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Post = ({ id, title, image, content }) => {
    const navigate = useNavigate();

    const description = content ? content.slice(0, 20) : "No content available";
    return (
        <div onClick={() => navigate(`/post/${id}`)}>
            <img src={image} alt={title} className="img-fluid"/>
            <h2 className="post-title">{title}</h2>
            <p className="post-description">{description}</p>
        </div>
    );
};

export default Post;
