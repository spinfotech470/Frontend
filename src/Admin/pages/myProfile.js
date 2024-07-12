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



const MyProfile = (props) => {
    const [item, setItem] = useState('');

    return (

        <>
            <Row className="pb-5 pt-5" style={{ backgroundImage: `url(${coverImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <Col lg={11} md={11} sm={11} xs={11} className="text-end pt-1">
                    <p className="upgrade"><span className="upgrade hand">Upgrade</span></p>
                </Col>
                <Col lg={3} md={3} sm={3} xs={4} className="profileImg text-center pt-2">
                    <img src={item !== '' ? imgPath(item) : profile} alt="" className="img-fluid myprofile hand" />
                </Col>
                <Col lg={9} md={9} sm={9} xs={8} className="text-start">
                    <div><p className="mb-0">@abhishek988</p></div>
                    <div><h4>Abhishek Kumar</h4></div>
                    <div><p style={{fontSize:"12px"}}>Online</p></div>
                </Col>
            </Row>

            <Row className="mt-3">
                <Col lg={4} md={4} sm={4} xs={4} className="pt-2">
                    <p><div className="font14-600">{item && (item.posts).length > 0 ? item.post : 0}</div><div className="font10grey">Posts</div></p>
                </Col>
                <Col lg={4} md={4} sm={4} xs={4} className="pt-2">
                    <p><div className="font14-600">{item && (item.posts).length > 0 ? item.post : 0}</div> <div className="font10grey">Followers</div></p>
                </Col>
                <Col lg={4} md={4} sm={4} xs={4} className="pt-2">
                    <p><div className="font14-600">{item && (item.posts).length > 0 ? item.post : 0}</div> <div className="font10grey">Followings</div></p>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col lg={12} md={12} sm={12} xs={12}>
                    <Button type="submit" className="postBtn" onSubmit={() => { }}>
                        Add Post
                    </Button>
                </Col>
            </Row>

            <Row className="mt-5 mx-0 justify-content-center">
                <Col lg={8} md={12} sm={12} sx={12}>
                    <Card className="card">
                        <Row>
                            <Col lg={1} md={3} sm={3} xs={4} className="profileImg text-center pt-2 pe-0">
                                <img src={item !== '' ? imgPath(item) : profile} alt="" className="img-fluid postProfile hand" />
                            </Col>
                            <Col lg={9} md={9} sm={9} xs={8} className="text-start mt-3">
                                <div><p className="mb-0 font14-600">@abhishek988</p></div>
                            </Col>
                        </Row>
                        <hr className="mb-0" />
                        <Card.Body>
                            {/* <Card.Title>Card Title</Card.Title> */}
                            <Card.Text className="font14-600 text-start">
                                Some quick example text to build on the card title and make up the
                                bulk of the card's content.Some quick example text to build on the card title.
                            </Card.Text>
                            {/* <Button variant="primary">Go somewhere</Button> */}
                        </Card.Body>
                        <Card.Img variant="top" style={{ height: 'auto' }} src="https://static.toiimg.com/thumb/msid-111084258,imgsize-41174,width-838,resizemode-4/111084258.jpg" />
                        <Row className="mt-3 mb-3">
                            <Col lg={4} md={4} sm={4} xs={4}>
                            <FontAwesomeIcon icon={faHeart} />
                            </Col>
                            <Col lg={4} md={4} sm={4} xs={4}>
                            <FontAwesomeIcon icon={faComment} />
                            </Col>
                            <Col lg={4} md={4} sm={4} xs={4}>
                            <FontAwesomeIcon icon={faShare} />
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-2 mx-0 justify-content-center">
                <Col lg={8} md={12} sm={12} sx={12}>
                    <Card className="card">
                        <Row>
                            <Col lg={1} md={3} sm={3} xs={4} className="profileImg text-center pt-2 pe-0">
                                <img src={item !== '' ? imgPath(item) : profile} alt="" className="img-fluid postProfile hand" />
                            </Col>
                            <Col lg={9} md={9} sm={9} xs={8} className="text-start mt-3">
                                <div><p className="mb-0 font14-600">@abhishek988</p></div>
                            </Col>
                        </Row>
                        <hr className="mb-0" />
                        <Card.Body>
                            {/* <Card.Title>Card Title</Card.Title> */}
                            <Card.Text className="font14-600 text-start">
                                Some quick example text to build on the card title and make up the
                            </Card.Text>
                            {/* <Button variant="primary">Go somewhere</Button> */}
                        </Card.Body>
                        <hr className="mt-1 mb-0" />
                        <Row className="mt-3 mb-3">
                            <Col lg={4} md={4} sm={4} xs={4}>
                            <FontAwesomeIcon icon={faHeart} />
                            </Col>
                            <Col lg={4} md={4} sm={4} xs={4}>
                            <FontAwesomeIcon icon={faComment} />
                            </Col>
                            <Col lg={4} md={4} sm={4} xs={4}>
                            <FontAwesomeIcon icon={faShare} />
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-2 mx-0 justify-content-center">
                <Col lg={8} md={12} sm={12} sx={12}>
                    <Card className="card">
                        <Row>
                            <Col lg={1} md={3} sm={3} xs={4} className="profileImg text-center pt-2 pe-0">
                                <img src={item !== '' ? imgPath(item) : profile} alt="" className="img-fluid postProfile hand" />
                            </Col>
                            <Col lg={9} md={9} sm={9} xs={8} className="text-start mt-3">
                                <div><p className="mb-0 font14-600">@abhishek988</p></div>
                            </Col>
                        </Row>
                        <hr className="mb-0" />
                        <Card.Body>
                            {/* <Card.Title>Card Title</Card.Title> */}
                            <Card.Text className="font14-600 text-start">
                                Some quick example text to build on the card title and make up the
                            </Card.Text>
                            {/* <Button variant="primary">Go somewhere</Button> */}
                        </Card.Body>
                        <Card.Img variant="top" style={{ height: 'auto' }} src="https://static.toiimg.com/thumb/msid-111107115,imgsize-1714893,width-400,height-225,resizemode-72/111107115.jpg" />
                        <hr className="mt-1 mb-0" />
                        <Row className="mt-3 mb-3">
                            <Col lg={4} md={4} sm={4} xs={4}>
                            <FontAwesomeIcon icon={faHeart} />
                            </Col>
                            <Col lg={4} md={4} sm={4} xs={4}>
                            <FontAwesomeIcon icon={faComment} />
                            </Col>
                            <Col lg={4} md={4} sm={4} xs={4}>
                            <FontAwesomeIcon icon={faShare} />
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default MyProfile;