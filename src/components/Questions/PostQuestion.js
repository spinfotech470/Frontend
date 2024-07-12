import React, { useState, memo, useEffect } from "react";
import { Card, Col, Container, Form, Row, Button } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import { Link, useNavigate } from 'react-router-dom';
import { imgPath } from '../common/common.function';
import profile from "../../assest/img/profile.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faThumbsUp, faThumbsDown } from '@fortawesome/free-regular-svg-icons';
import { faSquareShareNodes } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../contexts/AuthContext';
import questionService from '../../services/questionService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AskForm = (props) => {
    const [modalShow, setModalShow] = useState(false);
    const [Step, setStep] = useState(1);
    const [category, setCategory] = useState({})
    const [modalShow1, setModalShow1] = useState(false);
    const [formData, setFormData] = useState({
      askanonymously: 'no',
      opinionFrom: 'everyone',
      anonymousOpinion: 'Optional',
    });
    // const dispatch = useDispatch();
    const [file, setFile] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [show, setShow] = useState(true);
    const [userName, setUserName] = useState('');
    const handleClose = () => navigate('/');
    const handleShow = () => setShow(true);
    const [validated, setValidated] = useState(false);
    const [isDisabled, setDisabled] = useState(false);
    let LoggedUser = localStorage && localStorage.getItem('user');
  const {  user } = React.useContext(AuthContext);

    const navigate = useNavigate();
    let item;

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
        
            let stp = Step + 1;
            setStep(stp);

            let resp = (stp == 4) ? ( await questionService.createQuestion({ ...formData,user })) : { code: 500 } && setValidated(false)
            setDisabled(false);
            if(resp){
                handleClose();
            }

            if (resp && resp.code === 200) {
                toast.success('Question Post Successfully !')
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

    // const handleChange = (name, event) => {
    //     let from = { ...formData };
    //     from[name] = event.target.value;
    //     setFormData({ ...formData, ...from });
    // }
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

    useEffect(() => {
setUserName('')
        // getList();
        // getCatList();
    }, [])
    console.log(formData)

    return (
        <>
            <Modal show={show} onHide={handleClose} animation={false}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header className="size1 pb-0" closeButton style={{ borderBottom: " 0 none" }}>
                    <h5>Ask</h5>
                </Modal.Header>
                <hr />
                <Modal.Body className="pt-0">
                    {/* <AlertBox /> */}
                    <Form noValidate validated={validated} onSubmit={e => handleSubmit(e)}>


                        {Step == 1 &&
                            <>
                                <Row>
                                    <Col className='p-0 topPb'>
                                        {/* <img src={progress1} alt="first" style={{ width: "100%" }} /> */}
                                    </Col>
                                </Row>

                                <Row className="mx-2">
                                    <Col lg={4} className="txt">
                                        <Form.Group className="mb-2" controlId="questionTitle">
                                            <Row><Col><Form.Label>Question title<span className='star'>*</span></Form.Label>
                                            </Col></Row>
                                            <Form.Control className="brdr frmcnt" type="text" minLength={2} onChange={e => handleChange('questionTitle', e)} maxLength={150} value={formData.questionTitle ? formData.questionTitle : ""} required />
                                            <Form.Control.Feedback type="invalid">
                                                Please provide a valid questionTitle.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    <Col lg={4} className="txt">
                                        <Form.Group controlId="description">
                                            <Row><Col><Form.Label>Add Details</Form.Label>
                                            </Col></Row>
                                            <Form.Control className="brdr frmcnt" type="text" onChange={e => handleChange('description', e)} value={formData.description ? formData.description : ""} />
                                            <Form.Control.Feedback type="invalid">
                                                Please provide a valid Registered Number.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                   
                                    <Col lg={4}>
                                    <Form.Group className="mb-2" controlId="category">
                                            <Form.Label>Category</Form.Label>
                                            <Form.Select className="brdr frmcnt" aria-label="Default select example" onChange={e => handleChange('category', e)} value={formData.category ? formData.category : ""}>
                                            <option value="Some Thing Special">Select Any Category</option>
                                                <option value="entertainment">entertainment</option>
                                                <option value="education">education</option>
                                                <option value="news">news</option>
                                                <option value="business">business</option>
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                Please provide a valid Option.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col lg={4}>
                                    <Form.Group className="string" controlId="image">
                                        <Row><Col><Form.Label>Photo</Form.Label></Col></Row>
                                        <Form.Control className="brdr frmcnt" type="file" placeholder="Select Picture" accept="image/png, image/jpg, image/jpeg" onChange={e => fileChangedHandler(e, 'image')} />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide a valid Photo.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    </Col>
                                    <Col lg={4} className="imgcss">
                                        <img src={file} />
                                    </Col>
                                </Row>

                                <Row className="justify-content-end mt-3 mx-2">
                                    <Col lg={12} className="text-end">
                                        <Button variant="secondary" className="btnk btnclrrr" disabled={isDisabled} type="submit">
                                            Next
                                        </Button>
                                    </Col>
                                </Row>
                            </>
                        }
                        {Step == 2 &&
                            <div>
                                <Row>
                                    <Col lg={12} className="p-0">
                                        {/* <img src={progress2} style={{ width: "100%" }}></img> */}
                                    </Col>
                                </Row>
                                <Row className="mx-2">
                                  
                                    <Col lg={4} className="txt">
                                    <Form.Check 
                                    type="switch"
                                    id="askanonymously"
                                    className="frmcnt"
                                    onChange={e => handleChange('askanonymously', e)} value={formData.askanonymously ? formData.askanonymously : ""}
                                    label="Ask this anonymously"
                                    />
                                    <hr />
                                    
                                    </Col>

                                    <Col lg={4} className="txt">
                                    <Form.Label>Get Opinion From</Form.Label>
                                    <span className="inlineCustom">
                                    <Form.Check
                                      reverse
                                      label="Everyone"
                                      className="frmcnt"
                                      name="group1"
                                      type="radio"
                                      id="everyone"
                                      onChange={(e) => handleChange('opinionFrom', e)}
                                      checked={formData.opinionFrom === 'everyone'}
                                    />
                                    <Form.Check
                                      reverse
                                      label="Girls"
                                      name="group1"
                                      className="frmcnt"
                                      type="radio"
                                      id="girls"
                                      onChange={(e) => handleChange('opinionFrom', e)}
                                      checked={formData.opinionFrom === 'girls'}
                                    />
                                    <Form.Check
                                      reverse
                                      label="Guys"
                                      name="group1"
                                      className="frmcnt"
                                      type="radio"
                                      id="guys"
                                      onChange={(e) => handleChange('opinionFrom', e)}
                                      checked={formData.opinionFrom === 'guys'}
                                    />
                                    </span>
                                  </Col>

                                  <hr />

                                  <Col lg={4} className="txt">
                                    <Form.Label>Anonymous Opinion</Form.Label>
                                    <span className="inlineCustom">
                                    <Form.Check
                                      reverse
                                      label="Optional"
                                      name="group2"
                                      className="frmcnt"
                                      type="radio"
                                      id="Optional"
                                      onChange={(e) => handleChange('anonymousOpinion', e)}
                                      checked={formData.anonymousOpinion === 'Optional'}
                                    />
                                    <Form.Check
                                      reverse
                                      label="None"
                                      name="group2"
                                      className="frmcnt"
                                      type="radio"
                                      id="None"
                                      onChange={(e) => handleChange('anonymousOpinion', e)}
                                      checked={formData.anonymousOpinion === 'None'}
                                    />
                                    </span>
                                  </Col>

                                </Row>
                                <hr />
                                <Row className="mx-2">
                                    <Col className='col-6 col-lg-8 col-sm-6 '>   <Button variant="secondary" className="btnk mt-4 btnclrrr" onClick={e => setStep(Step - 1)}>
                                        Back
                                    </Button></Col>
                                    <Col className='col-6 col-lg-4 col-sm-6 text-end'>   <Button variant="secondary" className="btnk btnclrrr mt-4" type="submit">
                                        Preview
                                    </Button></Col>
                                </Row>
                            </div>
                        }
                        {Step == 3 &&
                            <div>
                                <Row>
                                    <Col lg={12} className="p-0">
                                        <p ><span className="howlook">{formData && formData.category != ''?formData.category:''}</span></p>
                                    </Col>
                                </Row>
                                <Row>
                                  <Col lg={12} md={12} sm={12} xs={12}>
                                  <h6>{formData.questionTitle}</h6>
                                  </Col>
                                  <Col lg={12} md={12} sm={12} xs={12} className="mb-3">
                                  <Row>
                                  <Col lg={1} md={3} sm={3} xs={3} className="homeproImg text-center pt-2 pe-0">
                                  <img src={item !== '5' ? imgPath(item) : profile} alt="" className="img-fluid homeproImg hand" />
                                </Col>
                                <Col lg={5} md={5} sm={6} xs={6} className="text-start mt-3 p-0">
                                  <div><p className="mb-0 font12 bold500" style={{color:"blue"}}>{formData.askanonymously==='yes'?"Anonymous":userName}</p></div>
                                  <div><p className="mb-0 font10 fontgrey">Age 18-24</p></div>
                                </Col>
                                  </Row>
                                  </Col>
                                  <hr />
                                </Row>

                        <Row className="p-3 pt-0 pb-1">
                            <Col lg={6} md={6} sm={6} xs={6} className="text-center pt-1"><span style={{ color: "orange" }} >3 </span>
                                <span className="likeBox"><FontAwesomeIcon icon={faThumbsUp} /></span>
                                <span style={{ color: "blue" }}> 5 </span>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={6} className="text-center">
                                <FontAwesomeIcon icon={faSquareShareNodes} size="xl" />
                                <div><span style={{ fontWeight: "600", fontSize: "12px", color: "blue" }}>Share</span></div>
                            </Col>
                        </Row>
                        <hr className="mb-0 mt-0" />

                        <Row className="mt-3">
                            <Col lg={12} md={12} sm={12} xs={12} className="text-center">
                                <p style={{ color: `${LoggedUser && LoggedUser.gender}=="male"` ? "#6060e5" : "red", fontSize: "12px" }}>What's Your Opinion ?</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6} md={6} sm={6} xs={6} className="text-center">
                            <Button className="QesAskBtnUpr pdUprBtn1" onClick={handleClose}>DELETE</Button>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={6}  className="text-center">
                            <Button onClick={e => setStep(Step - 2)} className="QesAskBtnUpr pdUprBtn2">EDIT</Button>
                            </Col>
                            <Col lg={12} md={12} sm={12} xs={12}  className="text-center mt-2">
                            <Button type="submit" className="QesAskSubBtn">SUBMIT</Button>
                            </Col>
                        </Row>

                                {/*
                                <Row className="mt-3 g-2 mx-2">
                                    <Col className='col-6 col-lg-8 col-sm-6 '>
                                        <Button variant="secondary" type='submit' className="btnk btnclrrr" onClick={e => setStep(Step - 1)}>
                                            Back
                                        </Button>
                                    </Col>
                                    <Col className='col-6 col-lg-4 col-sm-6 text-end'>
                                        <Button variant="secondary" type='submit' className="btnk btnclrrr" disabled={isDisabled}>
                                            Save
                                        </Button>
                                    </Col>
                                </Row> */}
                            </div>
                        }
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}


export default memo(AskForm);





// import React, { useState } from 'react';
// import Modal from 'react-modal';
// import './PostForm.css';  // Import the CSS file for styling
// import questionService from '../../services/questionService';
// import { AuthContext } from '../../contexts/AuthContext';


// Modal.setAppElement('#root');  // Ensure accessibility

// const PostQuestion = () => {
//   const [currentScreen, setCurrentScreen] = useState(1);
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const {  user } = React.useContext(AuthContext);
//   const [formData, setFormData] = useState({
//     title: '',
//     gender: '',
//     description: ''
//   });
//   const [errors, setErrors] = useState({
//     title: '',
//     gender: '',
//   });
//   // console.log(user)

//   // Assume you get the user from a context or a global state
//   // const userId = user.user_id;
 

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));

