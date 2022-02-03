import React from 'react';
import "@lottiefiles/lottie-player";
import { Link } from "react-router-dom"

function Login() {
    return (
        <div className="login-page" >
            <div className="loginform">

                <form>
                    <lottie-player src="https://assets4.lottiefiles.com/datafiles/XRVoUu3IX4sGWtiC3MPpFnJvZNq7lVWDCa8LSqgS/profile.json" background="transparent" speed="1" style={{ justifyContent: 'center' }} loop autoplay></lottie-player>
                    <input type="text" placeholder="&#xf007;  username" />
                    <input type="password" id="password" placeholder="&#xf023;  password" />
                    <i className="fas fa-eye" onclick="show()"></i>
                    <br />
                    <br />
                    <button>LOGIN</button>
                    <p className="message"></p>
                </form>

                <form className="login-form">
                    <Link to='/signup'>
                        <button type="button">SIGN UP</button>
                    </Link>
                </form>
            </div>
        </div >
    )
}

export default Login