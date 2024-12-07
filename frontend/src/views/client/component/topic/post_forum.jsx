import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Col, Row } from 'react-bootstrap';

const PostTopic = ({ id, title, image, content }) => {

    const navigate = useNavigate();
    const PostHandler = () => {
        navigate(`/post/${id}`);
    }

    const description = content ? content.slice(0, 20) : "No content available";
    return (
        <Row onClick={PostHandler} className='my-4'>
            <Col md={4}>
                <img src={image} alt={title} className="img-fluid"/>
            </Col>
            <Col>
                <h2 className="post-title">{title}</h2>
                <p className="post-description">{description}...</p>
            </Col>
        </Row>
    );
};

export default PostTopic;
