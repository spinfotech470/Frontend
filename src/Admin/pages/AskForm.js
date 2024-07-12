import { Col, Container, form, Row, Button, Form, Modal } from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import React, { useState } from "react";
import { imgPath } from "../common/common.function";
import coverImg from "../../assets/img/cover.png";
import profile from "../../assets/img/actor.jpg";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment } from '@fortawesome/free-regular-svg-icons';
import { faShare } from '@fortawesome/free-solid-svg-icons';



const AskForm = (props) => {
    const [item, setItem] = useState('');

    return (

        <>
           <h1>Ask Form Here</h1>
        </>
    );
}

export default AskForm;