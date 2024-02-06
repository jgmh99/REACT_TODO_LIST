import React, { useState, useEffect } from 'react';
import { Box, List, Container, Stack, Typography, Grid, TextField, Button } from '@mui/material';
import Lottie from 'react-lottie';
import todolist_lottie from '../lottiefiles/todolist.json';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDGzWy1GO-oYHD5E97PawlRZI_iODhoT1I",
    authDomain: "todo-list-1dc5f.firebaseapp.com",
    projectId: "todo-list-1dc5f",
    storageBucket: "todo-list-1dc5f.appspot.com",
    messagingSenderId: "117786700415",
    appId: "1:117786700415:web:1f01cdb9a610acb7616d4a",
    measurementId: "G-ZEPNV4T50S"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);  // auth 객체 가져오기

const MainPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');
  
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSignUp = async () => {
    try {
      if (!validateEmail(email) || email.trim() === '' || password.trim() === '' || userName.trim() === '') {
        console.error('유효하지 않은 이메일 형식 또는 빈 문자열');
        return;
      }

      // Firebase에 이메일과 비밀번호로 회원 가입 요청
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // 사용자 이름 설정
      await updateProfile(userCredential.user, {
        displayName: userName,
      });

      console.log('회원 가입 성공');
    } catch (error) {
      console.error('회원 가입 에러', error.message);
    }
  };

  const handleSignIn = async () => {
    try {
      // Firebase에 이메일과 비밀번호로 로그인 요청
      await signInWithEmailAndPassword(auth, email, password);

      // 로그인 후 사용자 정보 가져오기
      const user = auth.currentUser;
      const displayName = user.displayName || "사용자";
      setUserName(displayName);

      console.log('로그인 성공');
    } catch (error) {
      console.error('로그인 에러', error.message);
    }
  };

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: todolist_lottie,
  };

  return (
    <div>
      <Container id="join_con" sx={{ marginTop: '70px', maxWidth: 1100, height: '70vh', padding: '0' }}>
        <Grid container spacing={2} sx={{ height: '100%' }}>
          <Grid item xs={5}>
            <Typography variant="h6" component="div" id="mainpage_loginbox">
              가입 & 로그인
            </Typography>
            {/* 이메일 형식으로 가입 */}
            <form>
              <TextField
                label="이메일"
                variant="outlined"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="비밀번호"
                variant="outlined"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                label="이름"
                variant="outlined"
                fullWidth
                margin="normal"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <Button variant="contained" color="primary" onClick={handleSignUp}>
                회원 가입
              </Button>
              <Button variant="outlined" color="primary" onClick={handleSignIn}>
                로그인
              </Button>
            </form>
            {/* 간편 가입 */}
            <Stack spacing={1}>
              {/* 간편 가입 버튼들 */}
            </Stack>
          </Grid>
          <Grid item xs={7} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
            <Lottie options={lottieOptions} height={400} width={400} />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default MainPage;
