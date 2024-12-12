import React, { Component, createRef } from 'react';
import {
    Modal,
    Box,
    Button,
    Divider,
    TextField,
    Avatar,
    IconButton,
    InputLabel,
    OutlinedInput,
    InputAdornment
} from '@mui/material';
import {Form, NavbarOffcanvas} from "react-bootstrap";
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateField } from '@mui/x-date-pickers/DateField';
import editor from "../../post/Editor.jsx";
import Notification_modal from "../notification_modal.jsx"; // Đảm bảo các thư viện được cài đặt

class EditInfo_modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            url: null,
        };
        this.formRef = createRef();
        this.NofiticationRef = createRef();
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            this.handleSubmit(file);
        }
    };

    handleSubmit = (file) => {
        const formData = new FormData();
        formData.append('image', file);

        fetch('http://0.0.0.0/image/temp', {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    url: data.path
                });
            })
            .catch((error) => {
                console.error('Error uploading file:', error);
            });
    };

    editInfo = () => {
        const { user } = this.props;
        console.log(this.formRef.current.elements.BirthDay.value);
        fetch('http://0.0.0.0/user/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: user.uuid,
                photoUrl: this.state.url,
                name: this.formRef.current.elements.name.value,
                email: this.formRef.current.elements.email.value,
                age: this.formRef.current.elements.age.value,
                biography: this.formRef.current.elements.bio.value,
                date_of_birth: new dayjs(this.formRef.current.elements.BirthDay.value).format('YYYY-MM-DD'),
                gender: this.formRef.current.elements.gender.value,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                this.NofiticationRef.current.handleOpen();
            })
            .catch((error) => {
                console.error('Error uploading file:', error);
            });
    }

    render() {
        const { open, imageUrl } = this.state;
        const {user} = this.props;

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
            gap: '20px',
            overflowY: 'auto',
            height: '400px',
        };

        const tomorrow = dayjs().add(1, 'day');

        return (
            <div>
                <Modal open={open} onClose={this.handleClose}>
                    <Box sx={style}>
                        <Form ref={this.formRef} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                            <Avatar src={user.photoUrl} />
                            <Form.Control type="file" onChange={this.handleFileChange} className="mb-3" />
                            <TextField name="name" label="Name" defaultValue={user.name}></TextField>
                            <TextField type="email" name="email" label="Email" defaultValue={user.email}></TextField>
                            <TextField name="age" label="Age" defaultValue={user.age}></TextField>
                            <TextField name="gender" label="Gender" defaultValue={user.gender}></TextField>
                            {/*<TextField label="BirthDay" defaultValue={user.date_of_birth}></TextField>*/}
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateField name="BirthDay" value={dayjs(user.date_of_birth)} disableFuture />
                            </LocalizationProvider>
                            <Divider />
                            <TextField label="Created at" defaultValue={user.created_at} disabled></TextField>
                            <Divider />
                            <TextField name="bio" label="Bio" defaultValue={user.biography}></TextField>
                            <Button variant="contained" onClick={() => this.editInfo()}>Submit</Button>
                        </Form>

                        <Notification_modal ref={this.NofiticationRef} title="Notification" message="Edit successfully."/>
                    </Box>
                </Modal>
            </div>
        );
    }
}

export default EditInfo_modal;
