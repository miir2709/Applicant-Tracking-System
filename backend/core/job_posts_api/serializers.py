from rest_framework import serializers
from core.job_posts.models import JobPosts
from django.core.exceptions import ObjectDoesNotExist


class JobPostsSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPosts
        fields = (
            "id",
            "recruiter_id",
            "job_title",
            "job_description",
            "location",
            "no_of_openings",
            "application_deadline",
            "skills_required",
        )

    def create(self, validated_data):
        try:
            job_posts = JobPosts.objects.get(
                recruiter_id=validated_data["recruiter_id"]
            )
        except ObjectDoesNotExist:
            job_posts = JobPosts.job_posts_objects.create_job_post(**validated_data)
        return job_posts
