import React from 'react';
import Profilepic from './assets/img/Profilepic.png';

function About(){
    return (
        <div>
    <div>

        <section className="background firstsection">
            <div className="box-main">
                <div className="firstHalf">
                    <p className="text-big">About US</p>
    
                    <p className="text-small">Team members of our project</p>                    
                    <br></br>
    
                </div>
            </div>
        </section>
  
        <section className="service">
            <h1 className="h-primary center" style={{textAlign:'center'}}>
                Our Team
            </h1>
            <div id="service">
                <div className="box">
                    <img src={Profilepic} alt="Profile Pic"/>
                    <br></br>
                        <p className="text-small" >
                            Kaushik Metha <br></br> 1811094 <br></br> kaushik.metha@somaiya.edu <br></br> Computer Engineering
                        </p>
                </div>
                <div className="box">
                    <img src={Profilepic} alt="Profile Pic"/>
                    <br></br>
                        <p className="text-small" >
                            Ayush Khade <br></br> 1811087 <br></br> ayush.khade@somaiya.edu <br></br> Computer Engineering
                        </p>  
                </div>
                <div className="box">
                    <img src={Profilepic} alt="Profile Pic"/>
                    <br></br>
                        <p className="text-small" >
                        Mihir Mehta <br></br> 1811093 <br></br> mihir.mehta2@somaiya.edu <br></br> Computer Engineering
                        </p>  
                </div>
                <div className="box">
                    <img src={Profilepic} alt="Profile Pic"/>
                    <br></br>
                        <p className="text-small" >
                        Saurabh Nambiar <br></br> 1811099 <br></br> saurabh.nambiar@somaiya.edu <br></br> Computer Engineering
                        </p>  
                </div>
            </div>
        </section>
        </div>
        </div>
    )
}

export default About