import React from 'react';
import '@lottiefiles/lottie-player'
import { Link } from 'react-router-dom'

function Signup() {
    return (
        <div class="login-page">
            <div class="loginform">
                <form>
                    <lottie-player
                        src="https://assets4.lottiefiles.com/datafiles/XRVoUu3IX4sGWtiC3MPpFnJvZNq7lVWDCa8LSqgS/profile.json"
                        background="transparent"
                        speed="1"
                        style={{ justifyContent: 'center' }}
                        loop
                        autoplay
                    ></lottie-player>
                    <input type="text" placeholder="full name" />
                    <input type="text" placeholder="email address" />
                    <input type="text" placeholder="pick a username" />
                    <input type="password" id="password" placeholder="set a password" />
                    <i class="fas fa-eye" onclick="show()"></i>
                    <br />
                    <br />
                </form>

                <form class="login-form">
                    <Link to='/login'>
                        <button type="button">
                            SIGN UP
                        </button>
                    </Link>
                </form>
            </div>
        </div>
    )
}

export default Signup