import React, { useState } from 'react';
import "@lottiefiles/lottie-player";
import { Link } from "react-router-dom"
import axios from "axios";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function EmploymentForm(props) {
    const [message, setMessage] = useState(null)
    const location = useLocation()
    const navigate = useNavigate()
    console.log(location.state.applicant_id)
    async function addEmploymentDetails(e) {
        e.preventDefault();
        var applicant_id = location.state.applicant_id
        var employer_name = e.target.form[0].value
        var employment_period = e.target.form[1].value
        var job_title = e.target.form[2].value
        await axios.post("http://127.0.0.1:8000/api/employment_details/", {
            "applicant_id": applicant_id,
            "employer_name": employer_name,
            "employment_period": employment_period,
            "job_title": job_title,
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
                    <input type="number" id="employment_period" placeholder="Employment Period" />
                    <input type="text" id="job_title" placeholder="Job Title" />
                    <input type="submit" value="Submit" className="submit-button" onClick={addEmploymentDetails}></input>
                    <p className="message"></p>
                </form>
            </div>
        </div >
    )
}

export default EmploymentForm