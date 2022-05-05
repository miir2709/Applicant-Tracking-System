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
                    <li><a href={localStorage.getItem('user_id') != null ? "/profile/" + localStorage.getItem('user_id') : "/login"}><i className="fa fa-user mr-3" aria-hidden="true"></i>{localStorage.getItem('user_id') == null ? "Login" : "Profile"}</a></li>
                    <li><a href="/">Home</a></li>
                    {localStorage.getItem('user_type') == 'Applicant' ? <li><a href="/jobs">Jobs</a></li> : null}
                    <li><a href={localStorage.getItem('user_id') == null ? "/login" : localStorage.getItem('user_type') == 'Applicant' ? "/applicant_dash" : "/recruiter_dash"}>Dashboard</a></li>
                    <li><a href="/about">About</a></li>
                </ul>
            </div>
            {localStorage.getItem('user_id') != null ? <button className="text-white bg-red-700 p-2 rounded-md hover:bg-red-900" id="logoutbutton" onClick={Logout}>Logout</button> : null}
        </nav>
    )
}

export default Navbar
