import React, { useState, useEffect } from 'react';
import { Box, List, Container, Stack, Typography, Grid, TextField, Button } from '@mui/material';
import Lottie from 'react-lottie';
import todolist_lottie from '../lottiefiles/todolist.json';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { signInWithRedirect, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, GoogleAuthProvider } from 'firebase/auth';
// CSS import
import '../css/MainPage.css';
import { Link } from 'react-router-dom';
//비밀번호 보이게
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);  // auth 객체 가져오기
const provider = new GoogleAuthProvider();

const JoinPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    //비밀번호 보이게 
    const [showPassword, setShowPassword] = useState(false);
  
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
      alert('회원가입 되었습니다.')
    } catch (error) {
      console.error('회원 가입 에러', error.message);
      //콘솔창에서 경고문으로 바꿔야함!
    //   alert('회원 가입 에러');
    }
  };

//   const handleSignIn = async () => {
//     try {
//       // Firebase에 이메일과 비밀번호로 로그인 요청
//       await signInWithEmailAndPassword(auth, email, password);

//       // 로그인 후 사용자 정보 가져오기
//       const user = auth.currentUser;
//       const displayName = user.displayName || "사용자";
//       setUserName(displayName);

//       console.log('로그인 성공');
//     } catch (error) {
//       console.error('로그인 에러', error.message);
//     }
//   };

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: todolist_lottie,
  };
  //페이스북, 애플 로그인 기능 없기 때문에?
  const btnclick = () =>{
    alert('서비스 준비중입니다! 조금만 기달려주세요!')
  }
  //비밀번호 보이게
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <Container id="join_con"  sx={{ marginTop: '70px', maxWidth: 1100, height: '70vh', padding: '0' }}>
        <Grid container spacing={2} sx={{ height: '100%' }}>
          <Grid item xs={5} id="vvvv">
            {/* <Typography variant="h4" component="div" id="mainpage_loginbox">
              가입
            </Typography> */}
            <h2>가입</h2>
            {/* 이메일 형식으로 가입 */}
            <form id="login_form">
              <TextField
                label="E-mail"
                variant="outlined"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                    ),
                  }}
                />
              <TextField
                label="Nickname"
                placeholder='사용할 닉네임을 입력해주세요.'
                variant="outlined"
                fullWidth
                margin="normal"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <Button variant="contained" color="primary" onClick={handleSignUp} id="join_btn">
                    이메일로 가입
              </Button>
              {/* <Button variant="outlined" color="primary" onClick={handleSignIn}>
                로그인
              </Button> */}
            </form>
            {/* 간편 가입 */}
            <Stack spacing={1}>
                <Button id='join_btn' variant='outlined' onClick={() => { signInWithRedirect(auth, provider); }}>
                    {/* <img src="https://www.cdnlogo.com/logos/g/35/google-icon.svg"/> */}
                    <p>Google ID로 시작하기</p>
                </Button>
                <Button id='join_btn' variant='outlined' onClick={btnclick}>
                    {/* <img src="https://www.cdnlogo.com/logos/a/12/apple.svg"/> */}
                    <p>Apple ID로 시작하기 </p>
                </Button>
                <Button id='join_btn' variant='outlined' onClick={btnclick}>
                    {/* <img src="https://www.cdnlogo.com/logos/f/91/facebook-icon.svg"/> */}
                    <p>FaceBook ID로 시작하기</p>
                </Button>
            </Stack>
            <Typography id="if_you_have_id">
                이미 가입하셨나요? <Link to="/login">로그인</Link>하세요!
            </Typography>
          </Grid>
          <Grid item xs={7} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 0 , border: '1px' }}>
            <Lottie options={lottieOptions} height={400} width={400} />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default JoinPage;