import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import profile from "../../assest/img/profile.png";
import { imgPath } from "../common/common.function";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTag } from '@fortawesome/free-solid-svg-icons';
import { Row, Col, Form, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import chatService from "../../services/chatService";
const { baseUrl } = require('../utils/config');



const Chat = () => {
  // const { user} = useContext(AuthContext);
  const user = localStorage.getItem("user");
  const item = ''
  const location = useLocation();
  const [otherUser, setLdata] = useState(location.state);

  const socket = io(baseUrl, {
    auth: {
      user: user,
    },

    transports: ["websocket", "polling"],
  });
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState([]);
  const [input, setInput] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [uniqueMessages, setUniqueMessages] = useState([]);
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    socket.on("message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    socket.on("connect_error", (err) => {
      console.log("Connection error:", err.message);
    });

    return () => {
      socket.off("connect");
      socket.off("message");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("message", {
        sender: user.username,
        receiver: otherUser.username,
        message: input,
        type: "text",
      });
      setInput("");

      // Call fetchMessages immediately after sending a message
      fetchMessages();
    }
  };

  const sendImage = () => {
    if (image) {
      const reader = new FileReader();
      reader.onload = () => {
        socket.emit("message", {
          sender: user.username,
          receiver: otherUser.username,
          message: reader.result,
          type: "image",
        });
        setImage(null);
      };
      reader.readAsDataURL(image);
    }
  };



  const fetchMessages = async () => {
    try {
     const res = await chatService.getChatData(JSON.parse(user), otherUser,page);
      setMessages((prevMessages) => [...prevMessages, ...res]);
      setPage(page + 1);
      if (res.data.length === 0) {
        setHasMore(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleNavigation = () => {
    navigate('/');
  };

  // useEffect(()=>{
  //   fetchMessages();
  // },[])


  useEffect(() => {
    fetchMessages();
  }, [input])

  useEffect(() => {
    const getUniqueMessages = (messages) => {
      const uniqueMessages = [];
      const messageIds = new Set();

      messages.forEach((message) => {
        if (!messageIds.has(message._id)) {
          uniqueMessages.push(message);
          messageIds.add(message._id);
        }
      });

      return uniqueMessages.reverse();
    };

    setUniqueMessages(getUniqueMessages(messages));
  }, [messages]);

  return (

    <>
      <Row className="pb-1 pt-2 shadow-sm">
        <Col lg={2} md={2} sm={2} xs={2} className="text-end pt-1">
          <FontAwesomeIcon onClick={handleNavigation} icon={faArrowLeft} />
        </Col>
        <Col lg={2} md={2} sm={2} xs={2} className="text-start pt-1">
          <img src={item !== '' ? imgPath(item) : profile} alt="" className="img-fluid chatProfile hand" />
        </Col>
        <Col lg={4} md={4} sm={4} xs={4} className="text-start pt-1 px-0">
          <p className="font12 pt-1">{otherUser.username}</p>
        </Col>
        <Col lg={3} md={3} sm={3} xs={3} className="text-end pt-1 px-2">
          <FontAwesomeIcon icon={faTag} />
        </Col>
      </Row>

      <Row className="justify-content-center mt-3">
        <Col lg={12} md={12} sm={12} xs={12} className="text-center">
          <img src={item !== '' ? imgPath(item) : profile} alt="" className="img-fluid reqProfile hand" />
        </Col>
        <Col lg={12} md={12} sm={12} xs={12}>
          <Row>
            <Col lg={12} md={12} sm={12} xs={12} className="text-center">
              <p className="font13 bold600 mb-1"><span>YouthAdda-</span><span>{otherUser.username}</span></p>
            </Col>
            <Col lg={12} md={12} sm={12} xs={12} className="text-center">
              <p className="mb-0 font13"><span>1.3k followers</span><span>12 posts</span></p>
            </Col>
            <Col lg={12} md={12} sm={12} xs={12} className="text-center">
              <span className="mb-0 font13">You don't follow each other on youthAdda</span>
            </Col>
            <Col lg={12} md={12} sm={12} xs={12} className="text-center mt-3">
              <span className="viewPrfl">View Profile</span>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="mt-3 text-center">
        <Col lg={12} md={12} sm={12} xs={12}>
          <p className="fontgrey font13">16 Aug 12:34</p>
        </Col>
        <Col lg={12} md={12} sm={12} xs={12} className="mt-3">
          <Row className="justify-content-end">

            <InfiniteScroll
              dataLength={uniqueMessages.length}
              next={fetchMessages}
              hasMore={hasMore}
              // loader={<h4>Loading...</h4>}
              inverse={true}
            >

              {uniqueMessages && uniqueMessages.length > 0 && uniqueMessages.map((v, i) => {
                if (v.sender != JSON.parse(user).username) {
                 return <Col lg={12} md={12} sm={12} xs={12} className="text-start px-1 mt-1" ><span className="ChatSms" key={v._id}>{v.message}
                  <span className="smsTime">{new Date(v.timestamp).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}</span></span></Col>
                } else {
                 return <Col lg={12} md={12} sm={12} xs={12} className="text-end px-1 mt-1" ><span className="ChatSms" style={{borderRadius:" 7px 0px 7px 7px"}} key={v._id}>{v.message}<span className="smsTime">{new Date(v.timestamp).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                 </span></Col>
                }
              })
              }
            </InfiniteScroll>

          </Row>
        </Col>
      </Row>

      {/* repliy section */}

      <Row className="text-center">
        <Col lg={12} md={12} sm={12} xs={12} className="mt-5">
          <Form noValidate validated={validated} >
            <Row className="px-3">
              <Col lg={10} md={10} sm={10} xs={10} className="csshere0">
                <Form.Group controlId="exampleForm.ControlInput1" >
                  <Form.Control className="csshere1" value={input} onChange={(e) => setInput(e.target.value)} type="text" placeholder="Type Message............" />
                </Form.Group>
                <p className="font20 bold600 csshere2"><span className="docs">+</span></p>
              </Col>
              {/* <Col lg={1} md={1} sm={1} xs={1} className="text-start px-0 mt-1">
                        <p className="font20 bold600"><span className="docs">+</span></p>
                    </Col> */}
              <Col lg={2} md={2} sm={2} xs={2} className="text-start px-0 mt-2">
                <Button className="askQesBtn" onClick={sendMessage}>
                  Send
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </>
    // <div>

    //   <InfiniteScroll
    //     dataLength={uniqueMessages.length}
    //     next={fetchMessages}
    //     hasMore={hasMore}
    //     loader={<h4>Loading...</h4>}
    //     inverse={true}
    //   >
    //     {uniqueMessages.map((msg) => (
    //       <div key={msg._id}>{msg.message}</div>
    //     ))}
    //   </InfiniteScroll>
    //   <input
    //     type="text"
    //     value={input}
    //     onChange={(e) => setInput(e.target.value)}
    //   />
    //   <button onClick={sendMessage}>Send</button>
    // </div>
  );
};

export default Chat;
