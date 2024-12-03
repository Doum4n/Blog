import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Col, Row } from 'react-bootstrap';

const MostViewPost = ({ id, title, image }) => {

    const navigate = useNavigate();
    const PostHandler = () => {
        navigate(`/post/${id}`);
    }

    return (
        <div onClick={PostHandler} className='my-3'>
            <Row>
                <hr/>
                <Col md={6}>
                    <p className="post-title">{title}</p>
                </Col>
                <Col>
                    <img src={image} alt='image' className="img-fluid" style={{width: '100%'}}/>
                </Col>
            </Row>
        </div>
    );
};

export default MostViewPost;
