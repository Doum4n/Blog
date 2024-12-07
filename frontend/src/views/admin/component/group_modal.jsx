import {useEffect, useState} from "react";
import {Avatar, Box, Modal, Tab, Tabs, TextField, Typography} from "@mui/material";
import * as React from "react";
import Button from "@mui/material/Button";
import {Image} from "react-bootstrap";
import Comment from "../../client/component/comment.jsx";
import Post_by_user from "../../client/component/account/post_by_user.jsx";

const ModalComponent = ({Id}) => {
    const [state, setState] = useState({ open: false, selectId: null });
    const [selectedTopic, setSeletedTopic] = useState({});
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);

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

        fetch(`http://0.0.0.0/group/${state.selectId}`)
            .then(response => {
                if (!response.ok) throw new Error('Cant get post');
                return response.json();
            })
            .then(data => {
                setSeletedTopic(data);
            })
            .catch(error => console.error('There was a problem with the fetch operation:', error));

    }, [state.selectId]);
    //

    useEffect(() => {
        fetch(`http://0.0.0.0/users/group/${state.selectId}`)
            .then(response => {
                if (!response.ok) throw new Error('Cant get post');
                return response.json();
            })
            .then(data => {
                setUsers(data.data);
            })
            .catch(error => console.error('There was a problem with the fetch operation:', error));

    }, [state.selectId]);

    useEffect(() => {
        if (!state.selectId) return;

        fetch(`http://0.0.0.0/posts/group/${state.selectId}`)
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
                        <Tab label="Information" />
                        <Tab label="Posts" />
                        <Tab label="Followers" />
                    </Tabs>

                    <CustomTabPanel value={value} index={0}>
                        <div>
                            <h2>{selectedTopic.name}</h2>
                            <p>{new Date(selectedTopic.created_at).toDateString()}</p>
                            <p>Followers: {selectedTopic.followers}</p>
                            <p>{selectedTopic.description}</p>
                        </div>
                    </CustomTabPanel>

                    {/* Posts */}
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
                    {/*  */}

                    <CustomTabPanel value={value} index={2}>
                        <div style={{display: "flex", flexDirection: "column", marginBottom: '10px'}}>
                            <TextField label="Search"></TextField>
                        </div>
                        <div style={{display: "flex", flexDirection: "column", marginBottom: '10px', overflowY: 'auto', height: 200}}>
                            {users.map((user) => (
                                <div key={user.id} style={{display: "flex", flexDirection: "row", alignItems: "center", gap: '10px', marginBottom: '10px'}}>
                                    <Avatar src={user.photoUrl} alt={users.name}/>
                                    {user.name}
                                </div>
                            ))}
                        </div>
                    </CustomTabPanel>

                </Box>
            </Modal>
        </React.Fragment>
    );
};

export default ModalComponent;