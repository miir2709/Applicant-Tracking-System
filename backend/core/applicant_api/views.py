from django.shortcuts import render
from rest_framework import generics, viewsets
from core.applicant.models import ApplicantDetails
from .serializers import ApplicantSerializer


class ApplicantViewSet(viewsets.ModelViewSet):
    queryset = ApplicantDetails.applicant_objects.all()
    serializer_class = ApplicantSerializer
    http_method_names = ["get", "post"]
