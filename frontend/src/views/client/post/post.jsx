import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { Button, ButtonGroup, Container, Form, Image, Row, Col, Badge } from "react-bootstrap";
import Comment from "../component/comment";
import { auth } from "../../../config/firebase";
import MostViewPost from "../component/post/mostViewPost";
import PostTopic from "../component/topic/post_topic";
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

const Post = () => {

    const [title, setTitle] = useState();
    const [content, setContent] = useState();
    const [photoUrl, setUrl] = useState([]);
    const [comments, setComments] = useState([]);
    const [tagIds, setTagIds] = useState([]);
    const [likes, setLikes] = useState();
    const [isLike, setLike] = useState(false);

    const [user_id, setUserId] = useState('');
    const [commentContent, setCommentContent] = useState('');
    const [showSubComment, setShowSubComment] = useState(false);


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

    const { id } = useParams();

    useEffect(() => {
        fetch(`http://0.0.0.0/get-post/${id}`)
            .then(response => {
                if (!response.ok) throw new Error('Cant get post');
                return response.json();
            })
            .then(data => {
                setContent(data.post.content);
                setTitle(data.post.title);
                console.log('Title; ' + title)
            })
            .catch(error => console.error('There was a problem with the fetch operation:', error));
    }, [id]);

    useEffect(() => {
        fetch(`http://0.0.0.0/get/commentByPostId/${id}`)
            .then(response => {
                if (!response.ok) throw new Error('Cant get comments');
                return response.json();
            })
            .then(data => setComments(data))
            .catch(error => console.error(error));
    }, [id]);

    useEffect(() => {
        fetch(`http://0.0.0.0/post/${id}/tags`)
            .then(response => {
                if (!response.ok) throw new Error('Cant get tags');
                return response.json();
            })
            .then(data => {
                data.forEach(tagId => getTagNameById(tagId));
                setTagIds(data);
                console.log(data);
            })
            .catch(error => console.error(error));
    }, [id]);

    const getTagNameById = (id) => {
        fetch(`http://0.0.0.0/tag/${id}`)
            .then(response => {
                if (!response.ok) throw new Error('Cant get tags');
                return response.json();
            })
            .then(tagName => {
                setTags((prev) => ({ ...prev, [id]: tagName }));
            })
            .catch(error => console.error(error));
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://0.0.0.0/get-image/${id}`);
                if (!response.ok) throw new Error('Cant get image');
                const data = await response.json();
                setUrl(data.url);
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };
        fetchData();
    }, [id]);

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

    useEffect(() => {
        fetch(`http://0.0.0.0/post/${id}/likes`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Cant like this post!")
                }
                return response.json();
            }).then(data => {
                setLikes(data.likes);
                console.log(data.likes);
            }).catch(err => {
                console.error(err);
            });
    }, [id]);

    useEffect(() => {
        fetch(`http://0.0.0.0/post/${id}/view`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Cant increase this post!")
                }
                return response.json();
            }).catch(err => {
                console.error(err);
            });
    }, [id]);

    const postComment = async () => {
        await fetch(`http://0.0.0.0/comment/create`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user_id,
                    post_id: id,
                    content: commentContent,
                    parent_id: null
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

    const [mostViewPosts, setMostViewPosts] = useState([]);

    useEffect(() => {
        fetch('http://0.0.0.0/post/most-viewed')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setMostViewPosts(data.posts);
                console.log('succes get most viewed post');
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }, []);

    const [postsByTopic, setPostsByTopic] = useState([]);

    useEffect(() => {
        fetch('http://0.0.0.0/post/topic/1')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setPostsByTopic(data);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }, []);

    const [recentPosts, setRecentPosts] = useState([]);
    useEffect(() => {
        fetch('http://0.0.0.0/posts/recent')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setRecentPosts(data);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }, []);

    const commentChange = (e) => {
        setCommentContent(e.target.value);
        console.log(commentContent);
    }

    return (
        <Container>
            <Row>
                <Col md={9}>
                    {/* //Header */}
                    {title && <h1 className="mb-3">{title}</h1>}
                    <Row className="mb-2">
                        <div className="d-flex align-items-center">
                            <Image src='http://0.0.0.0/storage/images/piLImcuVtFrAne46IjKye6B8PCtNtO5CKyGGqfTE.png'
                                roundedCircle style={{ width: '50px', height: '50px', float: 'left' }} className="me-1 mb-1" />
                            <div style={{ float: 'left' }}>
                                <h6>Username</h6>
                                <h6>Update at</h6>
                            </div>
                        </div>
                    </Row>

                    {tagIds.map((tagId) => (
                        <Badge bg="primary" className="me-1">#{tags[tagId]}</Badge>
                    ))}
                    {/* // */}

                    {/* //Content */}
                    <div className="mt-2">
                        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
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
                                    <GetComment comment={comment} />
                                ) : null}
                                {comment.children.length > 0 ? (
                                    comment.children.map((childComment) => (
                                        <div style={{ marginLeft: '70px' }}>
                                            <GetComment key={childComment.id} comment={childComment} className="ms-4" />
                                        </div>
                                    ))
                                ) : null}
                            </div>
                        ))}
                    </div>
                    {/* // */}

                    <hr />

                    {/* //Related topic */}
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
