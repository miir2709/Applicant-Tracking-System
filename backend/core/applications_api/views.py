from django.shortcuts import render
from rest_framework import generics, viewsets
from rest_framework.response import Response
from core.applications.models import ApplicationsDetails
from .serializers import ApplicationsSerializer
from django.shortcuts import get_list_or_404, get_object_or_404
from core.applicant.models import ApplicantDetails


class ApplicationsViewSet(viewsets.ModelViewSet):
    queryset = ApplicationsDetails.application_objects.all()
    serializer_class = ApplicationsSerializer
    http_method_names = ["get", "post", "put", "delete"]


class ApplicationsByApplicantViewSet(viewsets.ModelViewSet):
    queryset = ApplicationsDetails.application_objects.all()
    serializer_class = ApplicationsSerializer
    http_method_names = ["get"]

    def retrieve(self, request, *args, **kwargs):
        params = kwargs
        applicant = get_object_or_404(ApplicantDetails, user_id=params["pk"])
        items = ApplicationsDetails.application_objects.filter(
            applicant_id=applicant.id
        )
        serializer = self.serializer_class(items, many=True)
        return Response(serializer.data)


class ApplicationsByJobViewSet(viewsets.ModelViewSet):
    queryset = ApplicationsDetails.application_objects.all()
    serializer_class = ApplicationsSerializer
    http_method_names = ["get"]

    def retrieve(self, request, *args, **kwargs):
        params = kwargs
        items = ApplicationsDetails.application_objects.filter(job_id=params["pk"])
        serializer = self.serializer_class(items, many=True)
        return Response(serializer.data)
