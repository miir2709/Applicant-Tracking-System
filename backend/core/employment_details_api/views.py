from django.shortcuts import render
from rest_framework import generics, viewsets
from core.employment_details.models import EmploymentDetails
from .serializers import EmploymentDetailsSerializer
from django.shortcuts import get_object_or_404
from rest_framework.response import Response


class EmploymentDetailsViewSet(viewsets.ModelViewSet):
    queryset = EmploymentDetails.employment_details_objects.all()
    serializer_class = EmploymentDetailsSerializer
    http_method_names = ["get", "post", "put", "delete"]

class EmploymentDetailsByApplicantViewSet(viewsets.ModelViewSet):
    queryset = EmploymentDetails.employment_details_objects.all()
    serializer_class = EmploymentDetailsSerializer
    http_method_names = ["get", "post", "put", "delete"]

    def retrieve(self, request, *args, **kwargs):
        params = kwargs
        items = get_object_or_404(EmploymentDetails, applicant_id=params['pk'])
        serializer = self.serializer_class(items)
        return Response(serializer.data)
