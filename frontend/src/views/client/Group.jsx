import { Card, Container, Modal, Image, Tabs, Tab, Col, Row} from "react-bootstrap";
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";
import React, { useState, useEffect } from "react";
import {useHref, useNavigate, useParams} from "react-router-dom";
import cover from '../../assets/cover.png';
import { setUserId } from "firebase/analytics";
import Post_by_user from './component/account/post_by_user'
import Comment_by_user from './component/account/comment_by_user';
import SharedPost from "./component/account/shared_post";
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import statusRes from "assert";
import Status from "./component/status/status.jsx";
import Button from "@mui/material/Button";
import {Divider, TextField} from "@mui/material";

const Group = () => {

    const navigate = useNavigate();
    const [photoUrl, setPhotoUrl] = useState('');
    const [posts, setPosts] = useState([]);
    const [group, setGroup] = useState({});
    const [groups4, setGroups4] = useState([]);

    const [myUuid, setMyUuid] = useState();

    const {id} = useParams();

    useEffect(() => {
        try {
            auth.onAuthStateChanged(function (user) {
                if (user) {
                    setPhotoUrl(user.photoURL);
                    setMyUuid(user.uid);
                }
            });
        } catch (err) {
            console.error(err);
        };
    });

    useEffect(() => {
        if(id) {
            fetch(`http://0.0.0.0/group/${id}`)
                .then(Response => {
                    if (!Response.ok)
                        throw new Error("Cant get comment by user id: " + id);
                    return Response.json();
                }).then(data => {
                setGroup(data);
            }).catch(err => {
                console.error(err);
            })
        }
    }, [id]);

    const getPostById = async () => {
        try{
            const [postsRes, groupRes] = await Promise.all([
                fetch(`http://0.0.0.0/posts/group/${id}`),
                fetch(`http://0.0.0.0/group/top4`),
            ])

            if (!postsRes.ok) throw new Error("Can't get posts by group id: " + id);

            const postsdata = await postsRes.json();
            const groups = await groupRes.json();

            setGroups4(groups);
            setPosts(postsdata.data);
        }catch(err) {
            console.error("Error fetching data:", err);

        }
    }

    useEffect(() => {
        getPostById();
    }, [id]);

    const onFollow_Click = () => {
        fetch(`http://0.0.0.0/follow`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id : myUuid,
                group_id: id,
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
                console.log(myUuid + " " );
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    const onPost_Click = () => {

    }

    return (
        <Container className="d-flex flex-column w-75">
            <div className="d-flex flex-column">
                <img src={group.coverPhotoUrl} alt={"cover"}/>
            </div>
            <div
                className="d-flex align-items-center"
                style={{
                    position: 'relative',
                    // top: '',
                    paddingLeft: '20px', // Tùy chỉnh khoảng cách bên trái
                }}
            >
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <div>
                        <h1 style={{margin: 0}}>{group.name}</h1>
                        <p><b>followers: {group.followers}</b></p>
                    </div>
                </div>
                <div style={{marginLeft: 'auto'}}>
                    <Button variant="contained" onClick={onFollow_Click}>Follow</Button>
                </div>
            </div>

            <Row>
                <Col md={3} style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <div style={{height: '400px', width: '100%', backgroundColor: 'gray', padding: '10px'}}>
                    <h4>Description</h4>
                    {group.description}
                    </div>
                    <div>
                        <h2>Groups</h2>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            alignItems: 'center',
                            backgroundColor: '#1c1c1c',
                            padding: '10px',
                            borderRadius: '10px'
                        }}>
                            <h2 style={{color: 'white', margin: '0 0 10px 0'}}>Cộng đồng</h2>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '10px',
                                width: '100%'
                            }}>
                                {groups4.map(group => (
                                    <div key={group.id} style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        backgroundColor: '#2c2c2c',
                                        borderRadius: '10px',
                                        padding: '10px'
                                    }}>
                                        <img
                                            src={group.coverPhotoUrl}
                                            alt={group.name}
                                            style={{
                                                width: '100%',
                                                borderRadius: '5px',
                                                objectFit: 'cover',
                                                aspectRatio: '16/9'
                                            }}
                                        />
                                        <p style={{
                                            color: 'white',
                                            textAlign: 'center',
                                            marginTop: '10px',
                                            fontSize: '14px',
                                            fontWeight: 'bold'
                                        }}>{group.name}</p>
                                    </div>
                                ))}
                            </div>
                            <Button variant="contained" style={{
                                // marginTop: '20px',
                                width: '100%',
                                padding: '10px 20px',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}>
                                More
                            </Button>
                        </div>
                    </div>
                </Col>
                <Col md={9}>
                    <Button variant="contained" onClick={() => navigate(`/post/upload/group/${id}`)}>Post</Button>
                    <h2>Postes</h2>
                    {posts.map((post) => (
                        <Post_by_user
                            id={post.id}
                            title={post.title}
                            image={`${post.path}`}
                            likes={post.likes}
                            comments={post.comments}
                            description={post.content}
                            key={post.id}
                        />
                    ))}
                </Col>
            </Row>
        </Container>
    );
}

export default Group