from django.shortcuts import render
from rest_framework import generics, viewsets
from core.job_posts.models import JobPosts
from .serializers import JobPostsSerializer


class JobPostsViewSet(viewsets.ModelViewSet):
    queryset = JobPosts.job_posts_objects.all()
    serializer_class = JobPostsSerializer
    http_method_names = ["get", "post"]
