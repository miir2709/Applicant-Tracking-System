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
                    .catch((e) => {
                        console.log(e)
                        localStorage.removeItem('user_id')
                        localStorage.removeItem('user_type')
                        localStorage.removeItem('access_token')
                        localStorage.removeItem('refresh_token')
                        window.location.href = "/login"
                    })
                    .then(async (data) => {
                            localStorage.setItem('access_token', data['data']['access'])
                        })
                    window.location.reload()
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

    function toggleModal() {
        var modal = document.getElementById('edit-profile-modal')
        modal.classList.contains('hidden') ? modal.classList.remove('hidden') : modal.classList.add('hidden')
    }
    async function updateProfile(e){
        e.preventDefault()
        var email = e.target.form[0].value
        var phone = e.target.form[1].value
        const formData = new FormData()
        formData.append("email", email)
        formData.append("phone", phone)
        var user_id = params.id
        let config = {
            headers: {
                'Authorization': 'Bearer ' + getToken()
            }
        }
        console.log(config)
        await axios.patch("http://127.0.0.1:8000/api/user/" + user_id + "/", formData, config)
            .catch(async (e) => {
                if (e.response.status == 401) {
                    await axios.post("http://127.0.0.1:8000/api/auth/refresh/", {
                        "refresh": localStorage.getItem("refresh_token")
                    })
                    .catch((e) => {
                        console.log(e)
                        localStorage.removeItem('user_id')
                        localStorage.removeItem('user_type')
                        localStorage.removeItem('access_token')
                        localStorage.removeItem('refresh_token')
                        window.location.href = "/login"
                    })
                    .then(async (data) => {
                            localStorage.setItem('access_token', data['data']['access'])
                            window.location.reload()
                        })
                }
            }).then(async (data) => {
                console.log(data)
            })
        if(user['user_type'] == 'Recruiter'){
            var website = e.target.form[2].value;
            var desc = e.target.form[3].value
            var addr = e.target.form[4].value
            const recFormData = new FormData()
            recFormData.append("company_website", website)
            recFormData.append("company_description", desc)
            recFormData.append("corporate_address", addr)
            await axios.patch("http://127.0.0.1:8000/api/recruiter/user/" + user.id + "/", recFormData)
            .catch(e => console.log(e))
            .then((data) => {
                console.log(data)
                window.location.reload()
            })
        }
        else{
            var uni = e.target.form[2].value
            var cgpa = e.target.form[3].value
            var graduation_year = e.target.form[4].value
            var job_title = e.target.form[5].value
            var emp_name = e.target.form[6].value
            var emp_period = e.target.form[7].value
            const eduFormData = new FormData()
            eduFormData.append("university", uni)
            eduFormData.append("graduation_year", graduation_year)
            eduFormData.append("cgpa",cgpa)
            const empFormData = new FormData()
            empFormData.append("job_title", job_title)
            empFormData.append("employer_name", emp_name)
            empFormData.append("employment_period",emp_period)
            empFormData.append("applicant_id", userDetails['id'])

            await axios.patch("http://127.0.0.1:8000/api/edu/applicant/" + userDetails['id'] + "/", eduFormData)
                .catch(e => console.log(e))
                .then((data) => {
                    console.log(data)
                })
            console.log(job_title, emp_period)
            await axios.put("http://127.0.0.1:8000/api/employment_details/applicant/" + userDetails['id'] + "/", empFormData)
                .catch(e => console.log(e))
                .then((data) => {
                    console.log(data)
                    window.location.reload()
                })
        }
    }
    return ready ? (
        <div className="bg-gray-200 min-h-screen">
            <div id="edit-profile-modal" class="fixed z-10 inset-0 overflow-y-auto hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div class="relative inline-block align-center bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
                        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div class="sm:flex sm:items-start w-full">
                                <div class="mt-3 text-left sm:mt-0 sm:ml-4 sm:text-left">
                                    <h2 class="text-lg leading-6 font-large text-2xl text-gray-900" id="modal-title">Update Profile</h2>
                                    <form className="mt-4">
                                        <div className="flex flex-col my-2">
                                            <label for="emailEdit" className="mr-12">Email</label>
                                            <input id="emailEdit" type="email" defaultValue={user.email}  className="p-2 bg-gray-200 rounded-lg w-96"/>
                                        </div>
                                        <div className="flex flex-col my-2">
                                            <label for="phoneEdit" className="mr-9">Phone</label>
                                            <input id="phoneEdit" type="text" defaultValue={user.phone} className="p-2 bg-gray-200 rounded-lg w-96"/>
                                        </div>
                                        {user['user_type'] === 'Recruiter' ?
                                        <div>
                                            <div className="flex flex-col my-2">
                                                <label for="websiteEdit" className="mr-3">Company website</label>
                                                <input id="websiteEdit" type="url" defaultValue={userDetails.company_website} className="p-2 bg-gray-200 rounded-lg w-96"/>
                                            </div>
                                            <div className="flex flex-col my-2">
                                                <label for="descriptionEdit" className="mr-3">Company Description</label>
                                                <input id="descriptionEdit" type="text" defaultValue={userDetails.company_description} className="p-2 bg-gray-200 rounded-lg w-96"/>
                                            </div>
                                            <div className="flex flex-col my-2">
                                                <label for="addressEdit" className="mr-3">Corporate Address</label>
                                                <input id="addressEdit" type="text" defaultValue={userDetails.corporate_address} className="p-2 bg-gray-200 rounded-lg w-96"/>
                                            </div>
                                        </div>
                                        :
                                        <div>
                                            <div className="flex flex-col my-2">
                                                <label for="uni" className="mr-3">University</label>
                                                <input id="uni" type="url" defaultValue={eduDetails.university} className="p-2 bg-gray-200 rounded-lg w-96"/>
                                            </div>
                                            <div className="flex flex-col my-2">
                                                <label for="cgpa" className="mr-3">CGPA</label>
                                                <input id="cgpa" type="number" defaultValue={eduDetails.cgpa} className="p-2 bg-gray-200 rounded-lg w-96"/>
                                            </div>
                                            <div className="flex flex-col my-2">
                                                <label for="gradYear" className="mr-3">Graduation Year</label>
                                                <input id="gradYear" type="number" defaultValue={eduDetails.graduation_year} className="p-2 bg-gray-200 rounded-lg w-96"/>
                                            </div>
                                            <div className="flex flex-col my-2">
                                                <label for="jobTitle" className="mr-3">Job Title</label>
                                                <input id="jobTitle" type="text" defaultValue={empDetails.job_title} className="p-2 bg-gray-200 rounded-lg w-96"/>
                                            </div>
                                            <div className="flex flex-col my-2">
                                                <label for="empName" className="mr-3">Employer Name</label>
                                                <input id="empName" type="text" defaultValue={empDetails.employer_name} className="p-2 bg-gray-200 rounded-lg w-96"/>
                                            </div>
                                            <div className="flex flex-col my-2">
                                                <label for="empPeriod" className="mr-3">Employment Period</label>
                                                <input id="empPeriod" type="number" defaultValue={empDetails.employment_period} className="p-2 bg-gray-200 rounded-lg w-96"/>
                                            </div>
                                        </div>
                                        }
                                        <button type="button" className="px-3 py-2 bg-green-500 rounded-xl ml-0 mt-2 mr-4 hover:bg-green-700" onClick={updateProfile}>Update</button>
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
            <div className="container emp-profile">
                <button className="p-3 bg-blue-500 mb-4 rounded-lg hover:bg-blue-700" onClick={toggleModal}>Update Profile</button>
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
        </div>
    ) : null

    }

export default Profile
