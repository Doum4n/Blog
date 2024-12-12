import React, {Component, useState} from "react";
import {Box, InputLabel, MenuItem, Modal, TextField} from "@mui/material";
import {Form, FormGroup} from "react-bootstrap";
import Button from "@mui/material/Button";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {auth} from "../../../config/firebase.js";
import Notification_modal from "../component/notification.jsx";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";

class Create_modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
        this.role = "";
        this.FormRef = React.createRef();
        this.NofiticationRef = React.createRef();
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        const { open, role } = this.state;

        const style = {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 700,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            padding: 1
        };

        const fetchData = async (uid) => {
            console.log(this.FormRef.current.elements.password.value);
            await fetch('http://0.0.0.0/user/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: uid,
                    name: this.FormRef.current.elements.name.value,
                    email: this.FormRef.current.elements.gmail.value,
                    role: this.FormRef.current.elements.role.value,
                    password: this.FormRef.current.elements.password.value,
                })
            }).then(res => res.json()).then((data) => console.log(data)).catch((err) => console.log(err));
        }

        const onCreate_Click = () => {
            createUserWithEmailAndPassword(auth, this.FormRef.current.elements.gmail.value, this.FormRef.current.elements.password.value)
                .then((userCredential) => {
                    fetchData(userCredential.user.uid)
                    this.NofiticationRef.current.handleOpen();
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;

                    console.error(errorCode + ' : ' + errorMessage);
                });
        }

        const handleChange = (e) => {
            this.role = e.target.value;
        }

        return (
            <Modal
                open={open}
                onClose={this.handleClose}  // Sửa thành onClose thay vì close
            >
                <Box sx={style}>
                    <Form ref={this.FormRef} className="d-flex flex-column gap-2">
                            <TextField name="name" label="name" variant="outlined"/>
                            <TextField name="gmail" label="gmail" variant="outlined"/>
                            <TextField name="password" label="password" variant="outlined"/>
                        <FormControl fullWidth>
                            <InputLabel id="select-label">Role</InputLabel>
                            <Select
                                labelId="select-label"
                                label="Role"
                                onChange={handleChange}
                                name="role"
                                variant="outlined"
                                value={role}
                            >
                                <MenuItem value={"admin"}>Admin</MenuItem>
                                <MenuItem value={"moderator"}>Moderator</MenuItem>
                                <MenuItem value={'user'}>User</MenuItem>
                            </Select>
                        </FormControl>
                        <Button variant="contained" onClick={() => onCreate_Click()}>Create</Button>
                    </Form>
                    <Notification_modal title="Nofitication" message="Create user successfully" ref={this.NofiticationRef}/>
                </Box>
            </Modal>
        );
    }
}

export default Create_modal;
