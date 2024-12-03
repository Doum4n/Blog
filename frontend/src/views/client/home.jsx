// import './style/style.css'
import {Carousel, Container, Form, Navbar, NavbarBrand, NavbarCollapse} from 'react-bootstrap';
import Toast from 'react-bootstrap/Toast';
import React, {useEffect, useRef, useState} from 'react';
import { Card } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Nav } from 'react-bootstrap';
import banner from '../../assets/banner.png';
import axios from 'axios';
import Post from './component/post';
import { ListGroup } from 'react-bootstrap';
import SubPost from './component/sub_post';
import { useNavigate } from 'react-router-dom';
import PostTopic from './component/topic/post_topic';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Status from "./component/status/status.jsx";
import {Box, Divider, Modal} from "@mui/material";
import SubComment from "./component/subcoment.jsx";
import Button from "@mui/material/Button";
import {auth} from "../../config/firebase.js";

function Home() {
  const post =
  {
    id: 1,
    title: "Tin tức số 1",
    image: banner,
    description: "Đây là một mô tả ngắn về bài viết số 1."
  }

  const posts = [
    {
      id: 1,
      title: "Tin tức số 1",
      image: banner,
      description: "Đây là một mô tả ngắn về bài viết số 1."
    },
    {
      id: 2,
      title: "Tin tức số 2",
      image: banner,
      description: "Đây là một mô tả ngắn về bài viết số 2."
    },
    {
      id: 3,
      title: "Tin tức số 3",
      image: banner,
      description: "Đây là một mô tả ngắn về bài viết số 3."
    }
    // Thêm nhiều bài viết khác...
  ];

  const most_view_posts = [
    {
      id: 1,
      title: "Tin tức số 1",
      image: banner,
      description: "Đây là một mô tả ngắn về bài viết số 1."
    },
    {
      id: 2,
      title: "Tin tức số 2",
      image: banner,
      description: "Đây là một mô tả ngắn về bài viết số 2."
    },
    {
      id: 3,
      title: "Tin tức số 3",
      image: banner,
      description: "Đây là một mô tả ngắn về bài viết số 3."
    },
    {
      id: 4,
      title: "Tin tức số 4",
      image: banner,
      description: "Đây là một mô tả ngắn về bài viết số 4."
    }
  ];

  const [mostViewPosts, setMostViewPosts] = useState([]);
  const [FeaturedPosts, setFeaturedPosts] = useState([]);
  const [topics, setTopics] = useState([]);
  const [postsByTopic, setPostsByTopic] = useState([]);
  const [userId, setUserId] = useState({});

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

  useEffect(() => {
    fetch('http://0.0.0.0/post/Featured')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setFeaturedPosts(data.posts);
        console.log('succes get most Featured post');
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, []);

  const [RecentPosts, setRecentPosts] = useState([]);

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

  useEffect(() => {
    fetch('http://0.0.0.0/topics')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setTopics(data);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, []);

  useEffect(() => {
    fetch('http://0.0.0.0/post/topic/5')
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

  const [statuses, setStatuses] = useState([]);
  useEffect(() => {
    fetch('http://0.0.0.0/status/index')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setStatuses(data.data);
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
  }, []);

  var index = 1;
  const navigate = useNavigate();
  const PopularHandlerClick = (id) => {
    navigate(`/post/${id}`);
  }


  const [selectedTopic, setSelectedTopic] = useState(null);
  const onclick = (id) => {
    fetch(`http://0.0.0.0/post/topic/${id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setPostsByTopic(data);
          setSelectedTopic(id);
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
  }

  const onMorePostsByTopic_Click = () => {
      navigate(`/topic/${selectedTopic}`);
  }

  const onMoreRecentPost_Click = () => {
    navigate(`/posts/recent`);
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    padding: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  };

  //TODO
  const [open, setOpen] = React.useState(false);
  const FormRef = useRef(null);

    const handleOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };

  const onPostStatus_Click = () => {
    fetch(`http://0.0.0.0/status/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: userId,
        content: FormRef.current.elements.content.value,
      })
    })
        .then(response => {
          if (!response.ok) {
            throw new Error("Cant create status!")
          }
          return response.json();
        }).then(data => {
          console.log(data);
        });
  }

  return (
    <>
      <Container>
        <Row>
          <div style={{display: 'flex', flexDirection: 'row', gap: '10px'}}>
            <div onClick={() => handleOpen()} className="bg-secondary d-flex justify-content-center align-items-center" style={{height: '200px', width: '100px'}}>
              <h1 style={{fontSize: '40px'}}>
                +
              </h1>
              <Modal
                  open={open}
                  onClose={handleClose}
              >
                <Box sx={style}>
                  <Form className="mt-1" ref={FormRef}>
                    <Form.Control as="textarea" rows={3} placeholder="Content" name={'content'} />
                  </Form>
                  <Button variant="contained" onClick={() => onPostStatus_Click()}>Post</Button>
                </Box>
              </Modal>
            </div>
            {statuses.map((status) => (
                <Status
                    key={status.id}
                    id={status.id}
                    name={status.user_name}
                    content={status.content}
                    image={`${status.image_path}`}
                />
            ))}
          </div>
        </Row>

        <Row>
          <Col md={8}>
            <Row>
            <Col md={8} key={post.id}>
                <Post
                  id={post.id}
                  title={post.title}
                  image={post.image}
                  description={post.description}
                />
              </Col>

              <Col md={4}>
                <Post
                  id={post.id}
                  title={post.title}
                  image={post.image}
                  description={post.description}
                />
              </Col>
            </Row>

            <Row>
              {posts.map((post) => (
                <Col md={4}>
                  <Post
                    id={post.id}
                    title={post.title}
                    image={post.image}
                  // description={post.content}
                  />
                </Col>
              ))}
            </Row>

            {/* //Featured Posts */}
            {/*<Row>*/}
            {/*  <h2 className='mb-4'>Popular</h2>*/}
            {/*  {FeaturedPosts.map((post) => {*/}
            {/*    return (<Col md={6} className='mb-3' style={{ float: 'left' }} key={post.id} onClick={() => PopularHandlerClick(post.id)}>*/}
            {/*      <Row>*/}
            {/*        <Col md="auto" className='d-flex align-items-center'>*/}
            {/*          <h2><b>#{index++}</b></h2>*/}
            {/*        </Col>*/}
            {/*        <Col className='d-flex align-items-center'>*/}
            {/*          <div style={{ width: '95%', border: 'thin solid black', padding: '10px', borderRadius: '5px' }}>*/}
            {/*            <h4>{post.title}</h4>*/}
            {/*            <h4>{post.text}</h4>*/}
            {/*          </div>*/}
            {/*        </Col>*/}
            {/*      </Row>*/}
            {/*    </Col>)*/}
            {/*  })}*/}
            {/*</Row>*/}
            {/* // */}

            {/* //Topics */}
            <Divider/>
            <Row>
              <h1>Topics</h1>
              <div style={{display: 'flex', flexDirection: 'row', gap: '2px', flex: '1', overflowX: 'auto'}}>
                {topics.map((topic) => (
                    <div style={{marginBottom: '20px'}}>
                      <Button variant={'contained'} onClick={() => onclick(topic.id)}>{topic.name}</Button>
                    </div>
                ))}
              </div>

              <Carousel data-bs-theme="dark">
                <Carousel.Item>
                  {/* <ExampleCarouselImage text="First slide" /> */}
                  <div>
                    <img src={banner} style={{height: '350px'}}/>
                  </div>
                  <Carousel.Caption>
                    <h3>First slide label</h3>
                    <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  {/* <ExampleCarouselImage text="Second slide" /> */}
                  <img src={banner} style={{height: '350px'}}/>

                  <Carousel.Caption>
                    <h3>Second slide label</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  {/* <ExampleCarouselImage text="Third slide" /> */}
                  <img src={banner} style={{height: '350px'}}/>
                  <Carousel.Caption>
                    <h3>Third slide label</h3>
                    <p>
                      Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                    </p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>

              <Col className='mt-3'>
                {postsByTopic.map((post) => (
                    <PostTopic
                        Key={post.id}
                        id={post.id}
                        title={post.title}
                        image={post.path}
                        content={post.content}
                    />
                ))}
              </Col>

              <Row className="bg-dark" onClick={() => onMorePostsByTopic_Click()}>
                a
              </Row>
            </Row>
            {/* // */}

            <Row>
              <h2 className='mb-4'>Popular</h2>
              {FeaturedPosts.map((post) => {
                return (<Col md={6} className='mb-3' style={{ float: 'left' }} key={post.id} onClick={() => PopularHandlerClick(post.id)}>
                  <Row>
                    <Col md="auto" className='d-flex align-items-center'>
                      <h2><b>#{index++}</b></h2>
                    </Col>
                    <Col className='d-flex align-items-center'>
                      <div style={{ width: '95%', border: 'thin solid black', padding: '10px', borderRadius: '5px' }}>
                        <h4>{post.title}</h4>
                        <h4>{post.text}</h4>
                      </div>
                    </Col>
                  </Row>
                </Col>)
              })}
            </Row>

            <Divider/>

            <Row>

            </Row>

          </Col>

          <Col md={4}>
            <div>
              <h2>Most view</h2>
              {mostViewPosts.map((post) => (
                  <SubPost
                      id={post.id}
                      title={post.title}
                      image={post.path}
                      content={post.content}
                  />
              ))}
              <div className="bg-dark">ds</div>
            </div>
            <div>
              <h2>Recent Posts</h2>
              {RecentPosts.map((post) => (
                  <SubPost
                      id={post.id}
                      title={post.title}
                      image={post.path}
                      content={post.content}
                  />
              ))}
              <div className="bg-dark" onClick={() => onMoreRecentPost_Click()}>ds</div>
            </div>
          </Col>
        </Row>

      </Container>
    </>
  );
}

export default Home;