from django.shortcuts import render

# Create your views here.
from rest_framework import generics, viewsets
from core.applications.models import ApplicationsDetails
from .serializers import ApplicationsSerializer

class ApplicationsViewSet(viewsets.ModelViewSet):
    queryset = ApplicationsDetails.application_objects.all()
    serializer_class = ApplicationsSerializer
    http_method_names = ["get", "post", "put", "delete"]
