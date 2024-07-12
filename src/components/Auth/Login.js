import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../../AuthContext';
import { AuthContext } from '../../contexts/AuthContext';
import { CssBaseline, Typography, FormControl, FormLabel, Input, Button, Link, Sheet } from '@mui/joy';
import authService from '../../services/authService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import SocialLogin from './SocialLogin';
import { ToastContainer, toast } from 'react-toastify';



function Login() {
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleNavigation = () => {
    // navigate('/');
    window.location.href = 'http://localhost:3000/';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'email') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: value ? '' : 'Email is required',
      }));
    } else if (name === 'password') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: value ? '' : 'Password is required',
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const emailError = formData.email ? '' : 'Email is required';
    const passwordError = formData.password ? '' : 'Password is required';
    setErrors({
      email: emailError,
      password: passwordError,
    });

    if (emailError || passwordError) {
      return;
    }

    try {
      setLoading(true);
      const token = await authService.login(formData);
      console.log("token",token.token)
      localStorage.setItem('user',JSON.stringify(token.user))
      login(token.token); // Use the login method from AuthContext to set the token and user
      setLoading(false);
      toast.success("login successfully !")
    window.location.href = 'http://localhost:3000/';
      // navigate('/');
    } catch (error) {
      console.log(error)
      setLoading(false);
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: error.response?.data?.message || 'Login failed',
      }));
    }
  };

  return (
    <main>
      <CssBaseline />
      <Sheet
        sx={{
          width: 300,
          mx: 'auto',
          my: 4,
          py: 3,
          px: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          borderRadius: 'sm',
          boxShadow: 'md',
        }}
        variant="outlined"
      >
        <div>
            <div className='login2Home'>
            <FontAwesomeIcon icon={faArrowLeft} onClick={handleNavigation} title='home' />
            <hr className='m-0' />
            </div>
          <Typography level="h4" component="h1" className='mt-3'>
            <b>YouthAdda!</b>
          </Typography>

          <Typography level="body-sm">Sign in to continue.</Typography>
        </div>
        <div>
        <SocialLogin />
        </div>
        <div>
        <Typography level="body-sm" className="text-center">---- Another Way To Continue ----</Typography>

        </div>
        <FormControl error={!!errors.email}>
          <FormLabel>Email</FormLabel>
          <Input
            name="email"
            type="email"
            placeholder="your@email.com"
            onChange={handleChange}
          />
          {errors.email && <Typography color="error">{errors.email}</Typography>}
        </FormControl>
        <FormControl error={!!errors.password}>
          <FormLabel>Password</FormLabel>
          <Input
            name="password"
            type="password"
            placeholder="password"
            onChange={handleChange}
          />
          {errors.password && <Typography color="error">{errors.password}</Typography>}
        </FormControl>
        <Button sx={{ mt: 1 }} onClick={handleSubmit} loading={loading}>Log in</Button>
        <Typography
          endDecorator={<Link href="/signup">Sign up</Link>}
          fontSize="sm"
          sx={{ alignSelf: 'center' }}
        >
          Don&apos;t have an account?
        </Typography>
      </Sheet>
    </main>
  );
}

export default Login;
