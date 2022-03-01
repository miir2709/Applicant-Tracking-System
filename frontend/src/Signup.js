import React, { useState } from 'react';
import '@lottiefiles/lottie-player'
import { Link } from 'react-router-dom'
import axios from 'axios';

function Signup() {
    const [message, setMessage] = useState(null)
    const [passCheck, setPassCheck] = useState(true)
    const [phoneCheck, setPhoneCheck] = useState(true)

    async function createUser(e) {
        e.preventDefault()
        var fname = (e.target.form[0].value)
        var lname = e.target.form[1].value
        var username = e.target.form[2].value
        var email = e.target.form[3].value
        var password = e.target.form[4].value
        var phone = e.target.form[6].value
        var type = e.target.form[7].value
        var res = {
            "username": username,
            "email": email,
            "password": password,
            "first_name": fname,
            "last_name": lname,
            "phone": phone.toString(),
            "user_type": type
        }

        if (passCheck == true && phoneCheck == true && (type == 'Applicant' || type == 'Recruiter')) {
            await axios.post('http://127.0.0.1:8000/api/auth/register/', res)
                .catch(e => {
                    var attr = (Object.keys(e.response.data))
                    var msg = "Invalid "
                    for (var i = 0; i < attr.length - 1; i++) {
                        msg += attr[i] + ", "
                    }
                    msg += attr[attr.length - 1]
                    setMessage(msg)
                })
                .then(async function (data) {
                    if (type(data['username']) === 'string')
                        window.location.href = "/login"
                    else
                        console.log(data)
                })
        }
    }

    function checkPass(e) {
        if (e.target.form[4].value == e.target.form[5].value)
            setPassCheck(true)
        else
            setPassCheck(false)
    }

    function checkPhone(e) {
        console.log(e.target.value.length)
        if (e.target.value.length == 10) {
            setPhoneCheck(true)

        }
        else
            setPhoneCheck(false)
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
                    <input type="text" placeholder="Username" />
                    <input type="text" placeholder="Email" />
                    <input type="password" id="password" placeholder="Password" onChange={checkPass} />
                    <input className="mb-0" type="password" id="confirmPassword" placeholder="Confirm Password" onChange={checkPass} />
                    {passCheck == false ? <p className="text-red-600 text-sm text-left mb-2 -mt-2 ml-2 font-bold">Passwords don't match</p> : null}
                    <input type="number" placeholder="Phone" onChange={checkPhone} pattern="[0-9]{10}" />
                    {phoneCheck == false ? <p className="text-red-600 text-sm text-left mb-2 -mt-2 ml-2 font-bold">Length of phone no. must be 10</p> : null}
                    <select id="user_type" form="signup-form">
                        <option value="Select User Type">Select User Type</option>
                        <option value="Applicant">Applicant</option>
                        <option value="Recruiter">Recruiter</option>
                    </select>
                    <i class="fas fa-eye" onclick="show()"></i>
                    <br />
                    <br />
                    <input type="submit" value="Signup" className="submit-button" onClick={createUser}></input>
                    {message != null ? <p className="text-red-600 text-base text-center my-2 -mb-4 font-bold">{message}</p> : null}
                </form>
            </div>
        </div>
    )
}

export default Signup