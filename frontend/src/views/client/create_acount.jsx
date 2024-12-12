import { Container, Card, Form, Button, FormGroup, InputGroup, FormControl } from "react-bootstrap"
import { useState } from "react";
import { auth } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
const create_account = () => {

    const [validated, setValidated] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [uid, setUid] = useState("");
    const navigate = useNavigate();
    const usernameChange = (event) => setUsername(event.target.value)

    const getData = () => {
        return new Promise((resolve) => {
            auth.onAuthStateChanged((user) => {
                if (user) {
                    resolve(user);
                } else {
                    resolve(null);
                }
            });
        });
    };

    const RegisterHandler = async () => {
        const user = await getData();
        if (user && username) {
            const { email, uid } = user;
            await fetch('http://0.0.0.0/user/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: uid,
                    name: username,
                    email: email,
                    photoUrl: user.photoURL,
                    role: 'user',
                })
            }).then(Response => {
                if (!Response.ok)
                    throw new Error('Cannot create user');
                // updateUserPhoto();
                return Response.json();
            }).then(data => {
                console.log(data);
                navigate('/home');
            }).catch(err => {
                console.error(err);
            });
        }
    };

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
    };

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh" }} // Đảm bảo căn giữa theo chiều dọc
        >
            <Card style={{ width: '300px' }} className="p-4 border-0 bg-light">
                <Form noValidate validated={validated}>
                    <FormGroup>
                        <FormControl
                            type="text"
                            placeholder="Username"
                            required
                            value={username}
                            onChange={usernameChange}
                        />
                        <Form.Control.Feedback type="invalid">
                            Please choose a username.
                        </Form.Control.Feedback>
                    </FormGroup>

                    <div className="text-end mt-3"> {/* Căn nút sang bên phải */}
                        <Button variant="primary" onClick={RegisterHandler}>Sign up</Button>
                    </div>
                </Form>
            </Card>
        </Container>
    )
}

export default create_account