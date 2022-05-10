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

        var Job_c = {
            "engineering": "EN",
            "sales": "SA",
            "business": "BU",
            "entertainment": "ET",
            "food": "F",
            "other": "O"
        }

        var user_id = location.state.user_id
        var job_categories = Job_c[e.target.form[0].value]
        const formData = new FormData();
        formData.append("user_id", user_id);
        formData.append("job_categories", job_categories);

        console.log(job_categories);
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
    var options = ["Engineering", "Sales", "Business", "Entertainment", "Food", "Other"]
    return (
        <div className="login-page" >
            <div className="loginform">

                <form>
                    <lottie-player src="https://assets4.lottiefiles.com/datafiles/XRVoUu3IX4sGWtiC3MPpFnJvZNq7lVWDCa8LSqgS/profile.json" background="transparent" speed="1" style={{ justifyContent: 'center' }} loop autoplay></lottie-player>
                    {message != null ? <p className='text-red-600 font-bold mb-5'>{message}</p> : null}
                    <div className="flex flex-col text-left">
                        <label for="job_categories" className="mb-2 ml-1 text-sm">Select preferred job category</label>
                        <select id="job_categories" placeholder="Job Category" >
                            {options.map((data, index) => {
                                return (
                                    <option value={data.toLowerCase()}>
                                        {data}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                    <input type="submit" value="Submit" className="submit-button" onClick={addApplicantDetails}></input>
                    <p className="message"></p>
                </form>
            </div>
        </div >
    )
}

export default ApplicantForm
