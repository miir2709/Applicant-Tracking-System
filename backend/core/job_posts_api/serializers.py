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
            "job_description_file",
            "job_category",
            "parsed_job_description",
            "location",
            "no_of_openings",
            "application_deadline",
            "skills_required",
            "weightage",
        )
        depth = 1

    def __init__(self, *args, **kwargs):
        super(JobPostsSerializer, self).__init__(*args, **kwargs)
        request = self.context.get("request")
        if request != None and (
            request.method == "POST"
            or request.method == "PUT"
            or request.method == "DELETE"
        ):
            self.Meta.depth = 0
        else:
            self.Meta.depth = 1

    def create(self, validated_data):
        print(validated_data["job_title"])
        print(validated_data)
        job_posts = JobPosts.job_posts_objects.create_job_post(**validated_data)
        return job_posts
