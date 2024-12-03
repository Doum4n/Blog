import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap"
import { Image, Form } from "react-bootstrap";
import { auth } from "../../../config/firebase";
import { useParams } from "react-router-dom";

const SubComment = ({ImageSrc, nameUser, parent_id, type}) => {
    const [content, setContent] = useState('');
    const { id } = useParams();
    const [user_id, setUserId]  = useState('');
    const [photoUrl, setPhotoUrl]  = useState('');
    const [username, setUsername]  = useState('');

    useEffect(() => {
        try{
          auth.onAuthStateChanged(function(user){
            if(user){
              setUserId(user.uid);
              setPhotoUrl(user.photoURL);
              setUsername(user.displayName);
            }
          });
        }catch(err){
            console.error(err);
        };
      });

    const postComment = async () => {
        await fetch(`http://0.0.0.0/comment/create`,
            {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify ({
                    user_id: user_id,
                    id: id,
                    content: content,
                    parent_id: parent_id,
                    type: type,
                })
            }
        )
            .then(response => {
                if(!response.ok){
                    throw new Error("Cant post this comment!")
                }
                return response.json();
            }).then(data => {
                console.log(data);
            }).catch(err => {
                console.error(err);
        });
    }

    const commentChange = (e) => {
        setContent(e.target.value);
    }

    return (
        <Container className="mb-3">
            <Row>
                <Col xs="auto">
                    <Image src={photoUrl} roundedCircle style={{ width: '50px', height: '50px' }} />
                </Col>
                <Col>
                    {username}
                    <Form className="mt-3" id="comment">
                        <Form.Group>
                            <Form.Control as="textarea" rows={3} placeholder="Comment..." onChange={commentChange}></Form.Control>
                        </Form.Group>
                        <div className="d-flex justify-content-end mt-3">
                            <Button onClick={postComment}>Send</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default SubComment