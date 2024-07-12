import React, { useState, useEffect,useContext } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import googleImg from "../../assest/img/google.png";
import {Row, Col} from "react-bootstrap";


function SocialLogin() {
    const [ user, setUser ] = useState([]);
    const { login } = useContext(AuthContext);
    const [ profile, setProfile ] = useState([]);
    const client_id = '579645393871-bmblj414f03jm3hrmufmdgfg0771urvr.apps.googleusercontent.com'
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const loginGoogle = useGoogleLogin({
      client_id: client_id,
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(
        () => {
            if (user) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then(async (res) => {

                      try {
                        const token= await authService.googleUserLogin(res.data);
                        localStorage.setItem('socialData',JSON.stringify(res.data))
                        setSuccessMessage('Login successful!');
                        setLoading(false);
                        login(token.token); // Use the login method from AuthContext to set the token and user
                        navigate('/');
                        // Redirect or show success message
                      } catch (error) {
                        if (error.response && error.response.status === 400) { // Assuming 409 is the status code for already registered
                          setErrorMessage('Error Please try again .');
                        } else {
                          setErrorMessage('Signup failed. Please try again.');
                        }
                        setLoading(false);
                      }
                      setProfile(res.data)
                    })
                    .catch((err) => console.log(err));
            }
            // console.log("user details",user)
        },
        [ user ]
    );

    // log out function to log the user out of google and set the profile array to null
    const logOut = () => {
        googleLogout();
        setProfile(null);
        localStorage.clear()
    };

    return (
        <>
        <Row className='text-center justify-content-center'>
            <Col lg={12} md={12} sm={12} xs={12} className='customheit'>
            <img  onClick={loginGoogle} src={googleImg} alt="" className="img-fluid hand" />
            </Col>
        </Row>
        </>
        // <div>
        //     <p>Google Login</p>
        //     <br />
        //     <br />
        //     {profile ? (
        //         <div>
        //             <img src={profile.picture} alt="user image" />
        //             <h3>User Logged in</h3>
        //             <p>Name: {profile.name}</p>
        //             <p>Email Address: {profile.email}</p>
        //             <br />
        //             <br />
        //             <button onClick={logOut}>Log out</button>
        //         </div>
        //     ) : (
        //         <button onClick={loginGoogle}>Sign in with Google 🚀 </button>
        //     )}
        // </div>
    );
}
export default SocialLogin;