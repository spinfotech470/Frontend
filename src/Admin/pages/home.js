import { Col, Container, form, Row, Button, Form, Modal } from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import React, { useState } from "react";
import { imgPath } from "../common/common.function";
import coverImg from "../../assets/img/cover.png";
import profile from "../../assets/img/actor.jpg";
import annoyB from "../../assets/img/anonymous_guy.png";
import annoyG from "../../assets/img/anonymous_girl.png"
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faShare } from '@fortawesome/free-solid-svg-icons';



const HomePage = (props) => {
  const [item, setItem] = useState('');

  return (

    <>
      <Row className="mt-5 mx-0 justify-content-center">
        <Col lg={8} md={12} sm={12} sx={12}>
          <Card className="card">
            <Card.Img variant="top" style={{ height: 'auto' }} src="https://static.toiimg.com/thumb/msid-111084258,imgsize-41174,width-838,resizemode-4/111084258.jpg" />
            <Row className="px-2 mt-2">
              <Col lg={10} md={10} sm={10} xs={10} className="text-start">
                <p className="font12 fontgrey">Office Environment</p>
              </Col>
              <Col lg={2} md={2} sm={2} xs={2} className="text-start">
                <p className="font12 fontgrey">2 d</p>
              </Col>
            </Row>
            <Card.Body className="pt-0">

              <Card.Text className="font14-600 text-start mb-1">
                Some quick example text to build on the card title and make up the.
              </Card.Text>
              <Card.Text className="font13 text-start lineHeightNrml">
                Some quick example text to build on the card title and make up the
                bulk of the card's content.Some quick example text to build on the card title.
              </Card.Text>
            </Card.Body>
            <Row>
              <Col lg={1} md={3} sm={3} xs={3} className="homeproImg text-center pt-2 pe-0">
                <img src={item !== '' ? imgPath(item) : profile} alt="" className="img-fluid homeproImg hand" />
              </Col>
              <Col lg={5} md={5} sm={6} xs={6} className="text-start mt-3 p-0">
                <div><p className="mb-0 font12 bold500" style={{color:"blue"}}>@abhishek988</p></div>
                <div><p className="mb-0 font10 fontgrey">Age 18-24</p></div>
              </Col>
              <Col lg={4} md={4} sm={3} xs={3} className="text-start mt-3 p-0">
               <span> <FontAwesomeIcon icon={faComment} /></span> <span style={{color:"#ff0732", fontSize:"14px"}}> 6 </span> <span style={{borderLeft:"2px solid grey"}}></span> <span style={{color:"blue", fontSize:"14px", paddingLeft:"5px"}}><span> </span>  13</span>
              </Col>
            </Row>
            <hr className="mb-0" />
            <Row className="p-3">
              <Col lg={2} md={2} sm={2} xs={2}>
              <span className="likeBox"><FontAwesomeIcon icon={faThumbsUp} /></span>
              </Col>
              <Col lg={8} md={8} sm={8} xs={8}>
              <span style={{fontWeight:"600", fontSize:"14px", color:"blue"}}>ADD OPINION</span>
              </Col>
              <Col lg={2} md={2} sm={2} xs={2}>
              </Col>
            </Row>
          </Card>

          <Card className="card">
            <Row className="px-2 mt-2">
              <Col lg={10} md={10} sm={10} xs={10} className="text-start">
                <p className="font12 fontgrey">Relationships</p>
              </Col>
              <Col lg={2} md={2} sm={2} xs={2} className="text-start">
                <p className="font12 fontgrey">1 h</p>
              </Col>
            </Row>
            <Card.Body className="pt-0">

              <Card.Text className="font14-600 text-start mb-1">
                Some quick example text to build on the card title and make up the.
              </Card.Text>
              <Card.Text className="font13 text-start lineHeightNrml">
                Some quick example text to build on the card title and make up the
                bulk of the card's content.Some quick example text to build on the card title.
              </Card.Text>
            </Card.Body>
            <Row>
              <Col lg={1} md={3} sm={3} xs={3} className="homeproImg text-center pt-2 pe-0">
                <img src={item !== '' ? imgPath(item) : annoyB} alt="" className="img-fluid homeproImg hand" />
              </Col>
              <Col lg={5} md={5} sm={6} xs={6} className="text-start mt-3 p-0">
                <div><p className="mb-0 font12 bold500" style={{color:"blue"}}>Anonymous</p></div>
                <div><p className="mb-0 font10 fontgrey">Age 25-29</p></div>
              </Col>
              <Col lg={4} md={4} sm={3} xs={3} className="text-start mt-3 p-0">
               <span> <FontAwesomeIcon icon={faComment} /></span> <span style={{color:"#ff0732", fontSize:"14px"}}> 2 </span> <span style={{borderLeft:"2px solid grey"}}></span> <span style={{color:"blue", fontSize:"14px", paddingLeft:"5px"}}><span> </span>  5</span>
              </Col>
            </Row>
            <hr className="mb-0" />
            <Row className="p-3">
              <Col lg={2} md={2} sm={2} xs={2}>
              <span className="likeBox"><FontAwesomeIcon icon={faThumbsUp} /></span>
              </Col>
              <Col lg={8} md={8} sm={8} xs={8}>
              <span style={{fontWeight:"600", fontSize:"14px", color:"blue"}}>ADD OPINION</span>
              </Col>
              <Col lg={2} md={2} sm={2} xs={2}>
              </Col>
            </Row>
          </Card>

          <Card className="card">
            <Row className="px-2 mt-2">
              <Col lg={10} md={10} sm={10} xs={10} className="text-start">
                <p className="font12 fontgrey">Sports</p>
              </Col>
              <Col lg={2} md={2} sm={2} xs={2} className="text-start">
                <p className="font12 fontgrey">5 h</p>
              </Col>
            </Row>
            <Card.Body className="pt-0">

              <Card.Text className="font14-600 text-start mb-1">
                Some quick example text to build on the card title and make up the.
              </Card.Text>
              <Card.Text className="font13 text-start lineHeightNrml">
                Some quick example text to build on the card title and make up the
                bulk of the card's content.Some quick example text to build on the card title.
              </Card.Text>
            </Card.Body>
            <Row>
              <Col lg={1} md={3} sm={3} xs={3} className="homeproImg text-center pt-2 pe-0">
                <img src={item !== '' ? imgPath(item) : annoyG} alt="" className="img-fluid homeproImg1 hand" />
              </Col>
              <Col lg={5} md={5} sm={6} xs={6} className="text-start mt-3 p-0">
                <div><p className="mb-0 font12 bold500" style={{color:"#f941ae"}}>Anonymous</p></div>
                <div><p className="mb-0 font10 fontgrey">Age 18-24</p></div>
              </Col>
              <Col lg={4} md={4} sm={3} xs={3} className="text-start mt-3 p-0">
               <span> <FontAwesomeIcon icon={faComment} /></span> <span style={{color:"#ff0732", fontSize:"14px"}}> 0 </span> <span style={{borderLeft:"2px solid grey"}}></span> <span style={{color:"blue", fontSize:"14px", paddingLeft:"5px"}}><span> </span>  2</span>
              </Col>
            </Row>
            <hr className="mb-0" />
            <Row className="p-3">
              <Col lg={2} md={2} sm={2} xs={2}>
              <span className="likeBox"><FontAwesomeIcon icon={faThumbsUp} /></span>
              </Col>
              <Col lg={8} md={8} sm={8} xs={8}>
              <span style={{fontWeight:"600", fontSize:"14px", color:"blue"}}>ADD OPINION</span>
              </Col>
              <Col lg={2} md={2} sm={2} xs={2}>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default HomePage;