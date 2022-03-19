import React, { useState } from 'react';
import "@lottiefiles/lottie-player";
import { Link } from "react-router-dom"
import axios from "axios";

function RecruiterDetails(props) {
    const [message, setMessage] = useState(null)
    async function addRecruiterDetails(e) {
        e.preventDefault();
        var recruiter_id = 4
        var company_name = e.target.form[0].value
        var company_description = e.target.form[1].value
        var company_website = e.target.form[2].value
        var corporate_address = e.target.form[3].value
        const formData = new FormData();
        formData.append("recruiter_id", recruiter_id);
        formData.append("company_name", company_name);
        formData.append("company_description", company_description);
        formData.append("company_website", company_website);
        formData.append("corporate_address", corporate_address);

        await axios.post("http://127.0.0.1:8000/api/recruiter/", formData)
            .catch(e => {
                console.log(e.response)
            })
            .then(async function (data) {
                if (data.status === 200) {
                    console.log(data)
                }
            })
    }
    return (
        <div className="login-page" >
            <div className="loginform">

                <form>
                    <lottie-player src="https://assets4.lottiefiles.com/datafiles/XRVoUu3IX4sGWtiC3MPpFnJvZNq7lVWDCa8LSqgS/profile.json" background="transparent" speed="1" style={{ justifyContent: 'center' }} loop autoplay></lottie-player>
                    {message != null ? <p className='text-red-600 font-bold mb-5'>{message}</p> : null}
                    <input type="text" id="company_name" placeholder="Company Name" />
                    <input type="text" id="company_description" placeholder="Company Description" />
                    <input id="company_website" type="url" placeholder="Company Website" />
                    <input id="corporate_address" type="text" placeholder="Corporate Address" />
                    <input type="submit" value="Submit" className="submit-button" onClick={addRecruiterDetails}></input>
                    <p className="message"></p>
                </form>
            </div>
        </div >
    )
}

export default RecruiterDetails