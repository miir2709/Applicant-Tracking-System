import React, { useState } from 'react';
import "@lottiefiles/lottie-player";
import { Link } from "react-router-dom"
import axios from "axios";

function ApplicantForm(props) {
    const [message, setMessage] = useState(null)
    async function addApplicantDetails(e) {
        e.preventDefault();
        var applicant_id = 2
        var resume = e.target.form[0].value
        var preferred_location = e.target.form[1].value
        var job_categories = e.target.form[2].value
        await axios.post("http://127.0.0.1:8000/api/applicant/", {
            "applicant_id": applicant_id,
            "resume": resume,
            "preferred_location": preferred_location,
            "job_categories": job_categories,
        })
            .catch(e => {
                console.log(e.response)
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
                    <input type="text" id="employer_name" placeholder="Employer Name" />
                    <input type="text" id="employment_period" placeholder="Job Category" />
                    <input type="text" id="job_title" placeholder="Job Title" />
                    <input type="submit" value="Submit" className="submit-button" onClick={addApplicantDetails}></input>
                    <p className="message"></p>
                </form>
            </div>
        </div >
    )
}

export default ApplicantForm