import React, { useState, useRef } from 'react';
import { Modal, Box, Button, TextField } from '@mui/material';
import { Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const PostTopic = ({ userId, topic }) => {
    const [open, setOpen] = useState(false);
    const [topicId, setTopicId] = useState(null);
    const [url, setUrl] = useState([]);
    const [imageUrl, setImageUrl] = useState([]);

    const formRef = useRef(null);
    const { id } = useParams();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            handleSubmit(file);
        }
    };

    const handleSubmit = async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('http://0.0.0.0/image/temp', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            setUrl((prev) => [...prev, data.path]);
            setImageUrl((prev) => [...prev, data.path]);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const onPostStatusClick = async () => {
        const content = formRef.current.elements.content.value;
        const title = formRef.current.elements.title.value;
        const tags = formRef.current.elements.tags.value;

        try {
            const response = await fetch('http://0.0.0.0/topic/create', {
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
            });

            if (!response.ok) {
                throw new Error("Can't create status!");
            }

            const data = await response.json();
            setTopicId(data.id);
            StoreImage();
        } catch (error) {
            console.error('Error creating status:', error);
        }
    };

    const StoreImage = async () => {
        try {
            const response = await fetch('http://0.0.0.0/image/store', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topic_id: topicId,
                    paths: url,
                }),
            });

            const data = await response.json();
            console.log('Store image success:', data.path);
        } catch (error) {
            console.error('Error storing image:', error);
        }
    };

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
            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <Form
                        className="mt-1"
                        ref={formRef}
                        style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                    >
                        <TextField defaultValue={topic?.title} label="Title" name="title" />
                        <TextField label="Tags" name="tags" />
                        <Form.Control as="textarea" rows={3} placeholder="Content" name="content" />
                    </Form>
                    <Form.Control type="file" onChange={handleFileChange} className="mb-3" />
                    <Button variant="contained" onClick={onPostStatusClick}>
                        Post
                    </Button>
                    <div>
                        {imageUrl.map((path) => (
                            <img
                                src={`http://0.0.0.0/storage/${path}`}
                                alt="Uploaded"
                                style={{ width: '200px' }}
                                key={path}
                            />
                        ))}
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default PostTopic;