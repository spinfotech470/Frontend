import { Col, Container, form, Row, Button, Form, Modal } from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import React, { useEffect, useState, useContext } from "react";
import { imgPath } from "../common/common.function";
import coverImg from "../../assest/img/cover.png";
import profile from "../../assest/img/actor.jpg";
import annoyB from "../../assest/img/anonymous_guy.png";
import annoyG from "../../assest/img/anonymous_girl.png";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { faShare, faHeart } from '@fortawesome/free-solid-svg-icons';
import questionService from "../../services/questionService";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { Image } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import anony from "../../assest/img/profile.png"



const Main = (props) => {
  const [item, setItem] = useState('');
  const [allpost, setAllPost] = useState([]);
  const [allLookUp, SetAllLookUp] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const user = JSON.parse(localStorage.getItem('user'))
  const [localUser, setLocalUser] = useState(user);
  const [show, setShow] = useState(false);
  const [anonymous, setAnonymous] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [file, setFile] = useState("");
  const [fullscreen, setFullscreen] = useState(true);
  const [validated, setValidated] = useState(false);
  const [isDisabled, setDisabled] = useState(false);

  const handleClose = () => setShow(false);
  let bgColor = anonymous === true ? "#5f5e5e" : "white";
  let ftColor = anonymous === true ? "white" : "#5f5e5e";

  const handleToggleAnonymous = () => setAnonymous(!anonymous);
  // const {  user } = React.useContext(AuthContext);

  function handleShow(breakpoint) {
    if (breakpoint.opinionFrom === "guys" && (user && user.gender === 'male')) {
      setFormData({ postId: breakpoint._id });
      setFullscreen(breakpoint);
      setShow(true);
    } else if (breakpoint.opinionFrom === "girls" && (user && user.gender === 'female')) {
      setFormData({ postId: breakpoint._id });
      setFullscreen(breakpoint);
      setShow(true);
    } else if (breakpoint.opinionFrom === "everyone") {
      setFormData({ postId: breakpoint._id });
      setFullscreen(breakpoint);
      setShow(true);
    } else {
      if (breakpoint.opinionFrom === "guys") {
        toast.error("This Question is for Guys");
      } else if (breakpoint.opinionFrom === "girls") {
        toast.error("This Question is for Girls");
      }
    }
  }
  
  function timeDifference(createdAt) {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();

    const differenceInMs = currentDate - createdDate;
    const differenceInSeconds = Math.floor(differenceInMs / 1000);
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    const differenceInDays = Math.floor(differenceInHours / 24);

    if (differenceInDays > 0) {
      return `${differenceInDays} D${differenceInDays !== 1 ? 's' : ''}`;
    } else if (differenceInHours > 0) {
      return `${differenceInHours} Hr${differenceInHours !== 1 ? 's' : ''}`;
    } else if (differenceInMinutes > 0) {
      return `${differenceInMinutes} Min${differenceInMinutes !== 1 ? 's' : ''}`;
    } else {
      return `${differenceInSeconds} Sec${differenceInSeconds !== 1 ? 's' : ''}`;
    }
  }

  const handleSubmit = async (event) => {
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

        let resp = await questionService.commentPost({ ...formData, user })
        if (resp) {
            getList();
            handleClose();
            toast.success("Comment Added SUuccessfully !")

        }

        if (resp) {
            // toast.success(resp.message)
            setShow(false);
            handleClose();
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
    const resp = await questionService.getAllQuestions();
    setAllPost(resp);
  }
  const getListLookUp = async () => {
    const resp = await questionService.getAllQuestionsLookUp();
    SetAllLookUp(resp);
  }
  const handleClick = (user1, itm) => {
    if(itm && itm.createdByDetails && (itm.createdByDetails)._id === user._id && itm.askanonymously != "yes"){
    navigate('/profile', { state: itm, userInfo:user1 });
    }else{
      if(itm && itm.askanonymously != "yes"){
        navigate('/otherProfile', { state: itm, userInfo:user1 });
      }
    }
  };

  const handleChange = (name, event) => {
    let from = { ...formData };
    from[name] = event.target.value;
    setFormData({ ...formData, ...from });
  }

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

  const likeSubmit = async (value, user) => {
    try {
      let resp = await questionService.likeQuestion(value, user);
      getList();
      // Update the local state without rearranging the posts
      setAllPost(prevPosts => {
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

  const handleClick1 = (ind, itm) => {
    navigate('/questionDetails', { state: itm });
  };

  function countCommentsByGender(data) {
    let maleCount = 0;
    let femaleCount = 0;
    let uniqueCommentIds = new Set();

    if (data && data.comments) {
        data.comments.forEach(comment => {
            if (comment._id && !uniqueCommentIds.has(comment._id)) {
                uniqueCommentIds.add(comment._id);
                if (comment.userDetails && comment.userDetails.gender) {
                    if (comment.userDetails.gender === 'male') {
                        maleCount++;
                    } else if (comment.userDetails.gender === 'female') {
                        femaleCount++;
                    }
                }
            }
        });
    }

    return { maleCount, femaleCount };
}

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setLocalUser(JSON.parse(storedUser));
    }
  }, []);

  // useEffect(() => {
  //   if (user) {
  //     // localStorage.setItem('user', JSON.stringify(user));
  //     setLocalUser(user);
  //   }
  // }, [user]);

  useEffect(() => {
    getList();
  }, [])


  const sortedPosts = allpost.sort((a, b) => ((b.likes)?.length || 0) - ((a.likes)?.length || 0));
  return (

    <>
      <Row className="mt-5 mx-0 justify-content-center mb-5">
        <Col lg={8} md={12} sm={12} sx={12}>
          {sortedPosts && sortedPosts.length > 0 && sortedPosts.map((v, i) => {
            const genderComments = countCommentsByGender(v);
            if(user){
              var userLiked = v && v.likes && v.likes.some(like => like.userId == user._id);
            }else{
              var userLiked = false;
            }
            return (<>
              <Card key={i} className="card">
                <Card.Img onClick={() => handleClick1(i, v)} variant="top" style={{ height: 'auto' }} src="https://static.toiimg.com/thumb/msid-111084258,imgsize-41174,width-838,resizemode-4/111084258.jpg" />
                <Row className="px-2 mt-2">
                  <Col lg={9} md={9} sm={9} xs={9} className="text-start">
                    <p className="font12 fontgrey">{v && v.category !== '' ? v.category : ''}</p>
                  </Col>
                  <Col lg={3} md={3} sm={3} xs={3} className="text-start">
                    <p className="font12 fontgrey">{timeDifference(v.createdAt)}</p>
                  </Col>
                </Row>
                <Card.Body className="pt-0">

                  <Card.Text onClick={() => handleClick1(i, v)} className="font14-600 text-start mb-1">
                    {v && v.questionTitle !== '' ? v.questionTitle : 'Question Titile....'}
                  </Card.Text>
                  <Card.Text onClick={() => handleClick1(i, v)} className="font13 text-start lineHeightNrml">
                    {v && v.description !== '' ? v.description : "Title Description...."}
                  </Card.Text>
                </Card.Body>
                <Row>
                  <Col lg={1} md={3} sm={3} xs={3} className="homeproImg text-center pt-2 pe-0">
                    <img onClick={() => handleClick((v.createdByDetails), v)} src={v.askanonymously === 'no' ? profile : anony} alt="" className="img-fluid homeproImg hand" />
                  </Col>
                  <Col lg={5} md={5} sm={6} xs={6} className="text-start mt-3 p-0">
                    <div><p className="mb-0 font12 bold500" onClick={() => handleClick((v.createdByDetails), v)} style={{ color: "blue" }}>{v.askanonymously === 'no' ? (v.createdByUsername) : "Anonymous"}</p></div>
                    <div><p onClick={() => handleClick((v.createdByDetails), v)} className="mb-0 font10 fontgrey">Age 18-24</p></div>
                  </Col>
                  <Col lg={4} md={4} sm={3} xs={3} className="text-start mt-3 p-0" onClick={() => handleClick1(i, v)}>
                    <span> <FontAwesomeIcon icon={faComment} /></span> <span style={{ color: "#ff0732", fontSize: "12px", fontWeight:"700" }}>{genderComments.femaleCount}</span> <span style={{ borderLeft: "2px solid grey" }}></span> <span style={{ color: "blue", fontSize: "12px", paddingLeft: "5px", fontWeight:"700" }}><span> </span>{genderComments.maleCount}</span>
                  </Col>
                </Row>
                <hr className="mb-0" />
                <Row className="p-3">
                  <Col lg={2} md={2} sm={2} xs={2} className="text-center">
                  {userLiked ? <FontAwesomeIcon onClick={(e) => { likeSubmit(v, user) }} className="hand" icon={faHeart} style={{color: "#ff0000",}} /> : <FontAwesomeIcon onClick={(e) => { likeSubmit(v, user) }} style={{color: "#0000003d",}} className="hand" icon={faHeart} size="m" /> }
                    <p className="mb-0 text-center" style={{fontSize:"12px"}}>{v && v.likesUserDetails && (v.likesUserDetails).length >0 ? (v.likesUserDetails).length :'0'}</p>
                  </Col>
                  <Col lg={8} md={8} sm={8} xs={8} onClick={() => handleShow(v, user)}>
                    <span style={{ fontWeight: "600", fontSize: "14px", color: "blue" }}>ADD OPINION</span>
                  </Col>
                  <Col lg={2} md={2} sm={2} xs={2}>
                  </Col>
                </Row>
              </Card>

            </>
            )

          })}
        </Col>
      </Row>

      {/* <Modal show={show} fullscreen={true} onHide={handleClose}>
        <Modal.Header closeButton>
                        <Modal.Title>Modal</Modal.Title>
                    </Modal.Header>
        <Modal.Body style={{ backgroundColor: bgColor, color: ftColor }}>
          <Form>
            Top Row: Profile Photo, User Name, Submit Button
            <Row className="align-items-center mb-4">
              <Col xs={1} onClick={handleClose}>x</Col>
              <Col xs={2}>
                <Image src={profile} roundedCircle fluid />
              </Col>
              <Col xs={6}>
                <Row>
                                        <Col lg={12} md={12} sm={12} xs={12}>
                                            <p className="mb-0" style={{ fontSize: "12px", fontWeight: "600" }}>John Marker Dell</p>
                                        </Col>
                                        <Col lg={12} md={12} sm={12} xs={12}>
                                            <p className="mb-0" style={{ fontSize: "12px" }}>{user.username}</p>
                                        </Col>
                                    </Row>
              </Col>
              <Col xs={2} className="text-end">
                <Button className="askQesBtn" type="submit">
                  Send
                </Button>
              </Col>
            </Row>

            <Form.Group controlId="exampleForm.ControlInput1" className="inputBigField" >
              <Form.Control style={{ backgroundColor: bgColor, color: ftColor }} type="text" placeholder="What, When, Why...  ask" />
            </Form.Group>

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
                <Form.Group className="string" controlId="image" >
                  <Form.Control style={{ backgroundColor: bgColor, color: ftColor }} className="brdr frmcnt" type="file" placeholder="" accept="image/png, image/jpg, image/jpeg" onChange={e => fileChangedHandler(e, 'image')} />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid Photo.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal> */}

      <Modal show={show} fullscreen={true} onHide={handleClose}>
                <Modal.Body style={{ backgroundColor: bgColor, color: ftColor }}>
                    <Form noValidate validated={validated} onSubmit={e => handleSubmit(e)} >
                        <Row className="align-items-center mb-4">
                            <Col xs={1} onClick={handleClose}>x</Col>
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

                        <Form.Group controlId="exampleForm.ControlInput1" className="inputBigField" >
                            <Form.Control onChange={e => handleChange('content', e)} value={formData.content ? formData.content : ""} style={{ backgroundColor: bgColor, color: ftColor }} type="text" placeholder="What, When, Why...  ask" />
                        </Form.Group>

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
    </>
  );
}

export default Main;