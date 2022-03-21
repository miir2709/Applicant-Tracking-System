import { useState, useEffect } from "react"
import React from "react"
import axios from 'axios'

function Jobs(props) {
    const [jobPosts, setJobPosts] = useState([])
    useEffect(async function () {
        let resp;
        await axios.get('http://127.0.0.1:8000/api/job_posts/').then((data) => {
            resp = (data['data'])
        })
        console.log(resp)
        setJobPosts(resp)
    }, [])

    function showJob(id) {
        window.location.href = "/job_post/" + id
    }

    return (
        <div style={{ paddingTop: "80px" }}>
            {jobPosts.map((data, index) => {
                let skills = data['skills_required'].split(',')
                console.log(skills)
                return (
                    <div className="jobpost flex flex-col text-left rounded-lg border-solid border-2 border-gray-400 m-12 p-10 hover:shadow-lg cursor-pointer" onClick={() => showJob(data['id'])}>
                        <div className="text-3xl hover:text-gray-300">{data['job_title']}</div>
                        <div className="flex flex-row mt-5">
                            <div>{data['recruiter_id']['company_name']}</div>
                            <div className="ml-10 flex flex-row"><i className='fa-solid fa-location-dot mr-1 mt-1'></i><p>{data['location']}</p></div>
                            <div className="justify-self-end m-auto mr-0">{'Deadline: ' + data['application_deadline']}</div>
                        </div>
                    </div>
                )
            })}
        </div >
    )
}

export default Jobs