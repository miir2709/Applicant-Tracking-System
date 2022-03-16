from django.db import models
from core.user.models import User
from core.applicant.models import ApplicantDetails
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.


class EducationDetails(models.Model):
    class EducationObjects(models.Manager):
        def get_queryset(self):
            return super().get_queryset()

        def create_edu_details(
            self,
            applicant_id,
            highest_degree,
            cgpa,
            graduation_year,
            university,
            field_of_study,
            **kwargs
        ):
            if applicant_id is None:
                raise TypeError(
                    "Education details must be associated with an applicant."
                )

            edu_details = self.model(
                applicant_id=applicant_id,
                highest_degree=highest_degree,
                cgpa=cgpa,
                graduation_year=graduation_year,
                university=university,
                field_of_study=field_of_study,
            )
            edu_details.save(using=self._db)

            return edu_details

    applicant_id = models.ForeignKey(ApplicantDetails, on_delete=models.CASCADE)
    DEGREE_CHOICES = [("B", "Bachelors"), ("M", "Masters"), ("P", "Phd")]
    highest_degree = models.CharField(max_length=2, choices=DEGREE_CHOICES, default="B")
    cgpa = models.DecimalField(max_digits=3, decimal_places=2)
    graduation_year = models.IntegerField(
        validators=[MaxValueValidator(3000), MinValueValidator(1900)]
    )
    university = models.CharField(max_length=250)
    field_of_study = models.CharField(max_length=250)
    objects = models.Manager()
    education_objects = EducationObjects()

    def __str__(self):
        return self.highest_degree
