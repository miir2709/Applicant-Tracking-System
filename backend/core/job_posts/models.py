from django.db import models
from core.recruiter.models import RecruiterDetails
from django.core.validators import MaxValueValidator, MinValueValidator
from core.Resume_Parser.Parser import jd_result_wrapper, process
from core.applicant.models import ApplicantDetails
import smtplib

def send_emails(job_post):
    applicants = ApplicantDetails.applicant_objects.all()
    email_ids = []
    for app in applicants:
        if app.user_id.email in ['kaushikmetha7@gmail.com', 'metkaushik10@gmail.com']:
            email_ids.append(app.user_id.email)
    print(email_ids)
    print(job_post.job_title)
    msg = f"Job Title: {job_post.job_title}\n\nJob Category:  {job_post.job_category} \nLocation:  {job_post.location} \n    Vacancy: {job_post.no_of_openings} \n    Deadline: {job_post.application_deadline}"
    EMAIL_ADDRESS = "c10lyp.ats@gmail.com"
    EMAIL_PASSWORD = "lyproject@10ats"

    with smtplib.SMTP('smtp.gmail.com', 587) as smtp:
        smtp.ehlo()
        smtp.starttls()
        smtp.ehlo()
        smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        smtp.sendmail(EMAIL_ADDRESS, email_ids, msg)


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
            job_description,
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
            parsed_job_description = Parse(job_description)
            job_post = self.model(
                recruiter_id=recruiter_id,
                job_title=job_title,
                job_description=job_description,
                job_category=job_category,
                parsed_job_description=parsed_job_description,
                location=location,
                no_of_openings=no_of_openings,
                application_deadline=application_deadline,
                skills_required=skills_required,
            )
            send_emails(job_post)
            job_post.save(using=self._db)

            return job_post

    recruiter_id = models.ForeignKey(RecruiterDetails, on_delete=models.CASCADE)
    job_title = models.CharField(max_length=100)
    job_description = models.TextField(max_length=5000)
    job_category = models.CharField(max_length=50, choices=JobCategory.choices, default=JobCategory.ENGG)
    parsed_job_description = models.CharField(max_length=5000, null=True, blank=True)
    location = models.CharField(max_length=200)
    no_of_openings = models.IntegerField()
    application_deadline = models.DateField()
    skills_required = models.TextField(max_length=1000)
    objects = models.Manager()
    job_posts_objects = JobPostsObjects()
