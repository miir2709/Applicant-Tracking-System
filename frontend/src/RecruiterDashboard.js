import { useState, useEffect } from "react"
import React from "react"
import axios from 'axios'

function RecruiterDashboard() {
    const [jobs, setJobs] = useState([])
    const [ready, setReady] = useState(false)
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/job_posts/user/' + localStorage.getItem('user_id')).then((data) => {
            console.log(data.data)
            setJobs(data.data)
            setReady(true)
        })
    }, [])

    function showJob(id) {
        window.location.href = "/recruiter_jobs/" + id
    }

    return (
        <div style={{ paddingTop: "80px" }}>
            <div className="m-3 pb-12">
                <div className="text-4xl text-left px-4 py-2 float-left">Your Job Posts</div>
                <a className="mr-5 my-2 text-md text-white bg-blue-500 p-2 rounded-md float-right hover:bg-blue-700 cursor-pointer" href="/create_job">Add Job Post</a>
            </div>
            <div>
                {jobs.map((data, index) => {
                    let skills = data['skills_required'].split(',')
                    console.log(skills)
                    return (
                        <div className="jobpost justify-self-start flex flex-col text-left rounded-lg border-solid border-2 border-gray-400 m-12 p-4 hover:shadow-lg cursor-pointer" onClick={() => showJob(data['id'])}>
                            <div className="text-3xl hover:text-gray-300">{data['job_title']}</div>
                            <div className="flex flex-row mt-3 mr-1">
                                <div>{data['recruiter_id']['company_name']}</div>
                                <div className="ml-10 flex flex-row"><i className='fa-solid fa-location-dot mr-1 mt-1'></i><p>{data['location']}</p></div>
                                <div className=" m-auto mr-0">{'Deadline: ' + data['application_deadline']}</div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div >
    )
}

export default RecruiterDashboard