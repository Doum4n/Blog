import {Container} from "react-bootstrap";
import { auth } from "../../config/firebase";
import React, {useState, useEffect, useRef, createRef} from "react";
// import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Account from "./component/account.jsx";

const MyAccount = () => {
    const [uuid, setUuid] = useState();

    useEffect(() => {
        try {
            auth.onAuthStateChanged(function (user) {
                if (user) {
                    setUuid(user.uid);
                }
            });
        } catch (err) {
            console.error(err);
        };
    });

    return (
        <Account uuid={uuid}  type='MyAccount'/>
    );
}

export default MyAccount