import logo from './logo.svg';
import './App.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { useEffect, useState } from 'react';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, setDoc, doc, deleteDoc, getDocs, query, orderBy, querySnapshot, where} from "firebase/firestore";
import { GoogleAuthProvider, getAuth, signInWithRedirect, onAuthStateChanged, signOut } from "firebase/auth";
// MUI import
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

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGzWy1GO-oYHD5E97PawlRZI_iODhoT1I",
  authDomain: "todo-list-1dc5f.firebaseapp.com",
  projectId: "todo-list-1dc5f",
  storageBucket: "todo-list-1dc5f.appspot.com",
  messagingSenderId: "117786700415",
  appId: "1:117786700415:web:1f01cdb9a610acb7616d4a",
  measurementId: "G-ZEPNV4T50S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const auth = getAuth(app);


const TodoItemInputField = (props) => {
  const [input, setInput] = useState('');
  console.log(input);

  const onSubmit = () => {
    props.onSubmit(input);
    //위 코드는 TodoItemInputField를 사용하는 애 한테서 props받아와서 받아온 함수를 콜 해주는거
    setInput("");
    //setInput을 빈칸으로 세팅해라
  }

  return (
    <Box sx={{margin: "auto"}}>
      <Stack direction="row" spacing={2} justifyContent="center">
        <TextField
          id="todo-item-input"
          label="Todo Item"
          variant="outlined"
          onChange={(e) => setInput(e.target.value)} value={input}
        />
        <Button variant="outlined" onClick={onSubmit}>Submit</Button>
      </Stack>
    </Box>
  );
    
};
const TodoItem = (props) =>{
  const style = props.todoItem.isFinished ? {textDecoration: 'line-through'} : {};
  // return(
  //   <li>
  //     <span 
  //       style={style}
  //       onClick={()=>props.onTodoItemClick(props.todoItem)}  
  //     >
  //       {props.todoItem.todoItemContent}
  //     </span>
  //     <Button variant='outlined' onClick={()=>props.onRemoveClick(props.todoItem)}>삭제</Button>
  //   </li>
  // );
  return (
      <ListItem secondaryAction={
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
          <ListItemText style={style} primary={props.todoItem.todoItemContent} />
        </ListItemButton>
      </ListItem>
    );
    
}
const TodoItemList = (props) => {
  const todoList = props.todoItemList.map((todoItem, index) => { //todoitem들을 array로 받아서 map을 사용해서 listItem으로 바꿔주면 됨
    return <TodoItem 
              key={todoItem.id} 
              todoItem={todoItem} 
              onTodoItemClick={props.onTodoItemClick}
              onRemoveClick={props.onRemoveClick}
           />;
  });
    
  return (
      <Box>
        <List sx={{margin: "auto", maxWidth: 720}}>
          {todoList}
        </List>
      </Box>
  );
    

} 
let todoItemId = 0;

const TodoListAppBar = (props) => {
  //로그인 버튼 만든거
  const loginWithGoogleButton = (
    <Button color="inherit" onClick={()=>{
      signInWithRedirect(auth, provider);
    }}>Login</Button>
  );
  //로그아웃 버튼 만든거
  const logoutButton = (
    <Button color="inherit" onClick={()=>{
      signOut(auth);
    }}>lotout</Button>
  );
  //signInWithRedirect, signOut => firebase협찬 ㅋㅋ
  //로그인 되어있으면 로그아웃버튼 보여주고, 로그인 안되어 있으면 로그인 버튼 보여주는거임
  const button = props.currentUser === null ? loginWithGoogleButton : logoutButton;

  return (
    <AppBar position="static">
      <Toolbar sx={{width: "100%", maxWidth: 720, margin: "auto"}}>
        <Typography variant="h6" component="div">
           Todo List App
         </Typography>
        <Box sx={{flexGrow: 1}} />
         {button}
       </Toolbar>
     </AppBar>

  );
};
  

function App() {
  //하단 state가 로그인 되어있는 유저가 없으면 null일꺼고, 로그인 되어있으면 userID일꺼임
  const [currentUser, setCurrentUser] = useState(null);
  const [todoItemList, setTodoItemList] = useState([]);
  
  //firebase에서 제공하는 함수
  onAuthStateChanged(auth, (user) => {
  if (user) {
      setCurrentUser(user.uid);
    } else {
      setCurrentUser(null);
    }
  });
    
  
  //useEffect(() => {
  const syncTodoItemListStateWithFirestore = () => {
    // getDocs(collection(db, "todoItem")).then((querySnapshot) => {

    // const q = query(collection(db, "todoItem"), orderBy("createdTime", "asc"));
    const q = query(collection(db, "todoItem"), where("userId", "==", currentUser) ,orderBy("createdTime", "asc"));
    getDocs(q).then((querySnapshot) => {

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
    });
  };

  useEffect(() => {
    syncTodoItemListStateWithFirestore();
  }, [currentUser]);
    
    

  const onSubmit = async (newTodoItem) => { //1.새로운 아이템이 들어오면 
    await addDoc(collection(db, "todoItem"),{  //addDoc = firebase에 써라~~ 라는 뜻
      todoItemContent: newTodoItem,
      isFinished: false,
      createdTime: Math.floor(Date.now() / 1000),
      userId:currentUser,
    });
    syncTodoItemListStateWithFirestore();
    // setTodoItemList([...todoItemList,{  //2.지금 있던 리스트에 새로운 아이템을 추가해라
    //   //id: todoItemId++,
    //   id : docRef.id,
    //   todoItemContent: newTodoItem,
    //   isFinished: false,
    // }]);
  }
  const onTodoItemClick = async (clickedTodoItem) => {
    const todoItemRef = doc(db, "todoItem", clickedTodoItem.id);
    await setDoc(todoItemRef, {isFinished: !clickedTodoItem.isFinished}, {merge:true});
    
    // setTodoItemList(todoItemList.map((todoItem) => {
    //   if (clickedTodoItem.id === todoItem.id) {
    //     return {
    //       id: clickedTodoItem.id,
    //       todoItemContent: clickedTodoItem.todoItemContent,
    //       isFinished: !clickedTodoItem.isFinished,
    //     };
    //   } else {
    //     return todoItem;
    //   }
    // }));
    syncTodoItemListStateWithFirestore();
  };
  const onRemoveClick = async (removedTodoItem) => {
    const todoItemRef = doc(db, "todoItem", removedTodoItem.id);
    await deleteDoc(todoItemRef);
    
    // setTodoItemList(todoItemList.filter((todoItem) => {
    //   return todoItem.id !== removedTodoItem.id;
    // }));
    syncTodoItemListStateWithFirestore();
  };
    
  return (
    <div className="App">
      <TodoListAppBar currentUser={currentUser} />
      {/* <TodoItemInputField onSubmit={onSubmit}/>
      <TodoItemList 
        todoItemList={todoItemList} 
        onTodoItemClick={onTodoItemClick}
        onRemoveClick={onRemoveClick}
      /> */}
      <Container sx={{paddingTop: 3}}>
        <TodoItemInputField onSubmit={onSubmit} />
        <TodoItemList
          todoItemList={todoItemList}
          onTodoItemClick={onTodoItemClick}
          onRemoveClick={onRemoveClick}
        />
      </Container>
    </div>
  );
}

export default App;
