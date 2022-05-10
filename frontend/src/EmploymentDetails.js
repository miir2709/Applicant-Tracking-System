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
            .then(function (data) {
                if (data.status === 201) {
                    window.location.href = "/login"
                }
            })
    }

    return (
        <div className="login-page" >
            <div className="loginform">

                <form>
                    <lottie-player src="https://assets4.lottiefiles.com/datafiles/XRVoUu3IX4sGWtiC3MPpFnJvZNq7lVWDCa8LSqgS/profile.json" background="transparent" speed="1" style={{ justifyContent: 'center' }} loop autoplay></lottie-player>
                    {message != null ? <p className='text-red-600 font-bold mb-5'>{message}</p> : null}
                    <div className="flex flex-col text-left">
                        <label for="employer_name" className="mb-2 ml-1 text-sm">Employer Name</label>
                        <input type="text" id="employer_name" placeholder="Employer Name" />
                    </div>
                    <div className="flex flex-col text-left">
                        <label for="employment_period" className="mb-2 ml-1 text-sm">Employment Period</label>
                        <input type="number" id="employment_period" placeholder="Employment Period" />
                    </div>
                    <div className="flex flex-col text-left">
                        <label for="job_title" className="mb-2 ml-1 text-sm">Job Title</label>
                        <input type="text" id="job_title" placeholder="Job Title" />
                    </div>
                    <input type="submit" value="Submit" className="submit-button" onClick={addEmploymentDetails}></input>
                    <button className="bg-blue-600 py-3 text-md px-7 mt-2 rounded-3xl hover:bg-blue-700" onClick={(e) => { e.preventDefault(); window.location.href = "/login"; }}>Skip (for Recent Graduates)</button>
                    <p className="message"></p>
                </form>
            </div>
        </div >
    )
}

export default EmploymentForm
