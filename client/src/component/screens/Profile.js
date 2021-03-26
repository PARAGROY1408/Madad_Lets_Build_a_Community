import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
const Profile = () => {
    // we have to use the useEffect hook bcz we need to get the data from the backend...
    // we need all the post that is made by that particuar user........
    const [mypics, setPics] = useState([])
    // mypics is an array and and it will contain all the posts made by that particular user..

    const [readMore, setReadMore] = useState(false); //used to implement read more functionality..
    const linkName = readMore ? 'Read Less << ' : 'Read More >> '


    const { state, dispatch } = useContext(UserContext)

    const [image, setImage] = useState("")
    //const [url, setUrl] = useState("")
    useEffect(() => {
        // in this we will make a network request to the backend by fetch..
        fetch('/mypost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                setPics(result.mypost)
                // now mypics is an array of js objects and we need to fetch only the image from it..
                // with the help of photo key..
            })
    }, []) // want the useEffect to get fired only once..

    useEffect(() => {
        if (image) {
            const data = new FormData()
            data.append("file", image)
            data.append("upload_preset", "insta-clone")
            data.append("cloud_name", "paragpramodroy")

            // as this fetch is of post so we have to pass the method inside it...
            fetch("	https://api.cloudinary.com/v1_1/paragpramodroy/image/upload", {
                method: "post",
                body: data
            })
                .then(res => res.json()) // we will get the response then convert it to the json format..
                .then(data => {
                    /*
                    console.log(data)
                    isse console karke dekha data eik js ka object hai..it have different key value pair..
                    usme se eik key hai url ki we want so we will use it like data.url
                    */
                    //setUrl(data.url)
                    console.log(data)
                    // we need to update our state...
                    // then we need to make changes in the localstoarge also..
                    //localStorage.setItem("user",JSON.stringify({...state,pic:data.url}))
                    //dispatch({type:"UPDATEPIC",payload:data.url})

                    fetch('/updatepic', {
                        method: "put",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("jwt")
                        },
                        body: JSON.stringify({
                            pic: data.url
                        })
                    })
                        .then(res => res.json())
                        .then(result => {
                            console.log(result) // ye bacend se aya hai..
                            localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }))
                            dispatch({ type: "UPDATEPIC", payload: result.pic })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                    // now from here we will make a network request to the backend..
                    // at the backend we have defined a updatepic route and we will send the pic given by the user.
                    /*
                    //window.location.reload() //we are getting some error..
                    //length is not defined so inorder to get rid of that..
                    // we will reload the page after updatring the pic*/
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [image])

    const updatePhoto = (file) => { // we will receive a file 
        /* we have to post the image to the cloud*/

        setImage(file) // we passed the file in this way alsoe..

    }
    const x = readMore ? 'Read Less.. ' : 'Read More.. '
    return (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
            <div style={{
                margin: "18px 0px",
                borderBottom: "1px solid grey"
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-around"
                }}>
                    <div>
                        <img style={{ width: "160px", height: "160px", borderRadius: "80px", padding: "10px" }}
                            src={state ? state.pic : "loading"} />

                    </div>
                    <div>
                        <h5 style={{ justifyContent: true }}> {state ? <b>{state.name}</b> : "loading"}</h5>
                        <h6 style={{ justifyContent: true }}> {state ? state.email : "loading"}</h6>
                        <h6 style={{ justifyContent: true }}>  {state ? state.phone : "loading"}</h6>
               
                        <h6> <i>{state ?
                            <>
                                <a style={{ justifyContent: true }}>{!readMore && state.aboutus.slice(0, state.aboutus.length / 8)}</a>
                                <a onClick={() => { setReadMore(!readMore) }}><i className="read-more-link">{readMore && state.aboutus.slice(0, state.aboutus.length)}{" "}<a className="read-more-link">{<b>{x}</b>}</a>
                                </i>
                                </a>
                            </>
                        : "loading"}</i></h6>
                        <div className="file-field input-field" style={{ margin: "45px" }}>
                            <div className="btn-small #64b5f6 blue darken-1">
                                <span>Edit Pic</span>
                                <input type="file" onChange={(e) => {
                                    updatePhoto(e.target.files[0])
                                }} />
                            </div>
                            <div className="file-path-wrapper">
                                <input className="file-path validate" type="text" />
                            </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-around", width: "109%" }}>
                            <h6>{mypics.length} Posts</h6>
                            <h6>{state ? state.followers.length : "0"}followers</h6>
                            <h6>{state ? state.following.length : "0"}following</h6>
                        </div>
                    </div>
                </div>

            </div>
            <div className="gallery">
                {
                    // we need to iterate and we will do this by map...
                    mypics.map(item => {
                        return (
                            <img key={item._id} className="item" src={item.photo} alt={item.title} />
                        )
                    })
                }
            </div>
        </div>
    )
}
export default Profile

