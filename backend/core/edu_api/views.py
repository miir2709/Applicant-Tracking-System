from django.shortcuts import render
from rest_framework import generics, viewsets
from core.edu.models import EducationDetails
from .serializers import EducationSerializer


class EducationViewSet(viewsets.ModelViewSet):
    queryset = EducationDetails.education_objects.all()
    serializer_class = EducationSerializer
    http_method_names = ["get", "post", "put", "delete"]
