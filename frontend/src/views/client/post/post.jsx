import {createRef, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import DOMPurify from "dompurify";
import { Button, ButtonGroup, Container, Form, Image, Row, Col, Badge } from "react-bootstrap";
import Comment from "../component/comment";
import { auth } from "../../../config/firebase";
import MostViewPost from "../component/post/mostViewPost";
import PostTopic from "../component/topic/post_forum.jsx";
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'quill/dist/quill.snow.css';
import {Divider, Menu, MenuItem, Modal, TextField} from "@mui/material";
import * as React from "react";
import Notification_modal from "../component/notification_modal.jsx";

const Post = () => {

    // const [title, setTitle] = useState();
    // const [content, setContent] = useState();
    const [photoUrl, setUrl] = useState([]);
    const [comments, setComments] = useState([]);
    const [tagIds, setTagIds] = useState([]);
    const [likes, setLikes] = useState();
    const [isLike, setLike] = useState(false);

    const [user_id, setUserId] = useState('');
    const [commentContent, setCommentContent] = useState('');
    const [showSubComment, setShowSubComment] = useState(false);

    const [postsByTopic, setPostsByTopic] = useState([]);
    const [mostViewPosts, setMostViewPosts] = useState([]);
    const [recentPosts, setRecentPosts] = useState([]);
    const [relatedPosts, setRelatedPosts] = useState([]);

    const [user, setUser] = useState({});
    const [post, setPost] = useState({});

    const [tags, setTags] = useState([]);
    const [forums, setForums] = useState([]);

    const navigate = useNavigate();

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
        fetch(`http://0.0.0.0/post/${id}/view`).then(res => res.json());
    }, []);

    const { id } = useParams();

    useEffect(() => {
         fetchData();
        fetchIndependentData();
    }, [id]);

    const fetchData = async () => {
        try {
            if (id) {
                // Thực hiện các lời gọi API song song
                const [
                    postResponse,
                    commentsResponse,
                    tagsResponse,
                    imageResponse,
                    likesResponse,
                    userResponse,
                ] = await Promise.all([
                    fetch(`http://0.0.0.0/get-post/${id}`).then(res => res.json()),
                    fetch(`http://0.0.0.0/get/commentByPostId/${id}`).then(res => res.json()),
                    fetch(`http://0.0.0.0/post/${id}/tags`).then(res => res.json()),
                    fetch(`http://0.0.0.0/get-image/${id}`).then(res => res.json()),
                    fetch(`http://0.0.0.0/post/${id}/likes`).then(res => res.json()),
                    fetch(`http://0.0.0.0/user/post/${id}`).then(res => res.json()),
                ]);

                // Cập nhật trạng thái từ kết quả API
                // setContent(postResponse.post.content);
                // setTitle(postResponse.post.title);

                setPost(postResponse.post);

                setComments(commentsResponse);
                setTags(tagsResponse);
                setUrl(imageResponse.url);
                setLikes(likesResponse.likes);
                setUser(userResponse);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchIndependentData = async () => {
        try {
            const [mostViewedResponse, postsByTopicResponse, recentPostsResponse, relatedPostsRes, forumsRes] = await Promise.all([
                fetch('http://0.0.0.0/post/most-viewed').then(res => res.json()),
                fetch('http://0.0.0.0/post/forum/1').then(res => res.json()),
                fetch('http://0.0.0.0/posts/recent').then(res => res.json()),
                fetch(`http://0.0.0.0/posts/related?current_post_id=${id}&forum_id=${post.forum_id}`).then(res => res.json()),
                fetch(`http://0.0.0.0/forums`).then((response) => response.json()),
            ]);

            setMostViewPosts(mostViewedResponse.posts);
            setPostsByTopic(postsByTopicResponse);
            setRecentPosts(recentPostsResponse);
            setRelatedPosts(relatedPostsRes.data);
            setForums(forumsRes);

            console.log(relatedPostsRes.data);
        } catch (error) {
            console.error('Error fetching independent data:', error);
        }
    };

    const GetComment = ({ comment }) => {
        const [username, setUsername] = useState("Unknown User");
        const [userPhotoUrl, setUserPhotoUrl] = useState('');

        useEffect(() => {
            const fetchUser = async () => {
                try {
                    const response = await fetch(`http://0.0.0.0/get/username/${comment.user_id}`);
                    if (!response.ok) throw new Error(`Cant get username where user_id = ${comment.user_id}`);
                    const data = await response.json();
                    setUsername(data);
                } catch (err) {
                    console.error(err);
                }
            };

            fetchUser();

            const fetchUserPhoto = async () => {
                try {
                    const response = await fetch(`http://0.0.0.0/get/user/photo/${comment.user_id}`);
                    if (!response.ok) throw new Error(`Can't get user photo where user_id = ${comment.user_id}`);
                    const data = await response.json();
                    setUserPhotoUrl(data);
                } catch (err) {
                    console.error(err);
                }
            };

            fetchUserPhoto();

        }, [comment.user_id]);

        return (
            <Comment
                updated_at={comment.updated_at}
                nameUser={username}
                ImageSrc={userPhotoUrl}
                comment={comment.content}
                id={comment.id}
                type="posts"
            />
        );
    };

    const liked = async () => {
        await fetch(`http://0.0.0.0/post/${id}/like`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Cant like this post!")
                }
                setLikes(prevLikes => prevLikes + 1);
            });
        Interact('like');
    }

    const Interact = async (interact) => {
        await fetch(`http://0.0.0.0/interaction`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                post_id: id,
                user_id: user_id,
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

    const postComment = async () => {
        try {
            const response = await fetch(`http://0.0.0.0/comment/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user_id,
                    id: id,
                    content: commentContent,
                    parent_id: null,
                    type: "post",
                }),
            });

            if (!response.ok) {
                throw new Error("Can't post this comment!");
            }

            const newComment = await response.json(); // Lấy bình luận mới từ server.

            // Cập nhật danh sách bình luận
            setComments((prevComments) => [
                {
                    ...newComment, // Dữ liệu bình luận mới
                    children: [], // Mặc định không có phản hồi con
                },
                ...prevComments, // Giữ lại các bình luận cũ
            ]);

            // Reset nội dung ô nhập
            setCommentContent('');
        } catch (err) {
            console.error(err);
        }
    };

    const handleNewSubComment = (parentId, newSubComment) => {
        setComments((prevComments) =>
            prevComments.map((comment) =>
                comment.id === parentId
                    ? { ...comment, children: [...comment.children, newSubComment] }
                    : comment
            )
        );
    };

    const commentChange = (e) => {
        setCommentContent(e.target.value);
        console.log(commentContent);
    }

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [message, setMessage] = React.useState('');

    const NofiticationRef = createRef();

    const deletePost = () => {
        fetch('http://0.0.0.0/posts/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                posts: [id],
            })
        }).then(response => {
            if (!response.ok) throw new Error('Cant delete post');
            return response.json();
        })
            .then(data => {
                console.log('deleted');
                setMessage("Deleted");
                NofiticationRef.current.handleOpen();
            })
            .catch(error => console.error('There was a problem with the fetch operation:', error));
    }

    const [showChoseForum, setShowChoseForum] = useState(false);
    const handleChoseForumOpen = () => setShowChoseForum(true);
    const handleChoseForumClose = () => setShowChoseForum(false);

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

    const onEditTags_CLick = () => {
        fetch('http://0.0.0.0/post/tags/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                post_id: id,
                tag_name: FormRef.current.elements.tags.value,
                forum_id: FormRef.current.elements.selectedForum.value,
            })
        }).then(response => {
            if (!response.ok) throw new Error('Cant delete post');
            return response.json();
        })
            .then(data => {
                console.log('Updated');
                setMessage("Updated");
                NofiticationRef.current.handleOpen();
            })
            .catch(error => console.error('There was a problem with the fetch operation:', error));
    }

    const FormRef = React.createRef();

    return (
        <Container>
            <Row>
                <Col md={9} style={{backgroundColor: '#F1E6D7'}}>
                    {/* //Header */}
                    <h5>Forum: {post.forum_name}</h5>
                    {post.title && <h1 className="mb-3">{post.title}</h1>}
                    <Divider/>
                    <Row className="my-2">
                        <div className="d-flex align-items-center">
                            <Image src='http://0.0.0.0/storage/images/piLImcuVtFrAne46IjKye6B8PCtNtO5CKyGGqfTE.png'
                                roundedCircle style={{ width: '50px', height: '50px', float: 'left' }} className="me-1 mb-1" />
                            <div style={{ float: 'left', marginLeft: '10px', width: '100%' }}>
                                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '5px'}}>
                                    <h6>{user.name}</h6>
                                    <Button style={{fontSize: '10px', paddingTop: '2px', paddingBottom: '2px'}}>Follow</Button>
                                </div>
                                <h6>{post.updated_at}</h6>
                            </div>
                            {user_id === post.user_id ? (
                                <div>
                                    <Button variant="primary" onClick={handleClick}>Edit</Button>
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                    >
                                        <MenuItem onClick={() => handleChoseForumOpen()}>Tags</MenuItem>
                                        <MenuItem onClick={deletePost}>Delete</MenuItem>
                                        <MenuItem onClick={() => navigate(`/post/update/${id}`)}>Edit</MenuItem>
                                    </Menu>
                                </div>
                            ) : null}
                        </div>
                    </Row>
                    <div>
                        <Notification_modal ref={NofiticationRef} title="Nofitication" message={message} />
                    </div>
                    {/* Edit tags */}
                    <div>
                        <Modal
                            open={showChoseForum}
                            onClose={handleChoseForumClose}
                        >
                            <box style={style}>
                                <Form ref={FormRef} style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                                    <TextField name="tags" label="Tags" defaultValue={tags.map((tag) => tag.name).join(',')}/>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Forum</Form.Label>
                                        <Form.Select name="selectedForum">
                                            {forums.map((forum) => (
                                                <option key={forum.id} value={forum.id}>
                                                    {forum.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <Button onClick={onEditTags_CLick}>Edit</Button>
                                </Form>
                            </box>

                        </Modal>
                    </div>
                    <Divider/>

                    {tags.map((tag) => (
                        <Badge bg="primary" className="me-1">#{tag.name}</Badge>
                    ))}
                    {/* // */}

                    {/* //Content */}
                    <div className="mt-2">
                        <div className="ql-editor" dangerouslySetInnerHTML={{ __html: (post.content) }} />
                        <br />
                        <div>
                            {photoUrl.map((url, index) => (
                                <img key={index} src={url.path} alt={`Image ${index}`} />
                            ))}
                        </div>
                        <hr />
                        <h1>{likes}</h1>
                    </div>
                    {/* // */}
                    
                    {/* //Interact */}
                    <div className="mt-3">
                        <Button variant="primary" className="me-2" onClick={liked}>Like</Button>
                        <Button variant="primary" className="me-2" onClick={() => {
                            const commentSection = document.getElementById('comment');
                            const offset = 50;
                            const elementPosition = commentSection.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.scrollY - offset;

                            window.scrollTo({
                                top: offsetPosition,
                                behavior: "smooth"
                            });
                        }
                        }>comment</Button>
                        <Button variant="primary" onClick={() => Interact('share')}>share</Button>
                    </div>
                    {/* // */}
                    
                    {/* //write a comment */}
                    <Form className="mt-3" id="comment">
                        <Form.Group>
                            <Form.Control as="textarea" rows={3} placeholder="Comment..." onChange={commentChange}></Form.Control>
                        </Form.Group>
                        <div className="d-flex justify-content-end mt-3">
                            <Button onClick={postComment}>Send</Button>
                        </div>
                    </Form>
                    {/* // */}

                    {/* //Comments display */}
                    <div>
                        {comments.map((comment) => (
                            <div key={comment.id}>
                                {comment.parent_id === null ? (
                                    <Comment
                                        updated_at={comment.updated_at}
                                        nameUser={comment.user_name}
                                        ImageSrc={comment.avatar}
                                        comment={comment.content}
                                        id={comment.id}
                                        type="post"
                                        onNewSubComment={(newSubComment) =>
                                            handleNewSubComment(comment.id, newSubComment)
                                        }
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
                                                type="post"
                                            />
                                        </div>
                                    ))
                                ) : null}
                            </div>
                        ))}
                    </div>
                    {/* // */}

                    <hr/>

                    {/* //Related forum */}
                    <div>
                        {/*<h2>{ps[0] && postsByTopic[0].topic_name}</h2>*/}
                        {relatedPosts.map((post) => (
                            <div
                                key={post.id}
                                style={{
                                    // width: '900px'
                                    flexShrink: 0,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: '10px',
                                    marginTop: '10px',
                                }}
                                onClick={() => navigate(`/post/${post.id}`)}
                            >
                                <img
                                    src={post.image_path}
                                    alt={post.title}
                                    style={{width: '200px', objectFit: 'cover', borderRadius: '5px'}}
                                />
                                <h3 style={{margin: 0, lineHeight: '1.2'}}>{post.title}</h3>
                            </div>
                        ))}
                    </div>
                    {/* // */}
                </Col>

                {/* Most view */}
                <Col md={3}>
                    <div>
                        <h2>Most view</h2>
                        {mostViewPosts.map((post) => (
                            <MostViewPost
                                id={post.id}
                                title={post.title}
                                image={post.path}
                            />
                        ))}
                    </div>
                    <div>
                        <h2>Recent posts</h2>
                        {recentPosts.map((post) => (
                            <MostViewPost
                                id={post.id}
                                title={post.title}
                                image={`http://0.0.0.0/storage/${post.path}`}
                            />
                        ))}
                    </div>
                </Col>
                {/* // */}
            </Row>

            <div style={{backgroundColor: 'purple', height: '100px', margin: '20px 0 0 0'}}>

            </div>

        </Container>

    );
}

export default Post;
