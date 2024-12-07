import {useEffect, useState} from "react";
import {Box, Modal, Tab, Tabs, TextField, Typography} from "@mui/material";
import * as React from "react";
import Button from "@mui/material/Button";
import {Image} from "react-bootstrap";
import Comment from "../../client/component/comment.jsx";
import Post_by_user from "../../client/component/account/post_by_user.jsx";

const ModalComponent = ({Id, Name, Created_at, Updated_at, PostCount, TopicCount}) => {
    const [state, setState] = useState({ open: false, selectId: null });
    const [posts, setPosts] = useState([]);

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

    // Get comments
    useEffect(() => {
        if (!state.selectId) return;

        fetch(`http://0.0.0.0/posts/hashtag/${state.selectId}`)
            .then(response => {
                if (!response.ok) throw new Error('Cant get post');
                return response.json();
            })
            .then(data => {
                setPosts(data.data);
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
                        <Tab label="Posts" />
                        <Tab label="Topcis" />
                    </Tabs>

                    {/* Posts */}
                    <CustomTabPanel value={value} index={0}>
                        <div>
                            <h2>{Name}</h2>
                            <p>{Created_at}</p>
                            <p>Posts: {PostCount}</p>
                            <p>Topics: {TopicCount}</p>
                        </div>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        <div style={{display: "flex", flexDirection: "column", marginBottom: '10px'}}>
                            <TextField label="Search"></TextField>
                        </div>
                        <div style={{height: 400, overflowY: 'auto'}}>
                            {posts.map((post) => (
                                <Post_by_user
                                    id={post.id}
                                    title={post.title}
                                    image={`http://0.0.0.0/storage/${post.path}`}
                                    likes={post.likes}
                                    comments={post.comments}
                                    description={post.content}
                                    key={post.id}
                                />
                            ))}
                        </div>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={2}>
                        <div>

                        </div>
                    </CustomTabPanel>
                    {/*  */}

                </Box>
            </Modal>
        </React.Fragment>
    );
};

export default ModalComponent;