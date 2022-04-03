import './App.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Home from './Home'
import Login from './Login'
import Signup from './Signup'
import ApplicantForm from './ApplicantForm'
import EmploymentForm from './EmploymentDetails'
import EducationDetails from './EducationDetails'
import RecruiterDetails from './RecruiterDetails'
import Navbar from './Navbar'
import Jobs from './Jobs'
import JobPost from './JobPost'
import RecruiterDashboard from './RecruiterDashboard'
import RecruiterJobs from './RecruiterJobs'
import ApplicantDashboard from './ApplicantDashboard'
import JobPostForm from './JobPostForm'
import Application from './Application'
import RecruiterApps from './RecruiterApps'


function App() {

  return (
    <Router>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='login' element={localStorage.getItem('user_id') == null ? < Login /> : null} />
          <Route path='signup' element={localStorage.getItem('user_id') == null ? <Signup /> : null} />
          <Route path='/applicant' element={< ApplicantForm />} />
          <Route path='/employment_details' element={<EmploymentForm />} />
          <Route path='/edu' element={<EducationDetails />} />
          <Route path='/recruiter' element={<RecruiterDetails />} />
          <Route path="/jobs" element={localStorage.getItem('user_type') == 'Applicant' && localStorage.getItem('user_id') != null ? <Jobs /> : null} />
          <Route path="/job_post/:id" element={localStorage.getItem('user_type') == 'Applicant' ? <JobPost /> : null} />
          <Route path='/recruiter_dash' element={localStorage.getItem('user_type') == 'Recruiter' && localStorage.getItem('user_id') != null ? <RecruiterDashboard /> : null} />
          <Route path='/recruiter_jobs/:id' element={localStorage.getItem('user_type') == 'Recruiter' && localStorage.getItem('user_id') != null ? <RecruiterJobs /> : null} />
          <Route path='/applicant_dash' element={localStorage.getItem('user_type') == 'Applicant' && localStorage.getItem('user_id') != null ? <ApplicantDashboard /> : null} />
          <Route path="/application/:id" element={localStorage.getItem('user_type') == "Applicant" && localStorage.getItem('user_id') != null ? <Application /> : null} />
          <Route path="/create_job" element={localStorage.getItem('user_type') == 'Recruiter' && localStorage.getItem('user_id') != null ? <JobPostForm /> : null} />
          <Route path="/recruiter_app/:id" element={localStorage.getItem('user_type') == 'Recruiter' && localStorage.getItem('user_id') != null ? <RecruiterApps /> : null} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
