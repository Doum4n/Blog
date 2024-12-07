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
import PostForum from './component/topic/post_forum.jsx';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Status from "./component/status/status.jsx";
import {Box, Divider, Modal} from "@mui/material";
import SubComment from "./component/subcoment.jsx";
import Button from "@mui/material/Button";
import {auth} from "../../config/firebase.js";
import Topic from "./component/topic/topic.jsx";

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
  const [PopularPosts, setPopularPosts] = useState([]);
  const [postsByTopic, setPostsByTopic] = useState([]);
  const [userId, setUserId] = useState({});
  const [statuses, setStatuses] = useState([]);
  const [RecentPosts, setRecentPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [postNotFeaturedPosts, setPostNotFeaturedPosts] = useState([]);
  const [postsByHashtags, setPostsByHashtags] = useState([]);
  const [top4Groups, setTop4Groups] = useState([]);
  const [forums, setForums] = useState([]);
  const [topics, setTopics] = useState([]);

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
    Promise.all([
      fetch('http://0.0.0.0/post/most-viewed'),
      fetch('http://0.0.0.0/post/Popular'),
      fetch('http://0.0.0.0/post/Featured'),
      fetch('http://0.0.0.0/posts/not-popular'),
      fetch('http://0.0.0.0/posts/recent'),
      fetch('http://0.0.0.0/forums'),
      fetch('http://0.0.0.0/post/forum/5'),
      fetch('http://0.0.0.0/status/index'),
      fetch('http://0.0.0.0/users/index'),
        fetch('http://0.0.0.0/posts/hashtag/1'),
        fetch('http://0.0.0.0/group/top4'),
        fetch('http://0.0.0.0/topics/index'),
    ])
        .then(([mostViewedRes, PopularRes, featuredRes, notFeaturedRes, recentRes, forumsRes, postsByTopicRes, statusesRes, usersRes, postsbyHashTagRes, top4GroupsRes, topicsRes]) => {
          return Promise.all([
            mostViewedRes.json(),
            PopularRes.json(),
            featuredRes.json(),
            notFeaturedRes.json(),
            recentRes.json(),
            forumsRes.json(),
            postsByTopicRes.json(),
            statusesRes.json(),
            usersRes.json(),
            postsbyHashTagRes.json(),
              top4GroupsRes.json(),
              topicsRes.json(),
          ]);
        })
        .then(([mostViewedData, popularData, featuredData, notFeaturedData, recentData, forumsData, postsByTopicData, statusesData, usersData, postsbyHashTagData, top4GroupsData, topicsData]) => {
          setMostViewPosts(mostViewedData.posts);
          setPopularPosts(popularData.posts);
          setFeaturedPosts(featuredData);
          setPostNotFeaturedPosts(notFeaturedData);
          setRecentPosts(recentData);
          setForums(forumsData);
          setPostsByTopic(postsByTopicData);
          setStatuses(statusesData.data);
          setUsers(usersData.data);
          setPostsByHashtags(postsbyHashTagData.data);
          setTop4Groups(top4GroupsData);
          setTopics(topicsData.data);

          setIsLoading(false);
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);

          setIsLoading(false);
        });
  }, []);

  var index = 1;
  const navigate = useNavigate();
  const PopularHandlerClick = (id) => {
    navigate(`/post/${id}`);
  }


  const [selectedTopic, setSelectedTopic] = useState(null);
  const onclick = (id) => {
    fetch(`http://0.0.0.0/post/forum/${id}`)
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
      navigate(`/forum/${selectedTopic}`);
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
    overflowY: 'auto',
    height: '400px',
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
          setStatusId(data)
        });
  }

  const [statusId, setStatusId] = useState(null);
  const [url, setUrl] = useState([]);
  const [imageUrl, setImageUrl] = useState([]);

  useEffect(() => {
    if(statusId && url)
      StoreImage();
      setImageUrl([]);
  }, [statusId])

  const StoreImage = async () => {
    await fetch('http://0.0.0.0/image/store', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        post_id: null,
        status_id : statusId,
        paths : url
      }),
    })
        .then((response) => response.json())
        .then((data) => {
          console.log('Store image success:', data.path);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleSubmit(file);
    }
  };

  const handleSubmit = (file) => {
    const formData = new FormData();
    formData.append('image', file);

    fetch('http://0.0.0.0/image/temp', {
      method: 'POST',
      body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
          setUrl(prev => [...prev, data.path]);
          setImageUrl(prev => [...prev, data.path]);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  };

  return (
    <>
      <Container>
        <Row>
          <div style={{display: 'flex', flexDirection: 'row', gap: '10px', overflowX: 'auto'}}>
            <div onClick={() => handleOpen()} className="bg-secondary d-flex justify-content-center align-items-center" style={{height: '200px', width: '150px', borderRadius: '10px'}} >
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
                  <Form.Control type="file" onChange={handleFileChange} className='mb-3'/>
                  <Button variant="contained" onClick={() => onPostStatus_Click()}>Post</Button>
                  <div>
                    {imageUrl.map((path) => (
                        <img src={`http://0.0.0.0:/storage/${path}`} alt="" style={{ width: '200px' }} key={path} />
                    ))}
                  </div>
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

            {/* //Forums */}
            <Divider/>
            <Row>
              <h1>Forums</h1>
              <div style={{display: 'flex', flexDirection: 'row', gap: '2px', flex: '1', overflowX: 'auto'}}>
                {forums.map((topic) => (
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
                    <PostForum
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

            {/*FeaturedPosts*/}
            <Row>
              <h2 className='mb-4'>Popular</h2>
              {PopularPosts.map((post) => {
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
            {/**/}

            <Divider/>

            {/* Featured posts */}
              <h2>Featured Posts</h2>
            {isLoading ? "Loading..." : FeaturedPosts.length > 0 ? (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', backgroundColor: 'gray', padding: '20px', paddingTop: '20px'}}>
                      <img src={FeaturedPosts[0].image_path} alt={post.title} style={{width: '60%'}}/>
                      {FeaturedPosts[0].title}
                    </div>
              ) : "No post found"}
            <div style={{display: 'flex', flexDirection: 'row', gap: '2px', overflowX: 'auto'}}>
                {FeaturedPosts.map((post) => (
                    <div key={post.id} style={{width:'300px', flexShrink: 0}} onClick={() => navigate(`/post/${post.id}`)}>
                      <img src={post.image_path} alt={post.title} style={{ width: '100%' }} />
                      {post.title}
                    </div>
                ))}
              </div>
            {/**/}

            <Divider/>

            {/* Featured posts */}
            <Row>
              <div style={{display: 'flex', flexDirection: 'column', gap: '2px'}}>
                {postNotFeaturedPosts.map((post) => (
                    <div
                        key={post.id}
                        style={{
                          // width: '900px'
                          flexShrink: 0,
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: '10px'
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
            </Row>

            <Divider/>

            {/* Posts by hashtag */}
            {/*<Row style={{position: 'static'}}>*/}
              {isLoading ? (
                  "Loading..."
              ) : postsByHashtags.length > 0 ? (
                  <h1>#{postsByHashtags[0].tag_name}</h1>
              ) : (
                  "No post found"
              )}
              <div
                  style={{
                    display: "flex",
                    flexDirection: "column", // Container bên ngoài theo cột
                    gap: "10px",
                    overflowX: "hidden",
                    padding: "20px",
                    backgroundColor: "gray",
                  }}
              >
                <div
                    style={{
                      display: "flex", // Container bên trong các bài post theo hàng ngang
                      flexDirection: "row",
                      gap: "10px",
                      overflowX: "auto", // Cuộn ngang nếu cần
                    }}
                >
                  {postsByHashtags.map((post) => (
                      <div
                          key={post.id}
                          style={{
                            flexShrink: 0, // Đảm bảo kích thước cố định
                            display: "flex",
                            flexDirection: "column", // Bố cục theo cột
                            alignItems: "center", // Canh giữa nội dung
                            width: "300px",
                            padding: "10px",
                            gap: "10px",
                            backgroundColor: "white",
                            borderRadius: "5px",
                          }}
                          onClick={() => navigate(`/post/${post.id}`)}
                      >
                        <img
                            src={post.image_path}
                            alt={post.title}
                            style={{
                              width: "100%",
                              height: "200px",
                              objectFit: "cover",
                              borderRadius: "5px",
                            }}
                        />
                        <p
                            style={{
                              textAlign: "center", // Canh giữa tiêu đề
                              margin: "0",
                              fontSize: "16px",
                              fontWeight: "bold",
                            }}
                        >
                          {post.title}
                        </p>
                      </div>
                  ))}
                </div>
                <Button variant="contained">More</Button>
              </div>
            {/*</Row>*/}

            {/*  */}

            <Row>
              <div>
                {topics.map((topic) => (
                    <Topic
                      title={topic.title}
                      content={topic.content}
                      username={topic.username}
                      key={topic.id}
                      id={topic.id}
                      created_at={topic.created_at}
                    />
                ))}
              </div>
            </Row>

          </Col>

          <Col md={4}>
            <div>
              {/*Most view*/}
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
              {/*  */}
            </div>
            <div>
              {/*Recent post*/}
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
              {/*  */}
            </div>
            <div>
              {/*Influencers*/}
              <Col className="d-flex gap-2 flex-column">
                <h1>Influencer</h1>
                {users.map((user) => (
                    <div className="d-flex gap-2 flex-row align-items-center" onClick={() => navigate(`/user/${user.uuid}`)}>
                      <img src={user.photoUrl} style={{height: '60px', width: '60px', borderRadius: '50%'}}/>
                      <h3>{user.name}</h3>
                    </div>
                ))}
              </Col>
              {/*  */}
            </div>

            <Divider/>

            {/*Groups*/}
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
                  {top4Groups.map(group => (
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
          </Col>
        </Row>

        <Row className="bg-dark" style={{height: '100px'}}>

        </Row>
      </Container>
    </>
  );
}

export default Home;