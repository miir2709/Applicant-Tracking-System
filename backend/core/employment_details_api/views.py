from django.shortcuts import render
from rest_framework import generics, viewsets
from core.employment_details.models import EmploymentDetails
from .serializers import EmploymentDetailsSerializer

class EmploymentDetailsViewSet(viewsets.ModelViewSet):
    queryset = EmploymentDetails.employment_details_objects.all()
    serializer_class = EmploymentDetailsSerializer
    http_method_names = ["get", "post", "put"]