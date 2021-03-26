import React, { useState, useEffect,useContext } from 'react'
// then we needn to create a functional component
// and at the last export it...

import {Link} from 'react-router-dom'

import {UserContext} from '../../App'
const Home = () => {
    const [data, setData] = useState([]); // data is an array of js object......
    const {state,dispatch}=useContext(UserContext) // this state is an js object taht conatin the info regarding the current user taht is logged in..
    // state._id will give us the id of the person who is currently logged in...

    const [readMore, setReadMore] = useState(false); //used to implement read more functionality..
    const linkName = readMore ? 'Read Less << ' : 'Read More >> '

    // now we will be making a newtwork reques to the server bcz we want to see all our post...
    // it is of get type so we are not mentioning the method:"post"
    useEffect(() => {
        fetch('/getsubpost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt") //we are fetching the  token from our local storage...
            }
        })
            .then(res => res.json()) // we need to parse the result to json..
            .then(result => {
                //console.log(data)
                console.log("yahan tak aya hai", result) // the result is an js object inside it we have a array that contain all our posts..and the name of that is posts..
                // are getting this information by doing console,log
                setData(result.posts); // data tu array hai...aur result object hai isiliye directly assign nhi kr sakte hain..  
                //console.log("set bhi ho gya hai..")
            })
    }, []) //[] using this bcz i want this component to load only once dont want to get stuck inside the loop..
    // now we can say that data conatin all our post after making the network request to the backend..
    // and now from this we will using map to fetch the post and display it at the front end..
    
    
    // network request to the server...ye jo id pass ki hai hai ye map ke ander se item._id pass ki hai.
    const likepost=(id)=>{
        fetch("/like",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt") // fetched the token..
            },
            body:JSON.stringify({
                postId:id //ye curent user jo login hai uski id ko front end se pass kiya hai..
            // iss id ko backend pr recieve krke likes array ke ander push kr denge..
            })
        })
        .then(res=>res.json())
        .then(result=>{
            /*console.log(result)
            we will be updating the state so that we can dynamically see changes in the no of likes and dislike of a post..
            data is basically an array of js object that contain all our posts....
            basically here we are tring to write a logic so that the no of likes and dislikes can be updated dyanmically
            in a real time....*/
            const newData=data.map(item=>{
                if(item._id==result._id)
                {
                    // iska matlab hai ki saari available post mei se iss post ko like kiya gya hai
                    return result // iss array mei jis post ko like kiya hai uska data hoga..
                }
                else{
                    return item  // this is not the post that was liked by the user..
                }
            })
            setData(newData) //
        }).catch(err=>{
            console.log(err)
        })
    }

    // 2nd fucntional component to make the 2nd network request regarding unlike post..
    const unlikepost=(id)=>{
        fetch("/unlike",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt") // fetched the token..
            },
            body:JSON.stringify({
                postId:id //ye curent user jo login hai uski id ko front end se pass kiya hai..
            // iss id ko backend pr recieve krke likes array ke ander push kr denge..
            })
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            // iss code se realtime mei no of likes update ho rahe hain..
            const newData=data.map(item=>{
                if(item._id==result._id)
                {
                    // iska matlab hai ki saari available post mei se iss post ko like kiya gya hai
                    return result // iss array jis post ko like kiya hai uska data hoga..
                }
                else{
                    return item  // this is not the post that was liked by the user..
                }
            })
            setData(newData) //
        })
        .catch(err=>{
            console.log(err)
        })
    }
    const makeComment=(text,postId)=>{
       fetch("/comment",{
           method:"put",
           headers:{
               "Content-Type":"application/json" ,// yahan se data ko backend pr send kr rhe hain..
               "Authorization":"Bearer "+localStorage.getItem("jwt")
           },
           body:JSON.stringify({
               postId:postId,
               text:text
           })
       })
       .then(res=>res.json())
       .then(result=>{
         // we have to write the same logic what we have written at the time of liking the post..\
         // so we could see the comment added in the real time..
         console.log("yahan se print ho rha hai",result)
         const newData=data.map(item=>{
            if(item._id==result._id)
            {
                // iska matlab hai ki saari available post mei se iss post ko like kiya gya hai
                return result // iss array mei jis post ko like kiya hai uska data hoga..
            }
            else{
                return item  // this is not the post that was liked by the user..
            }
        })
        setData(newData)
       })
       .catch(err=>{
           console.log(err)
       })
    }
    
    const deletePost=(postid)=>{
        fetch(`/deletepost/${postid}`,{
            method:"delete",
            headers:{
                Authorization:"Bearer "+localStorage.getItem("jwt") // as we are not passin any data so no body is required..
            }
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            // now we will be filtering out that post whcih the user has deleted..
            const newData=data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData)
        })
    }
    /*
    const deleteComment=(commentid)=>{
        fetch(`/deletecomment/${commentid}`,{
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData=data.filter(item=>{
                return item._id!==result._id
            })
            setData(newData)
        })
    }*/
    const deleteComment=(postid,commentid)=>{
        fetch(`/deletecomment/${postid}/${commentid}`,{
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            console.log(result)
            /*
            const newData=data.filter(item=>{
                return item._id!==result._id
            })*/
            const newData=data.map(item=>{
                if(item._id==result._id)
                {
                    return result;
                }else{
                    return item;
                }
            })
            setData(newData)
        })
    }
    const x = readMore ? 'Read Less.. ' : 'Read More.. '
    return (
        <div className="home">
            {
                data.map((item) => {
                    return (
                        <div className="card home-card" key={item._id}>
                            <h5 style={{padding:"5px"}}><Link to={item.postedby._id!==state._id?"/profile/"+item.postedby._id:"/profile"}>{item.postedby.name}</Link> {item.postedby._id==state._id && <i className="material-icons" style={{float:"right"}}
                            onClick={()=>deletePost(item._id)} // here the user has passed the id of the psot taht he wnats to delete.
                            >delete</i>}</h5>
                            <div className="card-image">
                                <img src={item.photo} />
                            </div>
                            <div className="card-content">
                                <i className="material-icons" style={{ color: "red" }}>favorite</i>
                                {
                                    // ye jo item._id hai ye loop mei chalega aur sare post honge useme but state._id current usrr ki id hai..
                                    item.likes.includes(state._id) // agar likes array ke ander already vo id hai it means the user has liked the pic now it only has the option to dislike it..
                                    ?<i className="material-icons" onClick={()=>unlikepost(item._id)}>thumb_down</i>
                                    :<i className="material-icons" onClick={()=>likepost(item._id)}>thumb_up</i>
                                }
                                
                                
                                <h6>{item.likes.length} likes</h6>
                                <h6><b>Title: </b> <i>{item.title}</i></h6>
                                <a style={{justifyContent:true}}><b>Description :</b> <i>{!readMore && item.body.slice(0,item.body.length/4)}</i></a>
              <a onClick={()=>{setReadMore(!readMore)}}><i className="read-more-link">{readMore && item.body.slice(0,item.body.length)}{" "}<a className="read-more-link"><b>{x}</b></a>
              </i>
              </a>


                                <p><i class="material-icons">local_phone:</i> <i>{item.phone}</i></p>
                                <p><b>Address: </b> <i>{item.address}</i></p>
                                {
                                    item.comments.map(record=>{
                                        return(
                                            
                                        <h6 key={record._id}> 

                                        {console.log(record)}
                                        {record.postedby._id==state._id && <i className="tiny material-icons" onClick={()=>deleteComment(item._id,record._id)} >delete</i>} 
                                        <span style={{fontWeight:"500"}}>{record.postedby.name} </span>{record.text}</h6>
                                        //<h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedby.name}</span> {record.text}</h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e)=>{
                                    e.preventDefault()
                                   // console.log(e.target[0].value) isse hame ye fetch kr liya ki user ne kya dala hai....
                                   // ab we need to call our fucntional component and pass the text entered by the user and the id.
                                   console.log(e.target[0].value)
                                   {makeComment(e.target[0].value,item._id)} 
                                }}>
                               <input type="text" placeholder="add a comment" /></form>
                            </div>
                        </div>
                    )
                })
            }


        </div>
    )
}
export default Home

// <h6>{item.likes.length}</h6> this is useful to get the number of likes.....
// that will be equal to the number of ids that are present inside the likes array..
// <span style={{fontWeight:"500"}}>{record.postedby.name}</span>