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

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='login' element={<Login />} />
          <Route path='signup' element={<Signup />} />
          <Route path='/applicant' element={<ApplicantForm />} />
          <Route path='/employment_details' element={<EmploymentForm />} />
          <Route path='/edu' element={<EducationDetails />} />
          <Route path='/recruiter' element={<RecruiterDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
