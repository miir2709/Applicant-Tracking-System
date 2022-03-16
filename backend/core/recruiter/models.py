from django.db import models
from core.user.models import User
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.
class RecruiterDetails(models.Model):
    class RecruiterObjects(models.Manager):
        def get_queryset(self):
            return super().get_queryset()

        def create_recruiter_details(
            self,
            recruiter_id,
            company_name,
            company_description,
            company_website,
            corporate_address,
            **kwargs
        ):
            if recruiter_id is None:
                raise TypeError("Recruiter details must be associated with a user.")

            recruiter_details = self.model(
                recruiter_id=recruiter_id,
                company_name=company_name,
                company_description=company_description,
                company_website=company_website,
                corporate_address=corporate_address,
            )
            recruiter_details.save(using=self._db)

            return recruiter_details

    recruiter_id = models.ForeignKey(User, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=100)
    company_website = models.URLField(max_length=200, null=True)
    corporate_address = models.TextField(max_length=1000)
    company_description = models.TextField(max_length=500)
    objects = models.Manager()
    recruiter_objects = RecruiterObjects()
