import { React, useState, useContext } from 'react' // we have to use the useState hook here...
import { Link, useHistory } from 'react-router-dom' // useHistory is needed to redirect the user to the home page after the successfull sign in..
import M from 'materialize-css'
import { UserContext } from '../../App'
import { Footer } from 'react-bootstrap';

/* UserContext this is defined by us in the App.js*/

const Signin = () => {
    const { state, dispatch } = useContext(UserContext)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const history = useHistory() // it is also a hook we will be using its push method ....


    const Postdata = () => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(email)) {
            M.toast({ html: "Invalid Email-id", classes: "#c62828 red darken-3" })
            return
        }
        fetch("/signin", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                password: password,
                email: email
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red darken-3" })
                }
                else {
                    localStorage.setItem("jwt", data.token)
                    localStorage.setItem("user", JSON.stringify(data.user)) // user ki detail aur token both are stored in the local storage.
                    // but we need to stringfy it bcz in the local storage we can only store the data in the form of string..
                    dispatch({ type: "USER", payload: data.user })
                    M.toast({ html: "signedin successfully", classes: "#388e3c green darken-2" })
                    history.push('/') // user will be send to the home page after he successfully sign up
                }
            })
            .catch(err => {
                console.log("the error is ", err)
            })
    }
    return (
        <div className="mycard input-field">
            <div className="card auth-card">
                <h2> मदद </h2>
                <input type="text" placeholder="email" value={email} onChange={(e) => {
                    setEmail(e.target.value) // here we are updating the value of the email taht is given by the user...
                }} />
                <input type="password" placeholder="password" value={password} onChange={(e) => {
                    setPassword(e.target.value) // similarly we have also updated the password...
                }} />
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => Postdata()}>Login
                </button>
                <h5>
                    <Link to="signup">Don't have an account ??</Link>
                </h5>
            </div>

        </div>


    )
}
export default Signin
//  #64b5f6 blue lighten-2 this is the code of the colour copied it form the documentation
/** the momment the user will gonna to click on the signin button the Postdata function will be triggered and
 * the network request will be made from the client side..
 */
// <a className="grey-text text-lighten-4 right" href="https://github.com/PARAGROY1408">More Links</a>
// <a className="grey-text text-lighten-4 right" href="https://www.linkedin.com/in/parag-roy-ab571b171/">More Links</a>
/**
 * <footer className="page-footer footerself #424242 grey darken-3">
            <div className="footer ">
            <div className="container left self3">
            @Developer:Parag Roy  </div>

            <a className="grey-text text-lighten-4 center" target="_blank" href="https://github.com/PARAGROY1408"> Github     </a>
            <a className="grey-text text-lighten-4 center" target="_blank" href="https://www.linkedin.com/in/parag-roy-ab571b171/">Linkedin </a>


          </div>
        </footer>
 */