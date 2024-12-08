import { Card, Container, Modal, Image, Tabs, Tab, Col, Row} from "react-bootstrap";
import React, {useState, useEffect, useRef, createRef} from "react";
import { useNavigate } from "react-router-dom";
import cover from '../../../assets/cover.png';
// import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Button from "@mui/material/Button";
import {Divider} from "@mui/material";
import Post_by_user from "./account/post_by_user.jsx";
import UserInfo_modal from "./account/userInfo_modal.jsx";
import Status from "./status/status.jsx";
import EditInfo_modal from "./account/editInfo_modal.jsx";

const Account = ({uuid, type}) => {
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [groups, setGroups] = useState([]);
    const [followedUsers, setFollowedUsers] = useState([]);

    const [user, setUser] = useState({});
    const UserInfoRef = createRef();
    const EditInfoRef = createRef();

    useEffect(() => {
        if(uuid) {
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
        }
    }, [uuid]);

    const getPostByUuid = async () => {
        if(uuid) {
            try {
                const [postsRes, statusRes, groupsRes, followedUsersRed] = await Promise.all([
                    fetch(`http://0.0.0.0/post/user/${uuid}`),
                    fetch(`http://0.0.0.0/status/user/${uuid}`),
                    fetch(`http://0.0.0.0/groups/user/${uuid}`),
                    fetch(`http://0.0.0.0/user/follow/users/${uuid}`)
                ])

                if (!postsRes.ok) throw new Error("Can't get posts by user id: " + uuid);
                if (!statusRes.ok) throw new Error("Can't get statuses by user id: " + uuid);

                const postsdata = await postsRes.json();
                const statusesData = await statusRes.json();
                const groupsData = await groupsRes.json();
                const followedUsersData = await followedUsersRed.json();

                setPosts(postsdata.post);
                setStatuses(statusesData.data);
                setGroups(groupsData);
                setFollowedUsers(followedUsersData);

            } catch (err) {
                console.error("Error fetching data:", err);

            }
        }
    }

    useEffect(() => {
        getPostByUuid();
    }, [uuid]);

    const OnInfo_Click = () => {
        UserInfoRef.current.handleOpen();
    }

    const OnEditInfo_Click = () => {
        EditInfoRef.current.handleOpen();
    }

    return (
        <Container className="d-flex flex-column w-75">
            <div className="d-flex flex-column">
                <Card.Img src={cover}/>
            </div>
            <div
                className="d-flex align-items-center"
                style={{
                    position: 'relative',
                    top: '-20px',
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
                <div>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <div style={{display: "flex", flexDirection: "row", gap: '10px'}}>
                            <h1 style={{margin: 0}}>{user.name}</h1>
                            {type === 'OtherAccount' ? <Button variant="contained">Follow</Button> : null}
                        </div>
                        <div>
                            <p><b>followers: {user.followers}</b></p>
                        </div>
                    </div>
                    <p>{user.biography}</p>
                </div>
            </div>

            <Row>
                <Col md={3} style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    <h2>Status</h2>
                    <Divider/>
                    <Button variant="outlined" onClick={OnInfo_Click}>Info</Button>
                    {type === 'MyAccount' ? <Button variant="outlined" onClick={OnEditInfo_Click}>Edit Profile</Button> : null}
                    <Divider/>
                    <h2>Groups</h2>
                    <div>
                        <div className="sticky-top" style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            alignItems: 'center',
                            backgroundColor: '#1c1c1c',
                            padding: '10px',
                            borderRadius: '10px',
                        }}>
                            <h2 style={{color: 'white', margin: '0 0 10px 0'}}>Community</h2>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '10px',
                                width: '100%'
                            }}>
                                {groups.map(group => (
                                    <div key={group.id} onClick={() => navigate(`/group/${group.id}`)} style={{
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
                            }}
                                    onClick={() => navigate(`/groups`)}
                            >
                                More
                            </Button>
                        </div>
                        {/*  */}
                    </div>
                    <Divider/>
                    <h2>Following</h2>
                    <div>
                        {followedUsers.map(followedUser => (
                            <div key={followedUser.id}>
                                {followedUser.name}
                            </div>
                        ))}
                    </div>
                    <div>
                        <UserInfo_modal user={user} ref={UserInfoRef}/>
                        <EditInfo_modal user={user} ref={EditInfoRef}/>
                    </div>
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

export default Account