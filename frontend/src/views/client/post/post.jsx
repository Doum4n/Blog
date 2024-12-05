import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { Button, ButtonGroup, Container, Form, Image, Row, Col, Badge } from "react-bootstrap";
import Comment from "../component/comment";
import { auth } from "../../../config/firebase";
import MostViewPost from "../component/post/mostViewPost";
import PostTopic from "../component/topic/post_topic";
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'quill/dist/quill.snow.css';
import {Divider} from "@mui/material";
import * as React from "react";

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

    const [user, setUser] = useState({});
    const [post, setPost] = useState({});

    const [tags, setTags] = useState({});

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
        fetchData();
        fetchIndependentData();
    }, []);

    const { id } = useParams();

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
                    viewResponse
                ] = await Promise.all([
                    fetch(`http://0.0.0.0/get-post/${id}`).then(res => res.json()),
                    fetch(`http://0.0.0.0/get/commentByPostId/${id}`).then(res => res.json()),
                    fetch(`http://0.0.0.0/post/${id}/tags`).then(res => res.json()),
                    fetch(`http://0.0.0.0/get-image/${id}`).then(res => res.json()),
                    fetch(`http://0.0.0.0/post/${id}/likes`).then(res => res.json()),
                    fetch(`http://0.0.0.0/user/post/${id}`).then(res => res.json()),
                    fetch(`http://0.0.0.0/post/${id}/view`).then(res => res.json()),
                ]);

                // Cập nhật trạng thái từ kết quả API
                // setContent(postResponse.post.content);
                // setTitle(postResponse.post.title);

                setPost(postResponse.post);

                setComments(commentsResponse);
                setTagIds(tagsResponse);
                setUrl(imageResponse.url);
                setLikes(likesResponse.likes);
                setUser(userResponse);

                // Fetch tên thẻ (tags) song song
                const tagsData = await Promise.all(
                    tagsResponse.map(tagId =>
                        fetch(`http://0.0.0.0/tag/${tagId}`).then(res => res.json())
                    )
                );
                const tagsMap = tagsResponse.reduce((acc, tagId, index) => {
                    acc[tagId] = tagsData[index];
                    return acc;
                }, {});
                setTags(tagsMap);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchIndependentData = async () => {
        try {
            const [mostViewedResponse, postsByTopicResponse, recentPostsResponse] = await Promise.all([
                fetch('http://0.0.0.0/post/most-viewed').then(res => res.json()),
                fetch('http://0.0.0.0/post/forum/1').then(res => res.json()),
                fetch('http://0.0.0.0/posts/recent').then(res => res.json()),
            ]);

            setMostViewPosts(mostViewedResponse.posts);
            setPostsByTopic(postsByTopicResponse);
            setRecentPosts(recentPostsResponse);
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
        await fetch(`http://0.0.0.0/comment/create`,
            {
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

    const commentChange = (e) => {
        setCommentContent(e.target.value);
        console.log(commentContent);
    }

    return (
        <Container>
            <Row>
                <Col md={9}>
                    {/* //Header */}
                    {post.title && <h1 className="mb-3">{post.title}</h1>}
                    <Divider/>
                    <Row className="my-2">
                        <div className="d-flex align-items-center">
                            <Image src='http://0.0.0.0/storage/images/piLImcuVtFrAne46IjKye6B8PCtNtO5CKyGGqfTE.png'
                                roundedCircle style={{ width: '50px', height: '50px', float: 'left' }} className="me-1 mb-1" />
                            <div style={{ float: 'left', marginLeft: '10px' }}>
                                <h6>{user.name}</h6>
                                <h6>{post.updated_at}</h6>
                            </div>
                        </div>
                    </Row>
                    <Divider/>

                    {tagIds.map((tagId) => (
                        <Badge bg="primary" className="me-1">#{tags[tagId]}</Badge>
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
                                        type="status"
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
                                                type="status"
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
                        <h2>{postsByTopic[0] && postsByTopic[0].topic_name}</h2>
                        {postsByTopic.map((post) => (
                            <div>
                                <PostTopic
                                    id={post.id}
                                    title={post.title}
                                    image={post.path}
                                content={post.content}
                            />
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
