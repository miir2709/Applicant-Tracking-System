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
            console.log(d['data'])
            setSkills((d['data']['skills_required']).split(','));
            setReady(true)
            await axios.get("http://127.0.0.1:8000/api/application/user_id/" + localStorage.getItem('user_id')).then((d) => {
                var d = d.data;
                for (var i = 0; i < d.length; i++) {
                    if (d[i]['job_id']['id'] == params.id)
                        setApps(true)
                }
            })
        })
    }, []);

    function toggleModal() {
        var modal = document.getElementById('submit-application-modal')
        modal.classList.contains('hidden') ? modal.classList.remove('hidden') : modal.classList.add('hidden')
    }

    async function submitApplication(e) {
        await axios.get("http://127.0.0.1:8000/api/applicant/user/" + localStorage.getItem('user_id'))
            .catch((e) => console.log(e))
            .then(async (dt) => {
                console.log(dt)
                var applicant_id = dt['data']['id']
                var job_id = data['id']
                var similarity_score = 0
                var application_status = "AP"
                var parsed_resume = ""
                var resume = e.target.form[0].files[0]
                var annotated_resume_filename = ""
                const formData = new FormData();
                console.log(data)
                formData.append("applicant_id", applicant_id)
                formData.append("job_id", job_id)
                formData.append("similarity_score", similarity_score)
                formData.append("application_status", application_status)
                formData.append("resume", resume)
                formData.append("parsed_resume", parsed_resume)
                formData.append("annotated_resume_filename", annotated_resume_filename)
                await axios.post("http://127.0.0.1:8000/api/application/", formData)
                    .catch((e) => console.error(e))
                    .then((data) => {
                        console.log(data)
                        window.location.href = "/applicant_dash"
                    })
            })

    }

    var Job_c = {
        "EN": "Engineering",
        "SA": "Sales",
        "BU": "Business",
        "ET": "Entertainment",
        "F": "Food",
        "O": "Other"
    }

    return ready ? (
        <div style={{ paddingTop: "80px" }} className="flex flex-row">
            <div id="submit-application-modal" class="fixed z-10 inset-0 overflow-y-auto hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div class="relative inline-block align-center bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div class="sm:flex sm:items-start">
                                <div class="mt-3 text-left sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Apply for Job</h3>
                                    <form>
                                        <div className="flex flex-row">
                                            <input id="application-resume" className="hidden mt-2" type="file" />
                                            <label for="application-resume" className="text-md mt-2 text-white rounded-xl p-2 bg-blue-500 hover:bg-blue-700">Upload Resume</label>
                                        </div>
                                        <button type="button" className="px-3 py-2 bg-green-500 rounded-xl ml-0 mt-2 mr-4 hover:bg-green-700" onClick={submitApplication}>Submit</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-row bg-gray-100 px-4 py-3">
                            <button type="button" className="px-3 py-2 bg-red-500 ml-3 rounded-xl hover:bg-red-700" onClick={toggleModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>



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
                <div className="mt-2"><button type="button" class="btn btn-light"><a href={data['job_description_file']} target="_blank">View Job Description</a></button></div>
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
                    {!apps ? <button className="px-4 py-2 mt-4 bg-blue-700 text-white rounded-lg hover:bg-blue-900" onClick={toggleModal}>Apply</button> : null}
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