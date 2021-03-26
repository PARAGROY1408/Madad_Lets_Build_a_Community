import React,{useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'
const Navbar=()=>{  // this is a functional component..
    const {state,dispatch}=useContext(UserContext)
    const history=useHistory()
    const renderList=()=>{
      if(state)
      {
          return [
            
            <li><Link to="/profile">Profile</Link></li>,
            <li><Link to="/createpost">Createpost</Link></li>,
            <li><Link to="/myfollowingpost">My following Posts</Link></li>,
            <li><Link to="/signin">
            <button className="btn #d32f2f red darken-2" onClick={()=>{
              // logout pr jaise se click karenge..hamara local storage clear krna hai..
              // that is the userdetail and token what we are using must be removed from our local host
              localStorage.clear()
              dispatch({type:"CLEAR"}) // we also need to clear the state..
              // now we will take the user to the signin page..
              history.push('/signin')
            }}>Logout</button>
            </Link></li>
          ]
      }
      else{
          return [
            <li><Link to="/signin" className="self2">Signin</Link></li>,
            <li><Link to="/signup" className="self2">Signup</Link></li>,
            <li><Link to="/aboutus" className="self2">Aboutus</Link></li>

          ]
      }
    }
    return(
        
  <>
    <nav>
    <div className="nav-wrapper #bbdefb blue lighten-4">
    
      <Link to={state?"/":"/signin"} className="brand-logo center" >मदद</Link>
      
      
      <a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
      <ul id="nav-mobile" className="right hide-on-med-and-down">
        {renderList()}
        
      </ul>  
      
    </div> 
    
  </nav>
  <ul class="sidenav" id="mobile-demo">
    {renderList()}
  </ul>
  </>
    )
}
export default Navbar
// in the link section we have to spell the to the same way we have did it in the path of the Router in App.js

/**
 * <li><Link to="/signin">Signin</Link></li>
    <li><Link to="/signup">Signup</Link></li>
    <li><Link to="/profile">Profile</Link></li>
    <li><Link to="/createpost">Createpost</Link></li>
    we have removed all this from the ul bcz all of this will not be shown to the user at a sigle
    time,some of the content will be shown and rest are hidden depending on the fact where the user
    has signin or not..
 */