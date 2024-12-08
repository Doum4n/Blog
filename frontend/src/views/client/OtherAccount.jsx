import { Card, Container, Modal, Image, Tabs, Tab, Col, Row} from "react-bootstrap";
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";
import React, { useState, useEffect } from "react";
import {useHref, useNavigate, useParams} from "react-router-dom";
import cover from '../../assets/cover.png';
import { setUserId } from "firebase/analytics";
import Post_by_user from './component/account/post_by_user'
import Comment_by_user from './component/account/comment_by_user';
import SharedPost from "./component/account/shared_post";
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import statusRes from "assert";
import Status from "./component/status/status.jsx";
import Button from "@mui/material/Button";
import {Divider} from "@mui/material";
import Account from "./component/account.jsx";

const MyAccount = () => {

    const {uuid} = useParams();

    return (
       <Account uuid={uuid} type='OtherAccount'/>
    );
}

export default MyAccount