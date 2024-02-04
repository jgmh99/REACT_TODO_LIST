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
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import Grid from '@mui/material/Grid';


const firebaseConfig = {
  
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
        <DeleteIcon />
      </IconButton>
    }>
      <ListItemButton role={undefined} onClick={() => props.onTodoItemClick(props.todoItem)} dense>
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
          secondary={`Created on: ${formattedDate}`}
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
    <Box>
      <List sx={{ margin: "0", maxWidth: 1100, padding: "0" }}>
        {todoList}
      </List>
    </Box>
  );
};

const TodoListAppBar = (props) => {
  const loginWithGoogleButton = (
    <Button color="inherit" onClick={() => { signInWithRedirect(auth, provider); }}>Login</Button>
  );

  const logoutButton = (
    <Button color="inherit" onClick={() => { signOut(auth); }}>Logout</Button>
  );

  const button = props.currentUser === null ? loginWithGoogleButton : logoutButton;

  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (props.currentUser !== null) {
      const user = auth.currentUser;
      const displayName = user.displayName || "User";
      setUserName(displayName);
    }
  }, [props.currentUser]);

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ display: 'flex', width: '100%', maxWidth: 1100, margin: 'auto', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          Todo List
        </Typography>
        <div sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle1" color="inherit" sx={{ marginRight: 1 }}>
            {props.currentUser !== null ? `${userName}님 환영합니다.` : ''}
            {button}
          </Typography>
        </div>
      </Toolbar>
    </AppBar>
  );
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [todoItemList, setTodoItemList] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

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
    const finishedCount = todoItemList.filter((item) => item.isFinished).length;
    const unfinishedCount = todoItemList.length - finishedCount;
  
    const data = {
      labels: ['완료','미완료'],
      datasets: [
        {
          data: [finishedCount, unfinishedCount],
          backgroundColor: ['#36A2EB', '#FF6384'],
          hoverBackgroundColor: ['#36A2EB', '#FF6384'],
        },
      ],
    };
    return data;
  };
  
  //로딩 + 메세지 띄우는거임
  const LoadingSpinner = ({ message }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <TailSpin color="#00BFFF" height={100} width={100} />
      <p>{message}</p>
    </div>
  );

  return (
    <div className="App">
      {loading ? (
        <LoadingSpinner message="잠시만 기다려주세요." />
      ) : (
        <>
          <TodoListAppBar currentUser={currentUser} setCurrentUser={setCurrentUser} />
          <Container sx={{ paddingTop: 3 }}>
            <Grid container spacing={2}>
              {currentUser && todoItemList.length > 0 && (
                <>
                  {/* todo list 추가 bar */}
                  <Grid item xs={12}>
                    <TodoItemInputField onSubmit={onSubmit} />
                  </Grid>

                  {/* TodoItemList */}
                  <Grid item xs={9}>
                    <Typography variant="h6" component="div">Todo-List</Typography>
                    <div className="abcd" style={{ height: '100vh', overflowY: 'auto' }}>
                      <TodoItemList
                        todoItemList={todoItemList}
                        onTodoItemClick={onTodoItemClick}
                        onRemoveClick={onRemoveClick} />
                    </div>
                  </Grid>

                  {/* 그래프 */}
                  <Grid item xs={3}>
                    <Typography variant="h6" component="div">
                      진행도
                    </Typography>
                    <Box sx={{ width: '100%', height: '100%' }} id="graph" className="graphBox">
                      <Doughnut id='dough' data={getChartData()} style={{ width: '100%', height: "100%" }} />
                    </Box>
                  </Grid>
                </>
              )}
            </Grid>
          </Container>
        </>
      )}
    </div>
  );
}

export default App;
