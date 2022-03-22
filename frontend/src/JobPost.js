import { useState, useEffect } from "react"
import { useParams } from 'react-router-dom'
import React from "react"
import axios from 'axios'

function JobPost(props) {
    const [data, setData] = useState(null)
    const [ready, setReady] = useState(false)
    const [skills, setSkills] = useState(null)
    const [apps, setApps] = useState(false)
    let params = useParams()
    console.log(params.id)
    useEffect(function () {
        axios.get("http://127.0.0.1:8000/api/job_posts/" + params.id).then(async function (d) {
            setData(d['data']);
            setSkills((d['data']['skills_required']).split(','));
            setReady(true)
            await axios.get("http://127.0.0.1:8000/api/application/user_id/" + localStorage.getItem('user_id')).then((d) => {
                var d = d.data;
                console.log(d)
                for (var i = 0; i < d.length; i++) {
                    if (d[i]['job_id']['id'] == params.id)
                        setApps(true)
                }
            })
        })
    }, []);

    return ready ? (
        <div style={{ paddingTop: "80px" }} className="flex flex-row">
            <div className="m-12 basis-3/5 text-left flex flex-col">
                <div className="jobpost flex flex-col text-left rounded-lg border-solid border-2 border-gray-400 p-10" >
                    <div className="text-3xl ">{data['job_title']}</div>
                    <div className="flex flex-row mt-5">
                        <div>{data['recruiter_id']['company_name']}</div>
                        <div className="ml-10 flex flex-row"><i className='fa-solid fa-location-dot mr-1 mt-1'></i><p>{data['location']}</p></div>
                        <div className="justify-self-end m-auto mr-0">{'Deadline: ' + data['application_deadline']}</div>
                    </div>
                </div>
                <div className="text-xl font-bold text-left mt-5">Job Description</div>
                <div className="mt-2">{data['job_description']} </div>
                <div className="text-xl font-bold text-left mt-5">Required Skills</div>
                <ol className="mt-2">
                    {
                        skills.map((d, i) => {
                            return (
                                <li key={i}>{d}</li>
                            )
                        })
                    }
                </ol>
            </div>
            <div className="basis-2/5 flex flex-col">
                <div className="joboverview text-left m-12 mb-5 p-8 border-2 border-gray-200">
                    <div className="text-xl font-bold">Job Overview</div>
                    <div className="text-md mt-2">Job Category: {data['job_category']}</div>
                    <div className="text-md mt-2">Location: {data['location']}</div>
                    <div className="text-md mt-2">Vacancy: {data['no_of_openings']}</div>
                    {!apps ? <button className="px-4 py-2 mt-4 bg-blue-700 text-white rounded-lg hover:bg-blue-900">Apply</button> : null}
                </div>
                <div className="companyInfo text-left mx-12 pt-0">
                    <div className="text-xl font-bold mb-5">Company Information</div>
                    <div className="text-lg font-semibold mb-4">{data['recruiter_id']['company_name']}</div>
                    <div className="mb-2">Company Website: <a className="text-blue-500 underline hover:text-blue-700" href={data['recruiter_id']['company_website']}>{data['recruiter_id']['company_website']}</a></div>
                    <div className="mb-2">{data['recruiter_id']['company_description']}</div>
                    <div className="text-lg font-semibold mb-4">Corporate Address</div>
                    <div>{data['recruiter_id']['corporate_address']}</div>
                </div>
            </div>
        </div >
    ) : <div><h1>Loading</h1></div>
}

export default JobPost