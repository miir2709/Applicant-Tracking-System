import React, { useState } from 'react';
import "@lottiefiles/lottie-player";
import { Link } from "react-router-dom"
import axios from "axios";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function JobPostForm(props) {
    let skills_input = (
        <div id={"skill-input-0"} class="flex flex-row">
            <input type="text" placeholder="Skills Required" />
            <button class="px-3 max-h-12 align-middle rounded-3xl mx-2 bg-blue-500 hover:bg-blue-700" onClick={addSkill}>+</button>
        </div>
    )
    var Job_c = {
        "engineering": "EN",
        "sales": "SA",
        "business": "BU",
        "entertainment": "ET",
        "food": "F",
        "other": "O"
    }
    const [message, setMessage] = useState(null)
    const [SkillsInput, setSkillsInput] = useState([skills_input])
    var navigate = useNavigate()
    async function addJobPostDetails(e) {
        e.preventDefault();
        await axios.get("http://127.0.0.1:8000/api/recruiter/user/" + localStorage.getItem('user_id')).then(async (data) => {
            var recruiter_id = (data.data.id)
            var job_title = e.target.form[0].value
            var job_description_file = e.target.form[1].files[0]
            console.log(job_description_file)
            var parsed_job_description = ""
            var job_category = Job_c[e.target.form[2].value]
            var location = e.target.form[3].value
            var no_of_openings = e.target.form[4].value
            var application_deadline = e.target.form[5].value
            var skills_required = ""
            for (var i = 6; i < e.target.form.length - 1; i += 2) {
                if (i == e.target.form.length - 3)
                    skills_required += e.target.form[i].value
                else
                    skills_required += (e.target.form[i].value + ",")
            }

            const formData = new FormData();
            formData.append("recruiter_id", recruiter_id);
            formData.append("job_title", job_title);
            formData.append("job_description_file", job_description_file);
            formData.append("parsed_job_description", parsed_job_description)
            formData.append("job_category", job_category)
            formData.append("location", location)
            formData.append("no_of_openings", no_of_openings)
            formData.append("application_deadline", application_deadline)
            formData.append("skills_required", skills_required)

            console.log(skills_required)
                await axios.post("http://127.0.0.1:8000/api/job_posts/", formData)
                    .catch(e => {
                        console.log(e.response)
                    }).then(async function (data) {
                        console.log(data)
                        if (data.status === 201) {
                            navigate('/recruiter_dash')
                        }
                    })
        })
    }

    function addSkill(e) {
        e.preventDefault()
        var joined = [...SkillsInput,
        <div id={"skill-input-" + SkillsInput.length} class="flex flex-row">
            <input type="text" placeholder="Skills Required" />
            <button class="px-3 max-h-12 align-middle rounded-3xl mx-2 bg-blue-500 hover:bg-blue-700" onClick={addSkill}>+</button>
        </div>]
        console.log(joined)
        setSkillsInput(joined)
    }

    var options = ["Engineering", "Sales", "Business", "Entertainment", "Food", "Other"]

    return (
        <div className="login-page" >
            <div className="loginform">

                <form>
                    <lottie-player src="https://assets4.lottiefiles.com/datafiles/XRVoUu3IX4sGWtiC3MPpFnJvZNq7lVWDCa8LSqgS/profile.json" background="transparent" speed="1" style={{ justifyContent: 'center' }} loop autoplay></lottie-player>
                    <input type="text" id="job_title" placeholder="Job Title" />
                    <input type="file" id="job_description_file" placeholder='Upload Job Description' />
                    <select id="job_category" placeholder="Job Category" >
                        {options.map((data, index) => {
                            return (
                                <option value={data.toLowerCase()}>
                                    {data}
                                </option>
                            )
                        })}
                    </select>
                    <input type="text" id="location" placeholder="Location" />
                    <input type="number" id="no_of_openings" placeholder="No. of openings" />
                    <input type="date" id="application_deadline" placeholder="Application Deadline" />
                    {SkillsInput.map((data, index) => {
                        return data
                    })}
                    <input type="submit" value="Submit" className="submit-button" onClick={addJobPostDetails}></input>
                </form>
            </div>
        </div >
    )
}

export default JobPostForm