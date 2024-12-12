import {Box, Modal, TextField} from "@mui/material";
import React from "react";
import {Form} from "react-bootstrap";
import Button from "@mui/material/Button";
import Notification_modal from "../component/notification.jsx";

class CreateGroup_modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            url: null,
        };
        this.NofiticationRef = React.createRef();
        this.FormRef = React.createRef();
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



    render() {
        const style = {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 700,
            backgroundColor: 'white',
            border: '2px solid #000',
            boxShadow: 24,
            padding: 10,
            overflowY: 'auto',
            maxHeight: '500px'
        };

        const onCreateClick = () => {
            fetch('http://0.0.0.0/group/create',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        'name' : this.FormRef.current.elements.name.value,
                        'description' : this.FormRef.current.elements.description.value,
                        'coverPhotoUrl' :  this.state.url
                    })
                }).then(response => response.json())
                .then((data) => {console.log(data);})
                .catch((error) => {
                    console.error(error);
                })
        }

        return (
            <Modal open={this.state.open} onClose={this.handleClose}>
                <Box style={style}>
                    <Form ref={this.FormRef} style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                        <TextField name="name" label="name" variant="outlined" />
                        <TextField name="description" label="description" variant="outlined" />
                        <Form.Control type="file" onChange={this.handleFileChange} className="mb-3" />
                        <img src={`http://0.0.0.0/storage/${this.state.url}`} alt="" style={{ width: '50%' }} />
                        <Button variant="contained" onClick={() => onCreateClick()}>Create</Button>
                    </Form>

                    <Notification_modal title="Nofitication" message="Create user successfully" ref={this.NofiticationRef}/>
                </Box>
            </Modal>
        )
    }
}

export default CreateGroup_modal;