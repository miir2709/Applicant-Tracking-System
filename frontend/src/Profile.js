
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {Helmet} from "react-helmet";


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
        <div className="container emp-profile">
            <div className='profile-div'>
                <div className="row">
                    <div className="col-md-12">
                        <div className="profile-head">
                                    <h1>
                                        {user['first_name']}'s Profile
                                    </h1>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">

                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Username</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>{user['username']}</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Name</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>{user['first_name'] + " " + user['last_name']}</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Email</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>{user['email']}</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Phone</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>{user['phone']}</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Account Type</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>{user['user_type']}</p>
                                            </div>
                                        </div>
                                        {user['user_type'] === 'Recruiter' ?
                                        <div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label><h1>Company Details</h1></label>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label>Company Name</label>
                                                </div>
                                                <div className="col-md-6">
                                                    <p>{userDetails['company_name']}</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label>Company Website</label>
                                                </div>
                                                <div className="col-md-6">
                                                    <p><a style={{ color: 'blue' }} classNameName="text-blue-500 underline hover:text-blue-700" href={userDetails['company_website']}>{userDetails['company_website']}</a></p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label>Company Description</label>
                                                </div>
                                                <div className="col-md-6">
                                                    <p>{userDetails['company_description']}</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label>Corporate Address</label>
                                                </div>
                                                <div className="col-md-6">
                                                    <p>{userDetails['corporate_address']}</p>
                                                </div>
                                            </div>
                                        </div> :
                                        <div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label>Preferred Job Category</label>
                                                </div>
                                                <div className="col-md-6">
                                                    <p>{Job_c[userDetails['job_categories']]}</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label><h1>Education History</h1></label>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label>University</label>
                                                </div>
                                                <div className="col-md-6">
                                                    <p>{eduDetails['university']}</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label>CGPA</label>
                                                </div>
                                                <div className="col-md-6">
                                                    <p>{eduDetails['cgpa']}</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label>Degree</label>
                                                </div>
                                                <div className="col-md-6">
                                                    <p>{Degree[eduDetails['highest_degree']] + " in " + eduDetails['field_of_study']}</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label>Graduation Year</label>
                                                </div>
                                                <div className="col-md-6">
                                                    <p>{eduDetails['graduation_year']}</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label><h1>Employment History</h1></label>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label>Employer Name</label>
                                                </div>
                                                <div className="col-md-6">
                                                    <p>{empDetails['employer_name']}</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label>Job Title</label>
                                                </div>
                                                <div className="col-md-6">
                                                    <p>{empDetails['job_title']}</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <label>Employment Period</label>
                                                </div>
                                                <div className="col-md-6">
                                                    <p>{empDetails['employment_period']} years</p>
                                                </div>
                                            </div>
                                        </div>}
                            </div>
                            </div>
                </div>
        </div>
    ) : null

    }

export default Profile