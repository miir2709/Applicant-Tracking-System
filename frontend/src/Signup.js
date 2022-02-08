import React from 'react';
import '@lottiefiles/lottie-player'
import { Link } from 'react-router-dom'
import axios from 'axios';

function Signup() {

    async function createUser(e) {
        e.preventDefault()
        var fname = (e.target.form[0].value)
        var lname = e.target.form[1].value
        var username = e.target.form[2].value
        var email = e.target.form[3].value
        var password = e.target.form[4].value
        var phone = e.target.form[5].value
        var type = e.target.form[6].value
        var res = {
            "username": username,
            "email": email,
            "password": password,
            "first_name": fname,
            "last_name": lname,
            "phone": phone,
            "user_type": type
        }
        await axios.post('http://127.0.0.1:8000/api/auth/register/', res)
            .catch(e => {
                console.error(e)
                window.location.reload()
            })
            .then(async function (data) {
                if (type(data['username']) === 'string')
                    window.location.href = "/login"
                else
                    console.log(data)
            })
    }

    return (
        <div class="login-page">
            <div class="loginform">
                <form id="signup-form">
                    <lottie-player
                        src="https://assets4.lottiefiles.com/datafiles/XRVoUu3IX4sGWtiC3MPpFnJvZNq7lVWDCa8LSqgS/profile.json"
                        background="transparent"
                        speed="1"
                        style={{ justifyContent: 'center' }}
                        loop
                        autoplay
                    ></lottie-player>
                    <input type="text" placeholder="First Name" />
                    <input type="text" placeholder="Last Name" />
                    <input type="text" placeholder="username" />
                    <input type="text" placeholder="email" />
                    <input type="password" id="password" placeholder="password" />
                    <input type="text" placeholder="Phone" />
                    <select id="user_type" form="signup-form">
                        <option value="Applicant">Applicant</option>
                        <option value="Recruiter">Recruiter</option>
                    </select>
                    <i class="fas fa-eye" onclick="show()"></i>
                    <br />
                    <br />
                    <input type="submit" value="Signup" className="submit-button" onClick={createUser}></input>
                </form>
            </div>
        </div>
    )
}

export default Signup