from django.db import models
from core.recruiter.models import RecruiterDetails
from django.core.validators import MaxValueValidator, MinValueValidator


class JobPosts(models.Model):
    class JobPostsObjects(models.Manager):
        def get_queryset(self):
            return super().get_queryset()

        def create_job_post(
            self,
            recruiter_id,
            job_title,
            job_description,
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
                job_description=job_description,
                location=location,
                no_of_openings=no_of_openings,
                application_deadline=application_deadline,
                skills_required=skills_required,
            )
            job_post.save(using=self._db)

            return job_post

    recruiter_id = models.ForeignKey(RecruiterDetails, on_delete=models.CASCADE)
    job_title = models.CharField(max_length=100)
    job_description = models.TextField(max_length=500)
    location = models.CharField(max_length=200)
    no_of_openings = models.IntegerField()
    application_deadline = models.DateField()
    skills_required = models.TextField(max_length=1000)
    objects = models.Manager()
    job_posts_objects = JobPostsObjects()
