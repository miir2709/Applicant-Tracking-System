import { useState, useEffect } from "react"
import React from "react"
import axios from 'axios'

function ApplicationDashboard() {
    const [apps, setApps] = useState([])
    const [ready, setReady] = useState(false)
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/application/user_id/' + localStorage.getItem('user_id')).then((data) => {
            console.log(data.data)
            setApps(data.data)
            setReady(true)
        })
    }, [])

    function showApp(id) {
        window.location.href = "/application/" + id
    }

    return (ready ?
        <div style={{ paddingTop: "80px" }}>
            <div className="ml-12 mb-6 px-1">
                <div className="text-3xl font-bold text-left">Applications Submitted</div>
            </div>
            {apps.map((data, index) => {
                return (
                    <div className="flex flex-row text-left rounded-lg border-solid border-2 border-gray-400 mx-12 mb-12 p-4 hover:shadow-lg cursor-pointer" onClick={() => showApp(data['id'])}>
                        <div className="flex flex-col">
                            <div className="text-3xl hover:text-gray-300">{data['job_id']['job_title']}</div>
                            <div className="flex flex-row mt-3 mr-1">
                                <div>{data['job_id']['recruiter_id']['company_name']}</div>
                                <div className="ml-10 flex flex-row"><i className='fa-solid fa-location-dot mr-1 mt-1'></i><p>{data['job_id']['location']}</p></div>
                            </div>
                            <div className="">Applied at: {data['application_date_time'].substring(0, 10)}</div>
                        </div>
                        <div className="text-3xl m-auto mr-0">
                            {data['application_status']}
                        </div>
                    </div>
                )
            })}
        </div > : null
    )
}

export default ApplicationDashboard