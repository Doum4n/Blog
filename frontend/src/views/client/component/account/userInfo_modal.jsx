import React, { Component, createRef } from 'react';
import {Modal, Box, Button, Divider, Avatar} from '@mui/material';
import {Form} from "react-bootstrap"; // Đảm bảo các thư viện được cài đặt

class userInfo_modal extends Component {
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
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <h4>Name: {user.name}</h4>
                            <h4>Age: {user.age}</h4>
                            <h4>Gender: {user.gender}</h4>
                            <h4>Birthday: {user.date_of_birth}</h4>
                            <Divider />
                            <h4>Created at: {new Date(user.created_at).toDateString()}</h4>
                            <Divider />
                            <h4>Biography</h4>
                            <h4>{user.biography}</h4>
                        </div>
                    </Box>
                </Modal>
            </div>
        );
    }
}

export default userInfo_modal;
