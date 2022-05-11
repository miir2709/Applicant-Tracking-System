import React, { useState } from 'react';
import "@lottiefiles/lottie-player";
import { Link } from "react-router-dom"
import axios from "axios";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function EducationDetails(props) {
    const [message, setMessage] = useState(null)
    const location = useLocation()
    const navigate = useNavigate()
    console.log(location.state.applicant_id)
    async function addEducationDetails(e) {
        e.preventDefault();
        var applicant_id = location.state.applicant_id
        var highest_degree = e.target.form[0].value
        var cgpa = e.target.form[1].value
        var graduation_year = e.target.form[2].value
        var university = e.target.form[3].value
        var field_of_study = e.target.form[4].value
        const formData = new FormData();
        formData.append("applicant_id", applicant_id);
        formData.append("highest_degree", highest_degree);
        formData.append("cgpa", cgpa);
        formData.append("graduation_year", graduation_year);
        formData.append("university", university);
        formData.append("field_of_study", field_of_study);

        await axios.post("http://127.0.0.1:8000/api/edu/", formData)
            .catch(e => {
                console.log(e.response)
            })
            .then(async function (data) {
                if (data.status === 201) {
                    navigate('/employment_details', { state: { applicant_id: location.state.applicant_id } })
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
                        <label for="highest_degree" className="mb-2 ml-1 text-sm">Highest degree</label>
                        <select id="highest_degree" type="text" placeholder="Highest Degree" >
                            <option value="S">Select Highest Degree</option>
                            <option value="B">Bachelors</option>
                            <option value="M">Masters</option>
                            <option value="PHD">PhD</option>
                        </select>
                    </div>
                    <div className="flex flex-col text-left">
                        <label for="cgpa" className="mb-2 ml-1 text-sm">CGPA</label>
                        <input type="number" required name="cgpa" min="0" placeholder="CGPA" step=".01" />
                    </div>
                    <div className="flex flex-col text-left">
                        <label for="graduation_year" className="mb-2 ml-1 text-sm">Graduation Year</label>
                        <input type="number" id="graduation_year" placeholder="Graduation Year" />
                    </div>
                    <div className="flex flex-col text-left">
                        <label for="university" className="mb-2 ml-1 text-sm">University</label>
                        <input id="university" type="text" placeholder="University Name" />
                    </div>
                    <div className="flex flex-col text-left">
                        <label for="field_of_study" className="mb-2 ml-1 text-sm">Field of Study</label>
                        <input id="field_of_study" type="text" placeholder="Field of study" />
                    </div>
                    <input type="submit" value="Submit" className="submit-button" onClick={addEducationDetails}></input>
                    <p className="message"></p>
                </form>
            </div>
        </div >
    )
}

export default EducationDetails
