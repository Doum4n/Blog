import React, { useState } from 'react';
import { Button, Container, Form, FormGroup, InputGroup } from 'react-bootstrap';
import 'react-quill/dist/quill.snow.css';
import { useRef } from 'react';
import Editor from './Editor';
import { useEffect } from 'react';
import Quill from 'quill/dist/quill.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../config/firebase';
import {Box, InputLabel, MenuItem, Modal} from "@mui/material";
import Select from "@mui/material/Select";
import FormControl from '@mui/material/FormControl';
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
        user_id : uuid,
        forum_id : FormRef.current.elements.selectedForum.value,
        tag_name: FormRef.current.elements.TagName.value,
      }),
    })
    .then((response) => response.json())
    .then((data) =>{
      setPostID(data.id);
      setSumib(true);
      handleChoseForumOpen();
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

  const FormRef = useRef(null);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    height: 300,
    backgroundColor: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    padding: 20,
  };

  const styleCancel = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    padding: 1,
    display: 'flex', // Đảm bảo modal sử dụng flexbox
    flexDirection: 'row', // Căn chỉnh các phần tử trong modal
    justifyContent: 'flex-end',
  };

  const [showChoseForum, setShowChoseForum] = useState(false);
  const handleChoseForumOpen = () => setShowChoseForum(true);
  const handleChoseForumClose = () => setShowChoseForum(false);

  const [forums, setForums] = useState([]);

  useEffect(() => {
    fetch(`http://0.0.0.0/forums`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setForums(data);
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
  }, []);

  return (
      <Container className='mt-3'>
        <Form >
          <Form.Control type='text' placeholder='Title' className='mb-3' onChange={(e) => setTitle(e.target.value)}/>
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
            <Button onClick={() => handleChoseForumOpen()}>POST</Button>
            <Button onClick={showModal} className='ms-3'>CANCEL</Button>
          </div>

          <Modal
              open={show}
              onClose={closeModal}
          >
            <Box sx={styleCancel}>
              <Button variant="secondary" onClick={closeModal}>No</Button>
              <Button variant="primary" onClick={PostHandler}>Yes</Button>
              </Box>
          </Modal>
          <div dangerouslySetInnerHTML={{__html: htmlContent}}/>
        </Form>
        <Modal
            open={showChoseForum}
            onClose={handleChoseForumClose}
        >
          <box style={style}>
            <Form ref={FormRef}>
              <Form.Group className="mb-3">
                <Form.Label>Hashtag</Form.Label>
                <Form.Control name="TagName" placeholder="hashtag"/>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Forum</Form.Label>
                <Form.Select name="selectedForum">
                  {forums.map((forum) => (
                      <option key={forum.id} value={forum.id}>
                        {forum.name}
                      </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Button onClick={UploadPost}>Post</Button>
            </Form>
          </box>

        </Modal>
      </Container>
  );
};

export default UploadFile;
