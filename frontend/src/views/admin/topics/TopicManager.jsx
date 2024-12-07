import { Col, Container, Row, Table } from "react-bootstrap";
import * as React from 'react';
import SideBar from "../sidebar/sidebar";
import NavBar from "../navbar/navbar";
import { Checkbox, InputLabel, ListItemText, MenuItem, OutlinedInput, Modal, Typography, Box, Tabs, Tab, Paper, TablePagination, List, ListItem, ListItemButton, Popper, Divider, TextField, filledInputClasses } from "@mui/material";
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import ModalComponent from "../component/topic_modal.jsx";
import {useState, useEffect} from "react";

const Topic = () => {
    const [topics, setTopics] = useState([]);
    const [preTopics, setPreTopics] = useState([]);
    const [column, setColumn] = useState([]);
    const [action, setAction] = useState('');
    const [showFilter, setShowFilter] = useState(false);

    const [selectedTopic, setSelectedTopic] = useState([]);

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
        'Id',
        'Title',
        'Content',
        'UserId',
        'Followers',
        'Open',
        'Created_at',
        'Update_at',
    ]

    const sortedColumn = column.sort((a, b) => {
        return columns.indexOf(a) - columns.indexOf(b);
    });

    const PostCell = ({  Id, Title, Content, UserId, Followers, Open, Created_at, Update_at }) => {
        // for access
        const rowData = { Id, Title, Content, UserId, Followers, Open, Created_at, Update_at };

        const oncheckboxChange = (event) => {
            if (event.target.checked) {
                setSelectedTopic((prev) => [...prev, Id]);
            } else {
                setSelectedTopic((prev) => prev.filter(id => id !== Id));
            }
        };

        return (
            <tr>
                {sortedColumn.map((col) => (
                    <td key={col}>{rowData[col]}</td>
                ))}

                <th className="d-flex justify-content-center">
                    {action === 'View' && (
                        <ModalComponent Id={Id} />
                    )}
                    {action === 'Delete' && (
                        <Checkbox onChange={oncheckboxChange} checked={selectedTopic.includes(Id)} />
                    )}
                </th>
            </tr>
        );
    };

    // initial posts data
    useEffect(() => {
        fetch('http://0.0.0.0/topics/index')
            .then(response => {
                if (!response.ok) throw new Error('Cant get post');
                return response.json();
            })
            .then(data => {
                setTopics(data.data);
                setPreTopics(data.data);
            })
            .catch(error => console.error('There was a problem with the fetch operation:', error));

        setColumn(columns);
    }, [])

    const deletePost = () => {
        fetch('http://0.0.0.0/topics/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                topics: selectedTopic
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

    // delete posts
    const onPerfromClick = () => {
        switch (action) {
            case 'View': {
                console.log("View");
                break;
            }
            case 'Delete': {
                deletePost();
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

    // pagination
    useEffect(() => {
        const url = `http://0.0.0.0/topics/index?per_page=${rowsPerPage}&page=${[page]}`;
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Cannot fetch posts');
                return response.json();
            })
            .then(data => {
                setTopics(data.data);
                setPreTopics(data.data);
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
    //

    const onFillterClick = () => {
        setShowFilter((prev) => !prev);
    };

    const [fillterList, setFillterList] = useState({Column: 'id', Operation: 'Contain', Value: 1});

    const [operator, setOperator] = useState('');
    const [columnFillter, setColumnFillter] = useState('');
    const [value, setValue] = useState('');

    useEffect(() => {

        if (!topics || topics.length === 0) {
            return;
        }

        const filteredPosts = topics.filter((post) => {
            const columnValue = post[fillterList.Column];
            let filterValue = fillterList.Value;

            if (typeof columnValue === 'number') {
                filterValue = Number(filterValue);
            } else if (typeof columnValue === 'boolean') {
                filterValue = filterValue === 'true';
            } else if (typeof columnValue === 'string') {
                filterValue = String(filterValue);
            }

            if(typeof columnValue === 'string' && operator === 'Contain')
                return columnValue.includes(filterValue);
            else
                return columnValue === filterValue;
        });

        if (fillterList.Value.length === 0 || filteredPosts.length === 0) {
            setTopics(preTopics);
        } else {
            setTopics(filteredPosts);
        }
    }, [fillterList]);


    const FillterPopper = () => {

        // columns in database
        const realColumnName = [
            'id',
            'title',
            'content',
            'user_id',
            'followers',
            'open',
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
            <Box sx={{width: 450, bgcolor: 'background.paper', border: 'thin solid', padding: 0 }}>
                <nav>
                    <List>
                        <ListItem disablePadding sx={{ bgcolor: 'white', "&:hover": {bgcolor: "white"} }}>
                            <FormControl fullWidth>
                                <div>
                                    <InputLabel id="column-label" >Column</InputLabel>
                                    <Select
                                        id="column-select"
                                        labelId="column-label"
                                        value={columnFillter}
                                        label="Column"
                                        onChange={handleColumnFillterChange}
                                        sx={{width: 150}}
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
                                        sx={{width: 150}}
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
                                <FillterPopper/>
                            )}
                        </div>

                        <div>
                            <Button variant="contained">Export</Button>
                        </div>

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
                        {topics.map((topic) => (
                            <PostCell
                                Id={topic.id}
                                Title={topic.title}
                                Content={topic.content}
                                Open={topic.open}
                                UserId={topic.userId}
                                Followers={topic.followers}
                                Create_at={topic.created_at}
                                Update_at={topic.updated_at}
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

export default Topic