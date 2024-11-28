// import './style/style.css'
import { Carousel, Container, Navbar, NavbarBrand, NavbarCollapse } from 'react-bootstrap';
import Toast from 'react-bootstrap/Toast';
import Button from 'react-bootstrap/Button';
import React, { useEffect, useState } from 'react';
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


  var index = 1;
  const navigate = useNavigate();
  const PopularHandlerClick = (id) => {
    navigate(`/post/${id}`);
  }

  const onclick = (id) => {
    console.log('Topic id is: ' + id);
  }

  return (
    <>
      <Container>
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
            {/* // */}

            {/* //Topics */}
            <Row>
              {topics.map((topic) => (
                <Col md='auto' onClick={() => onclick(topic.id)}>
                  {topic.name}
                </Col>
              ))}

              <Carousel data-bs-theme="dark">
                <Carousel.Item>
                  {/* <ExampleCarouselImage text="First slide" /> */}
                  <div>
                    <img src={banner} style={{ height: '350px' }} />
                  </div>
                  <Carousel.Caption>
                    <h3>First slide label</h3>
                    <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  {/* <ExampleCarouselImage text="Second slide" /> */}
                  <img src={banner} style={{ height: '350px' }} />

                  <Carousel.Caption>
                    <h3>Second slide label</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  {/* <ExampleCarouselImage text="Third slide" /> */}
                  <img src={banner} style={{ height: '350px' }} />
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
                    id={post.id}
                    title={post.title}
                    image={post.path}
                    content={post.content}
                  />
                ))}
              </Col>
            </Row>
            {/* // */}

          </Col>

          <Col md={4}>
            <h2>Most view</h2>
            {mostViewPosts.map((post) => (
              <SubPost
                id={post.id}
                title={post.title}
                image={post.path}
                content={post.content}
              />
            ))}
          </Col>
        </Row>

      </Container>
    </>
  );
}

export default Home;