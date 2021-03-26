import React, { useEffect, createContext,useReducer,useContext} from 'react'
import Navbar from './component/navbar'
import Signin from './component/screens/Signin'
import Home from './component/screens/Home'
import Profile from './component/screens/Profile'
import Signup from './component/screens/Signup'
import Createpost from './component/screens/CreatePost'
import UserProfile from './component/screens/UserProfile'
import SubscribedUserPost from './component/screens/SubscribeUserPosts'
import Aboutus from './component/screens/Aboutus'
import "./App.css"
import { BrowserRouter, Route, Switch,useHistory } from 'react-router-dom'
import {initialState,reducer} from './reducers/userReducer' 


export const UserContext = createContext()

const Routing = () => {
  const history=useHistory()
  const {state,dispatch}=useContext(UserContext)
  useEffect(()=>{
     const user=JSON.parse(localStorage.getItem("user"))
     console.log(typeof(user),user)
      /** after the successfull signin of the user we have stored the details of the user in our localstorage
      * by the name "user" but the isssue is in the local storage this detail is stored in the form of
      * string, so due to this here we have to pass again to the object..
      * basically now we are fetching the details of the user what we have saved in the local storage
      *  */ 

    // this was our main objective of using context user will not be able to create the post untill
    // he has signedin...if user has not signin then take it to the signin page and if it has signin
    // then take it to the home page...
    // application ke load hone ke baad sabse pehle this code will work..
     if(user)
     {
       dispatch({type:"USER",payload:user})
       //history.push('/')
     }
     else{
       history.push('/signin')
     }
  },[]) //[] iska use krna important hai nhi tu loop mei stuck ho jaega..
  return (
    <Switch>
      <Route exact path="/">
        <Home></Home>
      </Route>
      <Route path="/signin">
        <Signin></Signin>
      </Route>
      <Route exact path="/profile"> 
        <Profile></Profile>
      </Route>
      <Route path="/signup">
        <Signup></Signup>
      </Route>
      <Route path="/createpost">
        <Createpost></Createpost>
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/myfollowingpost">
        <SubscribedUserPost></SubscribedUserPost>
      </Route>
      <Route path="/aboutus">
        <Aboutus></Aboutus>
      </Route>
    </Switch>
  )
}
function App() {
  const[state,dispatch]=useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
      <Navbar></Navbar>
       <Routing></Routing>
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
// <Navbar></Navbar> we can also write it as <Navbar/>
/* <Route exact path="/">  we have used exact word here bcz if we dont use this then as / this
is present in every route so in all the page like signin , signup page we have to see the home
page as well
*/
/** <Route exact path="/profile">  here we are using exact keyword bcz the same path is available in
 * UserProfile also...so if we dont use this keyword both the page will get loaded..
 * 
 */