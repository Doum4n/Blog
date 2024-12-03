import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Post = ({ id, title, image, description, likes, comments }) => {

    const navigate = useNavigate();
    const PostHandler = () => {
        navigate(`/post/${id}`);
    }

    const summary = description ? description.slice(0, 40) + "..." : "No content available";

    return (
        <div onClick={PostHandler} style={{position: 'relative', border: 'thin solid', padding: '10px', borderRadius: '10px'}}>
            <h2 className="post-title">{title}</h2>
            <img src={image} alt='image' className="img-fluid" style={{width: '200px'}}/>
            <div dangerouslySetInnerHTML={{ __html: summary }} />
            <p>likes: <b>{likes}</b> comments: <b>{comments}</b></p>
        </div>
    );
};

export default Post;
