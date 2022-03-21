from django.db import models
from core.user.models import User
from django.core.validators import MaxValueValidator, MinValueValidator


class ApplicantDetails(models.Model):
    class JobCategory(models.TextChoices):
        ENGG = 'EN', "Engineering"
        SALES = 'SA', "Sales"
        BUSINESS = 'BU', "Business"
        ENTERTAINMENT = "ET","Entertainment"
        FOOD = "F","Food"
        OTHER ="O","Other"
    class ApplicantObjects(models.Manager):
        def get_queryset(self):
            return super().get_queryset()
    
        def create_applicant_details(
            self, 
            user_id,
            job_categories,
            **kwargs
        ):
            if user_id is None:
                raise TypeError(
                    "Education details must be associated with an applicant."
                    )

            applicant_details = self.model(
                user_id=user_id,
                job_categories=job_categories,
            )
            applicant_details.save(using=self._db)
            return applicant_details
    
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    job_categories = models.CharField(max_length=3, choices=JobCategory.choices, default=JobCategory.ENGG)
    objects = models.Manager()
    applicant_objects = ApplicantObjects()

    def __str__(self):
        return self.user_id.first_name