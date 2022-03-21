function Navbar(props) {
    return (
        <nav class="nav">
            <div id="mainListDiv" class="main_list">
                <ul class="navlinks">
                    <li><a href="/login"><i class="fa fa-user" aria-hidden="true"></i></a></li>
                    <li><a href="/">Home</a></li>
                    <li><a href="/jobs">Jobs</a></li>
                    <li><a href="#">Dashboard</a></li>
                    <li><a href="/about">About</a></li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar