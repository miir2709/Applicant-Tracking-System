from django.shortcuts import render
from rest_framework import generics, viewsets
from rest_framework.response import Response
from core.job_posts.models import JobPosts
from core.recruiter.models import RecruiterDetails
from core.recruiter.models import RecruiterDetails
from .serializers import JobPostsSerializer
from django.shortcuts import get_object_or_404, get_list_or_404
import json


class JobPostsViewSet(viewsets.ModelViewSet):
    queryset = JobPosts.job_posts_objects.all()
    serializer_class = JobPostsSerializer
    http_method_names = ["get", "post", "put", "delete"]


class JobPostsByRecruiterViewSet(viewsets.ModelViewSet):
    queryset = JobPosts.job_posts_objects.all()
    serializer_class = JobPostsSerializer
    http_method_names = ["get"]

    def retrieve(self, request, *args, **kwargs):
        params = kwargs
        items = JobPosts.job_posts_objects.filter(recruiter_id=params["pk"])
        serializer = self.serializer_class(items, many=True)
        return Response(serializer.data)


class JobPostsByLocationViewSet(viewsets.ModelViewSet):
    queryset = JobPosts.job_posts_objects.all()
    serializer_class = JobPostsSerializer
    http_method_names = ["get"]

    def retrieve(self, request, *args, **kwargs):
        params = kwargs
        items = JobPosts.job_posts_objects.filter(location=params["pk"])
        serializer = self.serializer_class(items, many=True)
        return Response(serializer.data)


class JobPostsByCompViewSet(viewsets.ModelViewSet):
    queryset = JobPosts.job_posts_objects.all()
    serializer_class = JobPostsSerializer
    http_method_names = ["get"]

    def retrieve(self, request, *args, **kwargs):
        params = kwargs
        recruiter = get_object_or_404(RecruiterDetails, company_name=params["pk"])
        items = JobPosts.job_posts_objects.filter(recruiter_id=recruiter.id)
        serializer = self.serializer_class(items, many=True)
        return Response(serializer.data)
