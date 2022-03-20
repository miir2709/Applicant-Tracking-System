from django.db import models
from core.user.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
from core.Resume_Parser.Parser import resume_result_wrapper, process

def Parse(filename):
    text = resume_result_wrapper(filename)
    text = process(text)
    return text


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
            resume,
            job_categories,
            parsed_resume,
            **kwargs
        ):
            if user_id is None:
                raise TypeError(
                    "Education details must be associated with an applicant."
                    )

            applicant_details = self.model(
                user_id=user_id,
                resume=resume,
                job_categories=job_categories,
                parsed_resume=parsed_resume,
            )
            applicant_details.save(using=self._db)
            filename = 'resumes/' + applicant_details.resume.name
            ApplicantDetails.applicant_objects.filter(user_id=applicant_details.user_id).update(parsed_resume=Parse(filename))
            return applicant_details
    
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    resume = models.FileField(upload_to ='resumes/', default='settings.MEDIA_ROOT/resumes/Resume.pdf') # MEDIA_ROOT/resumes
    job_categories = models.CharField(max_length=3, choices=JobCategory.choices, default=JobCategory.ENGG)
    parsed_resume = models.CharField(max_length=10485760, default=None, null=True)
    objects = models.Manager()
    applicant_objects = ApplicantObjects()

    def __str__(self):
        return self.user_id.first_name