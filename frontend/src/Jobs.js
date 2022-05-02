import { useState, useEffect } from "react"
import React from "react"
import axios from 'axios'

function Jobs(props) {
    const [jobPosts, setJobPosts] = useState([])
    const [filters, setFilters] = useState({"category": null, "location": null, "searchCriteria": null})
    const [locations, setLocations] = useState([]);
    const [search, setSearch] = useState("");
    var job_c = {
        "EN": "engineering",
        "SA": "sales",
        "BU": "business",
        "ET": "entertainment",
        "F": "food",
        "O": "other"
    }
    useEffect(async function () {
        let resp;
        await axios.get('http://127.0.0.1:8000/api/job_posts/').then((data) => {
            resp = (data['data'])
        })
        var locationList = []
        console.log(resp)
        setJobPosts(resp)
        for(var i = 0; i < resp.length; i++) {
            locationList.push(resp[i]['location'])
        }
        locationList = [...new Set(locationList)]
        setLocations(locationList)
        setFilters({"category": job_c[resp[0].job_category], "location": resp[0].location.toLowerCase(), "searchCriteria": "position"})
    }, [])
    function showJob(id) {
        window.location.href = "/job_post/" + id
    }

    return (
        <div style={{ paddingTop: "80px" }}>
            <div className="max-width bg-gray-300 pt-4 pb-2 px-3 flex flex-row mx-4 mt-3 rounded-xl">
                <select name="category" className="mx-5 basis-1/6" onChange={(e) => setFilters({"category": e.target.value, "location": filters.location, "searchCriteria": filters.searchCriteria})}>
                    <option value="engineering">Engineering</option>
                    <option value="sales">Sales</option>
                    <option value="business">Business</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="other">Other</option>
                </select>
                <select className="mr-5 basis-1/6" onChange={(e) => setFilters({"category": filters.category, "location": e.target.value.toLowerCase(), "searchCriteria": filters.searchCriteria})}>{
                    locations.map((data, index) => {
                        return <option value={data.toLowerCase()}>{data}</option>
                    })
                }
                </select>
                <input type="text" id="searchBox" placeholder="Search by position or company" className="mr-2 mb-3 p-1 rounded-lg basis-3/5" onChange={(e) => setSearch(e.target.value.toLowerCase())}/>
                <select className="max-w-fit" onChange={(e) => setFilters({"category":filters.category, "location":filters.location, "searchCriteria": e.target.value.toLowerCase()})}>
                    <option value="position">Position</option>
                    <option value="company">Company</option>
                </select>
            </div>
            {jobPosts.map((data, index) => {
                let skills = data['skills_required'].split(',')
                console.log(filters, data)
                if((filters.category == job_c[data['job_category']] && filters.location == data['location'].toLowerCase()) && (filters.searchCriteria == "position" ? data['job_title'].toLowerCase().includes(search) : data['recruiter_id']['company_name'].toLowerCase().includes(search) ))
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
