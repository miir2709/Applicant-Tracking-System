from django.db import models
from django.db import models
from core.user.models import User
from core.applicant.models import ApplicantDetails
from core.job_posts.models import JobPosts
from django.core.validators import MaxValueValidator, MinValueValidator
from core.Resume_Parser.Parser import resume_result_wrapper, process

def Parse(filename):
    text = resume_result_wrapper(filename)
    text = process(text)
    return text

# Create your models here.


class ApplicationsDetails(models.Model):
    class ApplicationStatus(models.TextChoices):
        APPLIED = "AP", "Applied"
        REVIEW = "RE", "Under Review"
        SCHEDULED = "SC", "Scheduled for Interview"
        ACCEPTED = "AC", "Accepted"
        REJECTED = "RJ", "Rejected"
        PENDING = "PE", "Pending"

    class ApplicationsObjects(models.Manager):
        def get_queryset(self):
            return super().get_queryset()

        def create_application_details(
            self,
            applicant_id,
            job_id,
            similarity_score,
            application_status,
            resume,
            parsed_resume,
            **kwargs
        ):
            if applicant_id is None:
                raise TypeError(
                    "Education details must be associated with an applicant."
                )

            application_details = self.model(
                applicant_id=applicant_id,
                job_id=job_id,
                similarity_score=similarity_score,
                application_status=application_status,
                resume=resume,
                parsed_resume=parsed_resume,
            )

            application_details.save(using=self._db)
            filename = 'resumes/' + application_details.resume.name
            ApplicationsDetails.application_objects.filter(applicant_id=application_details.applicant_id, job_id=job_id).update(parsed_resume=Parse(filename))

            return application_details

    applicant_id = models.ForeignKey(ApplicantDetails, on_delete=models.CASCADE)
    job_id = models.ForeignKey(JobPosts, on_delete=models.CASCADE)
    similarity_score = models.DecimalField(max_digits=10, decimal_places=8)
    application_date_time = models.DateTimeField(auto_now=True)
    application_status = models.CharField(
        max_length=2,
        choices=ApplicationStatus.choices,
        default=ApplicationStatus.APPLIED,
    )
    resume = models.FileField(upload_to ='resumes/', default='settings.MEDIA_ROOT/resumes/Resume.pdf') # MEDIA_ROOT/resumes
    parsed_resume = models.CharField(max_length=10485760, default=None, null=True)
    objects = models.Manager()
    application_objects = ApplicationsObjects()

    def __str__(self):
        return self.application_objects
