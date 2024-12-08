import React, { Component, createRef } from 'react';
import {Modal, Box, Button, Divider, TextField} from '@mui/material';
import {Form} from "react-bootstrap"; // Đảm bảo các thư viện được cài đặt

class EditInfo_modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
        this.formRef = createRef();
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    editInfo = () => {

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

        return (
            <div>
                <Modal open={open} onClose={this.handleClose}>
                    <Box sx={style}>
                        <Form style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                            <TextField label="Name" defaultValue={user.name}></TextField>
                            <TextField label="Age" defaultValue={user.age}></TextField>
                            <TextField label="Gender" defaultValue={user.gender}></TextField>
                            <TextField label="BirthDay" defaultValue={user.date_of_birth}></TextField>
                            <Divider />
                            <TextField label="Created at" defaultValue={user.created_at} disabled></TextField>
                            <Divider />
                            <TextField label="Bio" defaultValue={user.biography}></TextField>
                        </Form>
                    </Box>
                </Modal>
            </div>
        );
    }
}

export default EditInfo_modal;
