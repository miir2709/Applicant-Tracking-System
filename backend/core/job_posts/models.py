from django.db import models
from core.recruiter.models import RecruiterDetails
from django.core.validators import MaxValueValidator, MinValueValidator
from core.Resume_Parser.Parser import jd_result_wrapper, process
from core.applicant.models import ApplicantDetails
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


def send_emails(job_post):
    applicants = ApplicantDetails.applicant_objects.all()
    email_ids = []
    names = []
    for app in applicants:
        if app.user_id.email in ['kaushikmetha7@gmail.com', 'metkaushik10@gmail.com']:
            email_ids.append(app.user_id.email)
            names.append(app.user_id.first_name)
    EMAIL_ADDRESS = "c10lyp.ats@gmail.com"
    EMAIL_PASSWORD = "lyproject@10ats"
    SUBJECT = f"{job_post.job_title} at {job_post.recruiter_id.company_name}".upper()
    for name, RECEIVER in zip(names, email_ids):
 #       msg = f"Job Title: {job_post.job_title}\n\nJob Category:  {job_post.job_category} \nLocation:  {job_post.location} \n    Vacancy: {job_post.no_of_openings} \n    Deadline: {job_post.application_deadline}"
        BODY = f"""
        <div style="box-sizing:border-box;min-width:640px;width:100%;">
            <div style="width:640px;margin:auto;border:1px solid #dddddd;border-radius:8px;">
                <div style="height:118px;box-sizing:border-box;padding-top:16px;text-align:center;">
                    <img alt="Applicant Tracking System" src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.shutterstock.com%2Fsearch%2Fjob%2Bvacancy&psig=AOvVaw0nqTEyAg_27u7WAJAcE0cA&ust=1651398874368000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCLD37bXCu_cCFQAAAAAdAAAAABAK" style="max-height:44px;max-width:262px;display:block;margin:auto;" class="CToWUd">
                    <hr style="width:262px;margin:8px auto;border:none;border-top:1px solid #dddddd;">
                </div>
                <div>
                    <div style="text-align: center;">
                        <p>APPLY NOW!!</p>
                    </div>
                    <div>
                        <h4>{job_post.job_title}</h4><span>Category: {job_post.job_category}</span><br>
                        <h6>At {job_post.recruiter_id.company_name}, Location: {job_post.location}</h6>
                        <p><b>{job_post.recruiter_id.company_name}</b> is offering the position of <b>{job_post.job_title}</b>. <br>
                            The deadline to apply is <i>{job_post.application_deadline}</i> and the total number of openings are <b>{job_post.no_of_openings}</b><br>

                        </p>
                    </div>
                </div>        
            </div>
        </div>

        """

        MESSAGE = MIMEMultipart('alternative')
        MESSAGE['subject'] = SUBJECT
        MESSAGE['To'] = RECEIVER
        MESSAGE['From'] = EMAIL_ADDRESS
        MESSAGE.preamble = """
            Hello
        """

        HTML_BODY = MIMEText(BODY, 'html')
        MESSAGE.attach(HTML_BODY)

        with smtplib.SMTP('smtp.gmail.com', 587) as smtp:
            smtp.ehlo()
            smtp.starttls()
            smtp.ehlo()
            smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            smtp.sendmail(EMAIL_ADDRESS, [RECEIVER], MESSAGE.as_string())


def Parse(job_description):
    text = jd_result_wrapper(job_description)
    text = process(text['skills'])
    return text


class JobPosts(models.Model):
    class JobCategory(models.TextChoices):
        ENGG = 'EN', "Engineering"
        SALES = 'SA', "Sales"
        BUSINESS = 'BU', "Business"
        ENTERTAINMENT = "ET","Entertainment"
        FOOD = "F","Food"
        OTHER ="O","Other"
    class JobPostsObjects(models.Manager):
        def get_queryset(self):
            return super().get_queryset()

        def create_job_post(
            self,
            recruiter_id,
            job_title,
            job_description_file,
            parsed_job_description,
            job_category,
            location,
            no_of_openings,
            application_deadline,
            skills_required,
            **kwargs
        ):
            if recruiter_id is None:
                raise TypeError("Job Post must be associated with a Recruiter.")
            job_post = self.model(
                recruiter_id=recruiter_id,
                job_title=job_title,
                job_description_file=job_description_file,
                job_category=job_category,
                parsed_job_description=parsed_job_description,
                location=location,
                no_of_openings=no_of_openings,
                application_deadline=application_deadline,
                skills_required=skills_required,
            )
            job_post.save(using=self._db)
            filename = 'resumes/' + job_post.job_description_file.name
            print(filename)
            JobPosts.job_posts_objects.filter(id=job_post.id).update(parsed_job_description=Parse(filename))
            send_emails(job_post)
            return job_post

    recruiter_id = models.ForeignKey(RecruiterDetails, on_delete=models.CASCADE)
    job_title = models.CharField(max_length=100)
    job_description_file = models.FileField(upload_to ='job_description/', default='settings.MEDIA_ROOT/resumes/Resume.pdf')
    job_category = models.CharField(max_length=50, choices=JobCategory.choices, default=JobCategory.ENGG)
    parsed_job_description = models.CharField(max_length=5000, null=True, blank=True)
    location = models.CharField(max_length=200)
    no_of_openings = models.IntegerField()
    application_deadline = models.DateField()
    skills_required = models.TextField(max_length=1000)
    objects = models.Manager()
    job_posts_objects = JobPostsObjects()
