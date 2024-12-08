import React, { Component, createRef } from 'react';
import {Modal, Box, Button, TextField} from '@mui/material';
import {Form} from "react-bootstrap"; // Đảm bảo các thư viện được cài đặt

class PostTopic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            topicId: null,
            url: [],
            imageUrl: [],
        };
        this.formRef = createRef();
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
                this.setState((prevState) => ({
                    url: [...prevState.url, data.path],
                    imageUrl: [...prevState.imageUrl, data.path],
                }));
            })
            .catch((error) => {
                console.error('Error uploading file:', error);
            });
    };

    onPostStatusClick = async () => {
        const { userId } = this.props;
        const content = this.formRef.current.elements.content.value;
        const title = this.formRef.current.elements.title.value;
        const tags = this.formRef.current.elements.tags.value;

        await fetch(`http://0.0.0.0/topic/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                title: title,
                content: content,
                tag_name: tags,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Can't create status!");
                }
                return response.json();
            })
            .then((data) => {
                this.setState({ topicId: data.id }, () => {
                    this.StoreImage();
                });
            })
            .catch((error) => {
                console.error('Error creating status:', error);
            });
    };

    StoreImage = async () => {
        const { url } = this.state;
        console.log(url);

        await fetch('http://0.0.0.0/image/store', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                topic_id : this.state.topicId,
                paths : this.state.url
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Store image success:', data.path);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    render() {
        const { open, imageUrl } = this.state;

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
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            overflowY: 'auto',
            height: '400px',
        };

        return (
            <div>
                <Modal open={open} onClose={this.handleClose}>
                    <Box sx={style}>
                        <Form className="mt-1" ref={this.formRef} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                            <TextField label="Title" name="title" />
                            <TextField label="Tags" name="tags"/>
                            <Form.Control as="textarea" rows={3} placeholder="Content" name="content" />
                        </Form>
                        <Form.Control type="file" onChange={this.handleFileChange} className="mb-3" />
                        <Button variant="contained" onClick={this.onPostStatusClick}>
                            Post
                        </Button>
                        <div>
                            {imageUrl.map((path) => (
                                <img
                                    src={`http://0.0.0.0:/storage/${path}`}
                                    alt=""
                                    style={{ width: '200px' }}
                                    key={path}
                                />
                            ))}
                        </div>
                    </Box>
                </Modal>
            </div>
        );
    }
}

export default PostTopic;
