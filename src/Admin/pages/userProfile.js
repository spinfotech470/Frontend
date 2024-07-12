import { Col, Container, form, Row, Button, Form, Modal } from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { imgPath } from "../common/common.function";
import coverImg from "../../assest/img/userProBg.jpg";
import profile from "../../assest/img/actor.jpg";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faShare, faUser, faLocationDot, faArrowLeft, faPaperPlane, faCakeCandles } from '@fortawesome/free-solid-svg-icons';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Image } from 'react-bootstrap';
import actor from "../../assest/img/actor.jpg"
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import questionService from "../../services/questionService";
import ProfileIcon from "../../assest/img/actor.jpg";
import ShareButtons from "../common/common.function";


const UserProfile = (props) => {
    const [item, setItem] = useState('');
    const [validated, setValidated] = useState(false);
    const [isDisabled, setDisabled] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const values = [true];
    const [fullscreen, setFullscreen] = useState(true);
    const [show, setShow] = useState(false);
    const [anonymous, setAnonymous] = useState(true);
    const [file, setFile] = useState("");
    const [reply, setReply] = useState({ commentId: "" })
    const [formErrors, setFormErrors] = useState({});
    const [postId, setPostId] = useState({});
    const [formData, setFormData] = useState({});
    let bgColor = anonymous === true ? "#5f5e5e" : "white";
    let ftColor = anonymous === true ? "white" : "#5f5e5e";
    const navigate = useNavigate();
    const location = useLocation();
    const [ldata, setLdata] = useState(location.state);
    const [newData, setNewData] = useState([]);
    const [showComment, setShowComment] = useState(false);
    const commentClose = () => setShowComment(false);
    const commentShow = () => setShowComment(true);
    const [showReplies, setShowReplies] = useState(false);
    const repliesClose = () => setShowReplies(false);
    const [share, setShare] = useState(false);
    const shareClose = () => setShare(false);
    const shareShow = () => setShare(true);
    const [text, setText] = useState('')

    function repliesShowT(breakpoint) {
        setReply({ commentId: breakpoint });
        setFormData({ ...formData, content: "" });
        setShowReplies(true);
    }

    const repliesSubmit = async (event) => {
        const form = event.currentTarget;

        if (form.checkValidity() === false) {

            event.preventDefault();
            event.stopPropagation();
            setValidated(true);

        } else {
            event.preventDefault();
            event.stopPropagation();
            setDisabled(true);

            let postData = new FormData();
            for (let key in formData) {
                postData.append(key, formData[key]);
            }
            let resp = await questionService.replyPost({ ...formData, user, ...reply })
            if (resp) {
                repliesClose();
                getList();
            }

            if (resp) {
                toast.success(resp.message)
                setShow(false);
                repliesClose();
                getList();
                // setFormData({})
                setValidated(false);

            } else {
                setDisabled(false);
                toast.error('Getting Some Error');
            }
            return false;
        }
    };

    const getList = async () => {
        try {
            let resp = await questionService.getAllQuestions();
            if (resp) {
                setNewData(resp)
            }
        } catch (error) {
            toast.error(error)
        }
    }

    const likeSubmit = async (value, user) => {
        try {
            let resp = await questionService.likeQuestion(value, user);
            getList();
            // Update the local state without rearranging the posts
            setNewData(prevPosts => {
                return prevPosts.map(post => {
                    if (post._id === value._id) {
                        return { ...post, likes: resp.likes };
                    }
                    return post;
                });
            });
        } catch (error) {
            // Handle error if necessary
        }
    };

    const commentSubmit = async (event) => {
        const form = event.currentTarget;

        if (form.checkValidity() === false) {

            event.preventDefault();
            event.stopPropagation();
            setValidated(true);

        } else {
            event.preventDefault();
            event.stopPropagation();
            setDisabled(true);

            let postData = new FormData();
            for (let key in user) {
                postData.append(key, formData[key]);
            }

            let resp = await questionService.commentPost({ ...formData, ...postId, user })
            // console.log(resp);
            if (resp) {
                getList();
                // commentClose();
                setFormData({ ...formData, content: "" });
            }

            if (resp) {
                toast.success(resp.message)
                getList();
                // setShow(false);
                // commentClose();
                // setFormData({})
                setValidated(false);

            } else {
                setDisabled(false);
                toast.error('Getting Some Error');
            }
            return false;
        }
    };

    const handleChange = (name, event) => {
        let value;
        if (event.target.type === 'checkbox') {
            value = event.target.checked ? 'yes' : 'no';
        } else if (event.target.type === 'radio') {
            value = event.target.id;
        } else {
            value = event.target.value;
        }
        setFormData({ ...formData, [name]: value });
    };

    const handleClose = () => setShow(false);
    const handleToggleAnonymous = () => setAnonymous(!anonymous);

    function handleShow(breakpoint) {
        setFullscreen(breakpoint);
        setShow(true);
    }

    const handleNavigation = () => {
        navigate('/');
    };

    const shareFunction = (val) => {
        shareShow();
        setText(val.questionTitle)
    }

    const goToDetails = (user1, itm) => {
        navigate('/questionDetails', { state: itm, userInfo: user1 });
    };

    const fileChangedHandler = (event, elename) => {
        event.preventDefault();
        let formErrorsData = formErrors;

        let formDataData = formData;
        let file = event.target.files[0];
        setFile(URL.createObjectURL(event.target.files[0]));
        if (!file && file === undefined) {

            return false;
        }
        var fileName = (file && file.name ? file.name : '');
        let extensions = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();

        if (file.size > 20971520) {
            formErrorsData[elename] = "File size not greater then 20MB.";
        } else if (extensions == 'jpg' || extensions == 'png' || extensions == 'jpeg') {

            formErrorsData[elename] = "";
            formErrorsData["preview"] = "";
            formDataData['preview'] = URL.createObjectURL(event.target.files[0]);
            formDataData['fileType'] = extensions;
            formDataData[elename] = event.target.files[0];
            setFormData({ ...formData, ...formDataData });
        } else {
            formErrorsData[elename] = "File extensions doesn't match.";
        }
        setFormErrors({ ...formErrors, ...formErrorsData });
    }

    useEffect(() => {
        getList();
    }, [])

    // console.log(newData)

    return (

        <>
            <Row className="pb-5 pt-5" style={{ backgroundImage: `url(${coverImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <Col lg={2} md={2} sm={2} xs={2} className="text-end pt-1">
                    <FontAwesomeIcon onClick={handleNavigation} icon={faArrowLeft} />
                </Col>
                <Col lg={10} md={10} sm={10} xs={10} className="text-end pt-1 px-4">
                    <p className="upgrade"><span className="upgrade hand">Follow</span></p>
                </Col>
                <Col lg={12} md={12} sm={12} xs={12}>
                    <Row>
                        <Col lg={2} md={3} sm={3} xs={4} className="profileImg text-end pt-2">
                            <img src={item !== '' ? imgPath(item) : profile} alt="" className="img-fluid myprofile hand" />
                        </Col>
                        <Col lg={9} md={9} sm={9} xs={8} className="text-start mt-3">
                            {/* <div><p className="mb-0">@abhishek988</p></div> */}
                            <div><h4>{ldata && (ldata.createdByDetails) && (ldata.createdByDetails).username}</h4></div>
                            <div><p style={{ fontSize: "12px" }}>Online</p></div>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Row className="mt-1">
                <Col lg={1} md={2} sm={4} xs={4} className="pt-2 text-center">
                    <p className="font14-600">{item && (item.posts).length > 0 ? item.post : 864} <span className="font10grey">Posts</span></p>
                </Col>
                <Col lg={1} md={2} sm={4} xs={4} className="pt-2">
                    <p className="font14-600">{item && (item.posts).length > 0 ? item.post : "37.4k"} <span className="font10grey">Followers</span></p>
                </Col>
            </Row>

            <Row className="mt-4 mx-1">
                <Col lg={6} md={6} sm={6} xs={6}>

                    {values.map((v, idx) => (
                        <Button key={idx} className="me-2 mb-2 askBtn" >
                            Tell me a secret
                            {typeof v === 'string' && `below ${v.split('-')[0]}`}
                        </Button>
                    ))}
                </Col>
                <Col lg={6} md={6} sm={6} xs={6}>
                    {values.map((v, idx) => (
                        <Button type="submit" className="chatBtn p-0" onClick={() => {
                            navigate("/chat", {
                                state: (ldata.createdByDetails)
                            })
                        }}>
                            <div style={{ color: "black", fontWeight: "600", fontSize: "14px" }}>Chat</div>
                        </Button>
                    ))}
                </Col>
            </Row>

            <Row className="mt-5 mx-0 justify-content-center">
                <Col lg={8} md={12} sm={12} sx={12}>
                    <Tabs
                        defaultActiveKey="POSTS"
                        // id="fill-tab-example"
                        className="mb-3 font12 bold500"
                        fill
                    >
                        <Tab eventKey="POSTS" title="POSTS">
                            {newData && newData.length > 0 && newData.map((val, ind) => {
                                if (val && val.askanonymously === "no") {
                                    if (val && (val.createdByDetails) && (val.createdByDetails)._id == (ldata && (ldata.createdByDetails) && (ldata.createdByDetails)._id)) {
                                        if (ldata && (ldata.createdByDetails) && (ldata.createdByDetails)._id) {
                                            var userLiked = val && val.likes && val.likes.some(like => like.userId == (ldata && (ldata.createdByDetails) && (ldata.createdByDetails)._id));
                                        } else {
                                            var userLiked = false;
                                        }
                                        return (
                                            <Row className="mt-5 mx-0 justify-content-center">
                                                <Col lg={8} md={12} sm={12} sx={12}>
                                                    <Card className="card">
                                                        <Card.Body>
                                                            <Card.Text className="font14-600 text-start mb-1">
                                                                {val.questionTitle}
                                                            </Card.Text>
                                                            <Card.Text className="font13 text-start">
                                                                {val.description}
                                                            </Card.Text>
                                                        </Card.Body>
                                                        <Card.Img variant="top" style={{ height: 'auto' }} src="https://static.toiimg.com/thumb/msid-111084258,imgsize-41174,width-838,resizemode-4/111084258.jpg" />
                                                        <Row className="mt-2 mb-2 text-center">
                                                            <Col lg={4} md={4} sm={4} xs={4}>
                                                                {userLiked ? <FontAwesomeIcon onClick={(e) => { likeSubmit(val, (ldata && ldata.createdByDetails)) }} className="hand" icon={faHeart} style={{ color: "#ff0000", }} /> : <FontAwesomeIcon onClick={(e) => { likeSubmit(val, (ldata && ldata.createdByDetails)) }} style={{ color: "#0000003d", }} className="hand" icon={faHeart} size="m" />}
                                                                <p className="mb-0 text-center" style={{ fontSize: "12px" }}>{val && val.likesUserDetails && (val.likesUserDetails).length > 0 ? (val.likesUserDetails).length : '0'}</p>
                                                            </Col>
                                                            <Col lg={4} md={4} sm={4} xs={4}>
                                                                <FontAwesomeIcon className="hand" onClick={(e) => { goToDetails(user, val) }} icon={faComment} />
                                                                {/* <FontAwesomeIcon className="hand" onClick={(e) => { commentShow(); setPostId({ postId: val._id }) }} icon={faComment} /> */}
                                                            </Col>
                                                            <Col lg={4} md={4} sm={4} xs={4}>

                                                                <FontAwesomeIcon onClick={(e) => { shareFunction(val) }} className="hand" icon={faShare} />

                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        )
                                    }
                                }
                            })}

                        </Tab>
                        <Tab eventKey="profile" title="BIO">
                            <Row className="mt-4">
                                <Col lg={12} md={12} sm={12} xs={12} className="text-start">
                                    <p className="font14-600">About me:</p>
                                </Col>
                                <Col lg={12} md={12} sm={12} xs={12} className="text-start">
                                    <span><FontAwesomeIcon icon={faUser} style={{ color: "#c1c1c3", }} /></span> <sapn className="font12 fontgrey">{ldata && (ldata.createdByDetails) && (ldata.createdByDetails).username}</sapn>
                                    <div><p className="font12 fontgrey">#model #blogger #italia #romania</p></div>
                                </Col>
                                <Col lg={12} md={12} sm={12} xs={12} className="text-start">
                                    <span> <FontAwesomeIcon icon={faLocationDot} style={{ color: "#c1c1c3", }} /></span> <sapn className="font12 fontgrey"> mumbai [india]</sapn>
                                    <div>
                                        <span><FontAwesomeIcon icon={faCakeCandles} style={{ color: "#c1c1c3", }} /></span><span className="font12 fontgrey"> Birth : </span><sapn className="font12 fontgrey">{new Date(ldata && ((ldata.createdByDetails).dob)).toISOString().split('T')[0].split('-').reverse().join('/')}</sapn>
                                    </div>
                                </Col>
                            </Row>
                            <hr className="customhr" />
                            <Row className="mb-5">
                                <Col lg={12} md={12} sm={12} xs={12} className="text-start">
                                    <p className="font14-600 mb-1">Interests:</p>
                                </Col>
                                <Col lg={12} md={12} sm={12} xs={12} className="text-start">
                                    <sapn className="intBlocks">#likes</sapn> <sapn className="intBlocks">#world</sapn>
                                </Col>
                            </Row>
                        </Tab>
                    </Tabs>
                </Col>
            </Row>
            <Row>
                <Modal show={show} fullscreen={true} onHide={handleClose}>
                    {/* <Modal.Header closeButton>
                        <Modal.Title>Modal</Modal.Title>
                    </Modal.Header> */}
                    <Modal.Body className="chatscreen">
                        <Form>
                            {/* Top Row: Profile Photo, User Name, Submit Button */}
                            <Row className="align-items-center mb-4">
                                <Col xs={1} onClick={handleClose}><FontAwesomeIcon style={{ color: "#a5a0a0" }} onClick={() => { handleClose() }} icon={faArrowLeft} /></Col>
                                <Col xs={2}>
                                    <Image src={actor} roundedCircle fluid />
                                </Col>
                                <Col xs={6}>
                                    <Row>
                                        <Col lg={12} md={12} sm={12} xs={12}>
                                            <p className="mb-0" style={{ fontSize: "12px", fontWeight: "600", color: "#ffffff" }}>John Marker Dell</p>
                                        </Col>
                                        <Col lg={12} md={12} sm={12} xs={12}>
                                            <p className="mb-0" style={{ fontSize: "12px", color: "#a5a0a0" }}>@john doe</p>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={2} className="text-end">
                                    {/* <Button className="askQesBtn" type="submit">
                                        Send
                                    </Button> */}
                                    <FontAwesomeIcon icon={faPaperPlane} style={{ color: "#ff0000", }} />
                                </Col>
                            </Row>

                            <Form.Group controlId="exampleForm.ControlInput1" className="inputBigField" >
                                <Form.Control style={{ backgroundColor: bgColor, color: ftColor }} type="text" placeholder="What, When, Why...  ask" />
                            </Form.Group>

                            <Row className="align-items-center mt-4">

                            </Row>
                        </Form>
                    </Modal.Body>
                </Modal>


                <Modal show={showComment} fullscreen={true} onHide={commentClose}>
                    <Modal.Body style={{ backgroundColor: bgColor, color: ftColor }}>
                        <Form noValidate validated={validated} onSubmit={e => commentSubmit(e)} >
                            <Row className="align-items-center mb-4">
                                <Col xs={1} className="hand" onClick={commentClose}>x</Col>
                                <Col xs={2}>
                                </Col>
                                <Col xs={6}>
                                </Col>
                                <Col xs={2} className="text-end">
                                    <Button className="askQesBtn" type="submit">
                                        Send
                                    </Button>
                                </Col>
                            </Row>

                            <Form.Group controlId="exampleForm.ControlInput1" >
                                <Form.Control onChange={e => handleChange('content', e)} value={formData.content ? formData.content : ""} style={{ backgroundColor: bgColor, color: ftColor }} type="text" placeholder="What, When, Why...  ask" />
                            </Form.Group>

                            <Row className="inputBigField scrollableProfileComment mt-2">
                                {newData && newData.length > 0 && newData.map((val, ind) => {
                                    console.log(val)
                                    if (val && val._id === ldata._id) {
                                        return (
                                            val && (val.comments) && (val.comments).length > 0 && (val.comments).map((v, i) => {
                                                return (
                                                    <>
                                                        <Col lg={2} md={2} sm={2} xs={2}>
                                                            <img src={item !== '' ? imgPath(item) : ProfileIcon} alt="" className="img-fluid profileComments hand" />
                                                        </Col>
                                                        <Col lg={10} md={10} sm={10} xs={10}>
                                                            <p className="font12">{v.content}</p>
                                                        </Col>
                                                        <Col lg={12} md={12} sm={12} xs={12}>
                                                            <p className="font10 text-end" onClick={(e) => { repliesShowT(val._id) }}>Reply</p>
                                                        </Col>
                                                    </>
                                                )
                                            })
                                        )
                                    }
                                })}
                            </Row>

                            <Row className="align-items-center mt-4">
                                <Col xs={5} className="text-center">
                                    <Form.Check
                                        type="switch"
                                        id="custom-switch"
                                        label={anonymous ? 'Anonymous' : "John Marker"}
                                        checked={!anonymous}
                                        onChange={handleToggleAnonymous}
                                    />
                                </Col>
                                <Col xs={7} className="text-end">
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>
                </Modal>

                <Modal show={showReplies} fullscreen={true} onHide={repliesClose}>
                    <Modal.Body style={{ backgroundColor: bgColor, color: ftColor }}>
                        <Form noValidate validated={validated} onSubmit={e => { repliesSubmit(e) }} >
                            <Row className="align-items-center mb-4">
                                <Col xs={1} className="hand" onClick={repliesClose}>x</Col>
                                <Col xs={2}>
                                </Col>
                                <Col xs={6}>
                                </Col>
                                <Col xs={2} className="text-end">
                                    <Button className="askQesBtn" type="submit">
                                        Send
                                    </Button>
                                </Col>
                            </Row>

                            <Form.Group controlId="exampleForm.ControlInput1" >
                                <Form.Control onChange={e => handleChange('content', e)} value={formData.content ? formData.content : ""} style={{ backgroundColor: bgColor, color: ftColor }} type="text" placeholder="What, When, Why...  ask" />
                            </Form.Group>

                            {/* <Row className="inputBigField scrollableProfileComment mt-2">
                                {newData && newData.length > 0 && newData.map((val, ind) => {
                                    console.log(val)
                                    if (val && val._id === ldata._id) {
                                        return (
                                            val && (val.comments) && (val.comments).length > 0 && (val.comments).map((v, i) => {
                                                return (
                                                    <>
                                                        <Col lg={2} md={2} sm={2} xs={2}>
                                                            <img src={item !== '' ? imgPath(item) : ProfileIcon} alt="" className="img-fluid profileComments hand" />
                                                        </Col>
                                                        <Col lg={10} md={10} sm={10} xs={10}>
                                                            <p className="font12">{v.content}</p>
                                                        </Col>
                                                        <Col lg={12} md={12} sm={12} xs={12}>
                                                        <p className="font10 text-end">Reply</p>
                                                        </Col>
                                                    </>
                                                )
                                            })
                                        )
                                    }
                                })}
                            </Row> */}

                            {/* <Row className="align-items-center mt-4">
                                <Col xs={5} className="text-center">
                                    <Form.Check
                                        type="switch"
                                        id="custom-switch"
                                        label={anonymous ? 'Anonymous' : "John Marker"}
                                        checked={!anonymous}
                                        onChange={handleToggleAnonymous}
                                    />
                                </Col>
                                <Col xs={7} className="text-end">
                                </Col>
                            </Row> */}
                        </Form>
                    </Modal.Body>
                </Modal>

                <Modal show={share} onHide={shareClose} centered>
                    <Modal.Dialog className="modal-dialog-centered modal-sm">
                        <Modal.Body className="chatscreen">
                            <ShareButtons text={text} />
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal>

            </Row>
        </>
    );
}

export default UserProfile;