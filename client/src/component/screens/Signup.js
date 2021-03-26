import { React, useState,useEffect } from 'react' // useState is basically we are using hooks as we have defined functional component in it..
import { Link, useHistory } from 'react-router-dom' // we are importing the link of the signin page so we can navigate
import M from 'materialize-css'

// this Signup what we have created is basically our functional component..
const Signup = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("")
    const[phone,setPhone]=useState("")
    const[aboutus,setAboutus]=useState("")
    const [url, setUrl] = useState(undefined)
    const history = useHistory();
     
    
    useEffect(()=>{
        if(url)
        {
            uploadFields()
        }
    },[url])
    const uploadPic=()=>{
         /* we have to post the image to the cloud*/
         const data=new FormData()
         data.append("file",image)
         data.append("upload_preset","insta-clone")
         data.append("cloud_name","paragpramodroy")
 
         // as this fetch is of post so we have to pass the method inside it...
         fetch("	https://api.cloudinary.com/v1_1/paragpramodroy/image/upload",{
             method:"post",
             body:data
         })
         .then(res=>res.json()) // we will get the response then convert it to the json format..
         .then(data=>{
             /*
             console.log(data)
             isse console karke dekha data eik js ka object hai..it have different key value pair..
             usme se eik key hai url ki we want so we will use it like data.url
             */
            setUrl(data.url)
         })
         .catch(err=>{
             console.log(err)
         })
    }
    
    const uploadFields=()=>{
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(email)) {
            M.toast({ html: "Invalid Email-id", classes: "#c62828 red darken-3" })
            return
        }
        fetch("/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                name: name,
                password: password,
                email: email,
                phone:phone,
                aboutus:aboutus,
                pic:url,
            })
        }).then(res => res.json())
            .then(data => { // this data is coming from the server side...
                //console.log(data)
                // here we will be making use of toast....
                if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red darken-3" })
                }
                else {
                    M.toast({ html: data.message, classes: "#388e3c green darken-2" })
                    history.push('/signin')
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    const Postdata = () => {  // this is a network request and this function will be triggered when the user will goona to clck on signup button
        if(image)
        {
            uploadPic()
        }else{
            uploadFields()
        }
       

    }
    return (
        <div className="mycard input-field">
            <div className="card auth-card">
                <h2> मदद </h2>
                <input type="text" placeholder="Name/NGOName" value={name} onChange={(e) => {
                    setName(e.target.value)
                }} />
                <input type="text" placeholder="Email" value={email} onChange={(e) => {
                    setEmail(e.target.value)
                }} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => {
                    setPassword(e.target.value)
                }} />
                <input type="text" placeholder="Contactno" value={phone} onChange={(e) => {
                    setPhone(e.target.value)
                }} />
                <input type="text" placeholder="Aboutus" value={aboutus} onChange={(e) => {
                    setAboutus(e.target.value)
                }} />
                <div className="file-field input-field">
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Upload Pic</span>
                        <input type="file" onChange={(e) => {
                            setImage(e.target.files[0])
                        }} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => Postdata()}>SignUp
                </button>
                <h5>
                    <Link to="/signin">Already have an account ??</Link>
                </h5>
            </div>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            
        </div>

    )
}
export default Signup
//  #64b5f6 blue lighten-2 this is the code of the colour copied it form the documentation
// here useHistory hook is used to take us to the signin page aftr the signup is done succesfuuly
// useHistory uses push method for taht and we pass '/signin' in the push method to do it