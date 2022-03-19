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

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='login' element={<Login />} />
          <Route path='signup' element={<Signup />} />
          <Route path='/applicant' element={<ApplicantForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
