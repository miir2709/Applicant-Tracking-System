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

    return (ready ? (
        <div style={{ paddingTop: "80px" }}>
            <div className="text-left m-10 mt-2">
                <div className="text-4xl font-bold italic">Application</div>
                <div className="flex flex-row">
                    <div className="applicantion-details my-3 basis-3/5">
                        <div className="application-status rounded-lg p-3 pr-1 bg-gray-200">
                            <div className="text-md">Application Status</div>
                            <div className="text-4xl mt-2">{app['application_status']}</div>
                        </div>
                        <div className="text-lg mt-3">Name: {app['applicant_id']['user_id']['first_name'] + " " + app['applicant_id']['user_id']['last_name']}</div>
                        <div className="text-lg">Application Date: {app['application_date_time'].substring(0, 10)}</div>
                    </div>
                    <div className="p-5 float-right rounded-lg bg-gray-200 text-left basis-2/5 mt-3 mx-5 ">
                        <div>Job description</div>
                    </div>
                </div>
            </div>
        </div >
    ) : null)
}

export default Application