import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { AuthContext } from '../contexts/AuthContext';
import userPhoto from "../assest/img/actor.jpg";
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faShare, faUser, faBell, faArrowLeft, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import tiger from '../assest/img/panda.png';
import questionService from '../services/questionService';

const pages = [
  { name: 'Login', route: '/login' },
  { name: 'Signup', route: '/signup' }
];
const settings = ['Profile', 'Logout'];

function TopBar() {
  const token = localStorage.getItem('token');
  const { user, logout } = React.useContext(AuthContext);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();
  const userDatas = localStorage.getItem('socialData');
  const values = [true];
  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [notify, setNotify] = useState({});
  const [userId, setUserId] = useState(localStorage && localStorage.getItem('user'))

  let item;
  let imgPath


  function handleShow(breakpoint) {
    setFullscreen(breakpoint);
    setShow(true);
  }

  function handleShow1(breakpoint) {
    setFullscreen(breakpoint);
    setShow1(true);
  }

  // const getList = async ()=>{
  //   try {
  //     let resp = await questionService.notification(user);
  //     console.log(resp)
  //     if(resp){
  //       setNotify(resp);
  //     }
  //   } catch (error) {
      
  //   }
  // }

  const getList = async () => {
    try {
      console.log(user); 
      let resp = await questionService.notification(userId);
      console.log("Response:", resp); 
      if (resp) {
        setNotify(resp);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error); 
    }
  }

  const callBell = ()=>{
    handleShow();
    getList()
  }



  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuItemClick = (route) => {
    handleCloseNavMenu();
    navigate(route);
  };

  const handleUserMenuClick = (setting) => {
    handleCloseUserMenu();
    if (setting === 'Logout') {
      logout();
      localStorage.removeItem('token');
      localStorage.clear();
      navigate('/login');
    } else {
      navigate(`/${setting.toLowerCase()}`);
    }
  };
  useEffect(()=>{
    getList();
  },[])

  console.log(notify)

  return (
    <AppBar position="static">

      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Youth Adda
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {!token && pages.map((page) => (
                <MenuItem key={page.name} onClick={() => handleMenuItemClick(page.route)}>
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Youth Adda
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {!token && pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => handleMenuItemClick(page.route)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
            {token ? (
              <>
                <IconButton color="inherit">
                  <SearchIcon onClick={() => handleShow1()} />
                </IconButton>
                <IconButton color="inherit">
                  {notify != ''? <FontAwesomeIcon onClick={(e) => {callBell()}} icon={faBell} shake style={{color: "#ffffff",}} /> : <NotificationsIcon onClick={(e) => {callBell()}} />}
                </IconButton>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt='Profile' src={userDatas && userDatas.picture ? userDatas.picture : ''} />
                  </IconButton>
                </Tooltip>
                {/* <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user?.username || 'Profile'} src={userDatas && userDatas.picture?.userDatas.picture || ''} />
                  </IconButton>
                </Tooltip> */}
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={() => handleUserMenuClick(setting)}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <>
                {token && <>
                  <IconButton color="inherit">
                    <SearchIcon onClick={() => handleShow1()} />
                  </IconButton>
                  <IconButton color="inherit" onClick={() => handleShow()}>
                    <NotificationsIcon />
                  </IconButton>
                </>}
              </>
            )}
          </Box>
        </Toolbar>
      </Container>

      <Modal className='mt-5' show={show} fullscreen={true} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Inbox</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Tabs
            defaultActiveKey="Incomming"
            // id="fill-tab-example"
            className="mb-3 font12 bold500"
            fill
          >
            <Tab eventKey="Incomming" title="Incomming">
              <Row className="mt-3 mx-0 justify-content-center">
                <Col lg={8} md={12} sm={12} sx={12}>
                {notify && notify.length > 0 && notify.map((val, ind)=>{
                  return(
                    <Card className="card">
                    <Card.Body className='p-0'>
                      <Row>
                        <Col lg={2} md={3} sm={3} xs={4} className="profileImg text-center pt-2 pb-2">
                          <img src={tiger} alt="" className="img-fluid notifications hand" />
                        </Col>
                        <Col lg={9} md={9} sm={9} xs={8} className="text-start pt-2">
                          <p style={{ marginBottom: "0px", fontSize: "13px", fontWeight: "500" }}>{val && val.sender && val.sender.username
                          }{`, `}{val.type } Your Post</p>
                          <p style={{ fontSize: "12px" }}>{val.postId.questionTitle}</p>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                  )
                })}
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="profile" title="Sent">
              <Row className="mt-4">
                <Col lg={12} md={12} sm={12} xs={12} className="text-start">
                  <p className="font14-600">Not Sent Yet !</p>
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>

      <Modal className='mt-5' show={show1} fullscreen={true} onHide={() => setShow1(false)}>
        <Modal.Header >
          <Row>
            <Col lg={2} md={2} sm={2} xs={2}>
              <FontAwesomeIcon onClick={()=>{setShow1(false)}} icon={faArrowLeft} />
            </Col>
            <Col lg={10} md={10} sm={10} xs={10}>
            <div className='customeCls'>
              <span>
              <input type="text" placeholder='Search ' className='BrdRm'></input>
              </span>
              <span>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
              </span>
            </div>
            </Col>
          </Row>
        </Modal.Header>
        <Modal.Body>
          <Row className="mt-3 mx-0 justify-content-center">
            <Col lg={8} md={12} sm={12} sx={12}>
              <Card className="card">
                <Card.Body className='p-0'>
                  <Row>
                    <Col lg={2} md={3} sm={3} xs={4} className="profileImg text-center pt-2 pb-2">
                      <img src={tiger} alt="" className="img-fluid notifications hand" />
                    </Col>
                    <Col lg={9} md={9} sm={9} xs={8} className="text-start pt-2">
                      <p style={{ marginBottom: "0px", fontSize: "13px", fontWeight: "500" }}>Dilip Kumar</p>
                      <p style={{ fontSize: "12px" }}>@dilipK234</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>


    </AppBar>
  );
}

export default TopBar;







// import React from 'react';
// import { Link } from 'react-router-dom';
// import AppBar from '@mui/material/AppBar';
// import Box from '@mui/material/Box';
// import Toolbar from '@mui/material/Toolbar';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import Menu from '@mui/material/Menu';
// import MenuIcon from '@mui/icons-material/Menu';
// import Container from '@mui/material/Container';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import Tooltip from '@mui/material/Tooltip';
// import MenuItem from '@mui/material/MenuItem';
// import AdbIcon from '@mui/icons-material/Adb';
// import { AuthContext } from '../contexts/AuthContext';

// const pages = ['login', 'singup'];
// const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

// function TopBar() {
//   const token = localStorage.getItem('token');
//   const {  user, logout } = React.useContext(AuthContext);
//   console.log("token",token)
//   const [anchorElNav, setAnchorElNav] = React.useState(null);
//   const [anchorElUser, setAnchorElUser] = React.useState(null);

//   const handleOpenNavMenu = (event) => {
//     setAnchorElNav(event.currentTarget);
//   };

//   const handleOpenUserMenu = (event) => {
//     setAnchorElUser(event.currentTarget);
//   };

//   const handleCloseNavMenu = () => {
//     setAnchorElNav(null);
//   };

//   const handleCloseUserMenu = () => {
//     setAnchorElUser(null);
//   };

//   return (
//     <AppBar position="static">
//       <Container maxWidth="xl">
//         <Toolbar disableGutters>
//           <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />

//           <Typography
//             variant="h6"
//             noWrap
//             component="a"
//             href="#app-bar-with-responsive-menu"
//             sx={{
//               mr: 2,
//               display: { xs: 'none', md: 'flex' },
//               fontFamily: 'monospace',
//               fontWeight: 700,
//               letterSpacing: '.3rem',
//               color: 'inherit',
//               textDecoration: 'none',
//             }}
//           >
//             Youth Adda
//           </Typography>

//           <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
//             <IconButton
//               size="large"
//               aria-label="account of current user"
//               aria-controls="menu-appbar"
//               aria-haspopup="true"
//               onClick={handleOpenNavMenu}
//               color="inherit"
//             >
//               <MenuIcon />
//             </IconButton>
//             <Menu
//               id="menu-appbar"
//               anchorEl={anchorElNav}
//               anchorOrigin={{
//                 vertical: 'bottom',
//                 horizontal: 'left',
//               }}
//               keepMounted
//               transformOrigin={{
//                 vertical: 'top',
//                 horizontal: 'left',
//               }}
//               open={Boolean(anchorElNav)}
//               onClose={handleCloseNavMenu}
//               sx={{
//                 display: { xs: 'block', md: 'none' },
//               }}
//             >
//               {pages.map((page) => (
//                 <MenuItem key={page} onClick={handleCloseNavMenu}>
//                   <Typography textAlign="center">{page}</Typography>
//                 </MenuItem>
//               ))}
//             </Menu>
//           </Box>

//           <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />

//           <Typography
//             variant="h5"
//             noWrap
//             component="a"
//             href="#app-bar-with-responsive-menu"
//             sx={{
//               mr: 2,
//               display: { xs: 'flex', md: 'none' },
//               flexGrow: 1,
//               fontFamily: 'monospace',
//               fontWeight: 700,
//               letterSpacing: '.3rem',
//               color: 'inherit',
//               textDecoration: 'none',
//             }}
//           >
//             Youth Adda
//           </Typography>

//           <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
//             {pages.map((page) => (
//               <Button
//                 key={page}
//                 onClick={handleCloseNavMenu}
//                 sx={{ my: 2, color: 'white', display: 'block' }}
//               >
//                 {page}
//               </Button>
//             ))}
//           </Box>

//           <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
//             {token ? (
//               <>
//                 <Typography sx={{ mr: 2, display: { xs: 'none', md: 'block' } }}>
//                   {user?.username || 'Profile'}
//                 </Typography>
//                 <Tooltip title={user?.username || 'Profile'}>
//                   <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
//                     <Avatar alt={user?.username || 'Profile'} src={user?.avatar || ''} />
//                   </IconButton>
//                 </Tooltip>
//               </>
//             ) : null} {/* Render nothing if not logged in */}
//             {token && (
//               <Menu
//                 sx={{ mt: '45px' }}
//                 id="menu-appbar"
//                 anchorEl={anchorElUser}
//                 anchorOrigin={{
//                   vertical: 'top',
//                   horizontal: 'right',
//                 }}
//                 keepMounted
//                 transformOrigin={{
//                   vertical: 'top',
//                   horizontal: 'right',
//                 }}
//                 open={Boolean(anchorElUser)}
//                 onClose={handleCloseUserMenu}
//               >
//                 {settings.map((setting) => (
//                   <MenuItem
//                     key={setting}
//                     onClick={() => {
//                       handleCloseUserMenu();
//                       if (setting === 'Logout') {
//                         logout();
//                       }
//                     }}
//                   >
//                     <Link to={`/${setting.toLowerCase()}`} style={{ textDecoration: 'none', color: 'inherit' }}>
//                       <Typography textAlign="center">{setting}</Typography>
//                     </Link>
//                   </MenuItem>
//                 ))}
//               </Menu>
//             )}
//             {!token && ( // Render login/signup buttons only if not logged in
//               <div>
//                 <Button color="inherit" component={Link} to="/login">
//                   Login
//                 </Button>
//                 <Button color="inherit" component={Link} to="/signup">
//                   Signup
//                 </Button>
//               </div>
//             )}
//           </Box>

//         </Toolbar>
//       </Container>
//     </AppBar>
//   );
// }

// export default TopBar;
