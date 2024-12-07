import {Carousel, Col, Container, Form, Image, Row} from "react-bootstrap";
import {useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import Button from "@mui/material/Button";
import {Box, Divider, Modal} from "@mui/material";
import SubComment from "./component/subcoment.jsx";
import Comment from "./component/comment.jsx";
import {auth} from "../../config/firebase.js";
import * as React from "react";
import banner from "../../assets/banner.png";

const Status = () => {
    const [status, setStatus] = useState({});
    const [comments, setComments] = useState([]);
    const [userId, setUserId] = useState({});
    // const [load]

    const {id} = useParams()

    useEffect(() => {
        try {
            auth.onAuthStateChanged(function (user) {
                if (user) {
                    setUserId(user.uid);
                }
            });
        } catch (err) {
            console.error(err);
        };
    });

    useEffect(() => {
        fetch(`http://0.0.0.0/status/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setStatus(data);
                setLikes(data.likes);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }, []);

    useEffect(() => {
        fetch(`http://0.0.0.0/get/commentByStatusId/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setComments(data);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }, []);

    const [comment, setComment] = useState(null);

    const commentChange = (e) => {
        setComment(e.target.value);
    }

    const postComment = async () => {
        await fetch(`http://0.0.0.0/comment/create`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    id: id,
                    content: comment,
                    parent_id: null,
                    type: "status"
                })
            }
        )
            .then(response => {
                if (!response.ok) {
                    throw new Error("Cant post this comment!")
                }
                return response.json();
            }).then(data => {
                console.log(data);
            }).catch(err => {
                console.error(err);
            });
    }

    const Interact = async (interact) => {
        await fetch(`http://0.0.0.0/interaction`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status_id: id,
                post_id: null,
                user_id: userId,
                action: interact,
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Cant update interaction!")
                }
                return response.json();
            }).then(data => {
                console.log(data.success);
            });
    }

    const [likes, setLikes] = useState();

    const like = async () => {
        await fetch(`http://0.0.0.0/status/${id}/like`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Cant like this post!")
                }
                setLikes(prevLikes => prevLikes + 1);
            });
        Interact('like');
    }

    const imagePaths = status.image_paths ? status.image_paths.split(',') : [];

    return (
        <Container>
            <Row>
                <Col className="bg-dark d-flex flex-row align-items-center justify-content-center overflow-x-auto">
                    <Carousel data-bs-theme="dark">
                    {imagePaths.map((path) => (
                            <Carousel.Item key={path}>
                                <img src={path} style={{height: '100%'}}/>
                            </Carousel.Item>
                    ))}
                    </Carousel>
                </Col>
                <Col className="bg-secondary-subtle p-4" style={{overflowY: "auto"}}>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <div>
                            <Image src={status.avatar} roundedCircle style={{ width: '50px', height: '50px', marginBottom: '10px', marginRight: '10px' }} />
                        </div>
                        <div style={{display: "flex", flexDirection: "column"}}>
                            {status.user_name}
                            <br/>
                            {new Date(status.created_at).toLocaleString()}
                        </div>
                    </div>

                    <br/>
                    {status.content}
                    <br/>
                    {likes}
                    <Divider />
                    <div style={{display: "flex", gap: "10px", marginTop: "10px", marginBottom: "10px"}}>
                        <Button variant={"contained"} onClick={() => like()}>like</Button>
                        <Button variant={"contained"}>Comment</Button>
                    </div>
                    <Divider/>
                    <Form className="mt-3" id="comment">
                        <Form.Group>
                            <Form.Control as="textarea" rows={3} placeholder="Comment..." onChange={commentChange}></Form.Control>
                        </Form.Group>
                        <div className="d-flex justify-content-end mt-3">
                            <Button variant="contained" onClick={postComment}>Send</Button>
                        </div>
                    </Form>
                    {comments.map((comment) => (
                        <div key={comment.id}>
                            {comment.parent_id === null ? (
                                <Comment
                                    updated_at={comment.updated_at}
                                    nameUser={comment.user_name}
                                    ImageSrc={comment.avatar}
                                    comment={comment.content}
                                    id={comment.id}
                                    type="status"
                                />
                            ) : null}
                            {comment.children.length > 0 ? (
                                comment.children.map((childComment) => (
                                    <div style={{ marginLeft: '70px' }}>
                                        <Comment
                                            updated_at={childComment.updated_at}
                                            nameUser={childComment.user_name}
                                            ImageSrc={childComment.avatar}
                                            comment={childComment.content}
                                            id={childComment.id}
                                            type="status"
                                        />
                                    </div>
                                ))
                            ) : null}
                        </div>
                    ))}
                </Col>
            </Row>
        </Container>
    )
}

export default Status;