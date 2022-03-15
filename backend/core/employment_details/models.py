from django.db import models
from core.user.models import User
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.

class EmploymentDetails(models.Model):
    class EmploymentDetailsObjects(models.Manager):
        def get_queryset(self):
            return super().get_queryset()

        def create_employment_details(
            self, 
            applicant_id,
            employer_name,
            employment_period,
            job_title,
            **kwargs
        ):
            if applicant_id is None:
                raise TypeError(
                    "Employment details must be associated with an applicant."
                )
            
            employment_details = self.model(
                applicant_id=applicant_id,
                employer_name=employer_name,
                employment_period=employment_period,
                job_title=job_title,
            )
            employment_details.save(using=self._db)

            return employment_details


    applicant_id = models.ForeignKey(User, on_delete=models.CASCADE)
    employer_name = models.CharField(max_length=250)
    employment_period = models.DateField(auto_now=False, auto_now_add=False)
    job_title = models.CharField(max_length=250)
    objects = models.Manager()
    employment_details_objects = EmploymentDetailsObjects()

    def __str__(self):
        return self.job_title