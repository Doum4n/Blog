import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap"
import './navbar.css'
import {Avatar} from "@mui/material";
import {useEffect, useState} from "react";
import {setUserId} from "firebase/analytics";
import Button from "@mui/material/Button";

const NavBar = () => {
    return (
        <div className="ms-3 mb-3 d-flex flex-row">
            <div className="w-100">
                <input type="text"/>
            </div>
            <div className="d-flex align-items-end justify-content-end">
                <Avatar/>
            </div>
        </div>
    )
}

export default NavBar