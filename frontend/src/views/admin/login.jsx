import {Card, Container, Form, FormControl, FormGroup, InputGroup} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import React, {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../../config/firebase.js";

const Login = () => {
    const navigate = useNavigate();
    const FormRef = useRef(null);

    const validAccount = async () => {
        const gmail = FormRef.current.elements.gmail.value;
        const password = FormRef.current.elements.password.value;

        signInWithEmailAndPassword(auth, gmail, password)
            .then(() => {
                // Signed in
                navigate("/admin");
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                console.error(errorCode + " : " + errorMessage);
            });
    };


    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh" }} // Đảm bảo căn giữa theo chiều dọc
        >
            <Card style={{ width: '300px' }} className="p-4"> {/* Thêm Card ở đây */}
                <Form ref={FormRef}>
                    <FormGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>Gmail</InputGroup.Text>
                            <FormControl
                                name="gmail"
                                type="text"
                                placeholder="gmail"
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
                                name="password"
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
                        <Button className="me-2" variant="primary" onClick={() => validAccount()}>Sign in</Button>
                    </div>
                </Form>
            </Card>
        </Container>
    )
}

export default Login;