import '../../App.css'
import { Col, Container, form, Row, Button, Form, Modal } from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import React, { useState, useEffect, isValidElement } from "react";
import profile from "../../assest/img/actor.jpg";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faSquareShareNodes, faEllipsisVertical, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import questionService from '../../services/questionService';
import { ToastContainer, toast } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext';
import anony from "../../assest/img/profile.png";
import ShareButtons from '../../Admin/common/common.function';



const QuestionDetails = (props) => {
    const [item, setItem] = useState('');
    const navigate = useNavigate();
    let LoggedUser = localStorage && localStorage.getItem('user') ? localStorage.getItem('user') : '';
    const location = useLocation();
    const [ldata, setLdata] = useState(location.state);
    const [fullscreen, setFullscreen] = useState(true);
    const [reply, setReply] = useState({ commentId: "" })
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [anonymous, setAnonymous] = useState(true);
    const [newData, setNewData] = useState({});
    const [formData, setFormData] = useState({ postId: (ldata._id) });
    // const [formData, setFormData] = useState({ postId: ldata && (ldata._id) == 'undefined' ? (newData._id) : (ldata._id) });
    const handleClose = () => setShow(false);
    const handleClose1 = () => setShow1(false);
    const [validated, setValidated] = useState(false);
    const [isDisabled, setDisabled] = useState(false);
    let bgColor = anonymous === true ? "#5f5e5e" : "white";
    let ftColor = anonymous === true ? "white" : "#5f5e5e";
    // const { user } = React.useContext(AuthContext);
    const [allpost, setAllPost] = useState([]);
    const [visibleReplies, setVisibleReplies] = useState({});
    const [visibleReplies1, setVisibleReplies1] = useState({});
    const [userLiked, setUserLiked] = useState();
    const [commentLikeActive, setCommentLikeActive] = useState();
    const [showEditModel, setShowEditModel] = useState(false);
    const handleCloseEditM = () => setShowEditModel(false);
    const [confirm, setConfirm] = useState(false);
    const firmOpen = () => setConfirm(true);
    const firmClose = () => setConfirm(false);
    const [report, setReport] = useState(false);
    const reportOpen = () => setReport(true);
    const reportClose = () => setReport(false);
    const [share, setShare] = useState(false);
    const shareClose = () => setShare(false);
    const shareShow = () => setShare(true);
    const [text, setText] = useState('')



    const handleToggleAnonymous = () => setAnonymous(!anonymous);

    const user = localStorage && localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';
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

    function editModelShow(data) {
        setShowEditModel(true);
        setFormData({ content: data.content, postId: newData._id, commentId: data._id })
    }

    function handleShow1(breakpoint) {
        setReply({ commentId: breakpoint });
        setFormData({ ...formData, content: "" });

        setShow1(true);
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
                setLdata(resp.post);
                getList();
                handleClose();
                toast.success("Comment Added Successfully !")

            }

            if (resp) {
                // toast.success(resp.message)
                setShow(false);
                handleClose();
                setFormData({ ...formData, ...{ content: "" } })
                setValidated(false);

            } else {
                setDisabled(false);
                toast.error('Getting Some Error');
            }
            return false;
        }
    };

    const handleSubmit1 = async (event) => {
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
                handleClose1();
                getList();
            }

            if (resp) {
                toast.success(resp.message)
                setShow(false);
                handleClose1();
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

    const likePostSubmit = async (value, user) => {
        try {
            let resp = await questionService.likeQuestion(value, user);
            if (resp && resp.message == "Post unliked") {
                toast.success("Post unliked");
                setUserLiked(false);
            } else {
                toast.success("Post liked");
                setUserLiked(true);
            }
            // getList();
            // setAllPost(prevPosts => {
            //     return prevPosts.map(post => {
            //         if (post._id === value._id) {
            //             return { ...post, likes: resp.likes };
            //         }
            //         return post;
            //     });
            // });
        } catch (error) {
            // Handle error if necessary
        }
    };

    const likeCommentSubmit = async (value, user) => {
        try {
            let resp = await questionService.likeComment(value, user, newData);
            if (resp && resp.message == "Comment unliked") {
                toast.success("Unliked comment !")
                setCommentLikeActive(false);
            } else {
                setCommentLikeActive(true);
                toast.success("Liked comment !")
            }
            getList();
            // setAllPost(prevPosts => {
            //     return prevPosts.map(post => {
            //         if (post._id === value._id) {
            //             return { ...post, likes: resp.likes };
            //         }
            //         return post;
            //     });
            // });
        } catch (error) {
            // Handle error if necessary
        }
    };

    const updateCommentSubmit = async (event) => {
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

            let resp = await questionService.updateComment({ ...formData, user })
            if (resp) {
                setLdata(resp.post)
                handleCloseEditM();
                getList();
                toast.success("Updated SUuccessfully !")

            }

            if (resp) {
                setShow(false);
                handleCloseEditM();
                // setFormData({})
                setValidated(false);

            } else {
                setDisabled(false);
                toast.error('Getting Some Error');
            }
            return false;
        }
    };

    const deleteCommnetSummit = async (event) => {
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setValidated(true);
        } else {
            event.preventDefault();
            event.stopPropagation();
            setDisabled(true);

            try {
                let postData = new FormData();
                for (let key in user) {
                    postData.append(key, formData[key]);
                }

                let resp = await questionService.deleteCommnet({ ...formData, user });
                if (resp) {
                    // setLdata(resp.post);
                    firmClose();
                    getList();
                    toast.success("Deleted Successfully!");
                    setShow(false);
                    setValidated(false);
                    handleCloseEditM();
                } else {
                    setDisabled(false);
                    toast.error(resp.message);
                    firmClose();
                    handleCloseEditM();

                }
            } catch (error) {
                setDisabled(false);
                toast.error('An unexpected error occurred. Please try again.');
                firmClose();
                handleCloseEditM();
                // console.error(error);
            }
        }
        return false;
    };

    const getCommentAllReply = async (data) => {
        try {
            setDisabled(true);

            let resp = await questionService.getCommentAllReply({ ...data });
        console.log(resp)
            if (resp) {
                getList();
            } else {
                setDisabled(false);
            }
        } catch (error) {
            setDisabled(false);
            toast.error('An unexpected error occurred. Please try again.');
        }
    };

    const shareFunction = (val) => {
        shareShow();
        setText(val.questionTitle)
    }

    // const handleClick = (ind, itm) => {
    //     if (itm && itm.createdByDetails && ((itm.createdByDetails)._id === user._id) && itm.askanonymously != "yes") {
    //         navigate('/profile', { state: itm });
    //     } else {
    //         if (itm && itm.askanonymously != "yes") {
    //             navigate('/otherProfile', { state: itm });
    //         }
    //     }
    // };

    const goToProfile = (post, itm) => {
        if (itm && (itm._id === user._id) && post && post.askanonymously != "yes") {
            navigate('/profile', { state: itm });
        } else {
            if (post && post.askanonymously != "yes") {
                navigate('/otherProfile', { state: itm });
            }
        }
    };


    // const getList = async () => {
    //     const resp = await questionService.getAllQuestions();
    //     if (resp) {
    //         {
    //             resp && resp.length > 0 && resp.map((v, i) => {
    //                 console.log('/*/**//*/*/*/*/*',v)
    //                 if (v._id === ldata._id) {
    //                     // setAllPost(resp);
    //                     setNewData(v);
    //                     if (user) {
    //                         const userLiked = v && v.likes && v.likes.some(like => like.userId == user._id);
    //                         setUserLiked(userLiked)
    //                     } else {
    //                         setUserLiked(false)
    //                     }
    //                 }
    //             })
    //         }
    //     }
    //     setAllPost(resp);
    // }
    const getList = async () => {
        const resp = await questionService.getAllQuestions();
        if (resp) {
            const uniqueComments = new Set();
            resp.forEach(v => {
                if (v.comments) {
                    v.comments = v.comments.filter(comment => {
                        if (comment._id && !uniqueComments.has(comment._id)) {
                            uniqueComments.add(comment._id);
                            return true;
                        }
                        return false;
                    });
                }
            });
    
            resp.forEach((v) => {
                if (v._id === ldata._id) {
                    setNewData(v);
                    if (user) {
                        const userLiked = v.likes && v.likes.some(like => like.userId == user._id);
                        setUserLiked(userLiked);
                    } else {
                        setUserLiked(false);
                    }
                }
            });
    
            setAllPost(resp);
        }
    };
    

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
    };

    const toggleReplies = (commentId) => {
        setVisibleReplies((prevState) => ({
            ...prevState,
            [commentId]: !prevState[commentId]
        }));
    };

    function countCommentsByGender(data) {
        let maleCommentsCount = 0;
        let femaleCommentsCount = 0;
        let uniqueCommentIds = new Set();
    
        if (data && data.comments) {
            data.comments.forEach(comment => {
                if (comment._id && !uniqueCommentIds.has(comment._id)) {
                    uniqueCommentIds.add(comment._id);
                    if (comment.userDetails && comment.userDetails.gender) {
                        if (comment.userDetails.gender === 'male') {
                            maleCommentsCount++;
                        } else if (comment.userDetails.gender === 'female') {
                            femaleCommentsCount++;
                        }
                    }
                }
            });
        }
    
        return { maleCommentsCount, femaleCommentsCount };
    };

    function countLikesByGender(data) {
        let maleLikesCount = 0;
        let femaleLikesCount = 0;

        data && (data.likesUserDetails) && (data.likesUserDetails).forEach(like => {
            if (like.gender === 'male') {
                maleLikesCount++;
            } else if (like.gender === 'female') {
                femaleLikesCount++;
            }
        });

        return {
            maleLikesCount,
            femaleLikesCount
        };
    };

    const commentCount = countCommentsByGender(newData);
    const likeCount = countLikesByGender(newData);


    const toggleReplies1 = (commentId) => {
        setVisibleReplies1((prevState) => ({
            ...prevState,
            [commentId]: !prevState[commentId]
        }));
    };

    const handleChange = (name, event) => {
        let from = { ...formData };
        from[name] = event.target.value;
        setFormData({ ...formData, ...from });
    }

    useEffect(() => {
        getList();
    }, [])



    return (

        <>
            <Row className="mt-3 mx-0 justify-content-center mb-5">
                <Col lg={8} md={12} sm={12} sx={12}>
                    <Card className="card">
                        <Row className="px-2 mt-2">
                            <Col lg={9} md={9} sm={9} xs={9} className="text-start">
                                <p className="font12 fontgrey">{ldata && ldata.category}</p>
                            </Col>
                            <Col lg={3} md={3} sm={3} xs={3} className="text-center">
                                <p className="font10 fontgrey mb-1 mt-2">{timeDifference(ldata && ldata.createdAt)}</p>
                            </Col>
                        </Row>
                        <Card.Body className="pt-0">

                            <Card.Text className="font14-600 text-start mb-1">
                                {ldata && ldata.questionTitle}
                            </Card.Text>

                            <Row>
                                <Col lg={1} md={3} sm={3} xs={3} className="homeproImg text-start pt-2 pe-0">
                                    <img src={newData.askanonymously === 'no' ? profile : anony} onClick={() => goToProfile(ldata, (ldata.createdByDetails))} alt="" className="img-fluid homeproImg hand" />
                                </Col>
                                <Col lg={5} md={5} sm={6} xs={6} onClick={() => goToProfile(ldata, ldata.createdByDetails)} className="text-start mt-2 p-0">
                                    <div><p className="mb-0 font12 bold500" style={{ color: "blue" }}>{newData.askanonymously === 'no' ? (newData.createdByUsername) : "Anonymous"}</p></div>
                                    <div><p className="mb-0 font10 fontgrey">Age 18-24</p></div>
                                </Col>
                                <Col lg={4} md={4} sm={3} xs={3} className="text-start mt-3 p-0">
                                    <span> <FontAwesomeIcon icon={faComment} /></span> <span style={{ color: "#ff0732", fontSize: "12px", fontWeight: 700 }}>{commentCount.maleCommentsCount}</span> <span style={{ borderLeft: "2px solid grey" }}></span> <span style={{ color: "blue", fontSize: "12px", fontWeight: 700, paddingLeft: "5px" }}><span> </span>{commentCount.femaleCommentsCount}</span>
                                </Col>
                            </Row>
                            <Card.Text className="font13 text-start lineHeightNrml mt-4">
                                {ldata.description}
                            </Card.Text>
                        </Card.Body>

                        <hr className="mb-0" />

                        <Row className="p-3">
                            <Col lg={6} md={6} sm={6} xs={6} className="text-center pt-1"><span style={{ color: "#ff0732", fontSize: "12px", fontWeight: 700 }} >{likeCount.femaleLikesCount}</span>
                                <span className='mx-2'>{userLiked ? <FontAwesomeIcon onClick={(e) => { likePostSubmit(newData, user) }} className="hand" icon={faHeart} style={{ color: "#ff0000", }} /> : <FontAwesomeIcon onClick={(e) => { likePostSubmit(newData, user) }} style={{ color: "#0000003d", }} className="hand" icon={faHeart} size="m" />}</span>
                                <span style={{ color: "blue", fontSize: "12px", fontWeight: 700 }}>{likeCount.maleLikesCount}</span>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={6} className="text-center">
                                <FontAwesomeIcon onClick={(e) => { shareFunction(newData) }} icon={faSquareShareNodes} size="xl" />
                                <div><span style={{ fontWeight: "600", fontSize: "12px", color: "blue" }}>Share Question</span></div>
                            </Col>
                        </Row>
                        <hr className="mb-0 mt-0" />

                        <Row className="mt-3">
                            <Col lg={12} md={12} sm={12} xs={12} onClick={() => handleShow(newData)} className="text-center">
                                <p className='hand' style={{ color: `${LoggedUser.gender}=="male"` ? "#6060e5" : "red", fontSize: "12px" }}>What's Your Opinion ?</p>
                            </Col>
                        </Row>
                    </Card>

                    <Card className="card">
                        <Row>
                            <Col lg={12} md={12} sm={12} xs={12} className="text-start p-2" style={{ backgroundColor: `${LoggedUser.gender}=="male"` ? "#6060e5" : "red", color: "white", fontSize: "12px" }}>
                                <span className="whatGuySaid">What Guys Said</span>
                            </Col>
                            <Col lg={12} md={12} sm={12} xs={12}>

                                {newData && newData.comments && newData.comments.length > 0 && newData.comments.map((val, ind) => {
                                    if (val && val.userDetails && val.userDetails.gender === 'male') {
                                        return (
                                            <Row className='comntBx' key={ind}>
                                                <Col lg={1} md={3} sm={3} xs={3} onClick={() => goToProfile("second is userData", (val.userDetails))} className="homeproImg text-center pt-2 pe-0">
                                                    <img src={val.userDetails.profileImage ? val.userDetails.profileImage : profile} alt="" className="img-fluid homeproImg hand" />
                                                </Col>
                                                <Col lg={11} md={9} sm={9} xs={9} onClick={() => goToProfile("second is userData", (val.userDetails))} className="text-start mt-2 p-0">
                                                    <div><p className="mb-0 font12 bold500" style={{ color: "blue" }}>{val.userDetails.username}</p></div>
                                                    <div><p className="mb-0 font10 fontgrey">Age 18-24</p></div>
                                                </Col>
                                                <Col>
                                                    <Row>
                                                        <Col lg={10} md={10} sm={10} xs={10} className="text-start">
                                                            <p className="font12 text-start lineHeightNrml mt-2 mx-3">
                                                                {val && val.content}
                                                            </p>
                                                        </Col>
                                                        <Col lg={2} md={2} sm={2} xs={2} className='text-center'>
                                                            {(user && user._id == val && val.userDetails && val.userDetails._id) ? <FontAwesomeIcon onClick={(e) => { editModelShow(val) }} icon={faEllipsisVertical} className='fa-sm' /> : <FontAwesomeIcon onClick={(e) => { reportOpen(isValidElement) }} icon={faEllipsisVertical} className='fa-sm' />}

                                                        </Col>
                                                        {val.replies && val.replies.length > 0 && (
                                                            <Col lg={12} md={12} sm={12} xs={12} className="text-start">
                                                                <p className='hand replys' onClick={(e) => { toggleReplies(val._id); }}>
                                                                    {visibleReplies[val._id] ? 'Hide Replies' : 'Show Replies'}
                                                                </p>
                                                            </Col>
                                                        )}
                                                        {visibleReplies[val._id] && val.replies && val.replies.length > 0 && val.replies.map((v, i) => (
                                                            <Col lg={12} md={12} sm={12} xs={12} className="text-start" key={i}>
                                                                <p className="font13 text-start lineHeightNrml mt-2 mx-3">
                                                                    {v && v.content}
                                                                </p>
                                                            </Col>
                                                        ))}
                                                    </Row>
                                                </Col>
                                                <Row>
                                                    <Col lg={3} md={3} sm={4} xs={4} className='text-center'>
                                                        {(val && val.likes && (val.likes).userDetails && ((val.likes).userDetails)._id == user && user._id) ? <FontAwesomeIcon onClick={(e) => { likeCommentSubmit(val, user) }} className="hand" icon={faHeart} style={{ color: "#ff0000", }} /> : <FontAwesomeIcon onClick={(e) => { likeCommentSubmit(val, user) }} style={{ color: "#0000003d", }} className="hand" icon={faHeart} size="m" />}
                                                    </Col>
                                                    <Col lg={3} md={3} sm={3} xs={3} className='text-start'>
                                                    </Col>
                                                    <Col lg={6} md={6} sm={5} xs={5} onClick={(e) => { handleShow1(val._id) }} className='text-end'>
                                                        <p className='font13 bold600 hand'>REPLY</p>
                                                    </Col>
                                                </Row>
                                            </Row>
                                        );
                                    }
                                })}

                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12} md={12} sm={12} xs={12} className="text-start p-2" style={{ backgroundColor: "rgb(229 97 184)", color: "white", fontSize: "12px" }}>
                                <span className="whatGuySaid">What Girls Said</span>
                            </Col>
                            <Col lg={12} md={12} sm={12} xs={12}>
                                {newData && newData.comments && newData.comments.length > 0 && newData.comments.map((val, ind) => {
                                    if (val && val.userDetails && val.userDetails.gender === 'female') {
                                        return (
                                            <Row className='comntBx' key={ind}>
                                                <Col lg={1} md={3} sm={3} xs={3} onClick={() => goToProfile("second is userData", (val.userDetails))} className="homeproImg text-center pt-2 pe-0">
                                                    <img src={val.userDetails.profileImage ? val.userDetails.profileImage : profile} alt="" className="img-fluid homeproImg hand" />
                                                </Col>
                                                <Col lg={11} md={9} sm={9} xs={9} onClick={() => goToProfile("second is userData", (val.userDetails))} className="text-start mt-2 p-0">
                                                    <div><p className="mb-0 font12 bold500" style={{ color: "blue" }}>{val.userDetails.username}</p></div>
                                                    <div><p className="mb-0 font10 fontgrey">Age 18-24</p></div>
                                                </Col>
                                                <Col lg={12} md={12} sm={12} xs={12}>
                                                    <Row>
                                                        <Col lg={10} md={10} sm={10} xs={10} className="text-start">
                                                            <p className="font12 text-start lineHeightNrml mt-2 mx-3">
                                                                {val && val.content}
                                                            </p>
                                                        </Col>
                                                        <Col lg={2} md={2} sm={2} xs={2} className='text-center'>
                                                            <FontAwesomeIcon onClick={(e) => { editModelShow(val) }} icon={faEllipsisVertical} className='fa-sm' />
                                                        </Col>
                                                        {val.replies && val.replies.length > 0 && (
                                                            <Col lg={12} md={12} sm={12} xs={12} className="text-start">
                                                                <p className='hand replys' onClick={() => toggleReplies1(val._id)}>
                                                                    {visibleReplies1[val._id] ? 'Hide Replies' : 'Show Replies'}
                                                                </p>
                                                            </Col>
                                                        )}
                                                        {visibleReplies1[val._id] && val.replies && val.replies.length > 0 && val.replies.map((v, i) => (
                                                            <Col lg={12} md={12} sm={12} xs={12} className="text-start" key={i}>
                                                                <p className="font12 text-start lineHeightNrml mt-2 mx-3">
                                                                    {v && v.content}
                                                                </p>
                                                            </Col>
                                                        ))}
                                                    </Row>
                                                </Col>
                                                <Row>
                                                    <Col lg={3} md={3} sm={4} xs={4} className='text-center'>
                                                        {(val && val.likes && (val.likes).userDetails && ((val.likes).userDetails)._id == user && user._id) ? <FontAwesomeIcon onClick={(e) => { likeCommentSubmit(val, user) }} className="hand" icon={faHeart} style={{ color: "#ff0000", }} /> : <FontAwesomeIcon onClick={(e) => { likeCommentSubmit(val, user) }} style={{ color: "#0000003d", }} className="hand" icon={faHeart} size="m" />}
                                                    </Col>
                                                    <Col lg={3} md={3} sm={3} xs={3} className='text-start'>
                                                        {/* <FontAwesomeIcon icon={faThumbsDown} /> */}
                                                    </Col>
                                                    <Col lg={6} md={6} sm={5} xs={5} onClick={(e) => { handleShow1(val._id) }} className='text-end'>
                                                        <p className='font13 bold600 hand'>REPLY</p>
                                                    </Col>
                                                </Row>
                                            </Row>
                                        );
                                    }
                                })}
                                {/* {ldata && ldata.comments && (ldata.comments).length > 0 && (ldata.comments).map((val, ind) => {

                                    if (val && (val.userDetails) && (val.userDetails).gender === "female") {
                                        return (
                                            <Row className='comntBx'>
                                                <Col lg={1} md={3} sm={3} xs={3} className="homeproImg text-center pt-2 pe-0">
                                                    <img src={item !== '' ? imgPath(item) : profile} alt="" className="img-fluid homeproImg hand" />
                                                </Col>
                                                <Col lg={11} md={9} sm={9} xs={9} className="text-start mt-2 p-0">
                                                    <div><p className="mb-0 font12 bold500" style={{ color: "blue" }}>{val.userDetails.username}</p></div>
                                                    <div><p className="mb-0 font10 fontgrey">Age 18-24</p></div>
                                                </Col>
                                                <Col>
                                                    <Row>
                                                        <Col lg={12} md={12} sm={12} xs={12} className="text-start">
                                                            <p className="font13 text-start lineHeightNrml mt-2 mx-3">
                                                                {val && val.content}
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                </Col>

                                                <Row>
                                                    <Col lg={3} md={3} sm={4} xs={4} className='text-center'>
                                                        <FontAwesomeIcon icon={faHeart} /><span> 5</span>| <span> 1</span>
                                                    </Col>
                                                    <Col lg={3} md={3} sm={3} xs={3} className='text-start'>
                                                    </Col>
                                                    <Col lg={6} md={6} sm={5} xs={5} className='text-end' onClick={(e) => { handleShow1(val) }}>
                                                        <p>REPLY</p>
                                                    </Col>
                                                </Row>
                                                <hr className='m-0' />
                                            </Row>
                                        )
                                    }
                                })} */}

                            </Col>
                        </Row>
                    </Card>


                </Col>
            </Row>
            <Row className='positionfx text-center px-0 mx-0'>
                <Col lg={12} md={12} sm={12} xs={12} onClick={(e) => handleShow(newData)}>
                    <Button className='QesAskSubBtn'>Add Opinion</Button>
                </Col>
            </Row>

            <Modal show={show} fullscreen={true} onHide={handleClose}>
                {/* <Modal.Header closeButton>
                        <Modal.Title>Modal</Modal.Title>
                    </Modal.Header> */}
                <Modal.Body style={{ backgroundColor: bgColor, color: ftColor }}>
                    <Form noValidate validated={validated} onSubmit={e => handleSubmit(e)} >
                        {/* Top Row: Profile Photo, User Name, Submit Button */}
                        <Row className="align-items-center mb-4">
                            <Col xs={1} onClick={handleClose}>x</Col>
                            <Col xs={2}>
                                {/* <Image src={profile} roundedCircle fluid /> */}
                            </Col>
                            <Col xs={6}>
                                {/* <Row>
                                        <Col lg={12} md={12} sm={12} xs={12}>
                                            <p className="mb-0" style={{ fontSize: "12px", fontWeight: "600" }}>John Marker Dell</p>
                                        </Col>
                                        <Col lg={12} md={12} sm={12} xs={12}>
                                            <p className="mb-0" style={{ fontSize: "12px" }}>{user.username}</p>
                                        </Col>
                                    </Row> */}
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
                                {/* <Form.Group className="string" controlId="image" >
                                        <Form.Control style={{ backgroundColor: bgColor, color: ftColor }} className="brdr frmcnt" type="file" placeholder="" accept="image/png, image/jpg, image/jpeg" onChange={e => fileChangedHandler(e, 'image')} />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide a valid Photo.
                                        </Form.Control.Feedback>
                                    </Form.Group> */}
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={show1} fullscreen={true} onHide={handleClose1}>
                {/* <Modal.Header closeButton>
                        <Modal.Title>Modal</Modal.Title>
                    </Modal.Header> */}
                <Modal.Body style={{ backgroundColor: bgColor, color: ftColor }}>
                    <Form noValidate validated={validated} onSubmit={e => handleSubmit1(e)} >
                        <Row className="align-items-center mb-4">
                            <Col xs={1} onClick={handleClose1}>x</Col>
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

            <Modal show={showEditModel} onHide={handleCloseEditM}>
                <Modal.Body style={{ backgroundColor: bgColor, color: ftColor }}>
                    <Form noValidate validated={validated} onSubmit={e => updateCommentSubmit(e)} >
                        <Row className="align-items-center mb-4">
                            <Col xs={1} onClick={handleCloseEditM}>x</Col>
                            <Col xs={2}>
                            </Col>
                            <Col xs={6}>

                            </Col>
                            <Col xs={2} className="text-end">
                                <Button className="askQesBtn" type="submit">
                                    Update
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
                                <span onClick={(e) => { firmOpen() }}>
                                    <FontAwesomeIcon icon={faTrash} style={{ color: "#ff0000", }} />
                                    <span style={{ fontWeight: "700", fontSize: "12px", color: "black" }}>Remove Comment !</span>
                                </span>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={confirm} onHide={firmClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Alert !</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure to delete your comment
                    <Form noValidate validated={validated} onSubmit={e => deleteCommnetSummit(e)} >
                        <Row className="align-items-center mb-4">
                            <Col xs={12} className="text-end">
                                <Button className="btnclrrr" type="submit">
                                    Yes
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={report} onHide={reportClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Report !</Modal.Title>
                </Modal.Header>
                <Modal.Body>Create Report Regarding Post
                    <Form noValidate validated={validated} onSubmit={e => deleteCommnetSummit(e)} >
                        <Row className="align-items-center mb-4">
                            <Col lg={12} md={12} sm={12} xs={12}>
                                <Form.Group controlId="exampleForm.ControlInput1" className="inputBigField" >
                                    <Form.Control onChange={e => handleChange('report', e)} value={formData.report ? formData.report : ""} type="text" placeholder="What, When, Why...  ask" disabled />
                                </Form.Group>
                            </Col>
                            <Col xs={2} className="text-end">
                                <Button className="" type="submit" disabled>
                                    Send
                                </Button>
                            </Col>
                        </Row>
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


        </>
    );
}

export default QuestionDetails;