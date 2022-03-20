from django.db import models
from django.db import models
from core.user.models import User
from core.applicant.models import ApplicantDetails
from core.job_posts.models import JobPosts
from django.core.validators import MaxValueValidator, MinValueValidator

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
            )

            application_details.save(using=self._db)
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
    objects = models.Manager()
    application_objects = ApplicationsObjects()

    def __str__(self):
        return self.application_objects
