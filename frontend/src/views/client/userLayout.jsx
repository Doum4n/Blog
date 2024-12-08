import { Outlet, Link, useNavigate } from "react-router-dom";
import { Nav, NavDropdown, NavItem, Row, Col, Button, Dropdown, Card, Modal } from "react-bootstrap";
import { Navbar } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { Offcanvas } from "react-bootstrap";
import React, {createRef, useEffect, useState} from 'react';
import { signInWithPopup, signOut } from "firebase/auth";
import { Image } from "react-bootstrap";
import { auth } from '../../config/firebase'
import { GoogleProvider } from "../../config/firebase";
import img from '../../assets/user.png';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {Menu, MenuItem} from "@mui/material";
import PostStatus from "./service/UserPostStatus.jsx";
import PostTopic from "./service/UserPostTopic.jsx";

const Layout = () => {

  const [login, setLogin] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null);
  const [userId, setUserId] = useState(null);

  const [show, setShow] = useState(false)
  const showModal = () => setShow(true);
  const closeModal = () => setShow(false);


  useEffect(() => {
    try {
      auth.onAuthStateChanged(function (user) {
        if (user) {
          setUserPhoto(user.photoURL);
          setLogin(true);
          setUserId(user.uid);
          console.log(user.photoURL);
        } else {
          setUserPhoto(img);
          setLogin(false);
        }
      });
    } catch (err) {
      console.error(err);
    };
  });

  const navigate = useNavigate();
  const LoginHandler = () => {
    navigate('/login');
  }

  const PostHandler = () => {
    navigate('/post/upload');
  }

  const LogOut = async () => {
    await signOut(auth);
    closeModal();
    navigate('/home');
  }

  const handleOpen = () => {
    setOpen(true);
  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    navigate('/post/upload');
  };

  function handleCreateTopic() {

  }

  const PostStatusRef = createRef();
  const PostTopicRef = createRef();

  return (
      <>
        <Container className="mt-2">
          <div className="bg-info" style={{height: '70px'}}>BANNER</div>
          <Navbar bg="light" className="border-0 bg-white mb-3">
            <Navbar.Collapse>
              <Navbar.Brand className="ms-3" onClick={() => navigate('/home')}>
                LOGO
              </Navbar.Brand>
              <input className="rounded-4 border-1"></input>
            </Navbar.Collapse>
            <div className="me-2">
              <Button
                  id="basic-button"
                  onClick={handleClick}
              >
                Post
              </Button>
              <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
              >
                <MenuItem onClick={handleClose}>Blog</MenuItem>
                <MenuItem onClick={() => PostStatusRef.current.handleOpen()}>Status</MenuItem>
                <MenuItem onClick={() => PostTopicRef.current.handleOpen()}>Topic</MenuItem>
              </Menu>
            </div>
            <div>
              <PostStatus userId={userId} ref={PostStatusRef}/>
              <PostTopic userId={userId} ref={PostTopicRef} />
            </div>
            {
              <Card className="p-2 rounded-5 me-3">
                <div className="d-flex align-items-center justify-content-between">
                  <Image src={userPhoto} style={{ width: '50px' }} className="me-2" roundedCircle />
                  {/* Thêm nội dung nếu cần ở đây */}
                  <Dropdown style={{ float: 'right' }} drop="">
                    <Dropdown.Toggle className="bg-white border-0 text-dark" id="dropdown-basic" />
                    <Dropdown.Menu>
                      {login &&
                          <div>
                            <Dropdown.Item onClick={() => navigate('/account')}>Account</Dropdown.Item>
                            <Dropdown.Item onClick={showModal}>Log out</Dropdown.Item>
                          </div>}
                      {!login &&
                          <div>
                            <Dropdown.Item onClick={() => navigate('/login')}>Login</Dropdown.Item>
                            <Dropdown.Item onClick={() => navigate('/register')}>Log up</Dropdown.Item>
                          </div>
                      }
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </Card>}
          </Navbar>
          <Modal
              show={show}
              onHide={closeModal}
              backdrop="static"
              keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Warning!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Do you want to Log out?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={LogOut}>Yes</Button>
            </Modal.Footer>
          </Modal>
        </Container>
        <Outlet />
      </>
  )
};

export default Layout;