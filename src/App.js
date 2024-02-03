

// import logo from './logo.svg';
// import './App.css';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import AppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';

// import { useEffect, useState } from 'react';
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getFirestore, collection, addDoc, setDoc, doc, deleteDoc, getDocs, query, orderBy, where } from "firebase/firestore";
// import { GoogleAuthProvider, getAuth, signInWithRedirect, onAuthStateChanged, signOut } from "firebase/auth";
// import Box from '@mui/material/Box';
// import Container from '@mui/material/Container';
// import Stack from '@mui/material/Stack';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import IconButton from '@mui/material/IconButton';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import Checkbox from '@mui/material/Checkbox';
// import DeleteIcon from '@mui/icons-material/Delete';

// const firebaseConfig = {
//   apiKey: "AIzaSyDGzWy1GO-oYHD5E97PawlRZI_iODhoT1I",
//   authDomain: "todo-list-1dc5f.firebaseapp.com",
//   projectId: "todo-list-1dc5f",
//   storageBucket: "todo-list-1dc5f.appspot.com",
//   messagingSenderId: "117786700415",
//   appId: "1:117786700415:web:1f01cdb9a610acb7616d4a",
//   measurementId: "G-ZEPNV4T50S"
// };

// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const db = getFirestore(app);
// const provider = new GoogleAuthProvider();
// const auth = getAuth(app);

// const TodoItemInputField = (props) => {
//   const [input, setInput] = useState('');

//   const onSubmit = () => {
//     props.onSubmit(input);
//     setInput("");
//   }

//   return (
//     <Box sx={{ margin: "auto" }}>
//       <Stack direction="row" spacing={2} justifyContent="center">
//         <TextField
//           id="todo-item-input"
//           label="Todo Item"
//           variant="outlined"
//           onChange={(e) => setInput(e.target.value)} value={input}
//         />
//         <Button variant="outlined" onClick={onSubmit}>Submit</Button>
//       </Stack>
//     </Box>
//   );
// };

// const TodoItem = (props) => {
//   const style = props.todoItem.isFinished ? { textDecoration: 'line-through' } : {};
//   const formattedDate = new Date(props.todoItem.createdTime * 1000).toLocaleDateString();

//   return (
//     <ListItem id="ListItem" secondaryAction={
//       <IconButton edge="end" aria-label="comments" onClick={() => props.onRemoveClick(props.todoItem)}>
//         <DeleteIcon />
//       </IconButton>
//     }>
//       <ListItemButton role={undefined} onClick={() => props.onTodoItemClick(props.todoItem)} dense >
//         <ListItemIcon>
//           <Checkbox
//             edge="start"
//             checked={props.todoItem.isFinished}
//             disableRipple
//           />
//         </ListItemIcon>
//         <ListItemText
//           style={style}
//           primary={`${props.index}. ${props.todoItem.todoItemContent}`}
//           secondary={`Created on: ${formattedDate}`}
//         />
//       </ListItemButton>
//     </ListItem>
//   );
// };

// const TodoItemList = (props) => {
//   const todoList = props.todoItemList.map((todoItem, index) => {
//     return (
//       <TodoItem
//         key={todoItem.id}
//         todoItem={todoItem}
//         index={index + 1}
//         onTodoItemClick={props.onTodoItemClick}
//         onRemoveClick={props.onRemoveClick}
//       />
//     );
//   });

//   return (
//     <Box>
//       <List sx={{ margin: "auto", maxWidth: 720 }}>
//         {todoList}
//       </List>
//     </Box>
//   );
// };

// const TodoListAppBar = (props) => {
//   const loginWithGoogleButton = (
//     <Button color="inherit" onClick={() => { 
//       signInWithRedirect(auth, provider).then(() => {
//         alert("로그인되었습니다.");
//       }).catch((error) => {
//         alert("로그인에 실패했습니다. 오류: " + error.message);
//       });
//     }}>Login</Button>
//   );

//   const logoutButton = (
//     <Button color="inherit" onClick={async () => {
//       await signOut(auth);
//       props.setCurrentUser(null); // 사용자 정보 초기화
//       alert("로그아웃되었습니다.");
//     }}>Logout</Button>
//   );

//   const button = props.currentUser === null ? loginWithGoogleButton : logoutButton;

//   const [userName, setUserName] = useState(""); // 사용자 이름 상태 추가

