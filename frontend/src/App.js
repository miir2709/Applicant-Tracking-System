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

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='login' element={<Login />} />
          <Route path='signup' element={<Signup />} />
          <Route path='/applicant' element={localStorage.getItem('user_type') == 'Applicant' && localStorage.getItem('user_id') === null ? < ApplicantForm /> : null} />
          <Route path='/employment_details' element={localStorage.getItem('user_type') == 'Applicant' && localStorage.getItem('user_id') === null ? <EmploymentForm /> : null} />
          <Route path='/edu' element={localStorage.getItem('user_type') == 'Applicant' && localStorage.getItem('user_id') === null ? <EducationDetails /> : null} />
          <Route path='/recruiter' element={localStorage.getItem('user_type') == 'Recruiter' && localStorage.getItem('user_id') == null ? <RecruiterDetails /> : null} />
          <Route path="/jobs" element={localStorage.getItem('user_type') == 'Applicant' ? <Jobs /> : null} />
          <Route path="/job_post/:id" element={localStorage.getItem('user_type') == 'Applicant' ? <JobPost /> : null} />
          <Route path='/recruiter_dash' element={localStorage.getItem('user_type') == 'Recruiter' && localStorage.getItem('user_id') != null ? <RecruiterDashboard /> : null} />
          <Route path='/recruiter_jobs/:id' element={localStorage.getItem('user_type') == 'Recruiter' && localStorage.getItem('user_id') != null ? <RecruiterJobs /> : null} />
          <Route path='/applicant_dash' element={localStorage.getItem('user_type') == 'Applicant' && localStorage.getItem('user_id') != null ? <ApplicantDashboard /> : null} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
