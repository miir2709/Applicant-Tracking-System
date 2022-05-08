import React from 'react';
import { Helmet } from "react-helmet";
import './assets/css/bootstrap.min.css'
import './assets/css/owl.carousel.min.css'
import './assets/css/flaticon.css'
import './assets/css/price_rangs.css'
import './assets/css/slicknav.css'
import './assets/css/animate.min.css'
import './assets/css/magnific-popup.css'
import './assets/css/fontawesome-all.min.css'
import './assets/css/themify-icons.css'
import './assets/css/slick.css'
import './assets/css/nice-select.css'
import './assets/css/style.css'
import atslogo from './assets/img/ATS Logo.png'

function Home() {
    return (
        <div>

            <div class="slider-area" style={{ backgroundColor: "white" }}>
                <div class="slider-active">
                    <div class="single-slider slider-height d-flex align-items-center">
                        <div class="container">
                            <div class="row mt-100">
                                <div class="col-xl-6 col-lg-9">
                                    <div class="hero__caption">
                                        <h1>Applicant Tracking System</h1>
                                    </div>
                                    <div>
                                        <h4><span>Make your job application process easier!</span></h4>
                                    </div>
                                </div>
                                <div class="col-xl-6" style={{bottom: '125px'}}>
                                    <img src={atslogo}></img>
                                </div>
                            </div>

                            <div class="apply-process-area apply-bg pb-10" data-background="assets/img/gallery/how-applybg.png">
                                <div class="row" style={{bottom: '50px'}}>
                                    <div class="col-lg-4 col-md-6">
                                        <div class="single-process text-center mb-30">
                                            <div class="process-ion">
                                                <span class="flaticon-search"></span>
                                            </div>
                                            <div class="process-cap">
                                                <h5>1. Search a job</h5>
                                                <p>Search your desired job based on job category and location of the company</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-4 col-md-6">
                                        <div class="single-process text-center mb-30">
                                            <div class="process-ion">
                                                <span class="flaticon-curriculum-vitae"></span>
                                            </div>
                                            <div class="process-cap">
                                                <h5>2. Apply for job</h5>
                                                <p>Fill the job application form and upload your Resume/CV for applying</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-4 col-md-6">
                                        <div class="single-process text-center mb-30">
                                            <div class="process-ion">
                                                <span class="flaticon-tour"></span>
                                            </div>
                                            <div class="process-cap">
                                                <h5>3. Get your job</h5>
                                                <p>Wait for notifications and results from the company</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            


            <Helmet>
                <script src="./assets/js/vendor/modernizr-3.5.0.min.js"></script>
                <script src="./assets/js/vendor/jquery-1.12.4.min.js"></script>
                <script src="./assets/js/popper.min.js"></script>
                <script src="./assets/js/bootstrap.min.js"></script>
                <script src="./assets/js/jquery.slicknav.min.js"></script>
                <script src="./assets/js/owl.carousel.min.js"></script>
                <script src="./assets/js/slick.min.js"></script>
                <script src="./assets/js/price_rangs.js"></script>
                <script src="./assets/js/wow.min.js"></script>
                <script src="./assets/js/animated.headline.js"></script>
                <script src="./assets/js/jquery.magnific-popup.js"></script>
                <script src="./assets/js/jquery.scrollUp.min.js"></script>
                <script src="./assets/js/jquery.nice-select.min.js"></script>
                <script src="./assets/js/jquery.sticky.js"></script>
                <script src="./assets/js/contact.js"></script>
                <script src="./assets/js/jquery.form.js"></script>
                <script src="./assets/js/jquery.validate.min.js"></script>
                <script src="./assets/js/mail-script.js"></script>
                <script src="./assets/js/jquery.ajaxchimp.min.js"></script>
                <script src="./assets/js/plugins.js"></script>
                <script src="./assets/js/main.js"></script>


            </Helmet>
        </div>
    )
}

export default Home