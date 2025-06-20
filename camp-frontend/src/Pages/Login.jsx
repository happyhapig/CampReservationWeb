import React from 'react';
import { Box, Button, Typography, Container, Stack } from '@mui/material';
import Navbar from "../components/Navbar";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { getGuestId } from '../utils/generateGuestId';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const LoginPage = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const pageFrom = location.state?.from || '/';
  const { login } = useUser();

  const handleGuestLogin = async () => {
    try {

      let guestId = getGuestId();

      if (!guestId) {
        guestId = uuidv4();
        localStorage.setItem('guestId', guestId);
      }

      const res = await axios.post('/api/guest-login', { guestId });

      if (res.data.userId) {

        login({
          userId: res.data.userId,
          type: res.data.type
        });

        navigate(pageFrom);
      }
    } catch (err) {
      console.error('訪客登入失敗', err);
      alert('登入失敗，請稍後再試');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const payload = {
        googleId: user.uid,
        email: user.email,
        name: user.displayName,
      };

      const res = await axios.post("/api/google-login", payload);

      login({
        userId: res.data.userId,
        type: res.data.type
      });

      navigate(pageFrom);
      
      console.log("登入成功:", res.data);
      
    } catch (error) {
      console.error("Google 登入失敗:", error);
    }
  };

  return (
    <Box>
        <Navbar />
        <Container maxWidth="xs" sx={{ mt: 5, textAlign: 'center'}}>
            <Box
                sx={{
                    backgroundColor: 'white',
                    borderRadius: 3,
                    p: 5,
                    boxShadow: 3,
                    textAlign: 'center',
                }}
            >
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    歡迎登入
                </Typography>

                <Stack spacing={3} mt={4} mx="auto" alignItems="center">
                    <Button variant="contained" color="primary" sx={{width: { xs: '100%', sm: 200 }, color: 'white', fontWeight: "bold"}} onClick={handleGoogleLogin}>
                        使用 Google 登入
                    </Button>

                    <Button variant="outlined" color="primary" sx={{width: { xs: '100%', sm: 200 }, fontWeight: "bold"}} onClick={handleGuestLogin}>
                        以訪客身份繼續
                    </Button>
                </Stack>
            </Box>            
        </Container>
    </Box>
  );
};

export default LoginPage;
