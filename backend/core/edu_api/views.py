from django.shortcuts import render
from rest_framework import generics, viewsets
from core.edu.models import EducationDetails
from .serializers import EducationSerializer
from django.shortcuts import get_object_or_404
from rest_framework.response import Response


class EducationViewSet(viewsets.ModelViewSet):
    queryset = EducationDetails.education_objects.all()
    serializer_class = EducationSerializer
    http_method_names = ["get", "post", "put", "delete"]

class EducationByApplicantViewSet(viewsets.ModelViewSet):
    queryset = EducationDetails.education_objects.all()
    serializer_class = EducationSerializer
    http_method_names = ["get","patch"]

    def retrieve(self, request, *args, **kwargs):
        params = kwargs
        items = get_object_or_404(EducationDetails, applicant_id=params['pk'])
        serializer = self.serializer_class(items)
        return Response(serializer.data)