//     // Validation
//     if (name === 'title') {
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         title: value ? '' : 'Title is required',
//       }));
//     }
//   };

//   const handleGenderChange = (event) => {
//     const gender = event.target.value;
//     setFormData((prevData) => ({
//       ...prevData,
//       gender: gender,
//     }));
//   };

//   const handleNext = () => {
//     if (formData.title.trim() === '') {
//       setError('Title is required.');
//     } else {
//       setError('');
//       setCurrentScreen(currentScreen + 1);
//     }
//   };

//   const handlePrevious = () => {
//     setError('');
//     setCurrentScreen(currentScreen - 1);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     console.log(formData)
//     // Validation
//     const titleError = formData.title ? '' : 'Title is required';
//     const genderError = formData.gender ? '' : 'Gender is required';
//     setErrors({
//       title: titleError,
//       gender: genderError,
//     });

//     if (titleError || genderError) {
//       return;
//     }

//     try {
//       setLoading(true);
//       await questionService.createQuestion({ ...formData,user });
//       setSuccessMessage('Successfully posted!');
//       setLoading(false);
//       alert('Posted');
//       setModalIsOpen(false);  // Close the modal on successful submission
//     } catch (error) {
//       setLoading(false);
//       if (error.response && error.response.status === 409) {
//         // Assuming 409 is the status code for already registered
//         setErrorMessage('Failed.');
//       } else {
//         setErrorMessage('Submission failed. Please try again.');
//       }
//     }
//   };

//   return (
//     <div>
//       <button onClick={() => setModalIsOpen(true)}>Post</button>
//       <Modal 
//         isOpen={modalIsOpen}
//         onRequestClose={() => setModalIsOpen(false)}
//         contentLabel="Post Form Modal"
//         className="modal"
//         overlayClassName="overlay"
//       >
//         <div>
//           {currentScreen === 1 && (
//             <div>
//               <h2>Your Question</h2>
//               <input
//                 type="text"
//                 placeholder="Title"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//               />
//               <textarea
//                 placeholder="Description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//               ></textarea>
              
//               <button className="next-button" onClick={handleNext}>Next</button>
//             </div>
//           )}
//           {currentScreen === 2 && (
//             <div>
//               <h2>Question For</h2>
//               <select value={formData.gender} onChange={handleGenderChange}>
//                 <option value="other">Everyone</option>
//                 <option value="male">Male</option>
//                 <option value="female">Female</option>
//               </select>
//               {error && <p className="error">{error}</p>}
              
//               <button className="previous-button" onClick={handlePrevious}>Previous</button>
//               <button className="submit-button" onClick={handleSubmit}>Submit</button>
//             </div>
//           )}
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default PostQuestion;
