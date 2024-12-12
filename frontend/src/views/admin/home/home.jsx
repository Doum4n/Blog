import { Col, Container, Row } from "react-bootstrap";
import NavBar from "../navbar/navbar";
import SideBar from "../sidebar/sidebar";
import './home.css';
import {useEffect, useRef, useState} from "react";
import { CssBaseline } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';

const DashBoard = () => {
    const [users, setUsers] = useState();
    const [posts, setPosts] = useState();
    const [views, setView] = useState();
    const [likes, setLikes] = useState();
    const [comments, setComments] = useState();

    let [viewsByDay, setViewsByDay] = useState([]);

    useEffect(() => {
        fetch('http://0.0.0.0/statistical')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                setComments(data.comment_count);
                setLikes(data.total_likes);
                setPosts(data.post_count);
                setView(data.total_views);
                setUsers(data.user_count);
            })
            .catch(error => console.error('Fetch error:', error));
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const views = await fetch(`http://0.0.0.0/statistical/viewsByDay`).then(res => res.json());
            setViewsByDay(views);

            console.log(views);
        }

        fetchData();
    }, []);

    return (
        <Container fluid className="mt-3">
            <Row>
                <Col md={2}>
                    <SideBar />
                </Col>
                <Col md={10}>
                    <NavBar />

                    {/*<h2></h2>*/}
                    {/*<LineChart*/}
                    {/*    xAxis={[{ label: 'Chart view by day', data: [1, 2, 3, 4, 5, 6, 7, 8] }]}*/}
                    {/*    series={[*/}
                    {/*        {*/}
                    {/*            data: Object.values(viewsByDay),*/}
                    {/*        },*/}
                    {/*    ]}*/}
                    {/*    width={500}*/}
                    {/*    height={300}*/}
                    {/*/>*/}

                    {/* Hàng đầu tiên */}
                    <Row className="bg-black text-white p-4 ms-3 justify-content-around">
                        <Col className="d-box text-center ms-0 px-0" md={4}>
                            <div className="posts display-4">{posts ?? "Loading..."}</div>
                            <div className="subAmount">Posts</div>
                        </Col>
                        <Col className="d-box text-center" md={4} style={{ backgroundColor: 'goldenrod', width: '31%' }}>
                            <div className="views display-4">{views ?? "Loading..."}</div>
                            <div>Views</div>
                        </Col>
                        <Col className="d-box text-center" md={4} style={{ backgroundColor: 'grey', width: '31%'}}>
                            <div className="comments display-4">{comments ?? "Loading..."}</div>
                            <div>Comments</div>
                        </Col>
                    </Row>

                    {/* Hàng thứ hai */}
                    <Row className="bg-black text-white p-4 ms-3 mt-3 justify-content-around">
                        <Col className="d-box text-center" md={4} style={{ backgroundColor: 'goldenrod', width: '31%' }}>
                            <div className="likes display-4">{users ?? "Loading..."}</div>
                            <div>Users</div>
                        </Col>
                        <Col className="d-box text-center px-0" md={4}>
                            <div className="newUser display-4">0</div>
                            <div>New users</div>
                            <div className="accessToday display-4">0</div>
                            <div>Access Today</div>
                        </Col>
                        <Col className="d-box text-center" md={4} style={{ backgroundColor: 'grey', width: '31%'}}>
                            <div className="newComments display-4">0</div>
                            <div>New Comments</div>
                        </Col>
                    </Row>

                    {/* Hàng thứ ba */}
                    <Row className="bg-black text-white p-4 ms-3 mt-3 justify-content-around">
                        <Col md={8}>
                            <Row>
                                <Col id="likes" className="me-2 text-center" style={{width: '31%'}}>
                                    <div className="display-4">{likes ?? "Loading..."}</div>
                                    <div>Total Likes</div>
                                </Col>
                                <Col id="share" className="text-center" style={{width: '31%'}}>
                                    <div className="display-4">0</div>
                                    <div>Total Shares</div>
                                </Col>
                                <Col id="share" className="text-center" style={{width: '31%'}}>
                                    <div className="display-4">{views ?? "Loading..."}</div>
                                    <div>Total Views</div>
                                </Col>
                            </Row>
                            <Row className="bg-white text-black mt-2" style={{height: '200px'}}>
                                <div className="w-100 text-center py-4">Graph or Chart Placeholder</div>
                            </Row>
                        </Col>
                        <Col className="d-box text-center" md={3} style={{ backgroundColor: 'grey', width: '31%', height: '310px'}}>
                            <div>Comments</div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default DashBoard;
