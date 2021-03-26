import {React,useState,useEffect} from 'react'
import {Links, useHistory} from 'react-router-dom'
import M from 'materialize-css'

const CreatePost = () => {
    const [title,setTitle]=useState();
    const[body,setBody]=useState();
    const[image,setImage]=useState();
    const[phone,setPhone]=useState();
    const[address,setAddress]=useState();
    const[url,setUrl]=useState();
    const history=useHistory();
    
    useEffect(()=>{
        if(url)
        {
        // uptill now we have posted the image of the user on the cloudinnary....
        // now we have to  make a netwrok request to the server and we will post the url of the image
        // image is on cloudinary(name of the company) amd on database we have url of that image
        fetch("/createpost",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
                // bcz firstly we have saved the token in our local storage and then we are getting it back..
            },
            body:JSON.stringify({
                title:title,
                body:body,
                phone:phone,
                address:address,
                pic:url,
                // yahan pr pic isiliye use kiya hai bcz at the backend we are fetching it by the pic thats why..
                // at the time of destructuring we are taking it as the pic...
            })
        }).then(res=>res.json)
        .then(data=>{
            //console.log(data) ye data aya hai backend se..
            console.log("ye backend se aa rha hai",data);
            if(data.error)
            {
                M.toast({html: data.error,classes:"#c62828 red darken-3"})
            }
            else{
                M.toast({html: "Created Post Successfully",classes:"#388e3c green darken-2"})
                history.push('/') // user will be send to the home page after he successfully sign up
            }
        })
        }
    },[url])// this useEffect function will be triggered when their is a change in the url.....

    
    // this function will be called when the user will click on the submit post..
    const Postdetails=()=>{
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
    return (
        <div className="card input-filed"
        style={{
           margin:"30px auto",
           maxWidth:"500px",
           padding:"20px",
           textAlign:"center"
        }}>
            <input type="text" placeholder="title" value={title} onChange={(e)=>{
                setTitle(e.target.value)
            }} />
            <input type="text" placeholder="body" value={body} onChange={(e)=>[
                setBody(e.target.value)
            ]} />
            <input type="text" placeholder="Phone" value={phone} onChange={(e)=>[
                setPhone(e.target.value)
            ]} />
            <input type="text" placeholder="Address" value={address} onChange={(e)=>[
                setAddress(e.target.value)
            ]} />
            <div className="file-field input-field">
                <div className="btn #64b5f6 blue darken-1">
                    <span>Upload Image</span>
                    <input type="file"  onChange={(e)=>{
                        setImage(e.target.files[0])
                    }}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={()=>(Postdetails())} >Submit Post</button>
        </div>
    )
}
export default CreatePost
// style={{}} this what we give is the inline css...