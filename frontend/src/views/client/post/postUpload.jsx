import React, { useState } from 'react';
import { Button, Container, Form, FormControl, FormGroup, InputGroup, Modal } from 'react-bootstrap';
import 'react-quill/dist/quill.snow.css';
import { useRef } from 'react';
import Editor from './Editor';
import { useEffect } from 'react';
import Quill from 'quill/dist/quill.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../config/firebase';
const Delta = Quill.import('delta');

const UploadFile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [url, setUrl] = useState();
  const [urlUpdate, setUrlUpdate] = useState();

  const [range, setRange] = useState();
  const [lastChange, setLastChange] = useState();
  const [readOnly, setReadOnly] = useState(false);
  const [post_id, setPostID] = useState(null);

  const [submit, setSumib] = useState(false);

  const [htmlContent, setHtmlContent] = useState();

  const quillRef = useRef(); // Khởi tạo ref để tham chiếu đến phần tử DOM

  const [title, setTitle] = useState('');

  const [show, setShow] = useState(false);
  const [uuid, setUuid] = useState('');



  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      handleSubmit(file);
    }
  };

  useEffect(() => {
    try{
      auth.onAuthStateChanged(function(user){
        if(user){
          setUuid(user.uid);
        }
      });
    }catch(err){
        console.error(err);
    };
  }); 

  const handleGetHTML = (html) => {
    setHtmlContent(html);
  };

  const handleSubmit = (file) => {
    const formData = new FormData();
    formData.append('image', file);

    fetch('http://0.0.0.0/image/temp', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setUrl(data.path);
        console.log('Store temp image success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handlerHtmlChange = (Content) => {
    setHtmlContent(Content);
  }

  const StoreImage = async () => {
    await fetch('http://0.0.0.0/image/store', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        post_id : post_id,
        path : url
      }),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('Store image success:', data.path);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  const UploadPost = async () => {
    await fetch('http://0.0.0.0/post/create', {
      method: 'POST',
      headers: { 
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        title : title,
        content_post : htmlContent,
        user_id : uuid
      }),
    })
    .then((response) => response.json())
    .then((data) =>{
      setPostID(data.id);
      setSumib(true);
      console.log('Upload post success:', data.id);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  useEffect(() => {
    if(post_id && url)
      StoreImage();
  }, [post_id])

  const showModal = () => setShow(true);
  const closeModal = () => setShow(false);

  const navigate = useNavigate();
  const PostHandler = () => {
      navigate(`/home`);
  }

  return (
    <Container className='mt-3'>
      <Form>
        <Form.Control type='text' placeholder='Title' className='mb-3' onChange={(e) => setTitle(e.target.value)}/>
        <FormGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>Tag</InputGroup.Text>
            <FormControl
                type="text"
                placeholder="Tag"
            />
          </InputGroup>
        </FormGroup>
        <Form.Control type="file" onChange={handleFileChange} className='mb-3'/>
        {url && <img src={`http://0.0.0.0/storage/${url}`} alt="Uploaded" className='mb-3'/>}

        <Editor
        ref={quillRef}
        readOnly={readOnly}
        defaultValue={""}
        onSelectionChange={setRange}
        onTextChange={handleGetHTML}
        onSubmit={submit}
        content={handlerHtmlChange}
        post_id={post_id}
        />

        <div className='mt-3'>
          <Button onClick={UploadPost}>POST</Button>
          <Button onClick={showModal} className='ms-3'>CANCEL</Button>
        </div>

        <Modal
            show={show}
            onHide={closeModal}
            backdrop="static"
            keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Warning!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Do you want to cancel this post?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={PostHandler}>Yes</Button>
          </Modal.Footer>
        </Modal>
        <div dangerouslySetInnerHTML={{__html: htmlContent}}/>
      </Form>
    </Container>
  );
};

export default UploadFile;
