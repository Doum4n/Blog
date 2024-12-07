import {useEffect, useState} from "react";
import {Box, Modal, Tab, Tabs, Typography} from "@mui/material";
import * as React from "react";
import Button from "@mui/material/Button";
import {Image} from "react-bootstrap";
import Comment from "../../client/component/comment.jsx";

const ModalComponent = ({Id}) => {
    const [state, setState] = useState({ open: false, selectId: null });
    const [selectedPost, setSeletedPost] = useState({});
    const [comments, setComments] = useState([]);

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleOpen = (id) => {
        setState({ open: true, selectId: id });
    };
    const handleClose = () => {
        setState({ ...state, open: false });
    };

    // Get Posts
    useEffect(() => {
        if (!state.selectId) return;

        fetch(`http://0.0.0.0/get-post/detail/${state.selectId}`)
            .then(response => {
                if (!response.ok) throw new Error('Cant get post');
                return response.json();
            })
            .then(data => {
                setSeletedPost(data);
            })
            .catch(error => console.error('There was a problem with the fetch operation:', error));

    }, [state.selectId]);
    //

    // Get comments
    useEffect(() => {
        if (!state.selectId) return;

        fetch(`http://0.0.0.0/get/commentDetail/${state.selectId}`)
            .then(response => {
                if (!response.ok) throw new Error('Cant get post');
                return response.json();
            })
            .then(data => {
                setComments(data);
            })
            .catch(error => console.error('There was a problem with the fetch operation:', error));

    }, [state.selectId]);
    //

    // TabPane for view function
    function CustomTabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
            >
                {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
            </div>
        );
    }
    //

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

    return (
        <React.Fragment>
            <Button variant="contained" onClick={() => handleOpen(Id)}>View</Button>
            <Modal
                open={state.open}
                onClose={handleClose}
            >
                <Box sx={style}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        textColor="secondary"
                        indicatorColor="secondary"
                        variant="fullWidth"
                    >
                        <Tab label="Content" />
                        <Tab label="Images" />
                        <Tab label="Comments" />
                    </Tabs>

                    {/* Posts */}
                    <CustomTabPanel value={value} index={0}>
                        <Typography variant="h6" component="h2">
                            {selectedPost.created_at}
                            <br />
                            {selectedPost.title}
                            <br />
                            {selectedPost.name}
                        </Typography>
                        <Typography variant="body1" sx={{ height: 200, overflowY: 'auto' }}>
                            {selectedPost.content}
                        </Typography>
                    </CustomTabPanel>
                    {/*  */}

                    {/* Images */}
                    <CustomTabPanel value={value} index={1}>
                        <div style={{ overflowY: 'auto', height: '400px' }}>
                            {selectedPost.images && selectedPost.images.split(',').map((path, index) => (
                                <Image key={index} src={path} style={{ width: '50%' }} />
                            ))}
                        </div>
                    </CustomTabPanel>
                    {/*  */}

                    {/* Comments */}
                    <CustomTabPanel value={value} index={2}>
                        <div style={{ overflowY: 'auto', height: '400px' }}>
                            {selectedPost.comments_id && selectedPost.comments_id.split(',').map((id) => (
                                <p>{id}</p>
                            ))}
                            {comments.map((comment) => (
                                <div key={comment.id}>
                                    {comment.parent_id === null ? (
                                        <Comment
                                            updated_at={comment.updated_at}
                                            nameUser={comment.name}
                                            ImageSrc={comment.photoUrl}
                                            comment={comment.content}
                                            id={comment.id}
                                            type="post"
                                            disableReply={true}
                                        />
                                    ) : null}
                                    {comment.children.length > 0 ? (
                                        comment.children.map((childComment) => (
                                            <div style={{ marginLeft: '70px' }}>
                                                <Comment
                                                    updated_at={childComment.updated_at}
                                                    nameUser={childComment.name}
                                                    ImageSrc={childComment.photoUrl}
                                                    comment={childComment.content}
                                                    id={childComment.id}
                                                    type="post"
                                                    disableReply={true}
                                                />
                                            </div>
                                        ))
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </CustomTabPanel>
                    {/*  */}

                </Box>
            </Modal>
        </React.Fragment>
    );
};

export default ModalComponent;