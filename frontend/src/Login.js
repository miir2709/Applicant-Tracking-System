import React, { useState } from 'react';
import "@lottiefiles/lottie-player";
import { Link } from "react-router-dom"
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const [message, setMessage] = useState(null)
    const navigate = useNavigate();
    async function loginUser(e) {
        e.preventDefault();
        var username = (e.target.form[0].value)
        var passwd = e.target.form[1].value
        await axios.post("http://127.0.0.1:8000/api/auth/login/", {
            "email": username,
            "password": passwd
        })
            .catch(e => {
                console.log(e.response)
                if (e.response.status === 401) {
                    setMessage("Wrong username or password")
                }
                else {
                    setMessage("Error, try again")
                }
            })
            .then(async function (data) {
                if (data.status === 200) {
                }
            })
    }

    return (
        <div className="login-page" >
            <div className="loginform">

                <form>
                    <lottie-player src="https://assets4.lottiefiles.com/datafiles/XRVoUu3IX4sGWtiC3MPpFnJvZNq7lVWDCa8LSqgS/profile.json" background="transparent" speed="1" style={{ justifyContent: 'center' }} loop autoplay></lottie-player>
                    {message != null ? <p className='text-red-600 font-bold mb-5'>{message}</p> : null}
                    <input type="text" placeholder="&#xf007;  username" />
                    <input type="password" id="password" placeholder="&#xf023;  password" />
                    <br />
                    <br />
                    <input type="submit" value="Login" className="submit-button" onClick={loginUser}></input>
                    <p className="message"></p>
                </form>

                <form className="login-form">
                    <Link to={{ pathname: '/signup' }}>
                        <button type="button" className='submit-button'>SIGN UP</button>
                    </Link>
                </form>
            </div>
        </div >
    )
}

export default Login