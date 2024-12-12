import {Col, Container, Form, Row} from "react-bootstrap";
import {useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {Chip, Divider, Menu, MenuItem, Modal, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import Comment from "./comment.jsx";
import * as React from "react";
import {auth} from "../../../config/firebase.js";
import PostsByTopic from "../PostsByTopic.jsx";

const Topic = () => {
    const [topic, setTopic] = useState({});
    const [comments, setComments] = useState([]);
    const [recentTopics, setRecentTopics] = useState([]);
    const FormRef = useRef(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    let [tags, setTags] = useState([]);

    const FormTags = useRef(null);

    const {id} = useParams();

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
        const fetchData = async () => {
            try {
                const [topicRes, commentRes, recentTopicsRes] = await Promise.all([
                    fetch(`http://0.0.0.0/topic/${id}`),
                    fetch(`http://0.0.0.0/comments/topic/${id}`),
                    fetch('http://0.0.0.0/topics/recent')
                ]);

                const [topicData, commentData, recentTopicsData] = await Promise.all([
                    topicRes.json(),
                    commentRes.json(),
                    recentTopicsRes.json()
                ]);

                setTopic(topicData);
                setComments(commentData);
                setRecentTopics(recentTopicsData);
                setLoading(false);

                // console.table(topicData);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

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
                    content: FormRef.current.elements.comment.value,
                    parent_id: null,
                    type: "topic",
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

    const onFollow_Click = () => {
        fetch(`http://0.0.0.0/follow`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id : userId,
                topic_id : id,
                type: "group",
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onEditTags_Click = () => {
        fetch('http://0.0.0.0/topic/tags/update/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                topic_id: id,
                tag_name: FormTags.current.elements.tags.value,
            })
        }).then(response => {
            if (!response.ok) throw new Error('Cant delete post');
            return response.json();
        })
            .then(data => {
                console.log(data);
            })
            .catch(error => console.error('There was a problem with the fetch operation:', error));
    }

    const onDeleteTags_Click = () => {
        fetch('http://0.0.0.0/topics/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                topics: [id],
            })
        }).then(response => {
            if (!response.ok) throw new Error('Cant delete post');
            return response.json();
        })
            .then(data => {
                console.log('deleted');
            })
            .catch(error => console.error('There was a problem with the fetch operation:', error));
    }

    const [showChoseTags, setShowChoseTags] = useState(false);
    const handleChoseTagsOpen = () => setShowChoseTags(true);
    const handleChoseTagsClose = () => setShowChoseTags(false);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700,
        height: 300,
        backgroundColor: 'white',
        border: '2px solid #000',
        boxShadow: 24,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    };

    return (
        <Container>
            <Row>
                <Col md={2}>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '10px', width: '100%'}}>
                        {topic.username}
                        <br/>
                        {new Date(topic.created_at).toLocaleString()}
                        <Divider/>
                        <h4>Follower: {topic.followers}</h4>
                        <Button variant="outlined" onClick={onFollow_Click}>Follow</Button>
                        <Divider/>
                        <h4>Tags</h4>
                        <div style={{display: 'flex', flexDirection: 'row', gap: '5px', width: '100%'}}>
                            {loading ? "Loading..." : topic.tag_name ? topic.tag_name.split(',').map(tag => (
                                <Chip variant="filled" label={tag} color="info" />
                            )) : null}
                        </div>
                    </div>
                </Col>

                <Col md={7}>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <div className="d-flex flex-row align-items-center">
                            <h1>{topic.title}</h1>
                            <div>
                                <Button variant="contained" onClick={handleClick}>Edit</Button>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={handleChoseTagsOpen}>Tags</MenuItem>
                                    <MenuItem onClick={onDeleteTags_Click}>Delete</MenuItem>
                                    <MenuItem >Edit</MenuItem>
                                </Menu>
                            </div>
                        </div>
                        {/* Edit tags */}
                        <div>
                            <Modal
                                open={showChoseTags}
                                onClose={handleChoseTagsClose}
                            >
                                <box style={style}>
                                    <Form ref={FormTags} style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                                        <TextField name="tags" label="Tags" defaultValue={topic.tag_name} />
                                        <Button variant="contained" onClick={onEditTags_Click}>Edit</Button>
                                    </Form>
                                </box>

                            </Modal>
                        </div>

                        <div>
                            {topic.open === 1 ? (
                                <Chip label='open' color="primary"/>
                            ): (
                                <Chip label='closed' color='secondary' />
                            )}
                        </div>
                        <p>{topic.content}</p>

                        {loading ? "Loading..." : topic.image_path ? topic.image_path.split(',').map(url => (
                            <img key={url} src={url}/>
                        )) : null}
                    </div>
                    <Divider/>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'end', justifyContent: 'end', gap: 10, marginTop: 10, marginBottom: 10}}>
                        <Button variant="contained">Like</Button>
                        <Button variant="contained">Comment</Button>
                    </div>
                    <Divider />
                    <Form ref={FormRef} style={{marginTop: 10}}>
                        <Form.Group>
                            <Form.Control name="comment" as="textarea" rows={3} placeholder="Comment..."></Form.Control>
                        </Form.Group>
                        <div className="d-flex justify-content-end mt-3">
                            <Button onClick={postComment} variant="contained">Send</Button>
                        </div>
                    </Form>
                    {comments.map(comment => (
                        <div key={comment.id}>
                            {comment.parent_id === null ? (
                                <Comment
                                    updated_at={comment.updated_at}
                                    nameUser={comment.user_name}
                                    ImageSrc={comment.avatar}
                                    comment={comment.content}
                                    id={comment.id}
                                    type="topic"
                                />
                            ) : null}
                            {comment.children.length > 0 ? (
                                comment.children.map((childComment) => (
                                    <div style={{marginLeft: '70px'}}>
                                        <Comment
                                            updated_at={childComment.updated_at}
                                            nameUser={childComment.user_name}
                                            ImageSrc={childComment.avatar}
                                            comment={childComment.content}
                                            id={childComment.id}
                                            type="topic"
                                        />
                                    </div>
                                ))
                            ) : null}
                        </div>
                    ))}
                </Col>

                <Col md={2}>
                    <div style={{display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10, marginBottom: 10}}>
                        {recentTopics.map((recentTopic) => (
                            <div key={recentTopic.id} style={{display: 'flex', flexDirection: 'row', width: '100%', overflowX: 'auto'}}>

                            </div>
                        ))}
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default Topic;