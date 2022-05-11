import { Document, Page } from 'react-pdf'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

function Application(props) {
    const params = useParams()
    const [app, setApp] = useState(null);
    const [ready, setReady] = useState(false);
    useEffect(async () => {
        await axios.get("http://127.0.0.1:8000/api/application/" + params.id)
            .catch((e) => console.log(e))
            .then((data) => {
                console.log(data['data'])
                setApp(data['data'])
                setReady(true)
            })
    }, [])

    var application_s =
    {
        "AP": "Applied",
        "RE": "Under Review",
        "SC": "Scheduled for Interview",
        "AC": "Accepted",
        "RJ": "Rejected",
        "PE": "Pending"
    }

    var Job_c = {
        "EN": "Engineering",
        "SA": "Sales",
        "BU": "Business",
        "ET": "Entertainment",
        "F": "Food",
        "O": "Other"
    }

    return (ready ? (
        <div style={{ paddingTop: "80px" }}>
            <div className="text-left m-10 mt-2">
                <div className="text-4xl font-bold italic">Application</div>
                <div className="flex flex-row">
                    <div className="applicantion-details my-3 basis-2/5">
                        <div className="application-status rounded-lg p-3 pr-1 bg-gray-200 max-w-xs">
                            <div className="text-md">Application Status</div>
                            <div className="text-4xl mt-2">{application_s[app['application_status']]}</div>
                        </div>
                        <div className="text-lg mt-3">Name: {app['applicant_id']['user_id']['first_name'] + " " + app['applicant_id']['user_id']['last_name']}</div>
                        <div className="text-lg mt-1">Application Date: {app['application_date_time'].substring(0, 10)}</div>
                        <div className="text-lg mt-1">Job Category: {Job_c[app['applicant_id']['job_categories']]}</div>
                    </div>
                    <div className="p-4 float-right rounded-lg bg-gray-200 text-left basis-3/5 mt-3 mx-5 ">
                        <div className="text-2xl mt-2 font-semibold">{app['job_id']['job_title']}</div>
                        <div className="text-lg mt-2">Company: {app['job_id']['recruiter_id']['company_name']}</div>
                        <div className="text-lg mt-2">Company Website: <a className="text-blue-500 underline hover:underline hover:text-blue-700" href={app['job_id']['recruiter_id']['company_website']}>{app['job_id']['recruiter_id']['company_website']}</a></div>
                        <div className="text-lg mt-2 font-semibold">Job Description</div>
                        <div className="mt-2"><button type="button" class="p-3 rounded-lg bg-blue-500 my-2 hover:bg-blue-700"><a href={app['job_id']['job_description_file']} target="_blank">View Job Description</a></button></div>
                        <div className="text-md mt-2">{app['job_id']['job_description']}</div>
                        <div className="text-md mt-2 font-bold">Location: </div><div>{app['job_id']['location']}</div>
                        <div className="text-md mt-2 font-bold">Vacancies: </div><div>{app['job_id']['no_of_openings']}</div>
                    </div>
                </div>
            </div>
        </div >
    ) : null)
}

export default Application
