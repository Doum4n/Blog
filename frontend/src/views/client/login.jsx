import { Container, FormControl, FormGroup, InputGroup, Alert } from "react-bootstrap"
import React from "react";
import Button from 'react-bootstrap/Button';
import {auth} from '../../config/firebase'
import { GoogleProvider, db } from "../../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import firebase from "firebase/compat/app";
import 'firebase/auth';
import { useState } from "react";
import { ref, set, get } from "firebase/database";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

const Login = () => {

    const [loginStatus, setLoginStatus] = useState(null); // null, 'success' hoặc 'error'

    const navigate = useNavigate();

    const getToken = () => {
        auth.onAuthStateChanged(function(user){
            console.log(user.displayName);
            navigate('/home');
        })
    }

    const RegisterHandler = () => {
        navigate('/register');
    }

    
    const signInWithGoogle = async () => {
        try {
          const result = await signInWithPopup(auth, GoogleProvider);
          const user = result.user;

          const userRef = ref(db, 'users/' + user.uid);
          const snapshot = await get(userRef);

          if(snapshot.exists()){
            console.log('User has existed!');
            navigate('/home');
          }else{
            await set(ref(db, 'users/' + user.uid), {
                username: user.displayName,
                email: user.email,
                photoURL: user.photoURL
              });
            console.log('Add user successfully');
            navigate('/create');
          }
        } catch (error) {
          console.error("Error signing in with Google:", error);
        }
      };

    return (
        <>
            <Container
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "100vh" }} // Đảm bảo căn giữa theo chiều dọc
            >
                <Card style={{ width: '300px' }} className="p-4"> {/* Thêm Card ở đây */}
                    <Form>
                        <FormGroup>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>Gmail</InputGroup.Text>
                                <FormControl 
                                    type="text"
                                    placeholder="Username"
                                    required
                                />
                            </InputGroup>
                            <Form.Control.Feedback type="invalid">
                                Looks good!
                            </Form.Control.Feedback>
                        </FormGroup>

                        <FormGroup>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>Password</InputGroup.Text>
                                <FormControl                 
                                    placeholder="Password"
                                    type="password"
                                    required
                                />
                            </InputGroup>
                            <Form.Control.Feedback type="invalid">
                                invalid
                            </Form.Control.Feedback>
                        </FormGroup>

                        <div className="text-end mb-3"> {/* Căn nút sang bên phải */}
                            <Button className="me-2" variant="primary" type="sublit">Sign in</Button>
                            <Button variant="outline-primary" onClick={RegisterHandler}>Sign up</Button>
                        </div>
                        <Button variant="link" className="w-100" onClick={signInWithGoogle}>Sign in with google</Button>
{/* 
                        {loginStatus === 'success' && (
                        <Alert variant='success'>
                            Login successfully
                        </Alert>
                        )}
                        {loginStatus === 'error' && (
                            <Alert variant='danger'>
                                Login failed
                            </Alert>
                        )} */}
                    </Form>
                </Card>
            </Container>
        </>
    );
}

export default Login;