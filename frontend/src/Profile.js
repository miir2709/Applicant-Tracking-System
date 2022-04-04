import axios from 'axios'
import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

function Profile() {
    var navigate = useNavigate()
    var location = useLocation()
    var params = useParams()
    const [user, setUser] = useState()
    const [ready, setReady] = useState(false)
    const [userDetails, setUserDetails] = useState()
    const [eduDetails, setEduDetails] = useState()
    const [empDetails, setEmpDetails] = useState()
    function getToken() {
        var token = localStorage.getItem('access_token')
        return token
    }

    useEffect(async () => {
        var user_id = params.id
        let config = {
            headers: {
                'Authorization': 'Bearer ' + getToken()
            }
        }
        console.log(config)
        await axios.get("http://127.0.0.1:8000/api/user/" + user_id, config)
            .catch(async (e) => {
                if (e.response.status == 401) {
                    await axios.post("http://127.0.0.1:8000/api/auth/refresh/", {
                        "refresh": localStorage.getItem("refresh_token")
                    })
                        .then(async (data) => {
                            localStorage.setItem('access_token', data['data']['access'])

                        })
                    return
                }
            })
            .then(async (data) => {
                setUser(data['data'])
                if (data['data']['user_type'] == "Recruiter") {
                    await axios.get("http://127.0.0.1:8000/api/recruiter/user/" + user_id)
                        .catch(e => console.log(e))
                        .then((data) => {
                            setUserDetails(data['data'])
                        })
                }
                else {
                    await axios.get("http://127.0.0.1:8000/api/applicant/user/" + user_id)
                        .catch(e => console.log(e))
                        .then(async (data) => {
                            setUserDetails(data['data'])
                            await axios.get("http://127.0.0.1:8000/api/edu/applicant/" + data['data']['id'])
                                .catch(e => console.log(e))
                                .then((data) => {
                                    setEduDetails(data['data'])
                                })
                            await axios.get("http://127.0.0.1:8000/api/employment_details/applicant/" + data['data']['id'])
                                .catch(e => console.log(e))
                                .then((data) => {
                                    setEmpDetails(data['data'])
                                })
                        })
                }
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

    var Degree = {
        "B": "Bachelors",
        "M": "Masters",
        "P": "PhD"
    }

    return ready ? (
        <div style={{ paddingTop: "80px" }}>
            <div className="mx-5 mt-3 mb-5 text-left">
                <div className="text-4xl font-bold">{user['first_name']}'s Profile</div>
                <div className="text-lg mt-2">Username: {user['username']}</div>
                <div className="text-lg mt-2">Name: {user['first_name'] + " " + user['last_name']}</div>
                <div className="text-lg mt-2">Email: {user['email']}</div>
                <div className="text-lg mt-2">Phone: {user['phone']}</div>
                <div className="text-lg mt-2">User Type: {user['user_type']}</div>
                {user['user_type'] === 'Recruiter' ?
                    <div className="recruiter-details">
                        <div className="text-lg mt-2">Company Name: {userDetails['company_name']}</div>
                        <div className="text-lg mt-2">Company Website: <a className="text-blue-500 underline hover:text-blue-700" href={userDetails['company_website']}>{userDetails['company_website']}</a></div>
                        <div className="text-lg mt-2 font-boldssssssssssss">Company Description: </div>
                        <div className="text-lg mt-1">{userDetails['company_description']}</div>
                        <div className="text-lg mt-2 font-bold">Corporate Address: </div>
                        <div className="text-lg mt-2 w-96">{userDetails['corporate_address']}</div>
                    </div> :
                    <div className="applicant-details">
                        <div className="text-lg mt-2">Preferred Job Category: {Job_c[userDetails['job_categories']]}</div>
                        <div className="text-2xl mt-2 font-bold">Education Details</div>
                        <div className="text-lg mt-2">University: {eduDetails['university']}</div>
                        <div className="text-lg mt-2">CGPA: {eduDetails['cgpa']}</div>
                        <div className="text-lg mt-2">Degree: {Degree[eduDetails['highest_degree']] + " in " + eduDetails['field_of_study']}</div>
                        <div className="text-lg mt-2">Graduation Year: {eduDetails['graduation_year']}</div>
                        <div className="text-2xl mt-2 font-bold">Employment Details</div>
                        <div className="text-lg mt-2">Employer Name: {empDetails['employer_name']}</div>
                        <div className="text-lg mt-2">Job Title: {empDetails['job_title']}</div>
                        <div className="text-lg mt-2">Employment Period: {empDetails['employment_period']} years</div>
                    </div>}
            </div>
        </div >
    ) : null
}

export default Profile;