//   useEffect(() => {
//     if (props.currentUser !== null) {
//       const user = auth.currentUser;
//       const displayName = user.displayName || "User";
//       setUserName(displayName);
//     }
//   }, [props.currentUser]);

//   return (
//     <AppBar position="static">
//       <Toolbar sx={{ width: "100%", maxWidth: 720, margin: "auto" }}>
//         <Typography variant="h6" component="div">
//           Todo List
//         </Typography>
//         <Box sx={{ flexGrow: 1 }} />
//         <Typography variant="subtitle1" color="inherit">
//           {props.currentUser !== null ? `${userName}님 환영합니다.` : ''}
//         </Typography>
//         {button}
//       </Toolbar>
//     </AppBar>
//   );
// };

// function App() {
//   const [currentUser, setCurrentUser] = useState(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setCurrentUser(user.uid);
//       } else {
//         setCurrentUser(null);
//       }
//     });

//     // Cleanup function to unsubscribe when component unmounts
//     return () => unsubscribe();
//   }, []);

//   const syncTodoItemListStateWithFirestore = () => {
//     const q = query(collection(db, "todoItem"), where("userId", "==", currentUser), orderBy("createdTime", "asc"));
//     getDocs(q).then((querySnapshot) => {
//       const firestoreTodoItemList = [];
//       querySnapshot.forEach((doc) => {
//         firestoreTodoItemList.push({
//           id: doc.id,
//           todoItemContent: doc.data().todoItemContent,
//           isFinished: doc.data().isFinished,
//           createdTime: doc.data().createdTime ?? 0,
//           userId: doc.data().userId,
//         });
//       });
//       setTodoItemList(firestoreTodoItemList);
//     });
//   };

//   useEffect(() => {
//     syncTodoItemListStateWithFirestore();
//   }, [currentUser]);

//   const [todoItemList, setTodoItemList] = useState([]);

//   const onSubmit = async (newTodoItem) => {
//     await addDoc(collection(db, "todoItem"), {
//       todoItemContent: newTodoItem,
//       isFinished: false,
//       createdTime: Math.floor(Date.now() / 1000),
//       userId: currentUser,
//     });
//     syncTodoItemListStateWithFirestore();
//   };

//   const onTodoItemClick = async (clickedTodoItem) => {
//     const todoItemRef = doc(db, "todoItem", clickedTodoItem.id);
//     await setDoc(todoItemRef, { isFinished: !clickedTodoItem.isFinished }, { merge: true });
//     syncTodoItemListStateWithFirestore();
//   };

//   const onRemoveClick = async (removedTodoItem) => {
//     const todoItemRef = doc(db, "todoItem", removedTodoItem.id);
//     await deleteDoc(todoItemRef);
//     syncTodoItemListStateWithFirestore();
//   };

//   return (
//     <div className="App">
//       <TodoListAppBar currentUser={currentUser} setCurrentUser={setCurrentUser} />
//       <Container sx={{ paddingTop: 3 }}>
//         <TodoItemInputField onSubmit={onSubmit} />
//         <TodoItemList
//           todoItemList={todoItemList}
//           onTodoItemClick={onTodoItemClick}
//           onRemoveClick={onRemoveClick}
//         />
//       </Container>
//     </div>
//   );
// }

// export default App;




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

import { TailSpin } from 'react-loader-spinner';


// Firebase imports...
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
  const formattedDate = new Date(props.todoItem.createdTime * 1000).toLocaleDateString();

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

  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (props.currentUser !== null) {
      const user = auth.currentUser;
      const displayName = user.displayName || "User";
      setUserName(displayName);
    }
  }, [props.currentUser]);

  return (
    <AppBar position="static">
      <Toolbar sx={{ width: "100%", maxWidth: 720, margin: "auto" }}>
        <Typography variant="h6" component="div">
          Todo List
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant="subtitle1" color="inherit">
          {props.currentUser !== null ? `${userName}님 환영합니다.` : ''}
        </Typography>
        {button}
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
  /* 로딩될떄 */
  const LoadingSpinner = ({ message }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <TailSpin color="#00BFFF" height={80} width={80} />
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
            <TodoItemInputField onSubmit={onSubmit} />
            <TodoItemList
              todoItemList={todoItemList}
              onTodoItemClick={onTodoItemClick}
              onRemoveClick={onRemoveClick}
            />
          </Container>
        </>
      )}
    </div>
  );
}

export default App;
