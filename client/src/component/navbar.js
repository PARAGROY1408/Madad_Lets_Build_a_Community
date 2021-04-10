import React, { useContext, useRef, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../App'
import M from 'materialize-css'
import { Types } from 'mongoose'
const Navbar = () => {  // this is a functional component..
  const searchModel = useRef(null)
  const [search, setSearch] = useState("") // isse model ke input tag mei use karenge..
  const[userDetails,setUserDetails]=useState([]) // jo query ka response aa rha hai backend se vo eik array hai...isilye useState mei array pass kiya hai..
  useEffect(() => {
    M.Modal.init(searchModel.current) // when we click on the serach model will get opne
  }, [])//[] this is used bcz we wnt thi useEffect to get fired only once if we dont use this then we will get stuck in the unending loop..
  const { state, dispatch } = useContext(UserContext)
  const history = useHistory()
  const renderList = () => {
    if (state) { // iska matlab user login kr chuka hai tu ye component display krwa denge
      return [
        <li key="1"><i data-target="modal1" className="large material-icons modal-trigger" style={{ color: "black" }}>search</i></li>,
        <li key="2"><Link to="/profile">Profile</Link></li>,
        <li key="3"><Link to="/createpost">Createpost</Link></li>,
        <li key="4"><Link to="/myfollowingpost">My following Posts</Link></li>,
        <li key="5"><Link to="/signin">
          <button className="btn #d32f2f red darken-2" onClick={() => {
            // logout pr jaise se click karenge..hamara local storage clear krna hai..
            // that is the userdetail and token what we are using must be removed from our local host
            localStorage.clear()
            dispatch({ type: "CLEAR" }) // we also need to clear the state..
            // now we will take the user to the signin page..
            history.push('/signin')
          }}>Logout</button>
        </Link></li>
      ]
    }
    else { // abhi user ne login nhi kiya  hai
      return [
        <li key="6"><Link to="/signin" className="self2">Signin</Link></li>,
        <li key="7"><Link to="/signup" className="self2">Signup</Link></li>,
        <li key="8"><Link to="/aboutus" className="self2">Aboutus</Link></li>

      ]
    }
  }
  // jitne letter user type karega utne baar ye fn call hoga 
  // let suppose user ne type kiya seva
  // 4 baar fn call hoga..
  // q1 s
  // q2 se
  // q3 sev
  // q4 seva
  // in 4 ke corresponding hr baar jo matching record hai vo return ho jaega..
  const fetchUsers=(query)=>{ // this fn will be triggrerd when the change is made in the input box..
   // the usser will serach for the other user and this function will be called...
   setSearch(query) // first we will update the state..
   // now we will make a network request to the route that we have created at the backend..
   fetch('/search-users',{
     method:"post",
     headers:{
       "Content-Type":"application/json"
     },
     body:JSON.stringify({
       query:query // yahan pr key query hai uske ander jo query fn mei aya hai usse pass kr diya hai
       // yahan pr key ka nam query rakha hai...backend pr issi nam se data ko fetch kr rahe hain.
     })
   })
   .then(res=>res.json())
   .then(result=>{
      // yahan pr result ke ander pura ka pura record aa rha hai....
      //console.log(result)
      setUserDetails(result.user) // console karke deko eik baar
   })
  }
  return (

    <>
      <nav>
        <div className="nav-wrapper #bbdefb blue lighten-4">

          <Link to={state ? "/" : "/signin"} className="brand-logo center" >मदद</Link>


          <a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            {renderList()}

          </ul>

        </div>
        <div id="modal1" className="modal parag1" ref={searchModel} /*style={{color:"black"}}*/>
          <div className="modal-content">
            <input type="text" placeholder="Search Users" value={search} onChange={(e) => {
              fetchUsers(e.target.value) // jaise he user ne kuch search ke liye dala ye fn call hoga
            }} />
            <ul className="collection">
              {
                // ab userDetails jo eik array hai uss pr map function ka use karnge..
                userDetails.map(item=>{
                return <Link to={item._id!==state._id?"/profile/"+item._id:"/profile"} onClick={()=>{
                  //when we click on the email of the user we will be redirected to the profile page of taht user..
                  // now we need to close this modal....
                  // first we will get the instance of the modal and then we will close it..
                  M.Modal.getInstance(searchModel.current).close()
                  // now we agin need to clear our search...
                  setSearch('')
                }}><li className="collection-item">{item.email}</li></Link>
                })
              }
            </ul>

          </div>
          <div className="modal-footer">
            <button className="modal-close waves-effect waves-green btn-flat"onClick={()=>setSearch('')} >Close</button>
          </div>
        </div>

      </nav>
      <ul className="sidenav" id="mobile-demo">
        {renderList()}
      </ul>
    </>
  )
}
export default Navbar
// in the link section we have to spell the to the same way we have did it in the path of the Router in App.js
/* onClick={()=>setSearch('')} iska use state clear karne ke liye hai jab user search user ka use karega tab
   vo input box pr jo type kiya hai vo close karne ke baad remove ho gya kyunki iska use kiya tha
*/



/**
 * <li><Link to="/signin">Signin</Link></li>
    <li><Link to="/signup">Signup</Link></li>
    <li><Link to="/profile">Profile</Link></li>
    <li><Link to="/createpost">Createpost</Link></li>
    we have removed all this from the ul bcz all of this will not be shown to the user at a sigle
    time,some of the content will be shown and rest are hidden depending on the fact where the user
    has signin or not..
 */