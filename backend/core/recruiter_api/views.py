from django.shortcuts import render
from rest_framework import generics, viewsets
from core.recruiter.models import RecruiterDetails
from .serializers import RecruiterSerializer


class RecruiterViewSet(viewsets.ModelViewSet):
    queryset = RecruiterDetails.recruiter_objects.all()
    serializer_class = RecruiterSerializer
    http_method_names = ["get", "post", "put", "delete"]
