import React, { useState } from 'react';
import "@lottiefiles/lottie-player";
import { Link } from "react-router-dom"
import axios from "axios";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function ApplicantForm(props) {
    const [message, setMessage] = useState(null)
    const location = useLocation()
    const navigate = useNavigate()
    console.log(location.state.user_id)
    async function addApplicantDetails(e) {
        e.preventDefault();
        var applicant_id = location.state.user_id
        var resume = e.target.form[0].files[0]
        var preferred_location = e.target.form[1].value
        var job_categories = e.target.form[2].value
        const formData = new FormData();
        formData.append("applicant_id", applicant_id);
        formData.append("resume", resume);
        formData.append("preferred_location", preferred_location);
        formData.append("job_categories", job_categories);

        console.log(formData)
        await axios.post("http://127.0.0.1:8000/api/applicant/", formData)
            .catch(e => {
                console.log(e.response)
            })
            .then(async function (data) {
                console.log(data)
                if (data.status === 201) {
                    navigate('/edu', { state: { applicant_id: data.data.id } })
                }
            })
    }

    return (
        <div className="login-page" >
            <div className="loginform">

                <form>
                    <lottie-player src="https://assets4.lottiefiles.com/datafiles/XRVoUu3IX4sGWtiC3MPpFnJvZNq7lVWDCa8LSqgS/profile.json" background="transparent" speed="1" style={{ justifyContent: 'center' }} loop autoplay></lottie-player>
                    {message != null ? <p className='text-red-600 font-bold mb-5'>{message}</p> : null}
                    <p className="text-left m-3 ml-1">Upload Resume</p>
                    <input id="resume" type="file" />
                    <input type="text" id="preferred_location" placeholder="Preferred Location" />
                    <input type="text" id="job_categories" placeholder="Job Category" />
                    <input type="submit" value="Submit" className="submit-button" onClick={addApplicantDetails}></input>
                    <p className="message"></p>
                </form>
            </div>
        </div >
    )
}

export default ApplicantForm