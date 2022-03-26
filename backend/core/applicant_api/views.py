from django.shortcuts import render
from rest_framework import generics, viewsets
from core.applicant.models import ApplicantDetails
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from .serializers import ApplicantSerializer


class ApplicantViewSet(viewsets.ModelViewSet):
    queryset = ApplicantDetails.applicant_objects.all()
    serializer_class = ApplicantSerializer
    http_method_names = ["get", "post", "put", "delete"]


class ApplicantByUserViewSet(viewsets.ModelViewSet):
    queryset = ApplicantDetails.applicant_objects.all()
    serializer_class = ApplicantSerializer
    http_method_names = ["get"]

    def retrieve(self, request, *args, **kwargs):
        params = kwargs
        item = get_object_or_404(ApplicantDetails, user_id=params["pk"])
        serializer = self.serializer_class(item)
        return Response(serializer.data)
