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
import {Divider} from "@mui/material";

const MyAccount = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [statuses, setStatuses] = useState([]);

    const [user, setUser] = useState({});

    const {uuid} = useParams();

    useEffect(() => {
        fetch(`http://0.0.0.0/user/${uuid}`)
            .then(Response => {
                if (!Response.ok)
                    throw new Error("Cant get comment by user id: " + uuid);
                return Response.json();
            }).then(data => {
            setUser(data);
        }).catch(err => {
            console.error(err);
        })
    }, []);

    const getPostByUuid = async () => {
        try{
            const [postsRes, statusRes] = await Promise.all([
                fetch(`http://0.0.0.0/post/user/${uuid}`),
                fetch(`http://0.0.0.0/status/user/${uuid}`),
            ])

            if (!postsRes.ok) throw new Error("Can't get posts by user id: " + uuid);
            if (!statusRes.ok) throw new Error("Can't get statuses by user id: " + uuid);

            const postsdata = await postsRes.json();
            const statusesData = await statusRes.json();

            setPosts(postsdata.post);
            setStatuses(statusesData.data);

        }catch(err) {
            console.error("Error fetching data:", err);

        }
    }

    useEffect(() => {
        getPostByUuid();
    }, [uuid]);

    return (
        <Container className="d-flex flex-column w-75">
            <div className="d-flex flex-column">
                <Card.Img src={cover}/>
            </div>
            <div
                className="d-flex align-items-center"
                style={{
                    position: 'relative',
                    top: '-50px',
                    paddingLeft: '20px', // Tùy chỉnh khoảng cách bên trái
                }}
            >
                <Image
                    src={user.photoUrl}
                    roundedCircle
                    style={{
                        width: '200px',
                        height: '200px',
                        border: '6px solid white',
                        marginRight: '20px', // Tạo khoảng cách giữa ảnh và text
                    }}
                />
                <h1 style={{margin: 0}}>{user.name}</h1>
            </div>

            <Row>
                <Col md={3} style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    <h2>Status</h2>
                    <Divider />
                    <Button variant="outlined">Info</Button>
                    <Divider />
                    <h2>Groups</h2>
                    <Divider />
                    <h2>Followers</h2>
                </Col>
                <Col md={9}>
                    <h2>Created status</h2>
                    <div style={{display: 'flex', flexDirection: 'row', gap: '10px', overflowX: 'auto'}}>
                        {statuses.map((status1) => (
                            <Status
                                key={status1.id}
                                id={status1.id}
                                name={status1.user_name}
                                content={status1.content}
                                image={`${status1.image_path}`}
                            />
                        ))}
                    </div>
                    <h2>Posted article</h2>
                    {posts.map((post) => (
                        <Post_by_user
                            id={post.id}
                            title={post.title}
                            image={`http://0.0.0.0/storage/${post.path}`}
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

export default MyAccount