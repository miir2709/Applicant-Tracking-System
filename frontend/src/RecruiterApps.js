import { useState, useEffect } from "react"
import { useParams } from 'react-router-dom'
import React from "react"
import axios from 'axios'
import { useLocation } from "react-router-dom"

function RecruiterApps() {
    var params = useParams()
    const location = useLocation()
    const [app, setApp] = useState(null)
    const [edu, setEdu] = useState(null)
    const [emp, setEmp] = useState(null)
    const [ready, setReady] = useState(false)

    useEffect(async () => {
        await axios.get("http://127.0.0.1:8000/api/application/" + params.id)
            .catch((e) => console.log(e))
            .then(async (data) => {
                await axios.get("http://127.0.0.1:8000/api/edu/applicant/" + data['data']['applicant_id']['id'])
                    .catch(e => console.log(e))
                    .then((data) => {
                        setEdu(data['data'])
                    })

                await axios.get("http://127.0.0.1:8000/api/employment_details/applicant/" + data['data']['applicant_id']['id'])
                    .catch(e => console.log(e))
                    .then((data) => {
                        setEmp(data['data'])
                    })

                setApp(data['data'])
                setReady(true)
            })
    }, [])
    var Job_c = {
        "EN": "Engineering",
        "SA": "Sales",
        "BU": "Business",
        "ET": "Entertainment",
        "F": "Food",
        "O": "Other"
    }

    var edu_deg = {
        "B": "Bachelors",
        "M": "Masters",
        "P": "PhD"
    }

    function toggleResume(){
        if (document.getElementById('toggle').value === "View Annotated Resume"){
            document.getElementById('toggle').value = "View Resume"
            document.getElementById('text').innerHTML = "Annotated Resume"
            document.getElementById('resumepdf').src = "http://localhost:8000/media/" + app['annotated_resume_filename'].substring(8,app['annotated_resume_filename'].length)
        }
        else{
            document.getElementById('toggle').value = "View Annotated Resume"
            document.getElementById('resumepdf').src = app['resume']
            document.getElementById('text').innerHTML = "Resume"
        }
    }

    async function updateStatus(){
        var status = document.getElementById('app_status').value
        const formData = new FormData();
        formData.append("application_status", status)
        await axios.put("http://127.0.0.1:8000/api/application/" + app['id'] + "/", formData)
        .catch((e) => {
            console.log(e)
        })
        .then((data)=> {
            console.log(data)
            if(data.status == 200){
            	window.location.reload();
            }
        })
    }

    return ready ? (
        <div style={{ paddingTop: "80px" }} className="pb-50">
            <div className="text-4xl text-left ml-30 font-bold italic mb-20" >Application</div>
            <div className="ml-0 m-auto flex flex-row">
                <label for="app_status" className="text-lg mx-5 mt-6">Set Application Status</label>
                 <select id="app_status" className="p-3 text-lg h-20 max-w-lg" defaultValue={app['application_status']}>
                    <option value="AP">Applied</option>
                    <option value="RE">Under Review</option>
                    <option value="SC">Scheduled for Interview</option>
                    <option value="AC">Accepted</option>
                    <option value="RJ">Rejected</option>
                    <option value="PE">Pendings</option>
                </select>
                <button className="ml-3 px-3 h-20 mt-0 rounded-lg bg-blue-600 text-md text-white hover:bg-blue-800" onClick={updateStatus}>Submit</button>
            </div>
            <div className="text-left mx-10 flex flex-row m-5">
                <div className="basis-4/5">
                    <div className="text-xl">Applicant Name: {app['applicant_id']['user_id']['first_name'] + " " + app['applicant_id']['user_id']['last_name']}</div>
                    <div className="text-xl mt-2">Job Category: {Job_c[app['applicant_id']['job_categories']]}</div>
                    <div className="text-xl mt-2">Application Date: {app['application_date_time'].substring(0, 10)}</div>
                    <div className="text-xl mt-2">Email: {app['applicant_id']['user_id']['email']}</div>
                    <div className="text-xl mt-2">Phone: {app['applicant_id']['user_id']['phone']}</div>
                    <div className="bg-gray-300 w-max p-4 my-4 rounded-2xl">
                        <div className="font-bold">Similarity Score</div>
                        <div className="text-6xl mt-2 text-center text-blue-700">{location.state.similarity_score}</div>
                    </div>
                </div>
                <div className="p-5 bg-gray-300 h-max text-left rounded-2xl">
                    <div className="text-2xl font-bold">Education</div>
                    <div className="mt-2">{edu_deg[edu['highest_degree']]} in {edu['field_of_study']}</div>
                    <div className="mt-2">{edu['university']}</div>
                    <div className="mt-2">CGPA: {edu['cgpa']}</div>
                    <div className="mt-2">Graduated: {edu['graduation_year']}</div>
                    <div className="text-2xl font-bold mt-2">Employment</div>
                    <div className="mt-2">{emp['job_title']} at {emp['employer_name']}</div>
                    <div className="mt-2">Tenure: {emp['employment_period']} years</div>
                </div>
            </div>
            <div>
                <input type="button" value="View Annotated Resume" className="my-4 text-3xl font-bold text-green-600 hover:underline hover:text-green-800 hover:cursor-pointer" id="toggle" onClick={toggleResume}></input>
                <div className="my-4 text-3xl font-bold" id="text">Resume</div>
                <embed id="resumepdf" className="mb-10 m-auto" src={app['resume']} width="60%" height="800"
                    type="application/pdf" />
            </div>
        </div>
    ) : null;
}

export default RecruiterApps
