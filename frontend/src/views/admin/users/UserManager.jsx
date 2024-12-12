import { Col, Container, Image, Row, Table } from "react-bootstrap";
import * as React from 'react';
import SideBar from "../sidebar/sidebar";
import NavBar from "../navbar/navbar";
import {createRef, useEffect, useRef, useState} from "react";
import { Checkbox, InputLabel, ListItemText, MenuItem, OutlinedInput, Modal, Typography, Box, Tabs, Tab, Paper, TablePagination, List, ListItem, ListItemButton, Popper, Divider, TextField, filledInputClasses } from "@mui/material";
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import Comment from "../../client/component/comment";
import SubComment from "../../client/component/subcoment";
import Comment_by_user from '../../client/component/account/comment_by_user';
import Post_by_user from '../../client/component/account/post_by_user';
import Create_modal from "./create_modal.jsx";
import Notification_modal from "../component/notification.jsx";

const User = () => {
    const [users, setUsers] = useState([]);
    const [preUsers, setPreUsers] = useState([]);
    const [column, setColumn] = useState([]);
    const [action, setAction] = useState('View');
    const [showFilter, setShowFilter] = useState(false);

    const [selectedUser, setSelectedUser] = useState([]);

    const handleChange = (event) => {
        setAction(event.target.value);
    };

    const handleColumnChange = (event) => {
        const {
            target: { value },
        } = event;
        setColumn(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    // base columns header
    // using to display table header
    const columns = [
        'Uid',
        'Avatar',
        'Name',
        'Email',
        'Email_Verified_At',
        'Create_at',
        'Update_at',
    ]

    const sortedColumn = column.sort((a, b) => {
        return columns.indexOf(a) - columns.indexOf(b);
    });

    const UserCell = ({ Uid, Avatar, Name, Email, Email_Verified_At, Create_at, Update_at }) => {

        // Style of view pane
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

        // View posts function
        const ModalComponent = () => {
            const [state, setState] = useState({ open: false, selectId: null });
            const [selectedUser, setSeletedUser] = useState({});
            const [comments, setComments] = useState([]);
            const [posts, setPosts] = useState([]);
            const [postComment, setPostCommet] = useState([]);

            const [stateUser, setStateUser] = useState({Posts: posts, Comments: comments});

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

            // TabPane for view function
            function CustomTabPanel(props) {
                const { children, value, index, ...other } = props;

                return (
                    <div role="tabpanel" hidden={value !== index}>
                        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
                    </div>
                );
            }

            useEffect(() => {
                if(state.selectId) {
                    const fetchCommentsAndPosts = async () => {
                        try {
                            const [commentsResponse, postsResponse] = await Promise.all([
                                fetch(`http://0.0.0.0/comment/user/${state.selectId}`),
                                fetch(`http://0.0.0.0/post/user/${state.selectId}`)
                            ]);

                            if (!commentsResponse.ok) {
                                throw new Error("Cant get comments by user id: " + state.selectId);
                            }
                            if (!postsResponse.ok) {
                                throw new Error("Cant get posts by user id: " + state.selectId);
                            }

                            const commentsData = await commentsResponse.json();
                            const postsData = await postsResponse.json();

                            setComments(commentsData.comments);
                            setPosts(postsData.post);
                        } catch (err) {
                            console.error(err);
                        }
                    };
                    fetchCommentsAndPosts();
                }
            }, [state.selectId]);

            useEffect(() => {
                const fetchAllComments = async () => {
                    try {
                        const responses = await Promise.all(
                            comments.map((comment) =>
                                fetch(`http://0.0.0.0/get-post/comment/${comment.id}`)
                            )
                        );

                        const data = await Promise.all(
                            responses.map((response) => {
                                if (!response.ok) {
                                    throw new Error(`Error fetching comment data`);
                                }
                                return response.json();
                            })
                        );

                        setPostCommet(data);
                    } catch (err) {
                        console.error(err);
                    }
                };

                fetchAllComments();
            }, [comments]);

            const [sharedPosts, setSharedposts] = useState([]);

            useEffect(() => {
                if (state.selectId) {
                  const fetchSharedPosts = () => {
                    fetch(`http://0.0.0.0/interact/share/${state.selectId}`)
                      .then((response) => {
                        if (!response.ok) {
                          throw new Error("Can't get shared posts by user id: " + state.selectId);
                        }
                        return response.json();
                      })
                      .then((data) => {
                        setSharedposts(data.posts);
                      })
                      .catch((err) => {
                        console.error(err);
                      });
                  };

                  fetchSharedPosts();
                }
              }, [state.selectId]);


            return (
                <React.Fragment>
                    <Button variant="contained" onClick={() => handleOpen(Uid)}>View</Button>
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
                                <Tab label="Info" />
                                <Tab label="Posts" />
                                <Tab label="Comments" />
                                <Tab label="Share" />
                            </Tabs>

                            {/* Info */}
                            <CustomTabPanel value={value} index={0}>
                                <div style={{ height: 400, overflowY: 'auto' }}>
                                    <img src={Avatar} style={{ width: '100px', height: '100px', borderRadius: '50%' }}/>
                                    <h2>Name: {Name}</h2>
                                    <h3>Email: {Email}</h3>
                                    <h3>Created at: {Create_at}</h3>
                                </div>
                            </CustomTabPanel>
                            {/*  */}

                            {/* Posts */}
                            <CustomTabPanel value={value} index={1}>
                                <div style={{ height: 400, overflowY: 'auto' }}>
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

                            {/* Comments */}
                            <CustomTabPanel value={value} index={2}>
                                <div style={{ height: 400, overflowY: 'auto' }}>

                                    {comments.map((comment) => {
                                        return (
                                            <div key={comment.id}>
                                                {postComment.filter(post => post.id === comment.post_id).map((post) => (
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

                                                <Comment_by_user comment={comment.content} key={comment.id} />
                                                {comment.children.length > 0 ? (
                                                    comment.children.map((childComment) => (
                                                        <div style={{ marginLeft: '70px' }}>
                                                            <Comment_by_user key={childComment.id} comment={childComment.content} className="ms-4" />
                                                        </div>
                                                    ))
                                                ) : null}
                                            </div>
                                        )
                                    })}
                                </div>
                            </CustomTabPanel>
                            {/*  */}

                            {/* Shares */}
                            <CustomTabPanel value={value} index={3}>
                                <div style={{ overflowY: 'auto', height: '400px' }}>
                                    {sharedPosts.map((post) => (
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

                        </Box>
                    </Modal>
                </React.Fragment>
            );
        };

        // for access
        const rowData = { Uid, Avatar, Name, Email, Email_Verified_At, Create_at, Update_at };

        const oncheckboxChange = (event) => {
            if (event.target.checked) {
                setSelectedUser((prev) => [...prev, Uid]);
            } else {
                setSelectedUser((prev) => prev.filter(id => id !== Uid));
            }
        };

        return (
            <tr>
                {sortedColumn.map((col) => (
                    <td key={col}>
                        {col === 'Avatar' ? (
                            <img
                                src={rowData[col]}
                                alt={`${rowData.Name}'s Avatar`}
                                style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                            />
                        ) : (
                            rowData[col]
                        )}
                    </td>
                ))}

                <th className="d-flex justify-content-center">
                    {action === 'View' && (
                        <ModalComponent />
                    )}
                    {action === 'Delete' && (
                        <Checkbox onChange={oncheckboxChange} checked={selectedUser.includes(Uid)} />
                    )}
                </th>
            </tr>
        );
    };

    // initial posts data
    useEffect(() => {
        fetch('http://0.0.0.0/users/index')
            .then(response => {
                if (!response.ok) throw new Error('Cant get post');
                return response.json();
            })
            .then(data => {
                setUsers(data.data);
                setPreUsers(data.data);
            })
            .catch(error => console.error('There was a problem with the fetch operation:', error));

        setColumn(columns);
    }, [])

    const deleteUser = () => {
        fetch('http://0.0.0.0/users/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                users: selectedUser
            })
        }).then(response => {
            if (!response.ok) throw new Error('Cant delete post');
            return response.json();
        })
            .then(data => {
                console.log('deleted');
            })
            .catch(error => console.error('There was a problem with the fetch operation:', error));
    }

    const onPerfromClick = () => {
        switch (action) {
            case 'View': {
                break;
            }
            case 'Delete': {
                deleteUser();
                break;
            }
        }
    }

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    const [page, setPage] = React.useState(1);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    useEffect(() => {
        const url = `http://0.0.0.0/users/index?per_page=${rowsPerPage}&page=${[page]}`;
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Cannot fetch posts');
                return response.json();
            })
            .then(data => {
                setUsers(data.data);
                setPreUsers(data.data);
            })
            .catch(error => console.error('Fetch operation failed:', error));
    }, [page, rowsPerPage]);

    const Pagination = () => {

        const handleChangePage = (event, newPage) => {
            setPage(newPage);
        };

        const handleChangeRowsPerPage = (event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(1);
        };

        return (
            <TablePagination
                component="div"
                count={100}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        );
    }

    const onFillterClick = () => {
        setShowFilter((prev) => !prev);
    };

    const [fillterList, setFillterList] = useState({ Column: 'id', Operation: 'Contain', Value: 1 });

    const [operator, setOperator] = useState('');
    const [columnFillter, setColumnFillter] = useState('');
    const [value, setValue] = useState('');

    useEffect(() => {

        if (!users || users.length === 0) {
            return;
        }

        const filteredPosts = users.filter((user) => {
            const columnValue = user[fillterList.Column];
            let filterValue = fillterList.Value;

            if (typeof columnValue === 'number') {
                filterValue = Number(filterValue);
            } else if (typeof columnValue === 'boolean') {
                filterValue = filterValue === 'true';
            } else if (typeof columnValue === 'string') {
                filterValue = String(filterValue);
            }

            if (typeof columnValue === 'string' && operator === 'Contain')
                return columnValue.includes(filterValue);
            else
                return columnValue === filterValue;
        });

        if (fillterList.Value.length === 0 || filteredPosts.length === 0) {
            setUsers(preUsers);
        } else {
            setUsers(filteredPosts);
        }
    }, [fillterList]);


    const FillterPopper = () => {

        const realColumnName = [
            'uuid',
            'name',
            'email',
            'email_verified_at',
            'created_at',
            'updated_at'
        ]

        const handleOperatorChange = (event) => {
            setOperator(event.target.value);
        }

        const handleColumnFillterChange = (event) => {
            setColumnFillter(event.target.value);
        }

        const onValueChange = (event) => {
            setValue(event.target.value);
            setFillterList((prev) => ({
                ...prev,
                Operation: operator,
                Column: columnFillter,
                Value: event.target.value,
            }));
        }

        return (
            <Box sx={{ width: 450, bgcolor: 'background.paper', border: 'thin solid', padding: 0 }}>
                <nav>
                    <List>
                        <ListItem disablePadding sx={{ bgcolor: 'white', "&:hover": { bgcolor: "white" } }}>
                            <FormControl fullWidth>
                                <div>
                                    <InputLabel id="column-label" >Column</InputLabel>
                                    <Select
                                        id="column-select"
                                        labelId="column-label"
                                        value={columnFillter}
                                        label="Column"
                                        onChange={handleColumnFillterChange}
                                        sx={{ width: 150 }}
                                    >
                                        {realColumnName.map((col) => (
                                            <MenuItem value={col}>{col}</MenuItem>
                                        ))}
                                    </Select>
                                </div>
                            </FormControl>
                            <FormControl fullWidth>
                                <div>
                                    <InputLabel id="operator-label" >Operator</InputLabel>
                                    <Select
                                        id="operator-select"
                                        labelId="operator-label"
                                        value={operator}
                                        label="Operator"
                                        onChange={handleOperatorChange}
                                        sx={{ width: 150 }}
                                    >
                                        <MenuItem value={"Contain"}>Contain</MenuItem>
                                        <MenuItem value={"="}>=</MenuItem>
                                    </Select>
                                </div>
                            </FormControl>
                            <div>
                                <TextField label="value" onChange={onValueChange} autoFocus value={value}></TextField>
                            </div>
                        </ListItem>
                    </List>
                </nav>
            </Box>
        );
    }

    const createAccountRef = useRef(null);
    const notificationRef = createRef();

    return (
        <Container fluid className="mt-3">
            <Row>
                <Col md={2}>
                    <SideBar />
                </Col>
                <Col md={10}>
                    <NavBar />
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <div>
                            <FormControl sx={{ m: 1, width: 300 }}>
                                <InputLabel id="checkbox-label">Tag</InputLabel>
                                <Select
                                    labelId="checkbox-label"
                                    id="multiple-checkbox"
                                    multiple
                                    value={column}
                                    onChange={handleColumnChange}
                                    input={<OutlinedInput label="Tag" />}
                                    renderValue={(selected) => selected.join(', ')}
                                    MenuProps={MenuProps}
                                >
                                    {columns.map((col) => (
                                        <MenuItem key={col} value={col}>
                                            <Checkbox checked={column.includes(col)} />
                                            <ListItemText primary={col} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        <div style={{ height: '10px' }}>
                            <Button variant="contained" onClick={onFillterClick}>Fillter</Button>
                            {showFilter && (
                                <FillterPopper />
                            )}
                        </div>

                        <div>
                            <Button variant="contained">Export</Button>
                        </div>

                        <div>
                            <Create_modal ref={createAccountRef}/>
                            <Button variant="contained" onClick={() => createAccountRef.current.handleOpen()}>Create</Button>
                        </div>

                        <Notification_modal title="Notification" message={"Create user successfully"} ref={notificationRef}/>

                    </div>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                {sortedColumn.map((col) => (
                                    <th key={col}>{col}</th>
                                ))}

                                <th>
                                    <FormControl fullWidth>
                                        <InputLabel id="select-label">Action</InputLabel>
                                        <Select
                                            labelId="select-label"
                                            id="select"
                                            value={action}
                                            label="Action"
                                            onChange={handleChange}
                                            style={{ minWidth: '90px' }}
                                        >
                                            <MenuItem value={'View'}>View</MenuItem>
                                            <MenuItem value={'Delete'}>Delete</MenuItem>
                                        </Select>
                                    </FormControl>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <UserCell
                                    Uid={user.uuid}
                                    Name={user.name}
                                    Avatar={user.photoUrl}
                                    Email={user.email}
                                    Email_Verified_At={new Date(user.email_verified_at).toLocaleString()} //user.email_verified_at
                                    Create_at={new Date(user.created_at).toLocaleString()} //new Date(dateString).toLocaleString() user.created_at
                                    Update_at={new Date(user.updated_at).toLocaleString()} 
                                />
                            ))}
                        </tbody>
                    </Table>
                    <Button variant="contained" onClick={onPerfromClick}>Perform</Button>
                    <Pagination />
                </Col>
            </Row>
        </Container>
    );
}

export default User