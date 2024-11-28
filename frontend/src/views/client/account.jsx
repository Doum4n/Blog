import { Button, Card, Container, Modal, Image, Tabs, Tab } from "react-bootstrap";
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import { useHref, useNavigate } from "react-router-dom";
import cover from '../../assets/cover.png';
import { setUserId } from "firebase/analytics";
import Post_by_user from './component/account/post_by_user'
import Comment_by_user from './component/account/comment_by_user';
import SharedPost from "./component/account/shared_post";
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

const Account = () => {

    const [show, setShow] = useState(false)
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [uuid, setUuid] = useState('');
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [post_id, setPostId] = useState('');
    const [urls, setUrls] = useState({});
    const [Sharedposts, setSharedPosts] = useState([]);

    const LogOut = async () => {
        await signOut(auth);
        closeModal();
        navigate('/home');
    }

    useEffect(() => {
        try {
            auth.onAuthStateChanged(function (user) {
                if (user) {
                    setUsername(user.displayName);
                    setUuid(user.uid);
                    setPhotoUrl(user.photoURL);
                }
            });
        } catch (err) {
            console.error(err);
        };
    });

    const getPostByUuid = () => {
        fetch(`http://0.0.0.0/post/user/${uuid}`)
            .then(Response => {
                if (!Response.ok)
                    throw new Error("Cant get post by user id: " + uuid);
                return Response.json();
            }).then(data => {
                console.log(data.post);
                // data.post.forEach(post => getImage(post.id));
                setPosts(data.post);
            }).catch(err => {
                console.error(err);
            })
    }

    const getCommentByUuid = () => {
        fetch(`http://0.0.0.0/comment/user/${uuid}`)
            .then(Response => {
                if (!Response.ok)
                    throw new Error("Cant get comment by user id: " + uuid);
                return Response.json();
            }).then(data => {
                console.table(data.comments);
                setComments(data.comments);
            }).catch(err => {
                console.error(err);
            })
    }

    const getSharedPosts = () => {
        fetch(`http://0.0.0.0/interact/share/${uuid}`)
            .then(Response => {
                if (!Response.ok)
                    throw new Error("Cant get shared posts by user id: " + uuid);
                return Response.json();
            }).then(data => {
                setSharedPosts(data.posts);
                console.table(data.posts);
            }).catch(err => {
                console.error(err);
            })

    }

    const getImage = (id) => {
        fetch(`http://0.0.0.0/get-image/once/${id}`)
            .then(Response => {
                if (!Response.ok)
                    throw new Error("Cant get image for post id: " + id);
                return Response.json();
            }).then(data => {
                console.log('image', data.url);
                // setUrl((prew) => [...prew, data.url]);
                // setUrl(data.url);
                setUrls(prevUrls => ({ ...prevUrls, [id]: data.url }));
            }).catch(err => {
                console.error(err);
            })
    }


    const handleSelect = (key) => {
        if (key === 'post') {
            getPostByUuid();
        } else if (key === 'comment') {
            getCommentByUuid();
        } else if (key == 'share') {
            getSharedPosts();
        }
    };

    return (
        <Container>
            <Card className="border-0">
                <div className="d-flex justify-content-center">
                    <Card.Img src={cover} style={{ width: '70%' }}></Card.Img>
                </div>
                <div style={{ position: 'relative', top: '-50px', left: '220px' }}>
                    <Image
                        src={photoUrl}
                        roundedCircle
                        style={{ float: 'left', width: '200px', height: '200px', border: '6px solid white' }}
                    />
                    <div style={{ float: 'left', position: 'relative', top: '70px', left: '10px' }}>
                        <h1>{username}</h1>
                    </div>
                </div>
            </Card>
            <Tabs
                defaultActiveKey="profile"
                id="uncontrolled-tab-example"
                className="mb-3" style={{ position: 'relative', left: '190px' }}
                onSelect={handleSelect}
            >
                <Tab eventKey="home" title="Overview">
                    Tab content for Home
                </Tab>
                <Tab eventKey="post" title="Post">
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
                </Tab>
                <Tab eventKey="comment" title="Comment">

                    {comments.map((comment) => (
                        <div>
                            {posts.filter(post => post.id === comment.post_id).map((post) => (
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

                            <Comment_by_user
                                key={comment.id}
                                title={comment.post_id}
                                comment={comment.content}
                            />
                        </div>

                    ))}

                </Tab>
                <Tab eventKey="share" title="share">
                    {Sharedposts.map((post) => (
                        <SharedPost
                            id={post.id}
                            title={post.title}
                            image={`http://0.0.0.0/storage/${urls[post.id]}`}
                            description={post.content}
                            key={post.id}
                        />
                    ))}
                </Tab>
            </Tabs>
        </Container>
    );
}

export default Account