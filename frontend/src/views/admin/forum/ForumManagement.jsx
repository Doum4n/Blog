import {Col, Container, Form, Image, Row, Table} from "react-bootstrap";
import * as React from 'react';
import SideBar from "../sidebar/sidebar";
import NavBar from "../navbar/navbar";
import {forwardRef, useEffect, useRef, useState} from "react";
import { set } from "firebase/database";
import {
    Checkbox,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Modal,
    Typography,
    Box,
    Tabs,
    Tab,
    Paper,
    TablePagination,
    List,
    ListItem,
    ListItemButton,
    Popper,
    Divider,
    TextField,
    filledInputClasses,
    Snackbar
} from "@mui/material";
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import PropTypes from 'prop-types';
import Comment from "../../client/component/comment";
import { setStyleProp } from "html-react-parser/lib/utilities";

const Forum = () => {
    const [topics, setTopics] = useState([]);
    const [preTopics, setPreTopics] = useState([]);
    const [column, setColumn] = useState([]);
    const [action, setAction] = useState('');
    const [showFilter, setShowFilter] = useState(false);

    const [selectedTopics, setSelectedTopics] = useState([]);

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
        'Name',
        'Description',
    ]

    const sortedColumn = column.sort((a, b) => {
        return columns.indexOf(a) - columns.indexOf(b);
    });

    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const TopicCell = ({ Id, Name, Description }) => {

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
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
        };

        // View topics function
        const ModalComponent = () => {
            const [state, setState] = useState({ open: false, selectId: null });
            const [selectedTopic, setSeletedTopic] = useState({});

            const handleOpen = (id) => {
                setState({ open: true, selectId: id });
            };
            const handleClose = () => {
                setState({ ...state, open: false });
            };

            // Get Topic
            useEffect(() => {
                if (!state.selectId) return;

                fetch(`http://0.0.0.0/forum/${state.selectId}`)
                    .then(response => {
                        if (!response.ok) throw new Error('Cant get forum');
                        return response.json();
                    })
                    .then(data => {
                        setSeletedTopic(data);
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

            const FormRef = useRef(null);


            const OnSubmitClick = (e) => {
                e.preventDefault();
                fetch(`http://0.0.0.0/forum/edit`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            id: FormRef.current.elements.id.value,
                            name:  FormRef.current.elements.name.value,
                            description:  FormRef.current.elements.description.value,
                        })
                    })
                    .then(response => {
                        if (!response.ok) throw new Error('Cant edit forum');
                        return response.json();
                    })
                    .then(data => {
                        setSeletedTopic(data);
                    })
                    .catch(error => console.error('There was a problem with the fetch operation:', error));

                setOpen(true);
            }



            return (
                <React.Fragment>
                    <Button variant="contained" onClick={() => handleOpen(Id)}>View</Button>
                    <Modal
                        open={state.open}
                        onClose={handleClose}
                    >
                        <Box sx={style}>
                            <Form ref={FormRef}>
                                <Form.Group>
                                    <Form.Label>Id</Form.Label>
                                    <Form.Control name={"id"} type="text" defaultValue={selectedTopic.id} disabled={true}/>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control name={"name"} type="text" defaultValue={selectedTopic.name}/>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Desciption</Form.Label>
                                    <Form.Control name={"description"} type="text" defaultValue={selectedTopic.description}/>
                                </Form.Group>
                                <Button type={"button"} variant={"contained"} className={"mt-3"} onClick={OnSubmitClick}>Submit</Button>
                            </Form>
                        </Box>
                    </Modal>
                </React.Fragment>
            );
        };

        // for access
        const rowData = { Id, Name, Description };

        const oncheckboxChange = (event) => {
            if (event.target.checked) {
                setSelectedTopics((prev) => [...prev, Id]);
            } else {
                setSelectedTopics((prev) => prev.filter(id => id !== Id));
            }
        };

        const actionSnackBar = (
            <React.Fragment>
                <Button color="secondary" size="small" onClick={handleCloseSnackBar}>
                    X
                </Button>
            </React.Fragment>
        );

        return (
            <tr>
                {sortedColumn.map((col) => (
                    <td key={col}>{rowData[col]}</td>
                ))}

                <th className="d-flex justify-content-center">
                    {action === 'View' && (
                        <div>
                            <ModalComponent />
                            {open ?  <Snackbar
                                open={open}
                                autoHideDuration={5000}
                                onClose={handleCloseSnackBar}
                                message="Update successfully"
                                action={actionSnackBar}
                            /> : null}
                        </div>
                    )}
                    {action === 'Delete' && (
                        <Checkbox onChange={oncheckboxChange} checked={selectedTopics.includes(Id)} />
                    )}
                </th>
            </tr>
        );
    };

    // initial topics data
    useEffect(() => {
        fetch('http://0.0.0.0/forums/index')
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
        fetch('http://0.0.0.0/forum/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                topics: selectedTopics
            })
        }).then(response => {
            if (!response.ok) throw new Error('Cant delete post');
            return response.json();
        })
            .then(() => {
                console.log('deleted');
            })
            .catch(error => console.error('There was a problem with the fetch operation:', error));
    }

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

    useEffect(() => {
        const url = `http://0.0.0.0/forums/index?per_page=${rowsPerPage}&page=${[page]}`;
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Cannot fetch topics');
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

        const realColumnName = [
            'id',
            'name',
            'description',
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
                            <TopicCell
                                Key={topic.id}
                                Id={topic.id}
                                Name={topic.name}
                                Description={topic.description}
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

export default Forum