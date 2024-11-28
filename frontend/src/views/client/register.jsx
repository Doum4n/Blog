import { Card, Container, FormControl, InputGroup, Row } from "react-bootstrap"
import React from "react";
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';


const Register = () => {

    const navigate = useNavigate();
    const LoginHandler = () => {
        navigate('/login');
    }

    return (
        <>
            <Container className="d-flex justify-content-center align-items-center" 
            style={{ minHeight: "100vh" }}>
               <Card style={{ width: "300px" }} className="p-4"> {/* Đặt độ rộng để căn giữa */}
                    <InputGroup className="mb-3">
                        <InputGroup.Text>Gmail</InputGroup.Text>
                        <FormControl placeholder="Username" />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Text>Password</InputGroup.Text>
                        <FormControl placeholder="Password" type="password" />
                    </InputGroup>
                    <div className="text-end">
                        <Button variant="outline-primary" className="ms-3" onClick={LoginHandler}>
                            Sign up
                        </Button>
                    </div>
                </Card>
            </Container>
        </>
    )
}

export default Register;