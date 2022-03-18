from django.shortcuts import render
from rest_framework import generics, viewsets
from core.job_posts.models import JobPosts
from core.recruiter.models import RecruiterDetails
from .serializers import JobPostsSerializer
from django.shortcuts import get_object_or_404


class JobPostsViewSet(viewsets.ModelViewSet):
    queryset = JobPosts.job_posts_objects.all()
    serializer_class = JobPostsSerializer
    http_method_names = ["get", "post", "put", "delete"]
class JobPostsByRecruiterViewSet(viewsets.ModelViewSet):
    queryset = JobPosts.job_posts_objects.all()
    serializer_class = JobPostsSerializer
    http_method_names = ["get"]

    def get_object(self, queryset=None, **kwargs):
        item = self.kwargs.get("pk")
        return get_object_or_404(JobPosts, recruiter_id=item)


class JobPostsByLocationViewSet(viewsets.ModelViewSet):
    queryset = JobPosts.job_posts_objects.all()
    serializer_class = JobPostsSerializer
    http_method_names = ["get"]

    def get_object(self, queryset=None, **kwargs):
        item = self.kwargs.get("pk")
        return get_object_or_404(JobPosts, location=item)
