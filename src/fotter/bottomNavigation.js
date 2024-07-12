// BottomNav.js
import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import './bottomNac.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faQuestionCircle, faPen, faEnvelope, faHeart } from '@fortawesome/free-solid-svg-icons';
import questionService from '../services/questionService';
import { AuthContext } from '../contexts/AuthContext';
import {Row, Col, Modal, Card} from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import tiger from '../assest/img/panda.png';


function BottomNav() {
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();
  const token = localStorage.getItem('token')?localStorage.getItem('token'):'';
  const { user, logout } = React.useContext(AuthContext);
  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);
  const [notify, setNotify] = useState({});

  function handleShow(breakpoint) {
    setFullscreen(breakpoint);
    setShow(true);
  }

  const getList = async () => {
    try {
      console.log("Fetching notifications..."); 
      let resp = await questionService.notification(user);
      console.log("Response:", resp); 
    } catch (error) {
      console.error("Error fetching notifications:", error); 
    }
  }

  const callBell = ()=>{
    handleShow();
    getList()
  }
  
    const handleTabChange = (tab) => {
      setActiveTab(tab);
    };

  return (
    <>
    <div className="bottom-nav">
      <div 
        className={`nav-item ${activeTab === 'home' ? 'active' : ''} customCssBtmNav`} 
        onClick={() =>{ handleTabChange('home'); navigate('/')}}
      >
        <FontAwesomeIcon icon={faHome} size='xl' color='grey' />
        <div className='btmNavTxt'>Home</div>
      </div>
      <div 
        className={`nav-item ${activeTab === 'questions' ? 'active' : ''} customCssBtmNav`} 
        onClick={() =>{ handleTabChange('questions'); navigate('/myquestions')}}
      >
        <FontAwesomeIcon icon={faQuestionCircle} size='xl' color='grey' />
        <div className='btmNavTxt'>Questions</div>
      </div>
      <div 
        className={`nav-item ${activeTab === 'ask' ? 'active' : ''} customCssBtmNav`} 
        onClick={() =>{ handleTabChange('ask'); navigate(token !==''?'/postquestion':'/login')}}
      >
        <FontAwesomeIcon icon={faPen} size='xl' color='grey' />
        <div className='btmNavTxt'>Ask</div>
      </div>
      <div 
        className={`nav-item ${activeTab === 'messages' ? 'active' : ''} customCssBtmNav`} 
        onClick={(e) => {callBell(e);handleTabChange('messages');}}
      >
        <FontAwesomeIcon icon={faEnvelope} size='xl' color='grey' />
        <div className='btmNavTxt'>Messages</div>
      </div>
      <div 
        className={`nav-item ${activeTab === 'forYou' ? 'active' : ''} customCssBtmNav`} 
        onClick={() => handleTabChange('forYou')}
      >
        <FontAwesomeIcon icon={faHeart} size='xl' color='red' />
        <div className='btmNavTxt'>For You</div>
      </div>
    </div>
    <Modal className='mt-5' show={show} fullscreen={true} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Message</Modal.Title>
        </Modal.Header>
        <Modal.Body className='pt-0'>

          <Tabs
            defaultActiveKey="All"
            // id="fill-tab-example"
            className="mb-3 font12 bold500"
            fill
          >
            <Tab eventKey="All" title="All">
              <Row className="mt-3 mx-0 justify-content-center">
                <Col lg={8} md={12} sm={12} sx={12}>
                <Card className="card" onClick={(e)=>{navigate('/chatPage')}}>
                    <Card.Body className='p-0'>
                      <Row>
                        <Col lg={2} md={3} sm={3} xs={4} className="profileImg text-center pt-2 pb-2">
                          <img src={tiger} alt="" className="img-fluid notifications hand" />
                        </Col>
                        <Col lg={9} md={9} sm={9} xs={8} className="text-start pt-2">
                          <p style={{ marginBottom: "0px", fontSize: "13px", fontWeight: "500" }}>Abhay</p>
                          <p style={{ fontSize: "12px" }}>2 min ago</p>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="profile" title="Requests">
              <Row className="mt-4">
                <Col lg={12} md={12} sm={12} xs={12} className="text-start">
                  <p className="font14-600">Not Requests Yet !</p>
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default BottomNav;
