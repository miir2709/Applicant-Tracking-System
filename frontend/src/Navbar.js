import React from 'react'

function Navbar(props) {
    function Logout() {
        localStorage.removeItem('user_id')
        localStorage.removeItem('user_type')
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = "/login"
    }
    return (
        <nav className="nav w-screen">
            <div id="mainListDiv" class="main_list">
                <ul class="navlinks">
                    <li><a href="/login"><i class="fa fa-user" aria-hidden="true"></i></a></li>
                    <li><a href="/">Home</a></li>
                    {localStorage.getItem('user_type') == 'Applicant' ? <li><a href="/jobs">Jobs</a></li> : null}
                    <li><a href={localStorage.getItem('user_type') == null ? "/login" : localStorage.getItem('user_type') == 'Applicant' ? "/applicant_dash" : "/recruiter_dash"}>Dashboard</a></li>
                    <li><a href="/about">About</a></li>
                </ul>
            </div>
            {localStorage.getItem('user_id') != null ? <button className="text-white m-auto mr-0 bg-red-700 p-2 rounded-md hover:bg-red-900" onClick={Logout}>Logout</button> : null}
        </nav>
    )
}

export default Navbar