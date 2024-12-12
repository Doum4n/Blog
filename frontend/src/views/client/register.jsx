import {Card, Container, Form, FormControl, InputGroup, Row} from "react-bootstrap"
import React, {useRef} from "react";
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {createUserWithEmailAndPassword} from "firebase/auth";
import {auth} from "../../config/firebase.js";

const Register = () => {
    const navigate = useNavigate();
    const FormRef = useRef(null);

    const createUser = async (uid) => {
        await fetch('http://0.0.0.0/user/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: uid,
                name: FormRef.current.elements.name.value,
                email: FormRef.current.elements.gmail.value,
                role: 'user',
                password: FormRef.current.elements.password.value,
            })
        }).then(res => res.json()).then((data) => console.log(data)).catch((err) => console.log(err));
    }

    const LoginHandler = () => {
            createUserWithEmailAndPassword(auth, FormRef.current.elements.gmail.value, FormRef.current.elements.password.value)
                .then((userCredential) => {
                    createUser(userCredential.user.uid)
                    // navigate('/home');
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;

                    console.error(errorCode + ' : ' + errorMessage);
                });
    }

    return (
        <>
            <Container className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh" }}>
               <Card style={{ width: "300px" }} className="p-4"> {/* Đặt độ rộng để căn giữa */}
                   <Form ref={FormRef}>
                       <InputGroup className="mb-3">
                           <InputGroup.Text>Name</InputGroup.Text>
                           <FormControl name="name"/>
                       </InputGroup>
                       <InputGroup className="mb-3">
                           <InputGroup.Text>Gmail</InputGroup.Text>
                           <FormControl name="gmail" type="email" />
                       </InputGroup>
                       <InputGroup className="mb-3">
                           <InputGroup.Text>Password</InputGroup.Text>
                           <FormControl name="password" type="password" />
                       </InputGroup>
                       <div className="text-end">
                           <Button variant="outline-primary" className="ms-3" onClick={LoginHandler}>
                               Sign up
                           </Button>
                       </div>
                   </Form>
                </Card>
            </Container>
        </>
    )
}

export default Register;