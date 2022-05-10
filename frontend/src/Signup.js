import React, { useState } from 'react';
import '@lottiefiles/lottie-player'
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Signup() {
    const [message, setMessage] = useState(null)
    const [passCheck, setPassCheck] = useState(true)
    const [phoneCheck, setPhoneCheck] = useState(true)
    const navigate = useNavigate()
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

        if (passCheck === true && phoneCheck === true && (type === 'Applicant' || type === 'Recruiter')) {
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
                    console.log(data);
                    if (data.status == 201) {
                        (async () => await localStorage.setItem('user_type', data.data.user.user_type))();
                        while (true) {
                            if (localStorage.getItem('user_type') != null) {
                                console.log(localStorage.getItem('user_type') == 'Applicant' && localStorage.getItem('user_id') === null)
                                break;
                            }
                        }
                        if (data.data.user.user_type == 'Applicant')
                            navigate('/applicant', { state: { user_id: data.data.user.id } })
                        else
                            navigate('/recruiter', { state: { user_id: data.data.user.id } })
                    }
                    else
                        console.log(data)
                })
        }
    }

    function checkPass(e) {
        if (e.target.form[4].value === e.target.form[5].value)
            setPassCheck(true)
        else
            setPassCheck(false)
    }

    function checkPhone(e) {
        console.log(e.target.value.length)
        if (e.target.value.length === 10) {
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
                    <div className="flex flex-col text-left">
                        <label for="firstName" className="mb-2 ml-1 text-sm">First Name</label>
                        <input id="firstName" type="text" placeholder="First Name" />
                    </div>
                    <div className="flex flex-col text-left">
                        <label for="lastName" className="mb-2 ml-1 text-sm">Last Name</label>
                        <input id="lastName" type="text" placeholder="Last Name" />
                    </div>
                        <div className="flex flex-col text-left">
                            <label for="username" className="mb-2 ml-1 text-sm">Username (Min. 6 characters)</label>
                            <input id="username" type="text" placeholder="Username" />
                    </div>
                    <div className="flex flex-col text-left">
                        <label for="email" className="mb-2 ml-1 text-sm">Email</label>
                        <input id="email" type="text" placeholder="Email" />
                    </div>
                    <div className="flex flex-col text-left">
                        <label for="password" className="mb-2 ml-1 text-sm">Password (Min. 8 characters)</label>
                        <input type="password" id="password" placeholder="Password" />
                    </div>
                    <div className="flex flex-col text-left">
                        <label for="confirmPassword" className="mb-2 ml-1 text-sm">Confirm Password</label>
                        <input className="mb-0" type="password" id="confirmPassword" placeholder="Confirm Password" onChange={checkPass} />
                    </div>
                    {passCheck === false ? <p className="text-red-600 text-sm text-left mb-2 mt-2 ml-2 font-bold">Passwords don't match</p> : null}
                    <div className="flex flex-col text-left">
                        <label for="phone" className="mb-2 ml-1 text-sm">Phone</label>
                        <input id="phone" className="mt-2 " type="number" placeholder="Phone" onChange={checkPhone} pattern="[0-9]{10}" />
                    </div>
                    {phoneCheck === false ? <p className="text-red-600 text-sm text-left mb-2 -mt-2 ml-2 font-bold">Length of phone no. must be 10</p> : null}
                    <div className="flex flex-col text-left">
                        <label for="user_type" className="mb-2 ml-1 text-sm">User Type</label>
                        <select id="user_type" form="signup-form">
                            <option value="Select User Type">Select User Type</option>
                            <option value="Applicant">Applicant</option>
                            <option value="Recruiter">Recruiter</option>
                        </select>
                    </div>
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
