import {Col, Container, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import PostTopic from "./component/topic/post_topic.jsx";
import Button from "@mui/material/Button";

const RecentPosts = () => {
    const [RecentPosts, setRecentPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        fetch(`http://0.0.0.0/posts/recent/all`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setRecentPosts(data.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                setIsLoading(false);
            });
    }, []);
    
    return (
        <Container>
            {/*<Row >*/}
            {/*    <Col style={{ display: "flex", gap: "10px" }}>*/}
            {/*        <Button variant="contained">Day</Button>*/}
            {/*        <Button variant="contained">Month</Button>*/}
            {/*        <Button variant="contained">Year</Button>*/}
            {/*    </Col>*/}
            {/*</Row>*/}
            <Row>
                {RecentPosts.length > 0 && RecentPosts.map((post) => (
                    <PostTopic
                        Key={post.id}
                        id={post.id}
                        title={post.title}
                        image={post.path}
                        content={post.content}
                    />
                ))}
            </Row>
            <Row>
                <div className="bg-dark">d</div>
            </Row>
        </Container>
    )
}

export default RecentPosts;