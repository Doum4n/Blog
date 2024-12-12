import React, { Component } from "react";
import {Box, Modal, TextField} from "@mui/material";
import {Form, FormGroup} from "react-bootstrap";
import Button from "@mui/material/Button";

class Notification_modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
        this.FormRef = React.createRef();
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        const { open } = this.state;

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

        const {title, message} = this.props;

        return (
            <Modal
                open={open}
                onClose={this.handleClose}  // Sửa thành onClose thay vì close
            >
                <Box sx={style}>
                    <h2>{title}</h2>
                    <p>{message}</p>
                </Box>
            </Modal>
        );
    }
}

export default Notification_modal;
