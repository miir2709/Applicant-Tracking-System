import { useState, useEffect } from "react"
import { useParams } from 'react-router-dom'
import React from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom";

function RecruiterJobPost(props) {
    var navigate = useNavigate()
    const [data, setData] = useState(null)
    const [ready, setReady] = useState(false)
    const [skills, setSkills] = useState(null)
    const [apps, setApps] = useState(null)
    const [appReady, setAppReady] = useState(false)
    let params = useParams()
    console.log(params.id)
    useEffect(async function () {
        await axios.get("http://127.0.0.1:8000/api/job_posts/rec/" + params.id).then((d) => {
            setData(d['data']);
            setSkills((d['data']['skills_required']).split(','));
            setReady(true)
        })
        await axios.get("http://127.0.0.1:8000/api/application/job_id/" + params.id).then((d) => {
            let as = d['data']
            var sortable = [];
            for (var a in as) {
                sortable.push(as[a]);
            }

            sortable.sort(function (a, b) {
                return b['similarity_score'] - a['similarity_score'];
            });
            console.log(d['data']);
            console.log(sortable)
            setApps(sortable)
            setAppReady(true)
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


    return ready && appReady ? (
        <div style={{ paddingTop: "80px" }}>
            <div className="flex flex-row my-10">
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
                    <div className="mt-2"><button type="button" class="btn btn-light"><a href={data['job_description_file']} download="job_description" target="_blank">View Job Description</a></button></div>
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
                        <div className="text-md mt-2">Job Category: {Job_c[data['job_category']]}</div>
                        <div className="text-md mt-2">Location: {data['location']}</div>
                        <div className="text-md mt-2">Vacancy: {data['no_of_openings']}</div>
                        <div className="text-md mt-2">Applications Received: {apps.length}</div>
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
            </div>
            <div className="applications">
                <div className="text-4xl mb-10"> Applications </div>
                {apps.map((data, index) => {
                    return (
                        <div className="border-2 border-gray-300 rounded-lg m-10 text-left p-4 flex flex-row hover:cursor-pointer hover:text-gray-300" onClick={() => navigate("/recruiter_app/" + data['id'], { state: { similarity_score: data['similarity_score'].toString().substring(0, 5) } })}>
                            <div className="basis-4/5">
                                <div className="text-3xl">{data['applicant_id']['user_id']['first_name'] + " " + data['applicant_id']['user_id']['last_name']}</div>
                                <div className="mt-2 text-lg">{"Application Status: " + data['application_status']}</div>
                                <div className="mt-2 text-lg">{"Applied at: " + data['application_date_time'].substring(0, 10)}</div>
                            </div>
                            <div className={"text-3xl justify-self-end basis-1/5 m-auto mr-0 text-blue-700"}>
                                {data['similarity_score'].toString().substring(0, 5)}
                            </div>
                            <div className={"text-3xl justify-self-end basis-1/5 m-auto mr-0" + (data['is_recommended'] == "Recommended" ? " text-green-700" : " text-red-700")}>
                                {data['is_recommended'].toString()}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div >
    ) : <div><h1>Loading</h1></div>
}

export default RecruiterJobPost
