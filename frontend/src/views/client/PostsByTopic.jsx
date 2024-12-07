import {Col, Container, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import PostTopic from "./component/topic/post_forum.jsx";

const PostsByTopic = () => {
    const [postsByTopic, setPostsByTopic] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { id } = useParams();

    useEffect(() => {
        fetch(`http://0.0.0.0/post/forum/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setPostsByTopic(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                setIsLoading(false);
            });
    }, []);

    return (
        <Container>
            <Row>
                <Col>
                    <h1>
                        {isLoading ? 'Loading...' : postsByTopic.length > 0 ? postsByTopic[0].topic_name : 'No posts found'}
                    </h1>
                </Col>
            </Row>
            <Row>
                {postsByTopic.length > 0 && postsByTopic.map((post) => (
                    <PostTopic
                        Key={post.id}
                        id={post.id}
                        title={post.title}
                        image={post.path}
                        content={post.content}
                    />
                ))}
            </Row>
        </Container>
    );
}

export default PostsByTopic;