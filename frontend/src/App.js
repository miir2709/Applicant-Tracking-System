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

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='login' element={<Login />} />
          <Route path='signup' element={<Signup />} />
          <Route path='/applicant' element={<ApplicantForm />} />
          <Route path='/employment_details' element={<EmploymentForm />} />
          <Route path='/edu' element={<EducationDetails />} />
          <Route path='/recruiter' element={<RecruiterDetails />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/job_post/:id" element={<JobPost />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
