import logo from './logo.svg';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);
function App() {
  const [newUser,setNewUser]=useState(false);
  const provider = new firebase.auth.GoogleAuthProvider();
  const [user,setUser] = useState({
    isSignedIn : false,
    name : '',
    email : '', 
    photo : '',
    password : ''
    // error : ''

  })
  const handleSignIn = () =>{

    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const {displayName,email,photoURL} = res.user;
      const signedInUser = {
        isSignedIn : true,
        name : displayName,
        email : email,
        photo :photoURL

      }
      setUser(signedInUser);
      console.log(displayName,email,photoURL);
      // console.log(res);
    })
    .catch(err => {
      console.log(err);
      console.log(err.message);

    })
  }


  const handleSignOut = ()=>{
    firebase.auth().signOut()
    .then(res =>{
      const signedOutUser = {
        isSignedIn : false,
        name : '',
        photo : '',
        email : '',
        error :'',
        success:false
      }
      setUser(signedOutUser);
    })

    .catch(err => {
      console.log(err);

    })
  }

  const handleBlur = (e)=>{
    let isFormValid = true;
    if(e.target.name === 'email'){
     isFormValid = /\S+@\S+\.\S+/.test(e.target.value);
      
    }

    if(e.target.name === 'password'){
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFormValid = isPasswordValid && passwordHasNumber ;
    }

    if(isFormValid){
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
    
  }

  const handleSubmit = (e)=>{
    // console.log(user.email,user.password);
    if(newUser && user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success=true;
        setUser(newUserInfo);
        
      })
      .catch(error =>
    {
   const newUserInfo = {...user};
   newUserInfo.error = error.message;
   newUserInfo.success=false;
    setUser(newUserInfo);

  });
    }


    if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
   
  })
  .catch(function(error) {
    const newUserInfo = {...user};
    newUserInfo.error = error.message;
    newUserInfo.success = false;
    setUser(newUserInfo);
  });
    }
e.preventDefault();
  }
  return (
    <div className="App">

      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign out</button>:
        <button onClick={handleSignIn}>Sign in</button>
      }
      
      {
        user.isSignedIn && <div> 
          <p>Welcome {user.name}</p>
          <p>email {user.email}</p>
          <img src={user.photo} alt="" />

        </div>
      }

      <h1>Our own Authentication</h1>
      {/* <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Password: {user.password}</p> */}
      <input type="checkbox" onChange={()=>setNewUser(!newUser)} name="newUser" id="" />
      <label htmlFor="newUser">New user Sign up</label>
      <form onSubmit={handleSubmit}>
       {newUser && <input type="text"  name="name" onBlur={handleBlur} placeholder="Your name"/>}
        <br />
        <input type="text" name="email" onBlur={handleBlur} placeholder="Your Email address" required />
        <br />
        <input type="password" name="password" onBlur={handleBlur} placeholder="Your Password" required />
        <br />
        <input type="submit" value="submit" />
      </form>
      <p style={{ color:'red' }}>{user.error}</p>
      {user.success && <p style={{ color:'green' }}>user { newUser ? 'created' : 'Logged In'} created</p> }
    </div>
  );
}

export default App;
