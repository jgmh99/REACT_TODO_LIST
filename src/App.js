import logo from './logo.svg';
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
const analytics = getAnalytics(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const auth = getAuth(app);

const TodoItemInputField = (props) => {
  const [input, setInput] = useState('');

  const onSubmit = () => {
    props.onSubmit(input);
    setInput("");
  }

  return (
    <Box sx={{ margin: "auto" }}>
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

const TodoItem = (props) => {
  const style = props.todoItem.isFinished ? { textDecoration: 'line-through' } : {};

  return (
    <ListItem id="ListItem" secondaryAction={
      <IconButton edge="end" aria-label="comments" onClick={() => props.onRemoveClick(props.todoItem)}>
        <DeleteIcon />
      </IconButton>
    }>
      <ListItemButton role={undefined} onClick={() => props.onTodoItemClick(props.todoItem)} dense >
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={props.todoItem.isFinished}
            disableRipple
          />
        </ListItemIcon>
        <ListItemText style={style} primary={`${props.index}. ${props.todoItem.todoItemContent}`} />
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
      <List sx={{ margin: "auto", maxWidth: 720 }}>
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

  return (
    <AppBar position="static">
      <Toolbar sx={{ width: "100%", maxWidth: 720, margin: "auto" }}>
        <Typography variant="h6" component="div">
          Todo List App
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {button}
      </Toolbar>
    </AppBar>
  );
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [todoItemList, setTodoItemList] = useState([]);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurrentUser(user.uid);
    } else {
      setCurrentUser(null);
    }
  });

  const syncTodoItemListStateWithFirestore = () => {
    const q = query(collection(db, "todoItem"), where("userId", "==", currentUser), orderBy("createdTime", "asc"));
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

  return (
    <div className="App">
      <TodoListAppBar currentUser={currentUser} />
      <Container sx={{ paddingTop: 3 }}>
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
