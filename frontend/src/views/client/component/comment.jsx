import { Container, Row, Col, Button } from "react-bootstrap"
import { Image, Form } from "react-bootstrap";
import SubComment from "./subcoment";
import { useState } from "react";
import {useNavigate} from "react-router-dom";

const Comment = ({ImageSrc,updated_at, nameUser, comment, id, type, disableReply, onNewSubComment}) => {

    const [showSubComment, setShowSubComment] = useState(false);

    const loadSubcomment = () => {
        setShowSubComment(!showSubComment);
    }

    const date = new Date(updated_at);

    const formattedDate = date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });

    const navigate = useNavigate();
    
    return (
        <Container className="mb-3">
            <Row>
                <Col xs="auto" >
                    <Image src={ImageSrc} roundedCircle style={{ width: '50px', height: '50px' }} />
                </Col>
                <Col>
                    <Row>
                    <p>{nameUser}</p>
                    <p>{formattedDate}</p>
                    </Row>
                    <Form className="mt-1">
                        <Form.Control as="textarea" rows={3} disabled value={comment} />
                        <Button className="mt-2" onClick={loadSubcomment} hidden={disableReply}>Reply</Button>
                        {showSubComment && (
                            <div className="mt-3">
                                <SubComment
                                    nameUser='username'
                                    ImageSrc="http://0.0.0.0/storage/images/piLImcuVtFrAne46IjKye6B8PCtNtO5CKyGGqfTE.png"
                                    comment='content'
                                    parent_id={id}
                                    type={type}
                                    onNewSubComment={onNewSubComment}
                                    onClose={() => setShowSubComment(false)}
                                />
                            </div>
                        )}
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default Comment