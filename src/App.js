import './App.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, setDoc, doc, deleteDoc, getDocs, query, orderBy, where } from "firebase/firestore";
import { GoogleAuthProvider, getAuth, signInWithRedirect, onAuthStateChanged, signOut } from "firebase/auth";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import { TailSpin } from 'react-loader-spinner';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import Grid from '@mui/material/Grid';
import JoinPage from './pages/JoinPage';
import LoginPage from './pages/LoginPage';
import tist_logo from './img/tist_logo.png'
import NotLogin from './pages/NotLogin';
//라우트
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Footer from './pages/Footer';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [todoItemList, setTodoItemList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Firebase 초기화
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
  const analytics = getAnalytics(app);
  const db = getFirestore(app);
  const provider = new GoogleAuthProvider();
  const auth = getAuth(app);

  const TodoItemInputField = (props) => {
    const [input, setInput] = useState('');
  
    const onSubmit = () => {
      props.onSubmit(input);
      setInput('');
    };
  
    const todoTxt = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (e.nativeEvent.isComposing) {
          return;
        }
        console.log(e.target.value);
        onSubmit();
      }
    };
  
    return (
      <Box sx={{ marginTop: '64px' }}>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Grid item xs={10}>
            <TextField
              fullWidth
              id="todo-item-input"
              label="오늘의 할일"
              placeholder='오늘의 할일을 적어주세요!'
              variant="outlined"
              onChange={(e) => setInput(e.target.value)}
              value={input}
              onKeyDown={todoTxt}
              sx={{ height: '100%' }} // TextField의 높이를 100%로 설정
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              variant="outlined"
              onClick={onSubmit}
              sx={{ width:"100%", height: '100%' }} // Button의 높이를 100%로 설정
            >
              추가하기
            </Button>
          </Grid>
        </Stack>
      </Box>  
    );
  };
  
  const TodoItem = (props) => {
    const style = props.todoItem.isFinished ? { textDecoration: 'line-through' } : {};
    const formattedDate = new Date(props.todoItem.createdTime * 1000).toLocaleDateString();
  
    return (
      <ListItem id="ListItem" secondaryAction={
        <IconButton edge="end" aria-label="comments" onClick={() => props.onRemoveClick(props.todoItem)}>
          <DeleteIcon id='del_btn'/>
        </IconButton> }>
        
        <ListItemButton role={undefined} id='ListItemBtn' onClick={() => props.onTodoItemClick(props.todoItem)} dense >
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={props.todoItem.isFinished}
              disableRipple
            />
          </ListItemIcon>

          <ListItemText
            style={style}
            primary={`${props.index}. ${props.todoItem.todoItemContent}`}
            secondary={`작성일: ${formattedDate}`}
          />
        </ListItemButton>
      </ListItem>
    );
  };
  
  const TodoItemList = (props) => {
    const todoList = props.todoItemList.map((todoItem, index) => {
      return (
        <TodoItem
          key={todoItem.id}
          todoItem={todoItem}
          index={index + 1}
          onTodoItemClick={props.onTodoItemClick}
          onRemoveClick={props.onRemoveClick}
          
        />
      );
    });
  
    return (
      <Box style={{border:"1px solid black", borderRadius:'4px'}}>
        <List sx={{ margin: "0", maxWidth: 1100, padding: "0", }}>
          {todoList}
        </List>
      </Box>
    );
  };
  //헤더
  const TodoListAppBar = (props) => {
    const loginWithGoogleButton = (
      //기능은 있지만 사용하지 않음 그래서 display:none처리
      <Button variant="outlined" style={{ display: 'none'  }} onClick={() => { signInWithRedirect(auth, provider); }}>로그인</Button>
    );
  
    const logoutButton = (
      <Button variant="outlined" style={{ color: 'black' }} onClick={() => { signOut(auth); }}>Logout</Button>
    );
  
    const button = props.currentUser === null ? loginWithGoogleButton : logoutButton;
  
    const [userName, setUserName] = useState("");
  
    useEffect(() => {
      if (props.currentUser !== null) {
        // 사용자가 로그인한 경우
        const user = auth.currentUser;
  
        // 사용자 이름을 가져와서 설정
        const displayName = user.displayName || "사용자";
        setUserName(displayName);
      } else {
        // 사용자가 로그아웃한 경우
        setUserName(""); // 또는 다른 초기값 설정
      }
    }, [props.currentUser]);
  
    return (
      <AppBar style={{ backgroundColor: 'white',  }} position="fixed">
        <Toolbar
          id="headerToolbar"
          sx={{
            // display: 'flex',
            width: '100%',
            height: '64px',
            maxWidth: '1170px',
            minWidth: '300px',
            margin: 'auto',
            justifyContent: 'space-between',
          }}
        >
          <Link to="/" style={{ textDecoration: 'none', color: 'black', height: '100%' }}>
            <img src={tist_logo} alt="Todo List logo" style={{ height: '100%', padding:'0px', margin:'0px' }} />
          </Link>
          <div sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1" color="black" sx={{ marginRight: 1 }}>
              {props.currentUser !== null ? `${userName}님 환영합니다.` : `${userName}`}
              {button}
              {props.currentUser === null && (
                // 로그인하지 않은 경우에만 가입 및 로그인 링크 표시
                <>
                  {/* <Button variant="outlined" style={{ color: 'black' }}>
                    <Link to="/join" style={{ textDecoration: 'none', color: 'black'}}>
                      가입
                    </Link>  
                  </Button> 
                  <Button variant="outlined" style={{ color: 'black' }}>
                    <Link to="/login" style={{ textDecoration: 'none', color: 'black'}}>
                      로그인
                    </Link>
                  </Button> */}
                  {/* 아래 코드로 수정 */}
                  <Button
                    variant="text"
                    style={{ color: 'black' }}
                    component={Link}
                    to="/login"
                    id="login_btn"
                  >
                    로그인
                  </Button>

                  <Button
                    variant="contained"
                    style={{ color: 'white', marginLeft:'10px' }}
                    component={Link}
                    to="/join"
                  >
                    회원가입
                  </Button>
                </ >
              )}
            </Typography>
          </div>
        </Toolbar>
      </AppBar>
    );
    
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user.uid);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const syncTodoItemListStateWithFirestore = async () => {
    if (currentUser) {
      const q = query(collection(db, "todoItem"), where("userId", "==", currentUser), orderBy("createdTime", "asc"));
      const querySnapshot = await getDocs(q);
      const firestoreTodoItemList = [];
      querySnapshot.forEach((doc) => {
        firestoreTodoItemList.push({
          id: doc.id,
          todoItemContent: doc.data().todoItemContent,
          isFinished: doc.data().isFinished,
          createdTime: doc.data().createdTime ?? 0,
          userId: doc.data().userId,
        });
      });
      setTodoItemList(firestoreTodoItemList);
    }
  };

  useEffect(() => {
    if (!loading) {
      syncTodoItemListStateWithFirestore();
    }
  }, [loading, currentUser]);

  const onSubmit = async (newTodoItem) => {
    await addDoc(collection(db, "todoItem"), {
      todoItemContent: newTodoItem,
      isFinished: false,
      createdTime: Math.floor(Date.now() / 1000),
      userId: currentUser,
    });
    syncTodoItemListStateWithFirestore();
  };

  const onTodoItemClick = async (clickedTodoItem) => {
    const todoItemRef = doc(db, "todoItem", clickedTodoItem.id);
    await setDoc(todoItemRef, { isFinished: !clickedTodoItem.isFinished }, { merge: true });
    syncTodoItemListStateWithFirestore();
  };

  const onRemoveClick = async (removedTodoItem) => {
    const todoItemRef = doc(db, "todoItem", removedTodoItem.id);
    await deleteDoc(todoItemRef);
    syncTodoItemListStateWithFirestore();
  };

  const getChartData = () => {
    if (!todoItemList) {
      return {};
    }

    const finishedCount = todoItemList.filter((item) => item.isFinished).length;
    const unfinishedCount = todoItemList.length - finishedCount;

    const data = {
      labels: ['완료', '미완료'],
      datasets: [
        {
          data: [finishedCount, unfinishedCount],
          backgroundColor: ['#36A2EB', '#FF6384'],
          hoverBackgroundColor: ['#36A2EB', '#FF6384'],
        },
      ],
    };

    return { data };
  };

  const LoadingSpinner = ({ message }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <TailSpin color="#00BFFF" height={100} width={100} />
      <p>{message}</p>
    </div>
  );

  // 버튼 클릭 관련 함수
  const [activeButton, setActiveButton] = useState('show_all_todo');
  // 버튼 누르면 바뀌게
  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
  };
  // activeButton에 따라 필터링된 todoItemList을 반환하는 함수
  const getFilteredTodoList = () => {
    switch (activeButton) {
      case 'show_all_todo':
        return todoItemList;
      case 'show_com_todo':
        return todoItemList.filter(item => item.isFinished);
      case 'show_Notcom_todo':
        return todoItemList.filter(item => !item.isFinished);
      default:
        return todoItemList;
    }
  };
  
  /* 그래프에 버튼 달아서 보이게 안보이게 */
  const [isGraphVisible, setIsGraphVisible] = useState(true);
  // const toggleGraph = () => {
  //   setIsGraphVisible(!isGraphVisible);
  // };
  const toggleGraph = () => {
    setIsGraphVisible(!isGraphVisible);
    setTimeout(() => {
      const graphBox = document.getElementById('graphBox');
      if (graphBox) {
        if (!isGraphVisible) {
          graphBox.classList.add('collapsed');
        } else {
          graphBox.classList.remove('collapsed');
        }
      }
    }, 2000); // 2초 뒤에 collapsed 클래스를 추가 또는 제거
  };


  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="App">
        {loading ? (
          <LoadingSpinner message="잠시만 기다려주세요." />
          ) : (
            <>
              <TodoListAppBar currentUser={currentUser} auth={auth} provider={provider} />
              {currentUser ? (
                <Container sx={{ paddingTop: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TodoItemInputField onSubmit={onSubmit} />
                    </Grid>
      
                    <Grid item xs={9}>
                      <Typography variant="h6" component="div">Todo-List</Typography>

                      <Grid item xs={3}>
                        <div style={{ display:'flex', justifyContent: 'space-between', marginBottom:'10px'}}>
                        <Button
                          id="show_all_todo"
                          variant={activeButton === 'show_all_todo' ? 'contained' : 'outlined'}
                          onClick={() => handleButtonClick('show_all_todo')}
                        >
                          전체
                        </Button>
                        <Button
                          id="show_com_todo"
                          variant={activeButton === 'show_com_todo' ? 'contained' : 'outlined'}
                          onClick={() => handleButtonClick('show_com_todo')}
                        >
                          완료
                        </Button>
                        <Button
                          id="show_Notcom_todo"
                          variant={activeButton === 'show_Notcom_todo' ? 'contained' : 'outlined'}
                          onClick={() => handleButtonClick('show_Notcom_todo')}
                        >
                          미완료
                        </Button>
                        </div>
                      </Grid>
                      <div className="abcd" style={{ maxHeight: '100vh', overflowY: 'auto', }}>
                        <TodoItemList
                          // todoItemList={todoItemList} 하단 코드로 변경 : 누른 버튼에 따라서 필터링
                          todoItemList={getFilteredTodoList()}
                          onTodoItemClick={onTodoItemClick}
                          onRemoveClick={onRemoveClick} />
                      </div>
                    </Grid>
      
                    <Grid item xs={3}>
                      <Typography variant="h6" component="div">
                        - 진행도 -
                      </Typography>
                      
                      <Button id="gra_btn" variant="outlined" onClick={toggleGraph}>
                        {isGraphVisible ? '접기' : '펼치기'}
                      </Button>
                     {/* 그래프 박스에 대한 조건부 렌더링 */}
                      <div id="graphBox" className="graphBox">
                        {isGraphVisible && (
                          <Pie
                            data={getChartData().data}
                            options={{
                              plugins: {
                                legend: {
                                  position: 'right',
                                },
                              },
                            }}
                            sx={{ width: '100%', height: '100%' }}
                            id="graph"
                            className="graphBox"
                          />
                        )}
                      </div>
                    </Grid>
                  </Grid>
                </Container>
              ) : (
                <>
                  <Routes>
                    <Route path="/" element={<NotLogin />} />
                    <Route path="/join" element={<JoinPage />} />
                    <Route path="/login" element={<LoginPage />} />
                  </Routes>
                </>
              )}
              <Footer/>
            </>
          )}
        </div>
        </Router>
      );
    }
    
    export default App;