import Webcam from 'react-webcam';
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Col, Row, Button, Card, Form } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import { imgPath } from "../common/common.function";
import coverImg from "../../assest/img/cover.png";
import ProfileIcon from "../../assest/img/actor.jpg";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import questionService from '../../services/questionService'; // Import the service
import { useNavigate } from "react-router-dom";
import profile from "../../assest/img/profile.png";
import { ToastContainer, toast } from 'react-toastify';
import { faComment, faThumbsUp, faThumbsDown } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faSquareShareNodes } from '@fortawesome/free-solid-svg-icons';



const Profile = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [item, setItem] = useState('');
  const [validated, setValidated] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [questions, setQuestions] = useState([]);
  const user = localStorage && localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';
  // const { user, logout } = useContext(AuthContext);
  const [postId, setPostId] = useState({});
  const [localUser, setLocalUser] = useState(user);
  const navigate = useNavigate();
  const [allpost, setAllPost] = useState({});
  const [formData, setFormData] = useState({
    askanonymously: 'no',
    anonymousOpinion: 'Optional',
    opinionFrom: 'everyone'
  });
  const [anonymous, setAnonymous] = useState(true);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showComment, setShowComment] = useState(false);
  const commentClose = () => setShowComment(false);
  const commentShow = () => setShowComment(true);
  const [Step, setStep] = useState(1);
  const [file, setFile] = useState("");
  const [myposts, setMypost] = useState(0)
  // let LoggedUser = localStorage && localStorage.getItem('user');
  let bgColor = anonymous === true ? "#5f5e5e" : "white";
  let ftColor = anonymous === true ? "white" : "#5f5e5e";
  const [imageview, setImageview] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const handleToggleAnonymous = () => setAnonymous(!anonymous);

  const applyImageFilter = (imageSrc, filter) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = imageSrc;
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    switch (filter) {
      case 'grayscale':
        ctx.filter = 'grayscale(100%)';
        break;
      case 'sepia':
        ctx.filter = 'sepia(100%)';
        break;
      case 'invert':
        ctx.filter = 'invert(100%)';
        break;
      case 'blur':
        ctx.filter = 'blur(5px)';
        break;
      case 'brightness':
        ctx.filter = 'brightness(150%)';
        break;
      case 'contrast':
        ctx.filter = 'contrast(200%)';
        break;
      case 'hue-rotate':
        ctx.filter = 'hue-rotate(90deg)';
        break;
      case 'saturate':
        ctx.filter = 'saturate(200%)';
        break;
      case 'opacity':
        ctx.filter = 'opacity(50%)';
        break;
      case 'drop-shadow':
        ctx.filter = 'drop-shadow(8px 8px 10px gray)';
        break;
      default:
        break;
    }

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL();
  };


  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setFile(imageSrc)
  };

  const uploadImage = () => {
    if (capturedImage) {
      const blob = dataURItoBlob(capturedImage);
      const formData = new FormData();
      formData.append('image', blob, 'webcam-image.png');

      // Replace with your upload URL
      const uploadUrl = 'YOUR_UPLOAD_URL_HERE';

      fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };


  const handleNavigation = () => {
    navigate('/');
  };
  const getList = async () => {
    const resp = await questionService.getAllQuestions();
    setAllPost(resp);
  }

  const goToDetails = (user1, itm) => {
    navigate('/questionDetails', { state: itm, userInfo: user1 });
  };

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
      for (let key in formData) {
        postData.append(key, formData[key]);
      }

      let resp = (await questionService.createQuestion({ ...formData, user }))
      setDisabled(false);
      if (resp) {
        handleClose();
        getList();
      }

      if (resp && resp.code === 200) {
        toast.success('Post Successfully !')
        setShow(false);
        handleClose();
        setFormData({})
        setValidated(false);

      } else {
        setDisabled(false);
        // toast.error('Getting Some Error');
      }
      return false;
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
        commentClose();
      }

      if (resp) {
        toast.success(resp.message)
        getList();
        setShow(false);
        commentClose();
        // setFormData({})
        setValidated(false);

      } else {
        setDisabled(false);
        toast.error('Getting Some Error');
      }
      return false;
    }
  };

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

  // const fileChangedHandler = (event, elename) => {
  //   event.preventDefault();
  //   let formErrorsData = formErrors;

  //   let formDataData = formData;
  //   let file = event.target.files[0];
  //   setFile(URL.createObjectURL(event.target.files[0]));
  //   if (!file && file === undefined) {

  //     return false;
  //   }
  //   var fileName = (file && file.name ? file.name : '');
  //   let extensions = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();

  //   if (file.size > 20971520) {
  //     formErrorsData[elename] = "File size not greater then 20MB.";
  //   } else if (extensions == 'jpg' || extensions == 'png' || extensions == 'jpeg') {

  //     formErrorsData[elename] = "";
  //     formErrorsData["preview"] = "";
  //     formDataData['preview'] = URL.createObjectURL(event.target.files[0]);
  //     formDataData['fileType'] = extensions;
  //     formDataData[elename] = event.target.files[0];
  //     setFormData({ ...formData, ...formDataData });
  //   } else {
  //     formErrorsData[elename] = "File extensions doesn't match.";
  //   }
  //   setFormErrors({ ...formErrors, ...formErrorsData });
  // }

  const fileChangedHandler = (event, elename) => {
    event.preventDefault();
    let formErrorsData = { ...formErrors };

    let formDataData = { ...formData };
    let file = event.target.files[0];
    setFile(URL.createObjectURL(event.target.files[0]));
    if (!file) {
      return false;
    }
    var fileName = file.name;
    let extensions = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();

    if (file.size > 20971520) {
      formErrorsData[elename] = "File size not greater than 20MB.";
    } else if (extensions === 'jpg' || extensions === 'png' || extensions === 'jpeg') {
      formErrorsData[elename] = "";
      formErrorsData["preview"] = "";
      formDataData['preview'] = URL.createObjectURL(event.target.files[0]);
      formDataData['fileType'] = extensions;
      formDataData[elename] = event.target.files[0];
      setFormData(formDataData);
    } else {
      formErrorsData[elename] = "File extensions don't match.";
    }
    setFormErrors(formErrorsData);
  }

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

  const applyFilter = (filter) => {
    setSelectedFilter(filter);
  };

  useEffect(() => {
    getList();
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setLocalUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      setLocalUser(user);
      fetchQuestions(user._id); // Fetch questions for the user
    }
  }, [user]);

  const fetchQuestions = async (userId) => {
    try {

      const data = await questionService.getQuestions(userId);
      setQuestions(data);
    } catch (error) {
      // console.error("Error fetching questions: ", error);
    }
  };

  if (!localUser) {
    return <p>Loading...</p>;
  }

  console.log(allpost)

  return (
    <>
      <Row className="pb-5 pt-5" style={{ backgroundImage: `url(${coverImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <Col lg={12} md={12} sm={12} xs={12} className="text-end pt-1">
          <Row>
            <Col lg={2} md={2} sm={2} xs={2}>
              <FontAwesomeIcon onClick={(e) => { handleNavigation() }} icon={faArrowLeft} />
            </Col>
            <Col lg={10} md={10} sm={10} xs={10} className="px-4">
              <p className="upgrade"><span className="upgrade hand">Upgrade</span></p>
            </Col>
          </Row>
        </Col>
        <Col lg={3} md={3} sm={3} xs={4} className="profileImg text-center pt-2">
          <img src={item !== '' ? imgPath(item) : ProfileIcon} alt="" className="img-fluid myprofile hand" />
        </Col>
        <Col lg={9} md={9} sm={9} xs={8} className="text-start mt-3">
          <div><p className="mb-0">{localUser.username}</p></div>
          <div></div>
          <div><p style={{ fontSize: "12px" }}>Online</p></div>
        </Col>
      </Row>

      <Row className="mt-3 text-center">
        <Col lg={4} md={4} sm={4} xs={4} className="pt-2">
          <p><div className="font14-600">{myposts}</div><div className="font10grey">Posts</div></p>
        </Col>
        <Col lg={4} md={4} sm={4} xs={4} className="pt-2">
          <p><div className="font14-600">{item && (localUser.followersCount).length > 0 ? item.post : 0}</div> <div className="font10grey">Followers</div></p>
        </Col>
        <Col lg={4} md={4} sm={4} xs={4} className="pt-2">
          <p><div className="font14-600">{item && (localUser.likeCount).length > 0 ? item.post : 0}</div> <div className="font10grey" >Likes</div></p>
        </Col>
      </Row>

      <Row className="mt-4 text-center">
        <Col lg={12} md={12} sm={12} xs={12}>
          <Button className="postBtn" onClick={(e) => { handleShow(e); setFile(''); setFormData({ opinionFrom: "friends" }) }}>
            Add Post
          </Button>
        </Col>
      </Row>

      <Row className="mt-5 mx-0 justify-content-center">
        <Col lg={8} md={12} sm={12} sx={12}>
          {allpost && allpost.length > 0 ? allpost.map((val, ind) => {
            console.log(val)
            if (val && val.createdByDetails && (val.createdByDetails)._id === user._id) {
              if (user) {
                var userLiked = val && val.likes && val.likes.some(like => like.userId == user._id);
              } else {
                var userLiked = false;
              }
              return (
                <Card className="card">
                  <Row>
                    <Col lg={1} md={3} sm={3} xs={3} className="profileImg text-center pt-2 pe-0">
                      <img src={item !== '' ? imgPath(item) : ProfileIcon} alt="" className="img-fluid postProfile hand" />
                    </Col>
                    <Col lg={9} md={9} sm={9} xs={8} className="text-start mt-3">
                      <div><p className="mb-0 font14-600">{localUser.username}</p></div>
                    </Col>
                  </Row>
                  <hr className="mb-0" />
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
                      {userLiked ? <FontAwesomeIcon onClick={(e) => { likeSubmit(val, user) }} className="hand" icon={faHeart} style={{ color: "#ff0000", }} /> : <FontAwesomeIcon onClick={(e) => { likeSubmit(val, user) }} style={{ color: "#0000003d", }} className="hand" icon={faHeart} size="m" />}
                      <p className="mb-0 text-center" style={{ fontSize: "12px" }}>{val && val.likesUserDetails && (val.likesUserDetails).length > 0 ? (val.likesUserDetails).length : '0'}</p>
                    </Col>
                    <Col lg={4} md={4} sm={4} xs={4}>
                      <FontAwesomeIcon className="hand" onClick={(e) => { goToDetails(user, val) }} icon={faComment} />
                    </Col>

                    <Col lg={4} md={4} sm={4} xs={4}>
                      <FontAwesomeIcon className="hand" icon={faShare} />
                    </Col>
                  </Row>
                </Card>
              )
            }
          }) : 'No Post Yet !'}

        </Col>
      </Row>

      <Modal show={show} onHide={handleClose} animation={false}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header className="size1 pb-0" closeButton style={{ borderBottom: " 0 none" }}>
          <h6>Create Post</h6>
        </Modal.Header>
        <hr />
        <Modal.Body className="pt-0">



          {!(imageview) && <>
            <Row className="mt-2 mb-2 justify-content-center">
              <Col lg={8} md={8} sm={8} xs={8} className="text-center">
                <span className="takePhoto">Take from Gallary</span>
              </Col>
            </Row>
            <Row className="mt-2 mb-2 justify-content-center">
              <Col lg={8} md={8} sm={8} xs={8} className="text-center">
                <span className="takePhoto" onClick={(e) => { setImageview(true) }}>Take from Camera</span>
              </Col>
            </Row>
          </>}

          {imageview && <div>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/png"
              className='livephoto'
            />
            <button className='captureBtn' onClick={capture}>Capture photo</button>
            {capturedImage && (
              <div>
                <h6>Preview:</h6>
                <ht />
                <div className="image-preview">
                  {selectedFilter ? (
                    <img
                      src={applyImageFilter(capturedImage, selectedFilter)}
                      alt="Filtered"
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  ) : (
                    <img
                      src={capturedImage}
                      alt="Captured"
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                  )}
                </div>
                <div className="upperBox">
                  <button className='commonBtn' onClick={() => applyFilter(null)}>Original</button>
                  <button className='commonBtn' onClick={() => applyFilter('grayscale')}>Grayscale</button>
                  <button className='commonBtn' onClick={() => applyFilter('sepia')}>Sepia</button>
                  <button className='commonBtn' onClick={() => applyFilter('invert')}>Invert</button>
                  <button className='commonBtn' onClick={() => applyFilter('blur')}>Blur</button>
                  <button className='commonBtn' onClick={() => applyFilter('brightness')}>Brightness</button>
                  <button className='commonBtn' onClick={() => applyFilter('contrast')}>Contrast</button>
                  <button className='commonBtn' onClick={() => applyFilter('hue-rotate')}>Hue Rotate</button>
                  <button className='commonBtn' onClick={() => applyFilter('saturate')}>Saturate</button>
                  <button className='commonBtn' onClick={() => applyFilter('opacity')}>Opacity</button>
                  <button className='commonBtn' onClick={() => applyFilter('drop-shadow')}>Drop Shadow</button>
                  {/* Add more filter buttons as needed */}
                </div>
                <button className='captureBtn' onClick={uploadImage}>Upload Image</button>
              </div>
            )}
          </div>}


          {/* <WebcamCapture /> */}
          {false && <>
            <Form noValidate validated={validated} onSubmit={e => handleSubmit(e)}>
              <Row className="mx-2">

                <Col lg={4} className="imgcss" style={{ display: file === "" ? "none" : "block" }}>
                  <img src={file} alt="Image" />
                </Col>

                <Col lg={4} >
                  <Form.Group className="string" controlId="image">
                    <Row><Col><Form.Label>Photo</Form.Label></Col></Row>
                    <Form.Control
                      className="brdr frmcnt"
                      capture="user"
                      type="file"
                      placeholder="Select Picture"
                      accept="image/png, image/jpg, image/jpeg"
                      onChange={(e) => fileChangedHandler(e, 'image')}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid Photo.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col lg={4} className="txt">
                  <Form.Group className="mb-2" controlId="questionTitle">
                    <Row><Col><Form.Label>Caption</Form.Label>
                    </Col></Row>
                    <Form.Control className="brdr frmcnt" type="text" pattern="^[A-Za-z]+(?: [A-Za-z]+)*$" minLength={2} onChange={e => handleChange('questionTitle', e)} maxLength={32} value={formData.questionTitle ? formData.questionTitle : ""} />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid questionTitle.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

              </Row>

              <Row className="justify-content-end mt-3 mx-2">
                <Col lg={12} className="text-end">
                  <Button variant="secondary" className="btnk btnclrrr" type="submit">
                    POST
                  </Button>
                </Col>
              </Row>
            </Form>
          </>}
        </Modal.Body>
      </Modal>

      <Modal show={showComment} fullscreen={true} onHide={(e) => { commentClose() }}>
        <Modal.Body style={{ backgroundColor: bgColor, color: ftColor }}>
          <Form noValidate validated={validated} onSubmit={e => commentSubmit(e)} >
            <Row className="align-items-center mb-4">
              <Col xs={1} className="hand" onClick={(e) => { commentClose() }}>x</Col>
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
              {allpost && allpost.length > 0 && allpost.map((val, ind) => {
                if (val && val.createdByDetails && (val.createdByDetails)._id === user._id) {
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

    </>
  );
}

export default Profile;
